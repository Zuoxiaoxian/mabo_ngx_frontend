

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 10:04:50
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-16 13:18:28
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Video_processComponent } from './video_process.component'
import { Stream_pageComponent } from './stream_page/stream_page.component'
import { Source_pageComponent } from "./source_page/source_page.component";
import { BhaCropPageComponent } from "./BhaCropPage/BhaCropPage.component";

const routes: Routes = [{
  path: '',
  // redirectTo: 'stream',
  component: Video_processComponent,
  children: [
    { // 视频源信息,作为根目录
      path: 'stream',
      component: Source_pageComponent,
    },
    { // 改为视频历史信息
      path: 'stream/:stream_name',
      component: Stream_pageComponent,
    },
    { // 这里做两种复用
      // crop为all的时候,为第一种,当前详情,stream-> current_project_name,默认使用
      // crop不为all的时候,为第二种,为具体crop详情
      path: 'stream/:stream_name/project/:project_name/:crop_name/models_info',
      component: BhaCropPageComponent,
    },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Video_processRoutingModule { }


export const routedComponents = [
  Video_processComponent,
  Source_pageComponent,
  Stream_pageComponent,
  BhaCropPageComponent,
];