import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import * as  jsonxml from 'jsontoxml'
import { empty } from '@angular-devkit/schematics';
import { dematmodel } from '../dstat';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';


export interface PostAccountOpening {
  PAN: any;
  slno: number;
  Location: any;
  TD: Date;
  FD: Date;
  state: any;
  Region: any;
  PanNo: any
  Trading: any;
  DP: any
  serielnumber: any
  dptype: string
  neworold: string
  crforpostacc: string
  scanDcobe: string

}

@Component({
  selector: 'app-auditallocation',
  templateUrl: './auditallocation.component.html',
  styleUrls: ['./auditallocation.component.less']
})
export class AuditallocationComponent implements OnInit, AfterViewInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild('htmlView') htmlView: ElementRef;
  @ViewChild('batch') batch: ElementRef;


  model: PostAccountOpening;
  isVisible = false;
  placement = 'right';
  html;
  wsKey: any;
  inputMasks = InputMasks;

  tablerow = [];
  BatchNo: Number
  buttonactive: boolean = true
  buttonactive1: boolean = true
  DetailDataTemp = [];
  generateprintbutton: boolean = true
  isVisiblePending: boolean = false;
  clientArray = [];
  PanDetails = [];
  gridkeys = [];
  griddata = [];
  fileName: any;
  titile: String;
  remarks: String
  checkboxindex: number
  panValid: boolean
  hideval: boolean
  detailDataHeads: any = [];
  tablecontent: dematmodel = new dematmodel()
  usertype: string;
  batchsize: any
  selectedtopool: boolean
  user: string
  file: any;
  today: any = new Date()
  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
  currentUser: User;
  DetailData = [];
  isSpinVisible: boolean = false;
  stateFindopt: FindOptions;
  DpAcNOFindopt: FindOptions;
  TradeFindopt: FindOptions
  panFindOption: FindOptions;
  geojitUniqueCodeFindOption: FindOptions
  cinFindOption: FindOptions
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  monthArray: any = [];
  month: any;
  FD: any;
  TD: any;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private wsServ: WorkspaceService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private notif: NzNotificationService) {
    this.model = <PostAccountOpening>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.TradeFindopt = {
      findType: 5036,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.DpAcNOFindopt = {
      findType: 5036,
      codeColumn: 'AccountCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.cinFindOption = {
      findType: 5036,
      codeColumn: 'CINNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
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
  ngAfterViewInit() {
    this.batch.nativeElement.focus()
  }
  ngOnInit() {
    this.getSettingsData();
    this.model.crforpostacc = 'POSTACCOPEN'
    this.model.dptype = 'NSDL'
    this.model.scanDcobe = 'SCAN'
    //  this.selectedtopool=true
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      this.tablerow = [];
      this.tablerow.push(this.tablecontent);
      this.usertype = this.dataServ.branch
      this.model.PanNo = null
      this.TD= this.today

      this.model.neworold = 'N'
      console.log(this.model.PanNo, 'vgsdfg');
      // if(this.usertype=='HOGT'){
      //   this.hideval=true;
      // }else{
      //   this.hideval=false;
      // }



    })
    this.titile = 'Audit Allocation';
    // if(this.wsKey==' AcctOpeningrpt')
    // {
    //   this.titile='Account Opening Report';

    // }
    // else{
    //   this.titile='Profile Change Report';

    // }
    // this.formHdlr.setFormType('report');
    // this.formHdlr.config.showExportExcelBtn=false;
    // this.formHdlr.config.showExportPdfBtn=false;
    // this.formHdlr.config.showSaveBtn = true;
    this.monthArray = [
      { code: 1, value: 'January' },
      { code: 2, value: 'February' },
      { code: 3, value: 'March' },
      { code: 4, value: 'April' },
      { code: 5, value: 'May' },
      { code: 6, value: 'June' },
      { code: 7, value: 'July' },
      { code: 8, value: 'Augest' },
      { code: 9, value: 'September' },
      { code: 10, value: 'October' },
      { code: 11, value: 'November' },
      { code: 12, value: 'December' }
    ]

  }
  getSettingsData() {

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          Euser: this.currentUser.userCode
        }],
      "requestId": "6039",
      "outTblCount": "0"
    }).then((response) => {
      console.log(response)
      if (response.errorCode == 0) {
        this.batchsize = response.results[0][0].PostAcc_BatchSize
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
      }
    })
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
    this.buttonactive = true
    this.buttonactive1 = true
    this.generateprintbutton = true
    this.BatchNo = null
    this.DetailDataTemp = []
    this.month = undefined
    this.FD = undefined;
    this.TD =this.today;
    this.user = '';
    if (this.batchsize != 50) {
      this.getSettingsData();
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
    if (this.batchsize == null || this.batchsize == undefined || this.batchsize == '') {
      this.notif.warning('Warning', 'Please Give Batch Size')
      return;
    }
    this.isSpinVisible = true;
    this.DetailData = []
    this.detailDataHeads = []


    let val;
    this.dataServ.getResponse({
      "batchStatus": "false",

      "detailArray":
        [{
          "RecordType": this.model.crforpostacc ? this.model.crforpostacc : '',
          "DpName": this.model.dptype ? this.model.dptype : '',
          "ProcessType": this.model.neworold,
          "BatchSize": this.batchsize ? this.batchsize : 50,
          "EUser": this.currentUser.userCode,
          "AccountType": this.model.scanDcobe ? this.model.scanDcobe : '',
          "UserCode": this.user ? this.user : '',
          "MonthId": this.month ? this.month : 0,
          "Fromdate": this.FD ? moment(this.FD).format(AppConfig.dateFormat.apiMoment) : '',
          "Todate": this.TD ? moment(this.TD).format(AppConfig.dateFormat.apiMoment) : ''
        }],
      "requestId": "6043",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinVisible = false;
      let data = this.utilServ.convertToObject(response[0]);

      if (data.length > 0) {
        this.DetailData = data;
        this.detailDataHeads = Object.keys(this.DetailData[0])
        this.buttonactive = false;
        this.buttonactive1 = false;
      }
      else {
        this.notif.error("No Data Found", '');
        this.Reset();
        return;
      }
    })

  }

  Addrow() {
    // if (field.folioNo || field.certificateNos || field.quantity || field.distinctiveFrom || this.tablecontent.distinctiveTo) {
    // this.tablecontent.SLNo=idx;
    this.tablecontent = new dematmodel();
    this.tablerow.push(this.tablecontent)
    // }
  }

  delete(index) {
    if (this.tablerow.length > 1) {
      this.tablerow.splice(index, 1);
      // this.onchangeQuantity()
    }
  }




  save() {

    // console.log(this.totalData)
    // this.totalData.forEach(item => {  
    //   if(item.approveValue!=null){
    //           ApprovalDetails=ApprovalDetails+(item.TradeCode)+'|'+item.approveValue+','
    //   }
    //   });
    for (var i = 0; i <= this.DetailData.length - 1; i++) {
      if (this.DetailData[i].selectedtopool == true) {
        this.DetailDataTemp.push(this.DetailData[i])
      }
    }
    if (this.DetailDataTemp.length == 0) {
      this.notif.error("Nothing to save", '');
      // this.Reset();
      return;
    }
    this.isSpinVisible = true;
    var JSONData = this.utilServ.setJSONArray(this.DetailDataTemp);
    var xmlData = jsonxml(JSONData);
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          //  Flag:'SAVE',
          //  Location:'',
          //  FromDate:'',
          //  ToDate:'',
          //  Tradecode:'',
          //  DPID:'',
          XMLData: xmlData,
          ProcessType: this.model.neworold ? this.model.neworold : '',
          Euser: this.currentUser.userCode,
          Remarks: this.remarks ? this.remarks : ''
        }],
      "requestId": "6044",
      "outTblCount": "0"
    }).then((response) => {
      console.log(response)
      if (response.errorCode == 0) {
        this.notif.success("Batch Number" + "" + " " + " " + response.results[0][0].batchNo + " " + " " + "Generated Successfully", '')
        var tempbatch = response.results[0][0].batchNo

        this.printdemat(tempbatch);
        this.Reset();


        this.generateprintbutton = false;
        this.isSpinVisible = false;
      }
    });
    this.isSpinVisible = false;
    this.buttonactive1 = true

  }



  handleCancel() {
    this.isVisiblePending = false;
    this.griddata = [];
  }

  generateexcl() {
    this.DetailDataTemp = []
    for (var i = 0; i <= this.DetailData.length - 1; i++) {
      if (this.DetailData[i].selectedtopool == true) {
        this.DetailDataTemp.push(this.DetailData[i])
      }
    }
    if (this.DetailDataTemp.length > 0) {
      this.Excel(this.detailDataHeads, this.DetailDataTemp, 'Auditorallocation');
      this.Reset();
      this.DetailDataTemp = []
    } else {
      this.notif.warning("Nothing to print", '')
      return;
    }
  }

  Excel(colums, data, filename) {
    let tableHeader;
    this.html = "<table><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      this.html = this.html + "<th>" + tableHeader[i] + "</th>";
    }
    this.html = this.html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        this.html = this.html + "<td>" + data[i][tableHeader[j]] + "</td>";
      }
      this.html = this.html + "<tr>";
    }
    this.html = this.html + "</tr><table>";

    let blob = new Blob([this.html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, filename + " Report.xls");
    // let blob = new Blob([document.getElementById('clientassetrpt').innerHTML], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    //     });
    //  FileSaver.saveAs(blob, "ClientAssetReport.xls");
  }

  printdemat(data) {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          "NewOrReviewed": this.model.neworold ? this.model.neworold : '',
          "batchNo": data,
          "Euser": this.currentUser.userCode,
          "RecordType": this.model.crforpostacc ? this.model.crforpostacc : '',
          "DpName": this.model.dptype ? this.model.dptype : '',
          "AccountType": this.model.scanDcobe ? this.model.scanDcobe : ''

        }],
      "requestId": "6058",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      // this.isSpinning = false;
      if (response.errorMsg) {
        this.notification.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.notification.success('File downloaded successfully', '');
          this.Reset();
          return;
        }
      }
    }, () => {
      this.notification.error("Server encountered an Error", '');
    });
  }

  ReprintPdf() {
    if (this.BatchNo == null || this.BatchNo == undefined) {
      this.notification.warning("Please enter batch number", '')
      return;
    } else {
      this.printdemat(this.BatchNo);
    }

  }

  ExcelReprint() {
    if (this.BatchNo == null || this.BatchNo == undefined) {
      this.notification.warning("Please enter batch number", '')
      return;
    } else {
      this.ExcelReport(this.BatchNo);
    }
  }

  ExcelReport(batch) {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          "batchNo": batch,
          "Euser": this.currentUser.userCode,
          "BarCode" : 0,
          "AccountSerialNo" : 0,
          "BenId" : '', 
          "SrcFlag" : 'XL'

        }],
      "requestId": "6045",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      // this.isSpinning = false;
      if (response.errorMsg) {
        this.notification.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.notification.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notification.error("Server encountered an Error", '');
    });
  }

  PDFReport() {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{

          "Euser": ''

        }],
      "requestId": "7053",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A4' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      // this.isSpinning = false;
      if (response.errorMsg) {
        this.notification.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.notification.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notification.error("Server encountered an Error", '');
    });
  }

  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };

}

