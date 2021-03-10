

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-02 10:45:19
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-10 12:58:48
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Video_processRoutingModule, routedComponents } from './video_process-routing.module';
import { LinkViewComponent } from './LinkView/LinkView.component'
import { RunningButtonComponent } from "./RunningButton/RunningButton.component";
import { BhaModelSimpleComponent } from "./BhaModelSimple/BhaModelSimple.component";
import { VjsPlayerModule } from '../vjs-player/vjs-player.module'

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    Video_processRoutingModule,
    VjsPlayerModule,
  ],
  declarations: [
    ...routedComponents,
    LinkViewComponent,
    RunningButtonComponent,
    BhaModelSimpleComponent,
  ],
})
export class Video_processModule { }
