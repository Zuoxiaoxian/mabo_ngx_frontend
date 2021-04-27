import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpserviceService } from 'app/services/http/httpservice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { BackFontComponent } from './temp/back-font/back-font.component';
import { LinkComponent } from './temp/link/link.component';

/**
 * 工作台
 */
@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
   project_now = {
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
      taskname:{
        title: '任务名称',
        filter: true,
        type: 'custom',
        renderComponent: LinkComponent,
      },
      stream:{
        title: '摄像头',
        filter: true,
      },
      taskstatus:{
        title: '试验状态',
        filter: true,
        type: 'custom',
        renderComponent: BackFontComponent,
      },
      errornum:{
        title: '异常数量',
        filter: true,
      },
    }
  };

   now_source: LocalDataSource = new LocalDataSource();


  project_his = {
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
      id:{
        title: '任务单编号',
        filter: true,
        type: 'custom',
        renderComponent: LinkComponent,
      },
      name:{
        title: '任务名称',
        filter: true,
      },
      laboratory:{
        title: '试验室',
        filter: true,
      },
      taskstaff:{
        title: '试验人员',
        filter: true,
      },
      stream:{
        title: '摄像头',
        filter: true,
      },
      endtime:{
        title: '结束时间',
        filter: true,
      },
      errornum:{
        title: '异常数量',
        filter: true,
      },
      errorstr:{
        title: '异常描述',
        filter: true,
      },
      report:{
        title: '报告',
        filter: true,
      },
      
    }
  }

   his_source: LocalDataSource = new LocalDataSource();


  constructor(private http:HttpserviceService,private router:Router) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.now_source.empty();
    let param = { 
      'just_empty': 'None'
      // "docker_url":"tcp://192.168.252.129:4243"
     }
    this.http.get('/api/mongo_api/video_process/stream',null).subscribe((f:any)=>{
      let arr = {};
      if(f && f.length >0){
        f.forEach(el => {
          let stream = el;
          if(stream.includes('test')){
            // return;//TODO
          }
          this.http.get(`/api//mongo_api/video_process/stream/${stream}/project`,null).subscribe((g:any)=>{
            g.forEach(ei => {
              this.http.post(`/api/docker_ctrl/video_prc/stream/${stream}/project/${ei}/health`,param
              ).subscribe((h:any)=>{
                console.log(h)
                arr =  {
                  stream:stream,
                  taskname:ei,
                  taskstatus:this.getTaskStatus(h.status) || '-',
                  errornum:'-',
                  _s:'real'
                };
                this.now_source.append(arr);

                this.his_source.append({
                  id:ei,
                  stream:stream,
                  taskname:ei,
                  taskstatus:this.getTaskStatus(h.status) || '-',
                  errornum:'-',
                  _s:'his'
                })
              })
            });
          });
        });
      }
    })
  }


  getTaskStatus(status){
    switch(status){
      case 'running':
        return '运行';
      case 'stopping':
        return '停止';
      case 'restarting':
        return '需要重启';
      case 'block_error':
        return '无法停止';
      case 'stopped':
        return '完全关闭';
    }
  }

  /**
   * 新建实验任务
   */
  createTask(){
    this.router.navigate(['/pages/test-process'])
  }

}
