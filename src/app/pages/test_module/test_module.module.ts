

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-06 12:00:34
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-12-18 10:19:04
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test_moduleComponent } from './test_module.component';
import { VjsPlayerModule } from '../vjs-player/vjs-player.module'

@NgModule({
  imports: [
    CommonModule,
    VjsPlayerModule
  ],
  declarations: [Test_moduleComponent]
})
export class Test_moduleModule { }
