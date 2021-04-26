import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
declare let $;

@Component({
  selector: "ngx-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    var message = [
      "ABC",
      123456,
      1,
      2,
      444,
      "通用设置-第六个说明",
      "2021-4-26",
      "2021-4-26",
    ];
    this.fill_table(message);
  }

  ngOnDestroy() {}

  message = [
    { title: "管理员", element: "input", type: "text", name: "Administrator" },
    {
      title: "管理员密码",
      element: "input",
      type: "text",
      name: "AdministratorPwd",
    },
    { title: "说明", element: "input", type: "text", name: "info1" },
    { title: "说明", element: "input", type: "text", name: "info2" },
    { title: "说明", element: "input", type: "text", name: "info3" },
    { title: "说明", element: "textarea", type: "text", name: "info4" },
    { title: "记录创建时间", element: "", id: "createtime", value: "不可编辑" },
    { title: "记录更新时间", element: "", id: "updatetime", value: "不可编辑" },
  ];

  table_element = [];

  // init table
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

  // 完成 -- 跳转到 摄像头 界面
  complet() {
    console.error("完成 -- 跳转到 摄像头 界面-------->");
    this.route.navigate(["/pages/general_settings/camera/"]);
  }
}
