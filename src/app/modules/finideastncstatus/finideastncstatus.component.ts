import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService,NzModalService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, UtilService } from 'shared';
import { FindOptions } from 'shared';
import { Subscriptiondata } from './SubscriptionData';

export interface reportFilter {
  tradeCode: any;
  fromDate: any;
  toDate: any;
  location: any;
  branch: any;
}

@Component({
  selector: 'app-finideastncstatus',
  templateUrl: './finideastncstatus.component.html',
  styleUrls: ['./finideastncstatus.component.less']
})
export class FinideastncstatusComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  clientFindOpt: FindOptions;
  locationFindopt:FindOptions;
  model: reportFilter;
  isLoading: boolean = false;
  listOfData: any[] = []
  GridHead: any;
  subscriptionData: any[]=[]
  changeSubscriptionDetails:any[]=[]
  today=new Date()
  updateActive:boolean=false

  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private modalService: NzModalService
  ) {
    this.loadSearch()
    this.model = <reportFilter>{};
  }

  ngOnInit() {
    var date = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // this.model.location = { Location: this.dataServ.branch };
  }
  ngAfterViewInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showSendMailbtn = false;
  }
  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.today) > 0)
  };
  setClientCode(data){
    this.model.location = { Location: data.Location };
  }
  setlocation(data){
    console.log(data);
    
    this.clientFindOpt = {
      findType: 5098,
      codeColumn: 'ClientCode',
      codeLabel: 'ClientCode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: "location ='" + data.Location + "'"
    }
  }

  ViewData() {
    if (!this.model.fromDate) {
      this.notif.error('Please Choose From Date', '');
      return
    }
    if (!this.model.toDate) {
      this.notif.error('Please Choose To Date', '');
      return
    }
    this.listOfData=[];
    this.subscriptionData.splice(0)
    this.subscriptionData=[];
    this.isLoading=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "flag": 'V',
          "tradecode": this.model.tradeCode ? this.model.tradeCode.ClientCode : '',
          "Loc":   this.model.location ? this.model.location.Location : '',
          "fromDate": moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) || '',
          "toDate": moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) || ''
        }],
      "requestId": "700037",
      "dbConn": this.dataServ.dbConn,
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response[0]) {
        this.listOfData = this.utilServ.convertToResultArray(response[0]);
        console.log(this.listOfData);
        this.isLoading=false
        for(let i=0;i<this.listOfData.length;i++){
          this.subscriptionData.push(new Subscriptiondata())
          this.subscriptionData[i].Location=this.listOfData[i].Location
          this.subscriptionData[i].TradeCode=this.listOfData[i].TradeCode
          this.subscriptionData[i].Name=this.listOfData[i].Name
          this.subscriptionData[i].TnC=this.listOfData[i].TnC
          this.subscriptionData[i].LastUpdatedDate=this.listOfData[i].LastUpdatedDate
          this.subscriptionData[i].IpAddress=this.listOfData[i].IpAddress
          this.subscriptionData[i].ActiveOrInactive=this.listOfData[i].Active_or_Inactive
          this.subscriptionData[i].clientid=this.listOfData[i].Clientid
        }
        if (this.listOfData.length>0) {
          this.GridHead = Object.keys(this.listOfData[0]);
        }else{
          this.notif.error('No data found', '')
          return;
        }
      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })
  }

  loadSearch(){
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
    this.clientFindOpt = {
      findType: 5098,
      codeColumn: 'ClientCode',
      codeLabel: 'ClientCode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: this.dataServ.branch == "HO" || this.dataServ.branch == "HOGT" ? '1=1' : "location ='" + this.dataServ.branch + "'"
    }
  }
  reset(){
    this.listOfData = [];
    this.GridHead = [];
    this.model.location = null
    this.model.tradeCode = null
    this.subscriptionData=[];
    this.changeSubscriptionDetails.splice(0)
    this.updateActive=false
  }
  changeSubscription(data){
    if(data.Cheque==true){
      this.changeSubscriptionDetails.push(data)
    }
    else{
      this.changeSubscriptionDetails.forEach((element,i) => {
        if(element.clientid==data.clientid){
          this.changeSubscriptionDetails.splice(i,1)
        }
      });
    }
    console.log("Data to be Changed",this.changeSubscriptionDetails);
    if(this.changeSubscriptionDetails.length>0){
      this.updateActive=true;
    }
    else{
      this.updateActive=false;
    }
  }
  Confirmation(){
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b> Do you want to change client subscription status?</b>',
      nzOnOk: () => {
        this.update()
      },
      nzOnCancel: () => {
      }
    })
  }
  update(){
    debugger
    let clientid='<document><data>'
    for(let i=0;i<this.changeSubscriptionDetails.length;i++)
    {
      console.log(this.changeSubscriptionDetails[i].clientid);
      clientid=clientid+`<new><clientid>${this.changeSubscriptionDetails[i].clientid}</clientid></new>`
    }
    clientid=clientid+'</data></document>'

    console.log('req',clientid);
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            "clientid": clientid,
            "FromDate": moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) || '',
            "ToDate": moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) || ''
          }],
        "requestId": "700316",
        "dbConn": this.dataServ.dbConn,
        "outTblCount": "0"
      }).then((response) => {
        this.isLoading = false;
        if (response && response[0]) {
          console.log(response);
          if(response[0].rows[0][0]==1){
            this.notif.success(response[0].rows[0][1],'')
          }
          else if(response[0].rows[0][0]==0){
            this.notif.error(response[0].rows[0][1],'')
          }
          else{
            this.notif.error('Failed to Update','')
          }
        }
      })
      this.ViewData()
      this.changeSubscriptionDetails=[]
      this.updateActive=false
  }
}
