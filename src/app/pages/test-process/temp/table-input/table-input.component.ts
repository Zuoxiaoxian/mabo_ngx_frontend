import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.scss']
})
export class TableInputComponent implements OnInit,AfterViewInit {
  @Input() value;

  constructor() { }
  

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

}
