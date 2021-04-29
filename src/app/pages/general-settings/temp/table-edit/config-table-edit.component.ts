import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CameraNewaddComponent } from 'app/pages-popus/pages-popus/camera-newadd/camera-newadd.component';

@Component({
  selector: 'app-config-table-edit',
  templateUrl: './config-table-edit.component.html',
  styleUrls: ['./config-table-edit.component.scss']
})
export class ConfigTableEditComponent implements OnInit {
  @Input() rowData
  @Output() saveEvent:EventEmitter<any> = new EventEmitter();
  constructor(private dialogservice:NbDialogService) { }

  ngOnInit() {
  }

  edit(){
    this.dialogservice.open(CameraNewaddComponent, {
      closeOnBackdropClick: false,
      context: { rowdata: JSON.stringify(this.rowData),type:'edit' },
    }).onClose.subscribe(f=>{
      if(f && f.code == 1){
        this.saveEvent.emit(f);
      }
    })
  }

}
