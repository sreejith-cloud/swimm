import { Component, OnInit} from '@angular/core';
import {WorkspaceService} from 'shared';

@Component({
  selector: 'app-acmanagement',
  templateUrl: './acmanagement.component.html',
  styleUrls: ['./acmanagement.component.less']
})
export class ACManagementComponent implements OnInit {

  constructor(private wsServ: WorkspaceService) { }

  ngOnInit() {
  }


  OpenNewTab(tab)
  {
    let ws = this.wsServ.workspaces
    let tabfound:boolean=false
    var index

    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((ws[i]['type']) == tab) {
        tabfound=true
        index=i;     
      } 
  }
  if(tabfound)
  {
      this.wsServ.removeWorkspace(index);    
      setTimeout(() => {this.wsServ.createWorkspace(tab) },200);
  }
  else
  {          
      setTimeout(() => {this.wsServ.createWorkspace(tab) },200);   
  }
  }

}
