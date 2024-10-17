import { Component, OnInit, ViewChild } from '@angular/core';
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
import * as  jsonxml from 'jsontoxml';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
export interface defineschemes {

  Location: any;
  state: any;
  Region: any;
  Scheme: String;
  Referenceno: String;
  promocode: string;
  Active: String;
  amcdate: string;
  Amountchr: String;
  Holding: String;
  Cheque: String;
  AMCFee: String;
  AccountType: String;
  alllocation: String;
  isin: any;
  freeorpaidmodify: any;
  sORd: String;
  Activetill: Date;
  Activetillmodify: Date;
  schememodifyname: any;
  Activetillfreemodify: any;
  schememodifynamefree: any;
  Shcemetype: String;
  Trading: String;
  Brokerage: String;
  ApplicableFor: String;
  DP: String;
  AMCFree: String;
  ApplicableFor1: String;
  Margin: String;
  Applicable: String;
  inactivityperiod: string;


}

@Component({
  templateUrl: './definescheme.component.html',
  styleUrls: ['./definescheme.component.less'],
  // animations: [bounceInOutAnimation]
})
export class defineschemeComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  model: defineschemes;
  isVisible = false;
  placement = 'right';
  wsKey: any;
  titile: String;
  today = new Date;
  schemeboo: boolean = false;
  schemmodboo: boolean = false;
  amcdatemodboo: boolean = false;
  promocodeboo: boolean = false;
  Shcemetypeboo: boolean = false;
  brokerageboo: boolean = false;
  applicableboo: boolean = false;
  amcfeeboo: boolean = false;
  amcapplicableboo: boolean = false;
  stateboo: boolean = false;
  locaboo: boolean = false;
  regionboo: boolean = false;
  Activetillboo: boolean = false;
  Activeboo: boolean = false;
  amcdateboo: boolean = false;
  inactivityperiodboo: boolean = false;
  marginboo: boolean = false;
  checquboo: boolean = false;
  checkboo: boolean = false;
  modifyboo: boolean = false;
  paidmodifyboo: boolean = false;
  freemodifyboo: boolean = false;
  isTBL: boolean = false;
  newinactive: boolean = false;
  exinactive: boolean = false;
  inputMasks = InputMasks;
  Addtogrid: Array<any> = [];
  Addtogrid1: Array<any> = [];
  Addtogrid2: Array<any> = [];
  Addtogrid3: Array<any> = [];
  Activelist: Array<any> = [];
  Amountlist: Array<any> = [];
  Shcemelist: Array<any> = [];
  currentUser: User;
  locationlist: String;
  statelist: String;
  regionlist: String
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  schememodifyfindopt: FindOptions;
  schememodifyfreefindopt: FindOptions
  RegionFindopt: FindOptions;
  isinFindopt: FindOptions;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService) {
    this.model = <defineschemes>{
    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.loadsearch();

  }
  modify() {
    this.modifyboo = true
    this.model.freeorpaidmodify = 'M'
    this.isTBL = true;
  }
  paidmodify(data) {
    this.paidmodifyboo = true;
    this.model.schememodifyname = null;
    this.model.Activetillmodify = null;
  }
  freemodify() {
    this.freemodifyboo = true;
    this.model.Activetillmodify = null;
    this.model.schememodifyname = null;
  }
  update() {
    debugger
    this.resetboo()
    if (this.model.freeorpaidmodify == 'M' && !this.model.schememodifyname) {
      this.notif.error('please enter scheme name', '')
      this.schemmodboo = true;
      debugger
      return;
    }
    if (this.model.freeorpaidmodify == 'M' && !this.model.Activetillmodify) {
      this.notif.error('Plese select AMC Valid Date', '')
      this.amcdatemodboo = true;
      debugger
      return
    }
    if (this.model.freeorpaidmodify == 'N' && !this.model.schememodifyname) {
      this.notif.error('please enter scheme name', '')
      this.schemmodboo = true;
      debugger
      return;
    }
    if (this.model.freeorpaidmodify == 'N' && !this.model.Activetillmodify) {
      this.notif.error('Plese select active till Date', '')
      this.amcdatemodboo = true;
      debugger
      return
    }
    else {
      debugger
      let val;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
        [{
          Schemename: this.model.schememodifyname.SchemeReferenceNo || this.model.schememodifyname.DPClientid,
          PromoCode: '',
          Active: '',
          ActiveTill: this.model.Activetillmodify == null ? '' : moment(this.model.Activetillmodify).format(AppConfig.dateFormat.apiMoment),
          SchemeType: this.model.freeorpaidmodify,
          ApplicableType: '',
          TradingFee: 0,
          BrokerageFree: 0,
          Trading_ApplicableFor: 0,
          DPFee: 0,
          AMC_ApplicableFor: 0,
          Margin: 0,
          AmountChargeble: 0,
          Holding: 0,
          Cheque: 0,
          AMCFree: 0,
          AccountType: '',
          AllLocationflag: '',
          Euser: this.currentUser.userCode,
          Statelist: '',
          Regionlist: '',
          LocationData: '',
          IsinData: '',
          InactivePeriod: 0
        }],
        "requestId": "6020",

        "outTblCount": "0"
      }).then((response) => {

        debugger
        if (response) {
          if (response.errorCode != 0) {
            this.notif.error(response.errorMsg, '')
          }
          else {
            this.notif.success('Updated successfully!', '')
            debugger
          }
        }

      })
    }
  }
  Search() { }
  eventHandler(event) {
    //  console.log(event, event.keyCode, event.keyIdentifier);
    if (event.keyCode == 32) return false;
  }
  loadsearch() {
    this.locationFindopt = {
      findType: 5070,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'L.Description',
      descLabel: 'L.REGION',
      title: 'Name',
      requestId: 8,
      whereClause: '1=1'
    }
    this.schememodifyfindopt = {
      findType: 5092,
      codeColumn: 'SchemeName',
      codeLabel: 'SchemeName',
      descColumn: 'SchemeReferenceNo',
      descLabel: 'SchemeReferenceNo',
      title: 'SchemeName',
      requestId: 8,
      hasDescInput: false,
      whereClause: '1=1'
    }
    this.schememodifyfreefindopt = {
      findType: 5093,
      codeColumn: 'type',
      codeLabel: 'SchemeName',
      descColumn: 'SchemeReferenceNo',
      descLabel: 'SchemeReferenceNo',
      title: 'SchemeName',
      requestId: 8,
      hasDescInput: false,
      whereClause: '1=1'
    }
    this.isinFindopt = {
      findType: 5003,
      codeColumn: 'ISINNO',
      codeLabel: 'ISINNO',
      descColumn: 'ISINNO',
      descLabel: 'ISINNO',
      title: 'ISINNO',
      requestId: 8,
      hasDescInput: false,
      whereClause: '1=1'
    }
    this.stateFindopt = {
      findType: 1000,
      codeColumn: 'ReportingState',
      codeLabel: 'ReportingState',
      descColumn: '',
      descLabel: '',
      requestId: 8,
      hasDescInput: false,
      whereClause: '1=1'
    }
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'DESCRIPTION',
      descLabel: '',
      requestId: 8,
      whereClause: '1=1'
    }
  }
  onchangescheme(data) {
    if (data == null) {
      this.model.Activetillmodify = null;
      return
    }
    this.model.Activetillmodify = data.ActiveTill
    debugger
  }
  onchangeschemefree(data) {
    if (data == null) {
      this.model.Activetillmodify = null;
      return
    }
    this.model.Activetillmodify = data.ToAmcValidateDate
    debugger
  }
  state() {
    this.model.sORd = 'S'
    this.model.Location = null;
    this.model.Region = null;
    this.Addtogrid2 = [];
    this.Addtogrid = [];
  }
  region() {
    this.model.sORd = 'R'
    this.model.state = null
    this.model.Location = null;
    this.Addtogrid1 = [];
    this.Addtogrid = [];
  }
  location() {
    this.model.sORd = 'L'
    this.model.Region = null;
    this.model.state = null
    this.Addtogrid1 = [];
    this.Addtogrid2 = [];
  }
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 1;
  };
  disabledPastamcDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };

  ngOnInit() {
    debugger
    this.model.Brokerage = '0';
    this.modifyboo = false;
    this.paidmodifyboo = false;
    this.freemodifyboo = false;
    this.model.freeorpaidmodify = 'M'
    this.isTBL = false;
    this.model.ApplicableFor = '0';
    this.model.AMCFree = '0';
    this.model.ApplicableFor1 = '0';
    this.model.Applicable = null;
    this.newinactive = true;
    this.model.Shcemetype = 'Paid';
    this.model.alllocation = 'Y'
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showModifyBtn = true;
    this.Activelist = [{ "code": 'Y', "Description": 'Yes' },
    { "code": 'N', "Description": 'No' },

    ]
    this.Amountlist = [{ "code": 'Y', "Description": 'Yes' },
    { "code": 'N', "Description": 'No' },
    ]
  }
  newapplicable(data) {
    debugger
    this.exinactive = false;
    this.newinactive = true;
  }
  inactiveapplicable(data) {
    this.newinactive = false;
    this.exinactive = true;
  }
  Reset() {
    this.loadsearch();
    this.model.Brokerage = '0';
    this.model.ApplicableFor = '0';
    this.model.AMCFree = '0';
    this.model.ApplicableFor1 = '0';
    this.model.Applicable = null;
    this.model.state = '';
    this.model.freeorpaidmodify = null;
    this.model.Region = '';
    this.model.Location = '';
    this.Addtogrid = [];
    this.Addtogrid1 = [];
    this.Addtogrid2 = [];
    this.Addtogrid3 = [];
    this.schemeboo = false;
    this.promocodeboo = false;
    this.Shcemetypeboo = false;
    this.brokerageboo = false;
    this.applicableboo = false;
    this.amcfeeboo = false;
    this.amcapplicableboo = false;
    this.Activeboo = false;
    this.amcdateboo = false
    this.Activetillboo = false;
    this.inactivityperiodboo = false;
    this.marginboo = false;
    this.checquboo = false;
    this.checkboo = false;
    this.isTBL = false;
    this.model.Scheme = '';
    this.newinactive = true;
    this.exinactive = false;
    //this.model.Referenceno = '';
    this.paidmodifyboo = false;
    this.freemodifyboo = false;
    this.model.promocode = '';
    this.modifyboo = false;
    this.model.Active = null;
    this.model.Activetill = null;
    this.model.Activetillmodify = null;
    this.model.schememodifyname = '';
    this.model.Shcemetype = 'Paid';
    this.model.Trading = '';
    this.model.DP = '';
    this.model.Margin = '';
    this.model.Cheque = '';
    this.model.alllocation = 'Y';
    this.model.isin = '';
    this.model.sORd = '';
    this.model.AccountType = null
  }
  clearfld(data) {
    debugger
    if (data == null) {
      return
    }
    if (data == 'Y') {
      this.model.alllocation = 'Y';
      this.Addtogrid1 = [];
      this.Addtogrid2 = [];
      this.Addtogrid = [];
      this.model.sORd = '';
    }
  }
  resetboo() {
    this.locaboo = false;
    this.schemeboo = false;
    this.promocodeboo = false;
    this.Shcemetypeboo = false;
    this.brokerageboo = false;
    this.applicableboo = false;
    this.amcfeeboo = false;
    this.amcapplicableboo = false;
    this.Activeboo = false;
    this.amcdateboo = false;
    this.Activetillboo = false;
    this.inactivityperiodboo = false;
    this.marginboo = false;
    this.checquboo = false;
    this.checkboo = false;
    this.regionboo = false;
    this.stateboo = false;
    this.schemmodboo = false;
    this.amcdatemodboo = false;
  }
  paidfree(data) {
    this.model.Brokerage = '0';
    this.model.ApplicableFor = '0';
    this.model.AMCFree = '0';
    this.model.ApplicableFor1 = '0';
    this.model.Trading = '';
    this.model.Activetill = null;
    this.model.DP = '';
    this.model.Applicable = null;
    this.model.state = '';
    this.model.Region = '';
    this.model.Location = '';
    this.Addtogrid = [];
    this.Addtogrid1 = [];
    this.Addtogrid2 = [];
    this.Addtogrid3 = [];
    this.schemeboo = false;
    this.promocodeboo = false;
    this.Shcemetypeboo = false;
    this.brokerageboo = false;
    this.applicableboo = false;
    this.amcfeeboo = false;
    this.amcapplicableboo = false;
    this.Activeboo = false;
    this.amcdateboo = false
    this.Activetillboo = false;
    this.inactivityperiodboo = false;
    this.marginboo = false;
    this.checquboo = false;
    this.checkboo = false;
    this.newinactive = true;
    this.exinactive = false;
    this.model.sORd = '';
    this.model.Active = null;
    this.model.Margin = '';
    this.model.Cheque = '';
    this.model.alllocation = 'Y';
    this.model.isin = '';
    this.model.sORd = '';
    this.model.AccountType = null
  }
  Amcfreedateclear(data) {
    this.model.Activetill = null;
  }
  save() {
    this.resetboo()
    if (!this.model.Scheme) {
      this.notif.error('please enter scheme name', '')
      this.schemeboo = true;
      return;
    }
    if (!this.model.promocode && this.model.Shcemetype == "Paid") {
      this.notif.error('Please enter Promocode.', '')
      this.promocodeboo = true;
      return
    }
    if (this.model.Shcemetype == "Paid") {
      if (!this.model.Applicable) {
        this.notif.error('Please select Applicable For', '')
        return;
      }
      if (this.model.Applicable == "InActive") {
        if (!this.model.inactivityperiod) {
          this.notif.error('Please enter inactive period', '')
          this.inactivityperiodboo = true;
          return;
        }
      }
      if (this.model.Applicable != "New") {
        if (!this.model.Activetill) {
          this.notif.error('Plese select active till', '')
          this.Activetillboo = true;
          return
        }
      }
    }
    if (this.model.Shcemetype == "Paid") {
      if (!this.model.Trading && !this.model.DP) {
        this.notif.error('Plese enter trading or DP details', '')
        this.Shcemetypeboo = true;
        return
      }
      else if (this.model.Trading) {
        if (!this.model.Brokerage) {
          this.notif.error('Plese enter Brokerage Free', '')
          this.brokerageboo = true;
          return
        }
        var Brok = Number(this.model.Brokerage)
        if (Brok == 0 && this.model.Applicable != "New") {
          this.notif.error('Plese enter Brokerage Free', '')
          this.brokerageboo = true;
          return
        }
        var applicab = Number(this.model.ApplicableFor)
        if (applicab == 0 && this.model.Applicable != "New") {
          this.notif.error('Plese enter Applicable Period ', '')
          this.applicableboo = true;
          return
        }

        if (!this.model.ApplicableFor) {
          this.notif.error('Plese enter Applicable Period ', '')
          this.applicableboo = true;
          return
        }
      }
      else if (this.model.DP) {

        if (!this.model.AMCFree) {
          this.notif.error('Plese enter AMC Free ', '')
          this.amcfeeboo = true;
          return
        }
        var amc = Number(this.model.AMCFree)
        if (amc == 0 && this.model.Applicable != "New") {
          this.notif.error('Plese enter enter AMC Free', '')
          this.amcfeeboo = true;
          return
        }
        if (!this.model.ApplicableFor1) {
          this.notif.error('Plese enter AMC Applicable Period ', '')
          this.amcapplicableboo = true;
          return
        }
        var applicab1 = Number(this.model.ApplicableFor1)
        if (applicab1 == 0 && this.model.Applicable != "New") {
          this.notif.error('Plese enter AMC Applicable Period ', '')
          this.amcapplicableboo = true;
          return
        }
      }
    }
    if (this.model.Shcemetype == "Free") {
      if (!this.model.Active) {
        this.notif.error('Plese select Active', '')
        this.Activeboo = true;
        return
      }
      if (!this.model.Activetill && this.model.AMCFree == '1') {
        this.notif.error('Plese select AMC Valid Date', '')
        this.amcdateboo = true;
        return
      }
    }
    if (this.model.alllocation != 'Y' && !this.model.sORd) {
      this.notif.error('Please Select State or Region or Location', '');
      return
    }
    if (this.model.alllocation == 'N') {
      if (this.model.sORd == 'S' && this.Addtogrid1.length == 0) {
        this.regionboo = false;
        this.locaboo = false;
        this.notif.error('Please enter State', '');
        this.stateboo = true;
        return;
      }
      else if (this.model.sORd == 'R' && this.Addtogrid2.length == 0) {
        this.stateboo = false;
        this.locaboo = false;
        this.notif.error('Please enter Region', '');
        this.regionboo = true;
        return;
      }
      else if (this.model.sORd == 'L' && this.Addtogrid.length == 0) {
        this.regionboo = false;
        this.stateboo = false;
        this.notif.error('Please enter Location', '');
        this.locaboo = true;
        return;
      }
      this.locaboo = false;
    }
    if (this.model.Shcemetype == "Free") {
      this.resetboo();
      if (this.model.Applicable == "InActive") {
        if (!this.model.inactivityperiod) {
          this.notif.error('Please enter inactive period', '')
          this.inactivityperiodboo = true;
          return;
        }
      }
      if (!this.model.Margin) {
        this.notif.error('Plese select Margin', '')
        this.marginboo = true;
        return
      }
      if (!this.model.Cheque) {
        this.notif.error('Plese select Cheque', '')
        this.checquboo = true;
        return
      }
    }
    let regionarray = [];
    this.Addtogrid2.forEach(element => {
      if (this.model.Shcemetype == 'Paid') {
        this.model.Active = ''
      }
      else {
        this.model.Active
      }
      var datas = {
        REGION: element.REGION,
        //Dpclientid: this.model.Referenceno,
        Euser: this.currentUser.userCode,
        Active: this.model.Active
      }
      regionarray.push(datas)
    });
    var RegionJson = this.utilServ.setJSONArray(regionarray);
    var RegionXML = jsonxml(RegionJson);
    let statearray = [];
    this.Addtogrid1.forEach(element => {
      if (this.model.Shcemetype == 'Paid') {
        this.model.Active = ''
      }
      else {
        this.model.Active
      }
      var datas = {
        StateCode: element.ReportingState,
        //Dpclientid: this.model.Referenceno,
        Euser: this.currentUser.userCode,
        Active: this.model.Active
      }
      statearray.push(datas)
    });
    var stateJson = this.utilServ.setJSONArray(statearray);
    var StateXML = jsonxml(stateJson);
    let samplearay = [];
    this.Addtogrid.forEach(element => {
      if (this.model.Shcemetype == 'Paid') {
        this.model.Active = ''
      }
      else {
        this.model.Active
      }
      var datas = {

        Location: element.Location,
        //Dpclientid: this.model.Referenceno,
        Euser: this.currentUser.userCode,
        Active: this.model.Active
      }
      samplearay.push(datas)
    });
    var JSONData = this.utilServ.setJSONArray(samplearay);
    var xmlData = jsonxml(JSONData);
    let samplearay1 = [];
    this.Addtogrid3.forEach(element => {
      var datas1 = {
        ISIN: element.ISINNO,
        Euser: this.currentUser.userCode
      }
      samplearay1.push(datas1)
    });

    var JSONData1 = this.utilServ.setJSONArray(samplearay1);
    var xmlData1 = jsonxml(JSONData1);
    if (!samplearay1.length) {
      xmlData1 = ''
    }

    this.statelist = ''
    this.Addtogrid1.forEach(element => {
      this.statelist = this.statelist + ',' + element.StateCode
    });
    this.regionlist = ''
    this.Addtogrid2.forEach(element => {
      this.regionlist = this.regionlist + ',' + element.REGION
    });

    if (!this.model.Scheme) {
      this.notif.warning('Please Add Any Scheme....', '')
      return
    }
    else {
      let val;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
        [{
          Schemename: this.model.Scheme,
          PromoCode: this.model.promocode || '',
          Active: this.model.Active || '',
          ActiveTill: this.model.Activetill == null ? '' : moment(this.model.Activetill).format(AppConfig.dateFormat.apiMoment),
          SchemeType: this.model.Shcemetype,
          ApplicableType: this.model.Applicable || '',
          TradingFee: this.model.Trading || 0,
          BrokerageFree: this.model.Brokerage || 0,
          Trading_ApplicableFor: this.model.ApplicableFor || 0,
          DPFee: this.model.DP || 0,
          AMC_ApplicableFor: this.model.ApplicableFor1 || 0,
          Margin: this.model.Margin || 0,
          AmountChargeble: 0,
          Holding: this.model.Cheque ? this.model.Cheque : 0,
          Cheque: 0,
          AMCFree: this.model.AMCFree || 0,
          AccountType: this.model.AccountType || '',
          AllLocationflag: this.model.alllocation || '',
          Euser: this.currentUser.userCode,
          Statelist: this.model.sORd == 'S' ? StateXML : '',
          Regionlist: this.model.sORd == 'R' ? RegionXML : '',
          LocationData: this.model.alllocation == 'N' && this.model.sORd == 'L' ? xmlData : '',
          IsinData: xmlData1,
          InactivePeriod: this.model.inactivityperiod || 0
        }],
        "requestId": "6020",

        "outTblCount": "0"
      }).then((response) => {
        if (response) {
          if (response.errorCode != 0) {
            this.notif.error(response.errorMsg, '')
          }
          else if (response.errorCode == 0) {
            if (response.errorMsg) {
              debugger
              this.notif.error(response.errorMsg, '')
            }
            else {
              this.notif.success('saved successfully!', '')
            }
          }
        }
      })
    }
  }
  Addtoisintable() {

    if (!this.model.isin) {
      this.notif.error('Please enter isin', '');
      return;
    } else {
      let isindata = this.Addtogrid3.find((object) => {
        return object.ISINNO == this.model.isin.ISINNO;
      });
      if (isindata) {
        this.notif.error('ISIN Already Exist', '');
      } else {
        this.Addtogrid3 = [...this.Addtogrid3, this.model.isin];
        this.model.isin = '';
      }
    }
  }
  clearinactivityperiod(data) {
    this.model.inactivityperiod = ''
  }
  Addtolocationtable() {

    if (!this.model.Location) {
      this.notif.error('Please enter Location', '');
      return;

    } else {
      let locationdata = this.Addtogrid.find((object) => {
        debugger
        return object.Location.trim() == this.model.Location.Location.trim();
      });
      if (locationdata) {
        this.notif.error('Location Already Exist', '');
      } else {
        debugger
        this.Addtogrid = [...this.Addtogrid, this.model.Location];
        this.model.Location = '';
        debugger
      }
    }
  }
  Deleterow(i) {
    this.Addtogrid.splice(i, 1)
    this.Addtogrid = [...this.Addtogrid];
  }
  Deleterow3(i) {

    this.Addtogrid3.splice(i, 1)
    this.Addtogrid3 = [...this.Addtogrid3];
  }
  Addtostatetable() {
    if (!this.model.state) {
      this.notif.error('Please enter state', '');
      return;
    }
    else {
      let statedata = this.Addtogrid1.find((object) => {
        return object.StateCode.trim() == this.model.state.StateCode.trim();
      });
      if (statedata) {
        this.notif.error('state Already Exist', '');
      }
      else {
        this.Addtogrid1 = [...this.Addtogrid1, this.model.state];
        this.model.state = '';
      }
    }
  }
  Deleterow1(i) {
    this.Addtogrid1.splice(i, 1)
    this.Addtogrid1 = [...this.Addtogrid1];
  }
  Addtoregiontable() {
    if (!this.model.Region) {
      this.notif.error('Please enter region', '');
      return;

    } else {
      let regiondata = this.Addtogrid2.find((object) => {
        return object.REGION.trim() == this.model.Region.REGION.trim();
      });
      if (regiondata) {
        this.notif.error('region Already Exist', '');

      }
      else {
        this.Addtogrid2 = [...this.Addtogrid2, this.model.Region];
        this.model.Region = '';
      }
    }
  }
  Deleterow2(i) {
    this.Addtogrid2.splice(i, 1)
    this.Addtogrid2 = [...this.Addtogrid2];
  }
}