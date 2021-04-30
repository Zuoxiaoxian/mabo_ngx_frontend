import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpserviceService } from 'app/services/http/httpservice.service';

@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.scss']
})
export class DialogVideoComponent implements OnInit {
  @Input() set  title(data){
    if(data){
      this._title = new Date(Date.parse(data)).toLocaleString()
    }
  };
  @Input() body: any;
  @Input() _: any;
  _title
  vjs_address;
  hisVideoParam;
  constructor(protected ref: NbDialogRef<DialogVideoComponent>,private http:HttpserviceService) {}

  ngOnInit() {
    this.getData();
    
  }


  dismiss(){
    this.ref.close()
  }

  getData(){
    var appearTime: string = this.body['time'];
    var appear_stamp = Date.parse(appearTime) / 1000
    this.hisVideoParam = {
      'start_stamp': appear_stamp - 5,
      'end_stamp': appear_stamp + 5,
    }

    this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', this.hisVideoParam).subscribe(
      (res: {}[]) => {
        this.vjs_address  = res['uri'] || '';
        console.log('video_clip:', this.vjs_address)
      });
  }

  save(){
    
  }


  //重写获取视频地址
  get_hls_address(){
    this.getData();
  }

}
