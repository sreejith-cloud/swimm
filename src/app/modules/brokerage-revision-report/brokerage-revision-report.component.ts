import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, User } from 'shared';
export interface stateCodeModel {
  ReportingState:string
  StateCode:string
}
export interface regionCodeModel {
  REGION:string
  DESCRIPTION:string
}
export interface locationCodeModel {
  Location:string
  REGION:string
  Description:string
}
export interface tradeCodeModel {
  ClientCode:string
  ClientStatus:string
  Clientid:number
  Description:string
  Location:string
  Name:string
  TradeCode:string
  UCC:string
}
// export interface  counterTable{
//   Ins_code:string
//   Symbol:string
//   FixedBrokerage:string
//   NewFixedBrokerage:string
//   BrokerageDiscountpermissionFor_RM:string
//   BrokerageDiscountpermissionFor_SH:string
//   BrokerageDiscountpermissionFor_AD:string
//   EDApprovalreqd:string
// }
// export interface commudityTable{
//   Instrument:string
//   Product:string
//   Symbol:string
//   NormalBrok:string
//   CurNormalBrok:string
//   IntradayBrok:string
//   CurIntradayBrok:string
// }
@Component({
  selector: 'app-brokerage-revision-report',
  templateUrl: './brokerage-revision-report.component.html',
  styleUrls: ['./brokerage-revision-report.component.less']
})
export class BrokerageRevisionReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  isSpining:boolean=false
  stateFindopt:FindOptions
  stateCode:stateCodeModel
  regionFindopt:FindOptions
  regionCode:regionCodeModel
  locationFindopt:FindOptions
  locationCode:locationCodeModel
  tradeFindopt:FindOptions
  tradeCode:tradeCodeModel
  today:Date=new Date
  detailData:Array<any>=[]
  detailDataHeads:Array<any>=[]
  fromDate:Date
  toDate:Date
  brokerageType
  approvalStatus:string='P'
  currentUser:User
  showtableModel:boolean=false
  contrBrkDtsTable:Array<any>=[]
  commodityTable:Array<any>=[]
  constructor(private dataServ:DataService, private notif:NzNotificationService,private authServ:AuthService) {
    this.stateFindopt = {
      findType: 1000,
      codeColumn: 'StateCode',
      codeLabel: 'State',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.regionFindopt = {
      findType: 1004,//1004,
      codeColumn: 'REGION',
      codeLabel: 'Region',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.tradeFindopt = {
      findType: 5098,
      codeColumn: 'TradeCode',
      codeLabel: 'Tradecode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
   }
   disabledFutureDate = (current: Date): boolean => {
    return ( differenceInCalendarDays(current, this.today) > 0)
  };

  ngOnInit() {
    this.buttonSet()
  }
  buttonSet()
  {
    this.formHdlr.config.showPreviewBtn=true
    this.formHdlr.config.showExportExcelBtn=true
    this.formHdlr.config.showFindBtn=false
    this.formHdlr.config.showSaveBtn=false
  }
  view()
  {
    if(!this.fromDate)
    {
      this.notif.error("Please provide 'From' date", '',{ nzDuration: 1000});
      return
    }
    if(!this.toDate)
    {
      this.notif.error("Please provide 'To' date", '',{ nzDuration: 1000});
      return
    }
    if(moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) > moment(this.toDate).format(AppConfig.dateFormat.apiMoment))
    {
      this.notif.error("The 'From' date must have a greater value than the 'To' date", '',{ nzDuration: 1000});
      return
    }
    this.detailData = []
    this.detailDataHeads = []
    this.isSpining=true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "State":this.stateCode?(this.stateCode.ReportingState?this.stateCode.ReportingState:''):'',
          "region":this.regionCode?(this.regionCode.REGION?this.regionCode.REGION:''):'',
          "Loc":this.locationCode?(this.locationCode.Location?this.locationCode.Location:''):'',
          "FromDate":this.fromDate?moment(this.fromDate).format(AppConfig.dateFormat.apiMoment):'',
          "ToDate":this.toDate?moment(this.toDate).format(AppConfig.dateFormat.apiMoment):'',
          "tradecode":this.tradeCode?(this.tradeCode.TradeCode?this.tradeCode.TradeCode:''):'',
          "UpwardorDownward":this.brokerageType?this.brokerageType:'',
          "flag":0,
          "usercode":this.currentUser.userCode,
          "Pending":this.approvalStatus?this.approvalStatus:'P'
        }],
      "requestId": "10000108",
      "outTblCount": "0"
    })
      .then((response) => {
        console.log("responsess", response);
        if(response.errorCode == 0)
        {
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.detailData = data1;
            console.log(this.detailData);

            this.detailDataHeads = Object.keys(this.detailData[0])
            this.isSpining = false
          }
          else {
            this.notif.error('No Data found', '',{ nzDuration: 1000});
            this.isSpining = false
            return

          }
        }
        else{
          this.notif.error('No Data found', '',{ nzDuration: 1000});
          this.isSpining = false
          return
        }
      }
          else {
            this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
            this.isSpining = false
            return
          }



      },err=>{
        console.log(err);
        this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
        this.isSpining = false
        return
      })
  }
  excelExport()
  {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
      [{
        "State":this.stateCode?(this.stateCode.ReportingState?this.stateCode.ReportingState:''):'',
        "region":this.regionCode?(this.regionCode.REGION?this.regionCode.REGION:''):'',
        "Loc":this.locationCode?(this.locationCode.Location?this.locationCode.Location:''):'',
        "FromDate":this.fromDate?moment(this.fromDate).format(AppConfig.dateFormat.apiMoment):'',
        "ToDate":this.toDate?moment(this.toDate).format(AppConfig.dateFormat.apiMoment):'',
        "tradecode":this.tradeCode?(this.tradeCode.TradeCode?this.tradeCode.TradeCode:''):'',
        "UpwardorDownward":this.brokerageType?this.brokerageType:'',
        "flag":2,
        "usercode":this.currentUser.userCode?this.currentUser.userCode:'',
        "Pending":this.approvalStatus?this.approvalStatus:'P'
      }],
      "requestId": "10000108",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.isSpining = true;

    this.dataServ.generateReportmultiexcel(reqParams, isPreview).then((response) => {
      this.isSpining = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
        return;
      }
      else {
        if (!isPreview) {
          this.isSpining = false;
          this.notif.success('File downloaded successfully', '',{ nzDuration: 1000});
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
    });
  }
  detailsView(i)
  {
    console.log(this.detailData[i],"this.detailData[i]");
    // yourFunction() {
    //   // Perform the first API call
    //   const promise1 = this.apiService.callAPI1();

    //   // Perform the second API call
    //   const promise2 = this.apiService.callAPI2();

    //   // Use Promise.all() to handle both promises
    //   Promise.all([promise1, promise2])
    //     .then(([result1, result2]) => {
    //       // Both promises resolved successfully
    //       // Set your boolean value here
    //       this.yourBoolean = true;
    //     })
    //     .catch(error => {
    //       // Handle any errors that occurred during promise resolution
    //     });
    // }
    this.isSpining=true
    this.getcontrBrkDtsTable(i)
    this.getcommodityTable(i)
    this.showtableModel=true
  }
  handleCancel()
  {
    this.showtableModel=false
  }
  reset()
  {
    this.stateCode=undefined
    this.regionCode=undefined
    this.locationCode=undefined
    this.tradeCode=undefined
    this.fromDate=undefined
    this.toDate=undefined
    this.brokerageType=undefined
    this.approvalStatus='P'
    this.detailData=[]
    this.detailDataHeads=[]
  }
  getcontrBrkDtsTable(i)
  {
    this.contrBrkDtsTable = []

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Flag":"View",
          "SymbolType":"",
          "Symbol":"",
          "SlNo":this.detailData[i].BrkSlno?this.detailData[i].BrkSlno:'',
          "Location":this.detailData[i].Location?this.detailData[i].Location:'',
          "tradecode":this.detailData[i].Tradecode?this.detailData[i].Tradecode:'',
          "UporDown":"",
          "Futures_Symbol":"",
          "Futures_Product": "",
          "Futures_Brokerage":"0",
          "Euser":this.currentUser.userCode,
        }],
      "requestId": "1000082",//SpBrokerageReductionFoSymbolwise
      "outTblCount": "0"
    })
      .then((response) => {
        console.log("responsess", response);
        if(response.errorCode == 0)
        {
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.contrBrkDtsTable = data1;
            // this.contrBrkDtsTable.push(data1[0])
            // this.contrBrkDtsTable.push(data1[0])
            // this.contrBrkDtsTable.push(data1[0])
            console.log(this.detailData);

            // this.detailDataHeads = Object.keys(this.detailData[0])
            this.isSpining = false
          }
          else {
            // this.notif.error('No Data found', '',{ nzDuration: 1000});
            this.isSpining = false
            return

          }
        }
        else{
          // this.notif.error('No Data found', '',{ nzDuration: 1000});
          this.isSpining = false
          return
        }
      }
          else {
            // this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
            this.isSpining = false
            return
          }



      },err=>{
        console.log(err);
        // this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
        this.isSpining = false
        return
      })
  }
  getcommodityTable(i)
  {
    this.commodityTable = []
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Loc":this.detailData[i].Location?this.detailData[i].Location:'',
          "tradecode":this.detailData[i].Tradecode?this.detailData[i].Tradecode:'',
          "euser":this.currentUser.userCode,
          "slno":this.detailData[i].BrkSlno?this.detailData[i].BrkSlno:''
        }],
      "requestId": "10000111",//spgetClientCOMSymbolwise_CurBrokerage
      "outTblCount": "0"
    })
      .then((response) => {
        console.log("responsess", response);
        if(response.errorCode == 0)
        {
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.commodityTable =data1
            // this.commodityTable.push(data1[0])
            // this.commodityTable.push(data1[0])
            // this.commodityTable.push(data1[0])
            // this.commodityTable.push(data1[0])
            console.log(this.detailData);

            // this.detailDataHeads = Object.keys(this.detailData[0])
            this.isSpining = false
          }
          else {
            // this.notif.error('No Data found', '',{ nzDuration: 1000});
            this.isSpining = false
            return

          }
        }
        else{
          // this.notif.error('No Data found', '',{ nzDuration: 1000});
          this.isSpining = false
          return
        }
      }
          else {
            // this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
            this.isSpining = false
            return
          }



      },err=>{
        console.log(err);
        // this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
        this.isSpining = false
        return
      })
  }
  stateCodeChange()
  {
    console.log("stateCodeChange");
    this.regionFindopt =undefined
    setTimeout(() => {
      this.regionFindopt = {
        findType: 1004,
        codeColumn: 'REGION',
        codeLabel: 'Region',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: this.stateCode?`state = '${this.stateCode.ReportingState}'`:'1=1'
      }
    }, 10);
    // this.stateFindopt =undefined
    // setTimeout(() => {
    //   this.stateFindopt = {
    //     findType: 1000,
    //     codeColumn: 'StateCode',
    //     codeLabel: 'State',
    //     descColumn: '',
    //     descLabel: '',
    //     hasDescInput: false,
    //     requestId: 8,
    //     whereClause: '1=1'
    //   }
    //   console.log(this.stateFindopt);
    // }, 10);
  }
  regionCodeChange()
  {
    console.log("regionCodeChange");
    this.locationFindopt =undefined
    console.log(this.regionCode);

    setTimeout(() => {
      this.locationFindopt = {
        findType: 1003,
        codeColumn: 'Location',
        codeLabel: 'Location',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: this.regionCode?`region='${this.regionCode.REGION}'`:'1=1'
      }
      console.log(this.locationFindopt );

    }, 10);
    // this.regionFindopt =undefined
    // setTimeout(() => {
    //   this.regionFindopt = {
    //     findType: 1004,
    //     codeColumn: 'REGION',
    //     codeLabel: 'Region',
    //     descColumn: '',
    //     descLabel: '',
    //     hasDescInput: false,
    //     requestId: 8,
    //     whereClause: this.stateCode?'state='+this.stateCode.ReportingState:'1=1'
    //   }
    // }, 10);
  }
  locationCodeChange()
  {
    console.log("locationCodeChange");

    // this.locationFindopt =undefined
    // console.log(this.regionCode);

    // setTimeout(() => {
    //   this.locationFindopt = {
    //     findType: 1003,
    //     codeColumn: 'Location',
    //     codeLabel: 'Location',
    //     descColumn: '',
    //     descLabel: '',
    //     hasDescInput: false,
    //     requestId: 8,
    //     whereClause: this.regionCode?'region='+this.regionCode.REGION:'1=1'
    //   }
    //   console.log(this.locationFindopt );

    // }, 10);
  }
}
