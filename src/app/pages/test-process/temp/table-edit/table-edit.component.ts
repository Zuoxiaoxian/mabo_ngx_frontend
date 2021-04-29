import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss']
})
export class TableEditComponent implements OnInit {
  @Input() value:any;
  @Input() rowData;

  @Output() edit: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  edit_event(){
    this.rowData.address = this.value;
    this.edit.emit(this.rowData);
  }
}
