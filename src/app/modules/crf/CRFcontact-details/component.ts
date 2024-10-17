import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService, UtilService, DataService } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import { CRFDataService } from '../CRF.service';
import * as  jsonxml from 'jsontoxml'
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { CrfComponent } from '../crf.component';
import { AuthService, User } from 'shared';
import { Subscription } from 'rxjs';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { CrfipvComponent } from '../crfipv/crfipv.component';

@Component({
  selector: 'crf-contact-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CRFContactDetailsComponent implements OnInit {
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  @ViewChild(CrfipvComponent) ipv: CrfipvComponent
  inputMasks = InputMasks;
  InputPatterns = InputPatterns
  form: FormGroup;
  // @ViewChild(IPVComponent) IPVComponent:IPVComponent
  @Input() tab: string;
  FormControlNames: any = {};
  addressAndIpvData: any;
  relationArray: any;
  subscriptions: Subscription[] = [];
  currentUser: User;
  PANNO: any;
  ContactUpdate: any;
  ChangeAccounts: any[] = [];
  ContactXml: any;
  dataforaprove: any = [];
  verificationstatus: any = [];
  CountrycodeArray: any = [];
  Maxlen1: any = 10;
  Minlen1: any = 10;
  Maxlen2: any = 10;
  Minlen2: any = 10;
  IDNO: any = '';
  isSpining: boolean = false
  HO: boolean = false;
  Additional: boolean = true;
  telCountry: any;
  mob2Country: any;
  mob1Country: any;
  ContMob1: boolean;
  ContMob2: boolean;
  ContEmail1: boolean;
  ContEmail2: boolean;
  SerialNumber: any = 0
  saveButtonFlag: boolean;
  approveOrRejectButtonFlag: boolean;
  finalApproveOrRejectButtonFlag: boolean;
  printFlag: boolean = false
  applicationReceived: boolean;
  applicationStatus: any;
  requestID: any
  clientData: any;
  NRI: any
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  OverseasCountry: any;
  Remks: any;
  ipvXmlData: any;
  editFlag: boolean= false;
  reasonList: any = [];
  reasonsList: any = [];
  checkedArray: any = [];
  nomineeDetailsxml: any;
  checkBoxSelect: boolean;
  Cbox_Disabled: boolean = false;
  convertedData: any = [];
  popup: boolean = false;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkboxSelected: any = [];
  isVisible = false;
  RequestFrom: any;

  emailVerifiedStatus: boolean;
  mobileVerifiedStatus: boolean;
  emailOrMobileVerifiedStatus: boolean = true;
  isSwitchDisabled: boolean;
  emailOrMobileUsedStatus: boolean;

  constructor(
    private validServ: ValidationService,
    private fb: FormBuilder,
    private utilServ: UtilService,
    private dataServ: DataService,
    private cmServ: CRFDataService,
    private notif: NzNotificationService,
    private Crf: CrfComponent,
    private authServ: AuthService,
    private modalService: NzModalService,
  ) {
    this.form = fb.group({
      telephoneOff: [null],
      telephoneRes: [null],
      fax: [null],
      smsFacility: [null],
      mobile: [null],
      relation: [null],
      existingClient: [null],
      existingPan: [null],
      additionalMblNo: [null],
      relation1: [null],
      existingClient1: [null],
      existingPan1: [null],
      email: [null, [Validators.minLength(5)]],
      relation2: [null],
      existingClient2: [null],
      existingPan2: [null],
      addEmail: [null],
      relation3: [null],
      existingClient3: [null],
      existingPan3: [null],
      stdCodeOffice: [null],
      telephoneOffice: [null],
      telephoneResidence: [null],
      stdCodeResidence: [null],
      countryCodeResidence: [null],
      countryCodeOffice: [null],
      isdCodeMobile: [null],
      isdCodeAdditionMobile: [null],
      isdCodeOverseas: [null],
      OverseasMobile: [null],
      requestMode: [null],
      Rejection: this.CreateRejectionForm()

      // dateOfDeclaration:[null,[Validators.required]],
      // placeOfDeclaration:[null,[Validators.required]]
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
      this.isOrdinary(items)
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
      if (this.applicationStatus == 'F' ||  this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
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

      if (response.results) {
        this.relationArray = response.results[4]
        this.CountrycodeArray = response.results[5]
        var form = this.form.controls
        if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
          this.filldataforapproval();
        }
        else {
          form.isdCodeMobile.setValue('091')
          form.isdCodeAdditionMobile.setValue('091')
          form.countryCodeResidence.setValue('091')
          form.countryCodeOffice.setValue('091')
          form.smsFacility.setValue(true)

          this.mob1Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == "091")].CountryName;
          this.mob2Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == "091")].CountryName;
          this.telCountry = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == "091")].CountryName;
        }
      }
    })


    var branch = this.dataServ.branch;
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true
    }
    this.form.controls.requestMode.setValue('Physical')
    this.getData()
    this.CheckSMSAvailable()
  }
  // isAddressAndIpvDeclarationValid(){
  //   let isIpvValid=this.validServ.validateForm(this.form,this.FormControlNames)
  //   if(isIpvValid){
  //     let declaration = this.validServ.validateForm(this.form,this.FormControlNames);
  //     if(declaration){
  //       let data: any = []
  //       let totalData = { ...this.form.value,...this.form.value}
  //       data.push(totalData)
  //       var JSONData = this.utilServ.setJSONArray(data);
  //       this.addressAndIpvData = jsonxml(JSONData);
  //       return true
  //      }
  //      return false
  //   }
  //   return false
  // }
  verifyEmailOrMobile() {
    return new Promise<boolean>((resolve, reject) => {


      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            PAN: this.PANNO,
            Mobile: this.form.value.mobile || '',
            Email: this.form.value.email || '',
            EntryType: '',
            Flag: 'Y'
          }],
        "requestId": "800217",
        "outTblCount": "0"
      }).then((response: any) => {
        if (response && response.errorCode == 0) {
          this.mobileVerifiedStatus = response.results[0] && response.results[0][0] ? response.results[0][0].MobileVerifiedStatus : false;
          this.emailVerifiedStatus = response.results[1] && response.results[1][0] ? response.results[1][0].EmailVerifiedStatus : false;
          // console.log(this.mobileVerifiedStatus,'mob>>>',this.emailVerifiedStatus,'<<<em status')
          this.emailOrMobileUsedStatus = this.getEmailOrMobUsedStatus(response);
          console.log(this.emailOrMobileUsedStatus,'email mob used status')

          let errorMessage = response.results[2] && response.results[2][0] && response.results[2][0].errorCode != 0 ? response.results[2][0].errorMessage : 'Something Went Wrong! Please Try Again.'
          if ((this.mobileVerifiedStatus)  && (this.emailOrMobileUsedStatus)) {
            // console.log('inside<<<>>>>>>>>>>>>>>>>>>>')
            this.emailOrMobileVerifiedStatus = true;
            resolve(true)
          }
          if ((this.emailVerifiedStatus) && (this.emailOrMobileUsedStatus)){
            this.emailOrMobileVerifiedStatus = true;
            resolve(true)
          }
          else {
            if (!this.emailOrMobileUsedStatus) {
              this.modalService.error({
                nzTitle: 'Save Failed',
                nzContent: errorMessage
              });
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
            if (!this.mobileVerifiedStatus && this.form.value.mobile) {
              console.log("mobile");
              this.modalService.error({
                nzTitle: 'Warning',
                nzContent: 'Mobile Verification pending. Please Verify.'
              });
              this.form.patchValue({
                mobile: ''
              })
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
            if (!this.emailVerifiedStatus && this.form.value.email) {
              console.log("email");
              this.modalService.error({
                nzTitle: 'Warning',
                nzContent: 'Email Verification pending. Please Verify.'
              });
              this.form.patchValue({
                email: ''
              })
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
          }
          resolve(this.emailOrMobileVerifiedStatus);
        }
        else {
          resolve(false);
        }
      }, (err) => {
        resolve(false)
      })
    })
  }

  getEmailOrMobUsedStatus(response: any){
    if (response.results[2] && response.results[2][0] && response.results[2][0].errorMessage === 'T'){
      return true;
    }
    else if (response.results[2] && response.results[2][0].errorMessage != 'T' && (this.form.value.mobile || this.form.value.email)){
      return false;
    }
    else if (this.mobileVerifiedStatus && !(this.form.value.mobile)){
      return true;
    }
    else if (this.emailVerifiedStatus && !(this.form.value.email)){
      return true;
    }else{
      return false;
    }
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
      debugger
      console.log(response);
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



  AddressAndIpvDeclaratioTempSave() {
    // let isIpvValid=this.validServ.validateForm(this.IPVComponent.form,this.FormControlNames)
    // if(isIpvValid){
    //   let declaration = this.validServ.validateForm(this.form,this.FormControlNames);
    //   if(declaration){
    let data: any = []
    // let totalData = { ...this.form.value,...this.IPVComponent.form.value}
    let totalData = { ...this.form.value }
    data.push(totalData)
    var JSONData = this.utilServ.setJSONArray(data);
    this.addressAndIpvData = jsonxml(JSONData);
    //       return true
    //      }
    //      return false
    //   }
    //   return false
  }
  SaveContactDetails(option) {
    debugger
    this.verifyEmailOrMobile().then((response: any) => {
      if (response) {
        this.modalService.confirm({
          nzTitle: '<i>Confirmation</i>',
          nzContent: '<b>Are you sure want to save ?</b>',
          nzOnOk: () => {
            // this.notif.success('Contact Updated Successfully', '');
            // this.Crf.edittabtitle='';
            // this.Crf.activeTabIndex=this.Crf.activeTabIndex-1;
            // this.Crf.onviewReset();

            var contactvalid: boolean = false;
            if (this.tab == "Mobile") {
              contactvalid = this.ValidateMobile()
              if (contactvalid) {
                if (option == 'savefinalise') {
                  contactvalid = this.ValidateMobileProof()
                }
                else {
                  contactvalid = true
                }
              }
            }
            if (this.tab == "Email") {
              let emailvalid = this.ValidateEmail()
              if (emailvalid) {
                if (option == 'savefinalise') {
                  contactvalid = this.ValidateEmailProof()
                } else {
                  contactvalid = true
                }
              }
            }
            if (this.tab == "Telephone") {
              contactvalid = this.ValidateTelephoneProof(option)
            }
            if (contactvalid) {
              let data: any = []
              let totalData = { ...this.form.value }
              data.push(totalData)
              var ContactUpdate = jsonxml(data);
              let ipvValid = true
              if (this.tab == "Email" || this.tab == "Mobile") {
                if (option == 'savefinalise') {
                  ipvValid = this.validServ.validateForm(this.ipv.form.controls.crfIPV, this.FormControlNames)
                  if (ipvValid) {
                    let ipvdata: any = []
                    let ipvtotalData = { ...this.ipv.form.controls.crfIPV.value }
                    ipvdata.push(ipvtotalData)
                    this.ipvXmlData = jsonxml(ipvdata);
                  }
                }
              }
              if (ipvValid) {
                var proof = []
                proof = this.img.setDataForxml();

                if (option == 'savefinalise') {
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

                var ContactFulldata: any = []
                ContactFulldata.push({ "ChangeInContact": ContactUpdate })
                ContactFulldata.push({ "ApplicableAccounts": this.ChangeAccounts })
                ContactFulldata.push({ "ProofUpload": proof })
                ContactFulldata.push({ "VerificationStatus": this.verificationstatus });
                ContactFulldata.push({ "ipvData": this.ipvXmlData });

                var contactjson = this.utilServ.setJSONMultipleArray(ContactFulldata);
                this.ContactXml = jsonxml(contactjson)

                var savefinalysed = {
                  "batchStatus": "false",
                  "detailArray":
                    [{
                      Pan: this.PANNO,
                      EntryType: this.tab,
                      ActionType: 'I',
                      FileData: documentxml,
                      ActionUser: this.currentUser.userCode,
                      IDNO: this.IDNO,
                      Rejection: '',
                      RiskCountry: '',
                      CommunicationAddress: '',
                      SMSFlag: ''
                    }],
                  "requestId": "6010",
                  "outTblCount": "0"
                }

                var save = {
                  "batchStatus": "false",
                  "detailArray":
                    [{
                      Pan: this.PANNO,
                      EntryType: this.tab,
                      ActionType: 'P',
                      FileData: this.ContactXml,
                      ActionUser: this.currentUser.userCode,
                      IDNO: this.IDNO ? this.IDNO : '',
                      Rejection: '',
                      RiskCountry: '',
                      CommunicationAddress: '',
                      SMSFlag: ''
                    }],
                  "requestId": "6010",
                  "outTblCount": "0"
                }
                this.isSpining = true
                this.dataServ.getResultArray(option == 'save' ? save : savefinalysed).then((response) => {
                  this.isSpining = false
                  if (response.errorCode == 0) {

                    if (response.results && response.results[0][0]) {
                      if (response.results[0][0].errorCode == 0) {
                        this.notif.success(response.results[0][0].errorMessage, '');
                        if (option == 'savefinalise') {
                          this.BackButtonClick()
                          return
                        }
                        else {
                          this.applicationStatus = 'T';
                          this.cmServ.applicationStatus.next(this.applicationStatus);
                          this.disableFields(this.tab)
                          this.IDNO = response.results[0][0].requestID;
                          this.modalService.info({
                            nzTitle: '<i>Info</i>',
                            nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                          })
                        }
                        this.cmServ.requestID.next(response.results[0][0].requestID)

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
                // console.log("Pan",this.PANNO);
                // console.log("Current user", this.currentUser.userCode);
                // console.log("Operation",this.tab);
              }
            }
          }
        })
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
  ValidateEmailProof() {
    var Email: boolean = false;
    var notlisted: any = [];
    var proofarray = this.img.SupportFiles;
    // if (!proofarray.length) {
    //   this.notif.error("No proof Uploaded", '');
    //   return
    // }

    var mandatproofs = this.img.Mandatoryproofs;

    mandatproofs.forEach(element => {
      Email = false
      proofarray.forEach(item => {
        if (element.Document == item.Docname || element.Document == item.DocName) {
          Email = true;
          return
        }
      })
      if (!Email) {
        if (this.ContEmail1 || this.form.controls.relation2.value != undefined) {
          if (this.form.controls.relation2.value == 'Self' ||
            this.form.controls.relation2.value == undefined ||
            this.form.controls.relation2.value == '') {
            if (element["slno"] != 8) {
              notlisted.push(Number(element["slno"]))
            }
          }
          else {
            notlisted.push(Number(element["slno"]))
          }

        }
        // else {
        //   notlisted.push(Number(element["slno"]))
        // }
      }
    });

    if (notlisted.length > 0) {
      this.notif.error('Please upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
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
    //     crfForm = true
    //   }
    //   if (item.Docname == 8) {
    //     EmailDec = true
    //   }
    // })
    // if (!crfForm) {
    //   this.notif.error(" Please Upload crfForm", '');
    //   return false;
    // }
    // if (this.ContEmail1) {
    //   if(!EmailDec)
    //   {
    //   this.notif.error("Please Upload Email Decleration", '');
    //   return false;
    //   }
    // }


  }
  ValidateMobileProof() {

    var Mobile: boolean = false;
    var notlisted: any = [];
    var proofarray = this.img.SupportFiles;
    var mandatproofs = this.img.Mandatoryproofs;
    // if (!proofarray.length) {
    //   this.notif.error("No proof Uploaded", '');
    //   return
    // }
    mandatproofs.forEach(element => {
      Mobile = false
      proofarray.forEach(item => {
        if (element.Document == item.Docname || element.Document == item.DocName) {
          Mobile = true;
          return
        }
      })
      if (!Mobile) {
        if (this.ContMob1 || this.form.controls.relation.value != undefined) {
          if (this.form.controls.relation.value == 'Self' ||
            this.form.controls.relation.value == undefined ||
            this.form.controls.relation.value == '') {
            if (element["slno"] != 7) {
              notlisted.push(Number(element["slno"]))
            }
          }
          else {
            notlisted.push(Number(element["slno"]))
          }

        }
        // else {
        //   notlisted.push(Number(element["slno"]))
        // }
      }
    });
    if (notlisted.length > 0) {
      this.notif.error('Please upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
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
    //     crfForm = true
    //   }
    //   if (item.Docname == 7) {
    //     Mobile = true
    //   }
    // })
    // if (!crfForm) {
    //   this.notif.error(" Please Upload crfForm", '');
    //   return false;
    // }
    // if (this.ContMob1) {
    //   if(!Mobile)
    //   {
    //   this.notif.error("Please Upload Mobile decleration", '');
    //   return false;
    //   }
    // }

  }
  filldataforapproval() {
    var contactData = this.dataforaprove[0];
    this.IDNO = contactData.Request_IDNO;
    this.SerialNumber = contactData.Request_IDNO;
    this.applicationReceived = contactData.ApplicationReceived;
    this.img.applicationReceived = contactData.ApplicationReceived;

    // this.img.retrieveData=this.dataforaprove[1];
    var form = this.form.controls
    let rejection: any = this.form.controls.Rejection;
    if (this.tab == "Email") {
      // disable fields begin
      this.disableFields('Email')
      // disable fields end

      form.email.setValue(contactData.Email)
      form.relation2.setValue(contactData.relation2)
      form.existingClient2.setValue(contactData.existingClient2)
      form.existingPan2.setValue(contactData.existingPan2)
      form.addEmail.setValue(contactData.addEmail)
      form.relation3.setValue(contactData.relation3)
      form.existingClient3.setValue(contactData.existingClient3)
      form.existingPan3.setValue(contactData.existingPan3)
      form.requestMode.setValue(contactData.requestMode)

      // form.isdCodeMobile.setValue(contactData.isdCodeMobile)
      // form.isdCodeAdditionMobile.setValue(contactData.isdCodeAdditionMobile)
    }
    if (this.tab == "Mobile") {


      // disable fields begin
      this.disableFields('Mobile')
      // disable fields end
      form.telephoneOff.setValue(contactData.OffPhone1)
      form.telephoneRes.setValue(contactData.ResPhone1)
      form.fax.setValue(contactData.fax)
      // form.smsFacility.setValue(contactData.SMSRequired)
      form.isdCodeMobile.setValue(contactData.isdCodeMobile)

      form.smsFacility.setValue(contactData.SMSRequired == "false" ? false : true)
      form.mobile.setValue(contactData.Mobilephone)
      form.relation.setValue(contactData.relation)
      form.existingClient.setValue(contactData.existingClient)
      form.existingPan.setValue(contactData.existingPan)
      form.additionalMblNo.setValue(contactData.additionalMblNo)
      form.relation1.setValue(contactData.relation1)
      form.existingClient1.setValue(contactData.existingClient1)
      form.existingPan1.setValue(contactData.existingPan1)
      form.isdCodeOverseas.setValue(contactData.isdCodeOverseas)
      form.OverseasMobile.setValue(contactData.OverseasMobile)
      form.isdCodeAdditionMobile.patchValue(contactData.isdCodeAdditionMobile)
      form.requestMode.setValue(contactData.requestMode)
      this.mob1Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == contactData.isdCodeMobile)].CountryName;
      this.mob2Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == contactData.isdCodeAdditionMobile)].CountryName;
      if (contactData.isdCodeOverseas != '') {
        this.OverseasCountry = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == contactData.isdCodeOverseas)].CountryName;
      }
    }
    if (this.tab == 'Telephone') {
      this.disableFields('Telephone')
      form.stdCodeOffice.setValue(contactData.stdCodeOffice)
      form.telephoneOffice.setValue(contactData.telephoneOffice)
      form.telephoneResidence.setValue(contactData.telephoneResidence)
      form.stdCodeResidence.setValue(contactData.stdCodeResidence)
      form.countryCodeResidence.setValue(contactData.countryCodeResidence);
      this.telCountry = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == contactData.countryCodeResidence)].CountryName;
      rejection.controls.RejRemarks.setValue(contactData.RejectedReason);
    }
    if (this.applicationStatus == 'A') {
      rejection.controls.AppRemarks.setValue(contactData.RejectedReason)
    }
    else {
      rejection.controls.RejRemarks.setValue(contactData.RejectedReason || '');
    }
    if (this.tab == 'Mobile' || this.tab == "Email") {
      this.ipv.setIPVDetails(contactData.IPVDoneBy, contactData.IPVDoneOn, this.applicationStatus)
    }

  }

  disableFields(type) {

    if ((this.applicationStatus == 'P') || this.applicationStatus == 'F' || this.applicationStatus == 'T' || this.applicationStatus == 'A') {
      var form = this.form.controls

      if (type == 'Email') {
        form.email.disable()
        form.relation2.disable()
        form.existingClient2.disable()
        form.existingPan2.disable()
        form.addEmail.disable()
        form.relation3.disable()
        form.existingClient3.disable()
        form.existingPan3.disable()
        form.requestMode.disable()
      }
      if (type == 'Mobile') {
        if ((this.applicationStatus == 'P') || this.applicationStatus == 'F' || this.applicationStatus == 'T' || this.applicationStatus == 'A') {
          form.telephoneOff.disable()
          form.telephoneRes.disable()
          form.fax.disable()
          form.smsFacility.disable()
          form.mobile.disable()
          form.relation.disable()
          form.existingClient.disable()
          form.existingPan.disable()
          form.additionalMblNo.disable()
          form.relation1.disable()
          form.existingClient1.disable()
          form.existingPan1.disable()
          form.isdCodeMobile.disable()
          form.isdCodeAdditionMobile.disable()
          form.isdCodeOverseas.disable()
          form.OverseasMobile.disable()
          form.requestMode.disable()
        }
      }
      if (type == 'Telephone') {
        if ((this.applicationStatus == 'P') || this.applicationStatus == 'F' || this.applicationStatus == 'T' || this.applicationStatus == 'A') {
          form.stdCodeOffice.disable();
          form.telephoneOffice.disable();
          form.telephoneResidence.disable();
          form.stdCodeResidence.disable();
          form.countryCodeResidence.disable();
          form.countryCodeOffice.disable();
        }
      }
    }
  }
  enableFields(type) {
    let mBank: any = this.form.controls.masterBank
    if (this.editFlag) {
      var form = this.form.controls
      if (type == 'Email') {
        form.email.enable()
        form.relation2.enable()
        form.existingClient2.enable()
        form.existingPan2.enable()
        form.addEmail.enable()
        form.relation3.enable()
        form.existingClient3.enable()
        form.existingPan3.enable()
        form.requestMode.enable()
      }
      if (type == 'Mobile') {
          form.telephoneOff.enable()
          form.telephoneRes.enable()
          form.fax.enable()
          form.smsFacility.enable()
          form.mobile.enable()
          form.relation.enable()
          form.existingClient.enable()
          form.existingPan.enable()
          form.additionalMblNo.enable()
          form.relation1.enable()
          form.existingClient1.enable()
          form.existingPan1.enable()
          form.isdCodeMobile.enable()
          form.isdCodeAdditionMobile.enable()
          form.isdCodeOverseas.enable()
          form.OverseasMobile.enable()
          form.requestMode.enable()
      }
      if (type == 'Telephone') {
          form.stdCodeOffice.enable();
          form.telephoneOffice.enable();
          form.telephoneResidence.enable();
          form.stdCodeResidence.enable();
          form.countryCodeResidence.enable();
          form.countryCodeOffice.enable();
      }

    }
    else{
      this.disableFields(type);
    }
  }
  ValidateTelephoneProof(option) {
    var crfForm: boolean = false;
    var Telephone: boolean = false;
    var notlisted: any = [];
    var proofarray = this.img.SupportFiles;
    if (!this.form.controls.stdCodeResidence.value) {
      this.notif.error('Std code required', '')
      this.form.controls.stdCodeResidence.markAsTouched;;
      return false;
    }
    if (!this.form.controls.telephoneResidence.value) {
      this.notif.error('Telephone required', '')
      this.form.controls.stdCodeResidence.touched;

      return false;
    }
    var mandatproofs = this.img.Mandatoryproofs;
    // if (!proofarray.length) {
    //   this.notif.error("No proof Uploaded", '');
    //   return
    // }
    if (option == 'savefinalise') {
      mandatproofs.forEach(element => {
        Telephone = false
        proofarray.forEach(item => {
          if (element.Document == item.Docname || element.Document == item.DocName) {
            Telephone = true;
            return
          }
        })
        if (!Telephone) {
          notlisted.push(Number(element["slno"]))
        }
      });
      if (notlisted.length > 0) {
        this.notif.error('Please upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
        return false
      }
      else {
        return true;
      }
    } else {
      return true;
    }
    // proofarray.forEach(item => {
    //   if (this.isRejected) {
    //     item.Docname = Number(item.DocName)
    //   }
    //   if (item.Docname == 1) {
    //     crfForm = true
    //   }
    // if (item.Docname == 47) {
    //   Telephone = true
    // }
    // })
    // if (!crfForm) {
    //   this.notif.error(" Please Upload crfForm", '');
    //   return false;
    // }
    // if (!Telephone) {
    //   this.notif.error("Please Upload Telephone decleration", '');
    //   return false;
    // }


  }
  SetPhoneNumberLen(mob, code) {


    if (mob == 'FirstMob') {
      if (code == '091') {
        this.Maxlen1 = 10;
        this.Minlen1 = 10;


      }
      else {
        this.Maxlen1 = 16;
        this.Minlen1 = 3;
        this.Maxlen2 = 16;
        this.Minlen2 = 3;

      }
    }
    else {
      if (code == '091') {
        this.Maxlen2 = 10;
        this.Minlen2 = 10;
      }
      else {
        this.Maxlen2 = 16;
        this.Minlen2 = 3;
      }
    }

    this.setCountry(mob, code)
  }
  ValidateEmail() {
    if (!this.form.controls.email.value) {
      this.notif.error('Email required', '')
      return false;
    }
    var mailvalidpattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/
    var emailvalid = mailvalidpattern.test(this.form.controls.email.value)
    if (!emailvalid) {
      this.notif.error('Please enter a valid email', '');
      return false;
    }
    if (this.ContEmail1) {
      if (!this.form.controls.relation2.value) {
        this.notif.error('Email  already exists,please choose relation.', '')
        return false;
      }
      if (this.form.controls.existingPan2.value != this.PANNO) {
        if (this.form.controls.relation2.value == "Self") {
          this.notif.error('Pan number mismatch you cannot select self as relation', '')
          return false
        }
      }
      if (this.form.controls.existingPan2.value == this.PANNO) {
        if (this.form.controls.relation2.value != "Self") {
          this.notif.error('Same PAN found, Relation must be Self', '')
          return false
        }
      }
    }
    if (this.ContEmail2) {
      if (!this.form.controls.relation3.value) {
        this.notif.error('Additional email  already exists,please choose relation.', '')
        return false;
      }
    }
    return true;
  }
  ValidateMobile() {
    var code = this.form.controls.isdCodeMobile.value;
    var code2 = this.form.controls.isdCodeOverseas.value;
    var phone = this.form.controls.mobile.value ? this.form.controls.mobile.value : 0;
    var phone2 = this.form.controls.OverseasMobile.value ? this.form.controls.OverseasMobile.value : 0;
    var smsValue = this.form.controls.smsFacility.value;

    if (smsValue == true) {
      if (code != "091" || phone == 0) {
        // this.form.controls.smsFacility.setValue(false);
        this.notif.error('SMS fascility only available for indian mobile', '')
        return false;
      }
    }
    if (this.form.controls.mobile.value) {
      if (code == '091') {
        if (phone.toString().length != '10') {
          this.notif.error('Length of the mobile number should be 10', '')
          return false;
        }
      }
      else {
        if (phone.toString().length < this.Minlen1) {
          this.notif.error('Length of overseas mobile number should be between ' + this.Minlen1 + ' and ' + this.Maxlen1 + '  ', '')
          return false;
        }
      }
      if (this.ContMob1) {
        if (!this.form.controls.relation.value) {
          this.notif.error('Mobile number already exists,please choose relation', '')
          return false
        }
        if (this.form.controls.existingPan.value != this.PANNO) {
          if (this.form.controls.relation.value == "Self") {
            this.notif.error('Pan number mismatch you cannot select self as relation', '')
            return false
          }
        }
        if (this.form.controls.existingPan.value == this.PANNO) {
          if (this.form.controls.relation.value != "Self") {
            this.notif.error('Same PAN found, Relation must be Self', '')
            return false
          }
        }
      }
    } else {
      if (!this.form.controls.OverseasMobile.value) {
        this.notif.error('Mobile number required', '')
        return false;
      }
    }

    if (this.form.controls.OverseasMobile.value) {
      if (code2 == '091') {
        this.notif.error('Please choose other country ISD Code', '')
        return false;
      }
      if (phone2.toString().length < this.Minlen2) {
        this.notif.error('Length of overseas mobile number should be between ' + this.Minlen2 + ' and ' + this.Maxlen2 + '  ', '')
        return false;
      }
      // if (this.ContMob2) {
      //   if (!this.form.controls.relation1.value) {
      //     this.notif.error('Additional mobile number already exists,please choose relation', '')
      //     return false
      //   }

      // }
    }
    return true
  }
  Approve() {
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    if (!Remarks) {
      this.notif.error('Approval remark is required', '')
      return
    }
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
              SMSFlag: this.form.controls.smsFacility.value ? 'Y' : 'N',
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
  Reject() {
    let Remarks = this.form.controls.Rejection.value.RejRemarks ? true : false
    // if (Remarks) {
    // if (this.checkedArray.length != 0 || this.convertedData.length !== 0) {
    let reason: any = this.form.controls.Rejection.value.RejRemarks
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to reject?',
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
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
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
  setCountry(field, data) {

    switch (field) {
      case "Tel1":
        {
          this.telCountry = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == data)].CountryName;
          break
        }
      case "FirstMob": {
        this.mob1Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == data)].CountryName;
        break

      }
      case "SecondMob":
        {
          this.mob2Country = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == data)].CountryName;
          break
        }
      case "Overseas":
        {
          this.OverseasCountry = this.CountrycodeArray[this.CountrycodeArray.findIndex(item => item.CODE == data)].CountryName;
          break
        }
    }

    this.CheckSMSAvailable()

  }

  CheckSMSAvailable() {
    var countrycode = this.form.controls.isdCodeMobile.value;
    var currentvalue = this.form.controls.smsFacility.value;
    var indmobile = this.form.controls.mobile.value;
    if (currentvalue == true) {
      if (countrycode != "091") {
        this.form.controls.smsFacility.setValue(false);
        this.notif.error('SMS fascility only available for indian mobile', '')
      }
    }
    if (countrycode == "091") {
      this.isSwitchDisabled = true; 
      this.form.controls.smsFacility.setValue(true)
       // Disable the switch
    } else {
      this.isSwitchDisabled = false; // Enable the switch
      this.form.controls.smsFacility.setValue(false)
    }
  }


  validateMobileorEmail(pan, mobEmail, flag, loc, type) {
    // if(this.EntryAccess==false){
    //   return
    // }
    var form = this.form.controls
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: pan,
          MobEmail: mobEmail,
          Flag: flag,
          location: loc,
          sFlag: '',
          Tradecode: '',
          Dpid: '',
          Clnt_Id: '',
        }],
      "requestId": "6015",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining = false
      if (response.results) {

        let resultset = response.results[0][0]
        //         ClientDetails: "EIA051 - ANISH M"
        // PAN: "AWOPM4980F"
        // BranchEmail: "anil@geojit.com"
        if (type == 'Mobile1') {
          if (response.results[0].length > 0) {
            this.notif.error("Mobile number already exists,please choose relation.", '')
            form.existingPan.patchValue(resultset.PAN)
            form.existingClient.patchValue(resultset.ClientDetails)
            this.ContMob1 = true
          }
          else {
            form.existingPan.patchValue(null)
            form.existingClient.patchValue(null)
            form.relation.patchValue(null)
            this.ContMob1 = false
          }
        }
        if (type == 'Mobile2') {
          if (response.results[0].length > 0) {
            this.notif.error("Additonal mobile number already exists,please choose relation.", '')
            form.existingPan1.patchValue(resultset.PAN)
            form.existingClient1.patchValue(resultset.ClientDetails)
            this.ContMob2 = true
          }
          else {
            form.existingPan1.patchValue(null)
            form.existingClient1.patchValue(null)
            form.relation1.patchValue(null)
            this.ContMob2 = false
          }
        }

        if (type == 'Email1') {
          if (response.results[0].length > 0) {
            this.notif.error(" Email  already exists,please choose relation.", '')
            form.existingPan2.patchValue(resultset.PAN)
            form.existingClient2.patchValue(resultset.ClientDetails)
            this.ContEmail1 = true
          }
          else {
            form.existingPan2.patchValue(null)
            form.existingClient2.patchValue(null)
            form.relation2.patchValue(null)
            this.ContEmail1 = false
          }
        }

        if (type == 'Email2') {
          if (response.results[0].length > 0) {
            this.notif.error("Additonal email  already exists,please choose relation.", '')
            form.existingPan3.patchValue(resultset.PAN)
            form.existingClient3.patchValue(resultset.ClientDetails)
            this.ContEmail2 = true
          }
          else {
            form.existingPan3.patchValue(null)
            form.existingClient3.patchValue(null)
            form.relation3.patchValue(null)
            this.ContEmail2 = false
          }
        }

        // if (type == 'mob2') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Mobile number already Exists,Please choose relation.", '')
        //     this.kycContactDetails2.form.controls.existingPan.patchValue(resultset.PAN)
        //     this.kycContactDetails2.form.controls.existingClient.patchValue(resultset.ClientDetails)
        //     this.kycContMob2 = true
        //   }
        //   else {
        //     this.kycContactDetails2.form.controls.existingPan.patchValue(null)
        //     this.kycContactDetails2.form.controls.existingClient.patchValue(null)
        //     this.kycContactDetails2.form.controls.relation.patchValue(null)
        //     this.kycContMob2 = false
        //   }
        // }

        // if (type == 'Addmob2') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Additonal Mobile number already Exists,Please choose relation.", '')
        //     this.kycContactDetails2.form.controls.existingPan1.patchValue(resultset.PAN)
        //     this.kycContactDetails2.form.controls.existingClient1.patchValue(resultset.ClientDetails)

        //     this.kycAddContMob2 = true
        //   }
        //   else {
        //     this.kycContactDetails2.form.controls.existingPan1.patchValue(null)
        //     this.kycContactDetails2.form.controls.existingClient1.patchValue(null)
        //     this.kycContactDetails2.form.controls.relation1.patchValue(null)
        //     this.kycAddContMob2 = false
        //   }
        // }

        // if (type == 'email2') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error(" Email number already Exists,Please choose relation.", '')
        //     this.kycContactDetails2.form.controls.existingPan2.patchValue(resultset.PAN)
        //     this.kycContactDetails2.form.controls.existingClient2.patchValue(resultset.ClientDetails)

        //     this.kycContEmail2 = true
        //   }
        //   else {
        //     this.kycContactDetails2.form.controls.existingPan2.patchValue(null)
        //     this.kycContactDetails2.form.controls.existingClient2.patchValue(null)
        //     this.kycContactDetails2.form.controls.relation2.patchValue(null)
        //     this.kycContEmail2 = false
        //   }
        // }

        // if (type == 'addEmail2') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Additonal Email number already Exists,Please choose relation.", '')
        //     this.kycContactDetails2.form.controls.existingPan3.patchValue(resultset.PAN)
        //     this.kycContactDetails2.form.controls.existingClient3.patchValue(resultset.ClientDetails)

        //     this.kycContAddEmail2 = true
        //   }
        //   else {
        //     this.kycContAddEmail2 = false
        //     this.kycContactDetails2.form.controls.existingPan3.patchValue(null)
        //     this.kycContactDetails2.form.controls.existingClient3.patchValue(null)
        //     this.kycContactDetails2.form.controls.relation3.patchValue(null)
        //   }
        // }


        // if (type == 'mob3') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Mobile number already Exists,Please choose relation.", '')
        //     this.kycContactDetails3.form.controls.existingPan.patchValue(resultset.PAN)
        //     this.kycContactDetails3.form.controls.existingClient.patchValue(resultset.ClientDetails)

        //     this.kycContMob3 = true
        //   }
        //   else {
        //     this.kycContactDetails3.form.controls.existingPan.patchValue(null)
        //     this.kycContactDetails3.form.controls.existingClient.patchValue(null)
        //     this.kycContactDetails3.form.controls.relation.patchValue(null)
        //     this.kycContMob3 = false
        //   }
        // }

        // if (type == 'Addmob3') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Additonal Mobile number already Exists,Please choose relation.", '')
        //     this.kycContactDetails3.form.controls.existingPan1.patchValue(resultset.PAN)
        //     this.kycContactDetails3.form.controls.existingClient1.patchValue(resultset.ClientDetails)

        //     this.kycAddContMob3 = true
        //   }
        //   else {
        //     this.kycContactDetails3.form.controls.existingPan1.patchValue(null)
        //     this.kycContactDetails3.form.controls.existingClient1.patchValue(null)
        //     this.kycContactDetails3.form.controls.relation1.patchValue(null)
        //     this.kycAddContMob3 = false
        //   }
        // }

        // if (type == 'email3') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error(" Email number already Exists,Please choose relation.", '')
        //     this.kycContactDetails3.form.controls.existingPan2.patchValue(resultset.PAN)
        //     this.kycContactDetails3.form.controls.existingClient2.patchValue(resultset.ClientDetails)

        //     this.kycContEmail3 = true
        //   }
        //   else {
        //     this.kycContactDetails3.form.controls.existingPan2.patchValue(null)
        //     this.kycContactDetails3.form.controls.existingClient2.patchValue(null)
        //     this.kycContactDetails3.form.controls.relation2.patchValue(null)
        //     this.kycContEmail3 = false
        //   }
        // }

        // if (type == 'addEmail3') {
        //   if (response.results[0].length > 0) {
        //     this.notif.error("Additonal Email number already Exists,Please choose relation.", '')
        //     this.kycContactDetails3.form.controls.existingPan3.patchValue(resultset.PAN)
        //     this.kycContactDetails3.form.controls.existingClient3.patchValue(resultset.ClientDetails)

        //     this.kycContAddEmail3 = true
        //   }
        //   else {
        //     this.kycContactDetails3.form.controls.existingPan3.patchValue(null)
        //     this.kycContactDetails3.form.controls.existingClient3.patchValue(null)
        //     this.kycContactDetails3.form.controls.relation3.patchValue(null)
        //     this.kycContAddEmail3 = false
        //   }
        // }


      }
    })
  }

  CheckExisting(type, check, value) {
    var loc = this.dataServ.region
    this.validateMobileorEmail(this.PANNO, value, check, loc, type)

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
        nzContent: '<b>Are you sure you want to reject ?</b>',
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
                Rejection: "Branch rejected-" + reason,
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
  isOrdinary(data) {
    if (data.NROClnt == 0) {
      this.NRI = 'false';
    }
    else {
      this.NRI = 'true';
      this.form.controls.smsFacility.setValue(false)

    }
  }

  setRelation(data, type) {
    if ((data && data.length == 10)) {
      if (data == this.PANNO) {
        if (type == 'mobile') {
          this.form.controls.relation.patchValue('Self');
        }
        if (type == 'email') {
          this.form.controls.relation2.patchValue('Self');
        }
      }
    }
  }

  notifMode(type) {
    if (type == 'Email') {
      this.notif.warning('Employee details require', '');
    }
    else
      this.notif.remove();
  }

  initialApprove() {

    this.verifyEmailOrMobile().then((response: any)=>{
      if (response) {
        let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
        //if (Remarks) {
        let reason: any = this.form.controls.Rejection.value.AppRemarks;
        this.modalService.confirm({
          nzTitle: '<i>Confirmation</i>',
          nzContent: '<b>Are you sure want to to proceed First level approvel ?</b>',
          nzOnOk: () => {

            var contactvalid: boolean = false;
            if (this.tab == "Mobile") {
              contactvalid = this.ValidateMobile()
            }
            if (this.tab == "Email") {
              contactvalid = this.ValidateEmail()
            }
            if (this.tab == "Telephone") {
              contactvalid = this.ValidateTelephoneProof('save')
            }
            if (contactvalid) {
              let data: any = []
              let totalData = { ...this.form.value }
              data.push(totalData)
              var ContactUpdate = jsonxml(data);
              var ContactFulldata: any = []
              ContactFulldata.push({ "ChangeInContact": ContactUpdate })
              var contactjson = this.utilServ.setJSONMultipleArray(ContactFulldata);
              this.ContactXml = jsonxml(contactjson)

              var approvel = {
                "batchStatus": "false",
                "detailArray":
                  [{
                    Pan: this.PANNO,
                    EntryType: this.tab,
                    ActionType: 'F',
                    FileData: this.ContactXml,
                    ActionUser: this.currentUser.userCode,
                    IDNO: this.IDNO,
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
              this.isSpining = true
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
        })
    // }
    // else {
    //   this.notif.error('Approval remark is required', '')
    //   return
    // }
      }
    }) 
  }
  editButton(){
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.notif.success("Editing enabled..!",'');
        if (this.tab == 'Telephone') {
         this.enableFields('Telephone');
        }
        if (this.tab == 'Email') {
          this.enableFields('Email');
         }
        if (this.tab == 'Mobile') {
        this.enableFields('Mobile');
        }

      }

    });
  }

  toggleSwitch() {
  
    var countrycode = this.form.controls.isdCodeMobile.value;
    var isSmsFacility = this.form.controls.smsFacility.value
    var Mobile =this.form.controls.mobile
    var isNRI = this.NRI == 'true' ? true:false
    var isMobile:boolean;

    if(Mobile.value == null || Mobile.value == ''){
      isMobile = false;
    }
    else{
      isMobile = true;

    }
    if (countrycode == '091' && (!isNRI||isMobile)){
      this.form.controls.smsFacility.setValue(true)
    }
    else if(isNRI && !isMobile){
      this.form.controls.smsFacility.setValue(false)

    }
  }
}