import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    number:"123",//设备编号
    peopel:"123",//试验人员
    project_name:"123",//项目名称
    equipment:"123",//试验设备
    laboratory:"实验室1",//实验室
    webcam:"",//摄像头
    check_model:'BaseCheck',//检测方式
    crop_mode:'None',//裁剪模式 默认None  manual
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
    private http:HttpserviceService
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
    }
    console.log(this.test_info);
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
    
    return this.source.getFilter();
  }
}
