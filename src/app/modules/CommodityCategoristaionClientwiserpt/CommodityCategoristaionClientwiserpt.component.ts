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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as  jsonxml from 'jsontoxml';
export interface CommodityCategoristaionClientwiserpt {
  Tradecode: any;
  Location: any;
  TD: Date;
  FD: Date;
  state: any;
  Region: any;
  UCC: Boolean;
  Type: String;
  approvalpending: Boolean;

}

@Component({
  templateUrl: './CommodityCategoristaionClientwiserpt.component.html',
  styleUrls: ['./CommodityCategoristaionClientwiserpt.component.less'],
  // animations: [bounceInOutAnimation]
})
export class CommodityCategoristaionClientwiserptComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  SpFindopt: FindOptions;
  model: CommodityCategoristaionClientwiserpt;
  currentUser: User;
  TradecodeFindopt: FindOptions;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  DetailData: any[] = [];
  commodities: any = [];
  myurl: string = "";
  clientList: any[] = [];
  Statustypes: Array<any>;
  reportHtml: string;
  isProcessing: boolean;
  error: string;
  isSpinVisible: boolean = false;
  today: string;
  url: string;
  clientType: string;
  frameshow: boolean = false
  isVisible: boolean = false;
  isVisible1: boolean = false;
  id: string;
  currenttime: number
  jj: string;
  placement = 'left';
  project: string = 'SPICE';
  Ip: string;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  filePreiewContent1: string;
  filePreiewContentType1: string;
  filePreiewFilename1: string;
  filePreiewVisible1: boolean;
  visible: boolean;
  showrmrks: boolean = false;
  showrmrks1: boolean = false;
  imgdata: any = []
  samplearay: any = []
  Types: Array<any>;
  show: boolean = false;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private notif: NzNotificationService) {
    this.model = <CommodityCategoristaionClientwiserpt>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.model.approvalpending = true
    this.TradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      requestId: 8,
      whereClause: '1=1'
    }

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

    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true;
    this.Ip = this.dataServ.ipAddress
    this.model.approvalpending = true;
    this.Retrieve()
    this.model.UCC = false;
    this.model.Type = 'U'
    this.Types = [{ "code": "U", "Type": 'Uploded' },
    { "code": "E", "Type": 'Error' },
    { "code": "P", "Type": 'Approval Pending' }
    ]

    this.Statustypes = [{ "code": "Y", "Description": 'Approve' },
    { "code": "R", "Description": 'Reject' }



    ]
    if (this.dataServ.branch == 'HO' || this.dataServ.branch == 'HOGT') {
      this.visible = true;

    }
    if (this.currentUser.UserParams != null) {

      const param = JSON.parse(this.currentUser.UserParams);
      this.model.Tradecode = { "Tradecode": param.Tradecode };
      this.project = 'clntprofile'
      this.view();
    }
    else {
      this.model.TD = new Date();
      this.model.FD = new Date();
    }
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

  Retrieve() {

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode

        }],
      "requestId": "5030",
    }).then((response) => {

      if (response.results && response.results.length) {


        this.commodities = response.results[0];

        this.myurl = this.commodities[0].Default_Project


      }
    });
  }

  save(data) {
        
    this.samplearay = [];
    data.forEach(element => {
      var datas = {
        tradecode: element.TradeCode,
        verified: element.chk == 'Y' ? 'Y' : 'R',
        remarks: element.chk1
      }

      this.samplearay.push(datas)

      // }

    });
    if (this.samplearay.length == 0) {
      console.log(this.samplearay.length)
      this.notif.error('Please select atleast one record !!', '')
      return;
    }

    for (let i = 0; i < this.samplearay.length; i++) {
      if (this.samplearay[i].verified == 'R') {
        if (this.samplearay[i].remarks == undefined) {
          this.notif.error('Please add remarks for rejected entry', '')
          return;
        }
      }
      if (this.samplearay[i].verified == 'Y') {
        if (this.samplearay[i].remarks == undefined) {
          this.samplearay[i].remarks = ''
        }
      }
    }


    var JSONData = this.utilServ.setJSONArray(this.samplearay);
    var xmlData = jsonxml(JSONData);



    this.dataServ.getResponse({
      "FileImport": "false",
      "batchStatus": "false",
      "detailArray": [{

        "XML_Approval": xmlData,
        "Euser": this.currentUser.userCode,


      }],
      "requestId": "5075",
    }).then((response) => {

      let data = this.utilServ.convertToObject(response[0]);
      let msg = data[0];


      if (msg.ErrorCode == 0) {
        this.notif.success(data[0].Msg, '')
        this.view()
        this.show = false
      }
      else {
        this.notif.error(data[0].Msg, '')
      }


    })

  }
  getdata(data) {
    if (!data) {
      this.notif.error('Please select a tradecode', '')
      return;
    }

    this.url = ''
    this.hideframe()

    this.isVisible = true;
    var encodedTradecode = window.btoa(data.TradeCode);
    var encodedJsessionId = window.btoa(this.dataServ.JsessionId);
    var encodedEuser = window.btoa(this.currentUser.userCode);
    var encodedIPAddress = window.btoa(this.Ip);
    var encodedProject = window.btoa(this.project);
    var encodedClientType = window.btoa(data.ClientType);
    this.currenttime = new Date().getTime()




    this.url = this.myurl + encodedTradecode + '&SessionId=' + encodedJsessionId + '&Euser=' + encodedEuser + '&timestamp=' + this.currenttime + '&IPAddress=' + encodedIPAddress + '&Project=' + encodedProject + '&ClientType=' + encodedClientType;
    this.frameshow = true;


  }
  hideframe() {
    if (this.frameshow == true) {
      this.frameshow = false
    }
  }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
  Reset() {
    this.model.Tradecode = '';
    this.model.state = '';
    this.model.Region = '';
    this.model.Location = '';
    this.model.TD = new Date();
    this.model.FD = new Date();
    this.model.Type = 'U'
    this.DetailData = [];
    this.showrmrks1 = false;
    this.show=false;

  }

  showModal(data) {
        
    let json: any;

    json = {
      "batchStatus": "false",
      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "TradeCode": data ? data : '',

        }],
      "requestId": "5039",
      "outTblCount": "0"

    }


    this.dataServ.getResponse(json).then((response) => {
          
      if (response && response[0] && response[0].rows.length > 0) {

        this.filePreiewContent = response[0].rows[0][0];
        this.filePreiewFilename = response[0].rows[0][1];;
        this.filePreiewContentType = response[0].rows[0][2];
        this.filePreiewVisible = true;

      }

      else {
        this.notif.error("No data found", '');
      }
    })



  }
  showModal1(data) {
        
    let json: any;

    json = {
      "batchStatus": "false",
      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "TradeCode": data ? data : '',

        }],
      "requestId": "5039",
      "outTblCount": "0"

    }


    this.dataServ.getResponse(json).then((response) => {
          
      if (response && response[1] && response[1].rows.length > 0 && response[1].rows[0][0] != "") {
        this.filePreiewContent = response[1].rows[0][0];
        this.filePreiewFilename = response[1].rows[0][1];;
        this.filePreiewContentType = response[1].rows[0][2];
        this.filePreiewVisible = true;
      }

      else {
        this.notif.error("No data found", '');
      }
    })



  }


  generateexcl() {

    this.isSpinVisible = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "Flag": 'Export',
          "TradeCode": this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
          "Location": this.model.Location ? this.model.Location.Location : '',
          "EnrollDate": '',
          "State": this.model.state ? this.model.state.ReportingState : '',
          "Region": this.model.Region ? this.model.Region.REGION : '',
          "Type": this.model.Type ? this.model.Type : '',
          "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
        }],
      "requestId": "5038",
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
        this.notif.error("No Data Found", '');
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
  handleCancel(): void {
    this.isVisible1 = false;


  }
  view() {
        
    this.isSpinVisible = true;

    let val;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "Euser": this.currentUser.userCode,
          "Flag": 'View',
          "TradeCode": this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
          "Location": this.model.Location ? this.model.Location.Location : '',
          "EnrollDate": '',
          "State": this.model.state ? this.model.state.ReportingState : '',
          "Region": this.model.Region ? this.model.Region.REGION : '',
          "Type": this.model.Type,
          "Fdate": this.model.FD ? moment(this.model.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Tdate": this.model.TD ? moment(this.model.TD).format(AppConfig.dateFormat.apiMoment) : '',
        }],
      "requestId": "5038",
      "outTblCount": "0"

    }).then((response) => {
      this.isSpinVisible = false;
      let data = this.utilServ.convertToObject(response[0]);

      if (data.length > 0) {
        if (this.model.Type == 'P') {
          this.show = true;
        }
        else {
          this.show = false;
        }
        this.DetailData = data;
      }
      else {
        this.notif.error("No Data Found", '');
        this.Reset();
        return;
      }
    })

  }
  // hideremarks(data) {
  //       
  //   if (data.chk == 'R') {
  //     this.showrmrks1 = true

  //   }
  //   else {
  //     this.showrmrks1 = false
  //   }
  // }
  hideapprovebtn() {
    this.DetailData = [];
    if (this.model.Type == 'P' && this.DetailData.length > 0) {
      this.show = true;
    }
    else {
      this.show = false;
    }
  }
}

