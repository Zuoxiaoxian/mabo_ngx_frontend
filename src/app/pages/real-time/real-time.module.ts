import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealTimeComponent } from './real-time.component';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RouterModule, Routes } from '@angular/router';
import { VjsPlayerModule } from '../vjs-player/vjs-player.module';
import { DialogTipComponent } from './dialog-tip/dialog-tip.component';
import { DialogVideoComponent } from './dialog-video/dialog-video.component';
import { HisTimeComponent } from '../his-time/his-time.component';
import { TableBottonComponent } from './table-botton/table-botton.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { FormsModule, FormsModule as ngFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


const ROUTES: Routes = [
  {
    path: 'real',
    component: RealTimeComponent,
  },
  {
    path: 'his',
    component: HisTimeComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    Ng2SmartTableModule,
    VjsPlayerModule,
    NbButtonModule,
    NbInputModule,
    RouterModule.forChild(ROUTES),
    ngFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [RealTimeComponent,DialogTipComponent,DialogVideoComponent,HisTimeComponent,TableBottonComponent,DialogConfirmComponent],
  exports:[
    DialogTipComponent,DialogVideoComponent,RealTimeComponent
  ]
})
export class RealTimeModule { }
