import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoServiceService {

  constructor() { }

  /**
   * 保存数据
   * @param json 
   * @returns 
   */
  save(json){
    return new Observable(ser=>{
      console.log(json)
      ser.next({code:1})
    })
  }

  /**
   * 获取数据
   * @returns 
   */
  get(){
    return new Observable(ser=>{
      ser.next({code:1})
    })
  }
}
