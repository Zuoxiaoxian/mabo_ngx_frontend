import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss']
})
export class TableEditComponent implements OnInit {
  @Input() value;
  @Input() rowData;

  @Output() edit: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  edit_event(){
    this.edit.emit(this.rowData);
  }
}
