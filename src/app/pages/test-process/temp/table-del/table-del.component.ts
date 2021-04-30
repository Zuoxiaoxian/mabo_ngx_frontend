import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-table-del",
  templateUrl: "./table-del.component.html",
  styleUrls: ["./table-del.component.scss"],
})
export class TableDelComponent implements OnInit {
  @Input() value;
  @Input() rowData;
  @Output() del: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  del_event() {
    this.del.emit(this.rowData);
  }
}
