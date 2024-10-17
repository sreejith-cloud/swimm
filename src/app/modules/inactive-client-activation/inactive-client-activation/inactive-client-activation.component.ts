import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormHandlerComponent, DataService, AppConfig } from 'shared';
import * as moment from 'moment';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-inactive-client-activation',
  templateUrl: './inactive-client-activation.component.html',
  styleUrls: ['./inactive-client-activation.component.css']
})
export class InactiveClientActivationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  FromDate: Date = new Date();
  ToDate: Date = new Date();
  isloading: boolean = false;
  inactiveClienResultSet: any = []
  inactiveClienResultSetHeader: any = []
  today:Date =new Date()

  constructor(private dataServ: DataService,
    private notif: NzNotificationService) { }
    disabledFutureDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
    };
  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
  }

  view() {
    this.inactiveClienResultSet=[]
    this.inactiveClienResultSetHeader=[]
    this.isloading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Fromdate: this.FromDate ? moment(this.FromDate).format(AppConfig.dateFormat.apiMoment) : '',
          Todate: this.ToDate ? moment(this.ToDate).format(AppConfig.dateFormat.apiMoment) : ''
        }],
      "requestId": "700106",
    }).then((response: any) => {
      this.isloading = false;
      if (response && response.errorCode == 0) {
        if (response.results[0].length) {
          this.inactiveClienResultSet = response.results[0]
          this.inactiveClienResultSetHeader = Object.keys(this.inactiveClienResultSet[0])
        } else {
          this.notif.error('Error', 'No Data Found');
        }
      } else {
        let errorMsg = response.errorMsg ? response.errorMsg : 'No Data Found'
        this.notif.error(errorMsg, '');
        return;
      }
    },error=>{
      this.isloading = false;
    })
  }

  Reset() {
    this.inactiveClienResultSet = [];
    this.inactiveClienResultSetHeader = []
    this.FromDate = new Date();
    this.ToDate = new Date();
  }

  export() {
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Fromdate: this.FromDate ? moment(this.FromDate).format(AppConfig.dateFormat.apiMoment) : '',
          Todate: this.ToDate ? moment(this.ToDate).format(AppConfig.dateFormat.apiMoment) : ''
        }],
      "requestId": "700106",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      if (response.errorMsg) {
        this.notif.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }

  onDateChange() {
    let fromDate = new Date(this.FromDate).getTime();
    let toDate = new Date(this.ToDate).getTime();
    let today = new Date().getTime();
    if (fromDate > toDate || fromDate > today) {
      this.FromDate = new Date()
    }
    if (toDate < fromDate || toDate > today) {
      this.ToDate = new Date
    }
  }

}
