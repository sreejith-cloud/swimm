import { Component, OnInit, ElementRef, ViewChild, NgZone, AfterViewInit, Input } from '@angular/core';
import { CRFDataService } from '../CRF.service';
import { FormGroup, FormBuilder, Validators, RequiredValidator, AbstractControl, FormControl } from '@angular/forms';
import { ValidationService, UtilService, DataService, AuthService, User } from 'shared';
import { NzNotificationService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml'
import { UploadFile } from 'ng-zorro-antd/upload';
import { element, disableBindings, elementClassProp } from '@angular/core/src/render3';
import { InputMasks, InputPatterns } from 'shared';
import { CrfComponent } from '../crf.component';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { timeStamp } from 'console';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'crf-nominee-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CRFNomineeDetailsComponent implements OnInit {

  form: FormGroup;
  inputMasks = InputMasks;

  fileList: any = [];
  fileList1: any = [];
  fileList2: any = [];
  fileList3: any = [];
  fileList4: any = [];
  fileList5: any = [];
  fileList6: any = [];
  nomineeIdfileList1: any = [];
  nomineeIdfileList2: any = [];
  nomineeIdfileList3: any = [];
  paninput: boolean = true;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;

  isShowCdsl: boolean = false;
  @ViewChild('tabsContentRef') el: ElementRef;
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  @Input() tab: string;
  fileName: string;
  document: string;
  remiserDocument: any;

  clientType: string
  HolderDetails: any;
  clientSerialNumber: number;
  dpIdArray: any;
  cdslTypeArray: any;
  nsdlTypeArray: any;
  CDSLBOCategoryArray: any;
  nomineeRelationArray: any;
  CDSLRelationshipArray: any;
  CDSLAnnualIncomeArray: any;
  CDSLNationalityArray: any;
  CDSLEducationArray: any;
  CDSLGeographicAreaArray: any;
  CDSLOccupationArray: any;
  CDSLCurrencyArray: any;
  CDSLLanguageArray: any;
  cdslSUBTypeArray: any;
  nsdlSUBTypeArray: any;
  currentUser: User;

  nomineeIdentificationArray: any;
  FormControlNames: any = {};
  cdslSubtype: any;
  nsdlSubtype: any;

  dpId: any;
  generalDetailsArray: any;
  dpOnly: boolean;
  PANNO: any;
  ChangeAccounts: any = [];
  firstNomineeDetailsXML: any;
  SecondNomineeDetailsXML: any;
  ThirdNomineeDetailsXML: any;
  dataforaprove: any = [];
  verificationstatus: any = [];
  gardian1: boolean = false;
  IDNO: any;
  isSpining: boolean = false;
  test: any = 2;
  gardian2: boolean = false;
  gardian3: boolean = false;
  mdEqualShare: any;
  nomineeForm1: any;
  nomineeForm2: any;
  nomineeForm3: any;
  CountrycodeArray: any = [];
  HO: boolean = false;
  test123: boolean = true;
  dsNominee2: boolean = true;
  dsNominee3: boolean = true;
  numOfNominees: any;
  Prooffields: any = [];
  Nominee1Fields: any = [];
  Gardian3Fields: any = [];
  Nominee3Fields: any = [];
  Gardian2Fields: any = [];
  Nominee2Fields: any = [];
  Gardian1Fields: any = [];
  numOfNomineesdisable: boolean = false;
  today = new Date();
  NomineeList = []
  ClientAccounts = [];
  enbleTrading: boolean = false;
  SerialNumber: any = 0
  saveButtonFlag: boolean;
  approveOrRejectButtonFlag: boolean;
  finalApproveOrRejectButtonFlag: boolean;
  printFlag: boolean = false;
  applicationStatus: any;
  requestID: any
  enbleCDSL: boolean = false;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  residualValidator: boolean = false;
  Remks: any;
  max1: any = 10;
  min1: any = 10;
  max2: any = 10;
  min2: any = 10;
  max3: any = 10;
  min3: any = 10;
  // data:any;
  dpclientid: any;//  MOd:aksa
  showtext1: boolean = false;
  showtext2: boolean = false;//  MOd:aksa
  showtext3: boolean = false;
  showtext4: boolean = false;
  showtext5: boolean = false;
  showtext6: boolean = false;
  //  showtext2:boolean=false
  showbutton1: boolean = false;
  showbutton2: boolean = false;// //  MOd:aksa
  showbutton3: boolean = false;//
  showbutton4: boolean = false;//
  showbutton5: boolean = false;//
  showbutton6: boolean = false;//
  holdername1: any;//  MOd:aksa
  holdername2: any;
  holdername3: any;
  holdername4: any;
  holdername5: any;
  holdername6: any;
  panholder1: any;
  panholder2: any;
  panholder3: any;
  panholder4: any;
  panholder5: any;
  panholder6: any;
  panbutton1: boolean = false;
  panbutton2: boolean = false;
  panbutton3: boolean = false;
  panbutton4: boolean = false;
  panbutton5: boolean = false;
  panbutton6: boolean = false;
  pantext1: boolean = false;
  pantext2: boolean = false;
  pantext3: boolean = false;
  pantext4: boolean = false;
  pantext5: boolean = false;
  pantext6: boolean = false;
  panvalid: any;
  pantest: any;
  firstHolderInvalid: boolean = false;
  secondHolderInvalid: boolean = false;
  thirdHolderInvalid: boolean = false;
  // firstHolderInvalid2: boolean = false;
  // firstHolderInvalid3: boolean = false;
  dematvalid: boolean = false;
  isDisabled: boolean = true;
  disableFld: boolean = false;
  editFlag: boolean = false;
  text: any; //  MOd:aksa
  data1: any;
  Label = [{ key: 'nomineeHouseName', value: "Address 1" },
  { key: 'nomineeHouseNumber', value: "Address 2" },
  { key: 'nomineeStreet', value: "Address 3" },


  { key: 'guardianHouseName', value: "Address 1" },
  { key: 'guardianHouseNumber', value: "Address 2" },
  { key: 'guardianStreet', value: "Address 3" },

  ];
  checkbox: any;
  reasonList: any = [];
  reasonsList: any = [];
  rejectionData: any = [];
  checkBoxSelect: boolean;
  checkBoxSpecificSelection: any = [];
  checkBoxSelectAll: any = [];
  checkedArray: any = [];
  allReasonChecked: any = [];
  nomineeDetailsxml: any;
  RejRemarks: any;
  flag: number;
  Cbox_Disabled: boolean = false;
  C_Disabled: boolean;
  convertedData: any = [];
  popup: boolean = false;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkboxSelected: any = [];
  isVisible = false;
  RequestFrom: any;

  nomineeOpting: boolean = false;
  nomineeOptingBtn: boolean = false;
  NomineeOpted: any = 'N';
  optingFlag: boolean = false;
  editButtonShow: boolean = false;
  NomineeOptedReport: boolean = false;
  dsNominee1: boolean = false;
  OptedEntry: number;
  sharePercentageStatus: boolean = false;

  CDSL_Satus: boolean = false;

  disablepanholder1: boolean =false
  disablepanholder3: boolean =false
  disablepanholder5: boolean =false
  panname1: boolean =false
  panname3: boolean =false
  panname5: boolean =false
  newPanService:boolean=false

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private authServ: AuthService,
    private cmServ: CRFDataService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notif: NzNotificationService, private modal: NzModalService,
    private msg: NzMessageService,
    private Crf: CrfComponent,

  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    })
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true;
    }
    this.cmServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber ? data.PanNumber : '';
      this.printFlag = false
    })
    this.cmServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })
    this.cmServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;
    })
    this.cmServ.changeAccounts.subscribe((data) => {
      this.ClientAccounts = [];
      this.ClientAccounts = data;
      if (this.ClientAccounts) {
        this.enbleTrading = false
        this.enbleCDSL = false
        this.ClientAccounts.forEach(item => {
          if (item.AccountType == 'TRADING') {
            this.enbleTrading = true
          }
          if (item.AccountType == 'CDSL') {
            this.enbleCDSL = true;
            this.CDSL_Satus = true;
          } else {
            this.CDSL_Satus = false;
          }
        })
      }
    })
    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })
    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
      console.log("A", this.approveOrRejectButtonFlag);



    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
      console.log("F", this.finalApproveOrRejectButtonFlag);

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
      if ((this.applicationStatus == 'P') || this.applicationStatus == 'T' || this.applicationStatus == 'F' || this.applicationStatus == 'A') {
        this.disableFld = true;
      }
      else {
        this.disableFld = false;
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
    this.cmServ.NomineeOpting.subscribe((data) => {
      this.nomineeOptingBtn = data
      console.log('line 315', this.nomineeOptingBtn);
    })
    this.cmServ.NomineeOptingFlag.subscribe((data) => {
      this.optingFlag = data;
      this.editButtonShow = data;
    })

  }

  ngOnInit() {

    this.OptedEntry = this.requestID
    console.log(this.Nominee1Fields);

    // console.log(this.nomineeIdentificationArray);


    this.isDisabled = true;


    this.form = this.fb.group({
      nomineeEqualShareForNominess: [null, [Validators.required]],
      tradeNominee: [null],
      firstNomineeDetails: this.createFirstHolderDetails(),
      SecondNomineeDetails: this.createSecondHolderDetails(),
      ThirdNomineeDetails: this.createThirdHolderDetails(),
      Rejection: this.CreateRejectionForm(),
      NomineeOpting: [this.optingFlag]
    });

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: "",
          EUser: "",
          DpType: this.CDSL_Satus ? 'CDSL' : ''
        }],
      "requestId": "6022",
      "outTblCount": "0"
    }).then((response) => {

      if (response.results) {
        this.nomineeRelationArray = response.results[7]
        this.nomineeIdentificationArray = response.results[8]
        this.newPanService = response.results[14] && response.results[14][0] && response.results[14][0].RegulatoryChangeNeeded?true:false
        this.CountrycodeArray = response.results[5];
        this.Prooffields = response.results[3];
        console.log(this.Prooffields);
        // console.log(response.results[3]);



        this.form.controls.nomineeEqualShareForNominess.setValue(false);
        this.nomineeForm1.controls.isdCodeMobile.setValue('091');
        this.nomineeForm2.controls.isdCodeMobile.setValue('091');
        this.nomineeForm3.controls.isdCodeMobile.setValue('091');

        this.nomineeForm1.controls.isdCodeTelephone.setValue('091');
        this.nomineeForm2.controls.isdCodeTelephone.setValue('091');
        this.nomineeForm3.controls.isdCodeTelephone.setValue('091');

      }
    })

    console.log('applicationstatus chk', this.applicationStatus == '');
    this.numOfNominees = "One"
    if (this.applicationStatus == 'T' || this.applicationStatus == 'P' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
      // if (this.NomineeOptedReport) {
      //   this.numOfNominees = 'nomineeOpt'
      // }
      // else {
      // this.numOfNominees = "One"
      this.FillApproveData();
      // this.nomineeOptingBtn = true;
      console.log('line 355', this.nomineeOptingBtn, 'disableFld', this.disableFld = true);

      // }
      // this.FillApproveData();
    }
    this.nomineeForm1 = this.form.controls.firstNomineeDetails;
    this.nomineeForm2 = this.form.controls.SecondNomineeDetails;
    this.nomineeForm3 = this.form.controls.ThirdNomineeDetails;


    this.NomineeList = [{ "key": 1, "value": "First Nominee" }]
    this.form.controls.tradeNominee.patchValue(1)
    debugger
    this.getData()
  }
  getData() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })

    this.RequestFrom = sessionStorage.getItem("key")

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
      debugger
      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      let Rejremarks: any = this.form.controls.Rejection
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }

      if (response.results[3][0].NomineeOptOut) {
        this.numOfNominees = 'nomineeOpt'
        this.NomineeOptedReport = response.results[3][0].NomineeOptOut
        console.log('form, group value', this.NomineeOptedReport);
      }
      console.log('equalsharefornomineechk', response.results[3][0].F_sharePercentage);
      // if(response.results[3][0].F_sharePercentage!='' && this.numOfNominees != 'nomineeOpt'){
      //   alert('share chk')
      //   this.form.controls.nomineeEqualShareForNominess.setValue(true);
      //   this.form.controls.nomineeEqualShareForNominess.disable();
      // }
      console.log('equalshare Mygeojitchk', response.results[3][0]);
      if (response.results[3][0].SharepercEqual == 'true') {
        console.log('mygeojit entry')
        this.form.controls.nomineeEqualShareForNominess.setValue(true);
        this.form.controls.nomineeEqualShareForNominess.disable();
      }

      if (response.results[3][0].F_guardianTitle) {
        this.gardian1 = true;
        console.log('minor check1', response.results[3][0].F_guardianTitle);

      }
      if (response.results[3][0].S_guardianTitle) {
        this.gardian2 = true;
        console.log('minor check2', response.results[3][0].S_guardianTitle);

      }
      if (response.results[3][0].T_guardianTitle) {
        this.gardian3 = true;
        console.log('minor check3', response.results[3][0].T_guardianTitle);

      }

      // if(response.results[3][0].F_sharePercentage || response.results[3][0].S_sharePercentage ||
      //   response.results[3][0].T_sharePercentage){
      //     this.nomineeForm1.controls.sharePercentage.disable()
      //     this.nomineeForm2.controls.sharePercentage.disable()
      //     this.nomineeForm3.controls.sharePercentage.disable()
      //     console.log('sssss',this.nomineeForm1);

      // }
      console.log(response.results[3][0].F_sharePercentage, 'KKKKKKKKKKKKKKKKKK')
      if (((response.results[3][0].F_sharePercentage) || response.results[3][0].F_sharePercentage == '') || (response.results[3][0].F_sharePercentage) == '100' ||
        ((response.results[3][0].S_sharePercentage) || response.results[3][0].S_sharePercentage == '') || (response.results[3][0].S_sharePercentage) == '100' ||
        ((response.results[3][0].T_sharePercentage) || response.results[3][0].T_sharePercentage == '') || (response.results[3][0].T_sharePercentage) == '100') {
        this.sharePercentageStatus = true;
        console.log('inside if block')
      } else {
        this.sharePercentageStatus = false;
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

  getCdslSubtype(data) {
    if (data == null)
      return
    this.cdslSubtype = this.cdslSUBTypeArray.filter(element => {
      return element.Type == data
    })
  }
  getNSDLSubtype(data) {
    if (data == null)
      return
    this.nsdlSubtype = this.nsdlSUBTypeArray.filter(element => {
      return element.Type == data
    })
  }
  getDP(data) {
    if (data == null)
      return
    this.dpIdArray = this.dpId.filter(element => {
      return element.DPType == data
    })
  }
  getDPName(data) {
    if (data == null) {
      return
    }
    let form: any = this.form.controls.dpDetails;
    let dpnameArray = this.dpId.filter(element => {
      return element.Code == data
    })
    form.controls.dpname.patchValue(dpnameArray[0].Description)
  }

  createDpDetails() {
    return this.fb.group({
      dp: [null, [Validators.required]],
      dpid: [null, [Validators.required]],
      dpname: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      VoucherId: [null],
      NoofHolders: [null],
      DPHolderShortName: [null, [Validators.required]],
      TypeofCDSLDP: [null],
      SubTypeofCDSLDP: [null],
      TypeofNSDLDP: [null],
      SubTypeofNSDLDP: [null],
      DPThirdpartyHouserName: [null],
      DPThirdpartyHouserNumber: [null],
      DPThirdpartystreet: [null],
      DPThirdpartyName: [null],
      KitNO: [null],
      RiskCountry: [null],
      RSDAFlag: [null, [Validators.required]],
      Branch: [null],
      receivecreditsautomatically: [null, [Validators.required]],
      EmailSharingwithRTA: [null, [Validators.required]],
      Sendallcommunicationsstatementsthroughemailonly: [null, [Validators.required]],
      EmailIDforCommunication: [null, [Validators.required]],
      Autopledgeconfirmation: [null, [Validators.required]],
      Addressforcommunication: ["Local Address", [Validators.required]],
    })
  }
  createCDSLDetails() {
    return this.fb.group({
      BOCategory: [null, [Validators.required]],
      StatementCyclecode: ["End of month"],
      Relationship: [null],
      StaffCode: [null],
      Nationality: [null],
      AnnualIncome: [null],
      GeographicArea: [null],
      Education: [null],
      Occupation: [null, [Validators.required]],
      Language: [null],
      CurrencyCode: [null, [Validators.required]],
    })
  }
  createFirstHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null, [Validators.required]],
      nomineeFirstName: [null, [Validators.required]],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      //nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null, [Validators.required]],
      nomineeHouseName: [null],//mod 18204
      nomineeHouseNumber: [null], // mod  18204
      nomineeStreet: [null], //mod aksa
      nomineePin: [null] ,// mod 18204
      nomineeCity: [null], // mod 18204
      nomineeState: [null],// mod 18204
      BOCategory: [null],
      nomineeCountry: [null], // mod 18204
      isdCodeMobile: [null],
      nomineeMobile: [null],
      isdCodeTelephone: [null],
      stdCodetelephone: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      sharePercentage: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      // , [Validators.required]],
      nomineeDOB: [null],
      Firstnomineenameasinpan: [null],
      nameverifiedITD:[null],
      dobverifiedITD:[null],
      panverifyClick:[false],
      // guardiannameverifiedITD:[null],
      // guardiandobverifiedITD:[null],
      // guardianpanverifyClick:[false],

      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      Firstnomineeguardiannameasinpan: [null]
    })
  }

  createSecondHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null],
      nomineeFirstName: [null],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      // nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null],
      nomineeHouseName: [null],
      nomineeHouseNumber: [null],
      nomineeStreet: [null],
      nomineePin: [null],
      nomineeCity: [null],
      nomineeState: [null],
      BOCategory: [null],
      nomineeCountry: [null],
      isdCodeMobile: [null],
      nomineeMobile: [null],
      isdCodeTelephone: [null],
      stdCodetelephone: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      sharePercentage: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      nomineeDOB: [null],
      Secondnomineenameasinpan: [null],
      nameverifiedITD:[null],
      dobverifiedITD:[null],
      panverifyClick:[false],
      // guardiannameverifiedITD:[null],
      // guardiandobverifiedITD:[null],
      // guardianpanverifyClick:[false],

      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      Secondnomineeguardiannameasinpan: [null]
    })
  }

  createThirdHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null],
      nomineeFirstName: [null],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      // nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null],
      nomineeHouseName: [null],
      nomineeHouseNumber: [null],
      nomineeStreet: [null],
      nomineePin: [null],
      nomineeCity: [null],
      nomineeState: [null],
      BOCategory: [null],
      nomineeCountry: [null],
      isdCodeMobile: [null],
      nomineeMobile: [null],
      isdCodeTelephone: [null],
      stdCodetelephone: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      sharePercentage: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      nomineeDOB: [null],
      Thirdnomineenameasinpan: [null],
      nameverifiedITD:[null],
      dobverifiedITD:[null],
      panverifyClick:[false],
      // guardiannameverifiedITD:[null],
      // guardiandobverifiedITD:[null],
      // guardianpanverifyClick:[false],

      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      Thirdnomineeguardiannameasinpan: [null]
    })
  }

  beforeUpload = (file: UploadFile, filelist): boolean => {

    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      const isLt2M = file.size / 1024 < 20
      if (!isLt2M) {
        this.msg.error('Image must smaller than 20KB!')
        return false;
      }
      else {
        this.encodeImageFileAsURL(file);

      }
    }
    else {
      this.msg.error("Please uplaod jpeg/png/pdf")
      return false
    }
  }
  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      file.doc = document
    }
    reader.readAsDataURL(file);
  }

  calculateAge(birthDate) {
    birthDate = new Date(birthDate);
    let otherDate = new Date()
    var years = (otherDate.getFullYear() - birthDate.getFullYear());
    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }
    return years;
  }

  showModal(file) {
    if (file["originFileObj"]) {
      let file1 = file["originFileObj"]
      this.filePreiewContent = file1.doc
      this.filePreiewFilename = file1.name
      this.filePreiewContentType = file1.type
      this.filePreiewVisible = true;
    }
    else {
      this.filePreiewContent = file.doc
      this.filePreiewFilename = file.name
      this.filePreiewContentType = file.type
      this.filePreiewVisible = true
    }
  }

  getAdditionalDocuments() {
    return [
      { doc: this.getObjFromArray(this.fileList, 'PAN') },
      { doc: this.getObjFromArray(this.fileList1, 'Aadhaar Card') },
      { doc: this.getObjFromArray(this.fileList2, 'Passport') },
      { doc: this.getObjFromArray(this.fileList3, 'Driving License') },
      { doc: this.getObjFromArray(this.fileList4, 'Voters ID') },
      { doc: this.getObjFromArray(this.fileList5, 'Marriage Certificate') },
      { doc: this.getObjFromArray(this.fileList6, 'Gazetted Notification') },
      { doc: this.getObjFromArray(this.nomineeIdfileList1, 'First Nominee Identificaiton') },
      { doc: this.getObjFromArray(this.nomineeIdfileList2, 'Second Nominee Identificaiton') },
      { doc: this.getObjFromArray(this.nomineeIdfileList3, 'Third Nominee Identificaiton') },
    ]

  }

  getObjFromArray(filelist, proofname) {
    var totalData = []
    let data;
    filelist.forEach((element, index) => {
      if (element["originFileObj"]) {
        let file = element.originFileObj
        data = {
          panNumber: this.HolderDetails["FirstHolderpanNumber"],
          docname: (proofname == 'PAN' || proofname == 'Signature') ? proofname : proofname + (index + 1),
          url: file.doc,
          size: file.size,
          type: file.type,
          uid: file.uid
        }
      }
      else {
        let file = element
        data = {
          panNumber: this.HolderDetails["FirstHolderpanNumber"],
          docname: (proofname == 'PAN' || proofname == 'Signature') ? proofname : proofname + (index + 1),
          url: file.doc,
          size: file.size,
          type: file.type,
          uid: file.uid
        }
      }
      totalData.push(data)
    });
    let jsond = this.utilServ.setJSONArray(totalData);
    let imageXmlData = jsonxml(jsond);
    return imageXmlData
  }
  getPinData(data, type) {
    let nomineeForm1: any = this.form.controls.firstNomineeDetails;
    let nomineeForm2: any = this.form.controls.SecondNomineeDetails;
    let nomineeForm3: any = this.form.controls.ThirdNomineeDetails;
    if (data == null) {
      return
    }
    if (data.length != 6) {
      if (type == "firstNominee") {
        nomineeForm1.controls.nomineeState.setValue(null)
        nomineeForm1.controls.nomineeCountry.setValue(null)
      }
      if (type == "firstGuardian") {
        nomineeForm1.controls.guardianState.setValue(null)
        nomineeForm1.controls.guardianCountry.setValue(null)
      }

      if (type == "secondNominee") {
        nomineeForm2.controls.nomineeState.setValue(null)
        nomineeForm2.controls.nomineeCountry.setValue(null)
      }
      if (type == "SecondGuardian") {
        nomineeForm2.controls.guardianState.setValue(null)
        nomineeForm2.controls.guardianCountry.setValue(null)
      }

      if (type == "ThirdNominee") {
        nomineeForm3.controls.nomineeState.setValue(null)
        nomineeForm3.controls.nomineeCountry.setValue(null)
      }
      if (type == "ThirdGuardian") {
        nomineeForm3.controls.guardianState.setValue(null)
        nomineeForm3.controls.guardianCountry.setValue(null)
      }
      return
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Pin": data,
        }],
      "requestId": "5037"
    })
      .then((response) => {

        if (response.results[0].length > 0) {
          let productList = response.results[0][0];
          if (type == "firstNominee") {
            nomineeForm1.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm1.controls.nomineeCountry.setValue(productList.Country)
          }
          if (type == "firstGuardian") {
            nomineeForm1.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm1.controls.guardianCountry.setValue(productList.Country)
          }

          if (type == "secondNominee") {
            nomineeForm2.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm2.controls.nomineeCountry.setValue(productList.Country)
          }
          if (type == "SecondGuardian") {
            nomineeForm2.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm2.controls.guardianCountry.setValue(productList.Country)
          }

          if (type == "ThirdNominee") {
            nomineeForm3.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm3.controls.nomineeCountry.setValue(productList.Country)
          }
          if (type == "ThirdGuardian") {
            nomineeForm3.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm3.controls.guardianCountry.setValue(productList.Country)
          }
        }
      })
  }

  ngAfterViewInit() {
    this.img.setproofs(this.tab)
  }
  nomineeOptingfunction(e) {
    if (e) {
      this.nomineeOpting = true;
      this.NomineeOpted = 'Y'
      // this.disableFld = true;
      // this.disableFields();
      this.numOfNominees = 'nomineeOpt'
      this.form.controls.nomineeEqualShareForNominess.setValue(false);
      console.log('nomineeOptingfunction', this.nomineeOpting);
    }
    // else {
    //   this.numOfNominees = 'One'
    //   this.NomineeOpted = 'N'
    //   this.nomineeOpting = false;
    //   this.disableFld = false;
    //   this.enableFields("OPT");
    // }
  }
  SaveNominee(action) {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to save ?</b>',
      nzOnOk: () => {

        debugger

        // if (this.data1.length > 16) {
        //   debugger
        //   this.notif.error('Please enter valid dpclientid', '');
        //   return
        // }
        // if (this.enbleTrading) {
        //   if (this.form.controls.tradeNominee.value == '' || this.form.controls.tradeNominee.value == null) {
        //     this.notif.error('Trading nominee not selected, please do.', '')
        //     return
        //   }
        // }


        // if (this.residualValidator) {
        //   if (this.form.controls.firstNomineeDetails.value.nomineeResidualshares == 'N' &&
        //     this.form.controls.SecondNomineeDetails.value.nomineeResidualshares == 'N' &&
        //     this.form.controls.ThirdNomineeDetails.value.nomineeResidualshares == 'N') {
        //     this.notif.error('Please choose nominee residual shares.', '')
        //     return
        //   }
        // }
        console.log(this.panvalid);
        console.log(this.nomineeForm1+"this.nomineeForm1.controls.panverifyClick"+this.nomineeForm1.controls.panverifyClick.value);
        
        
        if (this.pantest == "34" && this.NomineeOpted ==='N') {
          let nominee1Valid =this.numOfNominees ==='One' || this.numOfNominees ==='Two' || this.numOfNominees ==='Three'
          let nominee2Valid =this.numOfNominees ==='Two' || this.numOfNominees ==='Three'
          let nominee3Valid =this.numOfNominees ==='Three'
          if((this.panvalid == 'N1' && !this.nomineeForm1.controls.panverifyClick.value && nominee1Valid) || (this.panvalid == 'N2' && !this.nomineeForm2.controls.panverifyClick.value && nominee2Valid) || (this.panvalid == 'N3' && !this.nomineeForm3.controls.panverifyClick.value && nominee3Valid))
            //  (this.panvalid == 'G1' && !this.nomineeForm1.controls.guardianpanverifyClick.value) || (this.panvalid == 'G2' && !this.nomineeForm2.controls.guardianpanverifyClick.value) || (this.panvalid == 'G3' && !this.nomineeForm3.controls.guardianpanverifyClick.value))
          { 
            this.notif.error('Please Verify Pan No', '')
            return
          }
          if(this.newPanService && ((this.panvalid == 'N1' && this.nomineeForm1.controls.nameverifiedITD.value !=='Y' && nominee1Valid) || (this.panvalid == 'N2' && this.nomineeForm2.controls.nameverifiedITD.value !=='Y' && nominee2Valid) || (this.panvalid == 'N3' && this.nomineeForm3.controls.nameverifiedITD.value !=='Y' && nominee3Valid)))
            //  (this.panvalid == 'G1' && this.nomineeForm1.controls.guardiannameverifiedITD.value !=='Y') || (this.panvalid == 'G2' && this.nomineeForm2.controls.guardiannameverifiedITD.value !=='Y') || (this.panvalid == 'G3' && this.nomineeForm3.controls.guardiannameverifiedITD.value !=='Y'))
          {
            this.notif.error('Name on PAN Card does not match with ITD records, please retry', '')
            return
          }
          if((this.newPanService && (this.panvalid == 'N1' && this.nomineeForm1.controls.dobverifiedITD.value !=='Y' && nominee1Valid) || (this.panvalid == 'N2' && this.nomineeForm2.controls.dobverifiedITD.value !=='Y' && nominee2Valid) || (this.panvalid == 'N3' && this.nomineeForm3.controls.dobverifiedITD.value !=='Y' && nominee3Valid)))
            //  (this.panvalid == 'G1' && this.nomineeForm1.controls.guardiandobverifiedITD.value !=='Y') || (this.panvalid == 'G2' && this.nomineeForm2.controls.guardiandobverifiedITD.value !=='Y') || (this.panvalid == 'G3' && this.nomineeForm3.controls.guardiandobverifiedITD.value !=='Y'))
          {
            this.notif.error('DOB does not match with ITD records, please retry', '')
            return
          }
          // if (this.panvalid == 'N1' && (this.panholder1 == undefined || this.panholder1 == '' || !this.panholder1 || this.panholder1.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
          // if (this.panvalid == 'G1' && (this.panholder2 == undefined || this.panholder2 == '' || !this.panholder2 || this.panholder2.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
          // if (this.panvalid == 'N2' && (this.panholder3 == undefined || this.panholder3 == '' || !this.panholder3 || this.panholder3.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
          // if (this.panvalid == 'G2' && (this.panholder4 == undefined || this.panholder4 == '' || !this.panholder4 || this.panholder4.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
          // if (this.panvalid == 'N3' && (this.panholder5 == undefined || this.panholder5 == '' || !this.panholder5 || this.panholder5.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
          // if (this.panvalid == 'G3' && (this.panholder6 == undefined || this.panholder6 == '' || !this.panholder6 || this.panholder6.trim() == '') ) {
          //   debugger
          //   this.notif.error('Please Verify PanNo', '')
          //   return
          // }
        }
        let validNominee1
        // let validNominee1 = this.cmServ.validateForm(this.form.controls.firstNomineeDetails, this.FormControlNames, this.Label);
        console.log('nominee check', this.numOfNominees, this.form.controls.firstNomineeDetails, this.NomineeOpted);
        if (this.numOfNominees == 'One' && this.form.controls.firstNomineeDetails.status == 'INVALID') {
          validNominee1 = this.cmServ.validateForm(this.form.controls.firstNomineeDetails, this.FormControlNames, this.Label);
        }
        else {
          validNominee1 = true
        }
        // let validNominee1;
        // if (this.NomineeOpted == 'N')
        //   validNominee1 = this.cmServ.validateForm(this.form.controls.firstNomineeDetails, this.FormControlNames, this.Label);
        // else
        //   validNominee1 = true
        if (validNominee1) {

          let identificationvalidn1 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee1Fields, "nomineeproof", "nomineeproof1"), "first nominee")
          let identificationvalidg1 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian1Fields, "guardianproof", "guardianproof1"), "first guardian")

          let identificationvalidn2 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee2Fields, "nomineeproof", "nomineeproof2"), "second nominee")
          let identificationvalidg2 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian2Fields, "guardianproof", "guardianproof2"), "second guardian")

          let identificationvalidn3 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee3Fields, "nomineeproof", "nomineeproof3"), "third nominee")
          let identificationvalidg3 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian3Fields, "guardianproof", "guardianproof3"), "third guardian")

          if (identificationvalidn1) {
            if (identificationvalidg1) {
              if (identificationvalidn2) {
                if (identificationvalidg2) {
                  if (identificationvalidn3) {
                    if (identificationvalidg3) {
                      let data1 = []

                      let Nominee1 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee1Fields, "nomineeproof", "nomineeproof1"));
                      let Gardian1 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian1Fields, "guardianproof", "guardianproof1"));
                      data1.push({ ...this.form.controls.firstNomineeDetails.value, ...Nominee1, ...Gardian1 });
                      this.firstNomineeDetailsXML = jsonxml(data1);
                      console.log("firstNomineeDetailsXML", this.firstNomineeDetailsXML);

                      let validNominee2
                      // let validNominee2 = this.cmServ.validateForm(this.form.controls.SecondNomineeDetails, this.FormControlNames, this.Label);
                      if (this.numOfNominees == 'Two' && this.form.controls.SecondNomineeDetails.status == 'INVALID') {
                        validNominee2 = this.cmServ.validateForm(this.form.controls.SecondNomineeDetails, this.FormControlNames, this.Label);
                      }
                      else {
                        validNominee2 = true
                      }
                      if (validNominee2) {
                        let Nominee2 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee2Fields, "nomineeproof", "nomineeproof2"));
                        let Gardian2 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian2Fields, "guardianproof", "guardianproof2"));
                        let data2 = []
                        data2.push({ ...this.form.controls.SecondNomineeDetails.value, ...Nominee2, ...Gardian2 })
                        this.SecondNomineeDetailsXML = jsonxml(data2);
                        console.log("SecondNomineeDetailsXML", this.SecondNomineeDetailsXML);

                        let validNominee3
                        // let validNominee3 = this.cmServ.validateForm(this.form.controls.ThirdNomineeDetails, this.FormControlNames, this.Label);
                        if (this.numOfNominees == 'Three' && this.form.controls.ThirdNomineeDetails.status == 'INVALID') {
                          validNominee3 = this.cmServ.validateForm(this.form.controls.ThirdNomineeDetails, this.FormControlNames, this.Label);
                        }
                        else {
                          validNominee3 = true
                        }
                        if (validNominee3) {
                          let percentagevalid
                          if (this.numOfNominees != 'nomineeOpt') {
                            percentagevalid = this.checkPercentOfShare();
                          }
                          else {
                            percentagevalid = true
                          }

                          if (percentagevalid) {
                            var nomineevalid: boolean = false;
                            if (action == 'save') {
                              nomineevalid = this.ValidateNominee()
                              this.disableFld = true;
                            }
                            else {
                              nomineevalid = true
                            }
                            let proofvalid
                            if (action == 'savefinalise') {
                              debugger
                              proofvalid = this.ValidateNomineeproof()
                              // this.firstHolderInvalidvalidation()

                            }
                            else {
                              proofvalid = true
                            }

                            // let proofvalid = true
                            if (nomineevalid && proofvalid) {
                              let Nominee3 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee3Fields, "nomineeproof", "nomineeproof3"));
                              let Gardian3 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian3Fields, "guardianproof", "guardianproof3"));
                              let data3 = []
                              data3.push({ ...this.form.controls.ThirdNomineeDetails.value, ...Nominee3, ...Gardian3 })
                              this.ThirdNomineeDetailsXML = jsonxml(data3);
                              var proof = []
                              proof = this.img.setDataForxml();
                              var nomineedetails: any = [];
                              nomineedetails.push({ "NomineeOptOut": this.NomineeOpted })
                              nomineedetails.push({ "equalShareFlag": this.form.controls.nomineeEqualShareForNominess.value ? this.form.controls.nomineeEqualShareForNominess.value : false });
                              nomineedetails.push({ "TradingNominee": 1 });
                              nomineedetails.push({ "FirstNomineeDetails": this.firstNomineeDetailsXML });
                              nomineedetails.push({ "SecondNomineeDetails": this.SecondNomineeDetailsXML })
                              nomineedetails.push({ "ThirdNomineeDetails": this.ThirdNomineeDetailsXML });

                              var NomineeFulldetail: any = [];
                              NomineeFulldetail.push({ "NomineeDetails": nomineedetails });
                              NomineeFulldetail.push({ "ApplicableAccounts": this.ChangeAccounts });
                              NomineeFulldetail.push({ "ProofUpload": proof });
                              NomineeFulldetail.push({ "VerificationStatus": this.verificationstatus })
                              var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(NomineeFulldetail)
                              var nomineeDetailsxml = jsonxml(nomineeDetailsjson);

                              if (action == 'savefinalise') {
                                // this.firstHolderInvalidvalidation()

                                var documents = [];
                                documents = this.img.reternImagefinalArray()
                                // choosed dropdown value
                                let appFormReceived: boolean = false
                                if (documents && documents.length > 0) {
                                  documents.forEach(item => {
                                    console.log("documents uploaded for Opting out", documents, 'NomineeOpted', this.nomineeOptingBtn, 'nomineeOpting', this.nomineeOpting);
                                    if (this.numOfNominees == 'nomineeOpt') {
                                      if (item.ProofDoc.DocName == 'Nominee opt out form') {
                                        appFormReceived = true
                                      }
                                    }
                                    else {
                                      if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
                                        appFormReceived = true
                                      }
                                    }
                                  })
                                  if (this.numOfNominees == 'nomineeOpt') {
                                    if (!appFormReceived) {
                                      this.notif.error('Nominee opt out form not uploaded', '')
                                      console.log('clearing upload file data', this.img.SupportFiles.length = 0);
                                      this.img.SupportFiles.length = 0
                                      return
                                    }
                                    else {
                                      var documentJson = this.utilServ.setJSONMultipleArray(documents)
                                      var documentxmldata = jsonxml(documentJson)
                                      var documentxml = documentxmldata.replace(/&/gi, '&amp;')
                                    }
                                  }
                                  if (!appFormReceived) {
                                    this.notif.error('Application form not uploaded', '')
                                    this.img.SupportFiles.length = 0
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

                                if (this.dematvalid) {
                                  console.log("akkkk");

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
                                    FileData: nomineeDetailsxml.replace(/&/gi, '&amp;'),
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
                                "outTblCount": "0",
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
                                    IDNO: this.IDNO || this.OptedEntry,
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
                                        // this.firstHolderInvalidvalidation()


                                        this.BackButtonClick()
                                        return
                                      }
                                      else {
                                        this.applicationStatus = 'T';
                                        this.cmServ.applicationStatus.next(this.applicationStatus);
                                        this.disableFields();
                                        this.IDNO = response.results[0][0].requestID;
                                        this.modal.info({
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
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    // this.showtext=false;
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
  ValidateNominee() {
    var nominee1: any = this.form.controls.firstNomineeDetails
    var nominee2: any = this.form.controls.SecondNomineeDetails;
    var nominee3: any = this.form.controls.ThirdNomineeDetails;

    let aadhaarValid: boolean = false;
    aadhaarValid = this.aadharValidation()
    if (aadhaarValid) {
      var conditionarray = ["Friend", "Father-In-Law", "Mother-In-Law", "Nephew"]
      if (this.enbleCDSL) {
        if (conditionarray.indexOf(nominee1.controls.nomineeRelationshipwithapplicant.value) != -1) {
          this.notif.error('First nominee relation cant be ' + nominee1.controls.nomineeRelationshipwithapplicant.value + '', '')
          return false;
        }
        if (conditionarray.indexOf(nominee2.controls.nomineeRelationshipwithapplicant.value) != -1) {
          this.notif.error('Second nominee relation cant be ' + nominee2.controls.nomineeRelationshipwithapplicant.value + '', '')
          return false;
        }
        if (conditionarray.indexOf(nominee3.controls.nomineeRelationshipwithapplicant.value) != -1) {
          this.notif.error('Third nominee relation cant be ' + nominee3.controls.nomineeRelationshipwithapplicant.value + '', '')
          return false;
        }
        return true
      }
      return true
    }
    else {
      return false
    }
  }
  ValidateNomineeproof() {
    debugger
    var nominee1: any = this.form.controls.firstNomineeDetails
    var nominee2: any = this.form.controls.SecondNomineeDetails;
    var nominee3: any = this.form.controls.ThirdNomineeDetails;
    var crfForm: boolean = false;
    var nomineeim1: boolean = false;
    var nomineeim2: boolean = false;
    var nomineeim3: boolean = false;
    var scan: boolean = false;
    var demat: boolean = false;
    var identity = [nominee1.controls.nomineeNomineeIdentificaitonDetails.value,
    nominee2.controls.nomineeNomineeIdentificaitonDetails.value,
    nominee3.controls.nomineeNomineeIdentificaitonDetails.value]

    var proofarray = this.img.SupportFiles;
    console.log("proofarray", proofarray);

    // if (!proofarray.length) {
    //   this.notif.error("Please upload the proof", '');
    //   return false
    // }
    console.log("kk", identity);
    console.log("proof", proofarray);


    for (var i = 0; i < identity.length; i++) {
      console.log("iiii", i);
      console.log("identity", identity[i]);





      console.log("loh", nominee1.controls.nomineeNomineeIdentificaitonDetails.value);

      let nomproof = false;
      if (identity[i] == '' || identity[i] == null) { return true } else {
        if (identity[i] == '06' || identity[i] == '34') {
          nomproof = true;
        }
        else {
          nomproof = false;


        }

        if (i == 0 && identity[i] == '07') {
          demat = true;

        }
        else {
          demat = false;
        }

        if (!nomproof) {

          console.log("proof", proofarray);


          let nomproof1 = false;
          let dematproof1 = false;
          let dematproof2 = false;
          let dematproof3 = false

          // this.firstHolderInvalid=false;
          for (var j = 0; j < proofarray.length; j++) {
            debugger
            if (proofarray[j].DocName == 'Nominee Form Page ' + [i + 1]) {

              nomproof1 = true;





            }
            if (proofarray[j].DocName == 'Demat Account CML(NomineeOne)') {
              debugger
              dematproof1 = true;
            }
            if (proofarray[j].DocName == 'Demat Account CML(NomineeTwo)') {
              debugger
              dematproof2 = true;
            }
            if (proofarray[j].DocName == 'Demat Account CML(NomineeThree)') {
              debugger
              dematproof3 = true;
            }

          }
          console.log("nom", nomproof1);
          console.log("demat", demat);
          console.log("aaaa", i);



          if (!nomproof1) {
            debugger


            console.log("aaaa", i);

            if (i == 0) {

              this.notif.error("Please upload first nominee proof (Nominee Form Page)", '');
              return false
            }

            if (i == 1) {
              this.notif.error("Please upload second nominee proof (Nominee Form Page)", '');
              return false
            }
            if (i == 2) {
              this.notif.error("Please upload third nominee proof (Nominee Form Page)", '');
              return false
            }


          }
          if (!dematproof1 && this.firstHolderInvalid == true) {
            debugger
            if (i == 0) {

              this.notif.error("Please upload  first nominee cml file ", '');
              // demat = false
              // this.firstHolderInvalid=false;
              return false
            }




          }
          if (!dematproof2 && this.secondHolderInvalid == true) {
            if (i == 1) {
              this.notif.error("Please upload  second nominee cml file", '');
              // this.firstHolderInvalid=false;
              return false
            }
          }
          if (!dematproof3 && this.thirdHolderInvalid == true) {
            if (i == 2) {
              this.notif.error("Please upload  third nominee cml file", '');
              // this.firstHolderInvalid=false;
              return false
            }

          }

          //   if (!dematproof2 && this.firstHolderInvalid2 ==true) {debugger
          //     if (i == 0) {

          //     this.notif.error("Please upload  first nominee cml file ", '');
          //     // demat = false
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }
          //   if (i == 1) {
          //     this.notif.error("Please upload  second nominee cml file", '');
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }
          //   if (i == 2) {
          //     this.notif.error("Please upload  third nominee cml file", '');
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }

          // }
          //   if (!dematproof3 && this.firstHolderInvalid3 ==true) {debugger
          //     if (i == 0) {

          //     this.notif.error("Please upload  first nominee cml file ", '');
          //     // demat = false
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }
          //   if (i == 1) {
          //     this.notif.error("Please upload  second nominee cml file", '');
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }
          //   if (i == 2) {
          //     this.notif.error("Please upload  third nominee cml file", '');
          //     // this.firstHolderInvalid=false;
          //     return false
          //   }

          // }

        }
      }
    }

    var notlisted: any = [];
    var mandatproofs = this.img.Mandatoryproofs;
    mandatproofs.forEach(element => {
      nomineeim1 = false
      proofarray.forEach(item => {
        if (element.Document == item.Docname || element.Document == item.DocName) {
          nomineeim1 = true;
          return
        }
      })
      if (!nomineeim1) {
        if (this.numOfNominees == "One") {
          if (element["slno"] != 45 && element["slno"] != 46) {
            notlisted.push(Number(element["slno"]))
          }
        }
        else if (this.numOfNominees == "Two") {
          if (element["slno"] != 46) {
            notlisted.push(Number(element["slno"]))
          }
        }

        else {
          notlisted.push(Number(element["slno"]))
        }
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
    //   if (item.Docname == 44) {
    //     nomineeim1 = true;
    //   }
    //   if (nominee2.controls.nomineeFirstName.value) {
    //     if (item.Docname == 45) {
    //       nomineeim2 = true;
    //     }
    //   }
    //   if (nominee3.controls.nomineeFirstName.value) {
    //     if (item.Docname == 46) {
    //       nomineeim3 = true;
    //     }
    //   }
    // })

    // if (!crfForm) {
    //   this.notif.error(" Please Upload CRF Form", '');
    //   return false;
    // }
    // if (!nomineeim1) {
    //   this.notif.error(" Upload first nominee proof", '');
    //   return false;
    // }
    // if (nominee2.controls.nomineeFirstName.value) {
    //   if (!nomineeim2) {
    //     this.notif.error(" Upload Second nominee proof", '');
    //     return false;
    //   }
    // }
    // if (nominee3.controls.nomineeFirstName.value) {
    //   if (!nomineeim3) {
    //     this.notif.error(" Upload third nominee proof", '');
    //     return false;
    //   }
    // }
    // return true;
  }
  FillApproveData() {
    var dataforapprove = this.dataforaprove[0];


    console.log("dataapprove1", this.dataforaprove);
    var dataappr = dataforapprove && dataforapprove.F_Nameasinpan ? dataforapprove.F_Nameasinpan : ''
    console.log("F_Nameasinpan1", dataappr);
    this.IDNO = dataforapprove.Request_IDNO
    this.SerialNumber = dataforapprove.Request_IDNO;
    let nominee1: any = this.form.controls.firstNomineeDetails;
    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;
    let rejection: any = this.form.controls.Rejection;

    this.form.controls.nomineeEqualShareForNominess.setValue(dataforapprove.SharepercEqual == 'true' ? true : false);
    // disable begin
    // nominee1.controls.nomineeTitle.disable()
    this.disableFields();
    // disable end
    if (dataforapprove.T_nomineeTitle && dataforapprove.T_nomineeFirstName) {
      this.dsNominee2 = false;
      this.dsNominee3 = false;
      this.numOfNominees = "Three"
      this.SetNomineeNumber('Three');
      this.dsNominee1 = false;
    }
    else if (dataforapprove.S_nomineeTitle && dataforapprove.S_nomineeFirstName) {
      this.dsNominee2 = false;
      this.dsNominee3 = true;
      this.numOfNominees = "Two"
      this.SetNomineeNumber('Two');
      this.dsNominee1 = false;
    }
    else {
      this.dsNominee2 = true;
      this.dsNominee3 = true;
      this.numOfNominees = "One"
      this.SetNomineeNumber('One');
      this.dsNominee1 = false;
    }


    nominee1.controls.nomineeTitle.setValue(dataforapprove.F_nomineeTitle)
    nominee1.controls.nomineeFirstName.setValue(dataforapprove.F_nomineeFirstName)
    nominee1.controls.nomineeMiddleName.setValue(dataforapprove.F_nomineeMiddleName)
    nominee1.controls.nomineeLastName.setValue(dataforapprove.F_nomineeLastName)

    // nominee1.controls.nomineeEqualShareForNominess.setValue(dataforapprove.F_nomineeEqualShareForNominess)

    //nominee1.controls.nomineeResidualshares.patchValue(dataforapprove.F_nomineeResidualshares)
    nominee1.controls.nomineeRelationshipwithapplicant.setValue(dataforapprove.F_nomineeRelationshipwithapplicant)
    nominee1.controls.nomineeHouseName.setValue(dataforapprove.F_nomineeHouseName)
    nominee1.controls.nomineeHouseNumber.setValue(dataforapprove.F_nomineeHouseNumber)
    nominee1.controls.nomineeStreet.setValue(dataforapprove.F_nomineeStreet)
    nominee1.controls.nomineePin.setValue(dataforapprove.F_nomineePin)
    nominee1.controls.nomineeCity.setValue(dataforapprove.F_nomineeCity)
    nominee1.controls.nomineeState.setValue(dataforapprove.F_nomineeState)
    nominee1.controls.BOCategory.setValue(dataforapprove.F_BOCategory)
    nominee1.controls.nomineeCountry.setValue(dataforapprove.F_nomineeCountry)
    nominee1.controls.nomineeMobile.setValue(dataforapprove.F_nomineeMobile)
    nominee1.controls.nomineeTelephoneNumber.setValue(dataforapprove.F_nomineeTelephoneNumber)
    nominee1.controls.nomineeEmailID.setValue(dataforapprove.F_nomineeEmailID)
    nominee1.controls.sharePercentage.setValue(dataforapprove.F_sharePercentage)
    nominee1.controls.isdCodeMobile.setValue(dataforapprove.F_isdCodeMobile)
    nominee1.controls.isdCodeTelephone.setValue(dataforapprove.F_isdCodeTelephone)
    nominee1.controls.stdCodetelephone.setValue(dataforapprove.F_stdCodetelephone)
    // nominee1.controls.nomineeNomineeIdentificaitonDetails.setValue(dataforapprove.F_nomineeNomineeIdentificaitonDetails)
    // nominee1.controls.nomineePAN.setValue(dataforapprove.F_nomineePAN)
    // nominee1.controls.nomineeAadhar.setValue(dataforapprove.F_nomineeAadhar)
    nominee1.controls.nomineeDOB.setValue(dataforapprove.F_nomineeDOB)
    this.panholder1 = dataforapprove.F_Nameasinpan

    nominee1.controls.guardianTitle.setValue(dataforapprove.F_guardianTitle)
    nominee1.controls.guardianFirstName.setValue(dataforapprove.F_guardianFirstName)
    nominee1.controls.guardianMiddleName.setValue(dataforapprove.F_guardianMiddleName)
    nominee1.controls.guardianLastName.setValue(dataforapprove.F_guardianLastName)
    nominee1.controls.guardianRelationshipofGuardian.setValue(dataforapprove.F_guardianRelationshipofGuardian)
    nominee1.controls.guardianHouseName.setValue(dataforapprove.F_guardianHouseName)
    nominee1.controls.guardianHouseNumber.setValue(dataforapprove.F_guardianHouseNumber)
    nominee1.controls.guardianStreet.setValue(dataforapprove.F_guardianStreet)
    nominee1.controls.guardianPin.setValue(dataforapprove.F_guardianPin)
    nominee1.controls.guardianCity.setValue(dataforapprove.F_guardianCity)
    nominee1.controls.guardianState.setValue(dataforapprove.F_guardianState)
    nominee1.controls.guardianCountry.setValue(dataforapprove.F_guardianCountry)
    nominee1.controls.guardianTelephoneNumber.setValue(dataforapprove.F_guardianTelephoneNumber)
    nominee1.controls.guardianMobile.setValue(dataforapprove.F_guardianMobile)
    nominee1.controls.guardianEmailID.setValue(dataforapprove.F_guardianEmailID)
    this.panholder2 = dataforapprove.F_GuardianNameasinpan



    // nominee1.controls.guardianIdentificaitonDetails.setValue(dataforapprove.F_guardianIdentificaitonDetails)
    // nominee1.controls.guardianAaadhar.setValue(dataforapprove.F_guardianAaadhar)
    // nominee1.controls.guardianPAN.setValue(dataforapprove.F_guardianPAN)
    var Nomineeproof1 = { "nomineeproof10": dataforapprove.F_nomineeproof0, "nomineeproof11": dataforapprove.F_nomineeproof1, "nomineeproof12": dataforapprove.F_nomineeproof2, "nomineeproof13": dataforapprove.F_nomineeproof3 }
    var Gadianproof1 = { "guardianproof10": dataforapprove.F_guardianproof0, "guardianproof11": dataforapprove.F_guardianproof1, "guardianproof12": dataforapprove.F_guardianproof2, "guardianproof13": dataforapprove.F_guardianproof3 }
    this.patchNominee1Data(dataforapprove.F_nomineeNomineeIdentificaitonDetails, Nomineeproof1);
    this.patchGardian1Data(dataforapprove.F_guardianIdentificaitonDetails, Gadianproof1);

    nominee2.controls.nomineeTitle.setValue(dataforapprove.S_nomineeTitle)
    nominee2.controls.nomineeFirstName.setValue(dataforapprove.S_nomineeFirstName)
    nominee2.controls.nomineeMiddleName.setValue(dataforapprove.S_nomineeMiddleName)
    nominee2.controls.nomineeLastName.setValue(dataforapprove.S_nomineeLastName)

    // nominee2.controls.nomineeEqualShareForNominess.setValue(dataforapprove.S_nomineeEqualShareForNominess)
    // nominee2.controls.nomineeEqualShareForNominess.setValue("No")
    //nominee2.controls.nomineeResidualshares.setValue(dataforapprove.S_nomineeResidualshares)
    nominee2.controls.nomineeRelationshipwithapplicant.setValue(dataforapprove.S_nomineeRelationshipwithapplicant)
    nominee2.controls.nomineeHouseName.setValue(dataforapprove.S_nomineeHouseName)
    nominee2.controls.nomineeHouseNumber.setValue(dataforapprove.S_nomineeHouseNumber)
    nominee2.controls.nomineeStreet.setValue(dataforapprove.S_nomineeStreet)
    nominee2.controls.nomineePin.setValue(dataforapprove.S_nomineePin)
    nominee2.controls.nomineeCity.setValue(dataforapprove.S_nomineeCity)
    nominee2.controls.nomineeState.setValue(dataforapprove.S_nomineeState)
    nominee2.controls.BOCategory.setValue(dataforapprove.S_BOCategory)
    nominee2.controls.nomineeCountry.setValue(dataforapprove.S_nomineeCountry)
    nominee2.controls.nomineeMobile.setValue(dataforapprove.S_nomineeMobile)
    nominee2.controls.nomineeTelephoneNumber.setValue(dataforapprove.S_nomineeTelephoneNumber)
    nominee2.controls.nomineeEmailID.setValue(dataforapprove.S_nomineeEmailID)
    nominee2.controls.sharePercentage.setValue(dataforapprove.S_sharePercentage)
    nominee2.controls.isdCodeMobile.setValue(dataforapprove.S_isdCodeMobile)
    nominee2.controls.isdCodeTelephone.setValue(dataforapprove.S_isdCodeTelephone)
    nominee2.controls.stdCodetelephone.setValue(dataforapprove.S_stdCodetelephone)
    // nominee2.controls.nomineeNomineeIdentificaitonDetails.setValue(dataforapprove.S_nomineeNomineeIdentificaitonDetails)
    // nominee2.controls.nomineePAN.setValue(dataforapprove.S_nomineePAN)
    // nominee2.controls.nomineeAadhar.setValue(dataforapprove.S_nomineeAadhar)
    nominee2.controls.nomineeDOB.setValue(dataforapprove.S_nomineeDOB)
    this.panholder3 = dataforapprove.S_Nameasinpan

    nominee2.controls.guardianTitle.setValue(dataforapprove.S_guardianTitle)
    nominee2.controls.guardianFirstName.setValue(dataforapprove.S_guardianFirstName)
    nominee2.controls.guardianMiddleName.setValue(dataforapprove.S_guardianMiddleName)
    nominee2.controls.guardianLastName.setValue(dataforapprove.S_guardianLastName)
    nominee2.controls.guardianRelationshipofGuardian.setValue(dataforapprove.S_guardianRelationshipofGuardian)
    nominee2.controls.guardianHouseName.setValue(dataforapprove.S_guardianHouseName)
    nominee2.controls.guardianHouseNumber.setValue(dataforapprove.S_guardianHouseNumber)
    nominee2.controls.guardianStreet.setValue(dataforapprove.S_guardianStreet)
    nominee2.controls.guardianPin.setValue(dataforapprove.S_guardianPin)
    nominee2.controls.guardianCity.setValue(dataforapprove.S_guardianCity)
    nominee2.controls.guardianState.setValue(dataforapprove.S_guardianState)
    nominee2.controls.guardianCountry.setValue(dataforapprove.S_guardianCountry)
    nominee2.controls.guardianTelephoneNumber.setValue(dataforapprove.S_guardianTelephoneNumber)
    nominee2.controls.guardianMobile.setValue(dataforapprove.S_guardianMobile)
    nominee2.controls.guardianEmailID.setValue(dataforapprove.S_guardianEmailID)
    this.panholder4 = dataforapprove.S_GuardianNameasinpan
    // nominee2.controls.guardianIdentificaitonDetails.setValue(dataforapprove.S_guardianIdentificaitonDetails)
    // nominee2.controls.guardianAaadhar.setValue(dataforapprove.S_guardianAaadhar)
    // nominee2.controls.guardianPAN.setValue(dataforapprove.S_guardianPAN)
    var Nomineeproof2 = { "nomineeproof20": dataforapprove.S_nomineeproof0, "nomineeproof21": dataforapprove.S_nomineeproof1, "nomineeproof22": dataforapprove.S_nomineeproof2, "nomineeproof23": dataforapprove.S_nomineeproof3 }
    var Gadianproof2 = { "guardianproof20": dataforapprove.S_guardianproof0, "guardianproof21": dataforapprove.S_guardianproof1, "guardianproof22": dataforapprove.S_guardianproof2, "guardianproof23": dataforapprove.S_guardianproof3 }
    this.patchNominee2Data(dataforapprove.S_nomineeNomineeIdentificaitonDetails, Nomineeproof2);
    this.patchGardian2Data(dataforapprove.S_guardianIdentificaitonDetails, Gadianproof2);
    nominee3.controls.nomineeTitle.setValue(dataforapprove.T_nomineeTitle)
    nominee3.controls.nomineeFirstName.setValue(dataforapprove.T_nomineeFirstName)
    nominee3.controls.nomineeMiddleName.setValue(dataforapprove.T_nomineeMiddleName)
    nominee3.controls.nomineeLastName.setValue(dataforapprove.T_nomineeLastName)


    // nominee3.controls.nomineeEqualShareForNominess.setValue(dataforapprove.T_nomineeEqualShareForNominess)

    // nominee3.controls.nomineeResidualshares.setValue(dataforapprove.T_nomineeResidualshares)
    nominee3.controls.nomineeRelationshipwithapplicant.setValue(dataforapprove.T_nomineeRelationshipwithapplicant)
    nominee3.controls.nomineeHouseName.setValue(dataforapprove.T_nomineeHouseName)
    nominee3.controls.nomineeHouseNumber.setValue(dataforapprove.T_nomineeHouseNumber)
    nominee3.controls.nomineeStreet.setValue(dataforapprove.T_nomineeStreet)
    nominee3.controls.nomineePin.setValue(dataforapprove.T_nomineePin)
    nominee3.controls.nomineeCity.setValue(dataforapprove.T_nomineeCity)
    nominee3.controls.nomineeState.setValue(dataforapprove.T_nomineeState)
    nominee3.controls.BOCategory.setValue(dataforapprove.T_BOCategory)
    nominee3.controls.nomineeCountry.setValue(dataforapprove.T_nomineeCountry)
    nominee3.controls.nomineeMobile.setValue(dataforapprove.T_nomineeMobile)
    nominee3.controls.nomineeTelephoneNumber.setValue(dataforapprove.T_nomineeTelephoneNumber)
    nominee3.controls.nomineeEmailID.setValue(dataforapprove.T_nomineeEmailID)
    nominee3.controls.sharePercentage.setValue(dataforapprove.T_sharePercentage)
    nominee3.controls.isdCodeMobile.setValue(dataforapprove.T_isdCodeMobile)
    nominee3.controls.isdCodeTelephone.setValue(dataforapprove.T_isdCodeTelephone)
    nominee3.controls.stdCodetelephone.setValue(dataforapprove.T_stdCodetelephone)
    // nominee3.controls.nomineeNomineeIdentificaitonDetails.setValue(dataforapprove.T_nomineeNomineeIdentificaitonDetails)
    // nominee3.controls.nomineePAN.setValue(dataforapprove.T_nomineePAN)
    // nominee3.controls.nomineeAadhar.setValue(dataforapprove.T_nomineeAadhar)
    nominee3.controls.nomineeDOB.setValue(dataforapprove.T_nomineeDOB)
    this.panholder5 = dataforapprove.T_Nameasinpan

    nominee3.controls.guardianTitle.setValue(dataforapprove.T_guardianTitle)
    nominee3.controls.guardianFirstName.setValue(dataforapprove.T_guardianFirstName)
    nominee3.controls.guardianMiddleName.setValue(dataforapprove.T_guardianMiddleName)
    nominee3.controls.guardianLastName.setValue(dataforapprove.T_guardianLastName)
    nominee3.controls.guardianRelationshipofGuardian.setValue(dataforapprove.T_guardianRelationshipofGuardian)
    nominee3.controls.guardianHouseName.setValue(dataforapprove.T_guardianHouseName)
    nominee3.controls.guardianHouseNumber.setValue(dataforapprove.T_guardianHouseNumber)
    nominee3.controls.guardianStreet.setValue(dataforapprove.T_guardianStreet)
    nominee3.controls.guardianPin.setValue(dataforapprove.T_guardianPin)
    nominee3.controls.guardianCity.setValue(dataforapprove.T_guardianCity)
    nominee3.controls.guardianState.setValue(dataforapprove.T_guardianState)
    nominee3.controls.guardianCountry.setValue(dataforapprove.T_guardianCountry)
    nominee3.controls.guardianTelephoneNumber.setValue(dataforapprove.T_guardianTelephoneNumber)
    nominee3.controls.guardianMobile.setValue(dataforapprove.T_guardianMobile)
    nominee3.controls.guardianEmailID.setValue(dataforapprove.T_guardianEmailID)
    this.panholder6 = dataforapprove.T_GuardianNameasinpan
    // nominee3.controls.guardianIdentificaitonDetails.setValue(dataforapprove.T_guardianIdentificaitonDetails)
    // nominee3.controls.guardianAaadhar.setValue(dataforapprove.T_guardianAaadhar)
    // nominee3.controls.guardianPAN.setValue(dataforapprove.T_guardianPAN)
    var Nomineeproof3 = { "nomineeproof30": dataforapprove.T_nomineeproof0, "nomineeproof31": dataforapprove.T_nomineeproof1, "nomineeproof32": dataforapprove.T_nomineeproof2, "nomineeproof33": dataforapprove.T_nomineeproof3 }
    var Gadianproof3 = { "guardianproof30": dataforapprove.T_guardianproof0, "guardianproof31": dataforapprove.T_guardianproof1, "guardianproof32": dataforapprove.T_guardianproof2, "guardianproof33": dataforapprove.T_guardianproof3 }
    this.patchNominee3Data(dataforapprove.T_nomineeNomineeIdentificaitonDetails, Nomineeproof3);
    this.patchGardian3Data(dataforapprove.T_guardianIdentificaitonDetails, Gadianproof3);
    // rejection.controls.RejRemarks.setValue(dataforapprove.RejectedReason);
    if (this.applicationStatus == 'A') {
      rejection.controls.AppRemarks.setValue(dataforapprove.RejectedReason)
    }
    else {
      rejection.controls.RejRemarks.setValue(dataforapprove.RejectedReason || '');
    }
    this.form.controls.tradeNominee.patchValue(dataforapprove.TradingNominee)
    // this.form.controls.tradeNominee.patchValue(2)
  }

  disableFields() {

    let nominee1: any = this.form.controls.firstNomineeDetails;
    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;
    if ((this.applicationStatus == 'P') || this.nomineeOpting || this.applicationStatus == 'F' || this.applicationStatus == 'T' || this.applicationStatus == 'A') {
      this.numOfNomineesdisable = true;
      this.form.controls.nomineeEqualShareForNominess.disable();
      nominee1.controls.nomineeFirstName.disable();
      nominee1.controls.nomineeMiddleName.disable();
      nominee1.controls.nomineeLastName.disable();
      nominee1.controls.nomineeHouseName.disable();
      nominee1.controls.nomineeHouseNumber.disable();
      nominee1.controls.nomineeStreet.disable();
      nominee1.controls.nomineePin.disable();
      nominee1.controls.nomineeCity.disable();
      nominee1.controls.nomineeState.disable();
      nominee1.controls.BOCategory.disable();
      nominee1.controls.nomineeCountry.disable();
      nominee1.controls.nomineeMobile.disable();
      nominee1.controls.nomineeTelephoneNumber.disable();
      nominee1.controls.nomineeEmailID.disable();
      nominee1.controls.sharePercentage.disable();
      nominee1.controls.nomineeDOB.disable();
      nominee1.controls.isdCodeMobile.disable();
      nominee1.controls.isdCodeTelephone.disable();
      nominee1.controls.stdCodetelephone.disable();
      nominee1.controls.guardianFirstName.disable();
      nominee1.controls.guardianMiddleName.disable();
      nominee1.controls.guardianLastName.disable();
      nominee1.controls.guardianHouseName.disable();
      nominee1.controls.guardianHouseNumber.disable();
      nominee1.controls.guardianStreet.disable();
      nominee1.controls.guardianPin.disable();
      nominee1.controls.guardianCity.disable();
      nominee1.controls.guardianState.disable();
      nominee1.controls.guardianCountry.disable();
      nominee1.controls.guardianTelephoneNumber.disable();
      nominee1.controls.guardianMobile.disable();
      nominee1.controls.guardianEmailID.disable();
      nominee2.controls.nomineeFirstName.disable();
      nominee2.controls.nomineeMiddleName.disable();
      nominee2.controls.nomineeLastName.disable();
      nominee2.controls.nomineeHouseName.disable();
      nominee2.controls.nomineeHouseNumber.disable();
      nominee2.controls.nomineeStreet.disable();
      nominee2.controls.nomineePin.disable();
      nominee2.controls.nomineeCity.disable();
      nominee2.controls.nomineeState.disable();
      nominee2.controls.BOCategory.disable();
      nominee2.controls.nomineeCountry.disable();
      nominee2.controls.nomineeMobile.disable();
      nominee2.controls.nomineeTelephoneNumber.disable();
      nominee2.controls.nomineeEmailID.disable();
      nominee2.controls.sharePercentage.disable();
      nominee2.controls.nomineeDOB.disable();
      nominee2.controls.isdCodeMobile.disable();
      nominee2.controls.isdCodeTelephone.disable();
      nominee2.controls.stdCodetelephone.disable();
      nominee2.controls.guardianFirstName.disable();
      nominee2.controls.guardianMiddleName.disable();
      nominee2.controls.guardianLastName.disable();
      nominee2.controls.guardianHouseName.disable();
      nominee2.controls.guardianHouseNumber.disable();
      nominee2.controls.guardianStreet.disable();
      nominee2.controls.guardianPin.disable();
      nominee2.controls.guardianCity.disable();
      nominee2.controls.guardianState.disable();
      nominee2.controls.guardianCountry.disable();
      nominee2.controls.guardianTelephoneNumber.disable();
      nominee2.controls.guardianMobile.disable();
      nominee2.controls.guardianEmailID.disable();
      nominee3.controls.nomineeFirstName.disable();
      nominee3.controls.nomineeMiddleName.disable();
      nominee3.controls.nomineeLastName.disable();
      nominee3.controls.nomineeHouseName.disable();
      nominee3.controls.nomineeHouseNumber.disable();
      nominee3.controls.nomineeStreet.disable();
      nominee3.controls.nomineePin.disable();
      nominee3.controls.nomineeCity.disable();
      nominee3.controls.nomineeState.disable();
      nominee3.controls.BOCategory.disable();
      nominee3.controls.nomineeCountry.disable();
      nominee3.controls.nomineeMobile.disable();
      nominee3.controls.nomineeTelephoneNumber.disable();
      nominee3.controls.nomineeEmailID.disable();
      nominee3.controls.sharePercentage.disable();
      nominee3.controls.nomineeDOB.disable();
      nominee3.controls.isdCodeMobile.disable();
      nominee3.controls.isdCodeTelephone.disable();
      nominee3.controls.stdCodetelephone.disable();
      nominee3.controls.guardianFirstName.disable();
      nominee3.controls.guardianMiddleName.disable();
      nominee3.controls.guardianLastName.disable();
      nominee3.controls.guardianHouseName.disable();
      nominee3.controls.guardianHouseNumber.disable();
      nominee3.controls.guardianStreet.disable();
      nominee3.controls.guardianPin.disable();
      nominee3.controls.guardianCity.disable();
      nominee3.controls.guardianState.disable();
      nominee3.controls.guardianCountry.disable();
      nominee3.controls.guardianTelephoneNumber.disable();
      nominee3.controls.guardianMobile.disable();
      nominee3.controls.guardianEmailID.disable();
      this.form.controls.tradeNominee.disable();
      if(this.newPanService)
      {
        this.disablepanholder1=true
        this.disablepanholder3=true
        this.disablepanholder5=true
      }

    }
  }
  enableFields(e) {
    let nominee1: any = this.form.controls.firstNomineeDetails;
    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;
    if (this.editFlag || e == "OPT") {
      this.numOfNomineesdisable = false;
      this.disableFld = false;
      this.form.controls.nomineeEqualShareForNominess.enable();
      nominee1.controls.nomineeFirstName.enable();
      nominee1.controls.nomineeMiddleName.enable();
      nominee1.controls.nomineeLastName.enable();
      nominee1.controls.nomineeHouseName.enable();
      nominee1.controls.nomineeHouseNumber.enable();
      nominee1.controls.nomineeStreet.enable();
      nominee1.controls.nomineePin.enable();
      nominee1.controls.nomineeCity.enable();
      nominee1.controls.nomineeState.enable();
      nominee1.controls.BOCategory.enable();
      nominee1.controls.nomineeCountry.enable();
      nominee1.controls.nomineeMobile.enable();
      nominee1.controls.nomineeTelephoneNumber.enable();
      nominee1.controls.nomineeEmailID.enable();
      nominee1.controls.sharePercentage.enable();
      nominee1.controls.nomineeDOB.enable();
      nominee1.controls.isdCodeMobile.enable();
      nominee1.controls.isdCodeTelephone.enable();
      nominee1.controls.stdCodetelephone.enable();
      nominee1.controls.guardianFirstName.enable();
      nominee1.controls.guardianMiddleName.enable();
      nominee1.controls.guardianLastName.enable();
      nominee1.controls.guardianHouseName.enable();
      nominee1.controls.guardianHouseNumber.enable();
      nominee1.controls.guardianStreet.enable();
      nominee1.controls.guardianPin.enable();
      nominee1.controls.guardianCity.enable();
      nominee1.controls.guardianState.enable();
      nominee1.controls.guardianCountry.enable();
      nominee1.controls.guardianTelephoneNumber.enable();
      nominee1.controls.guardianMobile.enable();
      nominee1.controls.guardianEmailID.enable();
      nominee2.controls.nomineeFirstName.enable();
      nominee2.controls.nomineeMiddleName.enable();
      nominee2.controls.nomineeLastName.enable();
      nominee2.controls.nomineeHouseName.enable();
      nominee2.controls.nomineeHouseNumber.enable();
      nominee2.controls.nomineeStreet.enable();
      nominee2.controls.nomineePin.enable();
      nominee2.controls.nomineeCity.enable();
      nominee2.controls.nomineeState.enable();
      nominee2.controls.BOCategory.enable();
      nominee2.controls.nomineeCountry.enable();
      nominee2.controls.nomineeMobile.enable();
      nominee2.controls.nomineeTelephoneNumber.enable();
      nominee2.controls.nomineeEmailID.enable();
      nominee2.controls.sharePercentage.enable();
      nominee2.controls.nomineeDOB.enable();
      nominee2.controls.isdCodeMobile.enable();
      nominee2.controls.isdCodeTelephone.enable();
      nominee2.controls.stdCodetelephone.enable();
      nominee2.controls.guardianFirstName.enable();
      nominee2.controls.guardianMiddleName.enable();
      nominee2.controls.guardianLastName.enable();
      nominee2.controls.guardianHouseName.enable();
      nominee2.controls.guardianHouseNumber.enable();
      nominee2.controls.guardianStreet.enable();
      nominee2.controls.guardianPin.enable();
      nominee2.controls.guardianCity.enable();
      nominee2.controls.guardianState.enable();
      nominee2.controls.guardianCountry.enable();
      nominee2.controls.guardianTelephoneNumber.enable();
      nominee2.controls.guardianMobile.enable();
      nominee2.controls.guardianEmailID.enable();
      nominee3.controls.nomineeFirstName.enable();
      nominee3.controls.nomineeMiddleName.enable();
      nominee3.controls.nomineeLastName.enable();
      nominee3.controls.nomineeHouseName.enable();
      nominee3.controls.nomineeHouseNumber.enable();
      nominee3.controls.nomineeStreet.enable();
      nominee3.controls.nomineePin.enable();
      nominee3.controls.nomineeCity.enable();
      nominee3.controls.nomineeState.enable();
      nominee3.controls.BOCategory.enable();
      nominee3.controls.nomineeCountry.enable();
      nominee3.controls.nomineeMobile.enable();
      nominee3.controls.nomineeTelephoneNumber.enable();
      nominee3.controls.nomineeEmailID.enable();
      nominee3.controls.sharePercentage.enable();
      nominee3.controls.nomineeDOB.enable();
      nominee3.controls.isdCodeMobile.enable();
      nominee3.controls.isdCodeTelephone.enable();
      nominee3.controls.stdCodetelephone.enable();
      nominee3.controls.guardianFirstName.enable();
      nominee3.controls.guardianMiddleName.enable();
      nominee3.controls.guardianLastName.enable();
      nominee3.controls.guardianHouseName.enable();
      nominee3.controls.guardianHouseNumber.enable();
      nominee3.controls.guardianStreet.enable();
      nominee3.controls.guardianPin.enable();
      nominee3.controls.guardianCity.enable();
      nominee3.controls.guardianState.enable();
      nominee3.controls.guardianCountry.enable();
      nominee3.controls.guardianTelephoneNumber.enable();
      nominee3.controls.guardianMobile.enable();
      nominee3.controls.guardianEmailID.enable();
      this.form.controls.tradeNominee.enable();
      if(this.newPanService)
      {
      this.disablepanholder1=false
      this.disablepanholder3=false
      this.disablepanholder5=false
      }
    }
    else {
      this.disableFields();
      this.disableFld = true;
    }
  }

  checkPercentOfShare() {

    let nominee1: any = this.form.controls.firstNomineeDetails;
    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;

    if (!this.form.controls.nomineeEqualShareForNominess.value) {

      var firstPercentage = nominee1.controls.sharePercentage.value ? nominee1.controls.sharePercentage.value : 0;
      var secondPercentage = nominee2.controls.sharePercentage.value ? nominee2.controls.sharePercentage.value : 0;
      var thirdPercentege = nominee3.controls.sharePercentage.value ? nominee3.controls.sharePercentage.value : 0

      var total = Number(firstPercentage) + Number(secondPercentage) + Number(thirdPercentege)
      if (total != 100) {   
        this.notif.error('Total percentage of share is' + total + '.It should be 100', '')
        return false;
      }
      else return true;
    }
    else {
      return true;
    }
  }
  CheckMinor(Nomine, input) {
    let nominee1: any = this.form.controls.firstNomineeDetails;
    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;
    var inputdate = new Date(input);
    var currentYear = new Date();

    var age = currentYear.getFullYear() - inputdate.getFullYear();
    var m = currentYear.getMonth() - inputdate.getMonth();
    if (m < 0 || (m === 0 && currentYear.getDate() < inputdate.getDate())) {
      age--;
    }
    
    if (Nomine == "First") {
      if (age < 18) {
        this.gardian1 = true;
        nominee1.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);
        nominee1.controls["guardianTitle"].setValidators(Validators.required);
        nominee1.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee1.controls["guardianLastName"].setValidators(Validators.required);
        nominee1.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee1.controls["guardianHouseName"].setValidators(null);
        // nominee1.controls["guardianStreet"].setValidators(Validators.required);
        nominee1.controls["guardianPin"].setValidators(null);
        nominee1.controls["guardianCity"].setValidators(null);
        nominee1.controls["guardianState"].setValidators(null);
        nominee1.controls["guardianCountry"].setValidators(null);
        nominee1.controls["guardianHouseNumber"].setValidators();//mod aksa
      }
      else {
        this.gardian1 = false;
        // nominee1.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);
        nominee1.controls["guardianTitle"].setValidators(null);
        nominee1.controls["guardianFirstName"].setValidators(null);
        // nominee1.controls["guardianLastName"].setValidators(null);
        nominee1.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee1.controls["guardianHouseName"].setValidators(null);
        //  nominee1.controls["guardianStreet"].setValidators(null);
        nominee1.controls["guardianPin"].setValidators(null);
        nominee1.controls["guardianCity"].setValidators(null);
        nominee1.controls["guardianState"].setValidators(null);
        nominee1.controls["guardianCountry"].setValidators(null);
        nominee1.controls["guardianHouseNumber"].setValidators(null);//mod aksa
      }
      nominee1.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();
      nominee1.controls["guardianTitle"].updateValueAndValidity();
      nominee1.controls["guardianFirstName"].updateValueAndValidity();
      // nominee1.controls["guardianLastName"].updateValueAndValidity();
      nominee1.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee1.controls["guardianHouseName"].updateValueAndValidity();
      // nominee1.controls["guardianStreet"].updateValueAndValidity();
      nominee1.controls["guardianPin"].updateValueAndValidity();
      nominee1.controls["guardianCity"].updateValueAndValidity();
      nominee1.controls["guardianState"].updateValueAndValidity();
      nominee1.controls["guardianCountry"].updateValueAndValidity();
      nominee1.controls["guardianHouseNumber"].updateValueAndValidity();//mod aksa
      if(this.pantest && this.pantest == "34" && this.newPanService)
        this.enableVerify('N1')
    }
    if (Nomine == "Second") {

      if (age < 18) {
        this.gardian2 = true;
        nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);
        nominee2.controls["guardianTitle"].setValidators(Validators.required);
        nominee2.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee2.controls["guardianLastName"].setValidators(Validators.required);
        nominee2.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee2.controls["guardianHouseName"].setValidators(null);
        //nominee2.controls["guardianStreet"].setValidators(Validators.required);
        nominee2.controls["guardianPin"].setValidators(null);
        nominee2.controls["guardianCity"].setValidators(null);
        nominee2.controls["guardianState"].setValidators(null);
        nominee2.controls["guardianCountry"].setValidators(null);
        nominee2.controls["guardianHouseNumber"].setValidators(null);//mod aksa
      }
      else {
        this.gardian2 = false;
        //nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);
        nominee2.controls["guardianTitle"].setValidators(null);
        nominee2.controls["guardianFirstName"].setValidators(null);
        // nominee2.controls["guardianLastName"].setValidators(null);
        nominee2.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee2.controls["guardianHouseName"].setValidators(null);
        // nominee2.controls["guardianStreet"].setValidators(null);
        nominee2.controls["guardianPin"].setValidators(null);
        nominee2.controls["guardianCity"].setValidators(null);
        nominee2.controls["guardianState"].setValidators(null);
        nominee2.controls["guardianCountry"].setValidators(null);
        nominee2.controls["guardianHouseNumber"].setValidators(null);//mod aksa
      }
      nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();
      nominee2.controls["guardianTitle"].updateValueAndValidity();
      nominee2.controls["guardianFirstName"].updateValueAndValidity();
      // nominee2.controls["guardianLastName"].updateValueAndValidity();
      nominee2.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee2.controls["guardianHouseName"].updateValueAndValidity();
      // nominee2.controls["guardianStreet"].updateValueAndValidity();
      nominee2.controls["guardianPin"].updateValueAndValidity();
      nominee2.controls["guardianCity"].updateValueAndValidity();
      nominee2.controls["guardianState"].updateValueAndValidity();
      nominee2.controls["guardianCountry"].updateValueAndValidity();
      nominee2.controls["guardianHouseNumber"].updateValueAndValidity();//mod aksa
      if(this.pantest && this.pantest == "34" && this.newPanService)
        this.enableVerify('N2')
    }
    if (Nomine == "Third") {

      if (age < 18) {
        this.gardian3 = true;
        nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);
        nominee3.controls["guardianTitle"].setValidators(Validators.required);
        nominee3.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee3.controls["guardianLastName"].setValidators(Validators.required);
        nominee3.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee3.controls["guardianHouseName"].setValidators(null);
        // nominee3.controls["guardianStreet"].setValidators(Validators.required);
        nominee3.controls["guardianPin"].setValidators(null);
        nominee3.controls["guardianCity"].setValidators(null);
        nominee3.controls["guardianState"].setValidators(null);
        nominee3.controls["guardianCountry"].setValidators(null);
        nominee3.controls["guardianHouseNumber"].setValidators(null);//mod aksa
      }
      else {
        this.gardian3 = false;
        // nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);
        nominee3.controls["guardianTitle"].setValidators(null);
        nominee3.controls["guardianFirstName"].setValidators(null);
        // nominee3.controls["guardianLastName"].setValidators(null);
        nominee3.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee3.controls["guardianHouseName"].setValidators(null);
        // nominee3.controls["guardianStreet"].setValidators(null);
        nominee3.controls["guardianPin"].setValidators(null);
        nominee3.controls["guardianCity"].setValidators(null);
        nominee3.controls["guardianState"].setValidators(null);
        nominee3.controls["guardianCountry"].setValidators(null);
        nominee3.controls["guardianHouseNumber"].setValidators(null);//mod aksa
      }
      nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();
      nominee3.controls["guardianTitle"].updateValueAndValidity();
      nominee3.controls["guardianFirstName"].updateValueAndValidity();
      // nominee3.controls["guardianLastName"].updateValueAndValidity();
      nominee3.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee3.controls["guardianHouseName"].updateValueAndValidity();
      //nominee3.controls["guardianStreet"].updateValueAndValidity();
      nominee3.controls["guardianPin"].updateValueAndValidity();
      nominee3.controls["guardianCity"].updateValueAndValidity();
      nominee3.controls["guardianState"].updateValueAndValidity();
      nominee3.controls["guardianCountry"].updateValueAndValidity();
      nominee3.controls["guardianHouseNumber"].updateValueAndValidity();//mod aksa
      if(this.pantest && this.pantest == "34" && this.newPanService)
        this.enableVerify('N3')
    }
  }
  Approve() {
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    if (!Remarks) {
      this.notif.error('Approval remark is required', '');
      return
    }
    let reason: any = this.form.controls.Rejection.value.AppRemarks;;
    this.modal.confirm({
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
  SetResidualValidators(data) {
    let nominee1: any = this.form.controls.firstNomineeDetails;
    if (data) {
      this.residualValidator = true;
    }
    else {
      this.residualValidator = false;
    }
  }
  SetValidators(Nominee) {

    let nominee2: any = this.form.controls.SecondNomineeDetails;
    let nominee3: any = this.form.controls.ThirdNomineeDetails;
    if (Nominee == "Two") {
      nominee2.controls["nomineeTitle"].setValidators(Validators.required);
      nominee2.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee2.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee2.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseName"].setValidators(null);   //mod 18204
      nominee2.controls["nomineeHouseNumber"].setValidators(null); //mod 18204
      // nominee2.controls["nomineeStreet"].setValidators(Validators.required);
      nominee2.controls["nomineePin"].setValidators(null);
      nominee2.controls["nomineeCity"].setValidators(null);
      nominee2.controls["nomineeState"].setValidators(null);
      nominee2.controls["nomineeCountry"].setValidators(null);
      //  nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);

      nominee3.controls["nomineeTitle"].setValidators(null);
      nominee3.controls["nomineeFirstName"].setValidators(null);
      // nominee3.controls["nomineeLastName"].setValidators(null);
      //  nominee3.controls["nomineeResidualshares"].setValidators(null);
      nominee3.controls["nomineeRelationshipwithapplicant"].setValidators(null);
      nominee3.controls["nomineeHouseName"].setValidators(null);
      nominee3.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
      // nominee3.controls["nomineeStreet"].setValidators(null);
      nominee3.controls["nomineePin"].setValidators(null);
      nominee3.controls["nomineeCity"].setValidators(null);
      nominee3.controls["nomineeState"].setValidators(null);
      nominee3.controls["nomineeCountry"].setValidators(null);
      // nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

      nominee2.controls["nomineeTitle"].updateValueAndValidity();
      nominee2.controls["nomineeFirstName"].updateValueAndValidity();
      // nominee2.controls["nomineeLastName"].updateValueAndValidity();
      //nominee2.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee2.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee2.controls["nomineeHouseName"].updateValueAndValidity();
      nominee2.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
      //  nominee2.controls["nomineeStreet"].updateValueAndValidity();
      nominee2.controls["nomineePin"].updateValueAndValidity();
      nominee2.controls["nomineeCity"].updateValueAndValidity();
      nominee2.controls["nomineeCountry"].updateValueAndValidity();
      nominee2.controls["nomineeState"].updateValueAndValidity();
      //  nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

      nominee3.controls["nomineeTitle"].updateValueAndValidity();
      nominee3.controls["nomineeFirstName"].updateValueAndValidity();
      nominee3.controls["nomineeLastName"].updateValueAndValidity();
      //  nominee3.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee3.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee3.controls["nomineeHouseName"].updateValueAndValidity();
      nominee3.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
      // nominee3.controls["nomineeStreet"].updateValueAndValidity();
      nominee3.controls["nomineePin"].updateValueAndValidity();
      nominee3.controls["nomineeCity"].updateValueAndValidity();
      nominee3.controls["nomineeCountry"].updateValueAndValidity();
      nominee3.controls["nomineeState"].updateValueAndValidity();
      //  nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

    } else if (Nominee == "Three") {
      nominee2.controls["nomineeTitle"].setValidators(Validators.required);
      nominee2.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee2.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee2.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseName"].setValidators(null);
      nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod 18204
      // nominee2.controls["nomineeStreet"].setValidators(Validators.required);
      nominee2.controls["nomineePin"].setValidators(null);
      nominee2.controls["nomineeCity"].setValidators(null);
      nominee2.controls["nomineeState"].setValidators(null);
      nominee2.controls["nomineeCountry"].setValidators(null);
      // nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);
      //nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);
      nominee3.controls["nomineeTitle"].setValidators(Validators.required);
      nominee3.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee3.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee3.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee3.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee3.controls["nomineeHouseName"].setValidators(Validators.required);
      nominee3.controls["nomineeHouseNumber"].setValidators(Validators.required);//mod aksa
      //  nominee3.controls["nomineeStreet"].setValidators(Validators.required);
      nominee3.controls["nomineePin"].setValidators(Validators.required);
      nominee3.controls["nomineeCity"].setValidators(Validators.required);
      nominee3.controls["nomineeState"].setValidators(Validators.required);
      nominee3.controls["nomineeCountry"].setValidators(Validators.required);
      // nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(Validators.required);

      nominee2.controls["nomineeTitle"].updateValueAndValidity();
      nominee2.controls["nomineeFirstName"].updateValueAndValidity();
      // nominee2.controls["nomineeLastName"].updateValueAndValidity();
      //  nominee2.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee2.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee2.controls["nomineeHouseName"].updateValueAndValidity();
      nominee2.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
      //    nominee2.controls["nomineeStreet"].updateValueAndValidity();
      nominee2.controls["nomineePin"].updateValueAndValidity();
      nominee2.controls["nomineeCity"].updateValueAndValidity();
      nominee2.controls["nomineeCountry"].updateValueAndValidity();
      nominee2.controls["nomineeState"].updateValueAndValidity();
      // nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

      nominee3.controls["nomineeTitle"].updateValueAndValidity();
      nominee3.controls["nomineeFirstName"].updateValueAndValidity();
      // nominee3.controls["nomineeLastName"].updateValueAndValidity();
      // nominee3.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee3.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee3.controls["nomineeHouseName"].updateValueAndValidity();
      nominee3.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
      // nominee3.controls["nomineeStreet"].updateValueAndValidity();
      nominee3.controls["nomineePin"].updateValueAndValidity();
      nominee3.controls["nomineeCity"].updateValueAndValidity();
      nominee3.controls["nomineeCountry"].updateValueAndValidity();
      nominee3.controls["nomineeState"].updateValueAndValidity();
      // nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();
    }
    else {
      nominee2.controls["nomineeTitle"].setValidators(null);
      nominee2.controls["nomineeFirstName"].setValidators(null);
      // nominee2.controls["nomineeLastName"].setValidators(null);
      //nominee2.controls["nomineeResidualshares"].setValidators(null);
      nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(null);
      nominee2.controls["nomineeHouseName"].setValidators(null);
      nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa

      // nominee2.controls["nomineeStreet"].setValidators(null);
      nominee2.controls["nomineePin"].setValidators(null);
      nominee2.controls["nomineeCity"].setValidators(null);
      nominee2.controls["nomineeState"].setValidators(null);
      nominee2.controls["nomineeCountry"].setValidators(null);
      //nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

      nominee3.controls["nomineeTitle"].setValidators(null);
      nominee3.controls["nomineeFirstName"].setValidators(null);
      // nominee3.controls["nomineeLastName"].setValidators(null);
      // nominee3.controls["nomineeResidualshares"].setValidators(null);
      nominee3.controls["nomineeRelationshipwithapplicant"].setValidators(null);
      nominee3.controls["nomineeHouseName"].setValidators(null);
      nominee3.controls["nomineeHouseNumber"].setValidators(null);// mod aksa
      // nominee3.controls["nomineeStreet"].setValidators(null);
      nominee3.controls["nomineePin"].setValidators(null);
      nominee3.controls["nomineeCity"].setValidators(null);
      nominee3.controls["nomineeState"].setValidators(null);
      nominee3.controls["nomineeCountry"].setValidators(null);
      // nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

      nominee2.controls["nomineeTitle"].updateValueAndValidity();
      nominee2.controls["nomineeFirstName"].updateValueAndValidity();
      // nominee2.controls["nomineeLastName"].updateValueAndValidity();
      // nominee2.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee2.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee2.controls["nomineeHouseName"].updateValueAndValidity();
      nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
      //  nominee2.controls["nomineeStreet"].updateValueAndValidity();
      nominee2.controls["nomineePin"].updateValueAndValidity();
      nominee2.controls["nomineeCity"].updateValueAndValidity();
      nominee2.controls["nomineeCountry"].updateValueAndValidity();
      nominee2.controls["nomineeState"].updateValueAndValidity();
      // nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

      nominee3.controls["nomineeTitle"].updateValueAndValidity();
      nominee3.controls["nomineeFirstName"].updateValueAndValidity();
      // nominee3.controls["nomineeLastName"].updateValueAndValidity();
      // nominee3.controls["nomineeResidualshares"].updateValueAndValidity();
      nominee3.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
      nominee3.controls["nomineeHouseName"].updateValueAndValidity();
      nominee3.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
      // nominee3.controls["nomineeStreet"].updateValueAndValidity();
      nominee3.controls["nomineePin"].updateValueAndValidity();
      nominee3.controls["nomineeCity"].updateValueAndValidity();
      nominee3.controls["nomineeCountry"].updateValueAndValidity();
      nominee3.controls["nomineeState"].updateValueAndValidity();
      // nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

    }
  }
  Reject() {
    let Remarks = this.form.controls.Rejection.value.RejRemarks ? true : false
    // if (Remarks) {
    // if (this.checkedArray.length != 0 || this.convertedData.length !== 0) {
    let reason: any = this.form.controls.Rejection.value.RejRemarks
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to reject ?', //with Remarks <br>"<b><i>' + reason + '"</i>?</b>
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
  // OnChangeEquelShare(value) {
  //   console.log(value);

  //   if (value == true) {
  //     this.nomineeForm1.controls.sharePercentage.setValue(0)
  //     this.nomineeForm2.controls.sharePercentage.setValue(0)
  //     this.nomineeForm3.controls.sharePercentage.setValue(0)

  //     this.nomineeForm1.controls.sharePercentage.disable();
  //     this.nomineeForm2.controls.sharePercentage.disable();
  //     this.nomineeForm3.controls.sharePercentage.disable();
  //     this.SetResidualValidators(true);

  //   }
  //   else {
  //     this.nomineeForm1 ? this.nomineeForm1.controls.sharePercentage.enable() : '';
  //     this.nomineeForm2 ? this.nomineeForm2.controls.sharePercentage.enable() : '';
  //     this.nomineeForm3 ? this.nomineeForm3.controls.sharePercentage.enable() : '';
  //     this.SetResidualValidators(false);

  //   }
  // }
  OnChangeEquelShare(value) {
    debugger
    if (value == true) {
      // this.nomineeForm1.controls.sharePercentage.setValue(0)
      // this.nomineeForm2.controls.sharePercentage.setValue(0)
      // this.nomineeForm3.controls.sharePercentage.setValue(0)

      this.nomineeForm1.controls.sharePercentage.disable();
      this.nomineeForm2.controls.sharePercentage.disable();
      this.nomineeForm3.controls.sharePercentage.disable();
      this.SetResidualValidators(true);

      this.nomineeForm1.controls.sharePercentage.setValue(null);
      this.nomineeForm2.controls.sharePercentage.setValue(null);
      this.nomineeForm3.controls.sharePercentage.setValue(null);
    }
    else {
      this.nomineeForm1.controls.sharePercentage.enable();
      this.nomineeForm2.controls.sharePercentage.enable();
      this.nomineeForm3.controls.sharePercentage.enable();
      this.SetResidualValidators(false);

      // // this.nomineeForm1.controls.sharePercentage.setValue(this.dataforaprove[0].F_sharePercentage)
      // // this.nomineeForm2.controls.sharePercentage.setValue(this.dataforaprove[0].S_sharePercentage)
      // // this.nomineeForm3.controls.sharePercentage.setValue(this.dataforaprove[0].T_sharePercentage)
      // this.nomineeForm1.controls.sharePercentage.setValue(this.dataforaprove[0] ? this.dataforaprove[0].F_sharePercentage : null);
      // this.nomineeForm2.controls.sharePercentage.setValue(this.dataforaprove[0] ? this.dataforaprove[0].S_sharePercentage : null);
      // this.nomineeForm3.controls.sharePercentage.setValue(this.dataforaprove[0] ? this.dataforaprove[0].T_sharePercentage : null);
    }
  }
  SetResidualShare(nom, value) {
    // if (nom == "first" && value == "Y") {
    //   this.nomineeForm2.controls.nomineeResidualshares.setValue('N')
    //   this.nomineeForm3.controls.nomineeResidualshares.setValue('N')
    // }
    // if (nom == "second" && value == "Y") {
    //   this.nomineeForm1.controls.nomineeResidualshares.setValue('N')
    //   this.nomineeForm3.controls.nomineeResidualshares.setValue('N')
    // }
    // if (nom == "third" && value == "Y") {
    //   this.nomineeForm1.controls.nomineeResidualshares.setValue('N')
    //   this.nomineeForm2.controls.nomineeResidualshares.setValue('N')
    // }

  }
  SetNomineeNumber(value) {

    switch (value) {
      case "One":
        {
          this.isDisabled = true;
          this.form.controls.nomineeEqualShareForNominess.setValue(false);
          // this.form.controls.nomineeEqualShareForNominess['value']=false
          // this.form.controls.nomineeEqualShareForNominess.disable();
          // this.OnChangeEquelShare(false)
          this.dsNominee2 = true
          this.dsNominee3 = true
          this.NomineeList = [{ "key": 1, "value": "First Nominee" }]
          this.form.controls.tradeNominee.patchValue(1)
          this.nomineeOpting = false; //Mod Basil_17771
          this.NomineeOpted = 'N'
          console.log('nomineeOptingfunction', this.nomineeOpting);
          this.dsNominee1 = false;
          break;
        }
      case "Two": {
        this.isDisabled = false;
        this.dsNominee2 = false
        this.dsNominee3 = true
        this.NomineeList = [{ "key": 1, "value": "First Nominee" }, { "key": 2, "value": "Second Nominee" }]
        this.form.controls.tradeNominee.patchValue(1)

        this.numOfNominees = 'Two'
        this.NomineeOpted = 'N'
        this.nomineeOpting = false;
        this.disableFld = false;
        // this.enableFields("OPT");
        console.log('nomineeOptingfunction', this.nomineeOpting);
        this.dsNominee1 = false;
        this.form.controls.nomineeEqualShareForNominess.setValue(false);
        break;
      }
      case "Three": {
        this.isDisabled = false;
        this.dsNominee2 = false
        this.dsNominee3 = false
        this.NomineeList = [{ "key": 1, "value": "First Nominee" }, { "key": 2, "value": "Second Nominee" }, { "key": 3, "value": "Third Nominee" }]
        this.form.controls.tradeNominee.patchValue(1)

        this.numOfNominees = 'Three'
        this.NomineeOpted = 'N'
        this.nomineeOpting = false;
        this.disableFld = false;
        // this.enableFields("OPT");
        console.log('nomineeOptingfunction', this.nomineeOpting);
        this.dsNominee1 = false;
        this.form.controls.nomineeEqualShareForNominess.setValue(false);
        break;
      }
      case "nomineeOpt": {
        this.isDisabled = true;
        this.dsNominee1 = true;
        this.dsNominee2 = true
        this.dsNominee3 = true
        this.NomineeList = ['']
        // this.form.controls.tradeNominee.patchValue(1)
        break;
      }
    }
    this.SetValidators(value)
  }
  SetProofFields(number, val) {
    debugger
    if((number === 'N1' || number === 'N2' || number === 'N3') && this.newPanService)
    {
      this.enableVerify(number)
      this.panvalid = number
    }
    if(!this.newPanService)
    {
      this.panvalid = number
    }
    this.pantest = val
    console.log(this.nomineeIdentificationArray);
    console.log(this.Nominee1Fields);

    console.log(this.cmServ.getControls(this.Prooffields, val));
    console.log(this.Prooffields);


    console.log(val);
    this.showtext1 = false;
    this.showtext2 = false;
    this.showtext3 = false;
    this.showtext4 = false;
    this.showtext5 = false;
    this.showtext6 = false;
    // this.showtext2=false;//  MOd:aksa

    if (val != "34" && number == 'N1') {
      this.pantext1 = false;
      this.panbutton1 = false;
      if(this.newPanService)
      this.panname1 = false;
    }
    if (val != "34" && number == 'G1' && !this.newPanService) {
      this.pantext2 = false;
      this.panbutton2 = false;
    }
    if (val != "34" && number == 'N2') {
      this.pantext3 = false;
      this.panbutton3 = false;
      if(this.newPanService)
      this.panname3 = false;
    }
    if (val != "34" && number == 'G2' && !this.newPanService) {
      this.pantext4 = false;
      this.panbutton4 = false;
    }
    if (val != "34" && number == 'N3') {
      this.pantext5 = false;
      this.panbutton5 = false;
      if(this.newPanService)
      this.panname5 = false;
      // this.isdisabledpan = true;

    }
    if (val != "34" && number == 'G3' && !this.newPanService) {
      this.pantext6 = false;
      this.panbutton6 = false;
    }
    // this.pantext2=false;
    // this.pantext3=false;
    // this.pantext4=false;
    // this.pantext5=false;
    // this.pantext6=false;

    if (val == "34" && number == 'N1') {
      debugger//  MOd:aksa
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton1 = true;
        if(this.newPanService)
        this.panname1 = true;
      }
      this.pantext1 = true;
      // this.panholder1 = '';

    }

    if (val == "34" && number == 'G1' && this.newPanService) {
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton2 = true;
      }
      this.pantext2 = true
      // this.panholder2 = '';

    }


    // else {
    //   this.panbutton1 = false;
    //   this.panbutton2 = false;

    //   //  this.pantext1=false;
    //   //  this.pantext2=false;
    // }


    if (val == "34" && number == 'N2') {
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton3 = true;
        if(this.newPanService)
        this.panname3 = true;
      }
      this.pantext3 = true
      // this.panholder3 = '';

    }

    if (val == "34" && number == 'G2' && this.newPanService) {
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton4 = true;
      }
      // this.panbutton4 = true;
      this.pantext4 = true
      // this.panholder4 = ''

    }
    // else {
    //   this.panbutton3 = false;
    //   this.panbutton4 = false;
    // }
    if (val == "34" && number == 'N3') {
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton5 = true;
        if(this.newPanService)
        this.panname5 = true;
      }
      // && this.applicationStatus!='P' && 'HO'
      //  this.panbutton5=true;
      this.pantext5 = true;
      // this.panholder5 = ''



    }
    if (val == "34" && number == 'G3' && this.newPanService) {
      if (this.applicationStatus != 'P' && 'HO') {
        this.panbutton6 = true;
      }
      // && this.applicationStatus!='P' && 'HO'
      this.pantext6 = true;
      // this.panholder6 = ''

    }


    if (val == "07" && number == 'N1') {
      debugger//  MOd:aksa
      this.showbutton1 = true;
    }

    else if (val == "07" && number == 'G1') {
      this.showbutton2 = true;
    }


    else {
      this.showbutton1 = false;
      this.showbutton2 = false;
    }


    if (val == "07" && number == 'N2') {
      this.showbutton3 = true;
    }

    else if (val == "07" && number == 'G2') {

      this.showbutton4 = true;
    }
    else {
      this.showbutton3 = false;
      this.showbutton4 = false;
    }
    if (val == "07" && number == 'N3') {
      this.showbutton5 = true;
    }
    else if (val == "07" && number == 'G3') {
      this.showbutton6 = true;
    }
    else {
      this.showbutton5 = false;
      this.showbutton6 = false;
    }

    // else {
    //   this.showbutton1 = false;
    //   this.showbutton2 = false;
    //   this.showbutton3 = false;
    //   this.showbutton4 = false;
    //   this.showbutton5 = false;
    //   this.showbutton6 = false;
    // }

    //  MOd:aksa
    switch (number) {


      case 'N1': {
        this.Nominee1Fields = this.cmServ.getControls(this.Prooffields, val)
        break;

      }

      case 'G1':
        {
          this.Gardian1Fields = this.cmServ.getControls(this.Prooffields, val)
          break;
        }
      case 'N2': {
        this.Nominee2Fields = this.cmServ.getControls(this.Prooffields, val)
        break;
      }
      case 'G2':
        {
          this.Gardian2Fields = this.cmServ.getControls(this.Prooffields, val)
          break;
        }
      case 'N3': {
        this.Nominee3Fields = this.cmServ.getControls(this.Prooffields, val)
        break;
      }
      case 'G3':
        {
          this.Gardian3Fields = this.cmServ.getControls(this.Prooffields, val)
          break;
        }
    }
  }
  patchNominee1Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm1.controls.nomineeNomineeIdentificaitonDetails.patchValue(id)
      this.Nominee1Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {
        }
        else
          this.Nominee1Fields[i][o] = obj[o];
      })
    }, 500)
  }
  patchGardian1Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm1.controls.guardianIdentificaitonDetails.patchValue(id)
      this.Gardian1Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {
        }
        else
          this.Gardian1Fields[i][o] = obj[o];
      })
    }, 500)
  }
  patchNominee2Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm2.controls.nomineeNomineeIdentificaitonDetails.patchValue(id)
      this.Nominee2Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {
        }
        else
          this.Nominee2Fields[i][o] = obj[o];
      })
    }, 500)
  }
  patchGardian2Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm2.controls.guardianIdentificaitonDetails.patchValue(id)
      this.Gardian2Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {
        }
        else
          this.Gardian2Fields[i][o] = obj[o];
      })
    }, 500)
  }
  patchNominee3Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm3.controls.nomineeNomineeIdentificaitonDetails.patchValue(id)
      this.Nominee3Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {

        }
        else
          this.Nominee3Fields[i][o] = obj[o];
      })
    }, 500)
  }
  patchGardian3Data(id, obj) {
    setTimeout(() => {
      this.nomineeForm3.controls.guardianIdentificaitonDetails.patchValue(id)
      this.Gardian3Fields = this.cmServ.getControls(this.Prooffields, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {

        }
        else
          this.Gardian3Fields[i][o] = obj[o];
      })
    }, 500)
  }

  charrestrict(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9,/ -()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }

  ValidatePan(val, val2) {
    console.log("val2", val2);
    console.log("0", this.Nominee1Fields[0].nomineeproof10);

    debugger
    document.getElementById('input').setAttribute("style", "text-transform: uppercase;");
    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value

    console.log("full", fullstring);

    var text = val.key
    if (val.target.selectionStart <= 4) {
      return charonly.test(text)
      // document.getElementById('input').setAttribute("style", "text-transform: uppercase;");

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      return charonly.test(text)
      // document.getElementById('input').setAttribute("style", "text-transform: uppercase;");


    }
    else if (fullstring.length > 9) {
      return false;
    }
    if (val2 == 'N1') {
      var nom1: string
      nom1 = this.Nominee1Fields[0].nomineeproof10
      this.Nominee1Fields[0].nomineeproof10 = nom1.toUpperCase()
      console.log("nom1", this.Nominee1Fields[0].nomineeproof10)
      if (nom1 == '' || nom1 == null || nom1 == undefined) {
        this.panholder1 = '';
      }

    }
    else if (val2 == 'N2') {
      debugger
      var nom2: string
      nom2 = this.Nominee2Fields[0].nomineeproof20
      console.log("nom2", nom2);

      this.Nominee2Fields[0].nomineeproof20 = nom2.toUpperCase()
      console.log("nom2", this.Nominee2Fields[0].nomineeproof20)


    }
    else if (val2 == 'N3') {
      var nom3: string
      nom3 = this.Nominee3Fields[0].nomineeproof30
      console.log("nom3", nom3);

      this.Nominee3Fields[0].nomineeproof30 = nom3.toUpperCase()
      console.log("nom3", this.Nominee3Fields[0].nomineeproof30)

    }
  }

  VerifyPan(val, val2) {
    document.getElementById('input1').setAttribute("style", "text-transform: uppercase;");
    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    let result = fullstring.toUpperCase();
    console.log("resultpan", result);
    console.log("full", fullstring);

    var text = val.key
    if (val.target.selectionStart <= 4) {
      return charonly.test(text)
      // document.getElementById('input').setAttribute("style", "text-transform: uppercase;");
      // this.Gardian1Fields[0].guardianproof10 = val
      // else if (code == 'N2')
      //   this.Nominee2Fields[0].nomineeproof20 = val
      // else if (code == 'G2')
      //   this.Gardian2Fields[0].guardianproof20 = val
      // else if (code == 'N3')
      //   this.Nominee3Fields[0].nomineeproof30 = val
      // else if (code == 'G3')
      //   this.Gardian3Fields[0].guardianproof30 = val


    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      return charonly.test(text)
      // document.getElementById('input').setAttribute("style", "text-transform: uppercase;");

    }
    else if (fullstring.length > 9) {
      return false;
    }
    if (val2 == 'G1') {
      var gua1: string
      gua1 = this.Gardian1Fields[0].guardianproof10
      this.Gardian1Fields[0].guardianproof10 = gua1.toUpperCase()
      console.log("gua1", this.Gardian1Fields[0].guardianproof10)


    }
    else if (val2 == 'G2') {
      var gua2: string
      gua2 = this.Gardian2Fields[0].guardianproof20
      this.Gardian2Fields[0].guardianproof20 = gua2.toUpperCase()
      console.log("gua2", this.Gardian2Fields[0].guardianproof20)


    }
    else if (val2 == 'G3') {
      var gua3: string
      gua3 = this.Gardian3Fields[0].guardianproof30
      this.Gardian3Fields[0].guardianproof30 = gua3.toUpperCase()
      console.log("gua3", this.Gardian3Fields[0].guardianproof30)


    }

  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };

  setlength(code, val) {
    var numonly = /^[0-9]+$/
    if (val.currentTarget.value.length <= 7) {
      if (numonly.test(val.key)) {
        this.setMask(code, '********' + val.key)
      }
      else {
        return false
      }
    }
    else if (val.currentTarget.value.length > 11) {
      return false
    }
    else {
      return numonly.test(val.key)
    }
  }
  setMask(code, val) {
    if (code == 'N1')
      this.Nominee1Fields[0].nomineeproof10 = val
    else if (code == 'G1')
      this.Gardian1Fields[0].guardianproof10 = val
    else if (code == 'N2')
      this.Nominee2Fields[0].nomineeproof20 = val
    else if (code == 'G2')
      this.Gardian2Fields[0].guardianproof20 = val
    else if (code == 'N3')
      this.Nominee3Fields[0].nomineeproof30 = val
    else if (code == 'G3')
      this.Gardian3Fields[0].guardianproof30 = val
  }
  /*
    maskAdharNum1(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Nominee1Fields[0].nomineeproof10 = str
        }
      }
    }
    maskAdharNum2(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Gardian1Fields[0].guardianproof10 = str
        }
      }
    }
    maskAdharNum3(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Nominee2Fields[0].nomineeproof20 = str
        }
      }
    }
    maskAdharNum4(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Gardian2Fields[0].guardianproof20 = str
        }
      }
    }
    maskAdharNum5(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Nominee3Fields[0].nomineeproof30 = str
        }
      }
    }
    maskAdharNum6(label, str) {
      if (label == '10') {
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.Gardian3Fields[0].guardianproof30 = str
        }
      }
    }
  */
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
        "Flag": 2
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
    let Remarks = this.form.controls.Rejection.value.RejRemarks ? true : false;
    if (Remarks) {
      let reason: any = this.form.controls.Rejection.value.RejRemarks;
      this.modal.confirm({
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

  aadharValidation() {
    if (this.form.controls.firstNomineeDetails.value.nomineeNomineeIdentificaitonDetails == '10') {
      if (this.Nominee1Fields[0].nomineeproof10.length != 12) {
        this.notif.error('Incorrect first nominee Aadhaar details', '')
        return false;
      }
    }
    if (this.form.controls.firstNomineeDetails.value.guardianIdentificaitonDetails == '10') {
      if (this.Gardian1Fields[0].guardianproof10.length != 12) {
        this.notif.error('Incorrect first guardian Aadhaar details', '')
        return false;
      }
    }
    if (this.form.controls.SecondNomineeDetails.value.nomineeNomineeIdentificaitonDetails == '10') {
      if (this.Nominee2Fields[0].nomineeproof20.length != 12) {
        this.notif.error('Incorrect second nominee Aadhaar details', '')
        return false;
      }
    }
    if (this.form.controls.SecondNomineeDetails.value.guardianIdentificaitonDetails == '10') {
      if (this.Gardian2Fields[0].guardianproof20.length != 12) {
        this.notif.error('Incorrect second guardian Aadhaar details', '')
        return false;
      }
    }
    if (this.form.controls.ThirdNomineeDetails.value.nomineeNomineeIdentificaitonDetails == '10') {
      if (this.Nominee3Fields[0].nomineeproof30.length != 12) {
        this.notif.error('Incorrect third nominee Aadhaar details', '')
        return false;
      }
    }
    if (this.form.controls.ThirdNomineeDetails.value.guardianIdentificaitonDetails == '10') {
      if (this.Gardian3Fields[0].guardianproof30.length != 12) {
        this.notif.error('Incorrect third guardian Aadhaar details', '')
        return false;
      }
    }
    return true
  }
  // firstHolderInvalidvalidation() {debugger
  //   if (this.form.controls.firstNomineeDetails.value.nomineeNomineeIdentificaitonDetails == '07' && this.firstHolderInvalid) {
  //     this.notif.error('Please Upload Demat CML  File', '')
  //     this.dematvalid=false;
  //     return ;
  //     // if (this.Nominee1Fields[0].nomineeproof10.length != 12) {
  //     //   this.notif.error('Incorrect first nominee Aadhaar details', '')
  //     //   return false;
  //     // }
  //   }
  // }
  Setmobilelength(type, data) {
    if (data != null) {
      switch (type) {
        case 'N1': {
          if (data != '091') {
            this.min1 = 3
            this.max1 = 13
          }
          else {
            this.min1 = 10
            this.max1 = 10
          }
        }
        case 'N2': {
          if (data != '091') {
            this.min2 = 3
            this.max2 = 13
          }
          else {
            this.min2 = 10
            this.max2 = 10
          }
        }
        case 'N3': {
          if (data != '091') {
            this.min3 = 3
            this.max3 = 13
          }
          else {
            this.min3 = 10
            this.max3 = 10
          }
        }
      }
    }
  }

  initialApprove() {
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    //if (Remarks) {
    let reason: any = this.form.controls.Rejection.value.AppRemarks;
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to to proceed First level approvel ?</b>',
      nzOnOk: () => {
        if (this.enbleTrading) {
          if (this.form.controls.tradeNominee.value == '' || this.form.controls.tradeNominee.value == null) {
            this.notif.error('Trading nominee not selected, please do.', '')
            return
          }
        }

        if (this.residualValidator) {
          if (this.form.controls.firstNomineeDetails.value.nomineeResidualshares == 'N' &&
            this.form.controls.SecondNomineeDetails.value.nomineeResidualshares == 'N' &&
            this.form.controls.ThirdNomineeDetails.value.nomineeResidualshares == 'N') {
            this.notif.error('Please choose nominee residual shares.', '')
            return
          }
        }

        let validNominee1 = this.cmServ.validateForm(this.form.controls.firstNomineeDetails, this.FormControlNames, this.Label);
        if (validNominee1) {

          let identificationvalidn1 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee1Fields, "nomineeproof", "nomineeproof1"), "first nominee")
          let identificationvalidg1 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian1Fields, "guardianproof", "guardianproof1"), "first guardian")

          let identificationvalidn2 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee2Fields, "nomineeproof", "nomineeproof2"), "second nominee")
          let identificationvalidg2 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian2Fields, "guardianproof", "guardianproof2"), "second guardian")

          let identificationvalidn3 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Nominee3Fields, "nomineeproof", "nomineeproof3"), "third nominee")
          let identificationvalidg3 = this.validServ.validateCRFIdentitydetails(this.cmServ.getProofOfDetialsDataNominee(this.Gardian3Fields, "guardianproof", "guardianproof3"), "third guardian")

          if (identificationvalidn1) {
            if (identificationvalidg1) {
              if (identificationvalidn2) {
                if (identificationvalidg2) {
                  if (identificationvalidn3) {
                    if (identificationvalidg3) {
                      let data1 = []

                      let Nominee1 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee1Fields, "nomineeproof", "nomineeproof1"));
                      let Gardian1 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian1Fields, "guardianproof", "guardianproof1"));
                      data1.push({ ...this.form.controls.firstNomineeDetails.value, ...Nominee1, ...Gardian1 });
                      this.firstNomineeDetailsXML = jsonxml(data1);

                      let validNominee2 = this.cmServ.validateForm(this.form.controls.SecondNomineeDetails, this.FormControlNames, this.Label);
                      if (validNominee2) {
                        let Nominee2 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee2Fields, "nomineeproof", "nomineeproof2"));
                        let Gardian2 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian2Fields, "guardianproof", "guardianproof2"));
                        let data2 = []
                        data2.push({ ...this.form.controls.SecondNomineeDetails.value, ...Nominee2, ...Gardian2 })
                        this.SecondNomineeDetailsXML = jsonxml(data2);

                        let validNominee3 = this.cmServ.validateForm(this.form.controls.ThirdNomineeDetails, this.FormControlNames, this.Label);
                        if (validNominee3) {
                          let percentagevalid = this.checkPercentOfShare();

                          if (percentagevalid) {
                            var nomineevalid: boolean = false;
                            nomineevalid = this.ValidateNominee()

                            if (nomineevalid) {
                              let Nominee3 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Nominee3Fields, "nomineeproof", "nomineeproof3"));
                              let Gardian3 = this.cmServ.generateJSONfromArray(this.cmServ.getProofOfDetialsDataNominee(this.Gardian3Fields, "guardianproof", "guardianproof3"));
                              let data3 = []
                              data3.push({ ...this.form.controls.ThirdNomineeDetails.value, ...Nominee3, ...Gardian3 })
                              this.ThirdNomineeDetailsXML = jsonxml(data3);
                              var proof = []
                              proof = this.img.setDataForxml();
                              var nomineedetails: any = [];
                              nomineedetails.push({ "equalShareFlag": this.form.controls.nomineeEqualShareForNominess.value ? this.form.controls.nomineeEqualShareForNominess.value : false });
                              nomineedetails.push({ "TradingNominee": 1 });
                              nomineedetails.push({ "FirstNomineeDetails": this.firstNomineeDetailsXML });
                              nomineedetails.push({ "SecondNomineeDetails": this.SecondNomineeDetailsXML })
                              nomineedetails.push({ "ThirdNomineeDetails": this.ThirdNomineeDetailsXML });

                              var NomineeFulldetail: any = [];
                              NomineeFulldetail.push({ "NomineeDetails": nomineedetails });

                              var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(NomineeFulldetail)
                              var nomineeDetailsxml = jsonxml(nomineeDetailsjson);

                              var approvel = {
                                "batchStatus": "false",
                                "detailArray":
                                  [{
                                    Pan: this.PANNO,
                                    EntryType: this.tab,
                                    ActionType: 'F',
                                    FileData: nomineeDetailsxml.replace(/&/gi, '&amp;'),
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
                                "outTblCount": "0",
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
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    //}
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
        this.enableFields('');

      }

    });
  }

  clearValues(n) {
    console.log("tere==>", n, this.Nominee1Fields[0].nomineeproof10);

    if (n == 'N1' && this.Nominee1Fields[0].nomineeproof10 == '') {
      this.panholder1 = ''
      this.panbutton1 = true;
    }
    // if (n == 'G1' && this.Gardian1Fields[0].guardianproof10 == '') {
    //   this.panholder2 = ''
    //   this.panbutton2 = true;
    // }
    if (n == 'N2' && this.Nominee2Fields[0].nomineeproof20 == '') {
      this.panholder3 = ''
      this.panbutton3 = true;
    }
    // if (n == 'G2' && this.Gardian2Fields[0].guardianproof20 == '') {
    //   this.panholder4 = ''
    //   this.panbutton4 = true;
    // }
    if (n == 'N3' && this.Nominee3Fields[0].nomineeproof30 == '') {
      this.panholder5 = ''
      this.panbutton5 = true;
    }

    // if (n == 'G3' && this.Gardian3Fields[0].guardianproof30 == '') {
    //   this.panholder6 = ''
    //   this.panbutton6 = true;
    // }
  }
  Setdemat(data, item, i, n) {//  MOd:aksa
    if(item.Code =='34' && this.newPanService)
      this.enableVerify(n)
    console.log("i", item, i);
    this.text = data
    console.log(this.text);
    if(!this.newPanService)
    this.clearValues(n);
    this.data1 = data;

    if (data.length == 16) {
      // debugger
      // this.notif.error('Please enter valid dpclientid', '');

    }

    // if(data=='07'){
    // data.setValidators(Validators.maxLength(16))
    // }
    // if(item.code=="07"){
    //   // var inp = String.fromCharCode(event.keyCode);

    // if (/[a-zA-Z0-9]/.test(data)) {
    //   return true;
    // } else {
    //   // event.preventDefault();
    //   return false;
    // }
    // }

  }


  // Setdemat(data, item, i) {//  MOd:aksa
  //   console.log("i", item, i);

  //   //  MOd:aksa

  //   if (('nomineeproof1' + i) == "nomineeproof10") {
  //     console.log(data);
  //     // if(data.length<16){
  //     //   this.notif.error('Please enter valid dpclientid', '');
  //     //   return
  //     // }

  //     if (data.length > 15) {

  //       this.dataServ.getResultArray({
  //         "batchStatus": "false",
  //         "detailArray":
  //           [{

  //             dpclientid: data,
  //             Euser: this.currentUser.userCode


  //           }],
  //         "requestId": "6026",
  //         "outTblCount": "0"
  //       })
  //         .then((response) => {
  //           // this.isSpinVisible = true;
  //           console.log(response);
  //           let data1 = response
  //           console.log("data", data1.results[0][0].Firstholdername);
  //           if( data1.results[0][0].Firstholdername==null){
  //             // alert("plz upload demat account cml file")
  //             this.notif.warning('Please upload demat account cml file', '');
  //             return
  //           }
  //           this.showtext = true
  //           this.showbutton=true


  //           this.holdername = data1.results[0][0].Firstholdername





  //         }




  //         )
  //     }

  //   }


  // }
  verify(data) {//  MOd:aksa


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          dpclientid: this.text,
          Euser: this.currentUser.userCode


        }],
      "requestId": "6026",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log(response);

        //let data1 = response
        console.log("result", response.results[0][0]);
        console.log("res2", response.results[0][0][0]);


        console.log("data", response.results[0][0].Firstholdername);


        if (response.results[0][0].errorCode && response.results[0][0].errorCode == -1) {
          debugger
          this.notif.error(response.results[0][0].errorMessage, '')

          return
        }

        if (!response.results[0][0].Firstholdername) {
          debugger

          this.notif.warning('Please upload demat account cml file', '');
          this.firstHolderInvalid = true;
          this.secondHolderInvalid = true;
          this.thirdHolderInvalid = true;
          // this.firstHolderInvalid2 = true;
          // this.firstHolderInvalid3 = true;
          return

        }

        else {
          if (data == 'N1') {
            this.showtext1 = true;


            this.showbutton1 = false;


            this.holdername1 = response.results[0][0].Firstholdername
            this.firstHolderInvalid = false;
            this.secondHolderInvalid = false;
            this.thirdHolderInvalid = false;
            // this.firstHolderInvalid2 = false;
            // this.firstHolderInvalid3 =false
          }
          else if (data == 'G1') {
            this.showtext2 = true;


            this.showbutton2 = false;


            this.holdername2 = response.results[0][0].Firstholdername

          }
          else if (data == 'N2') {
            debugger
            this.showtext3 = true;


            this.showbutton3 = false;


            this.holdername3 = response.results[0][0].Firstholdername

          }
          else if (data == 'G2') {
            this.showtext4 = true;


            this.showbutton4 = false;


            this.holdername4 = response.results[0][0].Firstholdername

          }
          else if (data == 'N3') {
            this.showtext5 = true;


            this.showbutton5 = false;


            this.holdername5 = response.results[0][0].Firstholdername

          }
          else if (data == 'G3') {
            this.showtext6 = true;


            this.showbutton6 = false;


            this.holdername6 = response.results[0][0].Firstholdername

          }
        }
        //     if(this.text >16){
        //   this.notif.error('Please enter valid dpclientid', '');

        // }




        // this.holdername2 = response.results[0][0].Firstholdername
        // this.holdername3 = response.results[0][0].Firstholdername

      }
      )

  }



  ValidateId(event) {
    debugger
    var inp = String.fromCharCode(event.keyCode);
    var fullstring = event.currentTarget.value
    console.log("full", fullstring);
    console.log("inp", inp);
    console.log("length", fullstring.length);



    if (/[a-zA-Z0-9]/.test(inp) && fullstring.length <= 15) {
      return true;
    }
    // else if (fullstring.length > 16) {debugger
    //   event.preventDefault();
    //   return false;
    // }
    else {
      event.preventDefault();
      return false;
    }
  }

  duplicateControlError(field) {
    return (control: FormControl) => {
      let result: boolean = false;
      const group = control.parent as FormGroup;
      if (group) {
        const values = control.parent.parent.value.map(x => x[field]);
        result = values.filter(x => x == control.value).length > 1;
      }
      return result ? { error: "duplicate" } : null;
    };
  }

  verifypannumber(datas) {
    if(!this.newPanService)
    {
      var pan: any;
    // this.form.controls.dob.patchValue('1992-12-12')
    if (datas == 'N1') {
      pan = this.Nominee1Fields[0].nomineeproof10
      //console.log("n1", pan);
    }
    else if (datas == 'G1') {
      pan = this.Gardian1Fields[0].guardianproof10
      //console.log("g1", pan);
    }
    else if (datas == 'N2') {
      pan = this.Nominee2Fields[0].nomineeproof20
      //console.log("n2", pan);
    }
    else if (datas == 'G2') {
      pan = this.Gardian2Fields[0].guardianproof20
      //console.log("g2", pan);
    }
    else if (datas == 'N3') {
      pan = this.Nominee3Fields[0].nomineeproof30
      //console.log("n3", pan);
    }
    else if (datas == 'G3') {
      pan = this.Gardian3Fields[0].guardianproof30
      //console.log("g3", pan);
    }
    // if (pan.length == 10) {
    debugger
    if (datas == 'N1' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    if (datas == 'G1' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    if (datas == 'N2' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    if (datas == 'G2' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    if (datas == 'N3' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    if (datas == 'G3' && pan == undefined || pan == '') {
      this.notif.error('Please enter PanNo', '')
      return
    }
    var PanDetails = [];
    //console.log("pandetails", PanDetails);
    // this.nomineeForm1.controls.Firstnomineenameasinpan.setValue("abcd");

    // this.nomineeForm1.controls.Firstnomineeguardiannameasinpan.setValue(this.panholder2);
    this.dataServ.varifyPan(pan).
      then(result => {
        debugger
        PanDetails = result
        if (PanDetails && PanDetails.length > 0) {
          debugger
          if (datas == 'N1' && this.Nominee1Fields[0].nomineeproof10) {
            this.pantext1 = true;
            this.panbutton1 = false;
            this.panholder1 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.nomineeForm1.controls.Firstnomineenameasinpan.setValue(this.panholder1);
          }
          else if (datas == 'G1' && this.Gardian1Fields[0].guardianproof10) {
            debugger
            this.pantext2 = true;
            this.panbutton2 = false;
            this.panholder2 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.nomineeForm1.controls.Firstnomineeguardiannameasinpan.setValue(this.panholder2);
          }
          else if (datas == 'N2' && this.Nominee2Fields[0].nomineeproof20) {
            debugger
            this.pantext3 = true;
            this.panbutton3 = false;
            this.panholder3 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.nomineeForm2.controls.Secondnomineenameasinpan.setValue(this.panholder3);

          }
          else if (datas == 'G2' && this.Gardian2Fields[0].guardianproof20) {
            debugger
            this.pantext4 = true;
            this.panbutton4 = false;
            this.panholder4 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.nomineeForm2.controls.Secondnomineeguardiannameasinpan.setValue(this.panholder4);

          }
          else if (datas == 'N3' && this.Nominee3Fields[0].nomineeproof30) {
            debugger
            this.pantext5 = true;
            // this.isdisabledpan = true;
            this.panbutton5 = false;

            this.panholder5 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.nomineeForm3.controls.Thirdnomineenameasinpan.setValue(this.panholder5);
          }
          else if (datas == 'G3' && this.Gardian3Fields[0].guardianproof30) {
            debugger
            this.pantext6 = true;
            this.panbutton6 = false;

            this.panholder6 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            //console.log("panholder6", this.panholder6);
            this.nomineeForm3.controls.Thirdnomineeguardiannameasinpan.setValue(this.panholder6);

          }
          // if (this.form.value.nameinpansite && this.form.value.nameinpansite != '' ){
          //   this.cmServ.nameinpansite.next(PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName)
          //   this.nameinpansit = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          // }


          // if (this.form.value.nameinpansite && this.form.value.nameinpansite != '') {
          //   this.cmServ.nameinpansite.next(PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName)
          //   this.nameinpansit = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          // }
        }

      })
    }
    else
    {
    debugger
    //console.log("datas", datas);
    var pan: any;
    var name
    var dob
    if (datas == 'N1') {
      pan = this.Nominee1Fields[0].nomineeproof10
      dob =this.nomineeForm1.controls.nomineeDOB.value
      name =this.panholder1
    }
    // else if (datas == 'G1') {
    //   pan = this.Gardian1Fields[0].guardianproof10
    //   dob =this.nomineeForm1.controls.nomineeDOB.value
    //   name =this.panholder2
    // }
    else if (datas == 'N2') {
      pan = this.Nominee2Fields[0].nomineeproof20
      dob =this.nomineeForm2.controls.nomineeDOB.value
      name =this.panholder3
    }
    // else if (datas == 'G2') {
    //   pan = this.Gardian2Fields[0].guardianproof20
    //   dob =this.nomineeForm2.controls.nomineeDOB.value
    //   name =this.panholder4
    // }
    else if (datas == 'N3') {
      pan = this.Nominee3Fields[0].nomineeproof30
      dob =this.nomineeForm3.controls.nomineeDOB.value
      name =this.panholder5
    }
    // else if (datas == 'G3') {
    //   pan = this.Gardian3Fields[0].guardianproof30
    //   dob =this.nomineeForm3.controls.nomineeDOB.value
    //   name =this.panholder6
    // }
    
    let validatedata=(datas == 'N1' || datas == 'G1' ||datas == 'N2' || datas == 'G2' || datas == 'N3' || datas == 'G3')
    console.log(name,dob,pan,validatedata,"validatedata");
    if (validatedata && pan == undefined || pan == '') {
      this.notif.error('Please enter Pan No', '')
      return
    }
    pan = pan.toUpperCase()
    if(validatedata && !this.validatePANOnVerify(pan))
    {
      this.notif.error('Please enter valid PAN Number ', '');
      return;
    }
    if (validatedata && !name) {
      this.notif.error('Please enter Name (As per PAN Card) ', '');
      return;
    }
    name =name.toUpperCase()
    // if(validatedata && !this.validateName(name,'verify'))
    // {
    //   this.notif.error('Please enter valid Name (As per PAN Card)', '');
    //   return;
    // }
    if (validatedata && !dob) {
      this.notif.error('Please enter DOB ', '');
      return;
    }
    // if (datas == 'G1' && pan == undefined || pan == '') {
    //   this.notif.error('Please enter PanNo', '')
    //   return
    // }
    // if (datas == 'N2' && pan == undefined || pan == '') {
    //   this.notif.error('Please enter PanNo', '')
    //   return
    // }
    // if (datas == 'G2' && pan == undefined || pan == '') {
    //   this.notif.error('Please enter PanNo', '')
    //   return
    // }
    // if (datas == 'N3' && pan == undefined || pan == '') {
    //   this.notif.error('Please enter PanNo', '')
    //   return
    // }
    // if (datas == 'G3' && pan == undefined || pan == '') {
    //   this.notif.error('Please enter PanNo', '')
    //   return
    // }
    var PanDetails = [];
    //console.log("pandetails", PanDetails);
    // this.nomineeForm1.controls.Firstnomineenameasinpan.setValue("abcd");
    // this.nomineeForm1.controls.Firstnomineeguardiannameasinpan.setValue(this.panholder2);
    this.dataServ.post(environment.pan_verify,[
      {
          "pan": pan ? pan : '',//"CYIPP8888A", //-- M
          "name": name ? name : '',//"ABC PQR XYZ", //-- M
          "fathername": '',//"PQR ABC FED", //-- O
          "dob": dob ? moment(dob).format('DD/MM/yyyy') : ''//"19/08/1974" //-- M
      }],{'Content-Type':'application/json'}).
      then((result:any) => {
        console.log(result);
        if(result && result.errorCode=='1')
      {
        let innerdata = result && result.data? JSON.parse(result.data):[]
        PanDetails = innerdata && innerdata.outputData?innerdata.outputData:[]
        console.log(PanDetails,"PanDetails");
        
        if (PanDetails && PanDetails.length > 0) {
          if (datas == 'N1' && this.Nominee1Fields[0].nomineeproof10) {
            // this.pantext1 = true;
            // this.panholder1 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.panbutton1 = false;
            this.nomineeForm1.controls.Firstnomineenameasinpan.setValue(this.panholder1);
            this.nomineeForm1.controls.nameverifiedITD.setValue(PanDetails[0].name);
            this.nomineeForm1.controls.dobverifiedITD.setValue(PanDetails[0].dob);
            this.nomineeForm1.controls.panverifyClick.setValue(true);
            
          }
          // else if (datas == 'G1' && this.Gardian1Fields[0].guardianproof10) {
          //   // this.pantext2 = true;
          //   // this.panholder2 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          //   this.panbutton2 = false;
          //   this.nomineeForm1.controls.Firstnomineeguardiannameasinpan.setValue(this.panholder2);
          //   this.nomineeForm1.controls.guardiannameverifiedITD.setValue(PanDetails[0].name);
          //   this.nomineeForm1.controls.guardiandobverifiedITD.setValue(PanDetails[0].dob);
          //   this.nomineeForm1.controls.guardianpanverifyClick.setValue(true);
          // }
          else if (datas == 'N2' && this.Nominee2Fields[0].nomineeproof20) {
            // this.pantext3 = true;
            // this.panholder3 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.panbutton3 = false;
            this.nomineeForm2.controls.Secondnomineenameasinpan.setValue(this.panholder3);
            this.nomineeForm2.controls.nameverifiedITD.setValue(PanDetails[0].name);
            this.nomineeForm2.controls.dobverifiedITD.setValue(PanDetails[0].dob);
            this.nomineeForm2.controls.panverifyClick.setValue(true);

          }
          // else if (datas == 'G2' && this.Gardian2Fields[0].guardianproof20) {
          //   // this.pantext4 = true;
          //   // this.panholder4 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          //   this.panbutton4 = false;
          //   this.nomineeForm2.controls.Secondnomineeguardiannameasinpan.setValue(this.panholder4);
          //   this.nomineeForm2.controls.guardiannameverifiedITD.setValue(PanDetails[0].name);
          //   this.nomineeForm2.controls.guardiandobverifiedITD.setValue(PanDetails[0].dob);
          //   this.nomineeForm2.controls.guardianpanverifyClick.setValue(true);

          // }
          else if (datas == 'N3' && this.Nominee3Fields[0].nomineeproof30) {
            // this.pantext5 = true;
            // this.panholder5 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            this.panbutton5 = false;

            this.nomineeForm3.controls.Thirdnomineenameasinpan.setValue(this.panholder5);
            this.nomineeForm3.controls.nameverifiedITD.setValue(PanDetails[0].name);
            this.nomineeForm3.controls.dobverifiedITD.setValue(PanDetails[0].dob);
            this.nomineeForm3.controls.panverifyClick.setValue(true);
          }
          // else if (datas == 'G3' && this.Gardian3Fields[0].guardianproof30) {
          //   // this.pantext6 = true;
          //   // this.panholder6 = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          //   this.panbutton6 = false;
          //   this.nomineeForm3.controls.Thirdnomineeguardiannameasinpan.setValue(this.panholder6);
          //   this.nomineeForm3.controls.guardiannameverifiedITD.setValue(PanDetails[0].name);
          //   this.nomineeForm3.controls.guardiandobverifiedITD.setValue(PanDetails[0].dob);
          //   this.nomineeForm3.controls.guardianpanverifyClick.setValue(true);

          // }
          // if (this.form.value.nameinpansite && this.form.value.nameinpansite != '' ){
          //   this.cmServ.nameinpansite.next(PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName)
          //   this.nameinpansit = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          // }


          // if (this.form.value.nameinpansite && this.form.value.nameinpansite != '') {
          //   this.cmServ.nameinpansite.next(PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName)
          //   this.nameinpansit = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
          // }
        }
      }
      else {
        this.notif.error(result.errorMessage, '');
        return;
      }
      })
    }
    // }
  }
  // validateName(val,type?) {
  //   console.log(val,type);
    
  //   let charonly = /^[a-zA-Z ]*$/
  //   let space =/^[ ]*$/
  //   var text = type==='verify'?val:val.key
  //   let bool =type==='verify' && space.test(text)?false:charonly.test(text)

  //   return bool
  // }
  validatePANOnVerify(panCardNo:string):boolean
  {
    let regex = new RegExp(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/);
    if (panCardNo == null) {
      return false;
  }
  // Return true if the PAN NUMBER
  // matched the ReGex
  if (regex.test(panCardNo) == true) {
      return true;
  }
  else {
      return false;
  }
  }
  enableVerify(datas)
  {
    if ( datas == 'N1' && this.nomineeForm1.controls.panverifyClick.value) {
      this.panbutton1 = true;
      this.panname1 = true;
      this.disablepanholder1=false
      // this.panholder1= null
      // this.nomineeForm1.controls.Firstnomineenameasinpan.setValue(this.panholder1);
      this.nomineeForm1.controls.nameverifiedITD.setValue('N');
      this.nomineeForm1.controls.dobverifiedITD.setValue('N');
      this.nomineeForm1.controls.panverifyClick.setValue(false);
    }
    // else if ((datas="First" || datas == 'G1') && this.nomineeForm1.controls.guardianpanverifyClick.value) {
    //   this.panbutton2 = true;
    //   this.panholder2= null
    //   this.nomineeForm1.controls.Firstnomineeguardiannameasinpan.setValue(this.panholder2);
    //   this.nomineeForm1.controls.guardiannameverifiedITD.setValue('N');
    //   this.nomineeForm1.controls.guardiandobverifiedITD.setValue('N');
    //   this.nomineeForm1.controls.guardianpanverifyClick.setValue(false);
    // }
    else if ( datas == 'N2' && this.nomineeForm2.controls.panverifyClick.value) {
      this.panbutton3 = true;
      this.panname3 = true;
      this.disablepanholder3=false
      // this.panholder3= null
      // this.nomineeForm2.controls.Secondnomineenameasinpan.setValue(this.panholder3);
      this.nomineeForm2.controls.nameverifiedITD.setValue('N');
      this.nomineeForm2.controls.dobverifiedITD.setValue('N');
      this.nomineeForm2.controls.panverifyClick.setValue(false);

    }
    // else if ((datas="Second" || datas == 'G2') && this.nomineeForm2.controls.guardianpanverifyClick.value) {
    //   this.panbutton4 = true;
    //   this.panholder4= null
    //   this.nomineeForm2.controls.Secondnomineeguardiannameasinpan.setValue(this.panholder4);
    //   this.nomineeForm2.controls.guardiannameverifiedITD.setValue('N');
    //   this.nomineeForm2.controls.guardiandobverifiedITD.setValue('N');
    //   this.nomineeForm2.controls.guardianpanverifyClick.setValue(false);

    // }
    else if (datas == 'N3' && this.nomineeForm3.controls.panverifyClick.value) {
      this.panbutton5 = true;
      this.panname5 = true;
      this.disablepanholder5=false
      // this.panholder5= null
      // this.nomineeForm3.controls.Thirdnomineenameasinpan.setValue(this.panholder5);
      this.nomineeForm3.controls.nameverifiedITD.setValue('N');
      this.nomineeForm3.controls.dobverifiedITD.setValue('N');
      this.nomineeForm3.controls.panverifyClick.setValue(false);
    }
    // else if ((datas="Third" || datas == 'G3') && this.nomineeForm3.controls.guardianpanverifyClick.value) {
    //   this.panbutton6 = true;
    //   this.panholder6= null
    //   this.nomineeForm3.controls.Thirdnomineeguardiannameasinpan.setValue(this.panholder6);
    //   this.nomineeForm3.controls.guardiannameverifiedITD.setValue('N');
    //   this.nomineeForm3.controls.guardiandobverifiedITD.setValue('N');
    //   this.nomineeForm3.controls.guardianpanverifyClick.setValue(false);
    // }
  }
}

