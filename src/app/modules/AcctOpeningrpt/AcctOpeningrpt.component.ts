import { Component, OnInit, ViewChild } from '@angular/core';
import { LookUpDialogComponent } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import * as FileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WorkspaceService } from 'shared';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PoaserviceService } from '../clientpoadashboard/poaservice.service'

export interface AcctOpeningrpt {
  PAN: any;
  slno: number;
  Location: any;
  TD: Date;
  FD: Date;
  state: any;
  Region: any;
  Status: any;
  type: any;
  requestFrom: any
  clientLocation: any
  approvalDate: any;
  HOprocessUser: any;
  accountType: any;

}

@Component({
  templateUrl: './AcctOpeningrpt.component.html',
  styleUrls: ['./AcctOpeningrpt.component.less'],
  // animations: [bounceInOutAnimation]
})
export class AcctOpeningrptComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  model: AcctOpeningrpt;
  isVisible = false;
  placement = 'right';
  wsKey: any;
  titile: String;
  detailDataHeads: any = [];
  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
  currentUser: User;
  DetailData: Array<any>;
  isSpinVisible: boolean = false;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  filePreiewContent: any;
  isVisibleHo: boolean = false;
  statusOptions: Array<any> = [
    { label: 'Processing', value: 'T' },
    { label: 'Pending', value: 'P' },
    { label: 'First Level Approved', value: 'F' },
    { label: 'Final Approved', value: 'A' },
    { label: 'Rejected', value: 'R' },
    { label: 'HO Modified', value: 'E' },
    {label: 'Pool', value: 'Z'}
  ];
  Requests_idno: any;
  fileContent: any = [];
  isVisibleReasons: boolean = false;
  modalRemarks: any;
  rejectionremark: any;
  title: any;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService,
    private poaserv: PoaserviceService) {
    this.model = <AcctOpeningrpt>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });


    this.locationFindopt = {

      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.stateFindopt = {
      findType: 1000,
      codeColumn: 'ReportingState',
      codeLabel: 'ReportingState',
      descColumn: 'StateCode',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }



  }

  ngOnInit() {

    debugger
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
    })
    if (this.wsKey == 'AcctOpeningrpt') {
      this.titile = 'Account Opening Report';

    }
    else {
      this.titile = 'Profile Change Report';

    }
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;

    if (this.poaserv.fromApproveList == true) {
      this.poaserv.fromApproveList = false;
      this.statusOptions.forEach(item => {
        if (item.value == this.poaserv.crfRPTStatus) {
          item["checked"] = true
        }
      })
    }
    else {
      this.statusOptions.forEach(item => {
        if (this.dataServ.branch == 'HO' || this.dataServ.branch == 'HOGT') {
          if (item.value == 'P') {
            item["checked"] = true
          }
        }
        else {
          if (item.value == 'T') {
            item["checked"] = true
          }
        }
      })
    }


  }
  ShowHOModificationss(data) {
    // var x = data.toString()
    //  var x=String(data);
    if (data != undefined) {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            Requestsidno: data,
            Eusername: this.currentUser.userCode,
          }],
        "requestId": "700070",
        "outTblCount": "0"

      }).then((response) => {
        if (response.length > 0) {
          debugger
          this.isVisibleReasons = true;
          this.fileContent = response[0].rows;
          this.rejectionremark = response[1].rows[0][0]
          if (this.rejectionremark) {
            this.fileContent.push(this.rejectionremark)
          }
        }
      })
    }
  }
  handleCancel() {
    this.isVisibleHo = false;
    this.isVisibleReasons = false;
  }
  onChangestate(data) {
    if (data == null) {
      return
    }
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "ReportingState ='" + data.ReportingState + "'"
    }
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "ReportingState ='" + data.ReportingState + "'"
    }

  }
  onChangeRegion(data) {
    if (data == null) {
      return
    }
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "L.REGION ='" + data.REGION + "'"
    }

  }
  Reset() {
    this.DetailData = [];
    this.model.PAN = '';
    this.model.slno = null;
    this.model.state = '';
    this.model.Region = '';
    this.model.Location = '';
    this.formHdlr.config.showExportExcelBtn = false;
    this.model.type = undefined
    this.model.requestFrom = undefined
    this.model.clientLocation = undefined
    this.model.approvalDate = undefined
    this.model.HOprocessUser = '';
    this.model.accountType = undefined;
    this.model.FD = null;
    this.model.TD = null;
    this.statusOptions.forEach(item => {
      item.checked = false
    })

  }

  createComponentModal(data): void {
    let isworkspaceFound = false;
    let index = -1;
    if (this.wsKey == 'AcctOpeningrpt') {
      let ws = this.wsServ.workspaces
      for (let i = 0; i < this.wsServ.workspaces.length; i++) {
        if ((ws[i]['type']) == "clientMaster") {
          isworkspaceFound = true
          index = i
        }
        // else if(i==this.wsServ.workspaces.length-1){
        //   this.dataServ.slno = data.SerialNo
        //   setTimeout(() => {
        //     this.wsServ.createWorkspace("clientMaster");
        //     this.dataServ.fromreport=true;
        //   },500);

        // }
      }
      if (isworkspaceFound) {
        this.dataServ.slno = data.SerialNo
        this.wsServ.removeWorkspace(index);
        this.dataServ.fromreport = true;
        setTimeout(() => {
          this.wsServ.createWorkspace("clientMaster");
        }, 200);
      }
      else {
        setTimeout(() => {
          this.dataServ.slno = data.SerialNo
          this.dataServ.fromreport = true;
          this.wsServ.createWorkspace("clientMaster");
        }, 500);
      }
    }
    else {
      let ws = this.wsServ.workspaces
      for (let i = 0; i < this.wsServ.workspaces.length; i++) {
        if ((ws[i]['type']) == "crf") {
          isworkspaceFound = true
          index = i
          //   this.wsServ.removeWorkspace(i);
          //   this.dataServ.slno = data.SerialNo
          //   this.dataServ.fromreport = true;
          //   setTimeout(() => { this.wsServ.createWorkspace("crf"); }, 200)
          //   // this.wsServ.createWorkspace("crf");
          //   return
          // }
          // else if (i == this.wsServ.workspaces.length - 1) {
          //   this.dataServ.slno = data.SerialNo
          //   this.dataServ.fromreport = true;
          //   this.wsServ.createWorkspace("crf");
          // }
        }
        if (isworkspaceFound) {
          this.dataServ.slno = data.SerialNo
          this.wsServ.removeWorkspace(index);
          this.dataServ.fromreport = true;
          setTimeout(() => {
            this.wsServ.createWorkspace("crf");
          }, 200);
        }
        else {
          setTimeout(() => {
            this.dataServ.slno = data.SerialNo
            this.dataServ.fromreport = true;
            this.wsServ.createWorkspace("crf");
          }, 500);
        }

      }
    }
  }
  // generateexcl()
  // {
  //   this.isSpinVisible = true;
  //   let reqParams = {
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         "Euser" :this.currentUser.userCode,
  //         "Slno":this.model.slno?this.model.slno:0,
  //         "Pan" : this.model.PAN ? this.model.PAN: '',
  //         "Location": this.model.Location ? this.model.Location.Location : '',
  //         "State": this.model.state ? this.model.state.ReportingState : '',
  //         "Region": this.model.Region ? this.model.Region.REGION : '',
  //         "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
  //         "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : ''
  //       }],
  //     "requestId": "5072",
  //     "outTblCount": "0"
  //   }



  //   reqParams['fileType'] = "3";
  //   reqParams['fileOptions'] = { 'pageSize': 'A3R' };
  //   let isPreview: boolean;
  //   isPreview = false;
  //   this.isSpinVisible = true;
  //   this.dataServ.generateReport(reqParams, isPreview).then((response) => {
  //     this.isSpinVisible = false;

  //     if (response.errorMsg != undefined && response.errorMsg != '') {
  //       this.isSpinVisible = false;
  //       this.notif.error("No Data Found", '');
  //       return;

  //     }
  //     else {
  //       if (!isPreview) {
  //         this.isSpinVisible = false;
  //         this.notif.success('File downloaded successfully', '');
  //         return;
  //       }
  //     }
  //   }, () => {
  //     this.notif.error("Server encountered an Error", '');
  //   });
  // }
  view() {
    debugger
    this.title = this.model.requestFrom
    sessionStorage.setItem("key", this.title);
    this.isSpinVisible = true;
    var status = '';
    this.statusOptions.forEach(item => {
      if (item["checked"]) {
        if (status == '') {
          status = item.value
        }
        else {
          status += '|' + item.value
        }
      }
    })

   console.log("this.model.type",this.model.type)
    let val;
    this.dataServ.getResponse({
      "batchStatus": "false",

      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "Slno": this.model.slno ? this.model.slno : '',
          "Pan": this.model.PAN ? this.model.PAN : '',
          "Location": this.model.Location ? this.model.Location.Location : '',
          "State": this.model.state ? this.model.state.ReportingState : '',
          "Region": this.model.Region ? this.model.Region.REGION : '',
          "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
          "Name": '',
          "Flag": this.wsKey.trim(),
          "Status": status,
          "Type": 'V',
          "EntryType": this.model.type ? this.model.type : '',
          "RequestFrom": this.model.requestFrom ? this.model.requestFrom : '',
          "clientLocation": this.model.clientLocation ? 'Y' : 'N',
          "approvalDate": this.model.approvalDate ? 'Y' : 'N',
          "HOprocessUser": this.model.HOprocessUser ? this.model.HOprocessUser : '',
          "accounttype": this.model.accountType ? this.model.accountType : ''
        }],
      "requestId": "5072",
      "outTblCount": "0"

    }).then((response) => {
      debugger
      this.isSpinVisible = false;
      let data = this.utilServ.convertToObject(response[0]);

      if (data.length > 0) {
        this.DetailData = data;
        this.detailDataHeads = Object.keys(this.DetailData[0])
        this.formHdlr.config.showExportExcelBtn = true;
      }
      else {
        this.notif.error("No Data Found", '');
        this.Reset();
        return;
      }
    })

  }

  OpenNewTab(tab) {

    let ws = this.wsServ.workspaces
    let tabfound: boolean = false
    var index

    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((ws[i]['type']) == tab) {
        tab = true
        index = i;
      }
    }
    if (tabfound) {
      this.wsServ.removeWorkspace(index);
      this.dataServ.fromreport = true;
      setTimeout(() => { this.wsServ.createWorkspace(tab) }, 200);
    }
    else {
      this.dataServ.fromreport = true;
      setTimeout(() => { this.wsServ.createWorkspace(tab) }, 200);
    }
  }

  exportData() {

    var status = '';
    this.statusOptions.forEach(item => {
      if (item["checked"]) {
        if (status == '') {
          status = item.value
        }
        else {
          status += '|' + item.value
        }
      }
    })

    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "Slno": this.model.slno ? this.model.slno : '',
          "Pan": this.model.PAN ? this.model.PAN : '',
          "Location": this.model.Location ? this.model.Location.Location : '',
          "State": this.model.state ? this.model.state.ReportingState : '',
          "Region": this.model.Region ? this.model.Region.REGION : '',
          "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
          "Name": '',
          "Flag": this.wsKey.trim(),
          "Status": status,
          "Type": 'E',
          "EntryType": this.model.type ? this.model.type : '',
          "RequestFrom": this.model.requestFrom ? this.model.requestFrom : '',
          "clientLocation": this.model.clientLocation ? 'Y' : 'N',
          "approvalDate": this.model.approvalDate ? 'Y' : 'N',
          "HOprocessUser": this.model.HOprocessUser ? this.model.HOprocessUser : '',
          "accounttype": this.model.accountType ? this.model.accountType : ''
        }],
      "requestId": "5072",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.isSpinVisible = true;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      this.isSpinVisible = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.isSpinVisible = false;
        this.notif.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.isSpinVisible = false;
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }
  ShowHOModifications(data) {
    if (data != undefined) {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            "euser": this.currentUser.userCode,
            "Requets_idno": data,
          }],
        "requestId": "600020",
        "outTblCount": "0"

      }).then((response) => {
        if (response.length > 0) {
          this.filePreiewContent = this.sanitizer.bypassSecurityTrustHtml(response[0].rows[0][0]);
          this.isVisibleHo = true;
        }
        else {
          this.notif.error("No Data Found", '');
          this.Reset();
          return;
        }
      })
    }
  }
}


