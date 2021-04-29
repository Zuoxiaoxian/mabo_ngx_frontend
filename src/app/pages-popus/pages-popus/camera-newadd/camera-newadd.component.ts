import { Component, OnInit, Input, ChangeDetectionStrategy } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NbDialogService } from "@nebular/theme";
import { HttpserviceService } from "app/services/http/httpservice.service";
import { CameraTestVideoComponent } from "../camera-test-video/camera-test-video.component";

declare let $;

@Component({
  selector: "ngx-camera-newadd",
  templateUrl: "./camera-newadd.component.html",
  styleUrls: ["./camera-newadd.component.scss"],
  changeDetection:ChangeDetectionStrategy.Default
})
export class CameraNewaddComponent implements OnInit {
  _rowData;
  @Input() set rowdata(data){
    if(data){
      let _data = JSON.parse(data);
      this._rowData = _data;
      if(_data.camera_no){

        this.message[0].value = _data.camera_no;
        this.message[1].value = _data.ip_port;
        this.message[2].value = _data.test_room;
        this.message[3].value = _data.communication_protocol;
        this.message[4].value = _data.model;
        this.message[5].value = _data.description || '';//TODO 说明
        this.message[6].value = _data.create_time || '不可编辑';
        this.message[6].value = _data.update_time || '不可编辑';
      }
    }
  };
  
  @Input() type:any;
  message = [
    { title: "编号", element: "input", type: "text", name: "number",value:'',mustRecord:true },
    {
      title: "IP地址和端口",
      element: "input",
      type: "text",
      name: "ip_port",
      value:'' ,
      mustRecord:true 
    },
    { title: "试验室", element: "input", type: "text", name: "test_room" ,value:'' },
    {
      title: "通讯协议",
      element: "input",
      type: "text",
      name: "communication_protocol",
      value:'',
      mustRecord:true 
    },
    {
      title: "厂家及型号",
      element: "input",
      type: "text",
      name: "factory_model",
      value:'',
    },
    { title: "说明", element: "textarea", type: "text", name: "info" ,value:''},
    {
      title: "记录创建时间",
      element: "",
      id: "addcreatetime",
      value: "不可编辑",
    },
    {
      title: "记录更新时间",
      element: "",
      id: "addupdatetime",
      value: "不可编辑",
    },
  ];
  load = true;

  table_element = [];

  stream_name ;//流号

  constructor(
    private dialogRef: NbDialogRef<CameraNewaddComponent>,
    private dialogService: NbDialogService,
    private http:HttpserviceService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    
    
  }

  ngOnDestroy() {}

  // × 关闭diallog   及关闭弹框
  closedialog() {
    this.dialogRef.close({code:0});
  }

  // 填充table
  fill_table(data) {
    this.message.forEach((item, index) => {
      item.value = data[index];

    //   if (item.name) {
    //     var $item_ = $(item.element + "[name=" + item.name + "]");
    //     switch (item.element) {
    //       case "input":
    //         // $item_.val(data[index]);
    //         item.value = data[index];
    //         break;
    //       case "textarea":
    //         // $item_ = $(item.element);
    //         // $item_.text(data[index]);
    //         item.value = data[index];
    //         break;
    //       default:
    //         break;
    //     }
    //     this.table_element.push($item_);
    //   } else {
    //     var $item_ = $("#" + item.id);
    //     this.table_element.push($item_);
    //     $item_.text(data[index]);
    //   }
    });
    // console.warn("填充table>>>", this.table_element);
  }

  // 测试-IP地址和端口
  test_ip_port() {
    // console.error("测试-IP地址和端口>>", $ip_port);
    this.dialogService.open(CameraTestVideoComponent, {
      closeOnBackdropClick: false,
      context: { ip_port: this.message[1].value },
    });
  }

  // 完成
  complet() {
    if(this.isMustRecord()){
      alert('有必录项未填')
      return;
    }
    // var table_element_val = [];
    // this.table_element.forEach((item, index) => {
    //   if (index < 5) {
    //     table_element_val.push(item.val());
    //   } else {
    //     table_element_val.push(item.text());
    //   }
    // });
    // // ["ABC", "10.2.3.4:6789", "EMC-1", "RTSP", "444", "通用设置-第六个说明", "2021-4-26", "2021-4-26"]
    // console.error("新增/编辑》》》", table_element_val);
    switch(this.type){
      case 'add':
        this.add();
        break;
      case 'edit':
        this.edit();
        break;
    }
    // 自上而下
    
  }


  /**
   * 检查必录项
   */
  isMustRecord(){
    if(!this.stream_name){
      return true;
    }
    for(let item of this.message){
      if(item.mustRecord && !item.value){
        return true;
      }
    }
    return false;
  }

  add(){
    this.http.post('/api/mongo_api/video_process/stream/config',{
      "eqpt_no": this.message[0].value,
      "origin_url": this.message[1].value,
      "stream_name": this.stream_name,
      "stream_transform": this.message[3].value
    }).subscribe(f=>{
      if(f['success']){
        this.dialogRef.close({code:1,title:'新增成功'});
      }else{
        alert(f['error']||'');
      }
    })

  }

  edit(){
    // this.http.get(`/api/mongo_api/video_process/stream/${this._rowData.stream_name}`,null).subscribe((g:any)=>{
      this.http.post('/api/mongo_api/video_process/stream/change',{
        "eqpt_no": this.message[0].value,
        "origin_url": this.message[1].value,
        "stream_name": this._rowData.stream_name,
        "stream_transform": this.message[3].value
      }).subscribe(f=>{
        console.log(f);
        if(f['success']){
          this.dialogRef.close({code:1,title:'编辑成功'});
        }else{
          alert(f['error']||'');
        }
      })
    // })
  }
}
