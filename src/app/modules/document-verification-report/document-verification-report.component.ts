import { Component, OnInit, ViewChild } from '@angular/core';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-document-verification-report',
  templateUrl: './document-verification-report.component.html',
  styleUrls: ['./document-verification-report.component.less']
})
export class DocumentVerificationReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  LocationFind: FindOptions;
  fromDate: any;
  toDate: any;
  DocReceived: any;
  location: any='';
  SerialNumber: any='';
  DocumentsArray: any = [];
  DocumentsArrayHeads: any = [];
  isSpining: boolean = false;
  TotalRecords: number;
  TotalReceived: number;
  TotalPending: number;
  receivedDate: any;
  reportBy: any;
  Status: any;
  RegionFind:FindOptions;
  region:any;
  constructor(private dataserve: DataService,
    private utilserv: UtilService,
    private notif: NzNotificationService) {

    this.LocationFind = {
      findType: 1100,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.RegionFind={
      findType: 1101,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }


  }

  ngOnInit() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.DocReceived = 'Y';
    this.reportBy = 'E'
    this.Status = 'ALL'
  }
  ngAfterViewInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
  }
  Reset() {
    this.fromDate = new Date();
    this.toDate = new Date();
    // this.receivedDate=new Date();
    this.DocReceived = 'Y';
    this.location = '';
    this.SerialNumber = '';
    this.DocumentsArray = [];
    this.DocumentsArrayHeads = [];
    this.TotalRecords = 0
    this.TotalReceived = 0
    this.TotalPending = 0
    this.formHdlr.config.showExportExcelBtn = false;
    this.reportBy = 'E'
    this.Status = 'ALL'
  }
  view() {
    if(!this.location && !this.SerialNumber)
    {
      const date1 = this.fromDate
      const date2 = this.toDate
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if(diffDays>60)
      {
      this.notif.error('Report is only available  for 60 days','')
      return
      }
    }

    if (this.SerialNumber != null || this.SerialNumber != '') {
      if (this.fromDate == '' || this.fromDate == null) {
        this.notif.error('From date should be selected', '')
        return
      }
      if (this.toDate == '' || this.toDate == null) {
        this.notif.error('To date should be selected', '')
        return
      }
    }
    this.formHdlr.config.showExportExcelBtn = false;
    this.isSpining = true
    this.dataserve.getResponse({
      "batchStatus": "false",

      "detailArray":
        [{
          FromDate: this.fromDate ? moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.toDate ? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          DocumentReceivedFlag: this.DocReceived ? this.DocReceived : '',
          Location: this.location ? this.location.Location : '',
          SerialNo: this.SerialNumber ? this.SerialNumber : '',
          ReportType: this.reportBy,
          ReportStatus:this.Status,
          Region:this.region?this.region.REGION:''
        }],
      "requestId": "7040",
      "outTblCount": "0"
    }).then((response) => {
      this.DocumentsArray = [];
      this.TotalRecords = 0;
      this.TotalReceived = 0;
      this.TotalPending = 0;
      this.isSpining = false
      // if (response.errorCode == 0) {
        // if (response.results && response.results.length && response.results[0] && response.results[0].length) {
          if(response[0]&&response[0].rows.length>0)
          {
          this.DocumentsArray =this.utilserv.convertToResultArray(response[0]);
          this.DocumentsArrayHeads = Object.keys(this.DocumentsArray[0]);
          this.TotalRecords = this.DocumentsArray.length;
          var received = this.DocumentsArray.filter(item => item.DocumentReceived == 'Y')
          var pending = this.DocumentsArray.filter(item => item.DocumentReceived == 'N')
          this.TotalReceived = received.length;
          this.TotalPending = pending.length
          this.formHdlr.config.showExportExcelBtn = true;
        }
        else {
          this.notif.error('No results found', '');
        }
      // }
      // else {
      //   this.notif.error(response.errorMsg, '');
      // }

    })
  }
  Excel(colums, data, filename) {
    let html;
    let tableHeader;
    html = "<table><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      html = html + "<th style='border:1px solid black;border-width: thin;'>" + tableHeader[i] + "</th>";
    }
    html = html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        html = html + "<td style='border:1px solid black;border-width: thin;'>" + data[i][tableHeader[j]] + "</td>";
      }
      html = html + "<tr>";
    }
    html = html + "</tr><table>";
    let blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, filename + " Report.xls")
  }
  Export() {
    this.Excel(this.DocumentsArrayHeads, this.DocumentsArray, 'Ho Document Received')
  }
  // OnChangeReporttype(val) {
  //   if (val == 'R') {
  //     this.DocReceived = 'Y'
  //   }
  //   if(val=='A')
  //   {
  //     this.DocReceived = 'Y'
  //     this.Status='A'
  //   }
  // }
  // OnReceivedChangeFlag(val) {
  //   if (val != 'Y') {
  //     this.reportBy = 'E'
  //   }
  // }
}
