import { Component, OnInit, ViewChild } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions } from "shared";
import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FormHandlerComponent } from 'shared';
import { UtilService } from 'shared';
import * as  jsonxml from 'jsontoxml';
import { LookUpDialogComponent } from 'shared';

export interface clientcommoditycategorisationForm {
  Clientid: any;

}

@Component({
  templateUrl: './clientcommoditycategorisation.component.html',
  styleUrls: ['./clientcommoditycategorisation.component.less'],

})

export class clientcommoditycategorisationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;

  ClientFindopt: FindOptions;
  model: clientcommoditycategorisationForm;

  clientList: any[] = [];
  reportHtml: string;
  commodities: any = [];
  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  isSpinVisible: boolean = false;
  isdisabled: boolean = false;
  today: string;
  url: string;
  endata: string;
  encryptSecretKey: string = 'zxcvbn123789';
  frameshow: boolean = false
  myurl: string;
  id: string;
  currenttime: number;
  Ip: string;
  project: string = 'SPICE';
  url1: string;
  clientType: string;
  jj: string;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
  ) {
    this.model = <clientcommoditycategorisationForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadsearch();
  }

  ngOnInit() {
    this.frameshow = false;
    this.Retrieve();
    var d = new Date();
    this.today = d.toLocaleTimeString();
    this.model.Clientid = '';
    this.Ip = this.dataServ.ipAddress
  }
  loadsearch() {
    this.ClientFindopt = {
      findType: 5011,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }

  Search() {

    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 5011, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 8,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, '');

  }

  Retrieve() {

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
        }],
      "requestId": "5030",
    }).then((response) => {

      if (response.results && response.results.length) {
        this.commodities = response.results[0];
        this.myurl = this.commodities[0].Default_Project


      }
    });
  }


  getdata(data) {
    if (!data) {
      this.notification.error('Please select a tradecode', '')
      return;
    }
    this.model.Clientid;
    this.url = ''
    this.hideframe()
    this.currenttime = new Date().getTime()
    var encodedTradecode = window.btoa(data.Tradecode);
    var encodedJsessionId = window.btoa(this.dataServ.JsessionId);
    var encodedEuser = window.btoa(this.currentUser.userCode);
    var encodedIPAddress = window.btoa(this.Ip);
    var encodedProject = window.btoa(this.project);
    var encodedClientType = window.btoa(data.Type);
    this.saveSession();
   this.url = this.myurl + encodedTradecode + '&SessionId=' + encodedJsessionId + '&Euser=' + encodedEuser + '&timestamp=' + this.currenttime + '&IPAddress=' + encodedIPAddress + '&Project=' + encodedProject + '&ClientType=' + encodedClientType;
    this.frameshow = true;
  }

  hideframe() {
    if (this.frameshow == true) {
      this.frameshow = false
    }
  }

  reset() {
    this.model.Clientid = '';
    this.frameshow = false;
  }

  saveSession(): void {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          UserCode: this.currentUser.userCode,
          SessionId: this.dataServ.JsessionId,
          Euser: this.currentUser.userCode,
        }],
      "requestId": "26",
      "outTblCount": "0"
    }).then((response) => {
      var data = response.results[0];
    });
  }
}
