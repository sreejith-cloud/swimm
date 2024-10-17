import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService, NzModalService, NzDatePickerComponent } from 'ng-zorro-antd';
import { AppConfig, MasterFindComponent, PageService, WorkspaceService, UtilService, InputMasks } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FormHandlerComponent } from 'shared';
import { ReplaySubject, from } from 'rxjs';
import { CRFDataService } from './CRF.service';
import * as  jsonxml from 'jsontoxml';
import { EditwindowComponent } from './editwindow/editwindow.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CRFImageUploadComponent } from './CRFimage upload/component';
import { ClientMasterService } from './client-master.service';
import { KycService } from './kyc/kyc.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';




export interface ClientChangeRequest {
  PanNo: any;
  uniqueCode: any;
  Cin: any;
}

@Component({
  templateUrl: './crf.component.html',
  styleUrls: ['./crf.component.less'],

})

export class CrfComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild(EditwindowComponent) EditWindow: EditwindowComponent
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  panFindOption: FindOptions;
  panFindOption2: FindOptions;
  // geojitUniqueCodeFindOption: FindOptions;
  // cinFindOption: FindOptions;
  currentUser: User;
  find: any;
  edittabtitle: any;
  changereq: any;
  selectedIndex: number;
  activeTabIndex: number;
  model: ClientChangeRequest;
  clientArray: any[] = [];
  clientArrayTemp: any = [];
  krakyc: any = [];
  tableCheckBox: boolean = true;
  testdata: any[];
  ckyc: any;
  kra: any;
  Dob: any;
  changeAccounts: any[] = [];
  krakycCheck: any = true;
  ckycCheck: any = false;
  isVisible: boolean = false;
  PanDetails: any;
  panValid: boolean = true;
  temparray: any = [];
  IsForConfirmation: boolean = false;
  clientserielno: any = '';
  DummyResponseApproveData: any = [];
  serielno: any = 0;
  rejectedRequests: any = [];
  pendingRequests: any = [];
  pendingRquestskeys: any = [];
  isVisiblePending: boolean = false;
  isVisibleRejection: boolean = false;
  rejectionRequestKeys: any = [];
  pendingcount: any;
  rejectionCount: any;
  isSpining: any;
  IsRejectedRequest: boolean = false;
  krakycCheckvalidation: any = false;
  approvedCount: any;
  approvedRequest: any = [];
  isVisibleApproved: boolean = false;
  approvedRequestHeader: any = [];
  filePreiewVisible: boolean = false;
  filePreiewContent: any = {};
  test123: boolean = true;
  accountCountArray: any = {};
  testModel: any;
  clientBankAccounts: any = [];
  date: any;
  Branch: any;
  DisableCheck: boolean = false;
  Changereqdisable: boolean = false;
  RegectionReason: any = '';
  rejorapprove: boolean;
  savehide: boolean;
  isApproved: boolean = false;
  source: string;
  acc: any;
  HO: boolean = false;
  clientStatus: any = '';
  noDataflag: boolean = true
  canAdd: any;
  canModify: any;
  saveButtonFlag: boolean = false;
  approveOrRejectButtonFlag: boolean = false
  finalApproveOrRejectButtonFlag: boolean = false
  faqVisible: boolean = true
  status: any;
  AssistDisplay: boolean = false;
  applicationStatus: string;
  pendingOrRejected: boolean = false;
  notifcontent: any = '';
  approvelRemarks: any[] = [];
  rejectionRemarks: any[] = [];
  remaks: any[] = [];
  nomobileFlag: any;
  noemailFlag: any;
  IndivitualClient: boolean = true;
  isIpvHistory: boolean = false;
  IPVHistoryHeader: any = [];
  IPVHistory: any = [];
  isVisibleHolders: boolean = false;
  holderDataHeader: any = [];
  holderData: any = [];
  showMob: boolean = false;
  showEmail: boolean = false;
  Mobile: any;
  Email: any;
  newMobile: any;
  newEmail: any;
  MobileorEmaillabel: any;
  inputMasks = InputMasks;
  showSendLink: boolean = false;
  Link: boolean = false;
  noLink: boolean = false;
  ChangeFlag: any = []
  addressFlag: boolean = false;
  emailFlag: boolean = false;
  mobileFlag: boolean = false;
  telephoneFlag: boolean = false;
  bankFlag: boolean = false;
  nomineeFlag: boolean = false;
  financialFlag: boolean = false;
  ckycFlag: boolean = false;
  KRAKYCtitle: any;
  HOModification: any;
  FirstlevelApprove: any = [];
  FirstlevelApprovekeys: any = [];
  isVisibleFrstApprove: boolean = false;
  frstLvlApprovalCount: any;
  nridata: any;
  entryType: any = 'N';
  SignatureFlag: boolean = false;

  emialOrmobileVisibleStatus: any;
  emailOrMobVerificationStatus: boolean = false;
  modeOfOperationFlag:boolean=false;
  jointAccountDataForListHolders:any=[];
  modeOfOperationClientArrayForActiveFlagCheck:any=[];

  clientnetStatus: boolean;
  showFundsGenieAccount:boolean = false;
  additionaltcflag: boolean=false;     
  SegmentAdditionflag: boolean=false;
  tableCheckBoxforTrading: boolean;
  isAllowedTradeCodeuncheck: boolean = true;
  isOneTradingAccountSelected: boolean;
  jsonArrayString: string;

  @ViewChild('datePicker') datePicker2: NzDatePickerComponent;
  today:Date =new Date()
  dob
  dobText:string
  panNo:string
  name:string
  maxname:string='85'
  panNoDisable:boolean=false
  dobDisable:boolean=false
  nameDisable:boolean=false
  verifiedPan:boolean=false
  verifytableData:Array<any>=[]
  uniqueCode
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private cmServ: CRFDataService,
    private modalService: NzModalService,
    private pageserv: PageService,
    private wsServ: WorkspaceService,
    private utilServ: UtilService,
    private cmserv: ClientMasterService,
    private kycServ: KycService,
    private dashboardServ: DashboardService,
    private el:ElementRef
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.panFindOption = {
      findType: 5036,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.panFindOption2= {
      findType: 5036,
      codeColumn: 'AccountCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    // this.geojitUniqueCodeFindOption = {
    //   findType: 5036,
    //   codeColumn: 'AccountCode',
    //   codeLabel: '',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    // }
    // this.cinFindOption = {
    //   findType: 5036,
    //   codeColumn: 'CINNo',
    //   codeLabel: '',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    // }

    this.model = <ClientChangeRequest>{};
    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item;
    })
    this.cmServ.saveButtonFlag.subscribe(data => {
      this.saveButtonFlag = data
    })
    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })
  }

  ngOnInit() {
    this.isRedirectFromClientnet();
    if (this.dataServ.fromreport == true) {
      this.serielno = this.dataServ.slno;
      this.fetchdataforConfirmation()
      this.dataServ.fromreport = false;
      this.dataServ.slno = null;
      this.AssistDisplay = false;
    }
    else {
      if (this.dataServ.ModuleID == 9831) {
        this.AssistDisplay = true
      }
    }
    this.getPermissions()
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true
    }
  }

  sendMailOrTexMsg() {
    this.isSpining = true;
    let reqBody: any = {
      requestId: "700201",
      outTblCount: "0",
      dbConn: "db23",
      batchStatus: false,
      detailArray: [{
        PAN: this.model.PanNo && this.model.PanNo.PAN ? this.model.PanNo.PAN : this.model.PanNo,
        Mob: this.newMobile ? this.newMobile : '',
        Email: this.newEmail ? this.newEmail : '',
        flag: 'I',
        euser: this.currentUser.userCode,
        EntryType: 'CRF',
        ShortURL: '',
        ShortURLGenerate: 'N'
      }],
    }
    this.dataServ.post(environment.api_send_emailormob, reqBody).then((res: any) => {
      this.isSpining = false;
      if (res.errorcode == 0) {
        let successMsg = this.newMobile ? ' Link Sent To ' + this.newMobile : this.newEmail ? 'Link Sent To ' + this.newEmail : ''
        this.notification.success(successMsg, '')
        this.newMobile = ''
        this.newEmail = ''
      } else {
        let errorMsg = res.Msg ? res.Msg : res.errorMsg ? res.errorMsg : 'Something Went Wrong! Please try again'
        this.notification.error(errorMsg, '')
      }
    }, (error) => {
      this.isSpining = false;
      this.notification.error('Something Went Wrong! Please try again', '')
    })
  }

  checkEmailOrMobVerified() {
    this.isSpining =true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.model.PanNo && this.model.PanNo.PAN ? this.model.PanNo.PAN : this.model.PanNo,
          Mobile: '',
          Email: '',
          EntryType: this.changereq === 'Mobile' ? 'Mobile' : this.changereq === 'Email' ? 'Email' : '',
          Flag: 'N'
        }],
      "requestId": "800217",
      "outTblCount": "0"
    }).then((response: any) => {
      this.isSpining =false;
      if (response && response.errorCode == 0) {
        let result = response.results[0][0] ? response.results[0][0].VerifiedStatus : false;
        console.log(response.results[0][0], 'response of verified status')
        this.emailOrMobVerificationStatus = result;
        let emailORmobVerifiedStatus: boolean;
        emailORmobVerifiedStatus = this.getEmailOrMobVerificationStatus();
        if (emailORmobVerifiedStatus) {
          if (this.pendingOrRejected) {
            this.modalService.confirm({
              nzTitle: '<i>Confirmation</i>',
              nzContent: '<b>Are you sure you want to proceed</b>',
              nzOnOk: () => {
                this.edittabtitle = this.changereq;
                this.cmServ.clientBasicData.next(this.testdata)
                this.cmServ.verificationstatus.next(this.krakyc)
                this.activeTabIndex = 1;
                this.cmServ.changeRequest.next(this.changereq)
                this.setselectedaccounts()
              }
            })
          }
          else {
            if (!this.panValid) {
              this.notification.error('Pan not verified', '')
              return false
            }
            this.setselectedaccounts()

            var validform = this.Validation()
            if (!validform) {
              return
            }
            if (!this.krakyc.KRAKYC_Flag) {
              this.KRAKYCtitle = 'KRAKYC';
            }
            else if (!this.krakyc.CKYC_Flag) {
              this.KRAKYCtitle = 'CKYC';
            }
            // else {
            this.edittabtitle = this.changereq;
            // }
            if (!this.krakyc.Processed_Without_KYC_or_CKYC_Flag && this.changereq != 'Reactivation') {
              if (this.changereq == null || this.changereq == '' || this.changereq == undefined) {
                this.notification.error('Select action to proceed', '');
                return;
              }
              this.notifcontent = ''
              if (!this.krakyc.KRAKYC_Flag && !this.krakyc.CKYC_Flag) {
                this.notifcontent = this.KRAKYCtitle + ' & CKYC not verified , Do you want to continue ';
              }
              else if (!this.krakyc.KRAKYC_Flag) {
                this.notifcontent = this.KRAKYCtitle + '  not verified ,proceeding with CKYC verification ';
              }
              else {
                this.notifcontent = this.KRAKYCtitle + '  not verified , Do you want to continue ';
              }
              this.modalService.confirm({
                nzTitle: '<i>Confirmation</i>',
                nzContent: '<b>' + this.notifcontent + '</b>',
                nzOnOk: () => {
                  let pan = this.testdata ? this.testdata['PANNo'] : ''
                  // console.log(this.testdata,'test data pan K')
                  this.kycServ.setPan(pan)
                  this.cmServ.clientBasicData.next(this.testdata)
                  this.cmServ.verificationstatus.next(this.krakyc)
                  this.activeTabIndex = 1;
                  this.cmServ.changeRequest.next(this.changereq)
                }
              })
            }
            else {
              if (this.changereq == null || this.changereq == '' || this.changereq == undefined) {
                this.notification.error('Select action to proceed', '');
                return;
              }
              this.modalService.confirm({
                nzTitle: '<i>Confirmation</i>',
                nzContent: '<b>Are you sure you want to proceed</b>',
                nzOnOk: () => {
                  let pan = this.testdata ? this.testdata['PANNo'] : ''
                  // console.log(this.testdata, 'test data pan K else case')
                  this.kycServ.setPan(pan)
                  this.edittabtitle = this.changereq;
                  this.cmServ.clientBasicData.next(this.testdata)
                  this.cmServ.verificationstatus.next(this.krakyc)
                  this.activeTabIndex = 1;
                  this.cmServ.changeRequest.next(this.changereq)
                }
              })
            }
          }
        } else {
          this.modalService.error({
            nzMask: false,
            nzTitle: this.changereq === 'Email' ? 'Email not verified, please verify.' : this.changereq === 'Mobile' ? 'Mobile not verified, please verify.' : 'Your Email or Mobile is not verified' ,
            nzContent: '',
          });
        }
      }

    },(err)=>{
      this.isSpining =false;
    })
  }

  getEmailOrMobVerificationStatus() {
    if (((this.changereq === 'Mobile') || (this.changereq === 'Email')) && !this.emailOrMobVerificationStatus) {
      return false;
    } else {
      return true;
    }
  }

  onnextclick(){
    // if(this.serielno===0 && !this.verifiedPan &&(this.changereq==='Address' || this.changereq==='Email' || this.changereq==='Mobile' || this.changereq==='Telephone'|| this.changereq==='CKYC') )
    //   {
    //     this.notification.error('Please Verify Pan No','');
    //     return
    //   }
    this.changeAccounts = [];
    this.temparray = [];
    if(this.changereq == 'ModeofOperation' && this.applicationStatus == ''){
      this.modeOfOperationClientArrayForActiveFlagCheck.forEach(data => {
        if((data.AccountFlag == true || data.AccountFlag == "true") && data.AccountModeType =='Joint') {
          this.changeAccounts.push(data)
        }
      })
    }
    else{
      this.clientArrayTemp.forEach(data => {
        if (data.AccountFlag == true || data.AccountFlag == "true") {
          this.changeAccounts.push(data)
        }
      })
    }
    this.temparray = this.changeAccounts.map(({ AccountType, AccountCode,AccountId,AccountClientType,PANNo    }) => ({ AccountType, AccountCode,AccountId,AccountClientType,PANNo })); 
    this.jsonArrayString = JSON.stringify(this.temparray, (key, value) => {
      if (typeof value === 'string') {
        return value.replace(/\//g, ''); 
      }
      return value;
    }); 
    this.isSpining=true;
    this.dataServ.getOrginalResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          
          Dob:this.temparray ? JSON.parse(this.jsonArrayString):'',
          Pan:this.PanDetails
          

        }],
      "requestId": "800308",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining=false;
      if(this.changereq == 'ModeofOperation' && this.applicationStatus == ''){
        let activeflagCount = 0;
        this.modeOfOperationClientArrayForActiveFlagCheck.map((n:any)=>{
          if(n.AccountFlag){
            activeflagCount+=1;
          }
        })
        if(activeflagCount != 1){
          this.notification.error('Please Select One Account to Proceed', '')
          return
        }
      }
      console.log(response)
     if(response.results[0][0].dobValid == 'Y'){
      if (((this.changereq === 'Mobile') || (this.changereq === 'Email'))) {
        this.checkEmailOrMobVerified();
      }else{
      if (this.pendingOrRejected) {
        this.modalService.confirm({
          nzTitle: '<i>Confirmation</i>',
          nzContent: '<b>Are you sure you want to proceed</b>',
          nzOnOk: () => {
            this.edittabtitle = this.changereq;
            this.cmServ.clientBasicData.next(this.testdata)
            this.cmServ.jointAccountHolderForModeOfOperation.next(this.jointAccountDataForListHolders)
            this.cmServ.verificationstatus.next(this.krakyc)
            this.activeTabIndex = 1;
            this.cmServ.changeRequest.next(this.changereq)
            this.setselectedaccounts()
          }
        })
      }
      else {
        if (!this.panValid) {
          this.notification.error('Pan not verified', '')
          return false
        }
        this.setselectedaccounts()
  
        var validform = this.Validation()
        if (!validform) {
          return
        }
        if (!this.krakyc.KRAKYC_Flag) {
          this.KRAKYCtitle = 'KRAKYC';
        }
        else if (!this.krakyc.CKYC_Flag) {
          this.KRAKYCtitle = 'CKYC';
        }
        // else {
        this.edittabtitle = this.changereq;
        // }
        if (!this.krakyc.Processed_Without_KYC_or_CKYC_Flag && this.changereq != 'Reactivation') {
          if (this.changereq == null || this.changereq == '' || this.changereq == undefined) {
            this.notification.error('Select action to proceed', '');
            return;
          }
          this.notifcontent = ''
          if (!this.krakyc.KRAKYC_Flag && !this.krakyc.CKYC_Flag) {
            this.notifcontent = this.KRAKYCtitle + ' & CKYC not verified , Do you want to continue ';
          }
          else if (!this.krakyc.KRAKYC_Flag) {
            this.notifcontent = this.KRAKYCtitle + '  not verified ,proceeding with CKYC verification ';
          }
          else {
            this.notifcontent = this.KRAKYCtitle + '  not verified , Do you want to continue ';
          }
          this.modalService.confirm({
            nzTitle: '<i>Confirmation</i>',
            nzContent: '<b>' + this.notifcontent + '</b>',
            nzOnOk: () => {
  
              this.cmServ.clientBasicData.next(this.testdata)
              this.cmServ.jointAccountHolderForModeOfOperation.next(this.jointAccountDataForListHolders)
              this.cmServ.verificationstatus.next(this.krakyc)
              this.activeTabIndex = 1;
              this.cmServ.changeRequest.next(this.changereq)
            }
          })
        }
        else {
          if (this.changereq == null || this.changereq == '' || this.changereq == undefined) {
            this.notification.error('Select action to proceed', '');
            return;
          }
          this.modalService.confirm({
            nzTitle: '<i>Confirmation</i>',
            nzContent: '<b>Are you sure you want to proceed</b>',
            nzOnOk: () => {
              this.edittabtitle = this.changereq;
              this.cmServ.clientBasicData.next(this.testdata)
              this.cmServ.jointAccountHolderForModeOfOperation.next(this.jointAccountDataForListHolders)
              this.cmServ.verificationstatus.next(this.krakyc)
              this.activeTabIndex = 1;
              this.cmServ.changeRequest.next(this.changereq)
            }
          })
        }
      }
    }
     }else{
      this.modalService.warning({
        nzTitle: '<i>Invalid DOB found </i>',
        nzContent: response.results[0][0].ResponseMessage,
        nzOnOk: () => {

        }
      })
     }
    })
  // }
  // else{
  //   this.modalService.warning({
  //     nzTitle: '<i>Invalid DOB found </i>',
  //     nzContent: '<b>Please create a case in CRM with Subtype - Date of Birth \n correction, for DOB rectification </b>',
  //     nzOnOk: () => {

  //     }
  //   })
  //  }
    

 
  }


  onviewClick(data) {
    console.log(data,"onviewClick")
    // alert(data.CINNo)
    // this.model.PanNo = data;
    this.model.Cin = data ? data.CINNo : '';
    this.model.uniqueCode = data ? data.AccountCode : '';
    this.uniqueCode = data ? data : '';
    // let json=data
    this.model.PanNo = data ? data : '';
    // console.log(this.model,"model after")
    this.Changereqdisable = true;
    this.clientStatus = data ? data.AccountStatus_3 : '';
    // this.onSelectClient();
  }
  
  onSelectClient() {
    this.showMob = false;
    this.showEmail = false;
    if ( this.model.PanNo == null && this.model.uniqueCode == '' && this.model.Cin == '') {
      this.clearResponseData()
      this.isSpining = false;
      return
    }
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "PanNo": this.model.PanNo ? this.model.PanNo.PAN : '',
          "CinNo": this.model.Cin ? this.model.Cin : '',
          "GeojitUniqueCode": this.model.uniqueCode ? this.model.uniqueCode : '',
          "EUser": this.currentUser.userCode,
          "ActionFlag": this.panValid ? 'N' : 'S'
        }],
      "requestId": "6005",
    }).then((response) => {
      this.clearResponseData()
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          this.verifiedPan=false
          console.log('this.model',this.model)
          this.panNo = this.model.PanNo ? this.model.PanNo.PAN : ''
          console.log(this.panNo,"after")
          if(this.panNo && this.panNo !=='')
            {
              this.panNoDisable=true
            }
            this.name = response.results && response.results[8] && response.results[8][0] && response.results[8][0].PanHolderName ? response.results[8][0].PanHolderName:''
          if(this.name && this.name !=='')
            {
              this.nameDisable=true
            }
            else
            {
              this.dobDisable=false
            }
            this.dobText = response.results && response.results[8] && response.results[8][0] && response.results[8][0].DOB ? response.results[8][0].DOB:''
            console.log("this.dobText",this.dobText)
            if(this.dobText && this.dobText !=='')
            {
              this.dobDisable=true
            }
            else
            {
              this.dobDisable=false
            }
          this.showFundsGenieAccount = response.results[0].some(n=>n.FundsGenieAccount);
          this.cmServ.requestID.next('')
          this.status = 'N'
          this.isSpining = false;
          this.noDataflag = false;
          this.dataServ.fromreport = false
          this.clientArray = response.results[0];
          this.nridata = this.clientArray
          this.clientArrayTemp = response.results[0];

          if (this.clientArray[0].PANNo != "") {
            this.model.PanNo = { PAN: this.clientArray[0].PANNo }
            this.panNo = this.model.PanNo ? this.model.PanNo.PAN : ''
          console.log(this.panNo,"after")
          if(this.panNo && this.panNo !=='')
            {
              this.panNoDisable=true
            }
          }
          if (this.panValid) {
            this.panCheck()
          }
          if (this.clientArray[0].AccountType == 'TRADING') {
            this.showSendLink = true;
            this.cmServ.clientId.next(this.clientArray[0].AccountId)
            this.cmServ.additionalTC.next(response.results[0][0].AdditionalTC)
            if (this.clientArray[0].Mobileno != "") {
              this.Mobile = this.clientArray[0].Mobileno
            }
            if (this.clientArray[0].Email != "") {
              this.Email = this.clientArray[0].Email
            }
            if (this.clientArray[0].Mobileno == "" && this.clientArray[0].Email != "") {
              this.showMob = true
              this.noLink = false
            }
            else {
              this.showMob = false;
            }
            if (this.clientArray[0].Mobileno != "" && this.clientArray[0].Email == "") {
              this.showEmail = true
              this.noLink = false
            }
            else {
              this.showEmail = false;
            }

            // if(this.clientArray[0].Mobileno == "" && this.clientArray[0].Email == ""){
            //   this.Link = false
            // }
            // else{ 
            //   this.Link = true;
            // }
            if (this.clientArray[0].Mobileno != "" && this.clientArray[0].Email != "") {
              this.noLink = true
            }
            else {
              this.noLink = false;
            }
          }
          this.krakyc = response.results[1] ? response.results[1][0] : [];
          this.Dob =  response.results[1][0].DOB ? response.results[1][0].DOB:response.results[0][0].AccountDOB ? response.results[0][0].AccountDOB:[];
          this.testdata = response.results[0] ? response.results[0][0] : [];
          this.jointAccountDataForListHolders = response.results[0] ? response.results[0] : [];
          this.cmServ.derivativeStatus.next(response.results[1][0].DerivativeStatus)
          this.IndivitualClient = response.results[1][0].IndivitualClient
          this.krakycCheck = this.krakyc.Processed_Without_KYC_or_CKYC_Flag;
          this.ckycCheck = this.krakyc.CKYC_Flag ? false : true;
          this.rejectedRequests = response.results[3];
          this.pendingRequests = response.results[2];
          this.pendingcount = this.krakyc.NoOfPendingRequests;
          this.rejectionCount = this.krakyc.NoOfRejectionRequests;
          this.approvedCount = this.krakyc.NoOfApprovedRequests;
          this.approvedRequest = response.results[4] ? response.results[4] : [];
          this.cmServ.saveButtonFlag.next(true);
          this.cmServ.approveOrRejectButtonFlag.next(false)
          this.cmServ.finalApproveOrRejectButtonFlag.next(false)
          this.clientBankAccounts = response.results[6];
          this.ChangeFlag = response.results[7]
          this.cmServ.clientBankAccouns.next(this.clientBankAccounts);
          this.cmServ.applicationStatus.next('')
          this.cmServ.pepStatus.next(this.clientArray[0].PEPStatus)
          this.FirstlevelApprove = response.results[8] ? response.results[8] : '';
          this.frstLvlApprovalCount = response.results[8] ? response.results[8][0].Counts : '0';
          this.cmServ.nriData.next(this.clientArray[0].AccountClientType)
          this.cmserv.nriData.next(this.clientArray[0].AccountClientType)
          if (this.FirstlevelApprove != '') {
            this.FirstlevelApprove = this.FirstlevelApprove.map(({ Counts, ...rest }) => ({ ...rest }));
          }
          // this.FirstlevelApprove.splice(0,1);
          if (this.ChangeFlag) {
            this.flagReset();
            this.ChangeFlag.forEach(items => {
              if (items.Type == 'Address' && items.Flag == true) {
                this.addressFlag = true;
              }
              else if (items.Type == 'Email' && items.Flag == true) {
                this.emailFlag = true;
              }
              else if (items.Type == 'Mobile' && items.Flag == true) {
                this.mobileFlag = true;
              }
              else if (items.Type == 'Telephone' && items.Flag == true) {
                this.telephoneFlag = true;
              }
              else if (items.Type == 'Bank' && items.Flag == true) {
                this.bankFlag = true;
              }
              else if (items.Type == 'Nominee' && items.Flag == true) {
                this.nomineeFlag = true;
              }
              else if (items.Type == 'Financials' && items.Flag == true) {
                this.financialFlag = true;
              }
              else if (items.Type == 'CKYC' && items.Flag == true) {
                this.ckycFlag = true;
              }
              else if (items.Type == 'SignatureUpdation' && items.Flag == true) {
                this.SignatureFlag = true;
              }
              else if (items.Type == 'ModeofOperation' && items.Flag == true) {
                this.modeOfOperationFlag = true;
              }
              else if (items.Type == 'Additionaltc' && items.Flag == true) {
                this.additionaltcflag = true;
            
              }
              else if (items.Type == 'SegmentAddition' && items.Flag == true) {
                this.SegmentAdditionflag = true;
            }
            });
          }
          // if (!this.krakycCheck) {
          //   this.changereq = 'CKYC'
          // }
          if (this.canAdd) {
            this.cmServ.saveButtonFlag.next(true)
          }
          else {
            this.cmServ.saveButtonFlag.next(false)
            this.cmServ.approveOrRejectButtonFlag.next(false)
            this.cmServ.finalApproveOrRejectButtonFlag.next(false)
          }
          this.accountCountArray = response.results[5][0];
          if (this.krakyc.AccountName) {
            this.notification.success(this.krakyc.AccountName, '');
          }
          this.panValid = true
        }
        else {
          this.isSpining = false;
          this.noDataflag = true
          this.notification.error('Client not found', '')
        }
      }
      else {
        this.isSpining = false;
        this.noDataflag = true
        this.notification.error(response.errorMsg, '')
      }
    });
    this.IsForConfirmation = false;
    this.cmServ.forApproval.next(this.IsForConfirmation);
    this.IsRejectedRequest = false;
    this.cmServ.isRejected.next(this.IsRejectedRequest);
    this.cmServ.viewOnly.next(false);
  }

  onviewReset() {
    this.dobDisable=false
    this.nameDisable=false
    this.verifiedPan=false
    this.dob=undefined
    this.dobText=''
    this.name=''
    this.clientArray = [];
    this.krakyc = [];
    this.uniqueCode=undefined
    this.model = <ClientChangeRequest>{};
    this.krakyc = [];
    this.changereq = null;
    this.krakycCheck = false;
    this.ckycCheck = false;
    this.panValid = true;
    this.pendingcount = '';
    this.rejectionCount = '';
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.IsForConfirmation = false;
    this.IsRejectedRequest = false;
    this.approvedRequest = [];
    this.isVisibleApproved = false;
    this.approvedCount = '';
    this.accountCountArray = {};
    this.clientArrayTemp = [];
    this.DisableCheck = false;
    this.Changereqdisable = false;
    this.isApproved = false;
    this.noDataflag = true;
    this.pendingOrRejected = false
    this.cmServ.requestID.next('')
    this.serielno = 0;
    this.showMob = false;
    this.showEmail = false;
    this.Email = '';
    this.Mobile = '';
    this.MobileorEmaillabel = '';
    this.showSendLink = false;
    this.newEmail = '';
    this.newMobile = '';
    this.Link = true;
    this.noLink = false;
    this.flagReset();
    this.FirstlevelApprove = [];
    this.frstLvlApprovalCount = '';
    this.modeOfOperationClientArrayForActiveFlagCheck=[];
    this.Dob='';
    this.SegmentAdditionflag= false;
    this.additionaltcflag = false;
    
  }

  onradioButtonChange(value) {
    this.clientArrayTemp = [];
    var array = [];
    this.emialOrmobileVisibleStatus = '';
    this.cmServ.requestID.next('')
    this.clientArrayTemp = this.clientArray;
    this.modeOfOperationClientArrayForActiveFlagCheck = [];
    this.clientArray.map((n:any)=>{
      if(n.AccountModeType =='Joint' && n.AccountFlag){ 
        this.modeOfOperationClientArrayForActiveFlagCheck.push(n)
      }
    })
    this.clientArrayTemp.forEach(item => {
      item.AccountFlag = true
    });
    this.newEmail = '';
    this.newMobile = '';
    if (value == "Bank") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }
    else {
      this.tableCheckBox = true;
      this.tableCheckBoxforTrading = false;
    }
    if (value == "Nominee") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }
    if (value == "SegmentAddition" || value == "Additionaltc" ) {
      var  i = 0; 
      this.clientArrayTemp.forEach(item => {
        if(item.AccountType == "TRADING"){
             i += 1
             if(i>1){
              this.tableCheckBoxforTrading = true;
             } 
        }
      });
      
    }
    if (value == "SignatureUpdation") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }
    if (value == "ModeofOperation") {
      this.tableCheckBox = false;
    }
    if (value == "ModeofOperation") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }
    if (value == "Telephone") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }

    if (value == "Mobile") {
      this.Link = true;
      this.tableCheckBox = false;
      this.emialOrmobileVisibleStatus = 'Mobile';
      this.newEmail = '';
    }

    if (value == "Email") {
      this.Link = true;
      this.tableCheckBox = false;
      this.emialOrmobileVisibleStatus = 'Email';
      this.newMobile = '';
    }

    if (value == "Address") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }

    // if(value == "Financials"){
    //   this.tableCheckBox = false;
    // }
    if (value == "CKYC") {
      this.tableCheckBox = false;
      this.tableCheckBoxforTrading = false;
    }
    if (value == "Reactivation") {
      this.clientArrayTemp = this.clientArray.filter(item => {
        return item.AccountType == "TRADING" && item.AccountStatus == "INACTIVE"
      });
      if (!(this.clientArrayTemp.length > 0)) {
        this.notification.error('No inactive accounts found', '')
      }
    }
    if (value == 'NoEmailMobile') {
      setTimeout(() => {
        this.img.setproofs(value)
      }, 1000);
    }
    if (value == "Mobile" && this.noLink) {
      this.showMob = true;
    }
    else {
      this.showMob = false;
    }
    if (value == "Email" && this.noLink) {
      this.showEmail = true;
    }
    else {
      this.showEmail = false;
    }
  }

  Validation() {
    if (!this.panValid) {
      this.notification.error('Pan not verified', '')
      return false
    }
    if (!this.clientArray.length) {
      this.notification.error('Please select a client to update', '');
      return false;
    }
    if (!this.changeAccounts.length) {
      this.notification.error('Atleast one account should be selected ', '')
      return false;
    }
    return true;
  }

  ngAfterViewInit() {
    var permissions = this.pageserv.getPermissions()
  }

  setselectedaccounts() {
    this.changeAccounts = [];
    this.temparray = [];
    if(this.changereq == 'ModeofOperation' && this.applicationStatus == ''){
      this.modeOfOperationClientArrayForActiveFlagCheck.forEach(data => {
        if((data.AccountFlag == true || data.AccountFlag == "true") && data.AccountModeType =='Joint') {
          this.changeAccounts.push(data)
        }
      })
    }
    else{
      this.clientArrayTemp.forEach(data => {
        if (data.AccountFlag == true || data.AccountFlag == "true") {
          this.changeAccounts.push(data)
        }
      })
    }
    this.cmServ.changeAccounts.next(this.changeAccounts)
    this.changeAccounts.forEach((item, index) => {
      var obj = {};;
      var name = '';
      name = "Account";
      obj[name] = item;
      this.temparray.push(obj);
    })
    var changeaccountXML = '';
    changeaccountXML = jsonxml(this.temparray);
    this.cmServ.changeAccountsXML.next(changeaccountXML);
    var object = [];
    for (let i = 0; i < this.changeAccounts.length; i++) {
      object.push({ Account: { AccountType: this.changeAccounts[i].AccountType, AccountCode: this.changeAccounts[i].AccountCode } });
    }
    var jsonobject = this.utilServ.setJSONMultipleArray(object)
    var xml = jsonxml(jsonobject)
    this.dataServ.getOrginalResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EUser: this.currentUser.userCode,
          Loc: this.changeAccounts[0].AccountLocation ? this.changeAccounts[0].AccountLocation : '',
          Pan: this.model.PanNo.PAN ? this.model.PanNo.PAN : '',
          AccountDetails: xml,
          ID: this.entryType
        }],
      "requestId": "600021",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results[0][0].Nominee == 'Y') {
          this.cmServ.NomineeOpting.next(true);
        }
        if (response.results[0][0].Nominee == 'N') {
          this.cmServ.NomineeOpting.next(false);
        }
      }
    })
  }

  panCheck() {
    this.clientArray.forEach(item => {
      if (item.AccountFlag == 'V') {
        this.validatePan(item.PANNo)
        this.panValid = true;

      }
    })
  }

  validatePan(pan) {
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.PanDetails.length > 0) {
            this.notification.success("Valid Pan", '')
            this.panValid = true;
            return
          }
          else {
            this.panValid = false;
            this.modalService.confirm({
              nzTitle: '<i>Confirmation</i>',
              nzContent: this.clientArray[0].AccountName,
              nzOnOk: () => {
                this.onSelectClient();
              }
            });
            return
          }
        })
    }
  }

  fetchdataforConfirmation() {
    this.changeAccounts = [];
    this.isSpining = true;
    this.dataServ.getOrginalResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.serielno,
          EUser: this.currentUser.userCode,

        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {

      this.cmServ.clientId.next(response.results[0][0].AccountId)
      this.Dob=response.results[0][0].AccountDOB;
     if (response.errorCode == 0) {
        this.showFundsGenieAccount = response.results[0].some(n=>n.FundsGenieAccount);
        this.isSpining = false
        this.tableCheckBox = true;
        this.pendingOrRejected = true
        this.clientArrayTemp = response.results[0];
        this.clientArray = response.results[0];
        this.cmServ.nriData.next(response.results[0][0].AccountClientType)
        this.cmserv.nriData.next(response.results[0][0].AccountClientType)
        this.testdata = response.results[2][0];
        this.status = this.testdata["Status"]
        this.jointAccountDataForListHolders = response.results[0];
        this.cmServ.clientBasicData.next(this.testdata);
        this.cmServ.jointAccountHolderForModeOfOperation.next(this.jointAccountDataForListHolders)
        this.changereq = response.results[2][0].EntryType;
        if (response.results[3][0].NomineeOptOut == 'Y') {
          this.cmServ.NomineeOptingFlag.next(true)
          this.cmServ.NomineeOpting.next(true)
        }
        this.remaks = response.results[4]

        if (this.remaks && this.remaks.length > 0) {
          this.approvelRemarks = [];
          this.rejectionRemarks = [];
          this.remaks.forEach(data => {
            if (data.Type == 'A') {
              this.approvelRemarks.push({ 'Remarks': data.Remarks })
            }
            else {
              this.rejectionRemarks.push({ 'Remarks': data.Remarks })
            }
          })
        }

        this.clientBankAccounts = response.results[5];
        this.cmServ.clientBankAccouns.next(this.clientBankAccounts);

        if (response && response.results[6]) {
          this.HOModification = response.results[6][0].HTMLContent;
          this.cmServ.HOModification.next(this.HOModification);
        }

        if (response && response.results[8] && this.changereq != 'SegmentAddition') {
          this.notification.info(response.results[8][0].info, '')
        }



        if (this.changereq == 'NoEmailMobile') {
          setTimeout(() => {
            this.img.setproofs(this.changereq)
          }, 1000);
        }

        this.krakyc = response.results[2][0];
        this.model.PanNo = { "PAN": response.results[2][0].PanNumber }
        this.dataServ.fromreport = true

        if (this.changereq == 'NoEmailMobile') {
          this.RegectionReason = response.results[2][0].UserRemarks;
        }
        var ChangeDetails: any = [];
        if (response.results[3]) {
          ChangeDetails.push(response.results[3][0]);
          ChangeDetails.push(response.results[1])
          this.cmServ.DataForAprooval.next(ChangeDetails);
          // if (value) {
          response.results[3][0]["RejectedReason"] = response.results[2][0].UserRemarks;
          response.results[3][0]["ApplicationReceived"] = false
          // }
          if (this.changereq == 'NoEmailMobile') {
            this.noemailFlag = response.results[3][0]["noemailFlag"];
            this.nomobileFlag = response.results[3][0]["nomobileFlag"];
          }
        }
        this.clientArrayTemp = response.results[0];
        this.IsForConfirmation = true;
        this.clientArray.forEach(data => {
          if (data.AccountFlag == true) {
            this.changeAccounts.push(data)
          }
        })
        if (this.status == 'T') {
          this.cmServ.saveButtonFlag.next(true)
          this.cmServ.approveOrRejectButtonFlag.next(false)
          this.cmServ.finalApproveOrRejectButtonFlag.next(false)
        }
        if (this.status == 'P') {
          setTimeout(() => {
            if (this.canModify && this.HO) {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(true)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
              this.cmServ.approvelRemarks.next(this.approvelRemarks)
              this.cmServ.rejectionRemarks.next(this.rejectionRemarks)
            }
            else {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
            }
          }, 300)
        }
        if (this.status == 'F') {
          setTimeout(() => {
            if (this.canModify && this.HO) {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(true)
              this.cmServ.approvelRemarks.next(this.approvelRemarks)
              this.cmServ.rejectionRemarks.next(this.rejectionRemarks)
            }
            else {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
            }
          }, 300)
        }
        if (this.status == 'R') {
          if (this.canAdd) {
            this.cmServ.saveButtonFlag.next(true)
            this.cmServ.approveOrRejectButtonFlag.next(false)
            this.cmServ.finalApproveOrRejectButtonFlag.next(false)
          }
        }
        if (this.status == 'A') {
          this.cmServ.saveButtonFlag.next(false)
          this.cmServ.approveOrRejectButtonFlag.next(false)
          this.cmServ.finalApproveOrRejectButtonFlag.next(false)
        }
        this.cmServ.applicationStatus.next(this.status)
        if (this.changereq != 'NoEmailMobile') {
          this.cmServ.requestID.next(ChangeDetails[0]["Request_IDNO"])
          if (ChangeDetails[0]["Request_IDNO"] != undefined && ChangeDetails[0]["Request_IDNO"] != '') {
            this.entryType = 'Y';

          }
        }
      }
      else {
        this.isSpining = false;
        this.notification.error(response.errorMsg, '')
      }
    })
  }
  ShowPendigRequests() {

    if (this.pendingRequests.length) {
      this.pendingRquestskeys = Object.keys(this.pendingRequests[0]);
      this.pendingRequests
      this.isVisiblePending = true;
    }
    else {
      this.notification.error('No data to show', '')
    }
  }

  ShowFirstLevelApproveRequests() {

    if (this.FirstlevelApprove.length) {
      this.FirstlevelApprovekeys = Object.keys(this.FirstlevelApprove[0]);
      this.isVisibleFrstApprove = true;
    }
    else {
      this.notification.error('No data to show', '')
    }
  }
  ShowRejectedRequests() {

    if (this.rejectedRequests.length) {
      this.rejectionRequestKeys = Object.keys(this.rejectedRequests[0])
      this.rejectedRequests
      this.isVisibleRejection = true;
    }
    else {

      return
    }
  }
  handleCancel() {
    this.isVisiblePending = false;
    this.isVisibleRejection = false;
    this.isVisibleApproved = false;
    this.isIpvHistory = false;
    this.isVisibleHolders = false;
    this.isVisibleFrstApprove = false;
  }
  SetPendingdata(status, value) {
    this.serielno = value.Request_IDNO
    this.fetchdataforConfirmation()
    this.handleCancel()

  }

  SetFrstlvlApproveddata(status, value) {
    this.serielno = value.Request_IDNO
    this.fetchdataforConfirmation()
    this.handleCancel()

  }

  getPermissions() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "UserCode": this.currentUser.userCode,
          "ProjectID": this.wsServ.getProjectId(), //this.currentUser.defaultProjId,
        }],
      "requestId": "10",
      "outTblCount": "0",
      // "dbConn": 'db',
    }).then((response) => {

      var responseData = response.results[0]
      responseData.forEach(element => {
        if (element.ModuleID == 9831) {
          this.canAdd = element.AddRight ? element.AddRight : false
          this.canModify = element.ModifyRight ? element.ModifyRight : false
        }
      });
    });
  }
  ShowApprovedRequests() {

    if (this.approvedRequest.length) {
      this.approvedRequestHeader = Object.keys(this.approvedRequest[0])
      this.isVisibleApproved = true;
    }
    else {
      return
    }
  }
  ShowSignature(data) {

    if (data.AccountSignature == null) {
      return
    }
    else {

      this.filePreiewContent = {};
      this.filePreiewVisible = true;
      this.source = 'Signature'
      this.filePreiewContent["Docdoc"] = data.AccountSignature
      this.acc = data.AccountCode
    }
  }
  SetPanValid() {
    var test = this.testModel.length - 1
    var CharOnly = /^[a-zA-Z]+$/;
    var NumberOnly = /^[0-9]+$/;

    if (test <= 4 && test >= 0) {
      let result = this.testModel[test].match(CharOnly);
      if (!this.testModel[test].match(CharOnly)) {

        var string = this.testModel
        var test1 = string.slice(0, -1);
        this.testModel = test1;
      }
    }
    if (test > 4 && test < 8) {
      if (!this.testModel[test].match(NumberOnly)) {
        var string = this.testModel
        var test1 = string.slice(0, -1);
        this.testModel = test1;
      }
    }
    if (test == 9) {
      if (!this.testModel[test].match(CharOnly)) {

        var string = this.testModel
        var test1 = string.slice(0, -1);
        this.testModel = test1;

      }
    }

  }
  SaveNoemailMobile(action) {
    if (action == 'Save') {
      if (!this.nomobileFlag && !this.noemailFlag) {
        this.notification.error('Please mark I dont have email Mobile option', '')
        return
      }
    }

    this.changeAccounts = [];
    this.temparray = [];
    this.clientArray.forEach(data => {

      if (data.AccountFlag == true || data.AccountFlag == "true") {
        this.changeAccounts.push(data)

      }
    })
    this.changeAccounts.forEach((item, index) => {
      var obj = {};;
      var name = '';
      name = "Account";
      obj[name] = item;
      this.temparray.push(obj);
    })
    var changeaccountXML = '';
    changeaccountXML = jsonxml(this.temparray);


    var emailmobileFlag = [];
    var flagChange = [{ name: 'mobile', flag: this.nomobileFlag ? 'Y' : 'N' },
    { name: 'email', flag: this.noemailFlag ? 'Y' : 'N' }];

    flagChange.forEach(data => {
      var obj = {};;
      var name = 'changeFlag';
      obj[name] = data;
      emailmobileFlag.push(obj)
    })

    var emailmobileFlagXML = '';
    emailmobileFlagXML = jsonxml(emailmobileFlag);

    var arraytempt = [];

    if (action == 'savefinalise') {

      var documents = [];
      documents = this.img.reternImagefinalArray()
      let appFormReceived: boolean = false
      if (documents && documents.length > 0) {
        documents.forEach(item => {
          if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
            appFormReceived = true
          }
        })
        if (!appFormReceived) {
          this.notification.error('Application form not uploaded', '')
          return
        }
        else {
          var documentJson = this.utilServ.setJSONMultipleArray(documents)
          var documentxml = jsonxml(documentJson)
        }
      }
      else {
        this.notification.error('No documents uploaded', '')
        return
      }
    }
    var proof = []
    proof = this.img.setDataForxml();
    arraytempt.push({ "flag": emailmobileFlagXML })
    arraytempt.push({ "ApplicableAccounts": changeaccountXML })
    arraytempt.push({ "VerificationStatus": this.krakyc })
    arraytempt.push({ "ProofUpload": proof })
    var jsonarray = this.utilServ.setJSONMultipleArray(arraytempt)
    var xmldata = jsonxml(jsonarray);

    let save = {
      "batchStatus": "false",
      "detailArray":
        [{

          Pan: this.model.PanNo.PAN,
          EntryType: this.changereq,
          ActionType: 'P',
          FileData: xmldata,
          ActionUser: this.currentUser.userCode,
          Rejection: '',
          IDNO: '',
          RiskCountry: '',
          CommunicationAddress: '',
          SMSFlag: '',
          RequestFrom: '',
          RejectReason: ''
        }],
      "requestId": "6010"
    }
    let Finalyse = {
      "batchStatus": "false",
      "detailArray":
        [{

          Pan: this.model.PanNo.PAN,
          EntryType: this.changereq,
          ActionType: 'I',
          FileData: documentxml,
          ActionUser: this.currentUser.userCode,
          Rejection: '',
          IDNO: this.changereq == 'NoEmailMobile' ? this.serielno : '',
          RiskCountry: '',
          CommunicationAddress: '',
          SMSFlag: '',
          RequestFrom: '',
          RejectReason: ''
        }],
      "requestId": "6010"
    }

    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to save</b>',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray(action == 'savefinalise' ? Finalyse : save).then((response) => {
          this.isSpining = false;
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notification.success(response.results[0][0].errorMessage, '');
                this.onviewReset();
                if (this.changereq == 'NoEmailMobile') {
                  this.applicationStatus = 'T'
                }
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.isSpining = false
                this.notification.error('Error', '');
              }
            }
            else {
              this.isSpining = false
              this.notification.error('Error', '');
            }
          }
          else {
            this.isSpining = false
            this.notification.error(response.errorMsg, '');

          }
        });
      }
    })
  }
  Approve() {
    // let reason :any =this.form.controls.Rejection;
    if (this.RegectionReason == '' || this.RegectionReason == null) {
      this.notification.error('Remark required', '')
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to approve ?</b>',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.clientArray[0].PANNo,
              EntryType: this.changereq,
              ActionType: 'A',
              FileData: '',
              IDNO: this.clientArray[0].SLNO,
              ActionUser: this.currentUser.userCode,
              Rejection: this.RegectionReason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {

          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notification.success(response.results[0][0].errorMessage, '');
                this.onviewReset();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.isSpining = false
                this.notification.error('Error', '');
              }
            }
            else {
              this.isSpining = false
              this.notification.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notification.error(response.errorMsg, '');
          }
        })
      }
    });
  }

  Reject() {

    if (this.RegectionReason == '' || this.RegectionReason == undefined) {
      this.notification.error('Remark is required', '')
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.clientArray[0].PANNo,
              EntryType: '',
              ActionType: 'R',
              FileData: '',
              IDNO: this.clientArray[0].SLNO,
              ActionUser: this.currentUser.userCode,
              Rejection: "HO Rejected-" + this.RegectionReason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {

          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notification.success(response.results[0][0].errorMessage, '');
                this.onviewReset();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.isSpining = false
                this.notification.error('Error', '');
              }
            }
            else {
              this.isSpining = false
              this.notification.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notification.error(response.errorMsg, '');
          }
        })
      }
    });
  }
  clearResponseData() {
    this.pendingcount = '';
    this.rejectionCount = '';
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.clientArray = [];
    this.krakyc = [];
    this.clientArrayTemp = [];
    this.noDataflag = true;
    this.changereq = null;
    this.cmServ.requestID.next('')
    this.FirstlevelApprove = [];
    this.frstLvlApprovalCount = ''
    // this.model.Pan = '';
    // this.model.Cin = '';
    // this.model.uniqueCode= '';
  }

  PrintForm(req) {
    let CKYC: boolean = false
    if (this.changereq == 'CKYC' || this.changereq == 'Reactivation' || this.changereq == 'KRAKYC') {
      CKYC = true
    }
    if(this.changereq != 'SegmentAddition' && this.changereq != 'Additionaltc'){
    this.isSpining = true
    let requestParams = {

      "batchStatus": "false",
      "detailArray": [{
        "PanNo": this.model.PanNo ? this.model.PanNo.PAN : '',
        "SlNo": this.changereq == 'NoEmailMobile' ? this.serielno : 0,
        "EUser": this.currentUser.userCode,
        "Type": this.changereq,
        "BarcodeID": this.changereq == 'NoEmailMobile' ? this.serielno : 0,
        "Flag": this.changereq == 'Nominee' ? 2 : this.changereq == 'NoEmailMobile' ? 0 : this.changereq == 'SignatureUpdation' ? 3 : this.changereq == 'ModeofOperation' ? 4 : 1
      }],
      "requestId": "7050",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let requestParamsKYC = {
      "batchStatus": "false",
      "detailArray": [{
        "Euser": 'N',
        "Pan": this.model.PanNo ? this.model.PanNo.PAN : '',
        "BarCode": 0,
        "IncludeRelatedPerson": 'N'
      }],
      "requestId": "7063",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }

    let isPreview = false
    this.dataServ.generateReport(CKYC ? requestParamsKYC : requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != '') {
        this.notification.success('File downloaded successfully', '');
        return;
      }
      else {
        if (!isPreview) {
          this.notification.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.isSpining = false
      this.notification.error("Server encountered an Error", '');
    });
  }
  else{
    this.notification.success('File downloaded successfully', '');
    return;
  }
  }

  OpenNewTab(tab) {
    this.getPermissions()

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
      this.dataServ.fromreport = true;
      setTimeout(() => { this.wsServ.createWorkspace(tab) }, 200);
    }
    else {
      this.dataServ.fromreport = true;
      setTimeout(() => { this.wsServ.createWorkspace(tab) }, 200);
    }
  }


  BranchReject() {

    if (this.RegectionReason == '' || this.RegectionReason == undefined) {
      this.notification.error('Remark is required', '')
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.clientArray[0].PANNo,
              EntryType: '',
              ActionType: 'R',
              FileData: '',
              IDNO: this.clientArray[0].SLNO,
              ActionUser: this.currentUser.userCode,
              Rejection: "Branch Rejected-" + this.RegectionReason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {

          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notification.success(response.results[0][0].errorMessage, '');
                this.onviewReset();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notification.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.isSpining = false
                this.notification.error('Error', '');
              }
            }
            else {
              this.isSpining = false
              this.notification.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notification.error(response.errorMsg, '');
          }
        })
      }
    });
  }

  ShowIpvHistory(data) {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Tradecode: data
        }],
      "requestId": "7288",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response[0] && response[0].rows.length > 0) {
        this.isIpvHistory = true
        this.IPVHistoryHeader = response[0].metadata.columns
        this.IPVHistory = this.utilServ.convertToResultArray(response[0]);
      }
      else {
        this.isIpvHistory = false
        this.notification.error('No data found', '')
      }
    })
  }

  ShowHolderDetails(data) {
    if (data.AccountType == 'TRADING') {
      return
    }
    else {
      this.isVisibleHolders = true;
      this.holderData = [{
        'AccountName': data.AccountName, 'SecondHolderName': data.SecondHolderName,
        'ThirdHolderName': data.ThirdHolderName
      }]
      this.holderDataHeader = ['AccountName', 'SecondHolderName', 'ThirdHolderName']
    }
  }

  sendLink() {
    var flag
    if (this.showEmail == true) {
      flag = 'E'
      if (this.newEmail == '' || this.newEmail == undefined || this.newEmail == null) {
        this.notification.error("Please enter new Email ID.", '');
        return
      }
    }
    if (this.showMob == true) {
      flag = 'M'
      if (this.newMobile == '' || this.newMobile == undefined || this.newMobile == null) {
        this.notification.error("Please enter new Mobile No.", '');
        return
      }
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.model.PanNo ? this.model.PanNo.PAN : '',
          Mob: this.newMobile ? this.newMobile : '',
          Email: this.newEmail ? this.newEmail : '',
          flag: flag,
          euser: this.currentUser.userCode
        }],
      "requestId": "100005",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response[0] && response[0].rows.length > 0) {
        if (response[0].rows[0][0] == 0) {
          this.notification.success('Link send successful', '')
        }
        else {
          this.notification.error(response[0].rows[0][1], '')
        }
      }

    })
  }

  flagReset() {
    this.addressFlag = false;
    this.emailFlag = false;
    this.mobileFlag = false;
    this.telephoneFlag = false;
    this.bankFlag = false;
    this.nomineeFlag = false;
    this.financialFlag = false;
    this.ckycFlag = false;
    this.SignatureFlag = false;
    this.emialOrmobileVisibleStatus = '';
    this.modeOfOperationFlag = false;
    // this.additionaltcflag=false;
    // this.SegmentAdditionflag=false;
    this.tableCheckBoxforTrading =false;
  }

  onClientSearch() {
    // alert("onClientSearch")
    // console.log(this.model);
    
    // return
    // console.log(this.model.PanNo);
    
    if (!this.model.PanNo && !this.model.Cin && !this.model.uniqueCode) {
      this.isSpining = true;
      setTimeout(() => {
        if (!this.model.PanNo && !this.model.Cin && !this.model.uniqueCode) {
          this.notification.error('Please enter PAN / CIN / Unique Code', '');
          this.isSpining = false;
        return;
        }
        this.onSelectClient()
      }, 3000);
    }
    else {
      this.onSelectClient()
    }
  }
  eventCheck(event, accountCode) {
    var count = 0
    for (let i = 0; i < this.clientArrayTemp.length; i++) {
      if (this.clientArrayTemp[i].AccountFlag && this.clientArrayTemp[i].AccountClientType == 'NRE') {
        count = count + 1
      }
    }
    if (count == 0) {
      this.krakyc.NREClnt = 0

    }
    else {
      this.krakyc.NREClnt = 1
    }
    if(this.changereq == 'ModeofOperation'){
      this.modeOfOperationClientArrayForActiveFlagCheck.map((n:any)=>{
        if(n.AccountCode == accountCode){
          this.modeOfOperationClientArrayForActiveFlagCheck[this.modeOfOperationClientArrayForActiveFlagCheck.findIndex((i:any)=>i.AccountCode == accountCode)].AccountFlag = event.checked;
        }
      })
    }
  }

  tradingAccountSelect(event){
    var  i = 0; 
    this.clientArrayTemp.forEach(item => {
      console.log(i,item,event)
      if(item.AccountType == "TRADING" && item.AccountFlag){
           i += 1
          }
    });
    if(i==0){
      this.notification.error('Please select one tradecode', '')
      return;
      
    }
    else if(i>1){
      this.notification.error('Please select only one tradecode', '')
      return;
    }
    else if(i == 1){
      this.isOneTradingAccountSelected =true;
    }
    

  }

  isRedirectFromClientnet(){
    let clientnetId = this.dashboardServ.getClientNetID();
    if(clientnetId){
      this.clientStatus = true;
      this.model.uniqueCode = clientnetId;
      this.onClientSearch();
    }else{
      this.clientStatus = false;
    }
  }
  changeDate(event){
    this.dobText=event?moment(event).format('DD/MM/yyyy'):''
    this.dob=undefined
    if (this.datePicker2) {
      this.datePicker2.nzValue = null;
    }
    
  }
  testDate(str) {
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if(t === null)
      return false;
    var d = +t[1], m = +t[2], y = +t[3];
  
  // Get the year from the Date object
  const year = new Date().getFullYear();
    if(m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= year) {
      return true;  
    }
  
    return false;
  }
  formatInputDate(event: any): void {

    console.log(event.target.value,"event.target.value");
    // if (/\D/.test(event.target.value)) {
      //   event.target.value=''
      //   this.dobText = null;
      //   return
      // }
    if (/[^0-9\/]/.test(event.target.value)) {
      event.target.value=''
      this.dobText = null;
      return
    }
    let input = event.target.value.replace(/\D/g, '');
    console.log(input,"input");
    if (input.length >= 2 && input.length < 5) {
      input = input.substring(0, 2) + '/' + input.substring(2);
    } else if (input.length > 4) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
    }
    this.dobText = input;
  }
  validatePanNum(val) {
    // console.log(val);

    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    // console.log("val.currentTarget.value : ",val.currentTarget.value);
    // console.log("val.target.selectionStart :",val.target.selectionStart);
    // console.log("val.target.selectionStart type : ",typeof val.target.selectionStart );

    // val.currentTarget.value.length
    var fullstring = val.currentTarget.value
    var text = val.key
    // console.log(text);

    if (val.target.selectionStart <= 4) {
      // console.log("1");
      // console.log(charonly.test(text));

      return charonly.test(text)

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      // console.log("2");
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      // console.log("3");
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      // console.log("4");
      return false;
    }
  }
  // validateName(val,type?) {
  //   console.log(val,type);
    
  //   let charonly = /^[a-zA-Z ]*$/
  //   let space =/^[ ]*$/
  //   var text = type==='verify'?val:val.key
  //   let bool =type==='verify' && space.test(text)?false:charonly.test(text)

  //   return bool
  // }
  validatePANOnVerify(panCardNo:string):boolean
  {
    console.log(panCardNo,"panCardNo",typeof panCardNo);
    
    let regex = new RegExp(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/);
    if (panCardNo == null) {
      return false;
  }
  // Return true if the PAN NUMBER
  // matched the ReGex
  if (regex.test(panCardNo) == true) {
      return true;
  }
  else {
      return false;
  }
  }
  verify() {
    if (!this.panNo) {
      this.notification.error('PAN is missing ', '');
      return;
    }
    this.panNo=this.panNo.toUpperCase()
    if(!this.validatePANOnVerify(this.panNo))
    {
      this.notification.error('Please enter valid PAN ', '');
      return;
    }
    if (!this.name) {
      this.notification.error('Please enter Name (As per PAN Card) ', '');
      return;
    }
    this.name=this.name.toUpperCase()
    // if(!this.validateName(this.name,'verify'))
    // {
    //   this.notification.error('Please enter valid Name (As per PAN Card)', '');
    //   return;
    // }
    if (!this.dobText) {
      this.notification.error('Please enter DOB ', '');
      return;
    }
    if (!this.testDate(this.dobText)) {
      this.notification.error('Please enter valid DOB ', '');
      return;
    }
    
    this.isSpining = true;

    this.dataServ.post(environment.pan_verify,[
        {
            "pan": this.panNo ? this.panNo : '',//"CYIPP8888A", //-- M
            "name": this.name ? this.name : '',//"ABC PQR XYZ", //-- M
            "fathername": '',//"PQR ABC FED", //-- O
            "dob": this.dobText ? this.dobText : ''//"19/08/1974" //-- M
        }],{'Content-Type':'application/json'})
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       PAN: this.panNo ? this.panNo : ''
    //     }],
    //   "requestId": "100062",
    //   "outTblCount": "0"
    // })
    .then((resp:any) => {
      this.isSpining = false;
      if(resp && resp.errorCode=='1')
      {
      if (resp && resp.data) {
        let orderdata = JSON.parse(resp.data)
        console.log(orderdata);
        
        this.verifytableData = orderdata && orderdata.outputData?orderdata.outputData:[]
        console.log(this.verifytableData);
        this.verifiedPan=false
        if (this.verifytableData.length > 0) {
          // console.log("this.verifytableData[0].name",this.verifytableData[0].name);
          try{
            this.nameDisable=this.verifytableData[0].name==='Y'
            console.log(this.nameDisable,"this.nameDisable");
            
            this.dobDisable=this.verifytableData[0].dob==='Y'
            
          }
          catch(err)
          {
            this.nameDisable=false
            this.dobDisable=false
          }
          finally{
            if(this.verifytableData && this.verifytableData[0])
              {
                // Name and (or) DOB not match as per IT site, pls retry
                // "PAN not match as per records, pls contact client registration for updating PAN
                
                if(this.verifytableData[0].pan_status!=='E' )
                {
                  this.notification.error('PAN not valid as per IT site, pls contact branch for updating PAN', '')
                  return
                }
                if( !this.nameDisable && !this.dobDisable )
                {
                  this.notification.error('Name and DOB not match as per IT site, pls retry', '')
                  return
                }
                if( !this.nameDisable)
                {
                  this.notification.error('Name not match as per IT site, pls retry', '')
                  return
                }
                if( !this.dobDisable)
                {
                  this.notification.error('DOB not match as per IT site, pls retry', '')
                  return
                }
                this.savePanName()
                this.notification.success('Verified. Please proceed','')
                this.verifiedPan=true
              }
              else
              {
                this.notification.error('Some issue in pan service', '')
                this.verifiedPan=false
                  return
              }
          }
        } else {
          this.notification.error('No data found', '');
          return;
        }
      } else {
        this.notification.error('Server error', '');
        return;
      }
    }
    else {
      this.notification.error(resp.errorMessage, '');
      return;
    }
    })
  }
  savePanName()
  {
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.model.PanNo ? this.model.PanNo.PAN : '',
	        ClientID :this.clientArray && this.clientArray[0] && this.clientArray[0].AccountId?this.clientArray[0].AccountId:'',
	        Flag :'S',
	        Name :this.name?this.name:'',
	        ActionUser :this.currentUser.userCode
        }],
      "requestId": "10000110",
    }).then((response) => {
      this.isSpining=false
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          console.log(response.results);
          
        }
      }
  })
}
}
