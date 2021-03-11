

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-10 12:57:54
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-11 14:09:42
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
  public models_setting = {
    hideHeader: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      key: {
        title: 'key',
        type: 'text',
      },
      value: {
        title: 'value',
        type: 'html',
      }
    }
  };
  public models_source: LocalDataSource = new LocalDataSource();
  // 用于展示各个model的详情
  public model_list_setting = {
    mode: 'inline',
    actions: {
      columnTitle: '操作',
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        {
          name: 'viewrecord',
          title: `<i class="fa fa-image">`
        },
      ]
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      model_uuid: {
        title: 'uuid',
        type: 'text',
        sort: true,
        sortDirection: 'asc'
      },
      appear_ts: {
        title: '首次出现',
        type: 'text',
        valuePrepareFunction: (value) => {
          return new Date(value * 1000).toLocaleString()
        },
      },
      latest_classified_ts: {
        title: '最后出现',
        type: 'text',
        valuePrepareFunction: (value) => {
          return new Date(value * 1000).toLocaleString()
        }
      },
      classify_cnt: {
        title: '归类计数',
        type: 'text',
      },
      // img_path: {
      //   title: '模型',
      //   type: 'custom',
      //   filter: false,
      //   renderComponent: ImgShowButtonComponent,
      //   onComponentInitFunction(instance) {
      //     //do stuff with component
      //     instance.subscribe(data=> console.log(data))
      //     }
      // },
    }
  };
  public model_list_source: LocalDataSource = new LocalDataSource();
  public model_list = [];
  public img_url;
  public img_uuid;


  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpserviceService,) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.params['stream_name']
    this.project_name = this.routerInfo.snapshot.params['project_name']
    this.crop_name = this.routerInfo.snapshot.params['crop_name']
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 20000);
    setTimeout(() => {
      this.getHlsAddress();
    }, 1000)
  }

  need_update_funs() {
    this.getStreamBaseInfo();
    this.getModelsInfo();
    this.getModelList();
  }

  getHlsAddress() {
    if (this.rtsp_address) {
      this.http.post('/api/rtsp2hls', { 'rtsp_url': this.rtsp_address }, null).subscribe(
        (res) => {
          this.vjs_address = res['value'];
        }
      );
    }
  }

  getStreamBaseInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name, null).subscribe(
      (res) => {
        this.rtsp_address = res['origin_url'];
        this.current_project_name = res['current_project_name']
      }
    );
  }

  getModelsInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model_info', null).subscribe(
      (res) => {
        // console.log('getModelsInfo:', res)
        this.models_source.empty();
        this.models_source.append({ 'key': '流名', 'value': this.stream_name });
        this.models_source.append({ 'key': '项目名', 'value': this.project_name });
        this.models_source.append({ 'key': '裁片名', 'value': this.crop_name });
        this.models_source.append({ 'key': '长期模型数', 'value': res['permanent_models_idx_cnt'] });
        this.models_source.append({ 'key': '临时模型数', 'value': res['temporary_models_idx_cnt'] });
      }
    );
  }

  getModelList() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/model', null).subscribe(
      (res) => {
        var model_list = res[this.crop_name]
        for (var model_uuid of model_list) {
          if (!(model_uuid in this.model_list)) {
            this.getModelDetail(model_uuid)
            this.model_list.push(model_uuid)
          }
        }
      });
  }

  getModelDetail(model_uuid) {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model/' + model_uuid, null).subscribe(
      (res) => {
        if (res['model_uuid'] == '0') {
          this.setImgUrl(res['image_path'], res['model_uuid'])
        }
        this.model_list_source.append(res)
      });
  }

  setImgUrl(img_path, uuid) {
    this.img_url = '/' + img_path;
    this.img_uuid = uuid
    // console.log('setImgUrl,', 'change path', this.img_url)
  }

  onCustomAction(event) {
    console.log('onCustomAction, action', event.action)
    console.log('onCustomAction, data', event.data)
    if (event.action == 'viewrecord') {
      this.setImgUrl(event.data['image_path'], event.data['model_uuid'])
    }

  }

}
