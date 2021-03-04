

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 10:04:08
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-04 15:28:23
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-stream_page',
  templateUrl: './stream_page.component.html',
  styleUrls: ['./stream_page.component.scss']
})
export class Stream_pageComponent implements OnInit {

  private  stream_name:string;
  constructor(private routerInfo:ActivatedRoute) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.queryParams['stream_name']
  }

}
