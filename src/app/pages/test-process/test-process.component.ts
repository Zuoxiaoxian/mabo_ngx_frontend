import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TableDelComponent } from './temp/table-del/table-del.component';
import { TableEditComponent } from './temp/table-edit/table-edit.component';
import { TableInputComponent } from './temp/table-input/table-input.component';

/**
 * 试验配置与新增
 */
@Component({
  selector: 'app-test-process',
  templateUrl: './test-process.component.html',
  styleUrls: ['./test-process.component.scss']
})
export class TestProcessComponent implements OnInit,AfterViewInit {
  public org_address = "";
  public org_type = ""
  public vjs_address = "";
  public current_project_name;

  test_info = {
    number:"123",//任务单编号
    peopel:"123",//试验人员
    project_name:"123",//任务名称
    equipment:"123",//试验设备
    laboratory:"实验室1",//实验室
    webcam:"",//摄像头
    check_model:'BaseCheck',//检测方式
    crop_mode:'None',//裁剪模式 默认None  manual
    crop_mode_arr:{},
    crop_mode_description:{},// 裁剪方式说明
  }

  setting = {
    mode: 'inline',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 2
    },
    columns: {
      no:{
        title: '名称',
        filter: false,
        width:'20%',
        type: 'custom',
        renderComponent:TableInputComponent
      },
      address:{
        title: '位置',
        filter: false,
        width:'20%',
        type: 'custom',
        renderComponent:TableEditComponent,
        onComponentInitFunction:(instance)=>{
          instance.edit.subscribe(row => {
            // TODO 进行图像画框
          })
        }
      },
      description:{
        title: '说明',
        filter: false,
        width:'60%',
        type: 'custom',
        renderComponent:TableDelComponent,
        onComponentInitFunction:(instance)=>{
          instance.del.subscribe(row => {
            this.source.remove(row);
          })
        }
      },

    }
  }
  source: LocalDataSource = new LocalDataSource();

  webcamList = [];
  constructor(
    private http:HttpserviceService,
    private router:Router
  ) { }
 

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getStream();
  }


  get_hls_address(){
    this.getVideoAddress();
  }

  save(){
    if(this.source.count() > 0){
       this.test_info.crop_mode = 'manual';
       new Array(this.source).forEach((el:any)=>{
         el.data.forEach(f => {
           this.test_info.crop_mode_arr[f.no] = f.address;
           this.test_info.crop_mode_description[f.no] = f.description;
         });
       })
    }else{
      this.test_info.crop_mode = 'None';
      this.test_info.crop_mode_arr = {};
      this.test_info.crop_mode_description = {};
    }
    console.log(this.test_info);
    let str =`/api/mongo_api/video_process/stream/${this.test_info.webcam}/config`;
    let json = this.getparam();
    console.log(JSON.stringify(json));
    this.http.post(str,json).subscribe((f:any)=>{
      if(f.success){
        this.router.navigate(['/pages/video/real',{
          stream:this.test_info.webcam,
          taskname:this.test_info.project_name,
          taskstatus: '',
          errornum:'',
          _s:'real'
        }])
      }else{
        alert("保存失败！");  
      }
    })
  }


  //切换摄像机
  changeWebcam(e){
    console.log(e);
    this.test_info.webcam = e;
    this.getVideoAddress();
  }

  //获取摄像头
  getStream(){
    this.http.get('/api/mongo_api/video_process/stream',null).subscribe((f:any)=>{
      this.test_info.webcam = f && f.length>0?f[0]:'';
      this.webcamList= f;
      this.getVideoAddress();
    });
  }

  getVideoAddress(){
    this.http.get('/api/mongo_api/video_process/stream/' + this.test_info.webcam, null).subscribe(
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


  getwidth(){
    let vido = document.getElementsByClassName('row_vido');
    return vido[0].scrollWidth - 420;
  }

  getheight(){
    let vido = document.getElementsByClassName('row_vido');
    return vido[0].scrollHeight - 20;

  }

  keyup(e,value){
    // console.log(e);
    // console.log(value.match(/[a-zA-Z0-9_]{1,}/g))
    //只允许输入英文数字下划线
    this.test_info.project_name = value.match(/[a-zA-Z0-9_]{1,}/g).join('');
  }

  /**
   * 添加裁剪的数据
   */
  add(){
    this.source.prepend(
      {
        no:this.source.count(),
        address:[1,1,1,2],
        description:'beizhu',
      },
    );
    console.log(this.source)
  }

  back(){
    window.history.back();
  }

  getarr=()=>{
    let arr = []
    new Array(this.source).forEach((f:any)=>{
      arr.push(f.data)
    });
    return arr;
  }

  getparam(){
    return {
      "project_name": this.test_info.project_name, // ※ 项目名, 与下面video_sources的current_project_name相同
      "crop_setting": { // ※ 关注区域设置
          "crop_mode": this.test_info.crop_mode, // ※ 剪裁模式,默认为None, manual时需要配置 manual_box
          "manual_box": this.test_info.crop_mode_arr // ※ 剪裁范围,manual_box为列表形式, 可以任意添加（有个参数可以设定上限）
               // ※ [用户自己定义的名字],四个int类型参数, 分别为 (x_min, y_min, x_max, y_max)
                 
          // (x_min, y_min, x_max, y_max), img[y_min:y_max, x_min:x_max]
      },
      "stream_adjust": { // ※ 待机画面调整
          "standby": {
              "no_signal_wait": 3, // ※ 无信号超时, 默认60
              /*
              ※ 检查方式：
                  BaseCheck: 默认, 无其它额外判定
                  image_check: 通过对比图像来判断是否开启, （暂不开放, 注释掉. ）
                  encoder_check: 通过获取encoder的参数判断是否开启
              */
              "check_model": this.test_info.check_model,
              // ※ encoder_check 模式时配置
              "api_addr": "http://10.7.94.203:2379", // ※ encoder http的配置
              "auth": { // ※ encoder 登陆信息
                  "user": "admin",
                  "pass": "admin"
              }
          },
      },
      "consumer_plugin": { // ※ 图像分析插件配置, 字典型, 暂时开发了两种子模块：save、screen_abnormal
          "save": { // ※ 不进行具体配置, 只做enable、disable的判断. enable传递save键值的空{}, disable 时consumer_plugin中没save键值
          },
          "screen_abnormal": { // ※ 视频异常配置项目
              "detect_setting": { // ※ bha模型检测. 
                  // 动态检测, 判断前几帧与当前帧的帧间差值, 判断是否存在改变
                  "dynamic_setting": { // ※ 动态检测
                      "dynamic_thresh": 25, // ※ 动态阈值, 默认 25
                      "min_area": 15000 // ※ 检测变化后最小面积, 默认 15000
                  },
                  "report_setting": { // ※ 异常上报配置
                      "measurement": this.test_info.webcam, // ※ 异常表格
                  }
              }
          }
      },
      "task":{
        number:this.test_info.number,//任务单编号
        peopel:this.test_info.peopel,//试验人员
        equipment:this.test_info.equipment,//试验设备
        laboratory:this.test_info.laboratory,//实验室
        webcam:this.test_info.webcam,//摄像头
        crop_mode_description: this.test_info.crop_mode_description
      }
      // this.test_info
  }
  }
}
