import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, UtilService, FormHandlerComponent, FindOptions, User } from 'shared';
import { AppConfig } from 'shared';
import * as moment from 'moment';

export interface reportData {
  fromDate: any;
  toDate: any;
  tradeCode: any;
  location: any;
}
@Component({
  selector: 'app-additionalagreements',
  templateUrl: './additionalagreements.component.html',
  styleUrls: ['./additionalagreements.component.less']
})
export class AdditionalagreementsComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  TradecodeFindopt: FindOptions;
  locationFindopt: FindOptions;
  currentUser: User;
  model: reportData;
  today = new Date();
  resData: any[] = [];
  resDataHeader: any[] = [];
  isSpinning: boolean = false;
  viewExcel: boolean = false;


  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService
  ) {
    this.model = <reportData>{}
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.TradecodeFindopt = {
      findType: 5098,
      codeColumn: 'ClientCode',
      codeLabel: 'ClientCode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
  }

  ngOnInit() {
    this.model.location = { Location: this.dataServ.branch };
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportPdfBtn = false;
  }
  /** Export Excel */
  ExportExcel() {
    if (this.viewExcel) {


      if (!this.model.location) {
        this.notif.error('Please Select Location', '');
        return
      }
      let reqParams = {
        "batchStatus": "false",
        "detailArray": [{
          Location: this.model.location ? this.model.location.Location.trim() : '',
          Tradecode: this.model.tradeCode ? this.model.tradeCode.TradeCode : '',
        }],
        "requestId": "700050",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isSpinning = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        this.isSpinning = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          // this.formHdlr.config.showExportExcelBtn = false
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an error", '');
        this.isSpinning = false;
      });
    }else{
      this.notif.error("view data before download", '');
    }
  }


  poolData() {
    this.viewExcel = true;
    this.resData = [];
    this.resDataHeader = [];
    if (!this.model.location) {
      this.notif.error('Please Select Location', '');
      return
    }
    this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray": [{
        Location: this.model.location ? this.model.location.Location.trim() : '',
        Tradecode: this.model.tradeCode ? this.model.tradeCode.TradeCode : '',
      }],
      "requestId": "700050",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response && response[0]) {
        let res = this.utilServ.convertToObject(response[0]);
        if (res.length == 0) {
          this.notif.error('No data found', '')
        }
        this.resData = res
        let constDate
        this.resData.forEach(val=>{
          constDate = moment(new Date(val.FinideasAcceptedDate)).format(AppConfig.dateFormat.apiMoment)
          constDate = constDate.replace(/\s+/g, '_').toLowerCase();
          val.FinideasAcceptedDate=moment(constDate).format(AppConfig.dateFormat.inputMoment)
        })
        this.resDataHeader = Object.keys(this.resData[0])

      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })
  }

  TradecodeChange(data) {
    this.model.location = { Location: data.Location };
  }
  resetForm() {
    this.viewExcel = false;
    this.model.location = { Location: this.dataServ.branch };
    this.model.tradeCode = null;
    this.resData = [];
    this.resDataHeader = [];
  }


}
