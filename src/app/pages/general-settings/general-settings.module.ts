import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GeneralSettingsRoutingModule } from "./general-settings-routing.module";
import { GeneralSettingsComponent } from "./general-settings.component";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { CameraComponent } from "./camera/camera.component";

import { Ng2SmartTableModule } from "ng2-smart-table";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  declarations: [GeneralSettingsComponent, CameraComponent, SettingsComponent],
  imports: [
    CommonModule,
    GeneralSettingsRoutingModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
})
export class GeneralSettingsModule {}
