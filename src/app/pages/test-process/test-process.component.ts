import { Component, OnInit } from '@angular/core';

/**
 * 试验配置与新增
 */
@Component({
  selector: 'app-test-process',
  templateUrl: './test-process.component.html',
  styleUrls: ['./test-process.component.scss']
})
export class TestProcessComponent implements OnInit {
  public vjs_address = "blob:http://localhost:4200/1098152f-0d2e-4891-b006-998caea6b7da";

  test_info = {
    number:"123",//设备编号
    peopel:"123",//试验人员
    name:"123",//项目名称
    equipment:"123",//试验设备
    laboratory:"实验室1",//实验室
    webcam:"摄像头1",//摄像头
  }

  headerlist = [
    {
      name:'编号',
      key:'no'
    },
    {
      name:'位置',
      key:'address'
    },
    {
      name:'说明',
      key:'description'
    }
  ]
  bodylist = [
    {
      no:'',
      address:'',
      description:'',
    }

  ];
  constructor() { }

  ngOnInit() {
  }


  get_hls_address(){

  }
}
