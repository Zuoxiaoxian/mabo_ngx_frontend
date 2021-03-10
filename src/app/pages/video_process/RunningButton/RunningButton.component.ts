

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-08 16:35:35
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-08 17:03:01
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-RunningButton',
  // template: `<div class="carto-color-class" [style.background-color]="getStatus()"> </div>`,
  // template: `<nb-icon icon="radio-button-on-outline" [status]="getStatus()"></nb-icon>`,
  template: `<nb-icon icon="radio-button-on-outline" status="success" *ngIf='value'></nb-icon>`,
  styleUrls: ['./RunningButton.component.css']
})
export class RunningButtonComponent implements OnInit {

  @Input() value: boolean;
  constructor() { }
  ngOnInit() { }
  getStatus() {
    if (this.value) {
      return 'success';
    }
    return '';
  }

}
