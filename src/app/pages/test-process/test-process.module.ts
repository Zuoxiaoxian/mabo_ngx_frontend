import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestProcessComponent } from './test-process.component';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { FormsModule as ngFormsModule } from '@angular/forms';

const ROUTER = [
  {
      path: '',
      component: TestProcessComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    ngFormsModule,
    NbSelectModule,
    RouterModule.forChild(ROUTER),
  ],
  declarations: [TestProcessComponent],
  exports:[RouterModule]
})
export class TestProcessModule { }
