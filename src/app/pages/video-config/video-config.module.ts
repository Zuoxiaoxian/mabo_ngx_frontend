import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoConfigComponent } from './video-config.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { VideoDialogComponent } from './dialog/video-dialog/video-dialog.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { VideoServiceService } from './video-service.service';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: VideoConfigComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    NbSelectModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    ngFormsModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    VideoConfigComponent,
    VideoDialogComponent
  ],
  providers:[VideoServiceService],
  exports:[RouterModule]
})
export class VideoConfigModule { }
