import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.scss']
})
export class DialogVideoComponent implements OnInit {
  @Input() title: string;
  @Input() body: any = {
    remarks:'',  
  };
  vjs_address;
  constructor(protected ref: NbDialogRef<DialogVideoComponent>) {}

  ngOnInit() {
  }


  dismiss(){
    this.ref.close()
  }

  save(){
    
  }

}
