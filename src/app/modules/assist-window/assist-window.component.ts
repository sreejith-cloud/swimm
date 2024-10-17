import { Component, OnInit,Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-assist-window',
  templateUrl: './assist-window.component.html',
  styleUrls: ['./assist-window.component.less']
})
export class AssistWindowComponent implements OnInit {
  Visbility:boolean=true


  constructor() { }

  ngOnInit() {
  }
  handleCancel()
  {
    this.Visbility=false
  }
}
