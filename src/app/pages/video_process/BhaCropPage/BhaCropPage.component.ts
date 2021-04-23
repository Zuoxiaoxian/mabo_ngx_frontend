

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-10 12:57:54
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-22 16:59:29
 */
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
// import { FlatpickrOptions } from 'ng2-flatpickr';
import { ProcessCtrlButtonComponent } from '../ProcessCtrlButton/ProcessCtrlButton.component';
import { LinkViewComponent } from "../LinkView/LinkView.component";
import { NbWindowService } from '@nebular/theme';
import { title } from 'process';


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
        type: 'custom',
        renderComponent: LinkViewComponent,
      }
    }
  };
  public detailCardSource: LocalDataSource = new LocalDataSource();
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
  // public exampleOptions: FlatpickrOptions = {
  //   // defaultDate: '2017-03-15',
  //   enableTime: true,
  //   mode:"range",
  //   allowInput:true,
  //   inline:true,
  // };
  public datePickerOptions = {};
  public datePickerSettings = {
    "retailCalendar": false,
    "timezoneSupport": false,
    "timePicker": true,
    "type": "daily",
    "viewDateFormat": "MMM D, YYYY",
    "placeholder": "Date Time Range",
    "inputDateFormat": "YYYY-MM-DD"
  };
  public selectedDate = {};

  public ab_his_range = {
    'past': '4d',
    'start': 0,
    'end': 0
  };
  public ab_his_selectedMoments = [];
  public abHisAllSetting = {
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
      crop_id: {
        title: '关注区域',
        type: 'custom',
        renderComponent: LinkViewComponent,
        filter: true,
      },
    }

  }

  public abHisCropSetting = {
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
  public videoSaveUri;
  public hisVideoParam = {};
  public hisVideoDescribe = ''
  public selectedMoments = [];
  // 复用判断abHisCropSetting和abHisAllSetting
  public is_all_crop: boolean;
  public hisProjectList;
  // stream分析流运行状态
  public procStatus;
  public procOutput;
  public isProcRunning;
  public isGettingProcStatus = true;
  public procCtrlSetting = {
    hideHeader: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'startProc',
          title: `<i class="fa fa-play" title="play" style="color: green;"></i>`
        },
        {
          name: 'stopProc',
          title: `<i class="fa fa-stop" title="stop" style="color: red;"></i>`
        },
      ]

    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      // showStopButton: {
      //   title: '操作',
      //   type: 'text',
      // },
      status: {
        title: '状况',
        type: 'text',
      },
      Output: {
        title: '详情',
        type: 'text',
      }
    }

  }
  public procCtrlSource: LocalDataSource = new LocalDataSource();
  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  // 临近告警
  public nearlyAbPast = '1m'
  @ViewChild('nearlyAbTemplate') nearlyAbTemplate: TemplateRef<any>;

  @ViewChild('history_vjs') his_vjs: ElementRef;

  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpserviceService,
    private windowService: NbWindowService) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.params['stream_name']
    this.project_name = this.routerInfo.snapshot.params['project_name']
    this.hisProjectList = [{
      'linkText': '历史项目信息',
      'router_link': '../../../../'
    }]

    this.getVideoSaveUri();
    this.getStreamBaseInfo();
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 30000);
    this.timer = setInterval(() => { this.getNearlyAb() }, 5000);
    this.routerInfo.params.subscribe(() => { this.when_router_change() })
    setTimeout(() => {
      this.getHlsAddress();
    }, 10000)
  }

  when_router_change() {
    // 清空model列表, 并关闭isShowModelDetail
    this.model_list = []
    this.model_list_source.empty()
    this.isShowModelDetail = false
    // 其它需要更新的项目
    this.need_update_funs()
  }

  need_update_funs() {
    this.crop_name = this.routerInfo.snapshot.params['crop_name']
    if (this.crop_name == 'all') {
      this.is_all_crop = true
    } else {
      this.is_all_crop = false
    }
    console.log('update page data')
    // 根据是否是关注页详情,重新加载内容
    this.getProcStatus()
    if (this.is_all_crop) {
      this.getAllCropInfo();
    } else {
      this.getCropInfo();
    }
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

  getAllCropInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name, null).subscribe(
      (res) => {
        this.detailCardSource.empty();
        this.detailCardSource.append({ 'key': '项目名', 'value': res['project_name'] });
        this.detailCardSource.append({ 'key': '开始时间', 'value': 'Placeholder' });
        this.detailCardSource.append({ 'key': '结束时间', 'value': 'Placeholder' });
        // 各个crop列表
        if (res["models_info"] !== undefined) {
          var cropLinks = [];
          for (var cropKey in res["models_info"]) {
            var link_info = {
              'linkText': cropKey,
              'router_link': '../../' + cropKey + '/models_info'
            };
            cropLinks.push(link_info)
          }
          this.detailCardSource.append({ 'key': '关注区域详情:', 'value': cropLinks });
        }
      }
    )
  }

  getCropInfo() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model_info', null).subscribe(
      (res) => {
        // console.log('getCropInfo:', res)
        this.detailCardSource.empty();
        this.detailCardSource.append({ 'key': '流名', 'value': this.stream_name });
        this.detailCardSource.append({ 'key': '项目名', 'value': this.project_name });
        this.detailCardSource.append({ 'key': '裁片名', 'value': this.crop_name });
        this.detailCardSource.append({ 'key': '长期模型数', 'value': res['permanent_models_idx_cnt'] });
        this.detailCardSource.append({ 'key': '临时模型数', 'value': res['temporary_models_idx_cnt'] });
        var link_info = [{
          'linkText': 'all',
          'router_link': '../../' + 'all' + '/models_info'
        }];
        this.detailCardSource.append({ 'key': '返回all详情', 'value': link_info });
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


  closedAbHisSpy() {
    this.ab_his_range = {
      'past': null,
      'start': this.ab_his_selectedMoments[0].getTime() * 1000000,
      'end': this.ab_his_selectedMoments[1].getTime() * 1000000
    };
    this.getAbHistory()

  }

  getPastRange(past_str: string) {
    // smhd
    var start = new Date();
    var end = new Date();
    var unit = past_str.substr(past_str.length - 1);
    var range = parseInt(past_str.substr(0, past_str.length - 1));
    console.log('past_str: ' + past_str)
    switch (unit) {
      case 's':
        start.setDate(end.getSeconds() - range);
        break;
      case 'm':
        start.setDate(end.getMinutes() - range);
        break;
      case 'h':
        start.setDate(end.getHours() - range);
        break;
      case 'd':
        start.setDate(end.getDate() - range);
        break;
    }
    this.ab_his_selectedMoments[0] = start;
    this.ab_his_selectedMoments[1] = end;

  }

  getAbHistory() {
    var param = {}
    if (this.ab_his_range['past']) {
      param = {
        'past_range': this.ab_his_range['past']
      };
      this.getPastRange(this.ab_his_range['past'])
      this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model/change_past', param).subscribe(
        (res: {}[]) => {
          console.log('Got data')
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
          console.log('Got data')
          this.ab_history_source.load(res)
        });
    }
  }

  onCustomActionHistory(event) {
    // console.log('onCustomAction, action', event.action)
    // console.log('onCustomAction, data', event.data)
    if (event.action == 'getVideoClip') {
      var data = event.data
      var appearTime: string = data['time'];
      var appear_stamp = Date.parse(appearTime) / 1000
      this.hisVideoParam = {
        'start_stamp': appear_stamp - 60,
        'end_stamp': appear_stamp + 60,
      }
      this.isLoadingHisVideoRes = true;
      this.history_video_res.length = 0;
      var start = new Date(this.hisVideoParam['start_stamp'] * 1000)
      var end = new Date(this.hisVideoParam['end_stamp'] * 1000)
      this.selectedMoments = [start, end]
      this.getVideoClip()
    }
  }

  getVideoClip() {
    console.log('ready to set data', this.hisVideoParam)
    this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/video_clip', this.hisVideoParam).subscribe(
      (res: {}[]) => {
        console.log('video_clip:', res)
        this.history_video_res.push(res);
        this.isLoadingHisVideoRes = false
      });
    this.getHisVideoParamDescription()
  }

  getHisVideoParamDescription() {
    var start = new Date(this.hisVideoParam['start_stamp'] * 1000)
    var end = new Date(this.hisVideoParam['end_stamp'] * 1000)
    this.hisVideoDescribe = 'From [ ' + start.toLocaleString() + ' ] To [ ' + end.toLocaleString() + ' ], ' + Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  clear_history_video_res() {
    this.history_video_res = [];
    this.selectedMoments = [];
  }

  getVideoSaveUri() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/video_save_addr').subscribe(
      (res) => {
        this.videoSaveUri = res['uri']
      });


  }

  closedSpy() {
    console.log(this.selectedMoments)
    console.log('start stamp: ' + this.selectedMoments[0].getTime())
    console.log('end stamp: ' + this.selectedMoments[1].getTime())
    this.hisVideoParam = {
      'start_stamp': this.selectedMoments[0].getTime() / 1000,
      'end_stamp': this.selectedMoments[1].getTime(),
    };
    this.isLoadingHisVideoRes = true;
    this.history_video_res.length = 0;
    this.getVideoClip()
  }

  getProcStatus() {
    this.isGettingProcStatus = true;
    this.procCtrlSource.empty()
    // var param = { 'docker_url': 'tcp://192.168.252.129:4243' }
    var param = { 'just_empty': 'None' }
    this.http.post('/api/docker_ctrl/video_prc/stream/' + this.stream_name + '/project/' + this.project_name + '/health', param).subscribe(
      (res: {}) => {
        if ('success' in res) {
          this.procStatus = res['status'];
          this.procOutput = res['output'];
        } else {
          this.procStatus = '获取容器信息失败';
          this.procOutput = res['fail']
        }

        var data = {
          'status': this.procStatus,
          'Output': this.procOutput
        }
        if (this.procStatus === 'running') {
          data['showStopButton'] = true
        } else {
          data['showStopButton'] = false
        }
        this.procCtrlSource.load([data])
        this.isGettingProcStatus = false
      });
  }

  startProc() {
    var r = confirm('即将启动视频处理容器')
    if (!r) {
      return
    }
    console.log('startProc')
    this.isGettingProcStatus = true;
    // var param = {
    //   'docker_url': 'tcp://192.168.252.129:4243',
    //   "image": "builded_image"
    // }
    var param = { 'just_empty': 'None' }
    this.http.post('/api/docker_ctrl/video_prc/stream/' + this.stream_name + '/project/' + this.project_name + '/start', param).subscribe(
      (res: {}) => {
        if ('success' in res) {
          this.alertWithNoBlock('提示', 'Container, ' + res['name'] + ', started, status: ' + res['status'])
        } else {
          this.alertWithNoBlock('提示', 'Container,  start fail, message: ' + res['fail'])
        }
        this.getProcStatus()
      });
  }

  stopProc() {
    var r = confirm('即将停止视频处理容器')
    if (!r) {
      return
    }
    console.log('stopProc')
    this.isGettingProcStatus = true;
    // var param = { 'docker_url': 'tcp://192.168.252.129:4243' }
    var param = { 'just_empty': 'None' }
    this.http.post('/api/docker_ctrl/video_prc/stream/' + this.stream_name + '/project/' + this.project_name + '/stop', param).subscribe(
      (res: {}) => {
        if ('success' in res) {
          this.alertWithNoBlock('提示', 'Container stopped, status: ' + res['status'] + ' ,output: ' + res['output'])
        } else {
          this.alertWithNoBlock('提示', 'Container,  start fail, message: ' + res['fail'])
        }
        this.getProcStatus()
      });

  }

  onCustomActionProcCtrl(event) {
    // console.log('onCustomAction, action', event.action)
    // console.log('onCustomAction, data', event.data)
    if (event.action == 'startProc') {
      this.startProc()

    }
    if (event.action == 'stopProc') {
      this.stopProc()
    }

  }

  alertWithNoBlock(title_a: string, message_a: string) {
    this.windowService.open(
      this.contentTemplate, {
      title: title_a,
      context: { text: message_a }
    })
  }

  getNearlyAb() {
    var param = {
      'past_range': this.nearlyAbPast
    };
    this.http.post('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + this.project_name + '/' + this.crop_name + '/model/change_past', param).subscribe(
      (res: {}[]) => {
        if (res.length >= 1) {
          console.log('存在超过一个得异常')
          this.windowService.open(
            this.nearlyAbTemplate, {
            title: '异常告警',
            context: { text: '过去' + this.nearlyAbPast + '存在异常, 请检查.' }
          })
        }
      });

  }

}
