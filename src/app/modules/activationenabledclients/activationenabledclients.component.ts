import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, User, UtilService } from 'shared';
import { FindOptions } from 'shared';
import * as moment from 'moment';
export interface reportFilter {
  location: any;
  PanNo: any;
  fromDate: any;
  toDate: any;
}
@Component({
  selector: 'app-activationenabledclients',
  templateUrl: './activationenabledclients.component.html',
  styleUrls: ['./activationenabledclients.component.less']
})
export class ActivationenabledclientsComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  panFindOption: FindOptions;
  locationFindopt: FindOptions;
  model: reportFilter;
  isLoading: boolean = false;
  downloadExcel: boolean = false;
  listOfData: any[] = []
  GridHead: any;
  xmlData: any;
  remarksData: any;
  checkboxData: any;
  currentUser: User;


  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService,
  ) {
    this.loadSearch()
    this.model = <reportFilter>{};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    var date = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  ngAfterViewInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showSendMailbtn = false;
  }
  setPanCode(data){
    this.model.location = { Location: data.AccountLocation };
  }

  

  viewData() {
    if (!this.model.fromDate || !this.model.toDate) {
      this.notif.error('Please Choose From and To Date', '');
      return
    }
    this.downloadExcel = true;
    this.isLoading = true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: this.model.location ? this.model.location.Location : '',
          PANNO: this.model.PanNo ? this.model.PanNo.PAN : '',
          Fromdate: moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) || '',
          Todate: moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) || '',   
          Euser: this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "100132",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response[0]) {
        this.listOfData=[]
        this.GridHead=[]
        this.listOfData = this.utilServ.convertToResultArray(response[0]);
        if (this.listOfData.length>0) {
          this.GridHead = Object.keys(this.listOfData[0]);
        }else{
          this.notif.error('No data found', '')
          return;
        }
        if(this.listOfData[0].Error==1){
          this.notif.error(this.listOfData[0].ErrorMessage, '')
          this.listOfData=[]
        }
      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })
  }
  
  export(){
    if (!this.downloadExcel) {
      this.notif.error('Please view data before export', '');
      return
    }
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
      [{
        Location: this.model.location ? this.model.location.Location : '',
        PANNO: this.model.PanNo ? this.model.PanNo.PAN : '',
        Fromdate: moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) || '',
        Todate: moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) || '',   
        Euser: this.currentUser ? this.currentUser.userCode : ''
      }],
      "requestId": "100132",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => { debugger
      // this.isSpinning = false;
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

  loadSearch(){
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
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }
  reset(){
    this.listOfData = [];
    this.GridHead = [];
    this.model.PanNo = null
    this.model.location=null
    var date = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.downloadExcel = false;
  }

}
