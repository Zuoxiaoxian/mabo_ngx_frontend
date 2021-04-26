import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesPopusComponent } from "./pages-popus.component";
import { CameraNewaddComponent } from "./camera-newadd/camera-newadd.component";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { CameraTestVideoComponent } from "./camera-test-video/camera-test-video.component";

@NgModule({
  declarations: [
    PagesPopusComponent,
    CameraNewaddComponent,
    CameraTestVideoComponent,
  ],
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule],
})
export class PagesPopusModule {}
