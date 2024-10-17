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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { PageService, Permissions } from 'shared';

export interface uccfilegeneration {
  From: Date;
  To: Date;
  Product: any;
  Active: boolean;
  mode: any;
  Tradecode: any;
  terminated: any;
  mobileandemailalert: any;
  generationoresponse: any;
  FileType: string;
  responsedate: Date;
}

@Component({
  templateUrl: './uccuploadfilegeneration.component.html',
  styleUrls: ['./uccuploadfilegeneration.component.less'],
  // animations: [bounceInOutAnimation]
})
export class uccfilegenerationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  pagePerms: Permissions;
  SpFindopt: FindOptions;
  model: uccfilegeneration;
  currentUser: User;
  blob: any;
  blob1: any;
  fileUrl: any;
  dwnld: any;
  isSpinning: boolean = false;
  ProductFindOpt: any;
  Modes: any;
  TradecodeFindopt: any;
  datas: any;
  resdatas: any;
  dataheader: any;
  resdataheader: any;
  numericarray = [];
  columnArray = [];
  showtable: boolean = false;
  showrestable: boolean = false;
  data: any;
  resdata: any;
  filegen1: any = '';
  filegen2: any = '';
  file: any;
  fileName: any;
  FileTypelist = [];
  isshow: boolean = true;

  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private pagServ: PageService,
    private sanitizer: DomSanitizer) {
    this.model = <uccfilegeneration>{

    };
    this.Modes = [{ "code": "T", "Mode": 'Traded Clients' },
    { "code": "E", "Mode": 'Enrolled Clients' },
    { "code": "U", "Mode": 'Uploaded Clients' },
    { "code": "C", "Mode": 'Commodity Participants' }]

    this.model.mode = this.Modes[3]["code"];
    this.FileTypelist = [{ "code": "U", "FileType": 'UCC' },
    { "code": "C", "FileType": 'Commodity Participants' },
    { "code": "B", "FileType": 'Both' }]
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.model.From = new Date();
    this.model.To = new Date();
    this.ProductFindOpt = {
      findType: 5012,
      codeColumn: 'Product',
      codeLabel: 'Product',
      descColumn: 'Description',
      descLabel: 'Description',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.TradecodeFindopt = {
      findType: 5011,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.model.generationoresponse = 'G';
    this.updatePermissions()
 

    setTimeout(() => {


      if (this.pagePerms.canPrint == true) {
        this.formHdlr.config.showExportExcelBtn = true;
      }
      else {
        this.formHdlr.config.showExportExcelBtn = false;
      }
    }, 300)
  }
  generationoresponseChange(e) {
    this.updatePermissions()


    setTimeout(() => {


      if (this.pagePerms.canPrint == true) {
        this.formHdlr.config.showExportExcelBtn = true;
      }
      else {
        this.formHdlr.config.showExportExcelBtn = false;
      }
    }, 300)
    if (this.model.generationoresponse == 'R') {
      this.FileTypelist = [{ "code": "U", "FileType": 'UCC' },
      { "code": "C", "FileType": 'Commodity Participants' }]

    }
    else {
      this.FileTypelist = [{ "code": "U", "FileType": 'UCC' },
      { "code": "C", "FileType": 'Commodity Participants' },
      { "code": "B", "FileType": 'Both' }]
    }

    this.resetForm();
    if (this.model.generationoresponse == 'R') {
      this.isshow = false;
      // this.formHdlr.config.showPreviewBtn = false;
      this.formHdlr.config.showExportExcelBtn = true;
      // this.formHdlr.config.showCancelBtn = false;

    }
    else {
      // this.formHdlr.config.showPreviewBtn = true;
      // this.formHdlr.config.showExportExcelBtn = true;
      // this.formHdlr.config.showCancelBtn = true;
    }


  }
  resetForm() {
    this.model.mode = this.Modes[3]["code"];
    this.model.Tradecode = null;
    this.showtable = false;
    this.showrestable = false;
    this.model.Product = null;
    this.model.From = new Date();
    this.model.To = new Date();
    this.model.terminated = false;
    this.model.mobileandemailalert = false;
    this.file = [];
    this.model.mode = "";
  }
  reset() {
    this.file = [];
    this.showrestable = false;
    this.model.Product = '';
    this.model.FileType = '';
  }
  preview() {
    const selectedProduct = this.model.Product.Product
    
    if (!this.model.Product) {
      this.notif.error('Please select product', '');
      return;
    }
    if (!this.model.FileType) {
      this.notif.error('Please select File Type', '');
      return;
    }
    this.isSpinning = true;
    let val;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "ReportType": "G",
          "FType": this.model.FileType || '',
          "Flag": "View",
          "FDate": this.model.From ? moment(this.model.From).format(AppConfig.dateFormat.apiMoment) : '',
          "TDate": this.model.To ? moment(this.model.To).format(AppConfig.dateFormat.apiMoment) : '',
          "Mode": this.model.mode,
          "Terminated": this.model.terminated == true ? 'Y' : 'N',
          "TradeCode": this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
          "Product": this.model.Product ? this.model.Product.Product : '',
          "MobEmailAlertFlag": this.model.mobileandemailalert == true ? 'Y' : 'N',
          "SchemeFile": '',
          "UploadedDate": '',
          "Euser": this.currentUser.userCode
        }],
      "requestId": "5032",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response && response[0]) {
        this.data = this.utilServ.convertToObject(response[0]);
        if (this.data.length > 0) {
          this.dataheader = Object.keys(this.data[0]);//
         if( selectedProduct == 'COMMCX    ' && this.model.mode == 'C' && this.model.FileType == 'C' ){
          this.dataheader = this.dataheader.filter(item => item != 'Symbol_0')
         }
           
          this.datas = response[0].metadata.columnsTypes;
          for (var i = 0; i < this.datas.length; i++) {
            if (this.datas[i] == "numeric") {
              this.numericarray.push(this.dataheader[i]);
            }
          }
          this.showtable = true;
        }
        else {
          this.showtable = false;
          this.notif.error('No data found', '')
          return;
        }
      }
      else {
        this.showtable = false;

        this.notif.error('No data found', '')
        return;
      }
    })
  }
  setStyles(head) {
    if (this.numericarray.indexOf(head) >= 0) {
      return true;
    }
    else {
      return false;
    }
  }
  setStyle(head) {
    if (this.columnArray.indexOf(head) >= 0) {
      return true;
    }
    else {
      return false;
    }
  }
  fileChangeEvent = () => {
    return (file: UploadFile): boolean => {
      this.file = [file];
      return false;
    };
  }
  uploadresponse() {
    if (this.model.FileType) {
      if (this.model.Product) {
        if (this.file[0]) {
          this.processFile(0);
        }
        else {
          this.notif.error('Please upload Response File', '');
          return;
        }
      }
      else {
        this.notif.error('Please select Product', '');
        return;
      }
    }
    else {
      this.notif.error('Please select Filetype', '');
      return;
    }
  }

  processFile(i) {

    return new Promise((resolve, reject) => {
      let val = this.file;

      if (val) {
        val.status = "Processing";
        const formdata: FormData = new FormData();
        formdata.append('file', val[0]);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            this.fileName = response.fileName;
            resolve(this.fileName)
            // this.notif.success("File uploaded successfully", '');
            this.updateData(this.fileName, 0)
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        });
      }
    });
  }

  private updateData(fileName, i) {
    return new Promise((resolve, reject) => {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            "ReportType": "R",
            "FType": this.model.FileType || '',
            "Flag": "",
            "FDate": '',
            "TDate": '',
            "Mode": '',
            "Terminated": '',
            "TradeCode": '',
            "Product": this.model.Product ? this.model.Product.Product : '',
            "MobEmailAlertFlag": '',
            "SchemeFile": fileName || '',
            "UploadedDate": moment(new Date).format(AppConfig.dateFormat.apiMoment),
            "Euser": this.currentUser.userCode

          }],
        "requestId": "5032"
      }).then((response) => {

        if (response && response[0]) {

          this.resdata = this.utilServ.convertToObject(response[0]);
          if (this.resdata.length > 0) {
            this.resdataheader = Object.keys(this.resdata[0]);

            this.resdatas = response[0].rows;
            var a = this.resdatas[2]
            console.log(a)
            for (var i = 0; i < this.resdatas.length; i++) {
              if (this.resdatas[i] == "numeric") {
                this.numericarray.push(this.resdataheader[i]);
              }
            }
            this.showrestable = true;
          }

        }

        let res;
        if (this.resdata.length > 0 && response.errorCode == 0) {
          this.notif.success("File uploaded successfully", '');
          resolve(true);


        }
        if (response && response.errorCode == 1) {
          this.notif.error(response.errorMsg, '')
        }
      });
    });

  }

  download() {
    const selectedProduct = this.model.Product.Product
    if (!this.model.Product) {
      this.notif.error('Please select product', '');
      return;
    }
    this.isSpinning = true;
    let val;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          // "Flag": "Generate",
          // "FDate": this.model.From ? moment(this.model.From).format(AppConfig.dateFormat.apiMoment) : '',
          // "TDate": this.model.To ? moment(this.model.To).format(AppConfig.dateFormat.apiMoment) : '',
          // "Mode": this.model.mode,
          // "Terminated": this.model.terminated == true ? 'Y' : 'N',
          // "TradeCode": this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
          // "Product": this.model.Product ? this.model.Product.Product : '',
          // "MobEmailAlertFlag": this.model.mobileandemailalert == true ? 'Y' : 'N',
          // "Euser": this.currentUser.userCode
          "ReportType": "G",
          "FType": this.model.FileType,
          "Flag": "Generate",
          "FDate": this.model.From ? moment(this.model.From).format(AppConfig.dateFormat.apiMoment) : '',
          "TDate": this.model.To ? moment(this.model.To).format(AppConfig.dateFormat.apiMoment) : '',
          "Mode": this.model.mode,
          "Terminated": this.model.terminated == true ? 'Y' : 'N',
          "TradeCode": this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
          "Product": this.model.Product ? this.model.Product.Product : '',
          "MobEmailAlertFlag": this.model.mobileandemailalert == true ? 'Y' : 'N',
          "SchemeFile": '',
          "UploadedDate": '',
          "Euser": this.currentUser.userCode
        }],
      "requestId": "5032",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;

      if (response) {

        this.filegen1 = "";
        this.filegen2 = "";

        if (response[0]) {
          let fileName1 = response[0].rows;
          let file1 = response[1].rows;

          if( selectedProduct == 'COMMCX    ' && this.model.mode == 'C' && this.model.FileType == 'C' ){ 
          file1 = file1.map(element => {
            const modifiedElement = element.map(item => {
              const modifiedItem = item.replace(/([^,]+),[^,]*,/, "$1,");
              return modifiedItem;
            });
            return modifiedElement;
          });
        }
          

          if (fileName1.length > 0) {
            for (let i = 0; i < file1.length; i++) {
              this.filegen1 = this.filegen1 + file1[i][0] + '\r\n';
            }
            let blob = new Blob([this.filegen1],
              {
                type: "text/csv"
              });
            saveAs(blob, fileName1[0][0]);
          }

        }
        if (response[2]) {
          let fileName2 = response[2].rows;
          let file2 = response[3].rows;

          if (fileName2.length > 0) {

            for (let i = 0; i < file2.length; i++) {
              this.filegen2 = this.filegen2 + file2[i][0] + '\r\n';
            }
            let blob1 = new Blob([this.filegen2],
              {
                type: "text/csv"
              });
            saveAs(blob1, fileName2[0][0]);
          }
        }
      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })

  }
  updatePermissions() {

    this.pagePerms = this.pagServ.getPermissions();


  }
}
