

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-02 10:45:19
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-20 11:36:18
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule,NbWindowModule  } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Video_processRoutingModule, routedComponents } from './video_process-routing.module';
import { LinkViewComponent } from './LinkView/LinkView.component'
import { RunningButtonComponent } from "./RunningButton/RunningButton.component";
import { BhaModelSimpleComponent } from "./BhaModelSimple/BhaModelSimple.component";
import { VjsPlayerModule } from '../vjs-player/vjs-player.module'
// import { Ng2FlatpickrModule } from 'ng2-flatpickr';
// import { NgxDatetimeRangePickerModule } from "ngx-datetime-range-picker";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from "@angular/forms";
import { ProcessCtrlButtonComponent } from './ProcessCtrlButton/ProcessCtrlButton.component'


@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbWindowModule.forRoot(),
    Ng2SmartTableModule,
    Video_processRoutingModule,
    VjsPlayerModule,
    // Ng2FlatpickrModule,
    // NgxDatetimeRangePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
  ],
  declarations: [
    ...routedComponents,
    LinkViewComponent,
    RunningButtonComponent,
    BhaModelSimpleComponent,
    ProcessCtrlButtonComponent
  ],
})
export class Video_processModule { }
