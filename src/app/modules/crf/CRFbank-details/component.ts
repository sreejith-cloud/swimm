import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CRFDataService } from '../CRF.service';
import { ValidationService, DataService, UtilService } from 'shared';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { UploadFile } from 'ng-zorro-antd/upload';
import { CrfComponent } from '../crf.component';
import * as  jsonxml from 'jsontoxml'
import { Subscription } from 'rxjs';
import { AuthService } from 'shared';
import { User } from 'shared';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'crf-bank-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CRFBankDetailsComponent implements OnInit {
  inputMasks = InputMasks;
  @Output() isBankFormValid: EventEmitter<any> = new EventEmitter();
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  @Input() tab: string;
  FormControlNames: {} = {};
  showNREdetails: boolean;
  form: FormGroup;
  bankDetails: any = [];
  isAdd: boolean = true;
  isUpdate: boolean = false;
  isvisibledpbnk: boolean = false;
  index: any;
  tradingBankAccType: any;
  dpBankAccType: any;
  debitBankAccType: any;
  ModeOfOperation: any;
  Currency: any;
  fileName: any;
  fileType: any;
  document: any;
  fileList: any = [];
  NREfileList: any = [];
  DPfileList: any = [];
  DirectfileList: any = [];
  bankProofDocument: any
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  NREfileType: string;
  NREfileName: string;
  DPfileType: string;
  DPfileName: string;
  DirectfileType: string;
  DirectfileName: string;
  NREPISletter: any;
  DPBankProof: any;
  DirectDebitBank: any;
  countryArray: any;
  resultArray: any;
  resultArray1: any;
  resultArray2: any;
  BankDeatailsxml: any;
  ChangeAccounts: any = [];
  changeAccountxml: any;
  subscriptions: Subscription[] = [];
  currentUser: User;
  PANNO: any;
  dataforaprove: any = [];
  verificationstatus: any = [];
  pisBankList: any = [];
  IDNO: any;
  isSpining: boolean = false;
  hidRbidetails: boolean = false;
  HO: boolean = false;
  today = new Date();
  SerialNumber: any = 0;
  dsblSave: boolean;
  dsblAproveOrReject: boolean
  saveButtonFlag: boolean;
  approveOrRejectButtonFlag: boolean;
  finalApproveOrRejectButtonFlag: boolean;
  printFlag: boolean = false
  applicationStatus: any;
  requestID: any;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  Remks: any;
  editFlag: boolean = false;
  reasonList: any = [];
  reasonsList: any = [];
  Cbox_Disabled: boolean
  checkedArray: any = [];
  nomineeDetailsxml: any;
  checkBoxSelect: boolean;
  checkboxSelected: any = []
  convertedData: any = [];
  popup: boolean = false;
  checkBoxSelected: boolean;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  isVisible = false;
  RequestFrom: any;

  constructor(
    private fb: FormBuilder,
    private validServ: ValidationService,
    private cmServ: CRFDataService,
    private notif: NzNotificationService,
    private dataServ: DataService,
    private Crf: CrfComponent,
    private utilServ: UtilService,
    private authServ: AuthService,
    private modalService: NzModalService,
  ) {
    this.form = fb.group({
      masterBank: this.createBank(),
      Rejection: this.CreateRejectionForm(),
    });
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      })
    )
    this.cmServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
      this.printFlag = false
    })
    this.cmServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })
    this.cmServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;
      if ((Number(this.verificationstatus.NREClnt) == 0)) {
        this.hidRbidetails = true
        this.SetValidationRbi()
      }
      else {
        this.hidRbidetails = false;
        this.SetValidationRbi()
      }
    })

    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })
    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
    })

    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item

      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
        this.cmServ.DataForAprooval.subscribe(item => {
          this.dataforaprove = item;
        })
      }
      if (this.applicationStatus == 'F' || this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
        this.Remks = 'Rejection Remarks'
      }
      else {
        this.Remks = 'Remarks'
      }
    })
    this.cmServ.requestID.subscribe(item => {
      this.requestID = item
    })
    this.cmServ.approvelRemarks.subscribe((data) => {
      this.approvelRemarks = data
    })
    this.cmServ.rejectionRemarks.subscribe((data) => {
      this.rejectionRemarks = data
    })
  }
  ngOnInit() {
    this.cmServ.isNRE.subscribe(val => {
      this.showNREdetails = val
    })

    var branch = this.dataServ.branch;
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true;
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: '',
          EUser: ''
        }],
      "requestId": "6022",
      "outTblCount": "0"
    }).then((response) => {

      if (response.results.length > 0) {
        this.tradingBankAccType = response.results[1]
        // this.dpBankAccType = response.results[4]
        // this.debitBankAccType = response.results[5]
        this.ModeOfOperation = response.results[0]
        this.pisBankList = response.results[6]
        // this.Currency = response.results[7]
        this.countryArray = response.results[9]
      }


    });
    let mBank: any = this.form.controls.masterBank

    mBank.controls.BankAddoption.patchValue("1");
    mBank.controls.country.valueChanges.subscribe(val => {
      if (val == null) {
        return
      }
      let data = val.toUpperCase();
      this.resultArray = this.countryArray.filter(ele => {
        return (ele["Country"].includes(data) || ele["Code"].includes(data))
      })
    })
    if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
      this.FillApproveData();
    }
    this.RequestFrom = sessionStorage.getItem("key")
    this.getData()
  }
  fetchReasons() {

    this.isVisible = true;
    this.popup = true
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
      this.reasonList = response.results[7];

      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      let Rejremarks: any = this.form.controls.Rejection
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }

    })
  }
  popOut() {
    if (this.checkBoxArray.length != 0 || this.AllcheckboxArray.length != 0) {
      this.isVisible = false
      // this.checkBoxSelected = true
      // this.Cbox_Disabled = true
    }
    else {
      this.notif.error("You need to select at least one reason or proceed by selecting cancel button", '')
    }

  }

  changed(event, data) {
    let index = this.reasonsList.findIndex(x => x.ID === data.ID)
    if (event.target.checked == true) {
      this.checkBoxArray.push(data)
      this.checkboxSelected[index] = true

      this.checkedArray.push({ "RejectionReason": { "Reason": data.ID } })
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('checked', this.nomineeDetailsxml);
    }
    else {
      this.checkboxSelected[index] = false
      let msg = this.reasonsList[index].Description
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1)

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('Unchecked', this.nomineeDetailsxml);
    }
  }


  onSaveCheckBoxChanged(event) {
    if (event.target.checked == true) {
      this.checkBoxSelect = true
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.AllcheckboxArray.push(this.reasonsList[i].Description)
        this.convertedData.push({ "RejectionReason": { "Reason": this.reasonsList[i].ID } })
        this.checkboxSelected[i] = true
      }
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.convertedData)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('array selected', this.nomineeDetailsxml)
    }
    else {
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.checkboxSelected[i] = false
      }
      this.checkBoxSelect = false
      this.AllcheckboxArray.splice(0)
      this.convertedData.splice(0)
    }
  }
  private createBank() {
    return this.fb.group({
      // bank: [null, [Validators.required]],
      clntname: [null, [Validators.required]],
      bankAcType: [null, [Validators.required]],
      modeOfOperation: [null],
      ifscCode: [null, [Validators.required]],
      bankname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      micr: [null],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pin: [null, [Validators.required]],
      accntNumber: [null, [Validators.required]],
      confrmAccntNumber: [null, [Validators.required]],
      oft: [null],
      rbirefNo: [null],
      rbiapprvldt: [null],
      BankAddoption: [null],
      pisBank: [null]
    })
  }
  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList = [file];
      this.fileType = file.type;
      this.fileName = file.name
      this.encodeImageFileAsURL(file, 'Bank');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  encodeImageFileAsURL(file, type: string) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      if (type == "Bank") {
        this.bankProofDocument = {
          bankDocname: 'Trading bank proof',
          bankDoctype: this.fileType,
          bankDocuid: file.uid,
          bankDocsize: file.size,
          bankDocdoc: document,
        }
      }
      if (type == "NRE") {
        this.NREPISletter = {
          nreDocname: 'NRE PIS letter',
          nreDoctype: this.NREfileType,
          nreDocuid: file.uid,
          nreDocsize: file.size,
          nreDocdoc: document,
        }
      }
      if (type == "DP") {
        this.DPBankProof = {
          DPDocname: 'DP bank proof',
          DPDoctype: this.DPfileType,
          DPDocuid: file.uid,
          DPDocsize: file.size,
          DPDocdoc: document,
        }
      }
      if (type == "Direct") {
        this.DirectDebitBank = {
          DirectDocname: "Direct bank proof",
          DirectDoctype: this.DirectfileType,
          DirectDocuid: file.uid,
          DirectDocsize: file.size,
          DirectDocdoc: document,
        }
      }
    }
    reader.readAsDataURL(file);
  }
  showModal(data) {
    this.filePreiewContent = data.bankDocdoc
    this.filePreiewFilename = data.bankDocname
    this.filePreiewContentType = data.bankDoctype
    this.filePreiewVisible = true;
  }

  DPshowModal() {
    this.filePreiewContent = this.DPBankProof["DPDocdoc"]
    this.filePreiewFilename = this.DPBankProof["DPDocname"]
    this.filePreiewContentType = this.DPBankProof["DPDoctype"]
    this.filePreiewVisible = true;
  }
  DirectshowModal() {
    this.filePreiewContent = this.DirectDebitBank.DirectDocdoc
    this.filePreiewFilename = this.DirectDebitBank.DirectDocname
    this.filePreiewContentType = this.DirectDebitBank.DirectDoctype
    this.filePreiewVisible = true;
  }
  showNREModal(data) {
    this.filePreiewContent = data.nreDocdoc
    this.filePreiewFilename = data.nreDocname
    this.filePreiewContentType = data.nreDoctype
    this.filePreiewVisible = true;
  }


  reset() {
    let form: any = this.form.controls.masterBank;
    form.reset();
    this.fileList = []
  }

  getIfscdetails(data) {
    if (data == null) {
      return
    }
    if (data.length != 11) {
      return
    }
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Ifc: data
        }],
      "requestId": "5069",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining = false
      if (response.results) {
        let data = response.results[0][0]

        let form: any = this.form.controls.masterBank
        form.controls.bankname.setValue(data.BANK_NAME);
        form.controls.address.setValue(data.ADDRESS);
        form.controls.micr.setValue(data.MICR);
        form.controls.state.setValue(data.STATE);
        form.controls.city.setValue(data.BRANCH_NAME);
        form.controls.country.setValue(data.COUNTRY);
        form.controls.pin.setValue(data.Pincode);
        form.controls.oft.setValue(data.oft ? 'Y' : 'N');
      }
    })
  }
  getDPbnkIfscdetails(data) {
    if (data == null) {
      return
    }
    if (data.length != 11) {
      return
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Ifc: data,
        }],
      "requestId": "5069",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        let data = response.results[0][0]
        let form: any = this.form.controls.DpBank
        form.controls.dpBankname.setValue(data.BANK_NAME);
        form.controls.dpBankAddress.setValue(data.ADDRESS);
        form.controls.dpBankMicr.setValue(data.MICR);
        form.controls.dpBankState.setValue(data.STATE);
        form.controls.dpBankCity.setValue(data.BRANCH_NAME);
      }
    })
  }
  checkAcNumbers(accOne, accTwo) {
    if (accOne == accTwo)
      return true
    else
      return false
  }
  getNREIfscdetails(data) {
    if (data == null) {
      return
    }
    if (data.length != 11) {
      return
    }

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Ifc: data,
        }],
      "requestId": "5069",
      "outTblCount": "0"
    }).then((response) => {

      if (response.results) {
        let data = response.results[0][0]
        if (data.BANK_NAME == "IDBI BANK LTD" || data.BANK_NAME == "AXIS BANK LTD") {
          let form: any = this.form.controls.NREdirectDebitBank
          form.controls.drbnkbankname.setValue(data.BANK_NAME);
          form.controls.drbnkaddress.setValue(data.ADDRESS);
          form.controls.drbnkmicr.setValue(data.MICR);
          form.controls.drbnkstate.setValue(data.STATE);
          form.controls.drbnkcity.setValue(data.BRANCH_NAME);
        }
        else {
          let form: any = this.form.controls.NREdirectDebitBank
          this.notif.error('You can choose AXIS/IDBI Bank', '')
          form.controls.drbnkbankname.setValue(null);
          form.controls.drbnkaddress.setValue(null);
          form.controls.drbnkmicr.setValue(null);
          form.controls.drbnkstate.setValue(null);
          form.controls.drbnkcity.setValue(null);
        }
      }
    })
  }
  viewdpbank(chk) {
    if (chk == true) {
      this.isvisibledpbnk = false;
    }
    else {
      this.isvisibledpbnk = true;
    }
  }
  SaveBank(action) {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to save ?</b>',
      nzOnOk: () => {
        if ((Number(this.verificationstatus.NREClnt) != 0) && (this.form.controls.masterBank.value.BankAddoption == 0)) {
          this.hidRbidetails = false
          this.SetValidationRbi()
        }
        else {
          this.hidRbidetails = true;
          this.SetValidationRbi()
        }
        let isValid = this.validServ.validateForm(this.form.controls.masterBank, this.FormControlNames);
        if (isValid) {
          let accnoValid = this.CheckAccountNumber()
          if (accnoValid) {
            let proofvalid
            if (action == 'savefinalise') {
              proofvalid = this.ValidatebankProof()
            } else {
              proofvalid = true
            }
            if (proofvalid) {
              var data: any = []
              data.push(this.form.controls.masterBank.value);
              data[0].address = data[0].address ? data[0].address : ''
              var BankDeatailsxml = jsonxml(data);
              var proof = []
              proof = this.img.setDataForxml();
              var bankfulldata: any = []
              bankfulldata.push({ "BankDetails": BankDeatailsxml });
              bankfulldata.push({ "ApplicableAccounts": this.ChangeAccounts });
              bankfulldata.push({ "ProofUpload": proof })
              bankfulldata.push({ "VerificationStatus": this.verificationstatus });
              var bankdetailsjson = this.utilServ.setJSONMultipleArray(bankfulldata);
              var BankDetailsXml = jsonxml(bankdetailsjson)

              if (action == 'savefinalise') {

                var documents = [];
                documents = this.img.reternImagefinalArray()
                let appFormReceived: boolean = false
                if (documents && documents.length > 0) {
                  documents.forEach(item => {
                    if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
                      appFormReceived = true
                    }
                  })
                  if (!appFormReceived) {
                    this.notif.error('Application form not uploaded', '')
                    return
                  }
                  else {
                    var documentJson = this.utilServ.setJSONMultipleArray(documents)
                    var documentxmldata = jsonxml(documentJson)
                    var documentxml = documentxmldata.replace(/&/gi, '&amp;')
                  }
                }
                else {
                  this.notif.error('No documents uploaded', '')
                  return
                }
              }

              var save = {
                "batchStatus": "false",
                "detailArray":
                  [{
                    Pan: this.PANNO,
                    EntryType: this.tab,
                    ActionType: 'P',
                    FileData: BankDetailsXml.replace(/&/gi, '&amp;'),
                    ActionUser: this.currentUser.userCode,
                    IDNO: this.requestID ? this.requestID : '',
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
                    IDNO: this.requestID,
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
                this.isSpining = false
                if (response.errorCode == 0) {
                  if (response.results && response.results[0][0]) {
                    if (response.results[0][0].errorCode == 0) {

                      this.notif.success(response.results[0][0].errorMessage, '');

                      if (action == 'savefinalise') {
                        this.BackButtonClick()
                        return
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
                      this.cmServ.requestID.next(response.results[0][0].requestID)
                      this.printFlag = true
                      // this.Crf.edittabtitle = "";
                      // this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                      // this.Crf.onviewReset();
                      // this.img.ResetUploads();
                    }
                    else if (response.results[0][0].errorCode == 1) {
                      this.isSpining = false
                      this.notif.error(response.results[0][0].errorMessage, '');
                    }
                    else if (response.results[0][0].errorCode == -1) {
                      this.isSpining = false
                      this.notif.error(response.results[0][0].errorMessage, '');
                    }
                    else {
                      this.isSpining = false
                      this.notif.error('Error', '');
                    }
                  }
                  else {
                    this.isSpining = false
                    this.notif.error('Error', '');
                  }
                }
                else {
                  this.isSpining = false
                  this.notif.error(response.errorMsg, '');
                }
              })
              // console.log("Pan No", this.PANNO);
              // console.log("Pan ", this.currentUser.userCode);
              // console.log("Operation", this.tab);
              // this.notif.success('Bank Details Updated Successfully', '');
              // this.Crf.edittabtitle="";
              // this.Crf.activeTabIndex=this.Crf.activeTabIndex-1;
              // this.Crf.onviewReset();
            }
          }
        }
      }
    })
  }
  onBackClick() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {

        this.BackButtonClick()
      }
    })
  }
  ngAfterViewInit() {
    this.img.setproofs(this.tab)
  }

  ValidatebankProof() {
    var CRFForm: boolean = false;
    var Bakdoc: boolean = false;

    var proofarray = this.img.SupportFiles;
    // if (!proofarray.length) {
    //   this.notif.error("No proof Uploaded", '');
    //   return
    // }
    var notlisted: any = [];
    var mandatproofs = this.img.Mandatoryproofs;

    mandatproofs.forEach(element => {
      Bakdoc = false
      proofarray.forEach(item => {
        if (element.Document == item.Docname || element.Document == item.DocName) {
          Bakdoc = true;
          return
        }
      })
      if (!Bakdoc) {
        notlisted.push(Number(element["slno"]))
      }
    });
    if (notlisted.length > 0) {
      this.notif.error('Please Upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
      return false
    }
    else {
      return true;
    }
    // proofarray.forEach(item => {
    //   if (this.isRejected) {
    //     item.Docname = Number(item.DocName)
    //   }
    //   if (item.Docname == 1) {
    //     CRFForm = true
    //   }
    //   if (item.Docname == 6) {
    //     Bakdoc = true
    //   }

    // })
    // if (!CRFForm) {
    //   this.notif.error(" Please Upload CRF Form", '');
    //   return false;
    // }
    // if (!Bakdoc) {
    //   this.notif.error("Please Upload A Document to verify Your Account", '');
    //   return false;
    // }
    // return true;
  }
  FillApproveData() {
    let mBank: any = this.form.controls.masterBank
    var dataforapproval = this.dataforaprove[0];
    this.IDNO = dataforapproval.Request_IDNO;
    this.SerialNumber = dataforapproval.Request_IDNO;
    let rejection: any = this.form.controls.Rejection;

    mBank.controls.clntname.setValue(dataforapproval.clntname);
    mBank.controls.clntname.setValue(dataforapproval.clntname);
    mBank.controls.bankAcType.setValue(dataforapproval.BankActype);
    mBank.controls.modeOfOperation.setValue(dataforapproval.ModeofOperation);
    mBank.controls.ifscCode.setValue(dataforapproval.IFSC);
    mBank.controls.address.setValue(dataforapproval.BranchAddr1);
    mBank.controls.micr.setValue(dataforapproval.MICRNO);
    mBank.controls.rbirefNo.setValue(dataforapproval.RBIrefNo);
    mBank.controls.rbiapprvldt.setValue(dataforapproval.RBIApprovalDate);
    mBank.controls.pin.setValue(dataforapproval.BankPin);
    mBank.controls.accntNumber.setValue(dataforapproval.BankAc);
    // mBank.controls.confrmAccntNumber.setValue(dataforapproval.BankAc);
    mBank.controls.oft.setValue(dataforapproval.OFT);
    mBank.controls.BankAddoption.setValue(dataforapproval.BankAddoption.toString());
    mBank.controls.bankname.setValue(dataforapproval.BankName);
    mBank.controls.country.setValue(dataforapproval.country);
    mBank.controls.state.setValue(dataforapproval.State);
    mBank.controls.city.setValue(dataforapproval.city);
    mBank.controls.pisBank.setValue(dataforapproval.pisBank);
    if (this.applicationStatus == 'A') {
      rejection.controls.AppRemarks.setValue(dataforapproval.RejectedReason)
    }
    else {
      rejection.controls.RejRemarks.setValue(dataforapproval.RejectedReason || '')
    }
    this.disableFields();
  }

  disableFields() {
    let mBank: any = this.form.controls.masterBank
    if ((this.applicationStatus == 'P') || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
      debugger
      mBank.controls.clntname.disable();
      mBank.controls.clntname.disable();
      mBank.controls.bankAcType.disable();
      mBank.controls.modeOfOperation.disable();
      mBank.controls.ifscCode.disable();
      mBank.controls.address.disable();
      mBank.controls.micr.disable();
      mBank.controls.rbirefNo.disable();
      mBank.controls.rbiapprvldt.disable();
      mBank.controls.pin.disable();
      mBank.controls.accntNumber.disable();
      mBank.controls.oft.disable();
      mBank.controls.BankAddoption.disable();
      mBank.controls.bankname.disable();
      mBank.controls.country.disable();
      mBank.controls.state.disable();
      mBank.controls.city.disable();
      mBank.controls.pisBank.disable();
    }
  }
  enableFields() {
    let mBank: any = this.form.controls.masterBank
    if (this.editFlag) {
      mBank.controls.clntname.enable();
      mBank.controls.clntname.enable();
      mBank.controls.bankAcType.enable();
      mBank.controls.modeOfOperation.enable();
      mBank.controls.ifscCode.enable();
      mBank.controls.address.enable();
      mBank.controls.micr.enable();
      mBank.controls.rbirefNo.enable();
      mBank.controls.rbiapprvldt.enable();
      mBank.controls.pin.enable();
      mBank.controls.accntNumber.enable();
      mBank.controls.oft.enable();
      mBank.controls.BankAddoption.enable();
      mBank.controls.bankname.enable();
      mBank.controls.country.enable();
      mBank.controls.state.enable();
      mBank.controls.city.enable();
      mBank.controls.pisBank.enable();

    }
    else {
      this.disableFields();
    }
  }
  Approve() {
    var acccheck = this.CheckAccountNumber()
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    if (acccheck) {
      if (Remarks) {
        let reason: any = this.form.controls.Rejection.value.AppRemarks;
        this.modalService.confirm({
          nzTitle: '<i>Confirmation</i>',
          nzContent: 'Are you sure you want to approve with Remark <br>"<b><i>' + reason + '"</i>?</b>',
          nzOnOk: () => {
            this.isSpining = true;
            this.dataServ.getResultArray({
              "batchStatus": "false",
              "detailArray":
                [{
                  Pan: this.PANNO,
                  EntryType: this.tab,
                  ActionType: 'A',
                  FileData: '',
                  IDNO: this.requestID,
                  ActionUser: this.currentUser.userCode,
                  Rejection: reason ? reason : '',
                  RiskCountry: '',
                  CommunicationAddress: '',
                  SMSFlag: '',
                  RequestFrom: '',
                  RejectReason: ''
                }],
              "requestId": "6010",
              "outTblCount": "0"
            }).then((response) => {

              if (response.errorCode == 0) {
                if (response.results && response.results[0][0]) {
                  if (response.results[0][0].errorCode == 0) {
                    this.isSpining = false
                    this.notif.success(response.results[0][0].errorMessage, '');
                    this.Crf.edittabtitle = "";
                    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                    this.Crf.onviewReset();
                    this.img.ResetUploads();
                  }
                  else if (response.results[0][0].errorCode == 1) {
                    this.isSpining = false
                    this.notif.error(response.results[0][0].errorMessage, '');
                  }
                  else if (response.results[0][0].errorCode == -1) {
                    this.isSpining = false
                    this.notif.error(response.results[0][0].errorMessage, '');
                  }
                  else {
                    this.isSpining = false
                    this.notif.error('Error', '');
                  }

                }
                else {
                  this.isSpining = false
                  this.notif.error('Error', '');
                }
              }
              else {
                this.isSpining = false;
                this.notif.error(response.errorMsg, '');
              }
            })
          }
        });
      }
      else {
        this.notif.error('Approval remark is required', '')
        return
      }
    }
  }
  Reject() {
    let Remarks = this.form.controls.Rejection.value.RejRemarks ? true : false
    // if (Remarks) {
    // if (this.checkedArray.length != 0 || this.convertedData.length !== 0) {
    let reason: any = this.form.controls.Rejection.value.RejRemarks
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to reject ?',
      nzOnOk: () => {

        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.requestID,
              ActionUser: this.currentUser.userCode,
              Rejection: reason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.Crf.onviewReset();
                this.img.ResetUploads();
                this.Crf.onviewReset();
                this.BackButtonClick();

              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
                this.Crf.onviewReset();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.onviewReset();
                this.BackButtonClick();
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
                this.Crf.onviewReset();
              }
            }
            else {
              this.isSpining = false
              this.notif.error('Error', '');
              this.Crf.onviewReset();
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    });
    // }
    // else {
    //   this.notif.error('Rejection reason is required, Please select any', '')
    //   return
    // }
    // }
    // else {
    //   this.notif.error('Rejection remarks is required', '')
    // }
  }
  CreateRejectionForm() {
    return this.fb.group({
      AppRemarks: [null],
      RejRemarks: [null]
    })
  }
  CheckAccountNumber() {

    let accnmber: any = this.form.controls.masterBank
    accnmber.controls.accntNumber
    if (accnmber.controls.confrmAccntNumber.value != accnmber.controls.accntNumber.value) {
      this.notif.error('Account number missmatch', '')
      accnmber.controls.confrmAccntNumber.dirty;
      return false;
    }
    return true;

  }
  charrestrict(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9,/ -()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }
  charrestrictAll(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }

  SetValidationRbi() {

    let mBank: any = this.form.controls.masterBank
    if (!this.hidRbidetails) {
      mBank.controls["rbirefNo"].setValidators(Validators.required);
      mBank.controls["pisBank"].setValidators(Validators.required);
      mBank.controls["rbiapprvldt"].setValidators(Validators.required);
      mBank.controls["rbiapprvldt"].updateValueAndValidity();
      mBank.controls["rbirefNo"].updateValueAndValidity();
      mBank.controls["pisBank"].updateValueAndValidity();
    }
    else {
      mBank.controls["rbirefNo"].setValidators(null);
      mBank.controls["pisBank"].setValidators(null);
      mBank.controls["rbiapprvldt"].setValidators(null);
      mBank.controls["rbiapprvldt"].updateValueAndValidity();
      mBank.controls["rbirefNo"].updateValueAndValidity();
      mBank.controls["pisBank"].updateValueAndValidity();
    }

  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  CheckCountryvalid(val) {

    let mBank: any = this.form.controls.masterBank
    var value = val.target.value

    var ind = this.resultArray.findIndex(item => item.Country == value)
    if (ind == -1) {
      mBank.controls["country"].setValue(null)
    }

  }
  PrintForm(req) {
    this.isSpining = true;
    let requestParams = {

      "batchStatus": "false",
      "detailArray": [{
        "PanNo": this.PANNO,
        "SlNo": this.requestID,
        "EUser": "",
        "Type": this.tab,
        "BarcodeID": this.requestID,
        "Flag": 1
      }],
      "requestId": "7050",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false;
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
      this.isSpining = false;
      this.notif.error("Server encountered an Error", '');
    });
  }
  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }
  BranchReject() {
    let Remarks = this.form.controls.Rejection.value.RejRemarks ? true : false
    if (Remarks) {
      let reason: any = this.form.controls.Rejection.value.RejRemarks;
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure want to reject ?</b>',
        nzOnOk: () => {

          this.isSpining = true;
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: this.PANNO,
                EntryType: this.tab,
                ActionType: 'R',
                FileData: '',
                IDNO: this.requestID,
                ActionUser: this.currentUser.userCode,
                Rejection: "Branch reject-" + reason,
                RiskCountry: '',
                CommunicationAddress: '',
                SMSFlag: '',
                RequestFrom: '',
                RejectReason: ''
              }],
            "requestId": "6010",
            "outTblCount": "0"
          }).then((response) => {
            if (response.errorCode == 0) {
              if (response.results && response.results[0][0]) {
                if (response.results[0][0].errorCode == 0) {
                  this.isSpining = false
                  this.notif.success(response.results[0][0].errorMessage, '');
                  this.Crf.edittabtitle = "";
                  this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                  this.Crf.onviewReset();
                  this.img.ResetUploads();
                }
                else if (response.results[0][0].errorCode == 1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else if (response.results[0][0].errorCode == -1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else {
                  this.isSpining = false
                  this.notif.error('Error', '');
                }
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false;
              this.notif.error(response.errorMsg, '');
            }
          })
        }
      });
    }
    else {
      this.notif.error('Rejection remark is required', '')
      return
    }
  }

  initialApprove() {
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    //if (Remarks) {
    let reason: any = this.form.controls.Rejection.value.AppRemarks;
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to to proceed First level approvel ?</b>',
      nzOnOk: () => {
        if ((Number(this.verificationstatus.NREClnt) != 0) && (this.form.controls.masterBank.value.BankAddoption == 0)) {
          this.hidRbidetails = false
          this.SetValidationRbi()
        }
        else {
          this.hidRbidetails = true;
          this.SetValidationRbi()
        }
        let isValid = this.validServ.validateForm(this.form.controls.masterBank, this.FormControlNames);
        if (isValid) {
          let accnoValid = this.CheckAccountNumber()
          if (accnoValid) {

            var data: any = []
            data.push(this.form.controls.masterBank.value);
            data[0].address = data[0].address ? data[0].address : ''
            var BankDeatailsxml = jsonxml(data);
            var proof = []
            proof = this.img.setDataForxml();
            var bankfulldata: any = []
            bankfulldata.push({ "BankDetails": BankDeatailsxml });
            // bankfulldata.push({ "ApplicableAccounts": this.ChangeAccounts });
            //bankfulldata.push({ "ProofUpload": proof })
            // bankfulldata.push({ "VerificationStatus": this.verificationstatus });
            var bankdetailsjson = this.utilServ.setJSONMultipleArray(bankfulldata);
            var BankDetailsXml = jsonxml(bankdetailsjson)

            var approvel = {
              "batchStatus": "false",
              "detailArray":
                [{
                  Pan: this.PANNO,
                  EntryType: this.tab,
                  ActionType: 'F',
                  FileData: BankDetailsXml.replace(/&/gi, '&amp;'),
                  ActionUser: this.currentUser.userCode,
                  IDNO: this.requestID,
                  Rejection: reason ? reason : '',
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
            this.dataServ.getResultArray(approvel).then((response) => {
              this.isSpining = false
              if (response.errorCode == 0) {
                if (response.results && response.results[0][0]) {
                  if (response.results[0][0].errorCode == 0) {
                    this.notif.success(response.results[0][0].errorMessage, '');
                    this.BackButtonClick();
                    this.Crf.onviewReset();
                    return
                  }
                  else if (response.results[0][0].errorCode == 1) {
                    this.isSpining = false
                    this.notif.error(response.results[0][0].errorMessage, '');
                  }
                  else if (response.results[0][0].errorCode == -1) {
                    this.isSpining = false
                    this.notif.error(response.results[0][0].errorMessage, '');
                  }
                  else {
                    this.isSpining = false
                    this.notif.error('Error', '');
                  }
                }
                else {
                  this.isSpining = false
                  this.notif.error('Error', '');
                }
              }
              else {
                this.isSpining = false
                this.notif.error(response.errorMsg, '');
              }
            })
          }
        }
      }
    })
    // }
    // else {
    //   this.notif.error('Approval remark is required', '')
    //   return
    // }
  }
  editButton() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.notif.success("Editing enabled..!", '');
        this.enableFields();

      }

    });
  }
}
