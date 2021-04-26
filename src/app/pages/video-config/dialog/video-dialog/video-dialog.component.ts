import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {

  @Input()title = '';
  @Input()set content(data){
    if(data){
      this._oldData = JSON.parse(data);
      this._content = JSON.parse(data);
    }
  };
  @Input()type = '';//add 添加  edit 编辑
  @Input()_json:any = {};

  _content:any = {};
  _oldData:any = {};
  msg = '';//提示
  constructor(protected ref: NbDialogRef<VideoDialogComponent>) { }

  ngOnInit() {
  }

  close(item){
    item.data = this._content;
    item.data.value.forEach((el) => {
      el = parseInt(el);
    });
    item.type = this.type;
    item.oldData = this._oldData;
    item._json = this._json;
    this.ref.close(item);
  }

  inputchange(e){
    this.type == 'add'?this.addmsg(e):this.editmsg(e);
  }

  addmsg(e){
    this.msg  = this._json[e]?'当前key已存在':'';
  }

  editmsg(e){
    this.msg  = this._json[e]?'当前key已存在':'';
  }
}
