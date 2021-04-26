/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-04 10:55:43
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-25 14:00:40
 */
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { Test_moduleComponent } from "./test_module/test_module.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { Tv_mat_espec_video_crop_1Component } from "./tv_mat_espec_video_crop_1/tv_mat_espec_video_crop_1.component";
import { NbLoginComponent } from "@nebular/auth";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "test_module",
        // loadChildren: () => import('./test_module/test_module.module')
        //   .then(m => m.Test_moduleModule),
        component: Test_moduleComponent,
      },
      {
        path: "tv_mat_espec_video_crop_1",
        component: Tv_mat_espec_video_crop_1Component,
      },
      {
        path: "video_process",
        // component: Video_processComponent,
        loadChildren: () =>
          import("./video_process/video_process.module").then(
            (m) => m.Video_processModule
          ),
      },
      {
        path: "video-config",
        loadChildren: () =>
          import("./video-config/video-config.module").then(
            (m) => m.VideoConfigModule
          ),
      },
      {
        path: "test-process",
        loadChildren: () =>
          import("./test-process/test-process.module").then(
            (m) => m.TestProcessModule
          ),
      },
      {
        path: "work-bench",
        loadChildren: () =>
          import("./work-bench/work-bench.module").then(
            (m) => m.WorkBenchModule
          ),
      },
      {
        path: "",
        redirectTo: "video_process/stream",
        pathMatch: "full",
      },
      // 通用设置
      {
        path: "general_settings",
        loadChildren: () =>
          import("./general-settings/general-settings.module").then(
            (m) => m.GeneralSettingsModule
          ),
      },
      {
        path: "**",
        component: NbLoginComponent,
      },
      {
        path: "login",
        component: NbLoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
