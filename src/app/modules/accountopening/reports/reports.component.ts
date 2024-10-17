import { Component, OnInit } from '@angular/core';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
// import { THIS_EXPR } from 'node_modules_old1/@angular/compiler/src/output/output_ast';
import { InputMasks, InputPatterns } from 'shared';
export interface Reports {
  crforpostacc:String
  From:Date
  To:Date
  mode:any
  Type:any
  DpType:any
  ActionType:any
  AccountType:any
  ReportSubType:any
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})
export class ReportsComponent implements OnInit {
model:Reports
Modes=[]
ActionTypes=[]
AccountTypes=[]
DetailData=[]
user:string
detailDataHeads=[]
ReportSubTypes=[]
Types=[]
isSpinVisible:boolean
AccSerialNo:number
BatchNo:number
BarCode:number
DetailData1=[]
detailDataHeads1=[]
DPTypes=[]
modalon:boolean=false;
RoundId:number
BoxNo:number
KitNo:string
PendingFlag:string
html;
ActionFlag:string
inputMasks = InputMasks;
currentUser: User;
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService
  ) { 
    this.model = <Reports>{
  
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.model.crforpostacc='POSTACCOPEN'
    this.model.From=new Date();
    this.model.To= new Date();
    this.Modes = [
    { "code": "Auditor Allocation", "Mode": 'Auditor Allocation' },
    { "code": "Auditor Acceptance", "Mode": 'Auditor Acceptance' },
    { "code": "Auditor Review Consolidated", "Mode": 'Auditor Review Consolidated' },
    { "code": "Auditor Deviations", "Mode": 'Auditor Deviations' },
     { "code": "Auditor Review", "Mode": 'Auditor Review' },
     { "code": "Box No Generation", "Mode": 'Box No Generation' },
    { "code": "HO Acceptance", "Mode": 'HO Acceptance' },
    { "code": "HO Booklet Received", "Mode": 'HO Booklet Received' },
     { "code": "POA Stamp", "Mode": 'POA Stamped Details' },
     { "code": "POA Signed", "Mode": 'POA Signed' },
     { "code": "HO Review", "Mode": 'HO Review' },
     { "code": "Store Verification", "Mode": 'Store Verification' },
    { "code": "Track A Booklet", "Mode": 'Track A Booklet' }
  ]
  this.model.mode='HO Booklet Received'
    this.Types = [{ "code": "Y", "Mode": 'Y' },
    { "code": "N", "Mode": 'N' },
    { "code": "ALL", "Mode": 'ALL' }
  ]
  this.DPTypes = [{ "code": "ALL", "Mode": 'ALL' },
    { "code": "NSDL", "Mode": 'NSDL' },
  { "code": "CDSL", "Mode": 'CDSL' }]
  
  this.ActionTypes = [{ "code": "ALL", "Mode": 'ALL' },
  { "code": "N", "Mode": 'New' },
{ "code": "A", "Mode": 'Auditor Review' }]
  
this.AccountTypes = [{ "code": "ALL", "Mode": 'ALL' },
{ "code": "SCAN", "Mode": 'SCAN' },
{ "code": "DCOB", "Mode": 'DCOB' }]

this.ReportSubTypes = [
{ "code": "N", "Mode": 'Normal' },
{ "code": "E", "Mode": 'EnrollDate ' }]

  this.model.Type='ALL'
  this.model.DpType='ALL'
  this.model.ActionType='ALL'
  this.model.AccountType='ALL'
  this.model.ReportSubType='N'
  }

  view() {
        // this.isSpinVisible = true;
    
        let val;
        this.dataServ.getResponse({
          "batchStatus": "false",
          
          "detailArray":
            [{
              RecordType:this.model.crforpostacc,
              FromDate : moment(this.model.From).format(AppConfig.dateFormat.apiMoment),
              ToDate : moment(this.model.To).format(AppConfig.dateFormat.apiMoment),
              ReportType:this.model.mode,
              AccSerialNo :this.AccSerialNo?this.AccSerialNo:0,
              BatchNo :this.BatchNo?this.BatchNo:0,
              BarCode :this.BarCode?this.BarCode:0,
              RoundId :this.RoundId?this.RoundId:0,
              BoxNo :this.BoxNo?this.BoxNo:0,
              KitNo :this.KitNo?this.KitNo:'',
              PendingFlag :this.model.Type?this.model.Type:'',
              ActionFlag :this.model.ActionType?this.model.ActionType:'',
              DailyStampFlag:'',
              Euser :this.currentUser.userCode,
              DpType:this.model.DpType?this.model.DpType:'',
              AccountType:this.model.AccountType?this.model.AccountType:'',
              ReportSubType:this.model.ReportSubType?this.model.ReportSubType:''
            }],
          "requestId": "6055",
          "outTblCount": "0"
    
        }).then((response) => {
          // this.isSpinVisible = false;
          let data = this.utilServ.convertToResultArray(response[0]);
    
          if (data.length > 0) {
           
            this.DetailData = data;
            // for(var i=0;i<=this.DetailData.length-1;i++){
            //   this.DetailData[i].NSDL_Account==true?this.DetailData[i].NSDL_Account='Y':this.DetailData[i].NSDL_Account='N'
            //   this.DetailData[i].CDSL_Account==true?this.DetailData[i].CDSL_Account='Y':this.DetailData[i].CDSL_Account='N'
            //   this.DetailData[i].Trading_Account==true?this.DetailData[i].Trading_Account='Y':this.DetailData[i].Trading_Account='N'
            //   this.DetailData[i].MTFAccount==true?this.DetailData[i].MTFAccount='Y':this.DetailData[i].MTFAccount='N'
            //   this.DetailData[i].B2B_Account==true?this.DetailData[i].B2B_Account='Y':this.DetailData[i].B2B_Account='N'
            //   this.DetailData[i].BookReceivedFlag==true?this.DetailData[i].BookReceivedFlag='Y':this.DetailData[i].BookReceivedFlag='N'
            //   this.DetailData[i].PassedToAuditorFlag==true?this.DetailData[i].PassedToAuditorFlag='Y':this.DetailData[i].PassedToAuditorFlag='N'
            //   this.DetailData[i].POASigned==true?this.DetailData[i].POASigned='Y':this.DetailData[i].POASigned='N'
            //   this.DetailData[i].POADebited==true?this.DetailData[i].POADebited='Y':this.DetailData[i].POADebited='N'
            //   this.DetailData[i].POAStamped==true?this.DetailData[i].POAStamped='Y':this.DetailData[i].POAStamped='N'
            //   this.DetailData[i].BoxNoGeneratedFlag==true?this.DetailData[i].BoxNoGeneratedFlag='Y':this.DetailData[i].BoxNoGeneratedFlag='N'
            //   this.DetailData[i].ReceivedAtStoreFlag==true?this.DetailData[i].ReceivedAtStoreFlag='Y':this.DetailData[i].ReceivedAtStoreFlag='N'
            //   this.DetailData[i].ReadyforAuditorVerification==true?this.DetailData[i].ReadyforAuditorVerification='Y':this.DetailData[i].ReadyforAuditorVerification='N'

            //   this.DetailData[i].DeviationsByCA_In_AccOpen_Documents==true?this.DetailData[i].DeviationsByCA_In_AccOpen_Documents='Y':this.DetailData[i].DeviationsByCA_In_AccOpen_Documents='N'
            //   this.DetailData[i].DeviationsByCA_In_DPMvsAOF_Documents==true?this.DetailData[i].DeviationsByCA_In_DPMvsAOF_Documents='Y':this.DetailData[i].DeviationsByCA_In_DPMvsAOF_Documents='N'
            //   this.DetailData[i].DeviationsByCA_In_Sup_Documents==true?this.DetailData[i].DeviationsByCA_In_Sup_Documents='Y':this.DetailData[i].DeviationsByCA_In_Sup_Documents='N'
            //   this.DetailData1.push(this.DetailData[i])
            // }
            this.detailDataHeads=Object.keys(this.DetailData[0])
          }
          else {
            this.notif.error("No Data Found", '');
            return;
          }
        })
    
      }


      reset(){
        this.DetailData=[]
        this.detailDataHeads=[]
        this.BarCode=null;
        this.BoxNo=null;
        // this.model.From=new date()
        // this.ngOnInit();
      }
      reset1(){
        this.DetailData=[]
        this.detailDataHeads=[]
      }

      generateExcel(){
        if(this.DetailData==null){
           this.notif.warning("No Data Found", '');
            return;
        }

        if(this.model.mode=='POA Stamp'){
          this.exportData();
          return;
        }
        this.exportData1();
        // this.Excel(this.detailDataHeads,this.DetailData,this.model.mode);
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
      this.html = this.html + "</tr><tr>";
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

  getDtailsofStamp(head,data){
    if(head!='UserName'){
      return;
    }
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            RecordType:this.model.crforpostacc,
            FromDate : moment(this.model.From).format(AppConfig.dateFormat.apiMoment),
            ToDate : moment(this.model.To).format(AppConfig.dateFormat.apiMoment),
            ReportType:this.model.mode,
            AccSerialNo :this.AccSerialNo?this.AccSerialNo:0,
            BatchNo :this.BatchNo?this.BatchNo:0,
            BarCode :this.BarCode?this.BarCode:0,
            RoundId :this.RoundId?this.RoundId:0,
            BoxNo :this.BoxNo?this.BoxNo:0,
            KitNo :this.KitNo?this.KitNo:'',
            PendingFlag :this.model.Type?this.model.Type:'',
            ActionFlag :this.model.ActionType?this.model.ActionType:'',
            DailyStampFlag:'D',
            Euser :data?data:this.currentUser.userCode,
            DpType:this.model.DpType?this.model.DpType:'',
            AccountType:this.model.AccountType?this.model.AccountType:'',
            ReportSubType:this.model.ReportSubType?this.model.ReportSubType:''

          }],
        "requestId": "6055",
        "outTblCount": "0"
  
      }).then((response) => {
        // this.isSpinVisible = false;
        let data = this.utilServ.convertToResultArray(response[0]);
  
        if (data.length > 0) {
          this.modalon=true;
          this.DetailData1 = data;
        
          this.detailDataHeads1=Object.keys(this.DetailData1[0])
        }
        else {
          this.notif.error("No Data Found", '');
          return;
        }
      })

  }

  handleCancel(){
    this.modalon=false;
    this.DetailData1=[]
    this.detailDataHeads1=[]
  }

  exportData() {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          RecordType:this.model.crforpostacc,
          FromDate : moment(this.model.From).format(AppConfig.dateFormat.apiMoment),
          ToDate : moment(this.model.To).format(AppConfig.dateFormat.apiMoment),
          ReportType:this.model.mode,
          AccSerialNo :this.AccSerialNo?this.AccSerialNo:0,
          BatchNo :this.BatchNo?this.BatchNo:0,
          BarCode :this.BarCode?this.BarCode:0,
          RoundId :this.RoundId?this.RoundId:0,
          BoxNo :this.BoxNo?this.BoxNo:0,
          KitNo :this.KitNo?this.KitNo:'',
          PendingFlag :this.model.Type?this.model.Type:'',
          ActionFlag :this.model.ActionType?this.model.ActionType:'',
          DailyStampFlag:'E',
          Euser :this.currentUser.userCode,
          DpType:this.model.DpType?this.model.DpType:'',
          AccountType:this.model.AccountType?this.model.AccountType:'',
          ReportSubType:this.model.ReportSubType?this.model.ReportSubType:''
          // "exchange": ''
        }],
      "requestId": "6055",
      "outTblCount": "0"
    }

    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    // this.isSpinning = true;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {

      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error("No Data Found", '');
        return;

      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }

  
  exportData1() {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          RecordType:this.model.crforpostacc,
          FromDate : moment(this.model.From).format(AppConfig.dateFormat.apiMoment),
          ToDate : moment(this.model.To).format(AppConfig.dateFormat.apiMoment),
          ReportType:this.model.mode,
          AccSerialNo :this.AccSerialNo?this.AccSerialNo:0,
          BatchNo :this.BatchNo?this.BatchNo:0,
          BarCode :this.BarCode?this.BarCode:0,
          RoundId :this.RoundId?this.RoundId:0,
          BoxNo :this.BoxNo?this.BoxNo:0,
          KitNo :this.KitNo?this.KitNo:'',
          PendingFlag :this.model.Type?this.model.Type:'',
          ActionFlag :this.model.ActionType?this.model.ActionType:'',
          DailyStampFlag:'',
          Euser :this.currentUser.userCode,
          DpType:this.model.DpType?this.model.DpType:'',
          AccountType:this.model.AccountType?this.model.AccountType:'',
          ReportSubType:this.model.ReportSubType?this.model.ReportSubType:''
          // "exchange": ''
        }],
      "requestId": "6055",
      "outTblCount": "0"
    }

    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    // this.isSpinning = true;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {

      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error("No Data Found", '');
        return;

      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }
}
