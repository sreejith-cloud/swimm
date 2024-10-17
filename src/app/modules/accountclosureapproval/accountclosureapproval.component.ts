import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AuthService, DataService, FormHandlerComponent, UtilService, User } from "shared";
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';

export interface closure {
  fromdate: Date;
  todate: Date;
  region: any;
  location: any;
  pan: any;
  serialno: any;
  Tradecode: any;
  Clientid: any;
  PanNo: any;
  userflag: 'H';
  DpId: any;
  scan: any;
  tradeCode: any;
  dpClientId: any;
  DpAcNO: any;
  Location: any;
}

@Component({
  selector: 'app-AccountClosureApproval',
  templateUrl: './accountclosureapproval.component.html',
  styleUrls: ['./accountclosureapproval.component.less']
})

export class AccountClosureApprovalComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  // model: Closure;
  Tradecode: any = {};
  DpClientId: any = {};
  region: any = {};
  location: any = {};
  serialno: any = {};
  userflag: any = {};
  PAN: any = {};
  DpId: any = {};
  currentUser: User;
  TradeFindopt: FindOptions;
  DpIdFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  PanFindOption: FindOptions;
  serialnoFindOption: FindOptions;

  fromdate: Date = new Date();
  todate: Date = new Date();
  isSpinVisible: boolean = false;
  frameshow: boolean = false;
  isLoading: boolean = false;
  listOfData: any[] = []
  listsOfData: any[] = []
  GridHead: any;
  sinData: any;
  xmlData: any;
  model: closure = <closure>{};
  isVisible: any;
  modalData: any = {};
  modalDoc: any = {};
  cmnt: any;
  clientremarks: any;
  additionalremarks: any;
  requestid: any;
  isModifyRow: string;

  pdfSrc: any;
  emlContent: any;
  tradecodeChngeLoc: any;
  TradecodeFindopt: FindOptions;
  HOstatus: string ='';
  rej_RemarksArray: any = [];
  approval_RemarksArray: any = [];
  RemarkData: string='';
  RejRemarkData: string='';

  pdfimg: any;
  requestType: any = [];
  applicationStatus: any = [];
  selectedReqType: any;
  selectedAppStatus: any = 'All';
  selectedApplication: any = {};
  HOStatus: any;
  _approval_status: any='';
  dpFilteredData: any;
  _DpId: any;
  Dpids: any[];
  _approval_remarks: any;
  rejOtherReasons: any ='';

  constructor(private authServ: AuthService,
    private utilServ: UtilService, private sanitizer: DomSanitizer,
    private dataServ: DataService, private notif: NzNotificationService) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.TradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'Name',
      requestId: 8,
      whereClause: '1=1'
    }

    this.dpClientIdFindopt = {
      findType: 5006,
      codeColumn: 'CLIENTID',

      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.serialnoFindOption = {
      findType: 7015,
      codeColumn: 'SerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.DpIdFindopt = {
      findType: 5006,
      codeColumn: 'DPID',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.PanFindOption = {
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
    this.formHdlr.config.showFindBtn = false
    this.formHdlr.config.showSaveBtn = false
    this.formHdlr.config.showPreviewBtn = true
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showCancelBtn = true;
    this.viewData('D');
    this.getDpid();
  }

  Export() {
    if (this._DpId && !this.model.DpAcNO) {
      this.notif.error('Please Enter DP Client ID', '');
      return
    }
     let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          userflag: 'E',
          serailNo: this.model.serialno && this.model.serialno.SerialNo ? this.model.serialno.SerialNo : '',
          Region: this.model.region && this.model.region.REGION ? this.model.region.REGION : '',
          Location: this.model.Location && this.model.Location.Location ? this.model.Location.Location : '',
          TradeCode: this.model.tradeCode && this.model.tradeCode.Tradecode ? this.model.tradeCode.Tradecode : '',
          DPID: this._DpId ? this._DpId : '',
          DpClientID: this.model.DpAcNO && this.model.DpAcNO ? this.model.DpAcNO : '',
          FDate: this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
          TDate: this.todate ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
          PAN: this.model.pan && this.model.pan.PAN ? this.model.pan.PAN : '',
          Scan: this.model.scan == true ? 'Y' : '',
          Euser: this.currentUser && this.currentUser.userCode ? this.currentUser.userCode : '',
          RequestType: this.selectedReqType ? this.selectedReqType : '',
          ApplicationStatus: this.selectedAppStatus ? this.selectedAppStatus : ''
        }],
      "requestId": "100050",
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
        this.isSpinVisible = false;
        this.notif.error("No Data Found", '');
        this.listOfData = [];
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
      this.notif.error("Server encountered an Error", '');
    });
  }
  Reset() {
    this.selectedApplication = {};
    this.selectedAppStatus = 'All';
    this.model.region = '';
    this._DpId ='';
    this.model.DpAcNO = '';
    this.rejOtherReasons= '';
    this._approval_remarks = '';
    this.RejRemarkData = '';
    this.model.location = '';
    this.model.Location = '';
    this.fromdate = new Date();
    this.todate = new Date();
    this.model.Tradecode = '';
    this.model.DpId = '';
    this.model.Clientid = '';
    this.model.pan = '';
    this.model.serialno = '';
    this.model.tradeCode = '';
    this.model.dpClientId = '';
    this.model.scan = null;
    this.model.userflag = null;
    this.listOfData.length = 0;
    this.model['CLIENTID'] = 0;

    this.TradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: '',
      descColumn: 'NAME',
      descLabel: '',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
  }

  viewData(flag: any) {
    if (this._DpId && !this.model.DpAcNO){
      this.notif.error('Please Enter DP Client ID', '');
      return
    }
    this.isLoading = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          userflag: flag || '',
          serailNo: this.model.serialno && this.model.serialno.SerialNo ? this.model.serialno.SerialNo : '',
          Region: this.model.region && this.model.region.REGION ? this.model.region.REGION : '',
          Location: this.model.Location && this.model.Location.Location ? this.model.Location.Location : '',
          TradeCode: this.model.tradeCode && this.model.tradeCode.Tradecode ? this.model.tradeCode.Tradecode : '',
          DPID:  this._DpId ? this._DpId : '',
          DpClientID: this.model.DpAcNO && this.model.DpAcNO ? this.model.DpAcNO : '',
          FDate: this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
          TDate: this.todate ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',
          PAN: this.model.pan && this.model.pan.PAN ? this.model.pan.PAN : '',
          Scan: this.model.scan == true ? 'Y' : '',
          Euser: this.currentUser && this.currentUser.userCode ? this.currentUser.userCode : '',
          RequestType: this.selectedReqType  ? this.selectedReqType : '',
          ApplicationStatus: this.selectedAppStatus ? this.selectedAppStatus : ''
        }],
      "requestId": "100050",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response[0]) {
        if (flag === 'D') {
          this.HOStatus = this.utilServ.convertToResultArray(response[1]) && this.utilServ.convertToResultArray(response[1])[0].HOStatus ? this.utilServ.convertToResultArray(response[1])[0].HOStatus : ''
          this.requestType = response[0] ? this.utilServ.convertToResultArray(response[0]) : [];
          this.selectedReqType = 'Email';
          this.applicationStatus = response[1] ? this.utilServ.convertToResultArray(response[1]) : [];
          this.rej_RemarksArray = this.utilServ.convertToResultArray(response[3]) ? this.utilServ.convertToResultArray(response[3]) : []
          this.approval_RemarksArray = this.utilServ.convertToResultArray(response[2]) ? this.utilServ.convertToResultArray(response[2]) : []
        }else{
          this.listOfData = []
          this.GridHead = []
          this.listOfData = response[0] && this.utilServ.convertToResultArray(response[0]) ? this.utilServ.convertToResultArray(response[0]) : [];
          if (this.listOfData) {
            this.listOfData.forEach(item => {
              item.selected = false
              item.isSave = true
              item.remarks = ''
              item.OptionSelected = '';
              item.RemarkData = '',
                item.HOstatus = ''
            });
          }

          if (this.listOfData.length > 0) {
            this.GridHead = Object.keys(this.listOfData[0]);
          } else {
            this.notif.error('No data found', '');
            this.listOfData = [];
            return;
          }
          if (this.listOfData[0].ErrorCode == 0) {
            this.notif.success(this.listOfData[0].ErrorMessage, '')
            this.listOfData = []
          } else if (this.listOfData[0].ErrorCode == 1) {
            this.notif.error(this.listOfData[0].ErrorMessage, '')
            this.listOfData = []
          }
        }
      }
      else {
        this.notif.error('No data found', '');
        this.listOfData = [];
        return;
      }
    })
  }

  update(flag: any) {
    let rejction_remarks = this.RejRemarkData;
    if(flag === 'A' && !this._approval_remarks){
      this.notif.error('Please enter approval remarks','');
      return;
    }
    if (flag === 'R' && !this.RejRemarkData) {
      this.notif.error('Please enter rejection remarks', '');
      return;
    }
    if (flag === 'R' && this.RejRemarkData === 'Other Reasons ') {
      rejction_remarks = this.rejOtherReasons;
    }else{
      rejction_remarks = this.RejRemarkData;
    }
    this.isLoading = true;
    let data = this.selectedApplication.SerialNo
    let updatedSno = this.listOfData.filter(item => item.SerialNo == data);
    let sno = data.toString()
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser ? this.currentUser.userCode : '',
          flag: 2,
          userflag: this.model.userflag ? this.model.userflag : '',
          seriallNo: sno,
          RemarksfromCC: flag === 'A' ? this._approval_remarks : flag === 'R' ? rejction_remarks : '',
          confirmStatus: flag === 'A' ? 'Y' : flag === 'R' ? 'R' : '',
        }],
      "requestId": "100053",
      "outTblCount": "0"

    }).then((response: any) => {
      this.isLoading = false;
      if (response.errorCode == 0 && response.results && response.results[0]) {
        this.notif.success(response.results[0][0].Msg, '')
        this.viewData("");
        this.handleCancel();
      }
      if (response.errorCode == 1) {
        this.handleCancel();
        this.notif.error(response.errorMsg, '')
      }
    })
  }

  Signature(data, filename) {
    this.isLoading = true;
    let sno = data.toString()
    filename = 'Account Closure Proof'
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          serailNo: sno,
          Euser: this.currentUser && this.currentUser.userCode ? this.currentUser.userCode : '',
        }],
      "requestId": "100051",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response.results && response.results[0]) {
        this.modalData = response.results[0] && response.results[0][0] ? response.results[0][0] : [];
        this.modalData.Signature = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64," + this.modalData.Signature);
        this.emlContent = this.modalData.MailProof
        if (this.modalData && this.modalData.CRRemarks){
          this.prefillRemarks(this.modalData.CRRemarks);
        }
        this.isVisible = true;
      }
      if (response.errorCode == 1) {
        this.isLoading = false;
        this.notif.error(response.errorMsg, '')
      }
    }, error => this.isLoading = false)
  }

  prefillRemarks(remark: any) {
    let findinApprovalRemark = this.approval_RemarksArray.find((rem: any) => rem.ApprovalRemarks === remark );
    if(findinApprovalRemark) {
      this._approval_remarks = remark;
    }
    
    let findinrejectionRemarks = this.rej_RemarksArray.find((rem: any) => rem.RejectRemarks === remark);
    if (findinrejectionRemarks) {
      this.RejRemarkData = remark;
    } 
    else if (!findinApprovalRemark) {
      this.rejOtherReasons = remark;
    }
  }

  showMailProof() {
    this.emlContent = this.modalData.MailProof
    let blob = new Blob([this.emlContent], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(blob, 'Closeure Request Mail proof' + " Report.eml");
  }

  handleCancel() {
    this.isVisible = false;
    this.pdfSrc = undefined;
    this.emlContent = undefined
    this.selectedApplication = {};
    this._approval_status = '';
    this.rejOtherReasons = '';
    this._approval_remarks = null;
    this.RejRemarkData = null;
  }

  Docs(data, selectedItem: any) {
    this.selectedApplication = selectedItem;
    let sno = data.toString()
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser ? this.currentUser.userCode : '',
          Flag: 12,
          SerialNo: sno,
          Status: "",
          cmnt: "",
          ClientRemarks: "",
          AdditionalRemarks: "",
          RequestDate: "",
          imgRemarks: "",
          imgLength: "",
          imgData: "",
          FromDate: "",
          ToDate: "",
          Loc: "",
          recdt: "",
          rectime: "",
          Region: "",
          Tradecode: "",
          DpId: "",
          DpClntId: "",
          DocNm: "",
          PAN: "",
          Scan: "",
          imgType: "",

        }],
      "requestId": "100052",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results && response.results[0].length > 0) {
        let disimage = response.results[0][0].FormImage;
        var disimagetype;
        disimagetype = response.results[0][0].ImgType
        var imageDocument = 'data:image/' + disimagetype + ';base64,' + disimage;
        this.showImagePreview(imageDocument);
      }
      else {
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, '');
        }
        return
      }
    })

  }
  showImagePreview(fileData) {
    this.pdfSrc = (this.sanitizer.bypassSecurityTrustResourceUrl(fileData));
  }


  OnchnageLocation(data) {
    if (data == null) {
      this.TradecodeFindopt = {
        findType: 6196,
        codeColumn: 'Tradecode',
        codeLabel: '',
        descColumn: 'NAME',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: '1=1'
      }

    }
    else {
      if (this.model.Clientid == null) {
        this.notif.info("Tradecode required !", '')
      }
      this.TradecodeFindopt = {
        findType: 6196,
        codeColumn: 'Tradecode',
        codeLabel: '',
        descColumn: 'NAME',
        descLabel: '',
        requestId: 8,
        whereClause: "Location ='" + data.Location + "'"
      }
    }
  }

  getDpid() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 14
        }],
      "requestId": "3"
    }).then((response) => {
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
          this.DpId = this.Dpids[0].DPID;
        }
      }
    });
  }

  getFilterdData(val: any) {
    if (val && val.length >= 3) {
      this.isLoading = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            DPID: this._DpId ? this._DpId : '',
            DPClientid: val,
            Flag: 'S'
          }],
        "requestId": "5056",
        "outTblCount": "0"
      }).then((response: any) => {
        this.isLoading = false;
        if (response.errorCode == 0 && response.results) {
          this.dpFilteredData = response.results[0]
        }
      }, error => { this.isLoading = false; })
    }
  }

  extractFromAndBody(emlContent: any): { from: any, body: any } {
    const lines = emlContent.split('\n');
    let isBody = false;
    let from = '';
    let body = '';

    for (const line of lines) {
      // Extract "From" field
      if (line.startsWith('From: ')) {
        from = line.replace('From: ', '').trim();
      }

      // Detect the start of the body
      if (isBody) {
        body += line + '\n';
      } else if (line.trim() === '') {
        // Detect the empty line after headers
        isBody = true;
      }
    }

    return { from, body: body.trim() };
  }

  handleImageError(event: any): void {
    console.error('Error loading image:', event);
    this.modalData.Signature = null;
  }
}









