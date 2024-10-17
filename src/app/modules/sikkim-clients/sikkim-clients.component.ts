import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService, FormHandlerComponent, AppConfig, AuthService } from 'shared';
import { NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-sikkim-clients',
  templateUrl: './sikkim-clients.component.html',
  styleUrls: ['./sikkim-clients.component.css']
})
export class SikkimClientsComponent implements OnInit {

  TD: any
  model: any = {};
  reportArray: any = [];
  isSpinning: boolean = false;
  yesData: string = 'Y';
  noData: string = 'N'
  fileName = 'ExcelSheet.xlsx';
  fileUploadSave: any = null;
  fileToUpload: any;
  disableSubmit: boolean = true;
  dis: any = [];
  file: any = [];
  confirmModal: NzModalRef;
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  uploadedFileName: string;
  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
    private authServ: AuthService,
    private modalService: NzModalService,
    private nzMessageService: NzMessageService,
    private modal: NzModalService
  ) { }

  ngAfterViewInit() {

    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;

  }
  ngOnInit() {
    this.model.TD = new Date();
  }

  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'text/csv') {
      this.dis = [file];
      this.fileToUpload = file;
      this.uploadFileToFtp(file);
      this.disableSubmit = false;
      return false;
    }
    else {
      this.notif.error("Please Upload Valid File", "");
      return false;
    }

  }

  uploadUserFile() {
    if (this.dateValidationFn()) {
      if (this.fileUploadSave == null) {
        this.notif.error('Please Upload File', '');
        return false;
      }
      this.isSpinning = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            "ToDate": this.model.TD ? moment(this.model.TD).format('YYYY-MM-DD') : '',
            "File": this.fileUploadSave ? this.fileUploadSave : '',
            "ClientId": 0,
            "SentFlag": '',
            "PageNum": 1,
            "RecCnt": 10,
            "Download": 'Y'
          }],
        "requestId": "7000",
        "outTblCount": "0"
      }).then((res) => {
        if (res && res.errorCode === 0) {
          if (res && res.results && res.results[0] && res.results[0].length > 0) {
            this.reportArray = res.results[0];
            this.reportArray.splice();
            this.fileToUpload = null;
            this.dis = [];
            this.isSpinning = false;
          }
          else {
            this.notif.error('No data found', '')
            this.reportArray = [];
            this.fileToUpload = null;
            this.dis = [];
            this.isSpinning = false;
          }
        } else {
          this.notif.error('Upload Failed', '');
          this.reportArray = [];
          this.fileToUpload = null;
          this.dis = [];
          this.isSpinning = false;
        }

      })
    }
  }
  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };


  fileChangeEvent = () => {
    return (file: UploadFile): boolean => {
      this.file = [file];
      return false;
    };
  }

  uploadFileToFtp(fileToFtp) {
    this.isSpinning = true;
    return new Promise((resolve, reject) => {
      this.uploadedFileName = "";
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
        this.isSpinning = false;
      }
    });
  }

  exportexcel() {
    if (this.dateValidationFn()) {
      this.isSpinning = true;
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            "ToDate": this.model.TD ? moment(this.model.TD).format('YYYY-MM-DD') : '',
            "File": this.uploadedFileName?this.uploadedFileName:'',
            "ClientId": 0,
            "SentFlag": '',
            "PageNum": 1,
            "RecCnt": 10,
            "Download": 'Y'
          }],
        "requestId": "7000",
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
  dateValidationFn() {
    if (this.model.TD === null) {
      this.notif.error('Please Select Date', '')
      return false;
    }
    return true;
  }

  clientReport(clientId?, Status?) {
    this.uploadedFileName='';
    if (this.dateValidationFn()) {
      this.isSpinning = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            "ToDate": this.model.TD ? moment(this.model.TD).format('YYYY-MM-DD') : '',
            "File": '',
            "ClientId": clientId ? clientId : 0,
            "SentFlag": Status ? Status : '',
            "PageNum": 1,
            "RecCnt": 10,
            "Download": ''
          }],
        "requestId": "7000",
        "outTblCount": "0"
      }).then((res) => {
        if (res && res.errorCode === 0) {
          if (res && res.results && res.results[0] && res.results[0].length > 0) {
            this.reportArray = res.results[0];
            this.isSpinning = false;
          }
          else {
            this.notif.error('No data found', '')
            this.reportArray = [];
            this.isSpinning = false;
          }
        }
        else {
          this.notif.error('No data found', '')
          this.reportArray = [];
          this.isSpinning = false;
        }
      })
    }
  }

  showConfirm(clientId?, Status?, slno?) {
    if (Status === 'Y') {
      this.modal.confirm({
        nzTitle: '<h3>Alert</h3>',
        nzContent: '<h3>Are you sure you want to update the status to ‘Yes’? This action cannot be reverted</h3>',
        nzOnOk: () => {
          this.clientReport(clientId, Status)
        },
        nzOnCancel: () => {
          this.clientReport()
        }
      });
    }
  }
  resetForm() {
    this.reportArray = [];
    this.model.TD = new Date();
    this.fileToUpload = null;
    this.uploadedFileName='';
    this.dis = [];
  }

}
