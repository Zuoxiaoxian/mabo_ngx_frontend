import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogTipComponent } from './dialog-tip/dialog-tip.component';
import { DialogVideoComponent } from './dialog-video/dialog-video.component';
import { TableBottonComponent } from './table-botton/table-botton.component';
declare var $
/**
 * 实时观看
 */
@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.scss']
})
export class RealTimeComponent implements OnInit {
  videoInterval = 5;//异常历史视频上下区间
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
    detection:'',//侦测区域
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
      perPage: 6
    },
    columns: {
      time:{
        title: '开始时间',
        filter: true,
        valuePrepareFunction:(value) => {
          let str = new Date(Date.parse(value)).toLocaleString()
          return str;
        },
        sort: true,
        sortDirection: 'desc'
      },
      crop_id:{
        title: '发生区域',
        filter: true,
      },
      video:{
        title: '录像',
        filter: true,
        type: 'custom',
        renderComponent: TableBottonComponent,
        onComponentInitFunction:(instance)=>{
          // 播放
          instance.playEvent.subscribe(row => {
            console.log('弹窗播放')
            this.dialogService.open(
              DialogVideoComponent,
              {
                context:{
                  body:row,
                  title:row.time,
                  _:this._,
                  videoInterval:this.videoInterval
                }
              }
            );
          });
          // 下载
          instance.downEvent.subscribe(row => {
            
           
            // downloadMp3("http://192.168.3.110:81/edited_cache/camera_test_1616480095.954_1616480215.954.mp4");
            // this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', hisVideoParam).subscribe(
              // (res: {}[]) => {
                // if(res['uri']){
                 
                // }else{
                  // alert('文件找不到了或者已损坏！');
                // }
              // });
          });
        }
      },
    }
  }
  source : LocalDataSource = new LocalDataSource();
  ab_his_range = {
    'past': '4d',
    'start': 0,
    'end': 0
  }

  public selectedMoments = [];
  public ab_his_selectedMoments = [];
  videoSaveUri  = '';
  timer;
  constructor(private http:HttpserviceService,
    private activateInfo:ActivatedRoute,
    private dialogService:NbDialogService,
    private router :Router ) { }
// 下载服务器的MP3文件

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
      this.getTask();
      this.getVideoSaveUri();
      let i = 0;
      this.timer = setInterval(()=>{
        if(i%15 == 0){
          this.getHis();
        }
        // this.getStreamBaseInfo();
        if(i%5 == 0){
          this.getTask();
        }
        if(i%2 == 0){
          this.getStatus();
          this.getNearlyAb();
        }
        i++;
      },1000)
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
      (res:any[]) => {
        console.log(res);
        if(Array.isArray(res)){
          res = res.map(f=>({stream:this._.stream,...f}));
          this.source.load(res);
        }else{
          this.source.load([]);
        }
      });

  }

  hisVideoParam;
  /**
   *  监听选择的时间改变并保存
   */
  closedSpy() {
    console.log(this.selectedMoments)
    console.log('start stamp: ' + this.selectedMoments[0].getTime())
    console.log('end stamp: ' + this.selectedMoments[1].getTime())
    this.hisVideoParam = {
      'start_stamp': this.selectedMoments[0].getTime() / 1000,
      'end_stamp': this.selectedMoments[1].getTime(),
    };
  }

  openVideo(){
    this.dialogService.open(
      DialogVideoComponent,
      {
        context:{
          _:this._,
          hisVideoParam:this.hisVideoParam
        }
      }
    );
  }

  getVideoSaveUri() {
    this.http.get('/api/mongo_api/video_process/stream/' + this._.stream + '/video_save_addr').subscribe(
      (res) => {
        this.videoSaveUri = res['uri']
      });


  }

  /**
   * 获取任务信息
   */
  getTask(){
    this.http.get(`/api//mongo_api/video_process/stream/${ this._.stream}/project/${this._.name}`
    ,null).subscribe((f:any)=>{
      // console.log(f)
      if(f.task){
        let task = f.task;
        this._.stream = task.webcam||'';//
        this._.laboratory = task.laboratory||'';//
        this._.taskpeople = task.peopel||'';//
        this._.taskequip = task.equipment||'';//
        this._.no = task.number||'';//
        this._.name = f.project_name || '';
        //TODO开始时间，结束时间
      }
      if(f.crop_setting && f.crop_setting.crop_mode == "manual"){
        this._.detection = Object.keys(f.crop_setting.manual_box).join(',');
      }
    })
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

// 临近告警
  public nearlyAbPast = '10s'
  errorTip = false;
  getNearlyAb() {
    var param = {
      'past_range': this.nearlyAbPast
    };
    this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/project/' + this._.name + '/all/model/change_past', param).subscribe(
      (res: {}[]) => {
        if (res.length >= 1) {
          console.log('存在超过一个得异常')
          // this.windowService.open(
          //   this.nearlyAbTemplate, {
          //   title: '异常告警',
          //   context: { text: '过去' + this.nearlyAbPast + '存在异常, 请检查.' }
          // })
          if(!this.errorTip){
            this.errorTip = true;
            this.dialogService.open(DialogTipComponent, {
              context: {
                title:'异常提示',
                body:'过去' + this.nearlyAbPast + '存在异常, 请检查.'
              },
            }).onClose.subscribe(f=>{
              this.errorTip = false;
              //查询历史记录
              this.getHis();
            })
          }
        }
      });

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
  stopProc(s) {

    this.dialogService.open(DialogConfirmComponent, {
      context: {
        body:`是否${s}容器？`
      },
    }).onClose.subscribe(f=>{
      console.log(f)
      if(f && f.code == 1){
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
    })
    // this.isGettingProcStatus = true;
    // var param = { 'docker_url': 'tcp://192.168.252.129:4243' }
    

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

  go_back(){
    this.router.navigate(['/pages/work-bench'])
  }

  ngOnDestroy() {
    clearInterval(this.timer); 
  }

}