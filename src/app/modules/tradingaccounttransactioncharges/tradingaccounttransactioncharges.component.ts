import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, User, UtilService } from 'shared';
import { CollectionrequestsService } from '../collectionrequests/collectionrequests.service';
import { environment } from 'src/environments/environment';
export interface PostAccountOpening {
  location:any;
  date:any
  name:any
  margintype:string
  kitno:any
  pan:any
  PaymentOption:any
  bankorcash:any
  chequeno:any
  Tradecode:any
  Agreementcharges:boolean
  dpcharges:boolean
  stamp:any
  reportType:any
  charge:any
  voucherid:any
  otherBranch:boolean


}
@Component({
  selector: 'app-tradingaccounttransactioncharges',
  templateUrl: './tradingaccounttransactioncharges.component.html',
  styleUrls: ['./tradingaccounttransactioncharges.component.less']
})
export class TradingaccounttransactionchargesComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  ReportTypeList: any[] = [];
  currentUser:User
  model: PostAccountOpening;
  today=new Date
  stampdata=[]
  showBankDetails:boolean=false
  BankFindopt:FindOptions
  locationview:boolean=false
  locationFindopt:FindOptions
  TradeFindopt:FindOptions
  narrationVal:any
  shownameonly:boolean=true;
  showB:boolean=false
  showC:boolean=false
  showD:boolean=false
  showU:boolean=false
  showcheckbox:boolean=false
  showstamp:Boolean=false
  collectionData:any=[];
  isSpinVisible:boolean=false
  kitnoDisable:boolean=false
  viewAfterSave:boolean=false

  //mod by jishnu start
  isVisibleMod:boolean=false
  isVisibleMod1:boolean=false
  totalAmount:any;
  ledgerBal:any
  qrcodeurl:any
  uid:any
  name:any
  tcode:any
  dpclntid:any
  pa:any
  amount:any
  upirefno:any
  showBarjeel:boolean=false
  //mod by jishnu end

  constructor(private dataServ: DataService,
              private authServ: AuthService, 
              private notification: NzNotificationService,
              private CollectionServ: CollectionrequestsService,
              private modalService:NzModalService,
              private utilServ:UtilService) 
              { 
                this.authServ.getUser().subscribe(user => {
                  this.currentUser = user;
                });
                this.model = <PostAccountOpening>{};
                // this.model.location=this.dataServ.branch

                this.BankFindopt = {
                  findType: 6130,
                  codeColumn: 'AccountCode',
                  codeLabel: 'AccountCode',
                  descColumn: 'Acname',
                  descLabel: 'Acname',
                  hasDescInput: true,
                  requestId: 8,
                  whereClause: "Location ='" + this.model.location + "'"
                }

                this.ReportTypeList = [
                  { "value": "New Client", "description": "New Client" },
                  //{ "value": "Updation", "description": "Updation" },
                  //{ "value": "Transfer", "description": "Transfer" },
                  { "value": "Additional Terms and Conditions", "description": "Additional Terms and Conditions" },
                  //{ "value": "Additional terms And Conditions With Pledge", "description": "Additional terms And Conditions With Pledge" },
                  //{ "value": "Margin Trading", "description": "Margin Trading" },
                  // { "value": "New POA", "description": "New POA" },
                  //{ "value": "Miscellaneous Stamps", "description": "Miscellaneous Stamps" },
                  // { "value": "Margin Trading DP Only", "description": "Margin Trading DP Only" },
                  // { "value": "Updation/Activation With POA", "description": "Updation/Activation With POA" }
                ]
              }

  ngOnInit() {
    this.showB=true;
    this.showC=true;
    this.showU=true;
    this.model.Agreementcharges=true;
    this.model.dpcharges=true;
    this.model.otherBranch=false;
    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.model.location = { Location: this.dataServ.branch };
      this.locationview=true;
    }

    if (this.dataServ.branch == 'AB' || this.dataServ.branch == 'ACL' || this.dataServ.branch == 'ACN' || this.dataServ.branch == 'BL' || this.dataServ.branch == 'BO' || this.dataServ.branch == 'SJ' || this.dataServ.branch == 'WK' || this.dataServ.branch == 'QJ') {
      this.showBarjeel=true
    }
    this.loadsearch()
    this.model.margintype = this.ReportTypeList[0].value
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showSaveBtn = true;
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showCancelBtn = false;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.showPreviewBtn = false;
    this.model.date=this.today
    this.stampdata=['POA','INT AC','Pledge','F&O','Under-Taking','CD','IPO','Auto Pledge','Speed E','Speed E POA(Rs.100)','DCN','NSCCL Pledge']
  }

  loadsearch(){
    this.locationFindopt = {
      findType: 4001,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }



    if(this.locationview==true){
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: 'AccountCode',
        descColumn: 'Acname',
        descLabel: 'Acname',
        hasDescInput: true,
        requestId: 8,
        whereClause: "Location ='" + this.model.location.Location+ "'"
      }
      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "Location ='" + this.model.location.Location + "'"
        }
    }
    else{
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: 'AccountCode',
        descColumn: 'Acname',
        descLabel: 'Acname',
        hasDescInput: true,
        requestId: 8,
        whereClause: "1=1"
      }

      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "1=1"
        }

    }
    


  }

  otherBranchChange(data){
    console.log('data',data);
    
    if(data==true){
      this.locationview=false
      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "1=1"
        }
    }
    else{
      this.locationview=true
      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "Location ='" + this.model.location.Location + "'"
        }
    }
  }

  

  onChangeLocation(data){
    if(data==null){
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: 'AccountCode',
        descColumn: 'Acname',
        descLabel: 'Acname',
        hasDescInput: true,
        requestId: 8,
        whereClause: "1=1"
      }
      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "1=1"
        }

    }
    else{
      console.log('data',data);
      
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: 'AccountCode',
        descColumn: 'Acname',
        descLabel: 'Acname',
        hasDescInput: true,
        requestId: 8,
        whereClause: "Location ='" +data.Location+ "'"
      }
      this.TradeFindopt={
        findType: 6124,   //6100
        codeColumn: 'TradeCode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: 'Name',
        requestId: 8,
        whereClause: "Location ='" +data.Location+ "'"
        }

        if (data.Location == 'AB' || data.Location == 'ACL' || data.Location == 'ACN' || data.Location == 'BL' || data.Location == 'BO' || data.Location == 'SJ' || data.Location == 'WK' || data.Location == 'QJ') {
          this.showBarjeel=true
        }
    }

    
  }

   //mod by jishnu start
  saveconfirm(){
    let validation:boolean
    validation= this.validate()
    if(!validation){
      return
    }
    debugger

    if(this.model.PaymentOption=='Q' || this.model.PaymentOption=='D'){
      //this.isVisibleMod=true
      this.isSpinVisible=true
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{
          TransType  :this.model.margintype?this.model.margintype:'',
          KitNo       :this.model.kitno?this.model.kitno:'',
          LOCATION   :this.model.location?this.model.location.Location:'',
          trdCode    :this.model.Tradecode?this.model.Tradecode.TradeCode:'',
          Euser        :this.currentUser.userCode
  
        }],
        "requestId": "100352",
        "outTblCount": "0"
      }).then((response) => {
        // console.log(response);
        // this.isSpinVisible=false
        // let value=response.results[0][0].Totalamount
        // this.totalAmount=value
          this.isSpinVisible=false
          let tot=response.results[0][0].Totalamount
          let ledgbal=response.results[0][0].Balance
          this.ledgerBal=ledgbal
          this.totalAmount=tot
          if(this.model.PaymentOption=='Q'){
            this.isVisibleMod=true
          }
          else{

            if(this.ledgerBal<this.totalAmount){
              this.modalService.info({
                nzContent: 'Insufficient Balance',
                nzOnOk: () => console.log('Info OK')
              });
              return
            }
            else{
              this.modalService.confirm({
                nzTitle: '<i>Confirmation</i>',
                nzContent: `<b> Ledger Balance is ${this.ledgerBal} Do You Want To Continue?</b>`,
                nzOnOk: () => {
                  this.save()
                },
                nzOnCancel: () => {
                  return
                }
              })
            }

          }
      })

    }
    else{
      this.save()
        }



  }

 

  handleCancelUPI(){
    this.isVisibleMod=false
  }
  handleCancelUPI1(){
    this.isVisibleMod1=false
  }
  ValidateupiRefNo(){
    this.isVisibleMod1=false
    if(!this.upirefno){
      this.notification.error('Please Enter the UPI Ref No','')
      return
    }
    if(this.upirefno.length!=12){
      this.notification.error('invalid UPI Ref No','')
      return
    }

    this.isVisibleMod=false
    this.isSpinVisible=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          PaymentRefNo:this.upirefno,
          TransactionId:this.uid,
          Euser:this.currentUser.userCode
        }],
      "requestId": "100353"
    }).then((response) => {
      if (response) {
                
        this.isSpinVisible=false
        if(response.errorCode==1){
          this.notification.error(response.errorMsg,'')
          this.upirefno=''
        }
        else{
          let res = this.utilServ.convertToObject(response[0]);
          if(res[0].errorCode==1){
            this.notification.error(res[0].errorMsg,'')
            this.upirefno=''
          }
          else if(res[0].errorCode==0){
            this.notification.success(res[0].errorMsg,'')
            this.upirefno=''
          }
          else{
            this.notification.error('ERROR!!','')
            this.upirefno=''
          }
        }
      }
    });
  }

  showqrcode(data){
    this.isVisibleMod1=true
    this.isSpinVisible=true
    this.uid=data[0].id
    this.name=data[0].name
    this.tcode=data[0].tcode
    this.dpclntid=data[0].dpclntid
    this.pa=data[0].pa
    this.amount=data[0].amount
    this.dataServ.post(environment.api_getqrcode_url,{"data":data[0].url},{ responseType: 'text' }).then(res=>{
      //this.qrcodeurl=(this.sanitizer.bypassSecurityTrustResourceUrl(res as string))
      //this.qrcodeurl = this.byteArrayToImage(res);
      this.isSpinVisible=false
      this.qrcodeurl=res
      console.log('url ',this.qrcodeurl);
    })
  }


  //mod by jishnu end

  save(){
    this.isVisibleMod=false
    this.narration()
    let name
    if(this.model.name){
      name=this.model.name
    }
    else{
      name=this.model.Tradecode.Name
    }
    this.isSpinVisible=true
    let ccode,bankaccode
    if(this.model.Tradecode){
      let loc1=this.model.location.Location,
      loc=loc1.trim(),
      tcode=this.model.Tradecode.TradeCode
      let clientode=loc.concat(tcode.toString())
      ccode={ClientCode:clientode}
    }
    // if(this.model.bankorcash){
    //   bankaccode=this.model.bankorcash.AccountCode.toString()
    // }
    this.collectionData=[{Location:this.model.location?this.model.location:'',
                          DATE:this.model.date? moment(this.model.date).format(AppConfig.dateFormat.apiMoment) : '',
                          clientCode:this.model.Tradecode?ccode:'',
                          KitNo:this.model.kitno?this.model.kitno:'',
                          Status:this.model.margintype?this.model.margintype:'', 
                          Euser:this.currentUser.userCode}]

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        Date:this.model.date ? moment(this.model.date).format(AppConfig.dateFormat.apiMoment) : '',
        GUSER:this.currentUser.userCode,
        LOCATION:this.model.location?this.model.location.Location:'',
        BankOrCash:this.model.PaymentOption?this.model.PaymentOption:'',
        KitNo:this.model.kitno?this.model.kitno:'',
        Name:name?name:'',
        Trdcode:this.model.Tradecode?this.model.Tradecode.TradeCode:'',
        TransType:this.model.margintype?this.model.margintype:'',
        BankCashAccode:this.model.bankorcash?this.model.bankorcash.AccountCode:'',
        NARR:this.narrationVal?this.narrationVal:'',
        CHEQUENO:this.model.chequeno?this.model.chequeno:'',
        StampName:this.model.stamp?this.model.stamp:'',
        Pan:this.model.pan?this.model.pan:'',
        Othbr:this.model.otherBranch==true?'Y':'N'
      }],
      "requestId": "100102"
    }).then((response) => {
      console.log(response);
      if (response.errorCode == 0) {
        debugger
        console.log(response.results[0][0]);
        
        if(response.results[0][0].Error ==1){
          this.isSpinVisible=false
          this.notification.error(response.results[0][0].ErrorMsg, '')
        }
        else
        {
          this.isSpinVisible=false
          this.notification.success(response.results[0][0].ErrorMsg, '')
          console.log('data',response.results[0][0]);
          this.viewAfterSave=true
          this.model.voucherid=response.results[0][0].VID
          this.model.charge=response.results[0][0].damount
          this.formHdlr.config.disableSaveBtn=true
          if(response.results[0][0].UPI=='U'){
            var dataCollectionReq = []
            dataCollectionReq = this.collectionData
            this.CollectionServ.collectionReqDetail.next(dataCollectionReq)
            this.CollectionServ.viewCollectionServ()
          }
          else if(response.results[0][0].UPI=='Q'){
            let data=[{'url':response.results[0][0].Url,'id':response.results[0][0].id,'pa':response.results[0][0].pa,'am':response.results[0][0].am,'dpclntid':response.results[0][0].dpclntid,'name':response.results[0][0].name,'tcode':response.results[0][0].tcode}]
            this.showqrcode(data)
          }
          else{
            
            
            let vid=response.results[0][0].VID
            console.log('vid',vid);
            
            this.modalService.confirm({
              nzTitle: 'Do you want to Print?',
              nzOnOk: () => {
                this.print(vid)
              },
              nzOnCancel:()=>{

              }
            });
          }
        }
              
      }
      if (response.errorCode == 1) {
        this.isSpinVisible=false
        this.notification.error(response.errorMsg, '')
      }
      
    })
  }

  print(data){
    this.isSpinVisible=true
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
      [{
        Voucherid:data,
        Euser:this.currentUser.userCode,
        BankorCash:this.model.PaymentOption

      }],

    "requestId": "200061",  
    "outTblCount": "0"
    }  
  reqParams['fileType'] = "2";
  reqParams['fileOptions'] = { 'pageSize': 'A4' };
  let isPreview: boolean; 
  isPreview = false;
  this.dataServ.generateReport(reqParams, isPreview).then((response) => {  
    this.isSpinVisible=false
    if (response.errorMsg != undefined && response.errorMsg != '') {
      this.notification.error('error', '');
      return;
    }
    else {
      if (!isPreview) {
        this.notification.success('File downloaded successfully', '');
        return;
      }
    }
  }, () => {
    this.notification.error("Server encountered an error", '');
  });

}


  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };

  Validatename(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }

  }
  ValidatePan(val) {

    var charonly = /^[a-zA-Z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key

    if (val.target.selectionStart <= 4) {
      return charonly.test(text)
    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      return numonly.test(text)
    }
    else if (val.target.selectionStart == 9) {
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      return false;
    }
  }

  Validatecheque(val){
    var inp = String.fromCharCode(val.keyCode);
    if (/^[0-9]+$/.test(inp)) {
      return true;
    } else {
      val.preventDefault();
      return false;
    }
  }

  onChangeClient(data){
    if(data==null)
    {
      this.model.location=null
      this.model.pan=null
    }
    else{
      this.model.location={Location:data.Location}
      this.model.pan=data.pan
      if (data.Location == 'AB' || data.Location == 'ACL' || data.Location == 'ACN' || data.Location == 'BL' || data.Location == 'BO' || data.Location == 'SJ' || data.Location == 'WK' || data.Location == 'QJ') {
        this.showBarjeel=true
      }

    }
    console.log('client',data);
    
  }

  onchangepaymentOption(data){
    if(data=='B'){
      this.showBankDetails=true
      this.model.chequeno=null
      this.model.bankorcash=null
    }
    else{
      this.showBankDetails=false
      this.model.chequeno=null
      this.model.bankorcash=null
    }
  }
  onChangeType(data){
    console.log('onchnage type ',data);
    this.Reset2()
    if(data=='New Client'){
      this.shownameonly=true;
      this.showB=true;
      this.showC=true;
      this.showD=false;
      this.showcheckbox=false;
      this.showstamp=false;
      this.showU=true
      this.showBankDetails=false
      this.model.otherBranch=false
    }
    else if(data=='Transfer'){
      this.shownameonly=true;
      this.showB=true;
      this.showC=true;
      this.showD=false;
      this.showcheckbox=false;
      this.showstamp=false;
      this.showU=false
      this.showBankDetails=false
    }
    else if(data=='Updation' || data=='Additional Terms and Conditions' || data=='New POA' || data=='Updation/Activation With POA'){
      this.shownameonly=false;
      this.showB=true;
      this.showC=true;
      this.showD=true;
      this.showcheckbox=false;
      this.showstamp=false;
      this.showU=true
      this.showBankDetails=false
    }
    else if(data=='Additional terms And Conditions With Pledge'){
      this.shownameonly=false;
      this.showB=true;
      this.showC=true;
      this.showD=true;
      this.showcheckbox=false;
      this.showstamp=false;
      this.showU=false
      this.showBankDetails=false
    }
    else if(data=='Margin Trading'){
      this.shownameonly=false;
      this.showB=false;
      this.showC=false;
      this.showD=true;
      this.showcheckbox=true;
      this.showstamp=false;
      this.showU=false
      this.showBankDetails=false
    }
    else if(data=='Miscellaneous Stamps'){
      this.shownameonly=false;
      this.showB=false;
      this.showC=false;
      this.showD=true
      this.showcheckbox=false;
      this.showstamp=true
      this.showU=false
      this.showBankDetails=false
    }
    // else if(data=='Margin Trading DP Only'){
    //   this.shownameonly=false;
    //   this.showB=false;
    //   this.showC=false;
    //   this.showD=true
    //   this.showcheckbox=false;
    //   this.showstamp=false
    //   this.showU=false
    //   this.showBankDetails=false
    // }

    if(data){
      if(data == 'New Client' || data == 'Updation' || data == 'Transfer'){
        this.kitnoDisable=false
      }
      else{
        this.kitnoDisable=true
      }
    }

    console.log('kit',this.kitnoDisable);
    


  }

  validate(){
    debugger
    console.log('model',this.model);
    
    if(!this.model.location){this.notification.error('Please Select Location','');return false}
    else if(!this.model.date){this.notification.error('Please Select Date','');return false}
    else if(!this.model.margintype){this.notification.error('Please Select Type','');return false}
    else if((!this.model.kitno) && (this.model.margintype=='New Client' || this.model.margintype == 'Updation' || this.model.margintype == 'Transfer')){
      this.notification.error('Please Select Kit Number','');
      return false
    }
    else if(!this.model.name && !this.model.Tradecode){
      if(!this.model.name){
        this.notification.error('Please Enter The Name','');return false
      }
      else{
        this.notification.error('Please Select Trade Code','');return false
      }
      
    }
    else if(!this.model.pan){this.notification.error('Please Enter The Pan','');return false}
    else if(!this.model.PaymentOption){this.notification.error('Please Select Payment Option','');return false}
    else if(this.model.PaymentOption=='B'){
      if(!this.model.bankorcash){
        this.notification.error('Please Select Bank','');
        return false;
      }
      if(!this.model.chequeno){
        this.notification.error('Please Enter Cheque Number','');
        return false;
      }
      else{
        return true
      }
      
    }
    else if(this.model.margintype=='Miscellaneous Stamps' && !this.model.stamp){
      this.notification.error('Please Select Stamp','');
      return false
    }
    else{
      debugger
      return true
    }
    
  }

  narration(){
    let narr,narrname,narrtradecode,margType
    if(this.model.name){
      narrname=this.model.name
    }
    else{
      narrname=this.model.Tradecode.Name
    }

    if(this.model.Tradecode){
      narrtradecode=this.model.Tradecode.TradeCode
    }
    else{
      narrtradecode=''
    }

    if(this.model.margintype=='Additional Terms and Conditions'){
      margType='Additional T&C'
    }
    else{
      margType=this.model.margintype
    }

    narr=this.model.location.Location+'/'+margType+'/'+narrname+'/'+narrtradecode

    if(this.model.kitno){
      this.narrationVal=narr+'/KIT NO:'+this.model.kitno
    }
    else{
      this.narrationVal=narr
    }
    debugger


    
    
  }

  Reset(){
    this.model.date=this.today
    this.model.kitno=null;
    this.model.name=null
    this.showBankDetails=false
    this.model.chequeno=null
    this.model.bankorcash=null
    this.model.PaymentOption=null
    this.model.pan=null
    this.kitnoDisable=false
    //this.showBarjeel=false
    if (this.dataServ.branch == 'AB' || this.dataServ.branch == 'ACL' || this.dataServ.branch == 'ACN' || this.dataServ.branch == 'BL' || this.dataServ.branch == 'BO' || this.dataServ.branch == 'SJ' || this.dataServ.branch == 'WK' || this.dataServ.branch == 'QJ') {
      this.showBarjeel=true
    }
    else{
      this.showBarjeel=false
    }
    if(this.locationview==false){
      this.model.location=null
    }
    this.model.voucherid=null
    this.model.charge=null
    this.model.Tradecode=null
    this.model.margintype = this.ReportTypeList[0].value
    this.viewAfterSave=false
    this.upirefno=''
    this.formHdlr.config.disableSaveBtn=false
    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.model.location = { Location: this.dataServ.branch };
      this.locationview=true;
    }
    this.onChangeType(this.model.margintype)
    this.loadsearch()
  }

  Reset2(){
    this.model.date=this.today
    this.model.kitno=null;
    this.model.name=null
    this.showBankDetails=false
    this.model.chequeno=null
    this.model.bankorcash=null
    this.model.PaymentOption=null
    this.model.pan=null
    this.kitnoDisable=false
    this.model.voucherid=null
    this.model.charge=null
    this.viewAfterSave=false
    this.upirefno=''
    this.formHdlr.config.disableSaveBtn=false
    if(this.locationview==false){
      this.model.location=null
    }
    this.model.Tradecode=null
    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.model.location = { Location: this.dataServ.branch };
      this.locationview=true;
    }
    if (this.dataServ.branch == 'AB' || this.dataServ.branch == 'ACL' || this.dataServ.branch == 'ACN' || this.dataServ.branch == 'BL' || this.dataServ.branch == 'BO' || this.dataServ.branch == 'SJ' || this.dataServ.branch == 'WK' || this.dataServ.branch == 'QJ') {
      this.showBarjeel=true
    }
    else{
      this.showBarjeel=false
    }
    
    //this.model.margintype = this.ReportTypeList[0].value
    //this.onChangeType(this.model.margintype)
    this.loadsearch()
  }

}
