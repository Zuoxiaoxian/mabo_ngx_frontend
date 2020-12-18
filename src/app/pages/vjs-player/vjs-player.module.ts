

/*
 * @Author: Zhang Hengye
 * @Date: 2020-12-18 10:16:22
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-12-18 10:18:26
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VjsPlayerComponent } from './vjs-player.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [VjsPlayerComponent],
  exports: [
    VjsPlayerComponent,
  ]
})
export class VjsPlayerModule { }
