
import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, User, UtilService, WorkspaceService } from 'shared';
//import { environment } from 'src/environments/environment';
import { CollectionrequestsService } from '../collectionrequests/collectionrequests.service';
import { environment } from 'src/environments/environment';
export interface advncamcacopening {
  location: any
  date: any
  specialoffer: any
  quarter1: boolean
  quarter2: boolean
  quarter3: boolean
  quarter4: boolean
  paymentoption: any
  bankorcash: any
  chequeno: any
  upfront: boolean
  dcnagreementsigned: any
  kitno: any
  narration: any
  stampapercharge: any
  dcnstamppapercharge: any
  amc: any
  total: any
  stampChargesOnly: boolean
  voucherid: any
  vid: any
  type: any
  upirefno: any

}
@Component({
  selector: 'app-advncamcacopening',
  templateUrl: './advncamcacopening.component.html',
  styleUrls: ['./advncamcacopening.component.less']
})
export class advncamcacopeningComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild('myForm') form: any;
  model: advncamcacopening
  currentUser: User
  locationFindopt: FindOptions;
  locationview: boolean = false
  today = new Date();
  showBankDetails: boolean = false
  BankFindopt: FindOptions
  VoucheridFindopt: FindOptions
  adddata: boolean = false
  notnewbooklet: boolean = true
  trueStampCharge: boolean = false
  isAddNotSelected: boolean = true
  voucheridDisable: boolean = false
  saveDisable: boolean = false
  kitflag: any
  isLoading: boolean = false
  printdisable: boolean = true
  collectionData: any = [];
  encryptedData: any = ''
  avgAnalysis: any = ''
  AvgAnalysisURL: any = ''
  upfrontDisable: boolean = false
  stampchrgeDisable: boolean = false
  month: any
  quarter1Disable: boolean = false
  quarter2Disable: boolean = false
  quarter3Disable: boolean = false
  quarter4Disable: boolean = false

  //mod by jishnu start
  isVisibleMod: boolean = false
  isVisibleMod1: boolean = false
  totalAmount: any;
  ledgerBal: any
  qrcodeurl: any
  uid: any
  name: any
  tcode: any
  dpclntid: any
  pa: any
  amount: any
  upirefno: any
  ShowUpfront: boolean = false
  //mod by jishnu end
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private modalService: NzModalService,
    private CollectionServ: CollectionrequestsService
  ) {
    this.model = <advncamcacopening>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
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
  }

  ngOnInit() {
    this.model.date = this.today
    this.model.type = 'nsdl'
    this.model.specialoffer = "0"
    this.model.paymentoption = "Q"
    //this.model.dcnagreementsigned='Y'  
    // this.model.quarter1=false
    // this.model.quarter2=false
    // this.model.quarter3=false
    // this.model.quarter4=false
    // this.model.upfront=false
    this.model.total = 207
    this.model.amc = 207
    this.kitflag = ''
    this.model.stampChargesOnly = false
    this.month = this.today.getMonth()
    //console.log('month',this.month);

    this.monthValidate()
    if (!((this.dataServ.Groupid == 1) || (this.dataServ.Groupid == 2))) {
      this.model.location = { Location: this.dataServ.branch };
      this.locationview = true;
    }
    this.loadsearch()
    this.specialofferChange(this.model.specialoffer)
  }

  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.today) > 0)
  };

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }



  loadsearch() {

    if (this.locationview == true) {
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: '',
        descColumn: 'Acname',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "Location ='" + this.model.location.Location + "'"
      }

      this.VoucheridFindopt = {
        findType: 6131,
        codeColumn: 'VoucherID',
        codeLabel: '',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: "Location ='" + this.model.location.Location + "'"
      }
    }
    else {
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: '',
        descColumn: 'Acname',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "1=1"
      }

      this.VoucheridFindopt = {
        findType: 6131,
        codeColumn: 'VoucherID',
        codeLabel: '',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: "1=1"
      }
    }

  }

  onchangepaymentOption(data) {
    if (data == 'P') {
      this.showBankDetails = true
    }
    else {
      this.showBankDetails = false
    }
  }

  monthValidate() {
    if (this.month == 3 || this.month == 4 || this.month == 5) {
      this.quarter1Disable = false
      this.quarter2Disable = false
      this.quarter3Disable = false
      this.quarter4Disable = false
      this.model.quarter1 = true
    }
    else if (this.month == 6 || this.month == 7 || this.month == 8) {
      this.quarter1Disable = true
      this.quarter2Disable = false
      this.quarter3Disable = false
      this.quarter4Disable = false
      this.model.quarter2 = true
    }

    else if (this.month == 9 || this.month == 10 || this.month == 11) {
      this.quarter1Disable = true
      this.quarter2Disable = true
      this.quarter3Disable = false
      this.quarter4Disable = false
      this.model.quarter3 = true
    }

    else if (this.month == 0 || this.month == 1 || this.month == 2) {
      this.quarter1Disable = true
      this.quarter2Disable = true
      this.quarter3Disable = true
      this.quarter4Disable = false
      this.model.quarter4 = true
    }
  }

  Validatecheque(val) {
    var inp = String.fromCharCode(val.keyCode);
    if (/^[0-9]+$/.test(inp)) {
      return true;
    } else {
      val.preventDefault();
      return false;
    }
  }


  Add() {
    if (this.model.type == 'nsdl') {
      this.modalService.confirm({
        nzOkText: 'YES',
        nzCancelText: 'NO',
        nzTitle: 'IS IT NEW DP BOOKLET?',
        nzOnOk: () => {
          this.adddata = true
          this.notnewbooklet = true
          this.isAddNotSelected = false
          this.kitflag = 'N'
          this.voucheridDisable = true
          this.stampchrgeDisable = false
        },
        nzOnCancel: () => {
          this.adddata = true
          this.notnewbooklet = false
          this.isAddNotSelected = false
          this.kitflag = 'O'
          this.voucheridDisable = true
          this.stampchrgeDisable = true
        }
      });
    }
    else {
      this.adddata = true
      this.notnewbooklet = false
      this.isAddNotSelected = false
      this.kitflag = 'O'
      this.voucheridDisable = true
    }
  }

  OnchangeStampChargesOnly(data) {
    if (data == true) {
      this.trueStampCharge = true
      this.model.total = 0
      this.model.amc = 0
      this.model.quarter1 = false
      this.model.quarter2 = false
      this.model.quarter3 = false
      this.model.quarter4 = false
      this.upfrontDisable = true
      this.model.upfront = false
    }
    else {
      // if(this.model.specialoffer == '1'){
      //   this.model.total = 0
      //   this.model.amc = 0
      // }
      // else if(this.model.specialoffer != '3'){
      //   this.model.total = 207
      //   this.model.amc = 207
      // }
      // else{
      //   this.model.total = 369
      //   this.model.amc = 369
      // }
      this.trueStampCharge = false
      // this.model.quarter1 = true
      this.upfrontDisable = false
      this.monthValidate()
      this.onchangeQuarter()
    }
  }

  onchnagelocation(data) {
    if (data == null) {
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: '',
        descColumn: 'Acname',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "1=1"
      }
    }
    else {
      this.BankFindopt = {
        findType: 6130,
        codeColumn: 'AccountCode',
        codeLabel: '',
        descColumn: 'Acname',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "Location ='" + data.Location + "'"
      }
    }
  }

  onchangeQuarter() {
    // debugger
    this.model.upfront = false
    if(this.model.specialoffer == '1'){
      this.model.amc = 0
      this.model.total = 0
      return
    }
    //this.model.quarter1=true
    let count = 0
    count = this.model.quarter2 ? count + 1 : count
    count = this.model.quarter3 ? count + 1 : count
    count = this.model.quarter4 ? count + 1 : count
    if (count == 0) {
      if(this.model.specialoffer !='3'){
        this.model.amc = 207
        this.model.total = 207
      }
      else {
        this.model.amc = 369
        this.model.total = 369
      }
    }
    else {
      if(this.model.specialoffer !='3'){
        this.model.amc = 207 * count
        this.model.total = 207 * count
      }
      else{
        this.model.amc = 369 * count
        this.model.total = 369 * count
      }
    }




  }

  onchangeUpfront(data) {
    if (data == true) {
      if (this.model.type == 'cdsl') {

        if (this.model.specialoffer == '0') {
          this.model.amc = 177
          this.model.total = 177
        }
        else if (this.model.specialoffer == '1') {
          this.model.amc = 0
          this.model.total = 0
        }
        else if (this.model.specialoffer == '2') {
          this.model.amc = 590
          this.model.total = 590
        }
        else if (this.model.specialoffer == '3') {
          this.model.amc = 369
          this.model.total = 369
        }
      }
      else if (this.model.type == 'nsdl') {

        if (this.model.specialoffer == '0') {
          this.model.amc = 826
          this.model.total = 826
        }
        else if (this.model.specialoffer == '1') {
          this.model.amc = 0
          this.model.total = 0
        }
        else if (this.model.specialoffer == '2') {
          this.model.amc = 207
          this.model.total = 207
        }
        else if (this.model.specialoffer == '3') {
          this.model.amc = 1475
          this.model.total = 1475
        }
      }
      this.model.quarter1 = false
      this.model.quarter2 = false
      this.model.quarter3 = false
      this.model.quarter4 = false
    }

    else {
      if (this.model.type == 'cdsl') {
        if (this.model.specialoffer == '0') {
          this.model.amc = 207
          this.model.total = 207
        }
        else if (this.model.specialoffer == '1') {
          this.model.amc = 0
          this.model.total = 0
        }
        else if (this.model.specialoffer == '2') {
          this.model.amc = 207
          this.model.total = 207
        }
        else if (this.model.specialoffer == '3') {
          this.model.amc = 369
          this.model.total = 369
        }

      }
      else if (this.model.type == 'nsdl') {

        if (this.model.specialoffer == '0') {
          this.model.amc = 207
          this.model.total = 207
        }
        else if (this.model.specialoffer == '1') {
          this.model.amc = 0
          this.model.total = 0
        }
        else if (this.model.specialoffer == '2') {
          this.model.amc = 207
          this.model.total = 207
        }
        else if (this.model.specialoffer == '3') {
          this.model.amc = 369
          this.model.total = 369
        }
      }
      this.monthValidate()
    }
  }

  save() {
    this.modalService.confirm({
      nzOkText: 'YES',
      nzCancelText: 'NO',
      nzTitle: 'DO YOU WANT TO SAVE?',
      nzOnOk: () => {
        this.saveConfirm()
      },
      nzOnCancel: () => {

      }
    });
  }

  saveConfirm() {
    let validation: boolean
    validation = this.validate()
    if (!validation) {
      return
    }

    this.isVisibleMod = true
  }

  handleCancelUPI() {
    this.isVisibleMod = false
  }

  save2() {
    this.isVisibleMod = false
    // debugger
    this.isLoading = true

    let accode, count = 0, quarternum = "Q1"
    if (this.model.bankorcash) {
      accode = this.model.bankorcash.AccountCode.toString()
    }

    count = this.model.quarter2 ? count + 1 : count
    count = this.model.quarter3 ? count + 1 : count
    count = this.model.quarter4 ? count + 1 : count
    if (count == 0) {
      count = 1
    }
    quarternum = this.model.quarter2 ? quarternum.concat(",Q2") : quarternum
    quarternum = this.model.quarter3 ? quarternum.concat(",Q3") : quarternum
    quarternum = this.model.quarter4 ? quarternum.concat(",Q4") : quarternum
    // console.log('quarter', quarternum);
    if (this.model.stampChargesOnly == true) {
      quarternum = ""
    }

    this.collectionData = [{
      Location: this.model.location ? this.model.location : '',
      DATE: this.model.date ? moment(this.model.date).format(AppConfig.dateFormat.apiMoment) : '',
      //clientCode:this.model.Tradecode?this.model.Tradecode:'',
      KitNo: this.model.kitno ? this.model.kitno : '',
      //Status:this.model.margintype?this.model.margintype:'',
      Euser: this.currentUser.userCode
    }]

    // if(this.model.specialoffer){
    //   specialoffer=parseInt(this.model.specialoffer) 
    // }
    let detailArray, reqid

    if (this.model.type == 'nsdl') {
      detailArray = [{
        GUSER: this.currentUser.userCode,
        TORP: this.model.paymentoption ? this.model.paymentoption : '',
        DPID: '',
        LOCATION: this.model.location ? this.model.location.Location : '',
        NARR: this.model.narration ? this.model.narration : '',
        CHEQUENO: this.model.chequeno ? this.model.chequeno : '',
        ACCOUNTCODE: accode ? accode : '',
        VOUCHERFLAG: 'Y',
        Upfront: this.model.upfront == true ? 'U' : '',
        noofQrtrs: count,
        Cashcom: this.model.specialoffer ? this.model.specialoffer : '',
        DCN: this.model.dcnagreementsigned == 'Y' ? this.model.dcnagreementsigned : 'N',
        kitflag: this.kitflag,
        Kitno: this.model.kitno ? this.model.kitno : '',
        QuarterNo: quarternum,
        Stampcharges: this.model.stampapercharge ? this.model.stampapercharge : 0,
        DCNStampcharges: this.model.dcnstamppapercharge ? this.model.dcnstamppapercharge : 0,
        receivedby: this.model.narration ? this.model.narration : '',
        AmcCharge: this.model.amc ? this.model.amc : 0,
        total: this.model.total ? this.model.total : 0

      }]

      reqid = "100210"
    }
    else {
      detailArray = [{
        GUSER: this.currentUser.userCode,
        TORP: this.model.paymentoption ? this.model.paymentoption : '',
        DPID: '',
        LOCATION: this.model.location ? this.model.location.Location : '',
        NARR: this.model.narration ? this.model.narration : '',
        CHEQUENO: this.model.chequeno ? this.model.chequeno : '',
        ACCOUNTCODE: accode ? accode : '',
        VOUCHERFLAG: 'Y',
        Upfront: this.model.upfront == true ? 'U' : '',
        noofQrtrs: count,
        Cashcom: this.model.specialoffer ? this.model.specialoffer : '',
        DCN: this.model.dcnagreementsigned == 'Y' ? this.model.dcnagreementsigned : 'N',
        Kitno: this.model.kitno ? this.model.kitno : '',
        // QuarterNo:quarternum,
        // Stampcharges:this.model.stampapercharge?this.model.stampapercharge:0,
        // DCNStampcharges:this.model.dcnstamppapercharge?this.model.dcnstamppapercharge:0,
        // receivedby:this.model.narration?this.model.narration:'',
        // AmcCharge:this.model.amc?this.model.amc:0,
        // total:this.model.total?this.model.total:0

      }]

      reqid = "100211"
    }



    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray": detailArray,
      "requestId": reqid
    }).then((response) => {
      // debugger
      // console.log(response);

      if (response.errorCode) {
        this.isLoading = false
        this.notif.error(response.errorMsg, '')
        return
      }
      else if (response[0].rows.length > 0) {
        if (response[0].rows[0][0] == 1) {
          this.isLoading = false
          this.notif.error(response[0].rows[0][2], '')
        }
        else {
          this.isLoading = false
          let voucherid = response[0].rows[0][3]
          this.model.vid = voucherid
          // console.log('msg', response[0].rows[0]);
          this.notif.success(response[0].rows[0][2], '')
          // debugger
          if (this.model.paymentoption == 'U') {
            // debugger
            var dataCollectionReq = []
            dataCollectionReq = this.collectionData
            this.CollectionServ.collectionReqDetail.next(dataCollectionReq)
            this.CollectionServ.viewCollectionServ()
            // this.printdisable = false
            this.saveDisable = true
          }
          else if (this.model.paymentoption == 'Q') {
            if(this.model.total>0){
            let datas = this.utilServ.convertToResultArray(response[0])
            this.saveDisable = true
            let data = [{ 'url': datas[0].url, 'id': datas[0].id, 'pa': datas[0].pa, 'am': datas[0].am, 'dpclntid': datas[0].dpclntid, 'name': datas[0].name, 'tcode': datas[0].tcode }]
            this.showqrcode(data)
            }
            else{
              this.modalService.confirm({
                nzOkText: 'YES',
                nzCancelText: 'NO',
                nzTitle: 'DO YOU WANT TO PRINT?',
                nzOnOk: () => {
                  this.print(voucherid)
                },
                nzOnCancel: () => {
  
                }
              });
  
              this.printdisable = false
              this.saveDisable = true
            }

          }
          else {
            this.modalService.confirm({
              nzOkText: 'YES',
              nzCancelText: 'NO',
              nzTitle: 'DO YOU WANT TO PRINT?',
              nzOnOk: () => {
                this.print(voucherid)
              },
              nzOnCancel: () => {

              }
            });

            this.printdisable = false
            this.saveDisable = true
          }
        }

      }
      else {
        this.isLoading = false
        this.notif.error('No data found', '')
      }

    });


  }

  showqrcode(data) {
    this.isVisibleMod1 = true
    this.isLoading = true
    this.uid = data[0].id
    this.name = data[0].name
    this.tcode = data[0].tcode
    this.dpclntid = data[0].dpclntid
    this.pa = data[0].pa
    this.amount = data[0].amount
    this.dataServ.post(environment.api_getqrcode_url, { "data": data[0].url }, { responseType: 'text' }).then(res => {
      //this.qrcodeurl=(this.sanitizer.bypassSecurityTrustResourceUrl(res as string))
      //this.qrcodeurl = this.byteArrayToImage(res);
      this.isLoading = false
      this.qrcodeurl = res
      // console.log('url ', this.qrcodeurl);
    })
  }


  onchangevoucherID(data) {
    if (data == null) {
      return
    }
    else {
      // debugger
      this.isLoading = true
      this.reset()
      this.model.voucherid = data
      this.adddata = true
      this.printdisable = false
      // debugger
      this.view(data.VoucherID)
    }
  }

  view(data) {
    this.model.vid = data
    this.isLoading = true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          VoucherID: data,
          Flag: 'V',
          euser: this.currentUser.userCode
        }],
      "requestId": "200020"
    }).then((response) => {
      this.isLoading = false
      let data = this.utilServ.convertToResultArray(response[0]);
      let string
      // console.log('data',data);
      data.forEach(item => {
        // console.log('item', item);
        this.model.location = { Location: item.Location }
        this.model.date = item.LastUpdatedOn
        this.model.specialoffer = item.Cashcom.toString()
        this.model.narration = item.Narration
        this.model.kitno = item.Kitno
        this.model.amc = Math.trunc(item.AmcCharge)
        this.model.total = Math.trunc(item.TotalCharge)
        item.Upfront == 'U' ? this.model.upfront = true : this.model.upfront = false
        item.DCNAgreement == 'Y' ? this.model.dcnagreementsigned = 'Y' : this.model.dcnagreementsigned = 'N'
        this.model.stampapercharge = Math.trunc(item.Stampcharges)
        this.model.dcnstamppapercharge = Math.trunc(item.DCNStampcharges)
        // toarray=item.QuarterNo.split(",");
        this.model.vid = item.VoucherID.toString()
        if (item.QuarterNo) {
          // this.model.quarter1=item.QuarterNo.includes('Q1')
          // this.model.quarter2=item.QuarterNo.includes('Q2')
          // this.model.quarter3=item.QuarterNo.includes('Q3')
          // this.model.quarter4=item.QuarterNo.includes('Q4')
          item.QuarterNo.includes('Q1') ? this.model.quarter1 = true : false
          item.QuarterNo.includes('Q2') ? this.model.quarter2 = true : false
          item.QuarterNo.includes('Q3') ? this.model.quarter3 = true : false
          item.QuarterNo.includes('Q4') ? this.model.quarter4 = true : false
        }

        if (item.NewBookLet == 'N') {
          this.notnewbooklet = true
        }
        else {
          this.notnewbooklet = false
        }

        if (item.TORP == 'Q') {
          this.model.paymentoption = 'Q'
        }
        else if (item.TORP == 'P') {
          this.model.paymentoption = 'P'
          this.showBankDetails = true
          this.model.bankorcash = { AccountCode: item.AccountCode }
          this.model.chequeno = item.chequeNo
        }
        else if (item.TORP == 'U') {
          this.model.paymentoption = 'U'
        }
        else {
          this.model.paymentoption = ''
        }
      })

      // console.log('toarray', this.model.specialoffer);
      // debugger
      // toarray.forEach(item=>{

      // })

      // console.log('q1', this.model.quarter1);
      // console.log('q2', this.model.quarter2);


    });
  }

  print(voucherid) {
    // console.log('voucherid', voucherid);

    //this.notif.success('success','')
    // return
    this.isLoading = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          VoucherID: voucherid,
          Flag: 'P',
          euser: this.currentUser.userCode
        }],
      "requestId": "200020",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A4' };
    let isPreview: boolean;
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      this.isLoading = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error('error', '');
        return;
      }
      else {
        if (!isPreview) {

          //this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }

  validate() {
    // debugger
    // console.log('payment option', this.model.paymentoption);

    if (!this.model.location) { this.notif.error('Please Select Location', ''); return false }
    else if (!this.model.specialoffer) { this.notif.error('Please Select Special Offer', ''); return false }
    else if (!this.model.kitno) { this.notif.error('Please Select Kit Number', ''); return false }
    else if (!this.model.paymentoption) { this.notif.error('Please Select Payment Option', ''); return false }
    else if (!this.model.narration) { this.notif.error(`Please fill the narration with the Client's name`, ''); return false }
    else if (!this.model.dcnagreementsigned && this.notnewbooklet == true) { this.notif.error('Please select DCN agreement signed', ''); return false }

    //debugger
    else if (this.model.paymentoption == 'P') {
      // debugger
      if (!this.model.bankorcash) {
        this.notif.error('Please Select Bank', '');
        return false;
      }
      else if (!this.model.chequeno) {
        this.notif.error('Please Enter Cheque Number', '');
        return false;
      }
      else {
        return true
      }

    }
    else {
      return true
    }

  }

  specialofferChange(data) {
    // debugger
    if (data == '0') {
      this.ShowUpfront = true
      this.model.amc = 207
      this.model.total = 207
      this.model.upfront = false
    }
    else if (data == '1') {
      this.ShowUpfront = false
      this.model.amc = 0
      this.model.total = 0
      this.model.upfront = false
    }
    else if (data == '2') {
      this.ShowUpfront = false
      this.model.amc = 207
      this.model.total = 207
      this.model.upfront = false
    }
    else {
      this.ShowUpfront = true
      this.model.amc = 369
      this.model.total = 369
      this.model.upfront = false
    }
    this.monthValidate()
    this.OnchangeStampChargesOnly(this.model.stampChargesOnly)
  }
  specialofferChange2(data) {
    if (data == '0') {
      this.ShowUpfront = true
      this.model.amc = 207
      this.model.total = 207
      this.model.upfront = false
    }
    else if (data == '1') {
      this.ShowUpfront = true
      this.model.amc = 0
      this.model.total = 0
      this.model.upfront = false
    }
    else if (data == '2') {
      this.ShowUpfront = true
      this.model.amc = 207
      this.model.total = 207
      this.model.upfront = false
    }
    else {
      this.ShowUpfront = false
      this.model.amc = 369
      this.model.total = 369
      this.model.upfront = false
    }
    this.monthValidate()
    this.OnchangeStampChargesOnly(this.model.stampChargesOnly)
  }

  TypeChange(data){
    this.adddata = false
    this.isAddNotSelected = true
    data=='nsdl'?this.notnewbooklet = true:this.notnewbooklet = false 
    if (this.locationview == false) {
      this.model.location = null
    }
    this.model.date = this.today
    this.model.specialoffer = "0"
    this.model.quarter1 = false
    this.model.quarter2 = false
    this.model.quarter3 = false
    this.model.quarter4 = false
    this.model.paymentoption = "Q"
    this.showBankDetails = false
    this.model.bankorcash = null
    this.model.chequeno = null
    this.model.upfront = false
    this.model.kitno = null
    this.model.narration = null
    this.model.stampapercharge = null
    this.model.dcnstamppapercharge = null
    this.model.amc = 207
    this.model.total = 207
    this.model.voucherid = null
    this.voucheridDisable = false
    this.printdisable = true
    this.saveDisable = false
    this.model.vid = null
    this.upfrontDisable = false
    this.stampchrgeDisable = false
    //this.Add()
    this.monthValidate()
    this.specialofferChange(this.model.specialoffer)
  }

  reset() {
    this.adddata = false
    this.isAddNotSelected = true
    this.notnewbooklet = true
    if (this.locationview == false) {
      this.model.location = null
    }
    this.model.date = this.today
    this.model.specialoffer = "0"
    this.model.quarter1 = false
    this.model.quarter2 = false
    this.model.quarter3 = false
    this.model.quarter4 = false
    this.model.paymentoption = "Q"
    this.showBankDetails = false
    this.model.bankorcash = null
    this.model.chequeno = null
    this.model.upfront = false
    this.model.kitno = null
    this.model.narration = null
    this.model.stampapercharge = null
    this.model.dcnstamppapercharge = null
    this.model.amc = 207
    this.model.total = 207
    this.model.voucherid = null
    this.voucheridDisable = false
    this.printdisable = true
    this.saveDisable = false
    this.model.vid = null
    this.upfrontDisable = false
    this.model.type = 'nsdl'
    this.stampchrgeDisable = false
    //this.Add()
    this.monthValidate()
    this.specialofferChange(this.model.specialoffer)
    this.model.stampChargesOnly = false
    this.model.dcnagreementsigned = null
    this.OnchangeStampChargesOnly(this.model.stampChargesOnly)
  }



  handleCancelUPI1() {
    this.isVisibleMod1 = false
    this.upirefno = ''
  }

  ValidateupiRefNo() {

    if (!this.upirefno) {
      this.notif.error('Please Enter the UPI Ref No', '')
      return
    }
    if (this.upirefno.length != 12) {
      this.notif.error('invalid UPI Ref No', '')
      return
    }

    this.isVisibleMod1 = false
    this.isLoading = true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          PaymentRefNo: this.upirefno,
          TransactionId: this.uid,
          Euser: this.currentUser.userCode
        }],
      "requestId": "100353"
    }).then((response) => {
      if (response) {

        this.isLoading = false
        if (response.errorCode == 1) {
          this.notif.error(response.errorMsg, '')
          this.upirefno = ''
        }
        else {
          let res = this.utilServ.convertToObject(response[0]);
          if (res[0].errorCode == 1) {
            this.notif.error(res[0].errorMsg, '')
            this.upirefno = ''
          }
          else if (res[0].errorCode == 0) {
            this.notif.success(res[0].errorMsg, '')
            this.upirefno = ''
          }
          else {
            this.notif.error('ERROR!!', '')
            this.upirefno = ''
          }
        }
      }
    });
  }

}
