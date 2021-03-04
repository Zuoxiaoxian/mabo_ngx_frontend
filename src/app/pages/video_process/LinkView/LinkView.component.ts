

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 13:10:18
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-04 17:17:42
 */
import { Component, OnInit, Input } from
  '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-LinkView',
  template: `<a routerLink="./{{linkText }}">{{ linkText }}</a>`,
  // styleUrls: ['./LinkView.component.scss']
})


export class LinkViewComponent implements ViewCell, OnInit {
  public linkText: string;
  public someId: string;

  @Input()
  public value: string;

  @Input()
  rowData: any;


  ngOnInit() {
    this.linkText = this.value;
    // this.someId = this.value;

  }


}