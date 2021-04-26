import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CameraComponent } from "./camera/camera.component";
import { GeneralSettingsComponent } from "./general-settings.component";

import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  {
    path: "",
    component: GeneralSettingsComponent,
    children: [
      {
        path: "camera",
        component: CameraComponent,
      },
      {
        path: "setting",
        component: SettingsComponent,
      },
      {
        path: "",
        redirectTo: "setting",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSettingsRoutingModule {}
