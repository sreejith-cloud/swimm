import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, UtilService, FindOptions, FormHandlerComponent } from 'shared';

@Component({
  selector: 'app-pandetails',
  templateUrl: './pandetails.component.html',
  styleUrls: ['./pandetails.component.less']
})
export class PandetailsComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  isLoading: boolean = false;
  tableData: any[] = [];
  panFindOption: FindOptions;
  panNumber: any;
  ReportResponseHeader: any;

  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
    private authServ: AuthService,
  ) {
    this.panFindOption = {
      findType: 6087,
      codeColumn: 'pan_gir',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
  }

  /* fetch table data*/
  preview() {
    if (!this.panNumber || this.panNumber.pan_gir == '') {
      this.notif.error('please select a Pan!!', '');
      return;
    }
    this.isLoading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.panNumber ? this.panNumber.pan_gir : ''
        }],
      "requestId": "100062",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response.results[0]) {
        let orderdata = response.results[0]
        if (orderdata.length > 0) {
          this.tableData = orderdata
          this.ReportResponseHeader = Object.keys(orderdata[0])
        } else {
          this.notif.error('No data found', '');
          return;
        }
      } else {
        this.notif.error('Server error', '');
        return;
      }
    })
  }
  exportData() {
    if (!this.panNumber || this.panNumber.pan_gir == '') {
      this.notif.error('please select a Pan!!', '');
      return;
    }
    this.isLoading = true;

    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.panNumber ? this.panNumber.pan_gir.trim() : ''
        }],
      "requestId": "100062",
      "outTblCount": "0"
    }

    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    // this.isSpinning = true;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      this.isLoading = false;
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
    });
  }

  resetForm() {
    this.panNumber = null;
    this.ReportResponseHeader = []
    this.tableData = []
  }
}
