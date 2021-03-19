

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 10:04:08
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-18 14:22:40
 */
import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { LinkViewComponent } from '../LinkView/LinkView.component'
import { RunningButtonComponent } from "../RunningButton/RunningButton.component";
// import { BhaModelSimpleComponent } from "../BhaModelSimple/BhaModelSimple.component";


@Component({
  selector: 'app-stream_page',
  templateUrl: './stream_page.component.html',
  styleUrls: ['./stream_page.component.scss']
})
export class Stream_pageComponent implements OnInit {

  public stream_name: string;
  public stream_detail;
  public timer;
  public current_project_name;
  public project_list = [];
  public project_details = [];
  public org_address = "";
  public org_type = ""
  public vjs_address = "";

  public setting = {
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
    },
  };
  public source: LocalDataSource = new LocalDataSource();

  public project_setting = {
    mode: 'inline',
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
      is_running_project: {
        title: '当前运行',
        filter: false,
        type: 'custom',
        renderComponent: RunningButtonComponent,
      },
      project_name: {
        title: '项目名',
        type: 'text',
      },
      consumer_str: {
        title: '加载插件',
        type: 'text',
        filter: false,
      },
      start_time: {
        title: '开始',
        type: 'text',
        filter: false,
      },
      end_time: {
        title: '结束',
        type: 'text',
        filter: false,
      },
      // // 2021-03-09 zhy: 这玩意不会刷新, 嵌套加载的话, 内容刷不出来
      // // https://github.com/akveo/ng2-smart-table/issues/511
      // bha_models_info: {
      //   title: 'bha模型简报',
      //   type: 'custom',
      //   filter: false,
      //   renderComponent: BhaModelSimpleComponent,
      // },
      bha_crop_name: {
        title: 'bha_裁剪',
        type: 'custom',
        renderComponent: LinkViewComponent,
        filter: false,
      },
      bha_permanent_cnt: {
        title: 'bha_长期模型数',
        type: 'html',
        filter: false,
      },
      bha_temporary_cnt: {
        title: 'bha_临时模型数',
        type: 'html',
        filter: false,
      },

    }
  };

  public project_source: LocalDataSource = new LocalDataSource();

  public show_detail = [];

  public tmp_bha_model_info;
  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpserviceService,) { }

  ngOnInit() {
    this.stream_name = this.routerInfo.snapshot.params['stream_name']
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 5000);
    setTimeout(() => {
      this.getHlsAddress();
    }, 1000)
  }

  need_update_funs() {
    this.get_stream_base_info();
    this.get_stream_details();
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

  get_stream_base_info() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name, null).subscribe(
      (res) => {
        this.org_address = res['origin_url'];
        this.org_type = res['stream_transform']
        var url_format = '<a href="' + this.org_address + '">Rtsp Link</a>';
        this.source.empty();
        this.source.append({ 'key': '源地址', 'value': url_format });
        this.current_project_name = res['current_project_name']
        this.source.append({ 'key': '当前项目', 'value': res['current_project_name'] });
        this.source.append({ 'key': 'eqpt_no', 'value': res['eqpt_no'] });
        // console.log("project infos: ", this.project_details);
      }
    );
  }

  get_stream_details() {
    this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project', null).subscribe(
      (res) => {
        // console.log("got project, ", this.stream_name, ", project list: ", res);
        this.get_project_info(res);
        // console.log("project infos: ", this.project_details);
      }
    );


  }

  get_project_info(project_list, is_update = false) {
    project_list.forEach((project_name, i) => {
      if (this.project_list.includes(project_name) == false || is_update != false) {
        this.http.get('/api/mongo_api/video_process/stream/' + this.stream_name + '/project/' + project_name, null).subscribe(
          (res) => {
            // console.log("got project, ", project_name, ", project_info: ", res);
            var project_hash = {}
            this.project_details.push(res);
            this.project_list.push(project_name);
            var consumer_str = ''
            var consumer_plugin = res['consumer_plugin']
            for (var key in consumer_plugin) {
              consumer_str += consumer_plugin[key]['plugin_class'].replace("ConsumerPlugin", "")
              consumer_str += ', '
            }
            project_hash['consumer_str'] = consumer_str
            project_hash['project_name'] = res['project_name']
            var is_running = false;
            if (res['project_name'] == this.current_project_name) {
              is_running = true
            }
            project_hash['is_running_project'] = is_running;
            project_hash['start_time'] = 'placeholder';
            project_hash['end_time'] = 'placeholder';
            if (res["models_info"] !== undefined) {
              project_hash['bha_crop_name'] = []
              project_hash['bha_permanent_cnt'] = ''
              project_hash['bha_temporary_cnt'] = ''
              for (var models_key in res["models_info"]) {
                var link_info = {
                  'linkText': models_key,
                  'router_link': '/project/' + this.current_project_name + '/' + models_key + '/models_info'
                };
                project_hash['bha_crop_name'].push(link_info)
                project_hash['bha_permanent_cnt'] += `<li>` + res["models_info"][models_key]["permanent_models_idx_cnt"] + `</li>`
                project_hash['bha_temporary_cnt'] += `<li>` + res["models_info"][models_key]["temporary_models_idx_cnt"] + `</li>`
              }
            };
            console.log('project_hash: ', project_hash);
            this.project_source.append(project_hash);
            this.tmp_bha_model_info = res['models_info'];
            // this.project_source.refresh()
          }
        );
      }
    });
  }



}
