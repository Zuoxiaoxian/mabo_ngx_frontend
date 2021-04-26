import { Component, OnInit, Input } from "@angular/core";

import { HttpserviceService } from "app/services/http/httpservice.service";
import { NbDialogRef } from "@nebular/theme";
declare let $;

@Component({
  selector: "ngx-camera-test-video",
  templateUrl: "./camera-test-video.component.html",
  styleUrls: ["./camera-test-video.component.scss"],
})
export class CameraTestVideoComponent implements OnInit {
  @Input() ip_port: any;
  constructor(private dialogRef: NbDialogRef<CameraTestVideoComponent>) {}

  ngOnInit(): void {
    console.error("测试摄像头>>>", this.ip_port);
  }

  // × 关闭diallog   及关闭弹框
  closedialog() {
    this.dialogRef.close(false);
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  // 关闭
  shut() {
    this.dialogRef.close(false);
  }
}
