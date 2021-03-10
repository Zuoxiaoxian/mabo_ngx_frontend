

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-09 12:34:21
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-10 10:07:15
 */
import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { LinkViewComponent } from '../LinkView/LinkView.component'


@Component({
  selector: 'app-BhaModelSimple',
  template:`<ng2-smart-table [settings]="setting" [source]="source"></ng2-smart-table>`,
  styleUrls: ['./BhaModelSimple.component.scss']
})
export class BhaModelSimpleComponent implements OnInit {
  public setting = {
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
      crop_name: {
        title: '裁剪区',
        type: 'custom',
        renderComponent: LinkViewComponent,
      },
      permanent_cnt: {
        title: '长期模型',
        type: 'text',
      },
      temporary_cnt: {
        title: '临时模型',
        type: 'text',
      }
    },
  };
  // public source: LocalDataSource = new LocalDataSource();
  public source: LocalDataSource ;

  @Input()
  public value: string;

  constructor() { }

  ngOnInit() {

    // this.source.empty();
    var data_list = [];
    Object.keys(this.value).forEach((key) => {
      var data = {
        'crop_name': {
          'linkText': key,
          'router_link': key
        },
        'permanent_cnt': this.value[key]['permanent_models_idx_cnt'],
        'temporary_cnt': this.value[key]['temporary_models_idx_cnt'],
      };
      data_list.push(data);
    });
    // this.source.load(data_list)
    console.log('BhaModelSimpleComponent', data_list);
    this.source = new LocalDataSource(data_list);
    console.log('BhaModelSimpleComponent', this.source);
    this.source.refresh()

  }

}
