import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";

@Component({
  selector: "app-table-input",
  templateUrl: "./table-input.component.html",
  styleUrls: ["./table-input.component.scss"],
})
export class TableInputComponent implements OnInit, AfterViewInit {
  @Input() value;
  @Input() rowData;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {}

  edit_event() {
    this.rowData.no = this.value;
    this.edit.emit(this.rowData);
  }
}
