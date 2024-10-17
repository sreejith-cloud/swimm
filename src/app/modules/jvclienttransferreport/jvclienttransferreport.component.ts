import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService } from "shared";
import { FormHandlerComponent } from 'shared';
import * as moment from 'moment';



@Component({
  selector: 'app-jvclienttransferreport',
  templateUrl: './jvclienttransferreport.component.html',
  styleUrls: ['./jvclienttransferreport.component.less']
})
export class JvclienttransferreportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  currentUser: User;
  tradecodeFindopt: FindOptions;
  PANFindopt: FindOptions;
  RegionFindopt: FindOptions;
  locationFindopt: FindOptions;
  model: any = {};
  VoucherList: any = [];
  isSpinVisible: boolean;
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
    private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.loadsearch();
    });
  }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showExportExcelBtn = false;
  }
  loadsearch() {
    this.model.fd = new (Date);
    this.model.td = new (Date);
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.locationFindopt = {
      findType: 5076,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }  
    this.tradecodeFindopt = {
      findType: 5076,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.PANFindopt = {
      findType: 5076,
      codeColumn: 'PAN',
      codeLabel: 'PAN',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }

// onChangeRegion(data) {
//     if (data == null) {
//       return
//     }
//     // this.RegionFindopt = {
//     //   findType: 1003,
//     //   codeColumn: 'REGION',
//     //   codeLabel: 'REGION',
//     //   descColumn: '',
//     //   descLabel: '',
//     //   hasDescInput: false,
//     //   requestId: 8,
//     //   whereClause: "ReportingState ='" + data.ReportingState + "'"
//     // }
//     this.locationFindopt = {
//       findType: 5006,
//       codeColumn: 'Location',
//       codeLabel: 'Location',
//       descColumn: '',
//       descLabel: '',
//       hasDescInput: false,
//       requestId: 8,
//       whereClause: " ='" + data.REGION + "'"
//     }

//   }
  onChangeLocation(data) {
    if (data == null) {
      return
    }
    this.tradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "Location='" + data.Location + "'"
    }
  }

  view() {

   this.VoucherList=[];
    this.isSpinVisible = true;
    if (!this.model.fd) {
      this.isSpinVisible = false;
      this.notif.error("Please Select From Date ", ''); 
      return
    }
    if (!this.model.td) {
      this.isSpinVisible = false;
      this.notif.error("Please Select To Date", '');  
      return
    }
    else {
    let val;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        FromDate: this.model.fd ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment) : '',
        ToDate: this.model.td ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment) : '',
        Location: this.model.Location ? this.model.Location.Location : '',
        Euser: this.currentUser.userCode,
        Region: this.model.Region ? this.model.Region.REGION: '',
        Tradecode: this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
        PAN: this.model.PAN ? this.model.PAN.PAN : ''
      }],
      "requestId": "7026",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        // if (response.results && response.results[0] && response.results.rows[0].length > 0) {
        if (response.results && response.results[0].length > 0) {
          this.isSpinVisible = false;
          // this.VoucherList = this.utilServ.convertToObject(response.results.ro);
          this.VoucherList = response.results[0];
        }
        else {
          this.isSpinVisible = false;
          this.notif.error("No Data Found", '');
          return
        }
      }
    })
    }
  }
  resetForm() {
    this.model.Region = '';
    this.model.Location = '';
    this.model.Tradecode = '';
    this.model.fd = new (Date);
    this.model.td = new (Date);
    this.model.PAN='';
    this.VoucherList = [];
  }
}
