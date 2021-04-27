import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-botton',
  templateUrl: './table-botton.component.html',
  styleUrls: ['./table-botton.component.scss']
})
export class TableBottonComponent implements OnInit {

  @Input() rowData;
  @Output() playEvent:EventEmitter<any> = new EventEmitter();
  @Output() downEvent:EventEmitter<any> = new EventEmitter();
  @Output() stopEvent:EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  play(){
    this.playEvent.emit(this.rowData);
  }


  download(){
    this.downEvent.emit(this.rowData);
  }


  stop(){
    this.stopEvent.emit(this.rowData);
  }

}
