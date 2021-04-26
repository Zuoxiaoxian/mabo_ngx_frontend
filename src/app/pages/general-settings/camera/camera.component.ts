import { Component, OnInit } from "@angular/core";

import { HttpserviceService } from "app/services/http/httpservice.service";
import { LocalDataSource } from "ng2-smart-table";

import { NbDialogService } from "@nebular/theme";
import { CameraNewaddComponent } from "app/pages-popus/pages-popus/camera-newadd/camera-newadd.component";

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
      perPage: 10,
    },
    columns: {
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
    },
  };

  public source: LocalDataSource = new LocalDataSource();

  constructor(
    private http: HttpserviceService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.fill_table();
  }

  ngOnDestroy() {}

  // 填充 table
  fill_table() {
    var message = [
      {
        camera_no: "ABC",
        test_room: "EMC-1",
        ip_port: "10.2.3.4:6721",
        communication_protocol: "RTSP",
        model: null,
        status: "离线/监测中Idle",
        create_time: "2021-4-22 09:40:50",
        update_time: "2021-4-22 09:40:50",
      },
      {
        camera_no: "ABD",
        test_room: "EMC-1",
        ip_port: "10.2.3.4:6721",
        communication_protocol: "RTSP",
        model: null,
        status: "离线/监测中Idle",
        create_time: "2021-4-22 09:40:50",
        update_time: "2021-4-22 09:40:50",
      },
    ];

    this.source.load(message);
  }

  // 新建
  add() {
    this.dialogService.open(CameraNewaddComponent, {
      closeOnBackdropClick: false,
      context: { rowdata: [] },
    });
  }
}
