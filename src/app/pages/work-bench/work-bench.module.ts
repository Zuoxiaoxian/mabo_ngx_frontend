import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkBenchComponent } from './work-bench.component';
import { RouterModule, Routes } from '@angular/router';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LinkComponent } from './temp/link/link.component';
import { BackFontComponent } from './temp/back-font/back-font.component';


const ROUTES: Routes = [
  {
    path: '',
    component: WorkBenchComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbButtonModule,
    RouterModule.forChild(ROUTES),
  ],
  declarations: [WorkBenchComponent,LinkComponent,BackFontComponent]
})
export class WorkBenchModule { }
