import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';

import { AppConfig, WorkspaceService } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { ClientMasterService } from './client-master.service';


@Component({
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.less'],
})

export class ModuleComponent implements OnInit {
// @ViewChild("accOpening")accOpening:ElementRef;
  currentUser: User;
  activeTabIndex: number = 0;
  isEntryfinalised:boolean=false;
  tabOptions = [
    {
      label: 'Trading + DP',
      value: 1,
    },
    {
      label: 'Insurance',
      value: 2,
    },
    {
      label: 'Funds Genie',
      value: 3,
    },
    {
      label: 'CRF',
      value: 4,
    },
    {
      label: 'Mutual Fund',
      value: 5,
    },
    {
      label: 'PMS',
      value: 6,
    },   
  ];
  tabSelection: number = 1;
  isTabSelectionVisible: boolean = false;
  radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  enableTabACOpening: boolean = false;
  enableTabKYC: boolean = false;
  enableTabFinancials: boolean = false;
  enableTabTrading: boolean = false;
  enableTabDP: boolean = false;
  enableTabIU: boolean = false;
  enableTabRejections: boolean = false;
  enableTabscheme: boolean = false;
  disableAccOpng:boolean=false
  isClientProfileEdit: boolean=false;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private cmServ: ClientMasterService,
    private wsServ: WorkspaceService,
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.cmServ.activeTabIndex.subscribe((val) => {
      this.activeTabIndex = val;
    })
    this.cmServ.trigerAcOpening.subscribe((val)=>{
      this.enableTabACOpening=val
    })
    this.cmServ.trigerKYC.subscribe((val)=>{
      this.enableTabKYC=val
    })
    this.cmServ.trigerFinancial.subscribe((val)=>{
      this.enableTabFinancials=val
    })

    this.cmServ.trigerTrading.subscribe((val)=>{
      this.enableTabTrading=val
    })

    this.cmServ.trigerDp.subscribe((val)=>{
      this.enableTabDP=val
    })
    this.cmServ.trigerScheme.subscribe((val)=>{
      this.enableTabscheme=val
    })

    this.cmServ.trigerIU.subscribe((val)=>{
      this.enableTabIU=val
    })
    this.cmServ.trigerRejection.subscribe((val)=>{
      this.enableTabRejections=val
    })
  }
  ngOnInit() {
this.cmServ.isClientProfileEdit.subscribe(val=>{
  this.isClientProfileEdit=val
})
this.cmServ.finalize.subscribe(val=>{
  this.isEntryfinalised=val
})

  }

  onLeaveACOpening() {
  }
  tabChange(data){debugger
 this.cmServ.lastActivateTabIndex.next(data)
 this.cmServ.activeTab.next(this.activeTabIndex)
  }
  openTabSelection() {
    this.isTabSelectionVisible = true;
  }

  handleTabSelection() {
    this.isTabSelectionVisible = false;
  }

  handleTabSelectionCancel() {
    this.isTabSelectionVisible = false;
  }

  handleTabSelectionClose() {
    this.cmServ.tabSelection.next(this.tabSelection);
  }
  OpenNewTab(tab)
  {

    let ws = this.wsServ.workspaces
    let tabfound:boolean=false
    var index

    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((ws[i]['type']) == tab) {
        tab=true
        index=i;     
      } 
  }
  if(tabfound)
  {
      this.wsServ.removeWorkspace(index);    
      this.dataServ.fromreport=true;
      setTimeout(() => {this.wsServ.createWorkspace(tab) },200);
  }
  else
  {         
      this.dataServ.fromreport=true;  
      setTimeout(() => {this.wsServ.createWorkspace(tab) },200);   
  }
  }
   
}
