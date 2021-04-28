import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {
  @Input()body
  constructor(private ref:NbDialogRef<DialogConfirmComponent>) { }

  ngOnInit() {
  }

  save(){
    this.ref.close({code:1})
  }

  dismiss(){
    this.ref.close({code:10})
  }
}
