import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';

@Component({
  selector: 'app-tv_mat_espec_video_crop_1',
  templateUrl: './tv_mat_espec_video_crop_1.component.html',
  styleUrls: ['./tv_mat_espec_video_crop_1.component.scss']
})
export class Tv_mat_espec_video_crop_1Component implements OnInit {
  stream_name = "tv_mat_espec_video"
  project_name = "tv_mat_espec_video_202012"
  rtsp_address = "rtsp://admin:patac2016@10.7.93.176:2379"
  vjs_address = ""
  grafana_iframe = [
    {
      "crop_name": "crop_id_main",
      "grafana_iframe_url": "http://10.7.0.115:3000/d-solo/9MoufrJMz/tv_mat_espec_for_video?panelId=2&orgId=1&from=1607658663405&to=1608263463405&tab=general"
    },
    {
      "crop_name": "crop_id_second",
      "grafana_iframe_url": "http://10.7.0.115:3000/d-solo/9MoufrJMz/tv_mat_espec_for_video?panelId=4&orgId=1&from=1607658683378&to=1608263483378&tab=general"
    },
  ]


  constructor(
    private http: HttpserviceService,
  ) { }

  ngOnInit() {
    this.get_hls_address(this.rtsp_address);
  }


  get_hls_address(rtsp_add) {
    this.http.post('/api/rtsp2hls', { 'rtsp_url': this.rtsp_address }, null).subscribe(
      (res) => {
        console.log("test: ", res);
        this.vjs_address = res['value'];
      }
    );
  }

  trackby_grafana_iframe(){
    return JSON.stringify(this.grafana_iframe)
  }

}
