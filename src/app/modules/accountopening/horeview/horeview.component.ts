import { Component, OnInit, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
import { dematmodel1 } from '../dstat';
import { Howl } from 'howler';
import {
  trigger,
  state,
  animate,
  transition,
  style
} from "@angular/animations";// by ishaq expansion and shrinking
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml'
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
export interface hoReview {
  PAN :any;
  slnumber:number;
  Location: any;
  TD: Date;
  FD: Date;
  state: any;
  Region: any;
  PanNo:any
  Trading:any;
  DP:any
  serielnumber:any
  holdername:any
  Cin:any
  uniqueCode:any
  kitno:any
  slno:any
  accslno:any
  crforpostacc:String
  barcodeid:number
  pouchno:number
  batchNo:any

}
@Component({
  selector: 'app-horeview',
  templateUrl: './horeview.component.html',
  styleUrls: ['./horeview.component.less'],
  animations: [
    trigger("slideInOutup", [
      // state("true", style({ height: "0px" })),// by ishaq expansion and shrinking
      state("true", style({ display: "none" })),
      // state("false", style({ display: "block" })),
      transition("* => *", animate("100ms linear"))
    ])
  ]

})
export class HoreviewComponent implements OnInit,AfterViewInit {
@ViewChild('batch5') batch: ElementRef;
  model: hoReview;
  inputMasks = InputMasks;
  panFindOption: FindOptions;
  currentUser: User;
  slnoFindOption:FindOptions
  accslnoFindOption:FindOptions
  barcodeFindOption:FindOptions;
  kitnoFindOption:FindOptions;
  batchNoFindOption:FindOptions;
  Deviations=[];
  DetailDataTemp=[]
  filteredData=[]
  data=[];
  state:string
  geojitUniqueCodeFindOption:FindOptions ;
  cinFindOption: FindOptions;
  HOSearchFlag:Boolean
  tablerow=[];
  EnrolDate:Date=new Date();
  today = new Date();
  totalData: any;
    passedtoauditor:boolean
    AcceptedDate:Date;
    hideval:boolean=false
    Tradecode:any;
    dateFormat = 'dd-MM-yyyy';
    filePreiewContent: string;
    filePreiewContentType: string;
    filePreiewFilename: string;
    filePreiewVisible: boolean;
    imgData: any;
    xmlData:any
    Location: any;
    buttonactive:boolean=true
    fromdate:Date=new Date()
    todate:Date=new Date();
    FileTypelist=[];
    FileTypelist1=[];
    temparray=[];
    Trading:Boolean
    NSDL:Boolean
    CDSL:Boolean
    history:boolean=true
    B2BPartner:boolean
    ProcessFlowStatus:String
    B2B:Boolean
    holdername:String
    holderpan:string
    code:String
    acctype:String
    FinalStatus:String
    dpcode:String
        DeviationsByCA_In_AccOpen_Documents:boolean
    DeviationsByCA_In_DPMvsAOF_Documents:boolean
    DeviationsByCA_In_Sup_Documents:boolean
    ReadyforAuditorVerification:Boolean
     AuditDeviationClearedDate:Date
     CAVerificationDate:Date
     AutoMailBranchesOn:Date=new Date();
    subtype:String
    dcmntrecieved:boolean
    receiveddate:Date
    holderno:number
    TempDPClientID:number
    ClientId:number
    batchno:number
    poasigned:boolean
    poasigneddate:Date
    isVisibleRejection:Boolean=false
    poadebited:boolean
    poadebiteddate:Date
    poastamped:boolean
    tradingregionname:string
    TradingLocation:string
    HOReviewFlag:String
    tradecode:string
    tradinglocname:string
    isSpinning:boolean
    dpaccid:string
    MTF:boolean
    tablerow1=[]
    HOReviewFlags=[]
    dpaccbenid:string
    initialstatus:string
    updatestaus:string
    boxno:number
    barcodeid:number
    timeout=null;
    tempboolean:boolean=false
  showLeftSide:boolean = false;
  urlvalue:String
  tablecontent: dematmodel1 = new dematmodel1()
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private modalService: NzModalService
  ) {
    this.model = <hoReview>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadsearch();
   

  }
  
ngAfterViewInit(){
    this.batch.nativeElement.focus()
  }
  ngOnInit() {
    this.tablerow=[];
    this.tablerow.push(this.tablecontent); 
    // this.tablerow[0].Slno=this.tablerow.length 
    this.model.crforpostacc='POSTACCOPEN' 
    this.getSettingsData();
    this.HOReviewFlags=[{ "code": "P", "Mode": 'Pending' },
    { "code": "N", "Mode": 'Pending' },
    { "code": "S", "Mode": 'Solved' },
    { "code": "R", "Mode": 'Unsolved' },
    { "code": "M", "Mode": 'Remove' }
  ]
  }

   getSettingsData(){

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{

              Euser:this.currentUser.userCode
            }],
          "requestId": "6039",
          "outTblCount": "0"
        }).then((response) => {
          console.log(response)
          if(response.errorCode==0){
           this.Deviations= response.results[1]
          }
          if(response.errorCode==1){
            this.notif.error(response.errorMsg,'')
          }
        })
      }

  loadsearch(){
    this.panFindOption = {
      findType: 3004,
      codeColumn: 'PouchSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"


    }
    this.geojitUniqueCodeFindOption = {
      findType: 3004,
      codeColumn: 'ClientCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause:"1=1"
    }
    this.cinFindOption = {
      findType: 3004,
      codeColumn: 'DpAccountBenId',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.kitnoFindOption = {
      findType: 3004,
      codeColumn: 'KitNumber',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.slnoFindOption = {
      findType: 3004,
      codeColumn: 'BookletSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.accslnoFindOption = {
      findType: 3004,
      codeColumn: 'AccountSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.barcodeFindOption = {
      findType: 3004,
      codeColumn: 'BarCodeId',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"


    }
    this.batchNoFindOption = {
      findType: 3004,
      codeColumn: 'LastBatchNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"


    }
  }


  Addrow() {
    // if (field.folioNo || field.certificateNos || field.quantity || field.distinctiveFrom || this.tablecontent.distinctiveTo) {
      // this.tablecontent.SLNo=idx;
      this.tablecontent = new dematmodel1();
      this.tablerow.push(this.tablecontent)
      // this.tablerow[i+1].Slno=this.tablerow.length
    // }
  }

  delete(index) {
    if (this.tablerow.length > 1) {
      this.tablerow.splice(index, 1);
      // this.onchangeQuantity()
    }
  }

  toggleCenter() {
    
    if (!this.showLeftSide) {
      this.showLeftSide = true;
    }
    else {
      this.showLeftSide = false;
    }
  }

  play(){
    let audio = new Audio();
    audio.src = "assets/img/accessdenied.mp3";
    audio.load();
    audio.play();
    }

 
  getData() {
    // if(this.model.PanNo==null||this.model.Cin==null||this.model.kitno==null||this.model.uniqueCode==null||this.model.slno==null||this.model.accslno==null){
    //   this.notif.warning('warning','Required Field is missing')
    // }
// this.isSpinning=true;
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
            RecordType:this.model.crforpostacc,
             AccSerialNo:this.model.accslno? this.model.accslno.AccountSerialNo:0,
             BatchNo:this.model.batchNo?this.model.batchNo.LastBatchNo:0,
             Euser:this.currentUser.userCode
      }],
    "requestId": "6049",
    "outTblCount": "0"
  }).then((response) => {
    if (response && response.results) {
      if(response.results[0][0].ProcessDescription!=null){
        var data =response.results[0][0].ProcessDescription
        this.warning1(data);
        this.play();
        this.reset1();
        return;
      }
      if(response.results[0][0].Msg!=null){
        this.warning();
        // this.play();
        this.reset();
        return;
      }
      if(response.results[1] && response.results[1].length>0){
        this.tablerow=response.results[1]
        for (let i = 0; i < this.tablerow.length; i++) {
          if (this.tablerow[i].HOReviewFlag == false) {
            this.tablerow[i].HOReviewFlag = 'N';
          }
        }
      }
       if(response.results[2] && response.results[2].length>0){
        this.tablerow1=response.results[2]

        for (let i = 0; i < this.tablerow1.length; i++) {
          if (this.tablerow1[i].HOReviewFlag == false) {
            this.tablerow1[i].HOReviewFlag = 'N';
          }
        }
      }
        
    

      this.HOSearchFlag=response.results[0][0].HOSearchFlag
      if(this.HOSearchFlag==false){
        this.isVisibleRejection=true
       this.play()
        return;
        }else{
          this.isVisibleRejection=false;
        }
     this.Trading= response.results[0][0].Trading_Account
     this.NSDL= response.results[0][0].NSDL_Account
     this.CDSL= response.results[0][0].CDSL_Account
     this.poasigned=response.results[0][0].POASigned
     this.poasigneddate=response.results[0][0].POASignedDate?response.results[0][0].POASignedDate:''
     this.poadebited=response.results[0][0].POADebited
     this.poadebiteddate=response.results[0][0].POADebitedDate?response.results[0][0].POADebitedDate:''
     this.poastamped=response.results[0][0].POAStamped
     this.tradingregionname=response.results[0][0].TradingRegionName
     this.TradingLocation=response.results[0][0].TradingLocation
     this.tradecode=response.results[0][0].TradingTradeCode
     this.tradinglocname=response.results[0][0].TradingLocationName
     this.dpaccid=response.results[0][0].DpAccountId
     this.dpaccbenid=response.results[0][0].DpAccountBenId
     this.initialstatus=response.results[0][0].FirstHolder_KRAInitialStatus
     this.updatestaus=response.results[0][0].FirstHolder_KRAUpdateStatus
     this.TempDPClientID=response.results[0][0].TempDPClientID
     this.ClientId=response.results[0][0].ClientId
      this.model.pouchno=response.results[0][0].PouchSerialNo
     this.MTF=response.results[0][0].MTFAccount 
     this.EnrolDate=response.results[0][0].EnrolDate
     this.tradingregionname=response.results[0][0].REGION
     this.tradinglocname=response.results[0][0].TradingLocation
     this.initialstatus=response.results[0][0].KRA_InitialStatus
     this.updatestaus=response.results[0][0].KRA_UpdateStatus
     this.DeviationsByCA_In_AccOpen_Documents=response.results[0][0].DeviationsByCA_In_AccOpen_Documents
     this.DeviationsByCA_In_DPMvsAOF_Documents=response.results[0][0].DeviationsByCA_In_DPMvsAOF_Documents
     this.DeviationsByCA_In_Sup_Documents=response.results[0][0].DeviationsByCA_In_Sup_Documents
     this.state=response.results[0][0].ReportingState
     this.AuditDeviationClearedDate=response.results[0][0].AuditDeviationClearedDate
      
    //  this.ProcessFlowStatus=response.results[0][0].DeviationsByCA_In_AccOpen_Documents
    //  if(response.results[0][0].B2B_Partner==""){
    //   this.B2BPartner=false
    //  }else if(response.results[0][0].B2B_Partner==true){
    //   this.B2BPartner=true
    //  }
    this.B2BPartner=response.results[0][0].B2B_Partner
     if(response.results[0][0].B2B_Account==""){
      this.B2B=false
     }else if(response.results[0][0].B2B_Account==true){
      this.B2B=true
     }
     this.holdername= response.results[0][0].FirstHolderName
     this.holderpan= response.results[0][0].Pan
     this.code= response.results[0][0].TradingAccType
     this.acctype= response.results[0][0].TradingAccName
     this.dpcode= response.results[0][0].DpAccType
     this.subtype= response.results[0][0].DpAccSubType
     this.holderno= response.results[0][0].NoOfHolders
     this.boxno=response.results[0][0].BoxNo
     this.dcmntrecieved=response.results[0][0].BookReceivedFlag
     this.receiveddate=response.results[0][0].BookReceivedDate
     this.passedtoauditor =true
      // this.isSpinning=false;
      // for(var i=0;i<this.totalData.length;i++){
      //   if(this.totalData[i].POADebited==true){
      //     this.totalData[i].POADebited='Y'
      //   }else if(this.totalData[i].POADebited==false){
      //     this.totalData[i].POADebited='N'
      //   }
      //   if(this.totalData[i].POA_Stamped==true){
      //     this.totalData[i].POA_Stamped='Y'
      //   }else if(this.totalData[i].POA_Stamped==false){
      //     this.totalData[i].POA_Stamped='N'
      //     this.hideval=true
      //   }
      //   // this.totalData.push(this.totalData[i]);
      //   };
      // this.totalData.forEach(element => {
      //   if(element.POADebited==true){
      //     element.POADebited='Y'
          
      //   }
      //   else{
      //     element.POADebited='N'
         
      //   }
      //   if(element.POA_Stamped==true){
      //     element.POA_Stamped='Y'
      //   }
      //   else{
      //     element.POA_Stamped='N'
      //   }
      //   if(element.received==true || element.received=='Y'){
      //     element.received='Y'
      //   }else if(element.received==false || element.received=='N'){
      //     element.received='N'
      //   }else if(element.received=='X'){
      //     element.received=null
      //   }
      // });
        // console.log( this.totalData)
    }
// this.isSpinning=false;

  })
}

