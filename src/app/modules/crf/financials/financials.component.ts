
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupName } from '@angular/forms';
import { CrfComponent } from '../crf.component';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { UtilService, DataService, AuthService, ValidationService } from 'shared';
import { InputMasks } from 'shared';
import { User } from 'shared/shared';
import { CRFDataService } from '../CRF.service';
import * as  jsonxml from 'jsontoxml'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CRFValidationMessages } from '../CRFValidationMessages'
import { CrfipvComponent } from '../crfipv/crfipv.component';
@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.less']
})
export class FinancialsComponent implements OnInit {
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  @Input() tab: string;
  @ViewChild(CrfipvComponent) ipv: CrfipvComponent
  form: FormGroup;
  pepSourceArray: any = [];
  annualIncomeSourceArray: any = [];
  inputmask = InputMasks;
  currentUser: User;
  PANNO: any;
  ChangeAccounts: any;
  verificationstatus: any;
  ValidationMessages = CRFValidationMessages.Financials;
  today = new Date();
  FormControlNames: {} = {};
  networthasvalue: any = true;
  dataforaprove: any = []
  HO: boolean = false;
  SerialNumber: any = 0
  Remarks: any;
  printFlag: boolean = false
  saveButtonFlag: boolean;
  approveOrRejectButtonFlag: boolean;
  finalApproveOrRejectButtonFlag: boolean;
  isSpining: boolean = false
  applicationStatus: any;
  sourceoffund: any = [];
  isvisibleprof_busi: boolean = false;
  isvisiblebusi: boolean = false;
  isotherSource: boolean = false;
  Remks: any;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  pepStatus: any;
  isOccuVisible: boolean = true;
  derivativeStatus: boolean;
  occupationArray: any;
  isOccupdetails: boolean = true;
  finStat: boolean = false;
  showWindow: boolean = true;
  editFlag: boolean = false;
  // minDate= { year: 2021, month: 4, day: 1 }
  reasonList: any = [];
  reasonsList: any = [];
  Cbox_Disabled: boolean;
  checkedArray: any = [];
  nomineeDetailsxml: any = [];
  checkBoxSelect: boolean;
  requestID: any;
  convertedData: any = [];
  allcheckedArray: any = [];
  popup: boolean = false;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkboxSelected: any = [];
  isVisible = false;
  RequestFrom: any;

  ipvHeading: any = 'IPV/Financial Updation';
  ipvXmlData: any;

