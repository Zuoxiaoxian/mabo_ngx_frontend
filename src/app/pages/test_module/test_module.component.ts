

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-06 12:00:34
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-02 16:29:08
 */


/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-06 12:00:34
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-11-13 10:27:02
 */
import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from 'app/services/http/httpservice.service';


@Component({
  selector: 'app-test_module',
  templateUrl: './test_module.component.html',
  styleUrls: ['./test_module.component.scss']
})

export class Test_moduleComponent {
  loading = false;
  abnormal_model_dict = {};
  // abnormal_model_dict$: Observable<any[]>
  abnormal_model_dict_key = [];
  public timer;

  constructor(
    private http: HttpserviceService,
    // private DPService: DPlayerService
  ) { }

  onResize() {
    console.log('resize');
  }

  ngOnInit(): void {
    // 初始化界面时，检查是否记住密码？
    this.need_update_funs();
    this.timer = setInterval(() => { this.need_update_funs() }, 5000);
    
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  need_update_funs() {
    console.log('update data');
    this.get_abnormal_module();
  }

  // 刷新列表
  get_abnormal_module() {
    this.http.get('/api/ApiTest', null).subscribe(
      (res) => {
        // console.log("test: ", res);
        this.abnormal_model_dict = res;
        this.abnormal_model_dict_key = Object.keys(this.abnormal_model_dict);
      }
    );
  }

  trackBy_abnormal_model_dict() {
    return JSON.stringify(this.abnormal_model_dict);
  }

  // post 尝试
  testpost() {

    // this.http.get('http://desktop-32m721e:2379/api')
    // let opts = {
    //   headers: new HttpHeaders({ "Content-Type": "text/plain" })
    // };
    // this.http.post('http://localhost:2379/api', '\"1234\"', opts).subscribe(
    //   (res) => {
    //     console.log("test: ", res);
    //   }
    // );

    // 尝试 app/json的content-type
    this.http.post('/api/ApiTest', { 'value': '123' }, null).subscribe(
      (res) => {
        console.log("test: ", res);
      }
    );
    console.log("over: ");
  }


}
