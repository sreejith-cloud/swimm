import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, DataService, FindOptions, FormHandlerComponent, User, WorkspaceService } from "shared";
import { NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import *  as XLSX from "xlsx"
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface ClientChangeRequest {
  PanNo: any;
  uniqueCode: any;
  Cin: any;
}
@Component({
  selector: 'app-kraliveenquiry',
  templateUrl: './kraliveenquiry.component.html',
  styleUrls: ['./kraliveenquiry.component.less']
})
export class KraliveenquiryComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  model: ClientChangeRequest;
  panFindOption: FindOptions;
  fromdate: any;
  todate: any;
  dis: any = [];
  uploadedFileName: string;
  fileUploadSave: any = null;
  service: any;
  getServiceList: any = [];
  isSpinning: boolean = false;
  datePipe: DatePipe = new DatePipe('en-US');
  currentUser: User;
  generatedUniqueToken: any;
  activeTab: any = 0;
  fromdateHistory: Date;
  todateHistory: Date;
  searchToken: any;
  historyTableData: any = [];
  kraLiveEnquiryDataList: any = [];
  processedDataTemp: any;
  processEnableButton: boolean = true;
  syncToBoEnableButton: boolean = true;
  previewEnableButton: boolean = true;
  searchEnableButton: boolean = true;
  abortEnableButton: boolean = true;
  disableAbortButton: boolean = true;
  historyAutoFetchingFnActive: boolean = false;
  // historyFetchingFn: boolean = false;
  // processedDataStatus:any = [
  // ];
  // processedDataSelectedStatus:any = 'success';
  // kraLiveEnquiryDataListTemp:any = [];
  constructor(
    private notif: NzNotificationService,
    private dataServ: DataService,
    private modalService: NzModalService,
    private authServ: AuthService,
    private wsServ: WorkspaceService,
  ) {
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
    this.model = <ClientChangeRequest>{};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.accessRigntsEnableFn();
  }

  ngOnInit() {
    this.setHistoryDefaultDate();
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showPreviewBtn = false;
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
    this.fetchInitialData();
  }

  setHistoryDefaultDate() {
    this.todateHistory = new Date();
    let defaultDate = new Date();
    defaultDate.setDate(new Date().getDate() - 7);
    this.fromdateHistory = defaultDate;
  }

  fetchInitialData() {
    // this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Flag: "D",  // Flag - D, for fetching service list
          Euser: this.currentUser.userCode,
          PAN: '',
          frmdt: '',
          todt: '',
          File: '',
          Agency: '',
          Token: 0,
        }],
      "requestId": "2996",
      "outTblCount": "0"

    }).then((response) => {
      if (response && response.errorCode === 0) {
        if (response.results && response.results[0] && response.results[0].length > 0) {
          this.getServiceList = response.results[0];
          // this.isSpinning = false;
          if (this.getServiceList && this.getServiceList[0] && this.getServiceList[0].Agency) {
            this.service = this.getServiceList[0].Agency;
            this.fetchKRALiveEnquiries('HISTORY', 0, true);
            // this.postServiceCallForXMLReadingFromDB('H', '')
          }
        }
      }
    },
      (error: HttpErrorResponse) => {
      });
  }

  processData() {
    if (this.validateInputFields()) {
      this.fetchKRALiveEnquiries();
    }
  }

  ViewData(data: any) {
    if (data.SuccessCount == 0 || data.SuccessCount == undefined || data.SuccessCount == null) {
      this.notif.error('No Data Found', '');
      return false;
    }
    else {
      this.processedDataTemp = data;
      this.fetchKRALiveEnquiries('VIEW', data.TOKEN);
      // if (this.processedDataTemp.BOSynced) {  // if the data already synced to back office without a confirmation popup directly shows the entries
      //   this.fetchKRALiveEnquiries('VIEW', data.TOKEN);
      // }
      // else {
      //   this.modalService.confirm({
      //     nzOkText: 'YES',
      //     nzCancelText: 'NO',
      //     nzTitle: '<i>Confirmation</i>',
      //     nzContent: '<b>Do you want to update the KRA Status to Back Office records?</b>',
      //     nzOnOk: () => {
      //       // this.activeTab = 1;
      //       this.fetchKRALiveEnquiries('SyncToBackOffice', data.TOKEN);
      //     },
      //     nzOnCancel: () => {
      //       // this.activeTab = 1;
      //       this.fetchKRALiveEnquiries('VIEW', data.TOKEN);
      //     }
      //   })
      // }
    }
  }

  tabChange() {
    if (this.activeTab == 1 && this.kraLiveEnquiryDataList.length > 0 && this.processedDataTemp) {
      this.formHdlr.config.showExportExcelBtn = true;
    }
    else {
      this.formHdlr.config.showExportExcelBtn = false;
    }
  }

  syncToBackOffice() {
    if (!this.processedDataTemp || this.processedDataTemp == null || this.kraLiveEnquiryDataList.length == 0) {
      this.notif.error('No Data Found', '');
    }
    else if (this.processedDataTemp.BOSynced) {
      this.notif.error('Data already synced to B.O', '');
    }
    else {
      this.fetchKRALiveEnquiries('SyncToBackOffice', this.processedDataTemp.TOKEN ? this.processedDataTemp.TOKEN : 0);
    }
  }

  fetchKRALiveEnquiries(Flag: string = 'UPLOAD', Token: number = 0, Skip: boolean = false, ServiceStatus: boolean = true) {
    // FLAG upload - token generation,View - view kra live enquiries when click view button, SyncToBackOffice - sync fetched data to back office, HISTORY- get history of generated tokens
    if (!Skip) {  // if we need background processing without screenloading
      this.isSpinning = true;
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Flag: Flag === 'UPLOAD' ? 'U' : Flag === 'VIEW' ? 'V' : Flag === 'SyncToBackOffice' ? 'Y' : Flag === 'HISTORY' ? 'H' : Flag === 'ABORT' ? 'A' : 'H',
          Euser: this.currentUser.userCode ? this.currentUser.userCode : '',
          PAN: this.model.PanNo ? this.model.PanNo.PAN : '',
          frmdt: Flag === 'HISTORY' && this.fromdateHistory ? this.datePipe.transform(this.fromdateHistory, 'yyyy-MM-dd') : this.fromdate ? this.datePipe.transform(this.fromdate, 'yyyy-MM-dd') : '',  // using for process fn and history search fn
          todt: Flag === 'HISTORY' && this.todateHistory ? this.datePipe.transform(this.todateHistory, 'yyyy-MM-dd') : this.todate ? this.datePipe.transform(this.todate, 'yyyy-MM-dd') : '',
          File: this.dis.length > 0 ? this.fileUploadSave : '',
          Agency: this.service ? this.service : '',
          Token: Flag === 'HISTORY' && this.searchToken ? this.searchToken : Token ? Token : 0,
          ServiceStatus: ServiceStatus ? 'Y' : 'N'  //service status true means service is up, if we generated a new token and when we post that token to service and service is down  we set service status false , to deal in-process tokens in db side
        }],
      "requestId": "2996",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response && response.errorCode === 0) {
        if (Flag === 'UPLOAD' && response.results && response.results[0] && response.results[0][0] && response.results[0][0].Token && response.results[0][0].Token != 0) {  // if calling the function with filters to get the unique token and generate needed xml for service call in DB
          this.generatedUniqueToken = response.results[0][0].Token;
          this.postServiceCallForXMLReadingFromDB('P', this.generatedUniqueToken);  // if we get the token call the service with unique token id
          // this.notif.success('Process Started Successfully', '');
        }
        else if (Flag === 'ABORT' && response && response.results && response.results[1] && response.results[1][0] && response.results[1][0].errorCode === 0) { // abort the in-progress token
          if (response.results[1][0].errorMsg) {
            this.notif.success(response.results[1][0].errorMsg, '');
          }
          else {
            this.notif.success('Process aborted successfully', '');
            this.fetchKRALiveEnquiries('HISTORY', 0, true, true);
          }
        }
        else if (Flag === 'VIEW') {   // list Kra live enquiry against a particular token
          if (response && response.results && response.results[0] && response.results[0].length > 0) {
            this.kraLiveEnquiryDataList = response.results[0];
            this.activeTab = 1;
            if (!this.processedDataTemp.BOSynced) {  // if the data already synced to back office without a confirmation popup directly shows the entries
              this.modalService.confirm({
                nzOkText: 'YES',
                nzCancelText: 'NO',
                nzTitle: '<i>Confirmation</i>',
                nzContent: '<b>Do you want to update the KRA Status to Back Office records?</b>',
                nzOnOk: () => {
                  this.fetchKRALiveEnquiries('SyncToBackOffice', this.processedDataTemp.TOKEN ? this.processedDataTemp.TOKEN : 0);
                },
                nzOnCancel: () => {
  
                }
              })
            }
          }
          else {
            this.notif.error('No Data Found', '');
            this.kraLiveEnquiryDataList = [];
            this.activeTab = 0;
            this.processedDataTemp = null;
          }
        }
        else if (Flag === 'HISTORY') {  // list history of processed tokens with their status against selected date range
          if (response && response.results && response.results[0] && response.results[0].length > 0) {
            this.disableAbortButton = !response.results[0].some((data: any) => (data.EUSER == this.currentUser.userCode && data.Status == 'In-Process'));  // if there is any inprogress token against the user enable abort button
            this.historyTableData = response.results[0];
            if (response.results[0].some((data: any) => data.Status == 'In-Process') && !this.historyAutoFetchingFnActive) {  // if there is a in progress task against logged in user we have to enable abort button and continuously check the status of the task    
              this.historyAutoFetchingFnActive = true;
              setTimeout(() => {
                this.historyAutoFetchingFnActive = false;
                this.fetchKRALiveEnquiries('HISTORY', 0, true, true);
              }, 10000)
            }
          }
          else {
            this.disableAbortButton = true;
            if (!Skip) {  // if history search is by clicking search button we need to show error message if there is no data in response
              this.notif.error('No Data Found', '');
              this.historyTableData = [];
            }
          }
        }
        else if (Flag === 'SyncToBackOffice') {  // sync data against a token directly from history tab or processed data tab
          if (response && response.results && response.results[1] && response.results[1][0] && (response.results[1][0].errorCode === 0 || response.results[1][0].errorCode === 1)) {
            if (response.results[1][0].errorCode === 0) {
              this.notif.success(response.results[1][0].errorMsg, '');
              this.processedDataTemp.BOSynced = true;  // if bo.sync is succecss change
              this.kraLiveEnquiryDataList.map((n) => {
                if (n.TOKEN == this.processedDataTemp.TOKEN) {
                  n.BOSynced = true;
                }
              })
            }
            else {
              this.notif.error(response.results[1][0].errorMsg, '');
              return false;
            }
          }
          else {
            this.notif.error('Something Went Wrong', '');
            return false;
          }

          // if (this.activeTab == 0) {
          //   if (response && response.results && response.results[0] && response.results[0].length > 0) {
          //     this.kraLiveEnquiryDataList = response.results[0];
          //   }
          //   else {
          //     this.kraLiveEnquiryDataList = [];
          //     this.processedDataTemp = null;
          //   }
          //   this.activeTab = 1;
          // }
        }
        else if (response && response.results && response.results[1] && response.results[1][0] && response.results[1][0].errorCode === 1 && response.results[1][0].errorMsg) {  // result set  response.results[1] commonly used for show error messages
          this.notif.error(response.results[1][0].errorMsg, '');
          this.reset();
        }
        else {
          this.notif.error('Something Went Wrong', '');
          this.reset();
        }
      }
      else {
        this.notif.error(response.errorMsg, '');
        // this.reset();
      }
    },
      (error: HttpErrorResponse) => {
        this.notif.error("Server encountered an Error", '');
        this.isSpinning = false;
        // this.reset();
      });
  }

  historyFilterSearch() {
    if (new Date(this.datePipe.transform(this.todateHistory)) < new Date(this.datePipe.transform(this.fromdateHistory))) {
      this.notif.error('Invalid Date Selection', '');
    }
    else {
      this.fetchKRALiveEnquiries('HISTORY');
    }
  }

  postServiceCallForXMLReadingFromDB(flag = 'P', generatedUniqueToken = 0) { // flag P for start a process based on a token
    this.isSpinning = true;
    let request = {
      "flag": flag ? flag : 'P',
      "Euser": "",
      "PAN": "",
      "frmdt": "",
      "todt": "",
      "File": "",
      "Agency": "",
      "token": generatedUniqueToken ? generatedUniqueToken : '',
      "ServiceStatus": ""
    }
    this.dataServ.post(environment.api_kraBulkdata, request).then(response => {
      this.isSpinning = false;
      if(flag == 'A'){
        this.fetchKRALiveEnquiries('ABORT', generatedUniqueToken);
      }
      else if (response && response['errorCode'] == 0) {
        // if (flag == 'P') {
        //   this.notif.success('Process Successfully Started', '');
        //   this.fetchKRALiveEnquiries('HISTORY', 0, true, true);
        // }
        // else if (flag == 'A') {
        //   this.fetchKRALiveEnquiries('ABORT', generatedUniqueToken);
        // }
        this.notif.success('Process Successfully Started', '');
        this.fetchKRALiveEnquiries('HISTORY', 0, true, true);
      }
      else if (response && response['errorCode'] == 1 && response['errorMsg']) {
        this.notif.error(response['errorMsg'], '');
        // this.fetchKRALiveEnquiries('HISTORY', 0, true, flag == 'P' ? false : true); // the api call is get a 404 , so need to deal latest generated token , service status set as false, only for flag P
        this.fetchKRALiveEnquiries('HISTORY', 0, true, false); // the api call is get a 404 , so need to deal latest generated token , service status set as false, only for flag P
      }
      else {
        this.notif.error('Internal Server Error Occured', '');
        // this.fetchKRALiveEnquiries('HISTORY', 0, true, flag == 'P' ? false : true); // the api call is get a 404 , so need to deal latest generated token , service status set as false, only for flag P
        this.fetchKRALiveEnquiries('HISTORY', 0, true, false); // the api call is get a 404 , so need to deal latest generated token , service status set as false, only for flag P
      }
    }, (error: HttpErrorResponse) => {
      this.isSpinning = false;
      if(flag == 'A'){
        this.fetchKRALiveEnquiries('ABORT', generatedUniqueToken);
      }
      else{
        this.notif.error('Internal Server Error Occured', '');
        this.fetchKRALiveEnquiries('HISTORY', 0, true, false); // the api call is get a 404 , so need to deal latest generated token , service status set as false, only for flag P
      }
    })
  }

  validateInputFields() {
    if (this.isSpinning) {
      this.notif.error('There is a Ongoing Procedure', '');
      return false;
    }
    if (!this.fromdate && !this.todate && this.dis.length === 0 && !this.model.PanNo) {
      this.notif.error('Select Atleast One Combination', '');
      return false;
    }
    else if (!this.model.PanNo && this.dis.length === 0 && (this.fromdate || this.todate)) {
      if ((!this.fromdate || !this.todate) || (new Date(this.datePipe.transform(this.todate)) < new Date(this.datePipe.transform(this.fromdate)))) {
        this.notif.error('Invalid Date Selection', '');
        return false;
      }
      else if (Math.floor((this.todate - this.fromdate) / (1000 * 60 * 60 * 24)) > 31) {  // added date range into 31 days
        this.notif.error('Date Range should be within 31 Days', '');
        return false;
      }
      else {
        return true;
      }
    }
    else if (!this.model.PanNo && !this.fromdate && !this.todate && this.dis.length > 0) {
      return true;
    }
    else if (this.model.PanNo && !this.fromdate && !this.todate && this.dis.length === 0) {
      return true;
    }
    else {
      this.notif.error('Invalid Field Selection', '')
      return false;
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.validateInputFile(file);
    return false;
  }

  validateInputFile(file) {
    let data;
    this.isSpinning = true;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      data = XLSX.utils.sheet_to_json(ws);
    };
    reader.readAsBinaryString(file);
    reader.onloadend = (e) => {
      if (data.length > 5000) {
        this.notif.error('Exceeds 5000 Pan Limit', '');
        this.isSpinning = false;
        return false;
      }
      else if (data.length == 0) {
        this.notif.error('Empty File', '');
        this.isSpinning = false;
        return false;
      }
      else {
        this.uploadFileToFtp(file);
      }
    }
  }

  uploadFileToFtp(file) {
    this.dis = [file];
    return new Promise((resolve, reject) => {
      if (file) {
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            this.uploadedFileName = response.fileName;
            resolve(this.uploadedFileName);
            this.fileUploadSave = this.uploadedFileName;
            this.isSpinning = false; //remove after fn
            return true;
          }
          else {
            this.fileUploadSave = null;
            this.dis = [];
            this.notif.error(response.errorMsg, '');
            this.isSpinning = false;
            return false;
          }
        },
          (error: HttpErrorResponse) => {
            this.notif.error('Internal Server Error Occured', '');
            this.fileUploadSave = null;
            this.dis = [];
            this.isSpinning = false;
            return false;
          });
      } else {
        this.isSpinning = false;
        return false;
      }
    });
  }

  downloadKRALiveEnquiry() {
    if (!this.processedDataTemp || !this.processedDataTemp.TOKEN || this.kraLiveEnquiryDataList.length == 0) {
      this.notif.error('No Data Found', '');
    }
    else {
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            Flag: 'V',
            Euser: this.currentUser.userCode,
            PAN: '',
            frmdt: '',
            todt: '',
            File: '',
            Agency: '',
            Token: this.processedDataTemp.TOKEN ? this.processedDataTemp.TOKEN : 0,
          }],
        "requestId": "2996",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean = false;
      this.isSpinning = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error(response.errorMsg, '');
          this.isSpinning = false;
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            this.isSpinning = false;
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an Error", '');
        this.isSpinning = false;
      });
    }
  }

  reset() {
    this.service = this.getServiceList && this.getServiceList[0] && this.getServiceList[0].Agency ? this.getServiceList[0].Agency : null;
    this.model.PanNo = null;
    this.fromdate = null;
    this.todate = null;
    this.dis = [];
    this.fileUploadSave = null;
    this.generatedUniqueToken = null;
    this.isSpinning = false;
    this.activeTab = 0;
    this.setHistoryDefaultDate();
    this.searchToken = null;
    this.historyTableData = [];
    this.kraLiveEnquiryDataList = [];
    this.processedDataTemp = null;
    this.disableAbortButton = true;
    this.fetchKRALiveEnquiries('HISTORY', 0, true);
  }

  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  onviewClick(data: any) {
    this.model.Cin = data ? data.CINNo : '';
    this.model.uniqueCode = data ? data.AccountCode : '';
  }

  accessRigntsEnableFn() {
    // this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "UserCode": this.currentUser.userCode,
          "ProjectID": this.wsServ.getProjectId(), //this.currentUser.defaultProjId,
        }],
      "requestId": "10",
      "outTblCount": "0",
    }).then((response) => {
      var responseData = response.results[0]
      responseData.forEach(element => {
        if (Number(element.ModuleID) == 16033) {
          this.processEnableButton = element.AddRight ? element.AddRight : false;
          this.syncToBoEnableButton = element.AddRight ? element.AddRight : false;
          this.abortEnableButton = element.element.AddRight ? element.AddRight : false;
          this.previewEnableButton = element.PreviewRight ? element.PreviewRight : false;
          this.searchEnableButton = element.PreviewRight ? element.PreviewRight : false;
          return
        }
      });
    });
  }

  abortProcess() {
    let abortClientData = this.historyTableData.find((user: any) => (user.Status == 'In-Process' && user.EUSER == this.currentUser.userCode));
    if (abortClientData) {
      this.modalService.confirm({
        nzOkText: 'YES',
        nzCancelText: 'NO',
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure you want to proceed?</b>',
        nzOnOk: () => {
          this.postServiceCallForXMLReadingFromDB('A', abortClientData.TOKEN ? abortClientData.TOKEN : 0);
        },
        nzOnCancel: () => {
          
        }
      })
    }
    else {
      this.notif.error('No Process to abort', '');
    }
  }

}
