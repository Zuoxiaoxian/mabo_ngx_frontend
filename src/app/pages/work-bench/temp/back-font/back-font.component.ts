import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-font',
  templateUrl: './back-font.component.html',
  styleUrls: ['./back-font.component.scss']
})
export class BackFontComponent implements OnInit {
  @Input() value;
  constructor() { }

  ngOnInit() {
  }

  getbackcolor(){
    let color = '';
    switch(this.value){
      case '运行':
        color = 'green';
        break;
      case '停止':
        color = 'yellow';
        break;
      case '需要重启':
        color = 'red';
        break;
      case '无法停止':
        color = 'red';
        break;
      case '完全关闭':
        color = '';
        break;
    }
    return {background:color}
  }
}
