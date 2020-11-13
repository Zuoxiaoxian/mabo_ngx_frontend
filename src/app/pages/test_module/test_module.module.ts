

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-06 12:00:34
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-11-13 10:11:43
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test_moduleComponent } from './test_module.component';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component'

@NgModule({
  imports: [
    CommonModule,
    // VjsPlayerComponent
  ],
  declarations: [Test_moduleComponent, VjsPlayerComponent]
})
export class Test_moduleModule { }
