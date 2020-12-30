

/*
 * @Author: Zhang Hengye
 * @Date: 2020-12-28 12:31:47
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-12-30 13:36:41
 */
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
      "grafana_iframe_url": "http://10.7.0.115:3000/d-solo/9MoufrJMz/tv_mat_espec_for_video?panelId=2&orgId=1&from=now-7d&to=now&tab=general"
    },
    {
      "crop_name": "crop_id_second",
      "grafana_iframe_url": "http://10.7.0.115:3000/d-solo/9MoufrJMz/tv_mat_espec_for_video?panelId=4&orgId=1&from=now-7d&to=now&tab=general"
    },
  ]
  model_list = [
    {
      "model_name": "model_1",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_0_frame_1_crop.jpg",
    },
    {
      "model_name": "model_2",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_2_frame_1568246_crop.jpg",
    },
    {
      "model_name": "model_3",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_3_frame_2090154_crop.jpg",
    },
    {
      "model_name": "model_4",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_4_frame_2090784_crop.jpg"
    },
    {
      "model_name": "model_5",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_5_frame_2192195_crop.jpg"
    },
    {
      "model_name": "model_6",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_6_frame_3675050_crop.jpg"
    },
    {
      "model_name": "model_7",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_7_frame_1346341_crop.jpg"
    },
    {
      "model_name": "model_8",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_8_frame_527190_crop.jpg"
    },
    {
      "model_name": "model_9",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_9_frame_527820_crop.jpg"
    },
    {
      "model_name": "model_10",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_10_frame_1666207_crop.jpg"
    },
    {
      "model_name": "model_11",
      "model_jpg": "http://10.7.0.117:9096/video_cache/tv_mat_espec_video/screen_abnormal/bhanew_bha_folder_20201217/crop_id_main/model/permanent/model_11_frame_1668187_crop.jpg"
    },
  ]
  selectedModel = 0;

  constructor(
    private http: HttpserviceService,
  ) { }

  ngOnInit() {
    this.get_hls_address(this.rtsp_address);
  }

  onSelect(i): void {
    this.selectedModel = i;
  }

  get_hls_address(rtsp_add) {
    this.http.post('/api/rtsp2hls', { 'rtsp_url': this.rtsp_address }, null).subscribe(
      (res) => {
        console.log("test: ", res);
        this.vjs_address = res['value'];
      }
    );
  }

  trackby_grafana_iframe() {
    return JSON.stringify(this.grafana_iframe)
  }

  trackby_model_list() {
    return JSON.stringify(this.model_list)
  }

}
