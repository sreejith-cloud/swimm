import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService } from "shared";
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, flip, fadeInDown, fadeInLeft, fadeInRight, zoomIn, fadeIn } from 'ng-animate';
import { FormHandlerComponent } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';


export interface schememappingForm {
  dpid: any;
  clientname: string;
  Tradecode: any;
  scheme: any;
  lasttradeddate: Date;
  bank: any;
  chequeno: any;
  chequedt: any;
  remark: any;
  debittrade: any;
  cashorbank: any;
  Location: any;
  state: any;
  Region: any;
  Scheme: String;
  Referenceno: String;
  Active: String;
  Amountchr: String;
  Holding: String;
  Cheque: String;
  AMCFee: String;
  AccountType: String;
  alllocation: String;
  isin: any;
  sORd: String;
  Activetill: Date;
  Shcemetype: String;
  Trading: String;
  Brokerage: String;
  ApplicableFor: String;
  dp: String;
  amc: String;
  ApplicableFor1: String;
  Margin: String;
  Applicable: String;
  schmereferenceno: string;
  pan: string;
  dpClientid: any;
  clientid: string;
  ApplicableType: string;
  InactivityPeriod: string;
  ActiveTill: string;
  mappingrefund: any;
  refundschemename: any;
  refundschmereferenceno: any;
  amountpaid: any;
  refundgst: any;
  refundadditionalcess: any;
  amountutilised: any;
  refundableamount: any;
}
@Component({
  templateUrl: './schememapping.component.html',
  styleUrls: ['./schememapping.component.less'],
})
export class schememappingComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  model: schememappingForm;
  TradeFindopt: FindOptions;
  today = new Date;
  schemeFindopt: FindOptions;
  BankFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  currentUser: User;
  isSpinning: boolean;
  bankboo: boolean = false;
  chequeboo: boolean = false;
  chequedateboo: boolean = false;
  isVisible: boolean = false;
  remarkboo: boolean = false;
  dateFormat = 'dd/MM/yyyy';
  inputMasks = InputMasks;
  schemedata: any = [];
  schemerefunddata: any = [];
  schemes: any = [];
  schemes2: any = [];
  banklocation: any;
  showdetails: boolean = false;
  mappingrad: boolean = false;
  mapping: boolean = false;
  refund: boolean = false;
  refundrad: boolean = false;
  modalser: boolean;
  map: boolean = false;
  text: any;
  refunddetails: boolean = false;
  isVisiblebutton: boolean = false;
  showschemedatarefund: boolean = false;
  isVisiblecashorbank: boolean = false;
  isVisibleBank: boolean = false;
  popupconfirm: boolean = false;
  flag: any;
  Dpids: any;
  Total: number;
  GST: number;
  KFC: number;
  Net: number;
  showschemedata: boolean = false
  lastdate: boolean = false;
  Voucherid: string;
  Voucherid1: string;

  constructor(
    private authServ: AuthService,
    private modalService: NzModalService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
  ) {
    this.model = <schememappingForm>{
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.loadsearch();
    });
  }
  loadsearch() {
    this.mapping = true;
    this.TradeFindopt = {
      findType: 5095,
      codeColumn: 'AccountReference_4',
      codeLabel: 'AccountReference_4',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.schemeFindopt = {
      findType: 5041,
      codeColumn: 'SchemeName',
      codeLabel: 'SchemeName',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.dpClientIdFindopt = {
      findType: 5095,
      codeColumn: 'AccountReference_2',
      codeLabel: 'AccountReference_2',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    // this.BankFindopt = {
    //   findType: 5008,
    //   codeColumn: 'Acname',
    //   codeLabel: 'Acname',
    //   descColumn: 'Acname',
    //   descLabel: 'Acname',
    //   requestId: 8,
    //   whereClause: "location ='" + this.model.Tradecode.accountlocation + "'"
    // }
  }
  ngOnInit() {
    this.model.cashorbank = 'Cash';
    this.isVisiblecashorbank = false;
    this.model.mappingrefund = 'M';
    this.getDpid()
  }
  getlasttradeddate(data) {
    debugger
    if (data == null) {
      return;
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        ClientId: data,
        Tradecode: '',
        Euser: this.currentUser.userCode,
      }],
      "requestId": "7009",
      "outTblCount": "0"
    }).then((response) => {
      this.showdetails = true;
      this.lastdate = true;
      var a = this.utilServ.convertToObject(response[0]);
      this.model.lasttradeddate = a[0].TradedDate
    })
    this.BankFindopt = {
      findType: 5008,
      codeColumn: 'AccountCode',
      codeLabel: 'AccountCode',
      descColumn: 'Acname',
      descLabel: 'Acname',
      requestId: 8,
      whereClause: "location ='" + this.banklocation + "'"
    }
  }
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) < 0;
  };
  checkdate() {
    var days;
    var months;
    // var diff;
    // yourOldDate may be is coming from DB, for example, but it should be in the correct format ("MM/dd/yyyy hh:mm:ss:fff tt")
    const date1 = this.model.chequedt
    const date2 = new Date()
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    // diff = Math.floor((diffTime) % (1000 * 60 * 60 * 24 * 365));
    months = Math.floor((diffTime) / (1000 * 60 * 60 * 24 * 30));
    days = Math.floor((diffTime) / (1000 * 60 * 60 * 24));
    if (months > 2) {
      this.notification.warning("Cheque Date should not be more than 3 months", '');
      this.model.chequedt = new Date()
      return
    }
  };
  getlasttradeddate1(data) {
    debugger
    if (data == null) {
      return;
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        ClientId: '',
        Tradecode: data,
        Euser: this.currentUser.userCode,
      }],
      "requestId": "7009",
      "outTblCount": "0"
    }).then((response) => {
      this.showdetails = true;
      this.lastdate = true;
      var a = this.utilServ.convertToObject(response[0]);
      this.model.lasttradeddate = a[0].TradedDate
    })
    this.BankFindopt = {
      findType: 5008,
      codeColumn: 'AccountCode',
      codeLabel: 'AccountCode',
      descColumn: 'Acname',
      descLabel: 'Acname',
      requestId: 8,
      whereClause: "Location ='" + this.banklocation + "'"
    }
    debugger
  }
  resetforcashbank() {
    this.model.cashorbank = 'Cash';
    this.model.chequeno = '';
    this.model.chequedt = '';
    this.model.bank = ''
    this.isVisibleBank = false
  }
  getschemedetails(data) {
    debugger
    this.resetforcashbank();
    if (this.model.dpClientid == null) {
      this.notification.error('please select DpClientid', '')
      return;
    }

    this.resetForm1();
    if (data == null) {
      return;
    }
    else {
      debugger
      this.isSpinning = true;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
        [{
          SchemeRefernceNo: data,
          Euser: this.currentUser.userCode,
          Flag: 'N',
          ClientID: this.model.Tradecode == null ? this.model.dpClientid.Clientid : this.model.Tradecode.Clientid ? this.model.Tradecode.Clientid : '',
          DpID: this.model.dpid || '',
          DpClientID: this.model.dpClientid.AccountReference_2 || ''
        }],
        "requestId": "7007",
        "outTblCount": "0"
      }).then((response) => {
        debugger
        var a = this.utilServ.convertToObject(response[0])
        if (a[0].errorCode) {
          this.resetForm1();
          this.isSpinning = false;
          this.notification.error(a[0].errorMsg, '')
          return;
        }
        else {
          this.showschemedata = true;
          this.isVisiblecashorbank = true
          this.isSpinning = false;
          this.schemedata = a
          this.model.Trading = this.schemedata[0].TradingFee
          this.model.Brokerage = this.schemedata[0].BrokerageFree;
          this.model.ApplicableFor = this.schemedata[0].Trading_ApplicableFor
          this.model.dp = this.schemedata[0].DPFee
          this.model.amc = this.schemedata[0].AmcFree
          this.model.ApplicableFor1 = this.schemedata[0].AMC_ApplicableFor;
          this.Total = this.schemedata[0].Total;
          this.GST = this.schemedata[0].GST;
          this.KFC = this.schemedata[0].AdditionalCess;
          this.Net = this.schemedata[0].NetAmount;
          this.model.scheme = this.schemedata[0].SchemeName
          this.model.ApplicableType = this.schemedata[0].ApplicableType;
          this.model.ActiveTill = this.schemedata[0].ActiveTill;
          this.model.schmereferenceno = this.schemedata[0].SchemeReferenceNo;
        }
      })
    }
  }
  AmcChargeYESorNo() {
    this.resetboo()
    if (!this.model.cashorbank) {
      this.notification.error('please select bank or cash', '')
      return;
    }
    if (this.model.cashorbank == 'Bank') {
      if (!this.model.bank) {
        this.notification.error('please select bank ', '')
        this.bankboo = true;
        return;
      }
      if (!this.model.chequeno) {
        this.notification.error('please enter cheque no. ', '')
        this.chequeboo = true;
        return;
      }
      if (!this.model.chequedt) {
        this.notification.error('please select cheque date ', '')
        this.chequedateboo = true;
        return;
      }
    }
    if (!this.model.remark) {
      this.notification.error('please enter remarks', '')
      this.remarkboo = true;
      return;
    }
    this.isVisible = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Clientid: this.model.Tradecode.Clientid || this.model.dpClientid.Clientid || 0,
        DpID: this.model.dpid,
        Dpclientid: this.model.dpClientid.AccountReference_2,
        TradeCode: this.model.Tradecode.AccountReference_4 = "" ? '' : this.model.Tradecode.AccountReference_4,
        Scheme: this.model.scheme || '',
        SchemeRefernceNo: this.model.schmereferenceno || 0,
        Remarks: this.model.remark || '',
        Cash_Or_Bank: this.model.cashorbank || '',
        Bank: this.model.cashorbank == 'Cash' ? '' : this.model.bank.Acname || '',
        ChequeNo: this.model.cashorbank == 'Cash' ? '' : this.model.chequeno,
        ChequeDate: this.model.cashorbank == 'Cash' ? '' : moment(this.model.chequedt).format(AppConfig.dateFormat.apiMoment) || null,
        Amount: this.Total || 0,
        GST: this.GST || 0,
        NetAmount: this.Net || 0,
        AdditionalCess: this.KFC || 0,
        TradingFee: this.model.Trading || 0,
        DPFee: this.model.dp || 0,
        Euser: this.currentUser.userCode,
        Location: this.model.Tradecode.accountlocation || this.model.dpClientid.accountlocation || '',
      }],
      "requestId": "7055",
      "outTblCount": "0"
    })
      .then((response) => {
        debugger
        if (response && response[0] && response[0].rows.length > 0) {
          debugger
          var a = this.utilServ.convertToObject(response[0]);
          if (a[0].errorMsg) {
            debugger
            if (a[0].ErrorCode == 1) {
              debugger
              this.popupconfirm = true;
              var b = a[0].errorMsg; debugger
              this.text = b;
              //this.notification.error(b, ''); debugger
              this.modalService.confirm({
                nzTitle: this.text,
                nzContent: '<b>Do you want to continue ?</b>',
                nzOkText: 'Yes',
                nzOkType: 'danger',
                nzOnOk: () => this.save('Y'),
                nzCancelText: 'No',
                nzOnCancel: () => this.save('N')
              });
              return;
            }
            else if (a[0].ErrorCode == 0) {
              this.save(a[0].errorMsg);
              debugger
            }
            else {
              this.notification.success('Data save successfully', '')
              this.Voucherid = a[0].VoucherID
            }
          }
        }
      });
  }
  // getschemedetailsforrefund(data) {
  //   this.showschemedatarefund = false;
  //   this.isVisiblebutton = false
  //   this.resetForm1();
  //   if (data == null) {
  //     return;
  //   }
  //   this.isSpinning = true;
  //   this.dataServ.getResponse({
  //     "batchStatus": "false",
  //     "detailArray":
  //     [{
  //       SchemeRefernceNo: data,
  //       Euser: this.currentUser.userCode,
  //       ClientID: this.model.dpClientid.Clientid || this.model.Tradecode.Clientid || '',
  //       flag: '',
  //       DpID: this.model.dpid || '',
  //       DpClientID: this.model.dpClientid.AccountReference_2 || '',
  //       tradecode: ''
  //     }],
  //     "requestId": "7023",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     var a = this.utilServ.convertToObject(response[0]);
  //     if (a[0].errorCode) {
  //       this.resetForm1();
  //       this.isSpinning = false;
  //       this.notification.error(a[0].errorMsg, '')
  //       return;
  //     }
  //     else {
  //       this.showschemedatarefund = true;
  //       this.refunddetails = true
  //       this.isVisiblebutton = true
  //       this.isSpinning = false;
  //       this.schemerefunddata = a;
  //       this.model.refundschemename = this.schemerefunddata[0].SchemeName;
  //       this.model.refundschmereferenceno = this.schemerefunddata[0].SchemeRefernceNo;
  //       this.model.amountpaid = this.schemerefunddata[0].AmountPaid
  //       this.model.refundgst = this.schemerefunddata[0].GST;
  //       this.model.refundadditionalcess = this.schemerefunddata[0].AdditionalCess;
  //       this.model.amountutilised = this.schemerefunddata[0].Amountutilized;
  //       this.model.refundableamount = this.schemerefunddata[0].RefundableAmount;
  //     }
  //   })
  // }

  cashbankchange(data) {
    this.model.bank = ''
    this.model.chequeno = '';
    if (data == "Cash") {
      this.model.chequedt = null;
      this.isVisibleBank = false;
    }
    else {
      this.banklocation
      debugger
      this.isVisibleBank = true;
      this.isSpinning = true;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
        [{
          Location: this.banklocation,

        }],
        "requestId": "7045",
        "outTblCount": "0"
      }).then((response) => {
        var a = this.utilServ.convertToObject(response[0]);
        debugger
        if (a.length == 0) {
          this.isSpinning = false;
          this.model.bank = ''
        }
        else
          if (a.length == 1) {
            this.isSpinning = false;
            this.model.bank = { "AccountCode": a[0].AccountCode, "Acname": a[0].Acname };
            debugger
          }
          else {
            this.isSpinning = false;
            this.model.bank = ''
          }
      })
    }
    this.model.remark = ''
  }

  getscheme(data) {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        SchemeRefernceNo: '',
        Euser: this.currentUser.userCode,
        Flag: '',
        ClientID: data,
        DpID: '',
        DpClientID: ''
      }],
      "requestId": "7007",
      "outTblCount": "0"
    }).then((response) => {
      this.dataServ.viewLog()
      if (response && response[0].rows.length > 0) {
        var scheme1 = this.utilServ.convertToObject(response[0]);
        this.schemes = scheme1; debugger
        this.schemes = [...this.schemes];
      }
    });
  }

  //   getscheme1(data) { debugger
  // console.log(this.mapping)
  // console.log(this.refund)
  //     this.dataServ.getResponse({
  //       "batchStatus": "false",
  //       "detailArray":
  //       [{
  //         SchemeRefernceNo: '',
  //         Euser: this.currentUser.userCode,
  //         Flag: '',
  //         ClientID: '',
  //         DpID: '',
  //         DpClientID: data
  //       }],
  //       "requestId": "7007",
  //       "outTblCount": "0"
  //     }).then((response) => { debugger
  //       if (response.length > 0) {
  //         if(this.mapping==true){ debugger
  //         this.showdetails = true;
  //         this.lastdate = true;
  //         //this.mappingFn('M');
  //         this.mappingrad = true;
  //         var scheme1 = this.utilServ.convertToObject(response[0]);
  //         this.schemes = scheme1;debugger
  //         this.schemes = [...this.schemes];
  //       } 
  //     else if(this.refund==true){ debugger
  //         this.showdetails = true;
  //         this.lastdate = true;
  //         this.refundrad = true;
  //         var scheme1 = this.utilServ.convertToObject(response[0]);
  //         this.schemes = scheme1;debugger
  //         this.schemes = [...this.schemes];
  //     }debugger
  //       }
  //       else {
  //         this.notification.error('No data found', '')
  //       }debugger
  //     });
  //   }

  getscheme2(data) {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        SchemeRefernceNo: 0,
        Euser: this.currentUser.userCode,
        ClientID: data,
        flag: 'N',
        DpID: '',
        DpClientID: '',
        tradecode: ''
      }],
      "requestId": "7023",
      "outTblCount": "0"
    })
      .then((response) => {
        this.dataServ.viewLog()
        if (response && response[0].rows.length > 0) {
          var scheme1 = this.utilServ.convertToObject(response[0]);
          debugger
          this.schemes = scheme1;
        }
      });
  }

  resetForm3() {

    this.isVisiblecashorbank = false;
    this.model.Tradecode = '';
    this.model.scheme = null;
    this.showdetails = false;
    this.schemes = [];
    this.schemes2 = [];
    this.schemedata = [];
    this.model.dpid = null;
    this.model.dpClientid = '';
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.schemerefunddata = [];
    this.mappingrad = false;
    this.refundrad = false;
    this.isVisiblebutton = false;
  }

  resetForm() {

    this.isVisiblecashorbank = false;
    this.model.Tradecode = '';
    this.model.scheme = null;
    this.model.chequedt = null;
    this.showdetails = false;
    this.schemes = [];
    this.schemedata = [];
    this.model.dpid = null;
    this.model.dpClientid = '';
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.model.cashorbank = 'Cash';
    this.schemerefunddata = [];
    this.mappingrad = false;
    this.model.bank = '';
    this.model.chequeno = '';
    this.refundrad = false;
    this.isVisiblebutton = false;
    this.model.mappingrefund = 'M';
    this.mapping = true;
    this.refund = false;
    this.bankboo = false;
    this.chequeboo = false;
    this.chequedateboo = false;
    this.remarkboo = false;
  }
  resetForm1() {

    this.isVisiblecashorbank = false;
    // this.model.Tradecode = '';
    // this.model.scheme = null;
    // this.showdetails = false;
    // this.schemes = [];
    // this.schemedata = [];
    // this.model.dpid = null;
    // this.model.dpClientid = '';
    this.showschemedata = false;
    this.model.remark = '';
  }
  resetboo() {
    this.bankboo = false;
    this.chequeboo = false;
    this.chequedateboo = false;
    this.remarkboo = false;
  }

  save(data) {
    this.flag = data
    debugger
    this.resetboo()
    this.isVisible = false;
    if (!this.model.cashorbank) {
      this.notification.error('please select bank or cash', '')
      return;
    }
    if (this.model.cashorbank == 'Bank') {
      if (!this.model.bank) {
        this.notification.error('please select bank ', '')
        this.bankboo = true;
        return;
      }
      if (!this.model.chequeno) {
        this.notification.error('please enter cheque no. ', '')
        this.chequeboo = true;
        return;
      }
      if (!this.model.chequedt) {
        this.notification.error('please select cheque date ', '')
        this.chequedateboo = true;
        return;
      }
    }
    if (!this.model.remark) {
      this.notification.error('please enter remarks', '')
      this.remarkboo = true;
      return;
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Clientid: this.model.Tradecode.Clientid || this.model.dpClientid.Clientid || 0,
        DpID: this.model.dpid,
        Dpclientid: this.model.dpClientid.AccountReference_2,
        TradeCode: this.model.Tradecode.AccountReference_4 = "" ? '' : this.model.Tradecode.AccountReference_4,
        Scheme: this.model.scheme || '',
        SchemeRefernceNo: this.model.schmereferenceno || 0,
        Remarks: this.model.remark || '',
        Cash_Or_Bank: this.model.cashorbank || '',
        Bank: this.model.cashorbank == 'Cash' ? '' : this.model.bank.Acname || '',
        ChequeNo: this.model.cashorbank == 'Cash' ? '' : this.model.chequeno,
        ChequeDate: this.model.cashorbank == 'Cash' ? '' : moment(this.model.chequedt).format(AppConfig.dateFormat.apiMoment) || null,
        Amount: this.Total || 0,
        GST: this.GST || 0,
        NetAmount: this.Net || 0,
        AdditionalCess: this.KFC || 0,
        TradingFee: this.model.Trading || 0,
        DPFee: this.model.dp || 0,
        Euser: this.currentUser.userCode,
        Location: this.model.Tradecode.accountlocation || this.model.dpClientid.accountlocation || '',
        validationflag: this.flag,
      }],
      "requestId": "7008",
      "outTblCount": "0"
    })
      .then((response) => {
        debugger
        if (response && response[0] && response[0].rows.length > 0) {
          debugger
          var a = this.utilServ.convertToObject(response[0]);
          if (a[0].errorMsg) {
            debugger
            if (a[0].ErrorCode == 0) {
              var b = a[0].errorMsg; debugger
              this.notification.success(b, '');
              this.Voucherid = a[0].VoucherID; debugger
              return;
            }
            else if (a[0].ErrorCode == 1) {
              debugger
              var b = a[0].errorMsg; debugger
              this.notification.error(b, ''); debugger
              return;
            }
            else {
              this.notification.success('Data save successfully', '')
              this.Voucherid = a[0].VoucherID
            }
          }
        }
      });
  }

  // saverefund() {

  //   this.dataServ.getResponse({
  //     "batchStatus": "false",
  //     "detailArray":
  //     [{
  //       ClientID: this.model.Tradecode.Clientid || '',
  //       DpID: this.model.dpid || '',
  //       DpClientID: this.model.dpClientid.DpClientid || '',
  //       Tradecode: this.model.Tradecode.Tradecode || '',
  //       SchemeName: this.model.refundschemename || '',
  //       SchemeRefernceNo: this.model.refundschmereferenceno || '',
  //       Euser: this.currentUser.userCode,
  //       AmountPaiid: this.model.amountpaid || 0,
  //       gst: this.model.refundgst || 0,
  //       AdditionalCess: this.model.refundadditionalcess || 0,
  //       AmountUtilised: this.model.amountutilised || 0,
  //       RefundableAmount: this.model.refundableamount || 0,
  //       Location: this.model.Tradecode.accountlocation || this.model.dpClientid.Location || '',
  //     }],
  //     "requestId": "7024",
  //     "outTblCount": "0"
  //   })
  //     .then((response) => {
  //       if (response && response[0] && response[0].rows.length > 0) {
  //         var a = this.utilServ.convertToObject(response[0]);
  //         if (a[0].errorMsg) {
  //           var b = a[0].errorMsg
  //           this.notification.error(b, '')
  //           return;
  //         }
  //         else {
  //           this.notification.success('Refund Request Accepted', '')
  //           this.Voucherid1 = a[0].VOUCHERID
  //           debugger
  //         }
  //       }
  //     });
  // }

  getDpid() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Code: 1
      }],
      "requestId": "3"
    }).then((response) => {
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
          this.model.dpid = this.Dpids[0].Name;
        }
      }
    });
  }

  showResult(data) {
    debugger
    if (data == null) {
      return;
    }
    this.getscheme(data.Clientid)
    this.model.clientid = data.Clientid
    this.resetForm3();
    if (data != "" && data != null) {
      this.showdetails = true;
      this.lastdate = true;
      this.model.dpid = data.AccountReference_1.trim();
      this.model.dpClientid = { AccountReference_2: data.AccountReference_2 }; debugger
      this.model.clientname = data.Accountname
      this.model.pan = data.Pan
      this.banklocation = data.accountlocation
      this.getlasttradeddate(data.Clientid)
      if (this.mapping == true) {
        debugger
        // this.mappingFn('M');
        this.getscheme(data.Clientid)
        this.mappingrad = true;
      }
      else if (this.refund == true) {
        debugger
        this.getscheme2(data.Clientid)
        this.refundrad = true;
      }
    }
    else {
      this.model.dpid = "";
      this.model.dpClientid = { DpClientid: "" };
    } debugger
  }

  // mappingFn(data) {

  //   this.resetform2map()
  //   //this.model.dpClientid = { DpClientid: "" };
  //   if (this.showdetails == true) {
  //     this.refundrad = false;
  //     if (data == false) {
  //       this.refundrad = true;
  //       return;
  //     }
  //     this.getscheme(this.model.dpClientid.DpClientid)
  //     this.model.clientid = this.model.Tradecode.CLIENTID
  //     if (data != "" && data != false) {
  //       this.mappingrad = true;
  //       this.getlasttradeddate(this.model.Tradecode.CLIENTID)
  //     }
  //     else {
  //       this.model.dpid = "";
  //     }
  //   }
  //   this.mapping = true;
  //   this.refund = false;
  // }

  // refundFn(data) {

  //   this.resetform2Refund()
  //   this.model.dpClientid = { DpClientid: "" };
  //   if (this.showdetails == true) {
  //     this.mappingrad = false;
  //     if (data == false) {
  //       return;
  //     }
  //     this.getscheme2(this.model.Tradecode.CLIENTID)
  //     this.model.clientid = this.model.Tradecode.CLIENTID
  //     if (data != "" && data != false) {
  //       this.refundrad = true;
  //       this.showschemedata = false;
  //       this.getlasttradeddate(this.model.Tradecode.CLIENTID)
  //     }
  //     else {
  //       this.model.dpid = "";
  //     }
  //   }
  //   this.refund = true;
  //   this.mapping = false;
  // }

  resetform2() {
    this.model.scheme = null;
    // this.showdetails = false;
    this.schemes = [];
    this.schemedata = [];
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.schemerefunddata = [];
    this.isVisiblecashorbank = false;
    this.isVisiblebutton = false;
  }
  resetform2map() {
    this.model.scheme = null;
    this.showdetails = false;
    this.mappingrad = false;
    this.refundrad = false;
    this.schemes = [];
    this.schemedata = [];
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.schemerefunddata = [];
    this.isVisiblecashorbank = false;
    this.model.Tradecode = '';
    this.model.dpid = '';
    this.model.dpClientid = '';
    this.isVisiblebutton = false;
  }
  resetform2Refund() {
    this.model.scheme = null;
    this.showdetails = false;
    this.mappingrad = false;
    this.refundrad = false;
    this.schemes = [];
    this.schemedata = [];
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.schemerefunddata = [];
    this.isVisiblecashorbank = false;
    this.model.Tradecode = '';
    this.model.dpid = '';
    this.model.dpClientid = '';
    this.isVisiblebutton = false;
  }
  resetFormhead() {
    this.modalser = null
    this.flag = null
    this.text = ''
    this.isVisible = false;
    this.popupconfirm = false;
    this.isVisibleBank = false;
    this.model.cashorbank = 'Cash';
    this.isVisiblecashorbank = false;
    this.model.Tradecode = '';
    this.model.scheme = null;
    this.showdetails = false;
    this.schemes = [];
    this.schemedata = [];
    this.model.dpid = null;
    this.model.dpClientid = '';
    this.showschemedata = false;
    this.showschemedatarefund = false;
    this.model.bank = '';
    this.model.remark = '';
    this.model.chequeno = '';
    this.model.chequedt = '';
    this.schemerefunddata = [];
    this.mappingrad = false;
    this.refundrad = false;
    this.isVisiblebutton = false;
    this.model.mappingrefund = 'M';
    this.mapping = true;
    this.refund = false;
  }
  filldata(data) {
    debugger
    //this.resetForm();
    if (data == null) {
      return;
    }
    if (data.AccountReference_4 == null) {
      this.lastdate = false;
      this.showdetails = true;
    }
    else {
      this.banklocation = data.accountlocation
      this.getlasttradeddate1(data.AccountReference_4)
    }
    if (this.mapping == true) {
      this.showdetails = true;
      this.lastdate = true;
      this.getscheme(data.Clientid)
      this.mappingrad = true;
    }
    else if (this.refund == true) {
      this.showdetails = true;
      this.lastdate = true;
      this.getscheme2(data.Clientid)
      this.refundrad = true;
    }

    if (data != "" && data != null) {
      this.model.dpid = data.AccountReference_1.trim();
      this.model.dpClientid = { AccountReference_2: data.AccountReference_2.trim() };
      this.model.clientname = data.Accountname
      this.model.pan = data.Pan
      if (data.AccountReference_4 != null) {
        this.model.Tradecode = { AccountReference_4: data.AccountReference_4.trim(), NAME: data.Accountname.trim() }
      }
      else {
        this.model.Tradecode = { AccountReference_4: "", NAME: "" }
      }
    }
    else {
      this.model.dpid = "";
      this.model.dpClientid = { AccountReference_2: "" };
      this.model.Tradecode = { AccountReference_4: "", NAME: "" }
    }
  }
  getpdf() {

    debugger
    this.isSpinning = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
      [{
        ClientName: this.model.clientname || '',
        SchemeName: this.model.scheme,
        Location: this.model.Tradecode.accountlocation == null ? this.model.dpClientid.accountlocation : this.model.Tradecode.accountlocation ? this.model.Tradecode.accountlocation : '',
        Tradecode: this.model.Tradecode.AccountReference_4 || '',
        GST: this.GST ? this.GST : 0,
        Cash_Or_Bank: this.model.cashorbank,
        Bank: this.model.cashorbank == 'Cash' ? '' : this.model.bank.Acname || '',
        ChequeNo: this.model.cashorbank == 'Cash' ? '' : this.model.chequeno,
        AdditionalCess: this.KFC ? this.KFC : 0,
        Rate: this.model.dp || 0,
        TaxableValue: this.Total ? this.Total : 0,
        Total: this.Net ? this.Net : 0,
        VoucherId: this.Voucherid,
        Euser: this.currentUser.userCode,
      }],
      "requestId": "7031",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A4' };
    let isPreview: boolean; debugger
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      debugger
      this.isSpinning = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        debugger
        this.notification.error('error', '');
        return;
      }
      else {
        if (!isPreview) {
          debugger
          this.notification.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      debugger
      this.notification.error("Server encountered an Error", '');
    });
  }

  // getpdfrefund() {

  //   this.isSpinning = true;
  //   let reqParamsref = {
  //     "batchStatus": "false",
  //     "detailArray":
  //     [{
  //       ClientName: this.model.clientname || '',
  //       Location: this.model.Tradecode.accountlocation || '',
  //       PAN: this.model.Tradecode.Pan || '',
  //       reportdate: this.model.lasttradeddate || '',
  //       scheme: this.model.refundschemename || '',
  //       schemerefrenceNo: this.model.refundschmereferenceno || '',
  //       amountpaid: this.model.amountpaid || '',
  //       GST: this.model.refundgst || '',
  //       AdditionalCess: this.model.refundadditionalcess || '',
  //       AmountUtilised: this.model.amountutilised || '',
  //       RefundableAmount: this.model.refundableamount || '',
  //       VoucherId: this.Voucherid1,
  //       Euser: this.currentUser.userCode,
  //     }],
  //     "requestId": "7029",
  //     "outTblCount": "0"
  //   }
  //   reqParamsref['fileType'] = "2";
  //   reqParamsref['fileOptions'] = { 'pageSize': 'A4' };
  //   let isPreviewref: boolean;
  //   isPreviewref = false;
  //   this.dataServ.generateReport(reqParamsref, isPreviewref).then((response) => {
  //     this.isSpinning = false;
  //     if (response.errorMsg != undefined && response.errorMsg != '') {
  //       this.notification.error('error', '');
  //       return;
  //     }
  //     else {
  //       if (!isPreviewref) {

  //         this.notification.success('File downloaded successfully', '');
  //         return;
  //       }
  //     }
  //   }, () => {
  //     this.notification.error("Server encountered an Error", '');
  //   });
  // }
}
