import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesPopusComponent } from "./pages-popus.component";
import { CameraNewaddComponent } from "./camera-newadd/camera-newadd.component";
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from "@nebular/theme";
import { CameraTestVideoComponent } from "./camera-test-video/camera-test-video.component";
import { FormsModule as ngFormsModule } from '@angular/forms';
import { VjsPlayerModule } from "app/pages/vjs-player/vjs-player.module";
@NgModule({
  declarations: [
    PagesPopusComponent,
    CameraNewaddComponent,
    CameraTestVideoComponent,
  ],
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule, NbInputModule,ngFormsModule,VjsPlayerModule],
})
export class PagesPopusModule {}




