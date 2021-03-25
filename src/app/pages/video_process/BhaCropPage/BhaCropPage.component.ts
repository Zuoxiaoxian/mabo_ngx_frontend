

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-10 12:57:54
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-25 16:53:17
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FlatpickrOptions } from 'ng2-flatpickr';

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
  public org_address = "";
  public org_type = ""
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
  // 用于展示模型详情
  public isShowModelDetail = false;


  // 用于展示历史异常列表
  public exampleOptions: FlatpickrOptions = {
    defaultDate: '2017-03-15'
  };
  public ab_his_range = {
    'past': '3d',
    'start': '123',
    'end': '234'
  };
  public ab_history_setting = {
    mode: 'inline',
    actions: {
      columnTitle: '操作',
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        {
          name: 'getVideoClip',
          title: `<i class="fa fa-video"></i>`
        },
      ]
    },
    pager: {
      display: true,
      perPage: 6
    },
    columns: {
      time: {
        title: '出现时间(tz: ' + Intl.DateTimeFormat().resolvedOptions().timeZone + ')',
        type: 'text',
        valuePrepareFunction: (value) => {
          //讲道理啊,这种转换形式,非常吃藕
          value = new Date(Date.parse(value)).toLocaleString()
          return value
        },
        sort: true,
        sortDirection: 'desc'
      },
      bha_model_idx: {
        title: '当前模型序号',
        type: 'text',
      },
      dynamic_sum_area: {
        title: '动态区域和',
        type: 'text',
      },

    }
  };
  public ab_history_source: LocalDataSource = new LocalDataSource();
  public history_video_res = []; // 做成list 以方便ngfor
  public isLoadingHisVideoRes = false;
  public allVideoUri;
  public hisVideoParam = {};


  @ViewChild('history_vjs') his_vjs: ElementRef;

  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpserviceService,) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.params['stream_name']
    this.project_name = this.routerInfo.snapshot.params['project_name']
    this.crop_name = this.routerInfo.snapshot.params['crop_name']
    this.getAllVideoIndex()
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 20000);
    setTimeout(() => {
      this.getHlsAddress();
    }, 1000)
  }

  need_update_funs() {
    console.log('update page data')
    this.getStreamBaseInfo();
    this.getModelsInfo();
    this.getAbHistory();
    if (this.isShowModelDetail) {
      this.getModelList();
    }
  }

  getHlsAddress() {
    if (this.org_address) {
      if (this.org_type == 'hls') {
        this.vjs_address = this.org_address;
      } else {
        this.http.post('/api/rtsp2hls', { 'rtsp_url': this.org_address }, null).subscribe(
          (res) => {
            // console.log("test: ", res);
            this.vjs_address = res['value'];
          }
        );
      }

    }
  }

  getStreamBaseInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name, null).subscribe(
      (res) => {
        this.org_address = res['origin_url'];
        this.org_type = res['stream_transform']
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
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model', null).subscribe(
      (res: string[]) => {
        for (var model_uuid of res) {
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
    // console.log('onCustomAction, action', event.action)
    // console.log('onCustomAction, data', event.data)
    if (event.action == 'viewrecord') {
      this.setImgUrl(event.data['image_path'], event.data['model_uuid'])
    }

  }

  changeShowModelDetail() {
    this.isShowModelDetail = !this.isShowModelDetail;
    if (this.isShowModelDetail) {
      this.getModelList();
    }
  }

  getAbHistory() {
    var param = {}
    if (this.ab_his_range['past']) {
      param = {
        'past_range': this.ab_his_range['past']
      };
      this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model/change_past', param).subscribe(
        (res: {}[]) => {
          this.ab_history_source.load(res)
        });
    } else {
      param = {
        "time_range": {
          'start': this.ab_his_range['start'],
          'end': this.ab_his_range['end'],
        }
      };
      this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model/change_range', param).subscribe(
        (res: {}[]) => {
          this.ab_history_source.load(res)
        });
    }
  }



  onCustomActionHistory(event) {
    // console.log('onCustomAction, action', event.action)
    // console.log('onCustomAction, data', event.data)
    if (event.action == 'getVideoClip') {
      this.getVideoClip(event.data)
    }
  }

  getVideoClip(data) {
    var appearTime: string = data['time'];
    var appear_stamp = Date.parse(appearTime) / 1000
    this.hisVideoParam = {
      'start_stamp': appear_stamp - 60,
      'end_stamp': appear_stamp + 60,
    }
    this.isLoadingHisVideoRes = true;
    this.history_video_res.length = 0;
    this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/video_clip', this.hisVideoParam).subscribe(
      (res: {}[]) => {
        console.log('video_clip:', res)
        this.history_video_res.push(res);
        this.isLoadingHisVideoRes = false
      });
  }

  getHisVideoParamDescription() {
    var start = new Date(this.hisVideoParam['start_stamp'] * 1000).toLocaleString()
    var end = new Date(this.hisVideoParam['end_stamp'] * 1000).toLocaleString()
    return 'From [ ' + start + ' ] To [ ' + end + ' ], ' + Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  clear_history_video_res() {
    this.history_video_res = [];
  }

  getAllVideoIndex() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/video_save_addr').subscribe(
      (res) => {
        this.allVideoUri = res['uri']
      });


  }

}