onChangeRegion(data){
  this.tablerow=[];
    this.tablerow.push(this.tablecontent); 
    this.DetailDataTemp=[]
  // this.holdername= null
  //    this.holderpan= null
  //    this.code= null
  //    this.acctype= null
  //    this.dpcode= null
  //    this.subtype= null
  //    this.holderno= null
  //    this.Trading=false
  //    this.NSDL=false
  //    this.CDSL=false
  //    this.B2B=false
  this.model.PanNo=data
  this.model.Cin=data
  this.model.uniqueCode=data
  this.model.kitno=data
  this.model.slno=data
  this.model.accslno=data
  this.model.batchNo=data
  // this.model.barcodeid=data
  if(data!=null){
    // this.batchno=data.LastBatchNo
  this.getData();
   this.buttonactive=false
        }else{
          this.buttonactive=true
        }
}

    save(){
      this.tempboolean=false
    if(this.AutoMailBranchesOn==null){
      this.notif.warning("Please select AutoMail to branches",'')
      return;
    }

    this.tablerow.forEach(element => {
      if (element.HOReviewFlag==false) {
        this.tempboolean=true
       
      }
    });

    if(this.tempboolean){
      this.notif.warning("Please select HOReviewFlag ",'')
        
      return;
    }

    // if(){

    // }
  //     if(this.HOSearchFlag==false){
  //   this.isVisibleRejection=true
  //  this.play()
  //   return;
  //   }else{
  //     this.isVisibleRejection=false;
  //   }
      // console.log(this.totalData)
  // this.totalData.forEach(item => {  
  //   if(item.approveValue!=null){
  //           ApprovalDetails=ApprovalDetails+(item.TradeCode)+'|'+item.approveValue+','
  //   }
  //   });
    this.tablerow.forEach((element ,index)=> {
      if(element.Slno>=1){

      }else{
        element.Slno=Number(index)+1
      }
    
  });

  let dataArray=[]
this.tablerow.forEach(element => {

  let x=element.Solution;
  if(x!=null){
  let obj={
    Solution:x.Solution?x.Solution:x,
    HOReviewFlag:element.HOReviewFlag,
    HORemarks:element.HORemarks,
    Slno:element.Slno
  }
  dataArray.push(obj)
  }else{
    dataArray=this.tablerow
  }

});
  
  var JSONData = this.utilServ.setJSONArray(dataArray);
  var xmlData = jsonxml(JSONData);
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        RecordType:this.model.crforpostacc,
        AccSerialNo:this.model.accslno? this.model.accslno.AccountSerialNo:0,
        BatchNo:this.model.batchNo?this.model.batchNo.LastBatchNo:0,
        XML_HOReview:xmlData,
        Euser:this.currentUser.userCode,
        AutoMailBranchesOn:moment(this.AutoMailBranchesOn).format(AppConfig.dateFormat.apiMoment),
        FinalStatus:this.FinalStatus?this.FinalStatus:'',
        ReadyforAuditorVerification:this.ReadyforAuditorVerification==true?'Y':'N',
        Remarks:''
      }],
    "requestId": "6050",
    "outTblCount": "0"
  }).then((response) => {
    console.log(response)
    if(response.errorCode==0){
      this.notif.success("HO Review Saved Successfully",'')
      this.reset();
    }
    if(response.errorCode==1){
      this.notif.error(response.errorMsg,'')
    }
  })
}


