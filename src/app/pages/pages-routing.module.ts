

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-04 10:55:43
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-12-30 13:38:30
 */
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { Test_moduleComponent } from './test_module/test_module.component';
import { VideoBasePageComponent } from './video-base-page/video-base-page.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { Tv_mat_espec_video_crop_1Component } from './tv_mat_espec_video_crop_1/tv_mat_espec_video_crop_1.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'test_module',
      // loadChildren: () => import('./test_module/test_module.module')
      //   .then(m => m.Test_moduleModule),
      component: Test_moduleComponent,
    },
    {
      path: 'tv_mat_espec_video_crop_1',
      // loadChildren: () => import('./test_module/test_module.module')
      //   .then(m => m.Test_moduleModule),
      component: Tv_mat_espec_video_crop_1Component,
    },
    {
      path: 'video-base-page',
      component: VideoBasePageComponent,
    },
    {
      path: '',
      redirectTo: 'tv_mat_espec_video_crop_1',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