  constructor(private fb: FormBuilder,
    private Crf: CrfComponent,
    private modal: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private crfServ: CRFDataService,
    private notif: NzNotificationService,
    private validServ: ValidationService,
  ) {
    this.form = this.fb.group({
      pep: [null, [Validators.required]],
      anualIncome: [null],
      networth: [null],
      networthasondate: [null],
      RejRemarks: [null],
      AppRemarks: [null],
      sourceOfFund: [null],
      prof_busi: [null],
      typeOfBusiActivity: [null],
      otherfunds: [null],
      derivativeProof: [null],
      occupationType: [null],
      organisation: [null],
      designation: [null],
      nameofemployer: [null],
      officeaddress1: [null],
      officeaddress2: [null],
      officeaddress3: [null],
      offpin: [null],
      phone: [null],
      email: [null],
      mobile: [null],
      skipFin: [null]
    })

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    })
    this.crfServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
      this.printFlag = false

    })
    this.crfServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })

    this.crfServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;
      if (this.verificationstatus.FinStatus) {
        debugger
        this.finStat == true;
      }
      else {
        this.finStat = false;
      }
    })
    this.crfServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })
    this.crfServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.crfServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
    })
    this.crfServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })
    this.crfServ.pepStatus.subscribe(item => {
      this.pepStatus = item
    })
    this.crfServ.approvelRemarks.subscribe((data) => {
      this.approvelRemarks = data
    })
    this.crfServ.rejectionRemarks.subscribe((data) => {
      this.rejectionRemarks = data
    })

    this.crfServ.derivativeStatus.subscribe(item => {
      this.derivativeStatus = item
    })
    this.crfServ.requestID.subscribe(item => {
      this.requestID = item
    })
  }
  ngOnInit() {
    // this.disablepastdate()
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {

      this.HO = true
    }

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: "",
          EUser: ""
        }],
      "requestId": "6022",
      "outTblCount": "0"
    }).then((response) => {
      if (this.applicationStatus == 'T' || this.applicationStatus == 'P' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
        this.FillSaveddata();
      }

      if (response.results && response.results.length > 0) {
        if (response.results[10]) {
          this.pepSourceArray = response.results[10]
        }
        if (response.results[11]) {
          this.annualIncomeSourceArray = response.results[11]
        }
        if (response.results[12]) {
          this.sourceoffund = response.results[12]
        }
        if (response.results[13]) {
          this.occupationArray = response.results[13]
        }
      }
    })

    this.form.controls.sourceOfFund.valueChanges.subscribe(val => {
      this.form.controls.prof_busi.patchValue(null)
      this.form.controls.typeOfBusiActivity.patchValue(null)
      this.form.controls.otherfunds.patchValue(null)
    })

    this.form.controls.networth.setValue(0)
    if (this.applicationStatus == 'T' || this.applicationStatus == 'P' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
      this.crfServ.DataForAprooval.subscribe(item => {
        this.dataforaprove = item;
        // if (this.tab == 'Financials') {
        //   // this.FillSaveddata();
        // }
      })
    }
    if (this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
      this.Remks = 'Rejection Remarks'
    }
    else {
      this.Remks = 'Remarks'
    }

    if (this.pepStatus && Number(this.pepStatus) > 0) {
      this.isOccuVisible = false;
      if (this.applicationStatus == '' || this.applicationStatus == undefined) {
        this.form.controls.pep.setValue(Number(this.pepStatus))
        // this.form.controls.pep.disable();
      }
    }
    else if (this.applicationStatus == '' || this.applicationStatus == undefined) {
      this.form.controls.pep.setValue(0)
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
      this.reasonList = response && response.results[7] ? response.results[7] : [];

      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      if (this.applicationStatus == 'R') {
        this.form.controls.RejRemarks.disable();


      }

    })
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
    }
    else {
      this.checkboxSelected[index] = false
      let msg = this.reasonsList[index].Description
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1)

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
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
  ngAfterViewInit() {
    if (this.tab == 'Financials') {
      this.img.setproofs(this.tab)
    }
  }
  onBackClick() {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {

        this.BackButtonClick()
      }
    })
  }

  Save(action) {
    if (action == 'save') {
      var valid = this.ValidateFianancialForm()
    }
    else {
      valid = true
    }
    if (valid) {
      var proof = []
      proof = this.img.setDataForxml();
      // IPV
      let ipvValid = true
      if (action == 'savefinalise') {
        ipvValid = this.validServ.validateForm(this.ipv.form.controls.crfIPV, this.FormControlNames)
        if (ipvValid) {
          let ipvdata: any = []
          let ipvtotalData = { ...this.ipv.form.controls.crfIPV.value }
          ipvdata.push(ipvtotalData)
          this.ipvXmlData = jsonxml(ipvdata);
        }
      }
      var fullData = [];
      fullData.push({ "Financialdata": this.form.value })
      fullData.push({ "ProofUpload": proof })
      fullData.push({ "ApplicableAccounts": this.ChangeAccounts });
      fullData.push({ "VerificationStatus": this.verificationstatus });
      fullData.push({ "ipvData": this.ipvXmlData ? this.ipvXmlData : '' });
      var financialFull = this.utilServ.setJSONMultipleArray(fullData)
      var financialfullxml = jsonxml(financialFull).replace(/&/gi, '&amp;')
      if (action == 'savefinalise') {
        var documents = [];
        documents = this.img.reternImagefinalArray()
        let appFormReceived: boolean = false
        let devFormReceived: boolean = false
        if (documents && documents.length > 0) {
          documents.forEach(item => {
            if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
              appFormReceived = true
            }
            else {
              devFormReceived = true
            }
          })
          if (this.derivativeStatus) {
            if (!devFormReceived) {
              this.notif.error('Derivative clients must upload atleast one proof', '')
              return
            }
          }
          if (!appFormReceived) {
            this.notif.error('Application form not uploaded', '')
            return
          }
          else {
            var imageFulldata: any = []
            imageFulldata.push(documents)
            imageFulldata.push({ "ipvData": this.ipvXmlData ? this.ipvXmlData : '' });
            var documentJson = this.utilServ.setJSONMultipleArray(imageFulldata)
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
            FileData: financialfullxml,
            ActionUser: this.currentUser.userCode,
            IDNO: this.SerialNumber ? this.SerialNumber : '',
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
            IDNO: this.SerialNumber,
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
      this.modal.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure you want to save ?</b>',
        nzOnOk: () => {
          this.isSpining = true
          this.dataServ.getResultArray(action == 'save' ? save : savefinalysed).then((response) => {
            this.isSpining = false
            if (response.errorCode == 0) {
              if (response.results && response.results[0][0]) {
                if (response.results[0][0].errorCode == 0) {
                  this.notif.success(response.results[0][0].errorMessage, '');
                  if (action == 'savefinalise') {
                    this.BackButtonClick();
                    return
                  }
                  else {
                    if(this.applicationStatus ==='R')
                      this.ipv.enableEmp()
                    this.applicationStatus = 'T';
                    this.crfServ.applicationStatus.next(this.applicationStatus);
                    this.modal.info({
                      nzTitle: '<i>Info</i>',
                      nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                    })
                  }
                  this.SerialNumber = response.results[0][0].requestID
                  this.printFlag = true
                  // this.Crf.edittabtitle = "";
                  // this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                  // this.Crf.onviewReset();
                  // this.img.ResetUploads();
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
      })
    }
  }
  Approve() {
    if (this.form.controls.AppRemarks.value == '' || this.form.controls.AppRemarks.value == undefined) {
      this.notif.error("Approval Remarks is required", "")
      return
    }
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to apporve ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'A',
              FileData: '',
              IDNO: this.SerialNumber,
              ActionUser: this.currentUser.userCode,
              Rejection: this.form.controls.AppRemarks.value,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
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
    })
  }
  Reject() {
    if (this.form.controls.RejRemarks.value == '' || this.form.controls.RejRemarks.value == undefined) {
      // this.notif.error("Rejection Remarks is required", "")
      // return
    }
    // if (this.checkedArray.length != 0 || this.convertedData.length != 0) {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.SerialNumber,
              ActionUser: this.currentUser.userCode,
              Rejection: this.form.controls.RejRemarks.value,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false
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
    })
    // }
    // else {
    //   this.notif.error('Rejection reason is required, Please select any', '')
    // }
  }
  ValidateFianancialForm() {
    debugger
    if (this.form.controls.skipFin.value) {
      if (this.verificationstatus.FinStatus == false) {
        this.notif.error('Financial details are mandatory', '')
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (this.form.controls.pep.value == null) {
        this.notif.error('Please select pep', '')
        this.form.controls['pep'].markAsTouched()
        return false
      }
      if (this.form.controls.anualIncome.value == null && this.form.controls.networth.value == 0) {
        this.notif.error('Please select Annual Income or fill networth', '')
        return false
      }
      if (this.form.controls.networth.value != 0 && this.form.controls.networthasondate.value == null) {
        this.notif.error('Please select networth as on date', '')
        return false
      }
      if (this.form.controls.sourceOfFund.value == null || this.form.controls.sourceOfFund.value == '') {
        this.notif.error('Please Choose the Source of fund', '')
        this.form.controls['sourceOfFund'].markAsTouched()
        return false
      }
      if (this.isvisibleprof_busi) {
        if (!this.form.controls.prof_busi.value) {
          this.notif.error("Please Enter Professional/Business name", '', { nzDuration: 60000 })
          return false
        }
      }
      if (this.isvisiblebusi) {
        if (!this.form.controls.typeOfBusiActivity.value) {
          this.notif.error("Please Enter Type of business activity", '', { nzDuration: 60000 })
          return false
        }
      }
      if (this.isotherSource) {
        if (!this.form.controls.otherfunds.value) {
          this.notif.error("Please specify the source of fund", '', { nzDuration: 60000 })
          return false
        }
      }
      if (this.isOccuVisible) {
        if (this.form.controls.occupationType.value == null || this.form.controls.occupationType.value == '' ||
          this.form.controls.occupationType.value == undefined) {
          this.notif.error('Please choose Occupation', '')
          return false
        }
        if (this.isOccupdetails) {
          if (this.form.controls.designation.value == null || this.form.controls.designation.value == '' ||
            this.form.controls.designation.value == undefined) {
            this.notif.error('Please enter designation', '')
            return false
          }
          if (this.form.controls.officeaddress1.value == null || this.form.controls.officeaddress1.value == '' ||
            this.form.controls.officeaddress1.value == undefined) {
            this.notif.error('Please enter Office address', '')
            return false
          }
        }
        if (this.derivativeStatus) {
          if (this.form.controls.derivativeProof.value == null || this.form.controls.derivativeProof.value == '' ||
            this.form.controls.derivativeProof.value == undefined) {
            this.notif.error('Please choose derivative proof', '')
            return false
          }
        }
      }
      if (this.form.controls.email && this.form.controls.email.value && this.form.controls.email.value.length > 0) {
        var emailValid: boolean = false
        emailValid = this.ValidateEmail(this.form.controls.email.value)
        if (!emailValid) {
          this.notif.error('Please enter a valid email', '');
          return false
        }
      }

      return true
    }
  }
  // disabledFutureDate = (current: Date): boolean => {
  //   // Can not select days before today and today

  //   return differenceInCalendarDays(current, this.today) > 0;
  // };
  NetworthChange(data) {

    var value = data.target.value
    if (value == null || value == 0 || value == undefined) {
      this.networthasvalue = true
      this.form.controls.networthasondate.setValue(null)
      this.form.controls.networth.setValue(0);
    }
    else {
      this.networthasvalue = false
    }
  }
  FillSaveddata() {
    this.SerialNumber = this.dataforaprove[0].Request_IDNO
    this.form.controls.pep.setValue(this.dataforaprove[0].PEPStatus)
    this.form.controls.anualIncome.setValue(this.dataforaprove[0].AnnualIncome)
    this.form.controls.networth.setValue(this.dataforaprove[0].Networth == 0 ? '' : this.dataforaprove[0].Networth)
    this.form.controls.networthasondate.setValue(this.dataforaprove[0].NetworthAsOn)
    this.form.controls.sourceOfFund.setValue(this.dataforaprove[0].sourceOfFund)
    this.form.controls.occupationType.setValue(this.dataforaprove[0].Occupation)
    this.form.controls.organisation.setValue(this.dataforaprove[0].NameOfOrganisation)
    this.form.controls.designation.setValue(this.dataforaprove[0].Designation)
    this.form.controls.nameofemployer.setValue(this.dataforaprove[0].NameOfEmployer)
    this.form.controls.officeaddress1.setValue(this.dataforaprove[0].EmployerAdd1)
    this.form.controls.officeaddress2.setValue(this.dataforaprove[0].EmployerAdd2)
    this.form.controls.officeaddress3.setValue(this.dataforaprove[0].EmployerAdd3)
    this.form.controls.offpin.setValue(this.dataforaprove[0].EmployerPin1)
    this.form.controls.phone.setValue(this.dataforaprove[0].EmployerTele1)
    this.form.controls.email.setValue(this.dataforaprove[0].EmployerEmail)
    this.form.controls.mobile.setValue(this.dataforaprove[0].EmployerMobile)
    this.form.controls.derivativeProof.setValue(this.dataforaprove[0].derivativeSegment_proofDoc)

    if (this.applicationStatus == 'A') {
      this.form.controls.AppRemarks.setValue(this.dataforaprove[0].RejectedReason)
    }
    else {
      this.form.controls.RejRemarks.setValue(this.dataforaprove[0].RejectedReason || '')
    }
    // else if (this.applicationStatus == 'R') {
    //   this.form.controls.RejRemarks.setValue(this.dataforaprove[0].RejectedReason || '')
    // }

    if (this.dataforaprove[0].derivativeSegment_proofDoc && this.dataforaprove[0].derivativeSegment_proofDoc.length > 0) {
      this.crfServ.derivativeStatus.next(true)
    }
    else {
      this.crfServ.derivativeStatus.next(false)
    }
    this.disableFields();
    setTimeout(() => {
      this.showinput(this.dataforaprove[0].sourceOfFund)
      this.form.controls.prof_busi.setValue(this.dataforaprove[0].prof_busi)
      this.form.controls.typeOfBusiActivity.setValue(this.dataforaprove[0].typeOfBusiActivity)
      this.form.controls.otherfunds.setValue(this.dataforaprove[0].otherfunds)
      this.showOccupation(this.dataforaprove[0].Occupation)
    }, 3000);
    this.fillIPVData();
  }

  fillIPVData() {
    let addressretrieve = this.dataforaprove[0];
    let ipvDoneBy = addressretrieve ? addressretrieve.IPVDoneBy : ''
    let ipvDoneOn = addressretrieve ? addressretrieve.IPVDoneOn : ''
    if (this.tab == 'Financials') {
      this.ipv.setIPVDetails(ipvDoneBy,ipvDoneOn, this.applicationStatus)
      // this.Remarks = this.dataforaprove[0].RejectedReason
    }
  }

  PrintForm() {
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [{
        "PanNo": this.PANNO,
        "SlNo": this.SerialNumber,
        "EUser": "",
        "Type": this.tab,
        "BarcodeID": this.SerialNumber,
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
  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }
  BranchReject() {
    if (this.form.controls.RejRemarks.value == '' || this.form.controls.RejRemarks.value == undefined) {
      this.notif.error("Rejection Remarks is required", "")
      return
    }
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.SerialNumber,
              ActionUser: this.currentUser.userCode,
              Rejection: "Branch rejected" + this.form.controls.RejRemarks.value,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
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
              this.notif.error('Error', '');
            }
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    })
  }
  showinput(data) {
    let datafund = this.sourceoffund;
    datafund.forEach(element => {
      if (element.Fund == data) {
        this.isvisibleprof_busi = element.Prof_Busi
        this.isvisiblebusi = element.BusAct
      }
      if (data == 'Others') {
        this.isotherSource = true;
      }
      else {
        this.isotherSource = false;
      }
    });
  }

  showOccupation(data) {
    if (data == 'AGRICULTURALIST' || data == 'HOUSEWIFE' || data == 'RETIRED') {
      this.isOccupdetails = false;
      this.form.controls.organisation.setValue('');
      this.form.controls.designation.setValue('');
      this.form.controls.nameofemployer.setValue('');
      this.form.controls.officeaddress1.setValue('');
      this.form.controls.officeaddress2.setValue('');
      this.form.controls.officeaddress3.setValue('');
      this.form.controls.offpin.setValue('');
      this.form.controls.phone.setValue('');
      this.form.controls.email.setValue('');
      this.form.controls.mobile.setValue('');
    }
    else {
      this.isOccupdetails = true;
    }
  }

  charrestrict(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9 .,/()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }

  disableFields() {
    debugger
    if ((this.applicationStatus == 'P') || this.applicationStatus == 'T' || this.applicationStatus == 'F' || this.applicationStatus == 'A') {
      this.form.controls.pep.disable();
      this.form.controls.anualIncome.disable();
      this.form.controls.networth.disable();
      this.form.controls.networthasondate.disable();
      this.form.controls.sourceOfFund.disable();
      this.form.controls.prof_busi.disable();
      this.form.controls.typeOfBusiActivity.disable();
      this.form.controls.otherfunds.disable();
      this.form.controls.occupationType.disable();
      this.form.controls.organisation.disable();
      this.form.controls.designation.disable();
      this.form.controls.nameofemployer.disable();
      this.form.controls.officeaddress1.disable();
      this.form.controls.officeaddress2.disable();
      this.form.controls.officeaddress3.disable();
      this.form.controls.offpin.disable();
      this.form.controls.phone.disable();
      this.form.controls.email.disable();
      this.form.controls.mobile.disable();
      this.form.controls.derivativeProof.disable();
    }
  }
  enableFields() {
    if (this.editFlag) {
      this.form.controls.pep.enable();
      this.form.controls.anualIncome.enable();
      this.form.controls.networth.enable();
      this.form.controls.networthasondate.enable();
      this.form.controls.sourceOfFund.enable();
      this.form.controls.prof_busi.enable();
      this.form.controls.typeOfBusiActivity.enable();
      this.form.controls.otherfunds.enable();
      this.form.controls.occupationType.enable();
      this.form.controls.organisation.enable();
      this.form.controls.designation.enable();
      this.form.controls.nameofemployer.enable();
      this.form.controls.officeaddress1.enable();
      this.form.controls.officeaddress2.enable();
      this.form.controls.officeaddress3.enable();
      this.form.controls.offpin.enable();
      this.form.controls.phone.enable();
      this.form.controls.email.enable();
      this.form.controls.mobile.enable();
      this.form.controls.derivativeProof.enable();
    }
    else {
      this.disableFields();
    }
  }

  // disabledFinDate = (current: Date): boolean => {
  //   return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.dataServ.finEndtdate) > 0)
  // };
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    var startdate = new Date(this.today)
    var enddate = new Date(this.today)
    startdate.setFullYear(this.today.getFullYear() - 1);

    console.log("start", differenceInCalendarDays(startdate, current) + "date" + current + "to " + startdate);
    console.log("end", differenceInCalendarDays(enddate, current) + "date" + enddate + "to " + current);


    return differenceInCalendarDays(current, startdate) <= -1
      || differenceInCalendarDays(current, enddate) >= 1;
  };
  // disabledPastDate = (current: Date): boolean => {
  //   // Can not select days before today and today

  //   return differenceInCalendarDays(current, this.today) < 0;
  // };


  ValidateEmail(data) {
    var mailvalidpattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    var emailvalid = mailvalidpattern.test(data)
    if (!emailvalid) {
      return false;
    }
    else {
      return true
    }
  }

  showFin(data) {
    debugger
    if (data) {
      this.showWindow = false;
    }
    else {
      this.showWindow = true;
    }
  }

  initialApprove() {
    // if (this.form.controls.AppRemarks.value == '' || this.form.controls.AppRemarks.value == undefined) {
    //   this.notif.error("Approval Remarks is required", "")
    //   return
    // }
    var valid = this.ValidateFianancialForm()
    //if (valid) {
    var proof = []
    proof = this.img.setDataForxml();
    var fullData = [];
    fullData.push({ "Financialdata": this.form.value })
    var financialFull = this.utilServ.setJSONMultipleArray(fullData)
    var financialfullxml = jsonxml(financialFull).replace(/&/gi, '&amp;')

    var approve = {
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.PANNO,
          EntryType: this.tab,
          ActionType: 'F',
          FileData: financialfullxml,
          ActionUser: this.currentUser.userCode,
          IDNO: this.SerialNumber,
          Rejection: this.form.controls.AppRemarks.value,
          RiskCountry: '',
          CommunicationAddress: '',
          SMSFlag: '',
          RequestFrom: '',
          RejectReason: ''

        }],
      "requestId": "6010",
      "outTblCount": "0"
    }

    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to save ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray(approve).then((response) => {
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
    })
    // }
    // else {
    //   this.notif.error('Approval remark is required', '')
    //   return
    // }
  }
  editButton() {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.notif.success("Editing enabled..!", '');
        this.enableFields();

      }

    });
  }
  disablepastdate() {
    debugger
    console.log(this.today);
    console.log(this.today.getMonth());
    var today = new Date()

    if (today.getMonth() === 0) {
      return false;
    }

  }
}