processComplete(){
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        Type:'H',
        RecordType:this.model.crforpostacc,
        AccSerialNo:this.model.accslno? this.model.accslno.AccountSerialNo:0,
        Euser:this.currentUser.userCode
      }],
    "requestId": "6072",
    "outTblCount": "0"
  }).then((response) => {
    console.log(response)
    if(response.errorCode==0){
      this.notif.success("Booklet closed by HO",'')
    }
    if(response.errorCode==1){
      this.notif.error(response.errorMsg,'')
    }
  })
}

reset(){
   this.model.PanNo=null;
  this.model.Cin=null;
  this.model.uniqueCode=null;
  this.model.kitno=null;
  this.model.uniqueCode=null;
  this.model.slno=null;
  this.model.accslno=null;
  this.totalData=[];
  this.boxno=null
  this.tablerow=[];
 this.tablecontent= new dematmodel1();
  this.tablerow.push(this.tablecontent);
  this.Trading= null
     this.NSDL= null
     this.CDSL= null
     this.poasigned=null
     this.poasigneddate=null
     this.poadebited=null
     this.poadebiteddate=null
     this.poastamped=null
     this.tradingregionname=null
     this.TradingLocation=null
     this.tradecode=null
     this.tradinglocname=null
     this.dpaccid=null
     this.dpaccbenid=null
     this.initialstatus=null
     this.updatestaus=null
     this.TempDPClientID=null
     this.ClientId=null
     this.holdername= null
     this.holderpan= null
     this.code= null
     this.acctype= null
     this.dpcode=null
     this.subtype= null
     this.holderno= null
     this.boxno=null
     this.dcmntrecieved=null
     this.receiveddate=null
     this.model.pouchno=null
     this.FinalStatus=''
     this.DeviationsByCA_In_AccOpen_Documents=false;
     this.DeviationsByCA_In_DPMvsAOF_Documents=false;
     this.DeviationsByCA_In_Sup_Documents=false;
     this.barcodeid=null;
     this.state=''
     this.urlvalue=''
     this.EnrolDate=null
     this.passedtoauditor=false
     this.ngOnInit();

}

