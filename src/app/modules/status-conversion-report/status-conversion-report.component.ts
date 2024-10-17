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
import { CRFDataService } from '../crf/CRF.service';
import { PoaserviceService } from '../clientpoadashboard/poaservice.service'
import { StatusconversionService } from '../status-conversion/statusconversion.service';


export interface statusconverstiondata {
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
  selector: 'app-status-conversion-report',
  templateUrl: './status-conversion-report.component.html',
  styleUrls: ['./status-conversion-report.component.less']
})
export class StatusConversionReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  model: statusconverstiondata;
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
  statusOptions = [
    { label: 'Processing', value: 'P' },
    { label: 'Pending', value: 'I' },
    { label: 'First Level Verified', value: 'A' },
    { label: 'Final Verified', value: 'AF' },
    { label: 'CP Removal', value: 'AR' },
    { label: 'UCC', value: 'AU' },
    { label: 'Converted', value: 'AC' },
    { label: 'Trade Code Transfer', value: 'AT' },
    // { label: 'UCC Trade Code Transfer', value: 'AE' },
    { label: 'Completed', value: 'AE' },
    { label: 'Rejected', value: 'R' },
    // { label: 'End', value: 'E' },
    // { label: 'HO Modified', value: 'E' }
  ];
  HO: boolean = false
  branch: string = ''
  constructor(
    private cscservice: StatusconversionService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService,
    private poaserv: PoaserviceService,
    private crfdataservice: CRFDataService,
  ) {
    this.branch = this.dataServ.branch
    // this.branch ='JW'
    this.HO = this.branch == 'HO' || this.branch == 'HOGT' ? true : false
    // alert(branch)
    console.log("constructor of csc");

    this.model = <statusconverstiondata>{
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
    console.log(this.wsServ.workspaces);

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

    // if (this.poaserv.fromApproveList == true) {
    //   this.poaserv.fromApproveList = false;
    //   this.statusOptions.forEach(item => {
    //     if (item.value == this.poaserv.crfRPTStatus) {
    //       item["checked"] = true
    //     }
    //   })
    // }
    // else {
    //   this.statusOptions.forEach(item => {
    //     if (this.dataServ.branch == 'HO' || this.dataServ.branch == 'HOGT') {
    //       if (item.value == 'P') {
    //         item["checked"] = true
    //       }
    //     }
    //     else {
    //       if (item.value == 'T') {
    //         item["checked"] = true
    //       }
    //     }
    //   })
    // }
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
    this.model.FD=null
    this.model.TD=null
    this.statusOptions=[
      { label: 'Processing', value: 'P' },
      { label: 'Pending', value: 'I' },
      { label: 'First Level Verified', value: 'A' },
      { label: 'Final Verified', value: 'AF' },
      { label: 'CP Removal', value: 'AR' },
      { label: 'UCC', value: 'AU' },
      { label: 'Converted', value: 'AC' },
      { label: 'Trade Code Transfer', value: 'AT' },
      // { label: 'UCC Trade Code Transfer', value: 'AE' },
      { label: 'Completed', value: 'AE' },
      { label: 'Rejected', value: 'R' }
    ]

  }

  createComponentModal(data): void {
    if (this.HO) {
      let isworkspaceFound = false;
      let index = -1;
      let ws = this.wsServ.workspaces

      for (let i = 0; i < this.wsServ.workspaces.length; i++) {
        if ((ws[i]['type']) == "statusconversion") {
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
          this.cscservice.slnocsc = data.SerialNo
          this.wsServ.removeWorkspace(index);
          this.cscservice.fromreportcsc = true;
          this.cscservice.status = data.CurrentStatus
          setTimeout(() => {
            this.wsServ.createWorkspace("statusconversion");
          }, 200);
        }
        else {
          setTimeout(() => {
            this.cscservice.slnocsc = data.SerialNo
            this.cscservice.fromreportcsc = true;
            this.cscservice.status = data.CurrentStatus
            this.wsServ.createWorkspace("statusconversion");
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


    let val;
    this.dataServ.getResultArray({//getResponse({
      "batchStatus": "false",

      "detailArray":
        [{
          "ClStatusChangeSlNo": this.model.slno ? this.model.slno : '',
          "CurrentStatus": status,
          "Euser": this.currentUser.userCode,
          // "Slno": this.model.slno ? this.model.slno : '',
          "Pan": this.model.PAN ? this.model.PAN : '',
          "Location": this.HO ? (this.model.Location ? this.model.Location.Location : '') : this.branch,
          "State": this.model.state ? this.model.state.ReportingState : '',
          "Region": this.model.Region ? this.model.Region.REGION : '',
          "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
          "Name": '',
          "Flag": this.wsKey.trim(),
          // "ActionType": status,
          "Type": 'V',
          "EntryType": this.model.type ? this.model.type : '',
          "RequestFrom": this.model.requestFrom ? this.model.requestFrom : '',
          "clientLocation": this.model.clientLocation ? 'Y' : 'N',//
          "approvalDate": this.model.approvalDate ? 'Y' : 'N',//
          "HOprocessUser": this.model.HOprocessUser ? this.model.HOprocessUser : '',
          "accounttype": this.model.accountType ? this.model.accountType : ''
          // , "checkdigit": "123"
          // "SpId":"700074"
        }],
      "requestId": "700300"//"700236" //"700166"//"700220"//"700166"
      ,
      "outTblCount": "0"

    }).then((response) => {

      // console.log(response);
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          console.log(response.results[0]);

          this.isSpinVisible = false;
          let data = response.results[0]
          // let data = this.utilServ.convertToObject(response.results[0][0]);
          console.log(data);

          if (data.length > 0) {
            // this.detailDataHeads.data =response.results[0]
            this.DetailData = data;

            this.detailDataHeads = Object.keys(this.DetailData[0])//response[0][0])//this.DetailData[0])
            this.formHdlr.config.showExportExcelBtn = true;
          }
          else {
            this.notif.error("No Data Found", '',{ nzDuration: 1000});
            this.Reset();
            return;
          }
        }
        else {
          this.isSpinVisible = false
          this.notif.error('Datas not found', '',{ nzDuration: 1000})
        }
      }
      else {
        this.isSpinVisible = false
        this.notif.error(response.errorMsg, '',{ nzDuration: 1000})
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
      this.cscservice.fromreportcsc = true;
      setTimeout(() => { this.wsServ.createWorkspace(tab) }, 200);
    }
    else {
      this.cscservice.fromreportcsc = true;
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
        "ClStatusChangeSlNo": this.model.slno ? this.model.slno : '',
        "Pan": this.model.PAN ? this.model.PAN : '',
        "Location": this.model.Location ? this.model.Location.Location : '',
        "State": this.model.state ? this.model.state.ReportingState : '',
        "Region": this.model.Region ? this.model.Region.REGION : '',
        "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
        "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
        "Name": '',
        "Flag": this.wsKey.trim(),
        "CurrentStatus": status,
        "Type": 'E',
        "EntryType": this.model.type ? this.model.type : '',
        "RequestFrom": this.model.requestFrom ? this.model.requestFrom : '',
        "clientLocation": this.model.clientLocation ? 'Y' : 'N',
        "approvalDate": this.model.approvalDate ? 'Y' : 'N',
        "HOprocessUser": this.model.HOprocessUser ? this.model.HOprocessUser : '',
        "accounttype": this.model.accountType ? this.model.accountType : ''
      }],
      "requestId": "700300",
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
        this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
        return;
      }
      else {
        if (!isPreview) {
          this.isSpinVisible = false;
          this.notif.success('File downloaded successfully', '',{ nzDuration: 1000});
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
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
          this.notif.error("No Data Found", '',{ nzDuration: 1000});
          this.Reset();
          return;
        }
      })
    }
  }
  handleCancel() {
    this.isVisibleHo = false;
  }
}
