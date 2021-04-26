import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog-tip',
  templateUrl: './dialog-tip.component.html',
  styleUrls: ['./dialog-tip.component.scss']
})
export class DialogTipComponent implements OnInit {
  @Input() title: string;
  @Input() body: string;

  constructor(protected ref: NbDialogRef<DialogTipComponent>) {}

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close();
  }

}
