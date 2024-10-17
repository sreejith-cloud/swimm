import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, DataService, UtilService, FindOptions, User, FormHandlerComponent } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from 'shared';
import * as moment from 'moment';

@Component({
  selector: 'app-email-mobile-changeintimation',
  templateUrl: './email-mobile-changeintimation.component.html',
  styleUrls: ['./email-mobile-changeintimation.component.css']
})
export class EmailMobileChangeintimationComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  isSpinVisible: boolean = false;
  panFindOption: FindOptions;
  currentUser: User;
  fromdate: Date;
  todate: Date;
  panNumber: any;
  resultantData: any = [];
  detailDataHeads: any = [];
  visible: boolean = false;
  drawerContent: any = '';
  pdfDownloadClicked: any = { letterDownload: false, addressDownload: false }
  sentFromDate: Date;
  sentToDate: Date;
  selectedLetterIntimation: any = 'All';
  letterIntimationArray: any = ['All', 'Pending', 'Sent']
  SerialNoForPreview: any;
  changedDatasForModification: any = [];
  tempResultantData: any = [];
  constructor(
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private sanitizer: DomSanitizer
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
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.showSaveBtn = true;
    this.formHdlr.config.showCancelBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.showExportPdfBtn = true;
  }

  preview(purpose = 'V', uniqueId = null) { // purpose = V for view table ,L -letter drawer
    if (purpose == 'L' || purpose == 'S' || this.validateInputFilterData()) {
      if (purpose == 'S' && this.changedDatasForModification.length == 0) {
        this.notif.error('No Changes found', '');
        return;
      }
      if (purpose == 'V') {
        this.detailDataHeads = [];
        this.resultantData = [];
      }
      this.isSpinVisible = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            FromDate: this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            ToDate: this.todate ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
            Pan: this.panNumber ? this.panNumber.PAN : '',
            Purpose: purpose ? purpose : 'V',
            SerialNo: uniqueId ? uniqueId : '',
            SntFromDate: this.sentFromDate ? moment(this.sentFromDate).format(AppConfig.dateFormat.apiMoment) : '',
            SntToDate: this.sentToDate ? moment(this.sentToDate).format(AppConfig.dateFormat.apiMoment) : '',
            LttrIntimation: this.selectedLetterIntimation ? this.selectedLetterIntimation : 'All',
            MrkAsSent: purpose == 'S' && this.changedDatasForModification ? JSON.stringify(this.changedDatasForModification) : '',
          }],
        "requestId": "10000203",
        "outTblCount": "0"
      }).then((response) => {
        this.isSpinVisible = false;
        if (response && response.errorCode == 0) {
          if (response.results && response.results[0] && response.results[0].length > 0) {
            if (purpose == 'V') {
              // response.results[0].map((date:any)=>{
              //   date['Sent Date'] = '2024-03-06';  // mm dd yy
              //   date['Mark As Sent'] = false;
              // })
              this.resultantData = response.results[0];
              this.tempResultantData = response.results[0];
              this.detailDataHeads = Object.keys(response.results[0][0]);
              this.detailDataHeads = this.detailDataHeads.filter((n) => n != 'SerialNo');
            }
            else if (purpose == 'L') {
              if (response.results[0][0].Letter.trim() && response.results[0][0].Letter.trim() != null) {
                this.showDrawerContent(response.results[0][0].Letter.trim(), uniqueId);
              }
              else {
                this.notif.error('No data found', '');
              }
            }
            else if (purpose == 'S') {
              if (response.results[0][0].errorCode && response.results[0][0].errorCode == 1) {
                this.notif.error(response.results[0][0].errorMsg ? response.results[0][0].errorMsg : 'Something went wrong', '');
              }
              else if (response.results[0][0].errorCode == 0) {
                this.notif.success(response.results[0][0].errorMsg ? response.results[0][0].errorMsg : 'Data saved succesfully', '');
                this.changedDatasForModification = [];
              }
              else {
                this.notif.error('Something went wrong', '');
              }
            }
          }
          else {
            this.notif.error('No data found', '');
            if (purpose == 'V') {
              this.resetForm();
            }
          }
        }
        else if (response.errorCode == 1 && response.errorMsg) {
          this.notif.error(response.errorMsg, '');
        }
        else {
          this.notif.error('Server encountered an Error', '');
        }
      },
        (error: HttpErrorResponse) => {
          this.notif.error('Server encountered an Error', '');
          this.isSpinVisible = false;
        })
    }
  }

  resetForm() {
    this.fromdate = null;
    this.todate = null;
    this.resultantData = [];
    this.panNumber = '';
    this.detailDataHeads = [];
    this.sentFromDate = null;
    this.sentToDate = null;
    this.selectedLetterIntimation = 'All';
    this.SerialNoForPreview = null;
    this.tempResultantData = [];
    this.changedDatasForModification = [];
  }

  markAsSentFn(check, index1, type) {
    let index = this.tempResultantData.findIndex((n:any)=>n['SerialNo'] == index1);
    if(index != -1){
      if (type == 'checkbox') {
        if (check) {
          this.resultantData[index]['Sent Date'] = moment(new Date()).format(AppConfig.dateFormat.apiMoment);
        }
        else {
          this.resultantData[index]['Sent Date'] = null;
        }
      }
      else{
        this.resultantData[index]['Sent Date'] = this.resultantData[index]['Sent Date'] ? moment(this.resultantData[index]['Sent Date']).format(AppConfig.dateFormat.apiMoment) : '';
      }
      console.log(this.tempResultantData,'thi,s.tempResultantData',this.resultantData[index],'this.resultantData[index]');
      // if(this.tempResultantData.some((data)=>(data['SerialNo'] == this.resultantData[index]['SerialNo']) && ((data['Sent Date'] != this.resultantData[index]['Sent Date']) || (data['Mark As Sent'] != this.resultantData[index]['Mark As Sent'])))){
      let indexofSameObject = this.changedDatasForModification.findIndex((data) => data['SerialNo'] == this.resultantData[index]['SerialNo']);
      if (indexofSameObject != -1) {
        this.changedDatasForModification.splice(indexofSameObject, 1, this.resultantData[index])
      }
      else {
        this.changedDatasForModification.push(this.resultantData[index])
      }
      console.log(this.changedDatasForModification, 'changedDatasForModification')
      // }
    }
    


  }

  exportExcel() {
    if (this.validateInputFilterData()) {
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            FromDate: this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            ToDate: this.todate ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
            Pan: this.panNumber ? this.panNumber.PAN : '',
            Purpose: 'E',  // E - export excel witout serial no
            SerialNo: '',
            SntFromDate: this.sentFromDate ? moment(this.sentFromDate).format(AppConfig.dateFormat.apiMoment) : '',
            SntToDate: this.sentToDate ? moment(this.sentToDate).format(AppConfig.dateFormat.apiMoment) : '',
            LttrIntimation: this.selectedLetterIntimation ? this.selectedLetterIntimation : 'All',
            MrkAsSent: '',
          }],
        "requestId": "10000203",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isSpinVisible = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        this.isSpinVisible = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error("No Data Found", '');
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
        this.isSpinVisible = false;
      });
    }
  }

  pdfDownload() {
    if (this.validateInputFilterData()) {
      this.exportPdf('D');
      this.exportPdf('A');
    }
  }

  exportPdf(purpose = 'D', serialNumber?) {  // D- letter pdf download , A- address pdf download
    purpose == 'D' ? this.pdfDownloadClicked.letterDownload = true : this.pdfDownloadClicked.addressDownload = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          FromDate: this.fromdate && !serialNumber ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.todate && !serialNumber ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
          Pan: this.panNumber && !serialNumber ? this.panNumber.PAN : '',
          Purpose: purpose ? purpose : 'D',
          SerialNo: serialNumber ? serialNumber : '',
          SntFromDate: this.sentFromDate && !serialNumber ? moment(this.sentFromDate).format(AppConfig.dateFormat.apiMoment) : '',
          SntToDate: this.sentToDate && !serialNumber ? moment(this.sentToDate).format(AppConfig.dateFormat.apiMoment) : '',
          LttrIntimation: this.selectedLetterIntimation && !serialNumber ? this.selectedLetterIntimation : '',
          MrkAsSent: '',
        }],
      "requestId": "10000203",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A4' };
    let isPreview: boolean;
    // isPreview = false;
    isPreview = true;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      purpose == 'D' ? this.pdfDownloadClicked.letterDownload = false : this.pdfDownloadClicked.addressDownload = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        if (!this.pdfDownloadClicked.letterDownload && !this.pdfDownloadClicked.addressDownload) {
          this.notif.error("No Data Found", '');
          return;
        }
      }
      else {
        if (!isPreview) {
          if (!this.pdfDownloadClicked.letterDownload && !this.pdfDownloadClicked.addressDownload) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }
    }, () => {
      this.notif.error("Server encountered an error", '');
      purpose == 'D' ? this.pdfDownloadClicked.letterDownload = false : this.pdfDownloadClicked.addressDownload = false;
      // this.isSpinVisible = false;
    });
  }

  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  validateInputFilterData() {
    if (((this.fromdate || this.todate) && this.panNumber && (this.sentFromDate || this.sentToDate))
      || ((this.fromdate || this.todate) && this.panNumber) || ((this.sentFromDate || this.sentToDate) && this.panNumber) ||
      ((this.fromdate || this.todate) && (this.sentFromDate || this.sentToDate))) { // if there is value in date field and pan field return false
      this.notif.error('Invalid Selection', '');
      this.resetForm();
      return false;
    }
    else if (!this.panNumber && (!this.fromdate || !this.todate) && (!this.sentFromDate || !this.sentToDate)) { //pannumber is null, one or two date fields are null return false
      this.notif.error('Select atleast one combination', '');
      return false;
    }
    else if ((differenceInCalendarDays(this.fromdate, this.todate) > 0) && !this.panNumber && (differenceInCalendarDays(this.sentFromDate, this.sentToDate) > 0)) {
      this.notif.error('Invalid Date Selection', '');
      return false;
    }
    else {
      return true;
    }
  }

  showDrawerContent($event, serialNo?) {
    this.visible = true;
    this.drawerContent = this.sanitizer.bypassSecurityTrustHtml($event);
    this.SerialNoForPreview = serialNo;
  }

}
