import { Component, OnInit, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InputMasks, InputPatterns } from 'shared';
export interface box {
  crforpostacc:String
  From:Date
  barcodeid:any;
}
@Component({
  selector: 'app-boxnumbergnrtn',
  templateUrl: './boxnumbergnrtn.component.html',
  styleUrls: ['./boxnumbergnrtn.component.less']
})
export class BoxnumbergnrtnComponent implements OnInit,AfterViewInit {
   @ViewChild('batch6') batch: ElementRef;
  model:box
  dateforreport=new Date()
  dateforreport1=moment(this.dateforreport).format(AppConfig.dateFormat.apiMoment)

  currentUser: User;
  buttonactive:boolean=true
  inputMasks = InputMasks;
  isSpinVisible:boolean
  DetailData=[]
  DetailData1=[]
  detailDataHeads=[]
  Trading:Boolean
    NSDL:Boolean
    Slno:number
    strorename:string
    height=30;
    width=1;
    fontSize = 10;
    CDSL:Boolean
    B2BPartner:boolean
    B2B:Boolean
    AccountSerialNo:number
    holdername:String
    holderpan:string
    BarCodeId:number
    TempDPClientID:number
    ClientId:number
    code:String
    acctype:String
    EnrolDate:Date
    MTF:boolean;
    dpcode:String
    subtype:String
    dcmntrecieved:boolean
    receiveddate:Date
    kitnumber:string
    holderno:number
    batchno:number
    value:number
    poasigned:boolean
    poasigneddate:Date
    poadebited:boolean
    poadebiteddate:Date
    poastamped:boolean
    tradingregionname:string
    TradingLocation:string
    tradecode:string
    tradinglocname:string
    dpaccid:string
    passedtoauditor:boolean
    dpaccbenid:string
    initialstatus:string
    updatestaus:string
    boxno:number
    pouchno:string
    barcodeid:number
    timeout=null;
  barcodeFindOption:FindOptions
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private modalService: NzModalService
  ) {
    this.model = <box>{

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
    this.model.crforpostacc='POSTACCOPEN'
    this.model.From=new Date();
    this.getSettingsData();
  }

  loadsearch(){
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
  }


  getdata() {
    // this.isSpinVisible = true;

    let val;
    this.reset2()
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "BarCodeId":this.barcodeid?this.barcodeid:0,
          "EUser" :this.currentUser.userCode,
          "RecordType":this.model.crforpostacc
        }],
      "requestId": "6036",
      "outTblCount": "0"

    }).then((response) => {
      // this.isSpinVisible = false;

      if(response.results[0][0].Msg!=null){
        var data=response.results[0][0].ProcessDescription
        var Msg=response.results[0][0].Msg
        this.warning(data,Msg);
        this.play();
        this.reset1();
        return;
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
           this.tradinglocname=response.results[0][0].TradingAccName
           this.dpaccid=response.results[0][0].DpAccountId
           this.dpaccbenid=response.results[0][0].DpAccountBenId
           this.initialstatus=response.results[0][0].FirstHolder_KRAInitialStatus
           this.updatestaus=response.results[0][0].FirstHolder_KRAUpdateStatus
           this.TempDPClientID=response.results[0][0].TempDPClientID
           this.ClientId=response.results[0][0].ClientId
           this.pouchno=response.results[0][0].PouchSerialNo
           this.dcmntrecieved=response.results[0][0].BookReceivedFlag==true?true:false
           this.passedtoauditor=response.results[0][0].PassedToAuditorFlag==true?true:false;
           this.receiveddate=response.results[0][0].BookReceivedDate?response.results[0][0].BookReceivedDate:new Date()
           this.kitnumber=response.results[0][0].KitNumber
           this.BarCodeId=response.results[0][0].BarCodeId
           this.value=this.BarCodeId
           this.AccountSerialNo=response.results[0][0].AccountSerialNo
           this.Slno=response.results[1][0].Slno
           this.boxno=response.results[1][0].boxno
          this.MTF=response.results[0][0].MTFAccount 
          this.EnrolDate=response.results[0][0].EnrolDate
          this.tradingregionname=response.results[0][0].REGION
          this.tradinglocname=response.results[0][0].TradingLocation
          this.initialstatus=response.results[0][0].KRA_InitialStatus
          this.updatestaus=response.results[0][0].KRA_UpdateStatus
          //  this.boxno=response.results[2][0].boxno
          //  this.slno=response.results[2][0].Slno
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
           this.boxno= response.results[1][0].Gen_BoxNo
           this.Slno= response.results[1][0].Gen_BoxSubNo
            setTimeout(()=>{  
           let el: HTMLElement = document.getElementById('btnPrint') as HTMLElement;
            el.click();
            }, 1000) 
          //  setTimeout(()=>{  
          //   let el: HTMLElement = document.getElementById('btnPrint') as HTMLElement;
          //   el.click();
          //   this.reset();
          // }, 7000) 
    })

  }


  // onChangeRegion(data){
  //   this.model.barcodeid=data
  //   if(data!=null){
  //   this.getdata();
  //   }
  // }


  // save(){
      
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
       
  //          barcodeid:this.model.barcodeid?this.model.barcodeid.barcodeid:'',
  //          Boxno:this.boxno?this.boxno:0,
  //           Euser:this.currentUser.userCode
  //       }],
  //     "requestId": "6052",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     console.log(response)
  //     if(response.errorCode==0){
  //       this.notif.success("Box Number Saved SuccessFully",'')
        
  //     }
    
        
        
  //     if(response.errorCode==1){
  //       this.notif.error(response.errorMsg,'')
  //     }
  //   })
    
  // }


  reset(){
    this.model.barcodeid=null
    this.boxno=null
    this.tradingregionname=null;
    this.TradingLocation=null;
    this.tradecode=null;
    this.tradinglocname=null;
    this.dpaccid=null;
    this.dpaccbenid=null;
    this.initialstatus=null;
    this.updatestaus=null;
    this.holderno=null
    this.holdername=null;
    this.holderpan=null;
    this.pouchno=null;
    this.barcodeid=null;
      this.Trading= null
     this.NSDL= null
     this.CDSL= null
     this.poasigned=null
     this.poasigneddate=null
     this.poadebited=null
     this.poadebiteddate=null
     this.poastamped=null
     this.passedtoauditor=null
     this.tradingregionname=null
     this.TradingLocation=null
     this.tradecode=null
     this.tradinglocname=null
     this.dpaccid=null
     this.dpaccbenid=null
     this.EnrolDate=null
     this.code=null
     this.dpcode=null
     this.dpaccid=null
     this.dpaccbenid=null
     this.acctype=null
     this.subtype=null
     this.receiveddate=null

  }
  reset1(){
    this.model.barcodeid=null
    this.boxno=null
    this.tradingregionname=null;
    this.TradingLocation=null;
    this.tradecode=null;
    this.tradinglocname=null;
    this.dpaccid=null;
    this.dpaccbenid=null;
    this.initialstatus=null;
    this.updatestaus=null;
    this.holderno=null
    this.holdername=null;
    this.holderpan=null;
    this.pouchno=null;
    // this.barcodeid=null;
  }


  getBarcodeData(){
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    if(this.barcodeid!=null||this.barcodeid!=undefined){
      this.getdata();
     
    }else{
      return;
    }
  }, 1000)
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
           this.strorename=response.results[0][0].PostAcc_StoreName
          }
          if(response.errorCode==1){
            this.notif.error(response.errorMsg,'')
          }
        })
      }

      warning(data,Msg): void {
        if(data==undefined){
          this.notif.warning("Barcode does not exist",'')
          return;
        }
        this.modalService.warning({
          nzTitle: 'Warning',
          nzContent: Msg+"............ "+"["+data+"]"
        });
      }

      play(){


        let audio = new Audio();
        audio.src = "assets/img/Final.mp3";
        audio.load();
        audio.play();
        }
        reset2(){
          this.model.barcodeid=null
          this.boxno=null
          this.tradingregionname=null;
          this.TradingLocation=null;
          this.tradecode=null;
          this.tradinglocname=null;
          this.dpaccid=null;
          this.dpaccbenid=null;
          this.initialstatus=null;
          this.updatestaus=null;
          this.holderno=null
          this.holdername=null;
          this.holderpan=null;
          this.pouchno=null;
          // this.barcodeid=null;
            this.Trading= null
           this.NSDL= null
           this.CDSL= null
           this.poasigned=null
           this.poasigneddate=null
           this.poadebited=null
           this.poadebiteddate=null
           this.poastamped=null
           this.passedtoauditor=null
           this.tradingregionname=null
           this.TradingLocation=null
           this.tradecode=null
           this.tradinglocname=null
           this.dpaccid=null
           this.dpaccbenid=null
           this.EnrolDate=null
           this.code=null
           this.dpcode=null
           this.dpaccid=null
           this.dpaccbenid=null
           this.acctype=null
           this.subtype=null
           this.receiveddate=null
      
        }

}