reset1(){
  this.model.PanNo=null;
 this.model.Cin=null;
 this.model.uniqueCode=null;
 this.model.kitno=null;
 this.model.uniqueCode=null;
 this.model.slno=null;
 this.model.accslno=null;
 this.totalData=[];
 this.boxno=null
 this.tablerow=[];
this.tablecontent= new dematmodel1();
 this.tablerow.push(this.tablecontent);
 this.Trading= null
    this.NSDL= null
    this.CDSL= null
    this.poasigned=null
    this.poasigneddate=null
    this.poadebited=null
    this.poadebiteddate=null
    this.poastamped=null
    this.tradingregionname=null
    this.TradingLocation=null
    this.tradecode=null
    this.tradinglocname=null
    this.dpaccid=null
    this.dpaccbenid=null
    this.initialstatus=null
    this.updatestaus=null
    this.TempDPClientID=null
    this.ClientId=null
    this.holdername= null
    this.holderpan= null
    this.code= null
    this.acctype= null
    this.dpcode=null
    this.subtype= null
    this.holderno= null
    this.boxno=null
    this.dcmntrecieved=null
    this.receiveddate=null
    this.model.pouchno=null
    this.FinalStatus=''
    this.DeviationsByCA_In_AccOpen_Documents=false;
    this.DeviationsByCA_In_DPMvsAOF_Documents=false;
    this.DeviationsByCA_In_Sup_Documents=false;
    this.state=''
    this.urlvalue=''
    // this.barcodeid=null;
    this.ngOnInit();

}

