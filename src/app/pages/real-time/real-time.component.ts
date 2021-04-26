import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { DialogTipComponent } from './dialog-tip/dialog-tip.component';

/**
 * 实时观看
 */
@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.scss']
})
export class RealTimeComponent implements OnInit {

  public org_address = "";
  public org_type = ""
  public vjs_address = "";
  public current_project_name;
  _ = {
    stream:'c1',//摄像头编号
    status:'',//当前实验状态
    statusName:'',
    name:'',//项目名称
    no:'',//项目编号
    laboratory:'',//试验室
    taskpeople:'',//试验人员
    taskequip:'',//试验设备
    starttime:'',//开始时间
    endtime:'',//结束时间
  }

  setting = {
    mode: 'inline',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      starttime:{
        title: '开始时间',
        filter: true,
      },
      address:{
        title: '发生区域',
        filter: true,
      },
      video:{
        title: '录像',
        filter: true,
        // type: 'custom',
        // renderComponent: BackFontComponent,
      },
    }
  }
  source : LocalDataSource = new LocalDataSource();
  ab_his_range = {
    'past': '4d',
    'start': 0,
    'end': 0
  }
  constructor(private http:HttpserviceService,
    private activateInfo:ActivatedRoute,
    private dialogService:NbDialogService ) { }

  ngOnInit() {
    /**
     * errornum: "-"
        taskname: "camera_test_202012"
        taskstatus: "-"
        webcam: "camera_test"
     */
    this.activateInfo.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      this._.name = queryParams.taskname||'';
      this._.statusName = queryParams.taskstatus||'';
      this._.stream = queryParams.stream||'';
      this.getHis();
      this.getStreamBaseInfo();
      this.getStatus();
    })
  }

  getStatus(){
    let param = { 
      'just_empty': 'None'
      // "docker_url":"tcp://192.168.252.129:4243"
     }
    this.http.post(`/api/docker_ctrl/video_prc/stream/${this._.stream}/project/${this._.name}/health`,param
    ).subscribe((h:any)=>{
      this._.status = h.status
    });
  }

  /**
   * 获取视频历史
   */
  getHis(){
    var param = {}
      param = {
        'past_range': this.ab_his_range['past']
      };
    this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/project/' + this._.name + '/all/model/all', param).subscribe(
      (res) => {
        console.log(res);
        console.log('Got data')
      });
  }


  /**
   * 视频流地址
   */
  getStreamBaseInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this._.stream, null).subscribe(
      (res) => {
        this.org_address = res['origin_url'];
        this.org_type = res['stream_transform']
        this.current_project_name = res['current_project_name'];
        if (this.org_address) {
          if (this.org_type == 'hls') {
            this.vjs_address = this.org_address;
          } else {
            this.http.post('/api/rtsp2hls', { 'rtsp_url': this.org_address }, null).subscribe(
              (res) => {
                // console.log("test: ", res);
                this.vjs_address = res['value'];
              }
            );
          }
    
        }
      }
    );
  }


  /**
   * 启动视频容器
   * @returns 
   */
  startProc() {
    var r = confirm('即将启动视频处理容器')
    if (!r) {
      return
    }
    console.log('startProc')
    // var param = {
    //   'docker_url': 'tcp://192.168.252.129:4243',
    //   "image": "builded_image"
    // }
    var param = { 'just_empty': 'None' }
    this.http.post('/api/docker_ctrl/video_prc/stream/' + this._.stream + '/project/' + this._.name + '/start', param).subscribe(
      (res: {}) => {
        let context = {};
        if ('success' in res) {
          context = {
            title:'启动成功',
            body:'容器启动成功'
          }
        } else {
          context = {
            title:'启动失败',
            body:'容器启动失败',
          }
        }
        this.dialogService.open(DialogTipComponent, {
          context: context,
        });
      });
  }


  /**
   * 关闭视频容器
   * @returns 
   */
  stopProc() {
    var r = confirm('即将停止视频处理容器')
    if (!r) {
      return
    }
    console.log('stopProc')
    // this.isGettingProcStatus = true;
    // var param = { 'docker_url': 'tcp://192.168.252.129:4243' }
    var param = { 'just_empty': 'None' }
    this.http.post('/api/docker_ctrl/video_prc/stream/' + this._.stream + '/project/' + this._.name + '/stop', param).subscribe(
      (res: {}) => {
        let context = {};
        if ('success' in res) {
          context = {
            title:'关闭成功',
            body:'容器关闭成功'
          }
        } else {
          context = {
            title:'关闭成功',
            body:'容器关闭成功'
          }
        }
        this.dialogService.open(DialogTipComponent, {
          context: context,
        });
      });

  }


  get_hls_address(){
    this.getStreamBaseInfo();
  }

  getwidth(){
    let vido = document.getElementsByClassName('vido');
    return vido[0].scrollWidth;
  }

  getheight(){
    let vido = document.getElementsByClassName('vido');
    return vido[0].scrollHeight - 20;

  }


}
