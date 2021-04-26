import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkBenchComponent } from './work-bench.component';
import { RouterModule, Routes } from '@angular/router';


const ROUTES: Routes = [
  {
    path: '',
    component: WorkBenchComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(ROUTES)
  ],
  declarations: [WorkBenchComponent]
})
export class WorkBenchModule { }