getHistoryData(index,data){
  if(this.tablerow1.length>0){
    this.DetailDataTemp=[]
    
     for(var i=0; i<=this.tablerow1.length-1;i++){
        if(this.tablerow1[i].Slno==data.Slno){
          this.DetailDataTemp.push(this.tablerow1[i])
          this.history=false;
        }
      }

  }else{
    return;
  }

}


handleCancel(){
  this.isVisibleRejection=false
  this.reset()
}

getBarcodeData(){
  clearTimeout(this.timeout);
  this.timeout = setTimeout(() => {
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        BarCodeId:this.barcodeid?this.barcodeid:0,
        Euser:this.currentUser.userCode
      }],
    "requestId": "6057",
    "outTblCount": "0"
  }).then((response) => {
    console.log(response)
    if(response.errorCode==0){
      this.data=response.results[0][0]
  if(this.data!=null){
   this.onChangeRegion(this.data)
  }else{
    this.notif.error("Barcode does not exist",'')
  this.reset();
  }
      // this.onPrintInvoice();
    }
    if(response.errorCode==1){
      this.notif.error(response.errorMsg,'')
    }
  })
}, 700)
}

  getFilterdData(val) {
    if (val == null) {
      this.filteredData = []
      return
    }
    let data = val
    this.filteredData = this.Deviations.filter((ele) => {
      return ele.Solution.includes(data)
    })
  }

  warning(): void {
    this.modalService.warning({
      nzTitle: 'Warning',
      nzContent: 'Booklet is finalised for box no generation'
    });
  }

  warning1(data): void {
    this.modalService.warning({
      nzTitle: 'Warning',
      nzContent: 'Booklet is in'+" "+"["+data+"]"
    });
  }

  formProvider(){
    var method="post";
    var form, key, hiddenField;
    var target="_blank"
    var url_path="http://www.geojit.net/aspx2/ClientRegistration/PrintDoc.aspx"
    form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("target", target);
    form.setAttribute("action", url_path);
    var paramValues={
      "Id":this.model.accslno.AccountSerialNo,
      "DB":"GFSL2019",
      "UserCode":"02230",
      "flag":"AO",
      "type":"HO",
      "ScanImageId":"0"  
  }
    // var target
    for (key in paramValues) {
      if (paramValues.hasOwnProperty(key)) {
          hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", paramValues[key]);
          form.appendChild(hiddenField);
      }
        }
        return form;
  }
  
  callURL(){
    var form = this.formProvider()
    document.body.appendChild(form);
    form.submit();
  }

  PDFView(){


    if(this.NSDL){
    this.urlvalue="http://www.geojit.net/aspx2/Depository/dcobdocview.aspx"
    }else if(this.CDSL){
      this.urlvalue="http://www.geojit.net/ASPX/CDSLDepository/dcobdocview.aspx"
    }
    
    let url1 =this.urlvalue+'?SerialNo='+this.model.accslno.AccountSerialNo+'&Flag='+0// let url ='http://gtldemo.fliplabs.net/smartfolio/#/smartfolio?loginData='+data.tradecode+'&sessionid='+this.sessionkey+'&type=BOCC'
    window.open(url1)
    }

    disabledFutureDate = (current: Date): boolean => {
      // Can not select days before today and today
  
      return differenceInCalendarDays(current, this.today) > 0;
    };

    nextTextBoxFocus(index) {debugger
      if(index>=(this.tablerow.length-1))
      {
        return
      }
      var elememnt = document.getElementById('AuditorFinding' + (index + 1))
      elememnt.focus();
    }

}
