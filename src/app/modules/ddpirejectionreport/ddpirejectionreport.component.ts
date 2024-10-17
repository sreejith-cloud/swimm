import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'shared';
import * as moment from 'moment';
import { AuthService, FindOptions, User, UtilService, WorkspaceService } from 'shared';
import { DataService, FormHandlerComponent } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { PoaserviceService } from '../clientpoadashboard/poaservice.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

export interface ddpirejection {
  location: any;
  tradecode: any;
  fromdate: any;
  todate: any;

}

@Component({
  selector: 'app-ddpirejectionreport',
  templateUrl: './ddpirejectionreport.component.html',
  styleUrls: ['./ddpirejectionreport.component.less']
})
export class DdpirejectionreportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  model: ddpirejection;
  clientid: any;
  locationFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  TradeFindopt: FindOptions;
  currentUser: User;
  isSpinVisible: boolean;
  const: any;
  DetailData: any;
  showtable: any
  today = new Date();
  // detailsheader: any;

  constructor(private dataServ: DataService,
    private poaserv: PoaserviceService,
    private utilServ: UtilService,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService,
    private authServ: AuthService) {
    this.model = <ddpirejection>{};

    this.poaserv.clientid.subscribe((items) => {
      this.clientid = items;

    })

    this.locationFindopt = {
      findType: 3102,
      // findType: 6047,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.TradeFindopt = {
      findType: 4000,
      codeColumn: 'ClientCode',
      codeLabel: 'ClientCode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.showtable = false;
    this.isSpinVisible = false;
    // this.model.fromdate = new Date();
    this.model.todate = new Date();
  }

  disabledFutureDate = (current: Date): boolean => {
    // Can not select days after today

    return differenceInCalendarDays(current, this.today) > 0
    // && differenceInCalendarDays(current, this.today) < 0 ;
  };

  Viewdata() {
    this.isSpinVisible = true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Tradecode: this.model.tradecode ? this.model.tradecode.ClientCode : '',
          Loc: this.model.location ? this.model.location.Location : '',
          Fromdate: this.model.fromdate ? moment(this.model.fromdate).format('DD-MM-YYYY') : '',
          Todate: this.model.todate ? moment(this.model.todate).format('DD-MM-YYYY') : '',
        }],
      "requestId": "200120",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpinVisible = false;
        // console.log('response', response);

        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {

            this.showtable = true;
            // this.detailsheader = Object.keys(this.DetailData[0])
            this.DetailData = data1;
            this.isSpinVisible = false;
            // console.log('DetailData', this.DetailData);
          }

          else if (data1.length == 0) {
            this.showtable = false;
            this.isSpinVisible = false;
            this.notif.error('No Data found', '');
            return
          }
        }
      })


  }

  Export() {
    this.isSpinVisible = true;

    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Tradecode: this.model.tradecode ? this.model.tradecode.ClientCode : '',
          Loc: this.model.location ? this.model.location.Location : '',
          Fromdate: this.model.fromdate ? moment(this.model.fromdate).format('DD-MM-YYYY') : '',
          Todate: this.model.todate ? moment(this.model.todate).format('DD-MM-YYYY') : '',
        }],
      "requestId": "200120",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.isSpinVisible = false;
        this.notif.error('Error', '');
        return;
      }

      else {
        if (!isPreview) {
          this.isSpinVisible = false;
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {

      this.isSpinVisible = false;
      this.notif.error("Server encountered an Error", '');
    });
  }

  Reset() {
    this.model.location = null;
    this.model.tradecode = null;
    this.model.fromdate = null;
    this.model.todate = new Date();
    this.showtable = false;
  }
}
