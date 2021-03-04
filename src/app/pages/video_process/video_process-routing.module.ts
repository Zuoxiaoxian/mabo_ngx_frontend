

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-04 10:04:50
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-04 17:14:37
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Video_processComponent } from './video_process.component'
import { Stream_pageComponent } from './stream_page/stream_page.component'
import { Source_pageComponent } from "./source_page/source_page.component";

const routes: Routes = [{
  path: '',
  // redirectTo: 'stream',
  component: Video_processComponent,
  children: [
    {
      path: 'stream',
      component: Source_pageComponent,
    },
    {
      path: 'stream/:stream_name',
      component: Stream_pageComponent,
    }
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
];