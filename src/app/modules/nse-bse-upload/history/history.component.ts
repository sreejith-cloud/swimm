import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent } from "shared";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  totalPages: any = 1;
  row: any = 5;
  pageIndexVal: any = 1;
  dataArray: any = []
  FileNames: String = '';
  UploadDate: any;
  isSpinning: boolean = false;
  listOfData: any = []
  currentTime: any;
  currentUser: any;
  fromDate:Date
  toDate:Date
  today:Date=new Date
  constructor(private dataServ: DataService,
    private notif: NzNotificationService,
    private authServ: AuthService,
    private modalService: NzModalService

  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }
    disabledFutureDate = (current: Date): boolean => {
      return ( differenceInCalendarDays(current, this.today) > 0)
    };

  ngOnInit() {
    this.formHdlr.config.showPreviewBtn=true
    // this.formHdlr.config.showExportExcelBtn=true
    this.formHdlr.config.showFindBtn=false
    this.formHdlr.config.showSaveBtn=false
    this.reset()
    // this.tableData('S')
  }

  pageChage() {
    // alert(this.pageIndexVal)
    // this.pageIndexVal = index;
    this.tableData();
  }

  tableData(type?) {
    if(type !=='S')
    {
    if(!this.fromDate)
    {
      this.notif.error("Please provide 'From' date", '',{ nzDuration: 1000});
      return
    }
    if(!this.toDate)
    {
      this.notif.error("Please provide 'To' date", '',{ nzDuration: 1000});
      return
    }
    if(this.fromDate > this.toDate)
    {
      this.notif.error("The 'From' date must have a greater value than the 'To' date", '',{ nzDuration: 1000});
      return
    }
  }
    this.dataArray = [];
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [{
        Euser: this.currentUser && this.currentUser.firstname ? this.currentUser.firstname : '',
        Filename:  '',
        flag: 'H',
        Tradecode :'',
        Page: (this.pageIndexVal-1)*this.row,
        FromDate:this.fromDate?moment(this.fromDate).format(AppConfig.dateFormat.apiMoment):'',
        ToDate:this.toDate?moment(this.toDate).format(AppConfig.dateFormat.apiMoment):'',
      }],
      "requestId": "10000156",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response && response.results && response.results[0].length > 0) {
          this.dataArray = response.results[0]
          this.isSpinning = false;
        }
        else {
          if(type !=='S')
          {
          this.notif.error('No data found', '')
          }
          this.isSpinning = false;
        }
        // this.totalPages =7//
        if(response && response.results && response.results[1] && response.results[1][0] && response.results[0].length > 0)
        {
        this.totalPages = response.results[1][0].Totalcount?response.results[1][0].Totalcount:0
        this.row = response.results[1][0].Pagecount?response.results[1][0].Pagecount:0
        }
      }
      else {
        if(type !=='S')
        {
        this.notif.error(response.errorMsg, '')
        }
        this.isSpinning = false;
      }
    })
  }
  uploadEx(data: any) {
    this.FileNames = data;
    this.UploadDate = data;
    this.currentTime = data;
    this.ExportExcelOFFile()
  }

  ExportExcelOFFile(dataFromTable?,flag?) {
    if (dataFromTable.Status === 'In Progress') {
      // this.notif.error('Upload In Progress', '');return 0;
      this.modalService.info({
        nzTitle: '<h3>Alert</h3>',
        nzContent: '<h3>Upload in progress, please try after some time</h3>',
        nzOnOk: () => { this.tableData(); }
      });
      return 0;
    }
    this.isSpinning = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray": [{
        FileName: dataFromTable && dataFromTable.FileName ? dataFromTable.FileName : '',
        Euser: this.currentUser && this.currentUser.userCode ? this.currentUser.userCode : '',
        Remarks: '',
        Flag: flag,
        KeyNo: dataFromTable && dataFromTable.KeyNo ? dataFromTable.KeyNo : ''
      }],
      "requestId": "700413",
      "outTblCount": "0",
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      if (response.errorCode === 0) {
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          this.isSpinning = false;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            this.isSpinning = false;
          }
        }
      }
      else {
        this.notif.error(response.errorMsg, '')
        this.isSpinning = false;
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
      this.isSpinning = false;
    });
  }
  reset()
  {
    this.fromDate=new Date()
    this.toDate=new Date()
    this.totalPages =0
    this.row =5
    this.pageIndexVal=1;
    this.dataArray =[]
    this.tableData('S')
  }

}
