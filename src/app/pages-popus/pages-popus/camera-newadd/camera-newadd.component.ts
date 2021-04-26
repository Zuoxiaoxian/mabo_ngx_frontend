import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { NbDialogService } from "@nebular/theme";
import { CameraTestVideoComponent } from "../camera-test-video/camera-test-video.component";

declare let $;

@Component({
  selector: "ngx-camera-newadd",
  templateUrl: "./camera-newadd.component.html",
  styleUrls: ["./camera-newadd.component.scss"],
})
export class CameraNewaddComponent implements OnInit {
  @Input() rowdata: any;
  message = [
    { title: "编号", element: "input", type: "text", name: "number" },
    {
      title: "IP地址和端口",
      element: "input",
      type: "text",
      name: "ip_port",
    },
    { title: "试验室", element: "input", type: "text", name: "test_room" },
    {
      title: "通讯协议",
      element: "input",
      type: "text",
      name: "communication_protocol",
    },
    {
      title: "厂家及型号",
      element: "input",
      type: "text",
      name: "factory_model",
    },
    { title: "说明", element: "textarea", type: "text", name: "info" },
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

  table_element = [];

  constructor(
    private dialogRef: NbDialogRef<CameraNewaddComponent>,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    console.error("新增-编辑---摄像头>>>", this.rowdata);
  }

  ngAfterViewInit() {
    var message = [
      "ABC",
      "10.2.3.4:6789",
      "EMC-1",
      "RTSP",
      444,
      "通用设置-第六个说明",
      "2021-4-26",
      "2021-4-26",
    ];
    this.fill_table(message);
  }

  ngOnDestroy() {}

  // × 关闭diallog   及关闭弹框
  closedialog() {
    this.dialogRef.close(false);
  }

  // 填充table
  fill_table(data) {
    this.message.forEach((item, index) => {
      if (item.name) {
        var $item_ = $(item.element + "[name=" + item.name + "]");
        switch (item.element) {
          case "input":
            $item_.val(data[index]);
            break;
          case "textarea":
            $item_ = $(item.element);
            $item_.text(data[index]);
            break;
          default:
            break;
        }
        this.table_element.push($item_);
      } else {
        var $item_ = $("#" + item.id);
        this.table_element.push($item_);
        $item_.text(data[index]);
      }
    });
    console.warn("填充table>>>", this.table_element);
  }

  // 测试-IP地址和端口
  test_ip_port() {
    var $ip_port = $("input[name='ip_port']").val();
    // console.error("测试-IP地址和端口>>", $ip_port);
    this.dialogService.open(CameraTestVideoComponent, {
      closeOnBackdropClick: false,
      context: { ip_port: $ip_port },
    });
  }

  // 完成
  complet() {
    var table_element_val = [];
    this.table_element.forEach((item, index) => {
      if (index < 5) {
        table_element_val.push(item.val());
      } else {
        table_element_val.push(item.text());
      }
    });
    // ["ABC", "10.2.3.4:6789", "EMC-1", "RTSP", "444", "通用设置-第六个说明", "2021-4-26", "2021-4-26"]
    console.error("新增/编辑》》》", table_element_val);
    // 自上而下
    this.dialogRef.close(false);
  }
}
