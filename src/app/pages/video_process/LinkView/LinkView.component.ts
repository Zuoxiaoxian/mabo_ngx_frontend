

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 13:10:18
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-10 10:50:24
 */
import { Component, OnInit, Input } from
  '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-LinkView',
  template: `<li *ngFor="let item of value" >
    <a routerLink="./{{item['router_link'] }}">{{ item['linkText'] }}</a>
  </li>`,
  // styleUrls: ['./LinkView.component.scss']
})


export class LinkViewComponent implements ViewCell, OnInit {
  // public linkText: string;
  // public router_link: string;

  @Input()
  public value;

  @Input()
  rowData: any;


  ngOnInit() {
    console.log('LinkViewComponent', this.value)
    // this.linkText = this.value['linkText'];
    // this.router_link = this.value['router_link'];
    // this.someId = this.value;

  }


}