

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 13:10:18
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-16 14:50:23
 */
import { Component, OnInit, Input } from
  '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-LinkView',
  templateUrl: './LinkView.component.html',
  styleUrls: ['./LinkView.component.scss']
})


export class LinkViewComponent implements ViewCell, OnInit {
  // public linkText: string;
  // public router_link: string;

  @Input()
  public value;
  public value_isArray;

  @Input()
  rowData: any;


  ngOnInit() {
    // console.log('LinkViewComponent', this.value)
    this.value_isArray = this.isArray()
  }

  isArray(): boolean {
    return !!this.value && this.value.constructor === Array;
  }

}