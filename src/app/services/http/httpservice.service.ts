

/*
 * @Author: Zhang Hengye
 * @Date: 2020-12-28 12:31:48
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-08 09:48:09
 */
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

// import { retry } from "rxjs/operators";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  constructor(private http: HttpClient, private router: Router) { }


  // GET
  public get(url: string, headers?: any,) {
    if (headers == null) {
      headers = { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    }
    return new Observable((observe) => {
      this.http.get(url, headers).subscribe((response: any) => {
        observe.next(response)
      },
        error => {
          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^observe^^^^error^^^^^^^^^^^^^^", error, error.status, error.error);

          // this.router.navigate([loginurl])
          var result = {
            msg: error.error,
            status: error.status
          }
          observe.next(result)
        }
      )
    })
  };

  // POST
  public post(url: string, data: any, headers?: any) {
    if (headers == null) {
      headers = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        })
      }
    } else {
      headers = { headers: new HttpHeaders(headers) }
    }
    return new Observable((observe) => {
      this.http.post(url, data, headers).subscribe(
        (response) => {
          observe.next(response)
        },
        error => {
          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^post^^^^error^^^^^^^^^^^^^^", error, error.status, error.error);
          // alert("post请求失败")
          var result = {
            msg: error.error,
            status: error.status
          }
          observe.next(result)
        })
    })
  };



  // 得到语言
  /**
   * name
   */
  public getLanguageID() {
    const language_map_id = {
      "zh-CN": 2052,
      "en-US": 1033
    };
    let currentLang = localStorage.getItem('currentLanguage') ? localStorage.getItem('currentLanguage') : 'zh-CN';
    return language_map_id[currentLang];
  }

}

