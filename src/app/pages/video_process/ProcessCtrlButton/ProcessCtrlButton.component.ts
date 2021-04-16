

/*
 * @Author: Zhang Hengye
 * @Date: 2021-04-16 09:28:09
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-16 14:45:17
 */
import { Component, Input, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';


@Component({
  selector: 'app-ProcessCtrlButton',
  templateUrl: './ProcessCtrlButton.component.html',
  styleUrls: ['./ProcessCtrlButton.component.scss']
})
export class ProcessCtrlButtonComponent implements OnInit {
  @Input() is_show: boolean;
  @Input() stream_name: string;
  @Input() project_name: string;
  @Input() is_running: boolean;

  constructor() { }

  ngOnInit() {
  }

}
