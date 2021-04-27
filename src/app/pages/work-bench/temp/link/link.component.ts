import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {
  @Input()value;

  @Input()
  rowData: any;

  constructor() { }

  ngOnInit() {
    // console.log(this.rowData)
  }

}
