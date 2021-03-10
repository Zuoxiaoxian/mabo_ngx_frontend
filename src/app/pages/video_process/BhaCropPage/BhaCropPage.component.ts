

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-10 12:57:54
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-10 13:25:37
 */
import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'app-BhaCropPage',
  templateUrl: './BhaCropPage.component.html',
  styleUrls: ['./BhaCropPage.component.scss']
})
export class BhaCropPageComponent implements OnInit {

  public stream_name: string;
  public project_name: string;
  public crop_name: string;
  public timer;
  public rtsp_address = "";
  public vjs_address = "";
  public current_project_name;
  // 用于展示简报
  public models_setting ={};
  public models_source: LocalDataSource = new LocalDataSource();
  // 用于展示各个model的详情
  public model_list_setting ={};
  public model_list_source: LocalDataSource = new LocalDataSource();


  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpserviceService,) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.params['stream_name']
    this.project_name = this.routerInfo.snapshot.params['project_name']
    this.crop_name = this.routerInfo.snapshot.params['crop_name']
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 5000);
    setTimeout(() => {
      this.get_hls_address();
    }, 1000)
  }

  need_update_funs() {
    this.get_stream_base_info();
  }

  get_hls_address() {
    if (this.rtsp_address) {
      this.http.post('/api/rtsp2hls', { 'rtsp_url': this.rtsp_address }, null).subscribe(
        (res) => {
          this.vjs_address = res['value'];
        }
      );
    }
  }

  get_stream_base_info() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name, null).subscribe(
      (res) => {
        this.rtsp_address = res['origin_url'];
        this.current_project_name = res['current_project_name']
      }
    );
  }

}
