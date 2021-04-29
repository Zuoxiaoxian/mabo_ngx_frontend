import { Component, OnInit } from "@angular/core";

import { HttpserviceService } from "app/services/http/httpservice.service";
import { LocalDataSource } from "ng2-smart-table";

import { NbDialogService } from "@nebular/theme";
import { CameraNewaddComponent } from "app/pages-popus/pages-popus/camera-newadd/camera-newadd.component";
import { ConfigTableEditComponent } from "../temp/table-edit/config-table-edit.component";

@Component({
  selector: "ngx-camera",
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
})
export class CameraComponent implements OnInit {
  public setting = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      // add: {
      //   addButtonContent: '<i class="nb-plus"></i>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      //   confirmCreate: false,
      // },
      // edit: {
      //   editButtonContent: '<i class="nb-edit"></i>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true,
      // },
    },
    pager: {
      display: true,
      perPage: 6,
    },
    columns: {
      stream_name: {
        //與data中的欄位一定要對應
        title: "流号",
        type: "stream_name",
      },
      camera_no: {
        //與data中的欄位一定要對應
        title: "编号",
        type: "camera_no",
      },
      test_room: {
        title: "试验室",
        type: "test_room",
      },
      ip_port: {
        title: "IP地址和端口",
        type: "ip_port",
      },
      communication_protocol: {
        title: "通讯协议",
        type: "communication_protocol",
      },
      model: {
        title: "厂家&型号",
        type: "model",
      },
      status: {
        title: "状态",
        type: "status",
      },
      create_time: {
        title: "记录创建时间",
        type: "create_time",
      },
      update_time: {
        title: "记录更新时间",
        type: "update_time",
      },
      update: {
        title: "修改",
        filter:false,
        type: 'custom',
        renderComponent:ConfigTableEditComponent,
        onComponentInitFunction:(instance)=>{
          instance.saveEvent.subscribe((f:any) => {
            if(f.code == 1){
              this.getData();
              alert(f.title);
            }
          }); 
        } 
      },
    },
  };

  public source: LocalDataSource = new LocalDataSource();

  constructor(
    private http: HttpserviceService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getData();
  }

  ngOnDestroy() {}


  // 新建
  add() {
    this.dialogService.open(CameraNewaddComponent, {
      closeOnBackdropClick: false,
      context: { rowdata: JSON.stringify({}),type:'add' },
    }).onClose.subscribe(f=>{
      if(f && f.code == 1){  
        this.getData();
        alert(f.title);
      }
    })
  }

  getData(){
    this.source.empty();
    let param = { 
      'just_empty': 'None'
      // "docker_url":"tcp://192.168.252.129:4243"
     }
    this.http.get('/api/mongo_api/video_process/stream',null).subscribe((f:any)=>{
      console.log(f)
      f = f.map(m=>(
        {
          camera_no: '',
          test_room: "",
          ip_port: "",
          communication_protocol: "",
          model: null,
          status: "",
          create_time: "",
          update_time: "",
          stream_name:m,//唯一 保存
        }
        ));
      this.source.load(f);
      /**
       *  "_id": "601279292d77c23703eb4b57",    # mongodb的_id
    "current_project_name": "camera_test_202012",    # 当前运行中的项目
    "eqpt_no": "camera_test",    # 设备编号
    "init_timeout": 30,            # 初始化超时
    "origin_url": "http://localhost:80/playlist.m3u8",    # 源地址
    "project_list": [        # 此流运行过的所有项目
        "camera_test_202012"
    ],
    "stream_name": "camera_test",    # 流名, 唯一
    "stream_transform": "hls"    # 流源格式
       */
      f.forEach(el => {
        this.http.get(`/api/mongo_api/video_process/stream/${el.stream_name}`,null).subscribe((g:any)=>{
          console.log(g)
          el.ip_port = g.origin_url;
          el.communication_protocol = g.stream_transform;
          el.camera_no = g.eqpt_no;
          // el.camera_no = g.stream_name;


          el.stream_name = g.stream_name;
          //TODO 实验室 厂家 状态 创建事件 记录时间
          this.source.load(f);
        })
      });
      

    });
  }
  

  
}
