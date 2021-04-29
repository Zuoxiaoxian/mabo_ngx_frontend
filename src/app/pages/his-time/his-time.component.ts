import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TableBottonComponent } from '../real-time/table-botton/table-botton.component';

@Component({
  selector: 'app-his-time',
  templateUrl: './his-time.component.html',
  styleUrls: ['./his-time.component.scss']
})
export class HisTimeComponent implements OnInit {
  @ViewChild('video')video:any;
  public org_address = "";
  public org_type = ""
  public vjs_address = "";
  public current_project_name;
  hisVideoParam;
  row;
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
           this.get_hls_address(row);
          });
          // 下载
          instance.downEvent.subscribe(row => {
            console.log('下载')
            var appearTime: string = row['time'];
            var appear_stamp = Date.parse(appearTime) / 1000
            let hisVideoParam = {
              'start_stamp': appear_stamp - 5,
              'end_stamp': appear_stamp + 5,
            }

            this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', hisVideoParam).subscribe(
              (res: {}[]) => {
                if(res['uri']){
                  // window.open(res['uri']);
                  let a = document.createElement('a');
                  a.setAttribute("download", res['uri']);
                  a.setAttribute("href", "");
                  a.click();
                }else{
                  alert('文件找不到了或者已损坏！');
                }
              });
          });
          // 暂停
          instance.stopEvent.subscribe(row => {
            console.log(this.video)
            this.video?.player?.pause()
          })
        }
      },
    }
  }
  video_status = '';//当前video状态
  source : LocalDataSource = new LocalDataSource();
  ab_his_range = {
    'past': '4d',
    'start': 0,
    'end': 0
  }
  constructor(private http:HttpserviceService,
    private activateInfo:ActivatedRoute,
    private dialogService:NbDialogService ) { }


  ngOnInit(): void {
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
          // this.getStreamBaseInfo();
          this.getTask();
        })
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
          res = res.map(m => ({_s:'his',stream:this._.stream,...m}));
          this.source.load(res);
        //   res.forEach((f,i)=>{
        //     var appearTime: string = f['time'];
        //     var appear_stamp = Date.parse(appearTime) / 1000
        //     let hisVideoParam = {
        //       'start_stamp': appear_stamp - 5,
        //       'end_stamp': appear_stamp + 5,
        //     }
        //     let href = '';
        //     this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', hisVideoParam).subscribe(
        //         (g: {}[]) => {
        //           if(g['uri']){
        //             href = g['uri'];
        //           }else{
        //             href  = "";
        //           }
        //           f.href = href;
        //           this.source.load(res);
        //     });
        // })
        }else{
          this.source.load([]);
        }
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
   * 获取任务信息
   */
  getTask(){
    this.http.get(`/api//mongo_api/video_process/stream/${ this._.stream}/project/${this._.name}`
    ,null).subscribe((f:any)=>{
      console.log(f)
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

  get_hls_address(row?){
    console.log('播放')
    var appearTime: string =  null;
    if(row){
      appearTime = row['time'];
      this.row = row;
    }else{
      appearTime = this.row['time'];
    }
    var appear_stamp = Date.parse(appearTime) / 1000
    this.hisVideoParam = {
      'start_stamp': appear_stamp - 5,
      'end_stamp': appear_stamp + 5,
    }

    this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', this.hisVideoParam).subscribe(
      (res: any) => {
        console.log('video_clip:', res)
        if(res.fail){
          this.video_status = res.fail;
        }
        this.vjs_address  = res['uri'] || '';
      });
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
