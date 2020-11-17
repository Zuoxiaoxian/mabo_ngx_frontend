

/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-04 10:55:43
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2020-11-17 12:20:54
 */
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { Test_moduleComponent } from './test_module/test_module.component';
// import { VideoBasePageComponent } from './video-base-page/video-base-page.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

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
    // {
    //   path: 'video-base-page',
    //   // loadChildren: () => import('./test_module/test_module.module')
    //   //   .then(m => m.Test_moduleModule),
    //   component: VideoBasePageComponent,
    // },
    {
      path: '',
      redirectTo: 'test_module',
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
