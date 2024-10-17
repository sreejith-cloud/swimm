import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent } from "shared";



@Component({
  templateUrl: './mtflocaproval.component.html',
  styleUrls: ['./mtflocaproval.component.less'],
  // animations: [bounceInOutAnimation]
})

export class MtfLocAprovalComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  TradeFindopt: FindOptions;
  locationFindopt:FindOptions ;
  isSpinning:boolean=false;
   currentUser: User;
  totalData: any=[];
  Tradecode:any;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  imgData: any;
  Location: any;
  fromdate:Date=new Date()
  todate:Date=new Date();

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService
  ) {


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
      whereClause: "1=1"
      // whereClause: "ReportingState ='" + data.ReportingState + "'"
    }
    this.TradeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
  }
reset(){
  this.Tradecode=null;
  this.Location=null;
  this.todate=new Date();
  this.fromdate=new Date();
  this.totalData=[];
  this.imgData=[]
}
  ngOnInit() {
  this.formHdlr.setFormType('viewsave');


  }

  showModal(data) {
          
      let IData=this.imgData.filter((ele)=>{
            return ele.TradeCode==data
      })
      this.filePreiewContent = IData[0].Doc
      this.filePreiewFilename = IData[0].DocName
      this.filePreiewContentType = IData[0].DocType
      this.filePreiewVisible = true;
      console.log(this.filePreiewContent)
  }

  getData() {
        
    this.isSpinning=true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
           Flag:'RPT',
           Location:this.Tradecode?this.Tradecode:'',
            FromDate :this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            ToDate :this.todate? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
           Tradecode:this.Location?this.Location:'',
           DPID:'',
           DPClientid:'',
           ApprovalDetails:'',
           Euser:this.currentUser.userCode
          }],
        "requestId": "5059",
        "outTblCount": "0"
      }).then((response) => {
        console.log(response)
        if (response && response.results) {
          this.totalData=response.results[0]
          this.totalData.forEach(element => {
            element.approveValue=null
          });
          this.imgData=response.results[1]
          console.log(this.imgData)
        }
    this.isSpinning=false;

      })
    }
    save(){
      // console.log(this.totalData)
      var ApprovalDetails:any=""
      this.totalData.forEach(item => {  
        if(item.approveValue!=null){
                ApprovalDetails=ApprovalDetails+(item.TradeCode)+'|'+item.approveValue+','
        }
        });
        console.log(ApprovalDetails)
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
           Flag:'SAVE',
           Location:'',
           FromDate:'',
           ToDate:'',
           Tradecode:'',
           DPID:'',
           DPClientid:'',
           ApprovalDetails:ApprovalDetails?ApprovalDetails:'',
           Euser:this.currentUser.userCode
          }],
        "requestId": "5059",
        "outTblCount": "0"
      }).then((response) => {
        console.log(response)
        if(response.errorCode==0){
          this.notif.success("SuccessFully Saved",'')
        }
        if(response.errorCode==1){
          this.notif.error(response.errorMsg,'')
        }
      })
    }
}
