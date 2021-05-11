import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestProcessComponent } from './test-process.component';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { FormsModule, FormsModule as ngFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableInputComponent } from './temp/table-input/table-input.component';
import { TableEditComponent } from './temp/table-edit/table-edit.component';
import { TableDelComponent } from './temp/table-del/table-del.component';
import { VjsPlayerModule } from '../vjs-player/vjs-player.module';

const ROUTER = [
  {
      path: '',
      component: TestProcessComponent,
  },
  {
      path: 'edit/:stream_name/:project_name',
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
    VjsPlayerModule,
    FormsModule,
    RouterModule.forChild(ROUTER),
    Ng2SmartTableModule,
  ],
  declarations: [TestProcessComponent,TableInputComponent,TableEditComponent,TableDelComponent],
  exports:[RouterModule]
})
export class TestProcessModule { }
