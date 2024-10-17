import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CRFDataService } from '../CRF.service';
import * as  jsonxml from 'jsontoxml'
import { UtilService, AuthService, DataService, ValidationService } from 'shared';
import { UploadFile, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { CrfComponent } from '../crf.component';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { User } from 'shared/shared';
import { Subscription } from 'rxjs';
// import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CrfipvComponent } from '../crfipv/crfipv.component';
@Component({
  selector: 'app-crf-signature-updation',
  templateUrl: './crf-signature-updation.component.html',
  styleUrls: ['./crf-signature-updation.component.css']
})
export class CrfSignatureUpdationComponent implements OnInit {
  @Input() tab: string;
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent

  @ViewChild(CrfipvComponent) ipv: CrfipvComponent


  applicationStatus: any;
  saveButtonFlag: any;
  approveOrRejectButtonFlag: any;
  finalApproveOrRejectButtonFlag: any;
  datatick: any;
  PANNO: any;
  printFlag: boolean = false;
  currentUser: User;
  ChangeAccounts: any = [];
  IDNO: any = 0;
  subscriptions: Subscription[] = [];
  verificationstatus: any = [];
  ipvXmlData: any;
  FormControlNames: any = {};
  reasonList: any = [];
  AppRemarks: any = '';
  isSpining: boolean = false;
  RejRemarks: any = '';
  dataforaprove: any = [];
  SerialNumber: any = 0;
  additionaltc: any;
  Remks: any;
  isVisible = false;
  popup: boolean = false;
  RequestFrom: any;
  reasonsList: any = [];
  Cbox_Disabled: boolean
  checkBoxSelect: boolean;
  checkboxSelected: any = []
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkedArray: any = [];
  nomineeDetailsxml: any;
  convertedData: any = [];
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  requestID: any;

  ID: any;
  ChangeReason: any = '';
  disableChangeReasonBoolean: boolean = false;
  editFlag: boolean = false;
  // 
  HO: boolean = false;
  rejRemarksBooleanFlagR:boolean=false;
  constructor(private Crf: CrfComponent,
    private modalService: NzModalService,
    private cmServ: CRFDataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private validServ: ValidationService) {

    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;

      })
    )
    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item;

    })

    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item;
    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item;
    })
    this.cmServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
      this.printFlag = false;

    })
    this.cmServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })
    this.cmServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;

    })

    this.cmServ.applicationStatus.subscribe(item => {

      this.applicationStatus = item;


      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
          this.cmServ.DataForAprooval.subscribe(item => {
          this.dataforaprove = item;
        })
      }
      if (this.applicationStatus == 'F' || this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
        this.Remks = 'Rejection Remarks';
      }
      else {
        this.Remks = 'Remarks';
      }

    })

    this.cmServ.requestID.subscribe(item => {

      this.requestID = item;

    })

    this.cmServ.approvelRemarks.subscribe((data) => {
      this.approvelRemarks = data;

    })
    this.cmServ.rejectionRemarks.subscribe((data) => {
      this.rejectionRemarks = data;
    })
  }

  ngOnInit() {
    var branch = this.dataServ.branch;
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true;
    }

    if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
      this.cmServ.DataForAprooval.subscribe(item => {
        this.dataforaprove = item;
        if (this.tab == 'SignatureUpdation') {
          this.FillSaveddata()
        }
      })
    }
    this.getData()

  }

  getData() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.requestID,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      if(response && response.results && response.results[7]){
        this.reasonList = response.results[7];
      }
      if(response && response.results && response.results[2] && response.results[2][0] && response.results[2][0].Status){
        let applicationStatus = response.results[2][0].Status;
        if (applicationStatus == 'R') {
          this.Cbox_Disabled = true;
          this.checkBoxSelect = true;
        }
      }
    })
  }

  fetchReasons() {
    this.isVisible = true;
    this.popup = true;
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EntryType: this.tab,
          EUser: this.currentUser.userCode,
          RequestFrom: this.RequestFrom || ''
        }],
      "requestId": "7942",
      "outTblCount": "0"
    }).then((response) => {
      this.reasonsList = response.results[0];
    })
  }

  popOut() {
    if (this.checkBoxArray.length != 0 || this.AllcheckboxArray.length != 0) {
      this.isVisible = false;
    }
    else {
      this.notif.error("You need to select at least one reason or proceed by selecting cancel button", '')
    }

  }

  changed(event, data) {
    let index = this.reasonsList.findIndex(x => x.ID === data.ID)
    if (event.target.checked == true) {
      this.checkBoxArray.push(data)
      this.checkboxSelected[index] = true;

      this.checkedArray.push({ "RejectionReason": { "Reason": data.ID } })
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray);
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
    }
    else {
      this.checkboxSelected[index] = false;
      let msg = this.reasonsList[index].Description;
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1);

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray);
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
    }
  }

  onSaveCheckBoxChanged(event) {
    if (event.target.checked == true) {
      this.checkBoxSelect = true;
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.AllcheckboxArray.push(this.reasonsList[i].Description)
        this.convertedData.push({ "RejectionReason": { "Reason": this.reasonsList[i].ID } })
        this.checkboxSelected[i] = true;
      }
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.convertedData)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
    }
    else {
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.checkboxSelected[i] = false;
      }
      this.checkBoxSelect = false;
      this.AllcheckboxArray.splice(0)
      this.convertedData.splice(0)
    }
  }

  ngAfterViewInit() {
    this.img.setproofs(this.tab);
  }


  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }

  SaveSignature(action) {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to save ?</b>',
      nzOnOk: () => {

        var signatureValid: boolean = false;
        signatureValid = this.ValidateSignature()
        if (signatureValid) {
          if (action == 'savefinalise') {
            signatureValid = this.ValidateSignatureProof()
          }
          else {
            signatureValid = true;
          }
        }
        if (signatureValid) {
          var proof = [];
          proof = this.img.setDataForxml();
          var tandcfulldata: any = [];
          let SignatureRemarks = [];
          SignatureRemarks.push({ "SignatureRemarks": this.ChangeReason });
          tandcfulldata.push({ "SignatureUpdation": SignatureRemarks });
          tandcfulldata.push({ "ApplicableAccounts": this.ChangeAccounts });
          tandcfulldata.push({ "VerificationStatus": this.verificationstatus });
          tandcfulldata.push({ "ProofUpload": proof });
          var tandcdetailsjson = this.utilServ.setJSONMultipleArray(tandcfulldata);
          var tandcDetailsXml = jsonxml(tandcdetailsjson);

          if (action == 'savefinalise') {

            var documents = [];
            documents = this.img.reternImagefinalArray();
            var imageFulldata: any = [];
            imageFulldata.push(documents);
            var documentJson = this.utilServ.setJSONMultipleArray(imageFulldata);
            var documentxmldata = jsonxml(documentJson);
            var documentxml = documentxmldata.replace(/&/gi, '&amp;');
          }

          var save = {
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: this.PANNO,
                EntryType: this.tab,
                ActionType: 'P',
                FileData: tandcDetailsXml.replace(/&/gi, '&amp;'),
                ActionUser: this.currentUser.userCode,
                IDNO: this.IDNO ? this.IDNO : '',
                Rejection: '',
                RiskCountry: '',
                CommunicationAddress: '',
                SMSFlag: '',
                RequestFrom: '',
                RejectReason: ''
              }],
            "requestId": "6010",
            "outTblCount": "0"
          }
          var savefinalysed = {
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: this.PANNO,
                EntryType: this.tab,
                ActionType: 'I',
                FileData: documentxml,
                ActionUser: this.currentUser.userCode,
                IDNO: this.IDNO ? this.IDNO : '',
                Rejection: '',
                RiskCountry: '',
                CommunicationAddress: '',
                SMSFlag: '',
                RequestFrom: '',
                RejectReason: ''
              }],
            "requestId": "6010",
            "outTblCount": "0"
          }
          this.isSpining = true;
          this.dataServ.getResultArray(action == 'save' ? save : savefinalysed).then((response) => {
            this.isSpining = false;
            if (response.errorCode == 0) {
              if (response.results && response.results[0][0]) {
                if (response.results[0][0].errorCode == 0) {

                  this.notif.success(response.results[0][0].errorMessage, '');

                  if (action == 'savefinalise') {
                    this.BackButtonClick();
                    return;
                  }
                  else {
                    this.applicationStatus = 'T';
                    this.cmServ.applicationStatus.next(this.applicationStatus);
                    this.disableFields();
                    this.IDNO = response.results[0][0].requestID;
                    this.modalService.info({
                      nzTitle: '<i>Info</i>',
                      nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                    })
                  }
                  this.cmServ.requestID.next(response.results[0][0].requestID);
                  this.printFlag = true;

                }
                else if (response.results[0][0].errorCode == 1) {

                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else if (response.results[0][0].errorCode == -1) {

                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else {

                  this.notif.error('Error', '');
                }
              }
              else {

                this.notif.error('Error', '');
              }
            }
            else {
              this.notif.error(response.errorMsg, '');
            }
          })
        }


      }
    })
  }

  Approve() {
    if (this.AppRemarks == '' || this.AppRemarks == undefined) {
      this.notif.error("Approval Remarks is required", "");
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to apporve ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO?this.PANNO : '',
              EntryType: this.tab ? this.tab : '',
              ActionType: 'A',
              FileData: '',
              IDNO: this.SerialNumber ? this.SerialNumber : '',
              ActionUser: this.currentUser.userCode ? this.currentUser.userCode : '',
              Rejection: this.AppRemarks ? this.AppRemarks : '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false;
          if (response.errorCode == 0) {
            if (response.results && response.results[0] && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {

                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.Crf.onviewReset();
                this.img.ResetUploads();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false;
              this.notif.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })

      }
    })
  }


  Reject() {
    if (this.RejRemarks == '' || this.RejRemarks == undefined) {
      this.notif.error("Rejection Remarks is required", "");
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO ? this.PANNO : '',
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.SerialNumber ? this.SerialNumber : '',
              ActionUser: this.currentUser.userCode ? this.currentUser.userCode : '',
              Rejection: this.RejRemarks ? this.RejRemarks : '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml ? this.nomineeDetailsxml : ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false;
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {

                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.Crf.onviewReset();
                this.img.ResetUploads();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == 1) {

                this.notif.error(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {

                this.notif.success(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else {

                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false;
              this.notif.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    })
  }


  FillSaveddata() {
    this.IDNO = this.dataforaprove[0].Request_IDNO;
    this.SerialNumber = this.dataforaprove[0].Request_IDNO;
    this.ChangeReason = this.dataforaprove[0].SignatureRemarks ? this.dataforaprove[0].SignatureRemarks : '';

    if (this.applicationStatus == 'A') {
      this.AppRemarks = this.dataforaprove[0].RejectedReason;
    }
    else {
      this.RejRemarks = this.dataforaprove[0].RejectedReason;
    }
    this.disableFields();
  }

  ValidateSignature() {
    if (this.ChangeReason === '') {
      this.notif.error('Please enter Reason/s for change in Signature', '');
      return false;
    }
    else {
      return true;
    }
  }

  ValidateSignatureProof() {
    var documents = [];
    documents = this.img.reternImagefinalArray();
    if (documents && documents.length > 0) {
      if (!documents.find((item: any) => item.ProofDoc.DocName.substring(0, 13) == 'New Signature')) {
        this.notif.error('Please upload New Signature', '');
        return false;
      }
      if (!documents.find((item: any) => item.ProofDoc.DocName.substring(0, 29) == 'Signature change request form')) {
        this.notif.error('Please upload Signature change request form', '');
        return false;
      }
      if (!documents.find((item: any) => item.ProofDoc.DocName.substring(0, 28) == 'Identity proof of the holder')) {
        this.notif.error('Please upload Identity proof of the holder', '');
        return false;
      }
      return true;
    }
    else {
      this.notif.error('No documents uploaded', '')
      return false;
    }

  }

  onBackClick() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {
        this.BackButtonClick();
      }
    })
  }

  disableFields() {
    if ((this.applicationStatus == 'P') || this.applicationStatus == 'T' || this.applicationStatus == 'F' || this.applicationStatus == 'A') {
      this.disableChangeReasonBoolean = true;
    }
  }

  enableFields() {
    if (this.editFlag) {
      this.disableChangeReasonBoolean = false;
    }
    else {
      this.disableFields();
    }
  }

  onValueChange(typed) {
    this.ChangeReason = typed;
  }
}
