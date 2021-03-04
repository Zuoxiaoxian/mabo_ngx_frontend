

/*
 * @Author: Zhang Hengye
 * @Date: 2021-03-02 10:45:19
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-03-04 17:05:00
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Video_processRoutingModule, routedComponents } from './video_process-routing.module';
import { LinkViewComponent } from './LinkView/LinkView.component'


@NgModule({
  imports: [
    CommonModule,
    // RouterModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    Video_processRoutingModule
    // LinkViewComponent,
  ],
  declarations: [
    ...routedComponents,
    LinkViewComponent,
  ],
})
export class Video_processModule { }
