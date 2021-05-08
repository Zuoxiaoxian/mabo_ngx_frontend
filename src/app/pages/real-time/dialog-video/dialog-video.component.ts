import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpserviceService } from 'app/services/http/httpservice.service';

@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.scss']
})
export class DialogVideoComponent implements OnInit  {
  @Input() set  title(data){
    if(data){
      this._title = new Date(Date.parse(data)).toLocaleString()
    }
  };
  @Input() body: any;
  @Input() _: any;
  @Input() hisVideoParam:any;//当有值的时候为自定义时间
  @Input() videoInterval = 5;
  _title
  vjs_address;
  @ViewChild('video')video:any
  constructor(protected ref: NbDialogRef<DialogVideoComponent>,private http:HttpserviceService) {}
  
  ngOnInit() {
    this.getData();
    
  }

  dismiss(){
    this.ref.close()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  getData(){
    if(this.hisVideoParam){
      console.log('ready to set data', this.hisVideoParam)
      this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', this.hisVideoParam).subscribe(
        (res: {}[]) => {
          console.log('video_clip:', res)
          this.vjs_address  = res['uri'] || '';
        });
    }else{
      this.vjs_address = '';
      var appearTime: string = this.body['time'];
      var appear_stamp = Date.parse(appearTime) / 1000
      let hisVideoParam = {
        'start_stamp': appear_stamp - this.videoInterval,
        'end_stamp': appear_stamp + this.videoInterval,
      }
  
      this.http.post('/api/mongo_api/video_process/stream/' + this._.stream + '/video_clip', hisVideoParam).subscribe(
        (res: {}[]) => {
          this.vjs_address  = res['uri'] || '';
          console.log('video_clip:', this.vjs_address)
        });
    }
  }

  save(){
    
  }


  //重写获取视频地址
  get_hls_address(){
    this.getData();
  }

}
