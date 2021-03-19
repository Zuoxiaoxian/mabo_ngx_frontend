

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-02 10:45:19
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-16 12:39:31
 */
import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { LinkViewComponent } from '../LinkView/LinkView.component'

@Component({
  selector: 'app-source_page',
  templateUrl: './source_page.component.html',
  styleUrls: ['./source_page.component.scss']
})
export class Source_pageComponent implements OnInit {


  public stream_list: string[];
  public stream_details = [];
  public stream_details_keys = [];

  public timer;
  public setting = {
    actions: {
      add: false,
      edit: false,
      delete: false
      // add: {
      //   addButtonContent: '<i class="nb-plus"></i>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      //   confirmCreate: false,
      // },
      // edit: {
      //   editButtonContent: '<i class="nb-edit"></i>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true,
      // },
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      stream_name: {   //與data中的欄位一定要對應
        title: '视频流名',
        type: 'custom',
        renderComponent: LinkViewComponent,
      },
      eqpt_no: {
        title: 'eqpt_no'
      },
      current_project_name: {
        title: '运行中的项目'
      },
      stream_transform: {
        title: '源格式'
      },
    }
  };

  public source: LocalDataSource = new LocalDataSource();


  constructor(
    private http: HttpserviceService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 5000);
  }

  need_update_funs() {
    console.log('update data');
    this.get_stream_list();
  }

  get_stream_list(is_update: boolean = false) {
    this.http.get('/api/mongo_api/video_process/stream', null).subscribe(
      (res) => {
        this.stream_list = res as string[];
        // got stream detail
        this.stream_list.forEach((stream_name, i) => {
          if (this.stream_details_keys.includes(stream_name) == false || is_update != false) {
            this.get_stream_details(stream_name);
          }
        });
        console.log(JSON.stringify(this.stream_details));
      }
    );
  }

  get_stream_details(stream_name) {
    this.http.get('/api/mongo_api/video_process/stream/' + stream_name, null).subscribe(
      (res) => {
        console.log("got stream, ", stream_name, ", stream_info: ", res);
        stream_name = res['stream_name']
        // https://stackoverflow.com/questions/52522317/how-to-add-hyperlink-in-ng2-smart-table-in-angular6
        // res['stream_name'] = '<a href=stream/' + stream_name + ' >' + stream_name + '</a>'
        res['stream_name'] = [{
          'linkText': stream_name,
          'router_link': stream_name
        }]
        this.stream_details.push(res);
        this.stream_details_keys.push(stream_name);
        this.source.load(this.stream_details);
      }
    );
  }
}
