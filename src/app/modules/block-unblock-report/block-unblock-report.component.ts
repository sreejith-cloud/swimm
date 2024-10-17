import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService, NzDatePickerComponent, UploadFile, NzModalRef } from 'ng-zorro-antd';
// import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, User, UtilService } from 'shared';

@Component({
  selector: 'app-block-unblock-report',
  templateUrl: './block-unblock-report.component.html',
  styleUrls: ['./block-unblock-report.component.less']
})
export class BlockUnblockReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  // @ViewChild('datePicker') datePicker2: NzDatePickerComponent;
  panFindOption: FindOptions;
  panNo: any = null;
  fromdate: Date;
  toDate: Date;
  tableData: Array<any> = [];
  tableDataHeader: Array<any> = [];
  fileUploadSave: any = null;
  dis: any = [];
  today: Date = new Date();
  uploadedFileName: string;
  isSpinning: boolean = false;
  currentUser: User;
  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
    private authServ: AuthService,
    private utilServ: UtilService
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

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = true;
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showCancelBtn = true;
  }

  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'text/csv') {
      this.dis = [file];
      this.uploadFileToFtp(file);
      return false;
    }
    else {
      this.fileUploadSave = null;
      this.dis = [];
      this.notif.error("Please Upload Valid File", "");
      return false;
    }

  }

  exportexcel() {
    if (this.validateInputFilterData()) {
      this.isSpinning = true;
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            "flag": 'E',
            "FromDate": this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            "ToDate": this.toDate ? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
            "Pan": this.panNo && this.panNo.PAN ? this.panNo.PAN : '',
            "Filename": this.fileUploadSave ? this.fileUploadSave : '',
            "SerialNo": ""
          }],
        "requestId": "114508",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;

      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.isSpinning = false;
          this.notif.error('No Data Found', '');
          return;
        }
        else {
          if (!isPreview) {
            this.isSpinning = false;
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an Error", '');
        this.isSpinning = false;
      });
    }
  }

  uploadFileToFtp(fileToFtp) {
    this.isSpinning = true;
    return new Promise((resolve, reject) => {
      if (fileToFtp) {
        const formdata: FormData = new FormData();
        formdata.append('file', fileToFtp);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            this.uploadedFileName = response.fileName;
            resolve(this.uploadedFileName);
            this.fileUploadSave = this.uploadedFileName;
            this.isSpinning = false;
          }
          else {
            this.fileUploadSave = null;
            this.dis = [];
            this.notif.error(response.errorMsg, '');
            this.isSpinning = false;
          }
        });
      } else {
        this.fileUploadSave = null;
        this.dis = [];
        this.isSpinning = false;
      }
    });
  }

  // formatDateWithoutTime(date: Date): string {
  //   if (!date) return null;
  //   return date.toISOString().split('T')[0];
  // }

  disabledPreviousDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.fromdate) < 0 || differenceInCalendarDays(current, this.today) > 0;
  };

  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };

  preview() {
    if (this.validateInputFilterData()) {
      this.tableData = [];
      this.tableDataHeader = [];
      this.isSpinning = true;
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            "flag": 'V',
            "FromDate": this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            "ToDate": this.toDate ? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
            "Pan": this.panNo && this.panNo.PAN ? this.panNo.PAN : '',
            "Filename": this.fileUploadSave ? this.fileUploadSave : '',
            "SerialNo": ""
          }],
        "requestId": "114508",
        "outTblCount": "0"
      }
      this.dataServ.getResultArray(reqParams).then(response => {
        this.isSpinning = false;
        if (response && response.errorCode == 0) {
          if (response.results && response.results[0] && response.results[0].length > 0) {
            this.tableData = response.results[0]
            this.tableDataHeader = Object.keys(response.results[0][0]).filter((n)=> n != "SerialNo")
          }
          else {
            this.notif.error('No data found', '');
            this.tableData = []
            this.tableDataHeader = []
          }
        }
        else if (response.errorCode == 1 && response.errorMsg) {
          this.tableData = []
          this.tableDataHeader = []
          this.notif.error(response.errorMsg, '');
        }
        else {
          this.tableData = []
          this.tableDataHeader = []
          this.notif.error('Server encountered an Error', '');
        }
      })
    }
  }

  pdfDownload(SerialNo?) {
    if (this.validateInputFilterData()) {
      var requestParams
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            "flag": 'P',
            "FromDate": this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
            "ToDate": this.toDate ? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
            "Pan": this.panNo && this.panNo.PAN ? this.panNo.PAN : '',
            "Filename": this.fileUploadSave ? this.fileUploadSave : '',
            "SerialNo": SerialNo ? SerialNo : ""
          }],

        "requestId": "114508",
        "outTblCount": "0"
      }
      requestParams = reqParams
      requestParams['fileType'] = "2";
      requestParams['fileOptions'] = { 'pageSize': 'A4' };
      let isPreview: boolean;
      isPreview = false;
      this.isSpinning = true;
      this.dataServ.generateReport(requestParams, isPreview).then((response) => {
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data found', '');
          this.isSpinning = false
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            this.isSpinning = false
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an Error", '');
        this.isSpinning = false
      });
    }
  }

  resetForm() {
    this.panNo = null;
    this.fromdate = null;
    this.toDate = null;
    this.tableDataHeader = [];
    this.tableData = [];
    this.fileUploadSave = null;
    this.dis = [];
  }

  validateInputFilterData() {
    if (((this.fromdate || this.toDate) && this.panNo && this.dis.length > 0)
      || ((this.fromdate || this.toDate) && this.panNo) || ((this.fromdate || this.toDate) && this.dis.length > 0)
      || (this.dis.length > 0 && this.panNo)) { // if there is value in date field and pan field return false
      this.notif.error('Invalid Selection', '');
      this.resetForm();
      return false;
    }
    else if (!this.panNo && (!this.fromdate || !this.toDate) && !(this.dis.length > 0)) { //pannumber is null, one or two date fields are null return false
      this.notif.error('Select atleast one combination', '');
      return false;
    }
    else if ((differenceInCalendarDays(this.fromdate, this.toDate) > 0) && !this.panNo && !(this.dis.length > 0)) {
      this.notif.error('Invalid Date Selection', '');
      return false;
    }
    else {
      return true;
    }
  }

}
