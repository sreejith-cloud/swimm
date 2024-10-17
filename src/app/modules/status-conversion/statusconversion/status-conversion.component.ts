import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { InputMasks, InputPatterns, FindOptions, DataService, PageService, WorkspaceService, UtilService, FormHandlerComponent, AuthService, ValidationService } from 'shared';
import { User } from 'shared/lib/models/user'
import { CRFDataService } from '../../crf/CRF.service';
import { CRFImageUploadComponent } from '../../crf/CRFimage upload/component';
import { EditwindowComponent } from '../../crf/editwindow/editwindow.component';
import * as  jsonxml from 'jsontoxml';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientMasterService } from '../../crf/client-master.service';
import { ViewportScroller } from '@angular/common';
// import { ClientMasterService } from '../client-master/client-master.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { StatusConversionvalidataions } from './StatusConversionValidationConfig'
import { Subscription } from 'rxjs';
import { financialValidations } from '../../client-master/financials/financialValidationConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StatusconversionService } from '../statusconversion.service';
import {MultiFileSinglePageViewComponent} from "./multi-file-single-page-view/multi-file-single-page-view.component";
export interface NomineeDetails {
  MFGuardian: string;
  MFGuardianADD3: string;
  MFGuardianAdd1: string;
  MFGuardianAdd2: string;
  MFGuardianPIN: number;
  MFNomineeAdd1: string;
  MFNomineeAdd2: string;
  MFNomineeAdd3: string;
  MFNomineeDOB: string;
  MFNomineeName: string;
  MFNomineePIN: number;
  MFNomineeRelShip: string;
  MFminorNomineeRelat: string;
}
export interface ClientChangeRequest {
  PanNo: any;
  uniqueCode: any;
  Cin: any;
  ToLocationField:any;
}
@Component({
  selector: 'app-status-conversion',
  templateUrl: './status-conversion.component.html',
  styleUrls: ['./status-conversion.component.less']
})
export class StatusConversionComponent implements OnInit {

  // @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild(EditwindowComponent) EditWindow: EditwindowComponent
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('targetRed') el: ElementRef;

  panFindOption: FindOptions;

  currentUser: User;
  find: any;
  edittabtitle: any;
  changereq: any;
  selectedIndex: number;
  activeTabIndex: number = 0;
  model: ClientChangeRequest;
  clientArray: any[] = [];
  clientArrayTemp: any = [];
  krakyc: any = [];
  tableCheckBox: boolean = true;
  testdata: any[];
  ckyc: any;
  kra: any;
  Dob: any;
  changeAccounts: any[] = [];
  krakycCheck: any = true;
  ckycCheck: any = false;
  isVisible: boolean = false;
  PanDetails: any;
  panValid: boolean = true;
  temparray: any = [];
  IsForConfirmation: boolean = false;
  clientserielno: any = '';
  DummyResponseApproveData: any = [];
  serielno: any = 0;
  rejectedRequests: any = [];
  pendingRequests: any = [];
  pendingRquestskeys: any = [];
  isVisiblePending: boolean = false;
  isVisibleRejection: boolean = false;
  rejectionRequestKeys: any = [];
  pendingcount: any;
  rejectionCount: any;
  isSpining: any;
  IsRejectedRequest: boolean = false;
  krakycCheckvalidation: any = false;
  approvedCount: any;
  approvedRequest: any = [];
  isVisibleApproved: boolean = false;
  approvedRequestHeader: any = [];
  filePreiewVisible: boolean = false;
  signaturefilePreiewVisible: boolean = false
  filePreiewContent: any = {};
  test123: boolean = true;
  accountCountArray: any = {};
  testModel: any;
  clientBankAccounts: any = [];
  date: any;
  Branch: any;
  DisableCheck: boolean = false;
  Changereqdisable: boolean = false;
  RegectionReason: any = '';
  RejectionReason: any = '';
  rejorapprove: boolean;
  savehide: boolean;
  isApproved: boolean = false;
  acc: any;
  HO: boolean = false;
  clientStatus: any = '';
  noDataflag: boolean = true
  canAdd: any;
  canModify: any;
  saveButtonFlag: boolean = true;
  approveOrRejectButtonFlag: boolean = false
  finalApproveOrRejectButtonFlag: boolean = false
  faqVisible: boolean = true
  status: any;
  fromReportPoolPage: boolean = false;
  applicationStatus: string;
  pendingOrRejected: boolean = false;
  notifcontent: any = '';
  approvelRemarks: any[] = [];
  rejectionRemarks: any[] = [];
  remaks: any[] = [];
  nomobileFlag: any;
  noemailFlag: any;
  IndivitualClient: boolean = true;
  isIpvHistory: boolean = false;
  IPVHistoryHeader: any = [];
  IPVHistory: any = [];
  isVisibleHolders: boolean = false;
  holderDataHeader: any = [];
  holderData: any = [];
  showMob: boolean = false;
  showEmail: boolean = false;
  Mobile: any;
  Email: any;
  newMobile: any;
  newEmail: any;
  MobileorEmaillabel: any;
  // inputMasks = InputMasks;
  showSendLink: boolean = false;
  Link: boolean = true;
  noLink: boolean = false;
  // ChangeFlag : any = []
  // addressFlag : boolean = false;
  // emailFlag : boolean = false;
  // mobileFlag : boolean = false;
  // telephoneFlag : boolean = false;
  // bankFlag : boolean = false;
  // nomineeFlag : boolean = false;
  // financialFlag : boolean = false;
  // ckycFlag : boolean = false;
  KRAKYCtitle: any;
  HOModification: any;
  FirstlevelApprove: any = [];
  FirstlevelApprovekeys: any = [];
  isVisibleFrstApprove: boolean = false;
  frstLvlApprovalCount: any;
  sameaccounttype: boolean = true
  MultipleDPAvailable: boolean = false
  afterpansearch: boolean = false
  Signatureimagepreview: any;
  NomineeDetails: Array<NomineeDetails> = []
  Nomineecardshow: boolean = false
  NomineeDetailsheaders: Array<string> = ["MFGuardian", "MFGuardianADD3", "MFGuardianAdd1", "MFGuardianAdd2", "MFGuardianPIN", "MFNomineeAdd1", "MFNomineeAdd2", "MFNomineeAdd3", "MFNomineeDOB", "MFNomineeName", "MFNomineePIN", "MFNomineeRelShip", "MFminorNomineeRelat"]
  fisttabcompleted: boolean = false
  branch: string;
  ioru: string = 'I'

  //second tab initiations

  // 5 validation initialization

  // form_FiveValidation: FormGroup;
  ValidateFormEnable: boolean = false
  ValidationNextButtonEnable: boolean = false
  //mobileemailchecked: boolean = false
  //statecountrypincodechecked: boolean = false
  //activedpmandatorychecked: boolean = false
  //bankaccountdetailschecked: boolean = false
  //krastatusandckycnumberchecked: boolean = false
  //financialupdationintradecodechecked: boolean = false
  openpositionorunsettledchecked: boolean = false//= true
  debitbalanceintradecodechecked: boolean = false//= true
  mtfpositionnotintradecodechecked: boolean = false//= true
  pledgerequestnotintradecodechecked: boolean = false//= true
  activeSIPnotintradecodechecked: boolean = false//= true
  mtfpositionnotintradecodeenable: boolean = false
  // activerunningsipnotintradecodechecked :boolean =false
  AccountName: string = "";
  requestID: any = 23133123;
  backbuttonenable: boolean = true
  savebuttonenable: boolean = true
  printallbuttonenable: boolean = false
  SaveandFinalizebuttonenable: boolean = false
  Aproovebuttonenable: boolean = false
  // Rejectbuttonenable :boolean =false
  // HO 5 validation initialization
  poolpendingchecked: boolean = true
  marginchecked: boolean = true
  kraactivationchecked: boolean = true
  Ledgerchecked: boolean = true
  cpcodechecked: boolean = true
  firsttabdisable: boolean = true
  secondtabdisable: boolean = true
  thirdtabdisable: boolean = true
  secondTabCompleted: boolean = false

  //type_selection
  AllFormEnable: boolean = false
  form_type_selection: FormGroup;
  Type1disable: boolean = false
  Type2disable: boolean = false
  Type3disable: boolean = false
  maintypelist: Array<any> = ["Type1", "Type2", "Type3"]
  type1DAoldtypelist: Array<any> = ['NON RESIDENT INDIAN (NRI)', 'NRI']
  type1DAnewtypelist: Array<any> = ['RESIDENT']
  type1DAoldsubtypelist: Array<any> = ['REPATRIABLE', 'NON REPATRIABLE']
  type1DAnewsubtypelist: Array<any> = ['ORDINARY']
  type1TAoldtypelist: Array<any> = ['NRE', 'NRO CM', 'NRO']
  type1TAnewtypelist: Array<any> = ['CL']
  type2DAoldtypelist: Array<any> = ['NON RESIDENT INDIAN (NRI)', 'NRI']
  type2DAnewtypelist: Array<any> = ['NRI']
  type2DAoldsubtypelist: Array<any> = ['REPATRIABLE']
  type2DAnewsubtypelist: Array<any> = ['NON REPATRIABLE']
  type2TAoldtypelist: Array<any> = ['NRE']
  type2TAnewtypelist: Array<any> = ['NRO CM']
  type3DAoldtypelist: Array<any> = ['RESIDENT']
  type3DAnewtypelist: Array<any> = ['NRI']
  type3DAoldsubtypelist: Array<any> = ['ORDINARY']
  type3DAnewsubtypelist: Array<any> = ['NON REPATRIABLE']
  type3TAoldtypelist: Array<any> = ['CL']
  type3TAnewtypelist: Array<any> = ['NRO CM']
  TypeTabIndex: number = 0
  disableMobile: boolean = false
  validcongif = StatusConversionvalidataions
  proofCount: number = 0;
  previewImageData: any;
  subscriptions: Subscription[] = [];
  printButtonFlag: boolean
  ClStatusChangeSlNo: number
  DPId: string = ''
  DPAccountNumber: string = ''
  DPId2: string = ''
  DPAccountNumber2: string = ''
  TradeCode: string = ''
  ClientId: string = ''
  TradeCodeTransfer: boolean = false
  FromLocationField: string = ''
  ToLocationField: any;
  TradingAccountType: string = ''
  NSDLAccountType: string = ''
  CDSLAccountType: string = ''

  //kyc
  isNRE: boolean

  //personal details form

  form: FormGroup;
  inputMasks = InputMasks;
  disableKraFields: boolean = false
  pepArray: any;
  citizenshipArray: any = [];
  occupationArray: any;
  ResidentialStatusArray: any;
  addressTypeArray: any = [];
  resultArray: any;
  riskCountryresultArray: any;
  isLoadingPanDetails: boolean = false;
  isServiceBlocked: boolean = false;
  isShowOtherOccupation: boolean = false
  clientType: string = ""
  merchantnavyStatus: boolean = false
  nationalityArray: any = [];

  personalformenable: boolean = false

  //address details forms
  form_address: FormGroup;
  Address1formFeilds: any = [];
  Address2formFeilds: any = [];
  Address3formFeilds: any = [];
  Address4formFeilds: any = [];
  identityProofformFeilds: Array<any> = []
  entryAccess: boolean = true;
  isServiceCallsAllow: boolean;
  Agency: string = null;
  add1: any;
  add2: any;
  add3: any;
  add4: any;
  enableFacta: boolean = false;
  A1district: any = [];
  A2district: any = [];
  A3district: any = [];
  A4district: any = [];
  isAdd2Pin: boolean = true;
  isAdd1Pin: boolean = true;
  disableKrarelatedFields: boolean;
  PermanentAddressProofDetails: any = [];
  ProofDetials: Array<any> = [];
  totalProofDetial: any = [];
  CorrespondanceAddressProofDetails: any = [];
  countryArray: any;
  code: any;
  isReport: boolean = false;
  hide: boolean = true;
  isPemantSelected: boolean = false
  identityProofDetails: Array<any> = []
  NRI: boolean = false
  // beforeUpload: boolean = false
  clientSerialNumber: number;
  citizenshipWithNoIndiaArray: any;
  JurisdictionAddressProofDetails: any = [];
  PANNO: any;
  DateError: boolean;
  dataOfIssue1: any;
  expiryData1: any;
  dataOfIssue2: any;
  expiryData2: any;
  dataOfIssue3: any;
  expiryData3: any;
  dataOfIssue4: any;
  expiryData4: any;
  dataOfIssue5: any;
  expiryData5: any;
  isJudisdictionSameAsAny: boolean = false;
  IsOther: any = 'false';
  isJudisdiction: boolean = true;
  countryresultArray: any = []

  addressformenable: boolean = false
  timeout = null;
  today = new Date()
  resultArray1: any = [];
  // permadd3max: boolean = true
  // currespadd3max: boolean = true
  // judadd3max: boolean = true


  //contacts details forms
  form_contacts: FormGroup;
  inputPatterns = InputPatterns;
  relationArray: any;
  countrycode: any = [];
  isdCodeArray: Array<any> = []
  min1
  max1
  min2
  max2
  min3
  max3
  contactsdisabledFutureDate: boolean = false
  EntryAccess: any;
  kycContMob1: boolean = false;
  kycAddContMob1: boolean = false;
  kycContEmail1: boolean = false;
  kycContAddEmail1: boolean = false;
  kycContMob2: boolean = false;
  kycAddContMob2: boolean = false;
  kycContEmail2: boolean = false;
  kycContAddEmail2: boolean = false;
  kycAddContMob3: boolean = false;
  kycContEmail3: boolean = false;
  kycContAddEmail3: boolean = false;
  kycContMob3: boolean = false;

  contactsformenable: boolean = false
  mobileRelationEnable:boolean =true
  emailRelationEnable:boolean =true


  //ipv details forms
  form_ipv: FormGroup;

  //financial details forms
  form_financial: FormGroup;
  pepSourceArray: any = [];
  annualIncomeSourceArray: any = [];
  sourceoffund: any = [];
  isOccuVisible: boolean = false
  networthasvalue: boolean = false
  disabledFinDate: boolean = false
  isvisibleprof_busi: boolean = false
  derivativeStatus: boolean = false
  financialtab: string = ""

  financialformenable: boolean = false
  isvisiblebusi: boolean = false;
  isotherSource: boolean = false;
  isOccupdetails: boolean = true;
  Remks: any;
  text: any; //  MOd:aksa
  data1: any;

  //upload  forms
  form_upload: FormGroup;
  SupportFiles: Array<any> = []
  fileSourceName: String = ''
  ImgTypeDatalist = []
  ImgTypeData: any;
  fileList;
  Mandatoryproofs: any = [];
  retrieveData: any = [];
  ho: boolean = false
  Imglist: any;
  index: number;

  uploadformenable: boolean = false
  cpremovalenable: boolean = false
  type1ortyp2proofofuploadlist: Array<any> = [//nri to cl
    { slno: 1, Document: "KRA CKYC form", DocumentProofRequired: true },
    { slno: 2, Document: "Annual KYC Updation form", DocumentProofRequired: true },
    { slno: 31, Document: "BANK CRF", DocumentProofRequired: true },
    { slno: 50, Document: "Nominee opt out form", DocumentProofRequired: true },
    // { slno: 3, Document: "No Nominee Declaration form", DocumentProofRequired: true },
    { slno: 4, Document: "Trade code conversion request letter", DocumentProofRequired: true },
    // { slno: 5, Document: "Client Request in NSDL/CDSL prescribed format Demat Account Conversion", DocumentProofRequired: true },
    { slno: 5, Document: "Demat account conversion form", DocumentProofRequired: true },
    { slno: 6, Document: "Trade code transfer form", DocumentProofRequired: true },
    { slno: 7, Document: "Same email/mobile declaration form", DocumentProofRequired: true },
    { slno: 8, Document: "Running account agreement", DocumentProofRequired: true },
    { slno: 9, Document: "Proof of address", DocumentProofRequired: true },
    { slno: 10, Document: "ID proof", DocumentProofRequired: true },
    { slno: 11, Document: "Bank Proof", DocumentProofRequired: true },
    { slno: 12, Document: "Nomination form", DocumentProofRequired: true },
    { slno: 30, Document: "PAN", DocumentProofRequired: true },
    { slno: 40, Document: "Other document 1", DocumentProofRequired: false },
    { slno: 41, Document: "Other document 2", DocumentProofRequired: false },
    { slno: 42, Document: "Other document 3", DocumentProofRequired: false }


  ]

  // { slno: 4, Document: "No Nominee Declaration form", DocumentProofRequired: true },
  type3proofofuploadlist: Array<any> = [
    { slno: 1, Document: "KRA CKYC form", DocumentProofRequired: true },
    { slno: 2, Document: "Annual KYC Updation form", DocumentProofRequired: true },
    { slno: 3, Document: "BANK CRF", DocumentProofRequired: true },
    { slno: 50, Document: "Nominee opt out form", DocumentProofRequired: true },
    { slno: 5, Document: "Trade code conversion request letter", DocumentProofRequired: true },
    { slno: 6, Document: "Demat account conversion form", DocumentProofRequired: true },
    { slno: 7, Document: "Trade code transfer form", DocumentProofRequired: true },
    // { slno: 8, Document: "FATCA FORM", DocumentProofRequired: true },
    { slno: 9, Document: "Same email/mobile declaration form ", DocumentProofRequired: true },
    { slno: 10, Document: "Copy of VISA", DocumentProofRequired: true },
    { slno: 11, Document: "Copy of Passport", DocumentProofRequired: true },
    { slno: 12, Document: "Copy of foreign Address proof", DocumentProofRequired: true },
    { slno: 13, Document: "Proof of address", DocumentProofRequired: true },
    { slno: 14, Document: "ID proof", DocumentProofRequired: true },
    { slno: 15, Document: "Bank Proof", DocumentProofRequired: true },
    { slno: 16, Document: "US declaration form", DocumentProofRequired: true },
    { slno: 17, Document: "Nomination form", DocumentProofRequired: true },
    { slno: 30, Document: "PAN", DocumentProofRequired: true },
    { slno: 40, Document: "Other document 1", DocumentProofRequired: false },
    { slno: 41, Document: "Other document 2", DocumentProofRequired: false },
    { slno: 42, Document: "Other document 3", DocumentProofRequired: false }
  ]
  //passport form
  form_passport: FormGroup

  //bank form
  form_bank: FormGroup;
  banktab: string = "";
  tradingBankAccType: any;
  ModeOfOperation: any;
  pisBankList: any = [];
  editFlag: boolean = true
  hidRbidetails: boolean = false
  filePreiewFilename: string
  bankfilePreiewContentType: string
  bankfilePreiewVisible: boolean = false;
  bankfilePreiewContent: any = {};

  bankformenable: boolean = false

  //nominee form
  Label = [{ key: 'nomineeHouseName', value: "Address 1" },
  { key: 'nomineeHouseNumber', value: "Address 2" },
  { key: 'nomineeStreet', value: "Address 3" },


  { key: 'guardianHouseName', value: "Address 1" },
  { key: 'guardianHouseNumber', value: "Address 2" },
  { key: 'guardianStreet', value: "Address 3" },

  ];
  form_nominee: FormGroup;
  nomineetab: string = ""
  nomineeForm1: any;
  nomineeForm2: any;
  nomineeForm3: any;
  numOfNominees: any = "One";
  NomineeList: Array<any> = []
  Nominee1Fields: any = [];
  Gardian3Fields: any = [];
  Nominee3Fields: any = [];
  Gardian2Fields: any = [];
  Nominee2Fields: any = [];
  Gardian1Fields: any = [];
  isDisabled: boolean = false;
  dsNominee2: boolean = true;
  dsNominee3: boolean = true;
  nomineeRelationArray: any;
  nomineeIdentificationArray: any;
  CountrycodeArray: any = [];
  Prooffields: any = [];
  disableFld: boolean = false;
  disablenominee: boolean = false;

  nomineehidden: boolean = false
  nomineeformenable: boolean = false
  residualValidator: boolean = false;
  dataforaprove: any = [];
  SerialNumber: any = 0
  IDNO: any;
  numOfNomineesdisable: boolean = false;
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
  firstHolderInvalid: boolean = false;
  secondHolderInvalid: boolean = false;
  thirdHolderInvalid: boolean = false;
  gardian1: boolean = false;
  gardian2: boolean = false;
  gardian3: boolean = false;
  nomineerequestID: any;
  AccountSignature
  //pool page
  CurrentStatus: string = 'Z'
  Remarksenable: boolean = false
  AppRemarksenable: boolean = false
  BoxNo: string =''
  locationFindopt: FindOptions
  Remarks: string = ''
  HOpoolpendingchecked: boolean = false
  HOmarginchecked: boolean = false
  HOLedgerchecked: boolean = false
  HOValidationNextButtonEnable: boolean = false
  firstTabView: boolean = true
  ConversionType: string = ''
  HOCurrentStatus: string = ''
  HOValidateTradeCodeTransfer: boolean = false
  HOValidateUCCTradeCodeTransfer: boolean = false
  CPCodeRemoval: boolean = false
  UCCManualWork: boolean = false
  UCCConverted: boolean = false
  HOVerifyButtonLabel: string = 'Next'
  final: boolean = false
  AccountClientTypeValidate: boolean = false
  PEP: number = -1
  rejectEditeEnable:boolean = false
  rejectEditeEnableAfterSave:boolean = false
  fatcadisable:boolean =false
  DisableNextButton:boolean =false
  KRAUploaded:boolean =false
  KRAUploadedDate:string =''
  KRAstatus:string =''
  productiontestenable:boolean =true
  JoinHolder:boolean =false
  multipleDPCount:number =0
  constructor(
    private cscservice: StatusconversionService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private cmServ: CRFDataService,
    private modalService: NzModalService,
    private pageserv: PageService,
    private wsServ: WorkspaceService,
    private utilServ: UtilService,
    private authServ: AuthService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cmServ2: ClientMasterService,
    // private cmServ3: ClientMasterService
    private scroller: ViewportScroller,
    private validServ: ValidationService,
    private http: HttpClient
  ) {
    // this.form_FiveValidation = fb.group({
    //   openpositionorunsettledchecked: [{checked: true}],
    //   debitbalanceintradecodechecked: [false],
    //   mtfpositionnotintradecodechecked: [false],
    //   pledgerequestnotintradecodechecked: [false],
    //   activeSIPnotintradecodechecked: [false],
    //   ValidationNextButtonEnable:[true]
    // })
    this.form_type_selection = fb.group({
      ConversionType: [null, [Validators.required]],
      Type1: this.createtypeform(),
      Type2: this.createtypeform(),
      Type3: this.createtypeform()


    })

    this.form = fb.group({
      // location: [null, [Validators.required]],
      PAN: [null, [Validators.required]],
      // dob: [null, [Validators.required]],
      nameinpansite: [null],
      // ckyc: [null],
      ProceedType: [null],
      // changeKRA: ['YES',],//[Validators.required]
      AppNamePrefix: [null,],//[Validators.required]
      FirstName: [null,],//[Validators.required]
      MiddleName: null,
      LastName: null,
      MaidenNamePrefix: null,
      MaidenFirstName: null,
      MaidenMiddleName: null,
      MaidenLastName: null,
      FatherSpouseIndicator: [null,],//[Validators.required]
      FatherSpousePrefix: [null,],//[Validators.required]
      FatherSpouseFirstName: [null,],//[Validators.required]
      FatherSpouseMiddleName: null,
      FatherSpouseLastName: null,
      MotherNamePrefix: [null],
      MotherFirstName: null,
      MotherMiddleName: null,
      MotherLastName: null,
      Gender: [null,],//[Validators.required]
      Age: [null,],//[Validators.required]
      Minor: [false],
      // isKRAVerified: [false,],//[Validators.required]
      MaritalStatus: [null,],//[Validators.required]
      Nationality: [null,[Validators.required]],//[Validators.required]
      ResidentialStatus: [null,[Validators.required]],//[Validators.required]
      occupationType: [null],
      otherOccupationValue: [null],
      riskCountry: [null],
      // nameInPan: [null, [Validators.required]],
      CIN: [null],
      // statusChanger: [false],
      merchantnavy: [null]

    });
    this.form_address = fb.group({
      idProof: [null, [Validators.required]],
      taxOutsideIndia: [false],
      proofOfAddress: [1, [Validators.required]],
      address1: this.createAddressGroup(),
      address2: this.createAddressGroup1(),
      address3: this.createAddressGroup(),
      address4: this.createAddressGroup4(),
    })
    this.add1 = this.form_address.controls.address1
    this.add2 = this.form_address.controls.address2
    this.add3 = this.form_address.controls.address3
    this.add4 = this.form_address.controls.address4
    this.form_contacts = fb.group({
      telephoneOffice: [null],
      telephoneResidence: [null],
      fax: [null],
      smsFacility: [true],
      mobile: [null, [Validators.required]],
      isdCodeMobile: [null, [Validators.required]],
      relation: [null, [Validators.required]],
      existingClient: [null],
      existingPan: [null],
      additionalMblNo: [null],
      relation1: [null],
      existingClient1: [null],
      existingPan1: [null],
      email: [null, [Validators.required]],
      relation2: [null, [Validators.required]],
      existingClient2: [null],
      existingPan2: [null],
      isdCodeAdditionMobile: [null],
      addEmail: [null],
      relation3: [null],
      existingClient3: [null],
      existingPan3: [null],
      overseasMobile: [null],
      derivativeSegment: [null],
      nomobileFlag: [null],
      noemailFlag: [null]
    });
    this.form_financial = fb.group({
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
    this.form_ipv = fb.group({
      empCode: [null, [Validators.required]],
      empName: [null, [Validators.required]],
      empBranch: [null, [Validators.required]],
      empDesingation: [null, [Validators.required]],
      date: [null, [Validators.required]],
      dateOfDeclaration: [null],
      placeOfDeclaration: [null],
    });
    this.form_upload = fb.group({
    })
    this.form_passport = fb.group({
      passportName: [null, [Validators.required]],
      placeOfIssue: [null, [Validators.required]],
      dateOfIssue: [null, [Validators.required]],
      expiryDate: [null, [Validators.required]]

    })
    this.form_bank = fb.group({
      //! masterBank: this.createBank(),
      //! Rejection: this.CreateRejectionForm(),
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
      confrmAccntNumber: [null],
      oft: [null],
      // rbirefNo: [null],
      // rbiapprvldt: [null],
      // pisBank: [null],
      BankAddoption: [null]
    });
    this.form_nominee = this.fb.group({
      nomineeEqualShareForNominess: [false, [Validators.required]],
      tradeNominee: [null],
      firstNomineeDetails: this.createFirstHolderDetails(),
      SecondNomineeDetails: this.createFirstHolderDetails(),//this.createSecondHolderDetails(),
      ThirdNomineeDetails: this.createFirstHolderDetails()//this.createThirdHolderDetails(),
      //! Rejection: this.CreateRejectionForm(),
    });
    this.cmServ.requestID.subscribe(item => {
      this.requestID = item
    })
    this.cmServ2.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      // alert(JSON.stringify(user))
      this.branch = this.dataServ.branch
      // alert(this.branch)
    });
    this.panFindOption = {
      findType: 5036,
      codeColumn: 'AccountLocation',//'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"

    }
    this.locationFindopt = {
      findType: 1100,//1003, //5091,//1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.model = <ClientChangeRequest>{};
    // this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
    //   this.approveOrRejectButtonFlag = item
    // })
    // this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
    //   this.finalApproveOrRejectButtonFlag = item;
    // })
    // this.cmServ.saveButtonFlag.subscribe(data => {
    //   this.saveButtonFlag = data
    // })
    // this.cmServ.applicationStatus.subscribe(item => {
    //   this.applicationStatus = item
    // })
    this.cmServ2.kycInitialFillingData.subscribe(val => {
      if (val.length) {
        // console.log("kycInitialFillingData : ",val);

        /////////////////////this.isSpining = false
        // this.pepArray = val[4]
        this.nationalityArray = val[6]
        this.occupationArray = val[3]
        this.ResidentialStatusArray = val[7]
        let totalProofDetial = val[2]
        this.cmServ.proofKeys = totalProofDetial[2]
        this.addressTypeArray = val[11]
        if(!this.fromReportPoolPage)
        {
        this.form.controls.Nationality.patchValue("INDIA")
        }
      }
      else {
        this.isSpining = true
      }
    })
    // this.add4.controls.taxCountry.valueChanges.subscribe(val => {
    //   if (this.form_address.value.taxOutsideIndia) {
    //     let data = val.toUpperCase();
    //     this.countryresultArray = this.citizenshipWithNoIndiaArray.filter(ele => {
    //       return (ele["Country"].startsWith(data))
    //     })
    //   }
    // })

  }


  tempoperations() {//temporory function for development
    this.fisttabcompleted = true
    this.personalformenable = true

    this.addressformenable = true
    this.contactsformenable = true
    this.financialformenable = true
    this.nomineeformenable = true
    this.bankformenable = true
    this.uploadformenable = true
    this.sameaccounttype = false;
  }

  ngOnInit() {
    // let json = [{ name: 'azar', no: '22', value: '33' }, { name: 'azar', no: '22', value: '33' }]
    // let news = []
    // news = json.map((item) => {

    //   return {
    //     name: item.name,
    //     no: item.no
    //   }
    // })
    // console.log(news);

    // this.prefillpersonaldetails()
    /*
    //enable onyly for development purpose
      this.tempoperations()
      this.activeTabIndex = 1
      this.saveButtonFlag =true
      this.model.PanNo ="AJPPJ7996L"
      this.form.patchValue({"PAN":"AJPPJ7996L"})
      this.Type3disable = true
      this.setkycinitialize()
      this.getidentifyprooforaddressproofdetails()
      this.contactssetvalidation()
      this.getfinancial()
      this.getbankdropdown()
      this.nomineeinitialize()
      this.getnomineerelationshipdropdown()
    */


    //////////// this.getproof()
    // this.setproofs("CKYC")


    // this.cmServ2.kycInitialFillingData.subscribe(val => {
    //   if (val.length) {
    //     this.relationArray = val[8]
    //     this.countrycode = val[10]
    //   }
    // })

    if (this.cscservice.fromreportcsc == true) {
      this.CurrentStatus = this.cscservice.status
      console.log(this.CurrentStatus);

      this.isSpining = true
      this.serielno = this.cscservice.slnocsc;
      console.log(this.cscservice.slnocsc)
      this.prefillformdetails()//added

      this.cscservice.slnocsc = null;
      this.fromReportPoolPage = true;
      this.editFlag = true//added
      this.sameaccounttype = false//added
      this.cscservice.fromreportcsc = false;
      //this.fetchdataforConfirmation()


      // this.GetNomineeDetailsforkyc()
      // this.applicationStatus=='T'//added
      // this.tempoperations()//added
      //! this.cmServ.applicationStatus.subscribe(item => {
      //   this.applicationStatus = item
      // })
    }
    else {
      this.isSpining = false
      this.fromReportPoolPage = false
      // if (this.dataServ.ModuleID == 10169) {// 9831) {
      // }
    }
    this.getPermissions()
    var branch = this.dataServ.branch
    // if (branch == 'HO' || branch == 'HOGT') {//commented for enable edit button
    //   this.HO = true
    // }
  }
  ngAfterViewInit() {

    this.ngZone.run(() => {

      // this.setkycinitialize()
      // this.form.controls.dob.valueChanges.subscribe(dt => {
      //   // let date=dt.getDate()+"-"+(dt.getMonth() + 1) +"-"+dt.getFullYear()
      //   let age = this.calculateAge(dt)
      //   this.form.controls.Age.setValue(age)
      //   if (age > 18) {
      //     this.form.controls.Minor.setValue(false)
      //   }
      //   else {
      //     this.form.controls.Minor.setValue(true)
      //   }
      // })

      this.form.controls.FatherSpouseIndicator.valueChanges.subscribe(val => {
        if (val == 'F') {
          this.form.controls.FatherSpousePrefix.setValue("Mr")
        }
        else {
          if (this.form.controls.Gender.value == 'M')
            this.form.controls.FatherSpousePrefix.setValue('Mrs')
          else
            this.form.controls.FatherSpousePrefix.setValue('Mr')
        }
      })

      // this.form.controls.changeKRA.valueChanges.subscribe(val => {
      //   let kra = this.form.value.isKRAVerified
      //   let proceedtype = this.form.controls.ProceedType.value
      //   if (val == 'NO' && kra && proceedtype == 'KRA') {
      //     this.disableKraFields = true;
      //     // this.cmServ.disableKraFields.next(true)
      //   }
      //   if (val == 'YES') {
      //     this.disableKraFields = false;
      //     // this.cmServ.disableKraFields.next(false)
      //   }
      // })

      this.form.controls.Nationality.valueChanges.subscribe(val => {
        if (val != null) {
          let data = val.toUpperCase();
          if (this.nationalityArray.length) {
            this.resultArray = this.nationalityArray.filter(ele => {
              return (ele["Country"].startsWith(data))
            })
          }
        }
        else {
          this.resultArray = []
        }
      })

      this.form.controls.riskCountry.valueChanges.subscribe(val => {
        if (val != null) {
          let data = val.toUpperCase();
          if (this.nationalityArray.length) {
            this.riskCountryresultArray = this.nationalityArray.filter(ele => {
              return (ele["Country"].startsWith(data))
            })
          }
        }
        else {
          this.riskCountryresultArray = []
        }
      })
      // this.add1.controls.street.valueChanges.subscribe(val => {

      //   // if (val.length > 25) {
      //     // this.permadd3max = false
      //   // }
      //   // else {
      //   //   this.permadd3max = true
      //   //   // this.add1.controls.landmark.patchValue(null)
      //   // }

      // })
      // this.add2.controls.street.valueChanges.subscribe(val => {
      //   // this.currespadd3max = val.length > 25 ? false : true
      //   // if (val.length > 25) {
      //     // this.currespadd3max = false
      //   // }
      //   // else {
      //   //   this.currespadd3max = true
      //   // }
      //   // this.add2.controls.landmark.patchValue(null)
      // })
      // this.add4.controls.street.valueChanges.subscribe(val => {
      //   // this.judadd3max = val.length > 25 ? false : true
      //   // if (val.length > 25) {
      //     // this.judadd3max = false
      //   // }
      //   // else {
      //   //   this.judadd3max = true
      //   //   // this.add4.controls.landmark.patchValue(null)
      //   // }
      // })
      this.form.controls.Gender.valueChanges.subscribe(val => {
        this.form.controls.AppNamePrefix.setValue(val == 'M' ? 'Mr' : 'Ms')
      })

      this.form.controls.MotherFirstName.valueChanges.subscribe(val => {
        this.form.controls.MotherNamePrefix.setValue((val == '' || val == null) ? null : 'Mrs')
      })
      //address

      this.add1.controls.houseName.valueChanges.subscribe(val => {
        console.log(val);

        if (this.add2.controls.sameAsPermant.value) {
          console.log("reached");
          this.add2.controls.houseName.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.houseName.setValue(val)
        }
      })
      this.add1.controls.street.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.street.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.street.setValue(val)
        }
      })
      this.add1.controls.landmark.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.landmark.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.landmark.setValue(val)
        }
      })

      this.add1.controls.pinCode.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.pinCode.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.pinCode.setValue(val)
        }
      })
      this.add1.controls.city.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.city.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.city.setValue(val)
        }
      })
      this.add1.controls.district.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.district.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.district.setValue(val)
        }
      })
      this.add1.controls.state.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.state.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.state.setValue(val)
        }
      })
      this.add1.controls.country.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.country.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.country.setValue(val)
        }
      })
      this.add1.controls.proofOfAddress.valueChanges.subscribe(val => {
        if (this.add2.controls.sameAsPermant.value) {
          this.add2.controls.proofOfAddress.setValue(val)
        }
        if (this.add4.controls.sameAddAs.value == 'Permanent') {
          this.add4.controls.proofOfAddress.setValue(val)
        }
      })


      //
      this.add2.controls.houseName.valueChanges.subscribe(val => {
        console.log(val);
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.houseName.setValue(val)
        }
      })
      this.add2.controls.street.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.street.setValue(val)
        }
      })
      this.add2.controls.landmark.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.landmark.setValue(val)
        }
      })

      this.add2.controls.pinCode.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.pinCode.setValue(val)
        }
      })
      this.add2.controls.city.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.city.setValue(val)
        }
      })
      this.add2.controls.district.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.district.setValue(val)
        }
      })
      this.add2.controls.state.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.state.setValue(val)
        }
      })
      this.add2.controls.country.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.country.setValue(val)
        }
      })
      this.add2.controls.proofOfAddress.valueChanges.subscribe(val => {
        if (this.add4.controls.sameAddAs.value == 'Correspondence') {
          this.add4.controls.proofOfAddress.setValue(val)
        }
      })
      //
      this.form_contacts.controls.mobile.valueChanges.subscribe(val => {
        console.log("mobbb:",val);

        if (!this.fromReportPoolPage || this.applicationStatus == 'R') {
          if (val != null) {

            if (val.length == 10) {
              this.validateMobileorEmail(this.model.PanNo, val, 'M', this.branch, 'mob1')
            }
            else {
              console.log("validate set null");

              this.form_contacts.controls.existingPan.patchValue(null)
              this.form_contacts.controls.existingClient.patchValue(null)
              this.form_contacts.controls.relation.patchValue(null)
              this.form_contacts.controls.relation.setValidators(null)
              this.kycContMob1 = false
            }

          }
          else {
            this.kycContMob1 = false
            if (!this.isNRE && val && val.length == 10) {
              this.form.controls.isdCodeMobile.patchValue('091')
            }
          }


        }
      })
      this.form_contacts.controls.additionalMblNo.valueChanges.subscribe(val => {
        if (!this.fromReportPoolPage) {
          if (val != null) {
            if (val.length == 10) {
              this.validateMobileorEmail(this.model.PanNo, val, 'M', this.branch, 'Addmob1')
            }
            else {
              this.form_contacts.controls.existingPan1.patchValue(null)
              this.form_contacts.controls.existingClient1.patchValue(null)
              this.form_contacts.controls.relation1.patchValue(null)
              this.kycAddContMob1 = false
            }
          } else {
            this.kycAddContMob1 = false
          }
        }
      })

      this.form_contacts.controls.email.valueChanges.subscribe(val => {
        if (!this.fromReportPoolPage || this.applicationStatus == 'R') {
          setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.model.PanNo, val, 'E', this.branch, 'email1')
            } else {
              this.form_contacts.controls.existingPan2.patchValue(null)
              this.form_contacts.controls.existingClient2.patchValue(null)
              this.form_contacts.controls.relation2.patchValue(null)
              this.form_contacts.controls.relation2.setValidators(null)
              this.kycContEmail1 = false
            }
          }, 500);
        }
      })
      this.form_contacts.controls.addEmail.valueChanges.subscribe(val => {
        if (!this.fromReportPoolPage) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.model.PanNo, val, 'E', this.branch, 'addEmail1')
            } else {
              this.form_contacts.controls.existingPan3.patchValue(null)
              this.form_contacts.controls.existingClient3.patchValue(null)
              this.form_contacts.controls.relation3.patchValue(null)
              this.kycContAddEmail1 = false
            }
          }, 1000);
        }
      })
      // this.form_FiveValidation.controls.openpositionorunsettledchecked.valueChanges.subscribe(val =>{
      //   let bool = (val && this.form_FiveValidation.controls.debitbalanceintradecodechecked.value && this.form_FiveValidation.controls.mtfpositionnotintradecodechecked.value && this.form_FiveValidation.controls.pledgerequestnotintradecodechecked.value && this.form_FiveValidation.controls.activerunningsipnotintradecodechecked.value) ? true :false
      //   this.form_FiveValidation.patchValue({ ValidationNextButtonEnable : bool })
      // })
    })
  }
  ngOnDestroy(): void {
    this.clearcomponentvalues()
  }
  clearcomponentvalues() {
    console.log("cleared status conversion values ...");
    this.cscservice.closemodalview()
    // this.cscservice.unsubscribeModelView()
    // this.dataServ.fromreport = false
  }
  getPermissions() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "UserCode": this.currentUser.userCode,
          "ProjectID": this.wsServ.getProjectId(), //this.currentUser.defaultProjId,
          // "SpId":"700065"
        }],
      "requestId": "10",
      "outTblCount": "0",
      // "SpId":"700065"
      // "dbConn": 'db',
    }).then((response) => {

      var responseData = response.results[0]
      responseData.forEach(element => {
        if (element.ModuleID == 10169) {
          this.canAdd = element.AddRight ? element.AddRight : false
          this.canModify = element.ModifyRight ? element.ModifyRight : false
        }
      });
    });
  }
  fetchdataforConfirmation() {
    this.changeAccounts = [];
    this.isSpining = true;
    this.dataServ.getOrginalResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.serielno,
          EUser: this.currentUser.userCode,

        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        debugger
        this.isSpining = false
        this.tableCheckBox = true;
        this.pendingOrRejected = true
        this.clientArrayTemp = response.results[0];
        this.clientArray = response.results[0];
        this.testdata = response.results[2][0];
        this.status = this.testdata ? this.testdata["Status"] : this.status//17780 edited for bug fix
        this.cmServ.clientBasicData.next(this.testdata)
        this.changereq = response.results[2][0].EntryType;
        this.remaks = response.results[4]
        if (this.remaks && this.remaks.length > 0) {
          this.approvelRemarks = [];
          this.rejectionRemarks = [];
          this.remaks.forEach(data => {
            if (data.Type == 'A') {
              this.approvelRemarks.push({ 'Remarks': data.Remarks })
            }
            else {
              this.rejectionRemarks.push({ 'Remarks': data.Remarks })
            }
          })
        }

        this.clientBankAccounts = response.results[5];
        this.cmServ.clientBankAccouns.next(this.clientBankAccounts);

        if (response && response.results[6]) {
          this.HOModification = response.results[6][0].HTMLContent;
          this.cmServ.HOModification.next(this.HOModification);
        }

        if (response && response.results[7]) {
          this.notification.remove()
          this.notification.info(response.results[7][0].info, '', { nzDuration: 1000 })
        }



        if (this.changereq == 'NoEmailMobile') {
          setTimeout(() => {
            this.img.setproofs(this.changereq)
          }, 1000);
        }

        this.krakyc = response.results[2][0];
        this.model.PanNo = response.results[2][0].PanNumber// { "PAN": response.results[2][0].PanNumber }
        this.cscservice.fromreportcsc = true

        if (this.changereq == 'NoEmailMobile') {
          this.RegectionReason = response.results[2][0].UserRemarks;
        }
        var ChangeDetails: any = [];
        if (response.results[3]) {
          ChangeDetails.push(response.results[3][0]);
          ChangeDetails.push(response.results[1])
          this.cmServ.DataForAprooval.next(ChangeDetails);
          // if (value) {
          response.results[3][0]["RejectedReason"] = response.results[2][0].UserRemarks;
          response.results[3][0]["ApplicationReceived"] = false
          // }
          if (this.changereq == 'NoEmailMobile') {
            this.noemailFlag = response.results[3][0]["noemailFlag"];
            this.nomobileFlag = response.results[3][0]["nomobileFlag"];
          }
        }
        this.clientArrayTemp = response.results[0];
        this.IsForConfirmation = true;
        this.clientArray.forEach(data => {
          if (data.AccountFlag == true) {
            this.changeAccounts.push(data)
          }
        })
        if (this.status == 'T') {
          this.cmServ.saveButtonFlag.next(true)
          this.cmServ.approveOrRejectButtonFlag.next(false)
          this.cmServ.finalApproveOrRejectButtonFlag.next(false)
        }
        if (this.status == 'P') {
          setTimeout(() => {
            if (this.canModify && this.HO) {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(true)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
              this.cmServ.approvelRemarks.next(this.approvelRemarks)
              this.cmServ.rejectionRemarks.next(this.rejectionRemarks)
            }
            else {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
            }
          }, 300)
        }
        if (this.status == 'F') {
          setTimeout(() => {
            if (this.canModify && this.HO) {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(true)
              this.cmServ.approvelRemarks.next(this.approvelRemarks)
              this.cmServ.rejectionRemarks.next(this.rejectionRemarks)
            }
            else {
              this.cmServ.saveButtonFlag.next(false)
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
            }
          }, 300)
        }
        if (this.status == 'R') {
          if (this.canAdd) {
            this.cmServ.saveButtonFlag.next(true)
            this.cmServ.approveOrRejectButtonFlag.next(false)
            this.cmServ.finalApproveOrRejectButtonFlag.next(false)
          }
        }
        if (this.status == 'A') {
          this.cmServ.saveButtonFlag.next(false)
          this.cmServ.approveOrRejectButtonFlag.next(false)
          this.cmServ.finalApproveOrRejectButtonFlag.next(false)
        }
        this.cmServ.applicationStatus.next(this.status)
        if (this.changereq != 'NoEmailMobile') {
          this.cmServ.requestID.next(ChangeDetails[0]["Request_IDNO"])
        }
      }
      else {
        this.isSpining = false;
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
      }
    })
  }
  onClientSearch() {
    debugger

    if (!this.model.PanNo) {//&& !this.model.Cin && !this.model.uniqueCode) {
      this.notification.remove()
      this.notification.error('Please enter PAN ', '', { nzDuration: 1000 });
      return;
    }
    else {
      this.onSelectClient()
    }
  }
  onSelectClient() {
    return new Promise((resolve, reject) => {
    this.showMob = false;
    this.showEmail = false;
    // console.log(this.model.PanNo);
    if (this.model.PanNo == null && this.model.uniqueCode == '' && this.model.Cin == '') {
      this.clearResponseData()
      return
    }
    this.isSpining = true;
    // console.log(this.model.PanNo);

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "PanNo": this.model.PanNo ? this.model.PanNo : '',//.PAN : '',
          "CinNo": this.model.Cin ? this.model.Cin : '',
          "GeojitUniqueCode": this.model.uniqueCode ? this.model.uniqueCode : '',
          "EUser": this.currentUser.userCode,
          "ActionFlag": this.panValid ? 'N' : 'S',
        }],
      "requestId": "6005",//"6005",
    }).then((response) => {
      this.clearResponseData()
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          try {
            // console.log("responses := ", response);

            this.cmServ.requestID.next('')
            this.status = 'N'
            //this.isSpining = false;
            this.noDataflag = false;
            this.cscservice.fromreportcsc = false
            this.clientArray = response.results[0] //? response.results[0] : [];
            this.clientArrayTemp = response.results[0] //? response.results[0] : [];
            let dpdata = []
            dpdata = (this.clientArrayTemp.filter(element =>
              (element.AccountType == 'NSDL' || element.AccountType == 'CDS'|| element.AccountType == 'CDSL')))//this.clientArray[0].AccountSignature ? this.clientArray[0].AccountSignature : this.clientArray[1].AccountSignature ? this.clientArray[1].AccountSignature : null
            if(dpdata && dpdata.length>0){
              this.AccountSignature = dpdata[0].AccountSignature ? dpdata[0].AccountSignature : null
            }
            // this.clientArrayTemp.push(this.clientArrayTemp[0])
            // let sameaccounttypecount = 0
            this.afterpansearch = true
            this.sameaccounttype = (this.clientArrayTemp.filter(element => //If there is active multiple trading account
              element.AccountType === 'TRADING')).length > 1 ? true : false
            // this.sameaccounttype = sameaccounttypecount > 1 ? true :false

            // console.log(this.sameaccounttype);
            this.MultipleDPAvailable = (this.clientArrayTemp.filter(element => //If there is active multiple trading account
              (element.AccountType == 'NSDL' || element.AccountType == 'CDS'|| element.AccountType == 'CDSL') )).length > 1 ? true : false
              this.multipleDPCount = (this.clientArrayTemp.filter(element => //If there is active multiple trading account
              (element.AccountType == 'NSDL' || element.AccountType == 'CDS'|| element.AccountType == 'CDSL') )).length
              // console.log("this.multipleDPCount1",this.multipleDPCount);

            // this.clientArrayTemp.array.forEach(element => {
            //   if((element.AccountType == 'NSDL' || element.AccountType == 'CDS') && element.AccountStatus === "ACTIVE")
            //   {

            //   }
            //   else if (element.AccountType === 'TRADING' && element.AccountStatus === "ACTIVE")
            //   {

            //   }
            // })
            // this.MultipleDPAvailable = MultipleDPAvailablecount > 1 ? true :false

            // console.log(this.MultipleDPAvailable);
            if (this.clientArray[0].PANNo != "") {
              this.model.PanNo = this.clientArray[0].PANNo //{ PAN: this.clientArray[0].PANNo }
              this.form.get('PAN').patchValue(this.model.PanNo)
            }
            if (this.panValid) {
              this.panCheck()
            }
            if (this.clientArray[0].AccountType == 'TRADING') {

              // this.form_type_selection.value.Type1.DAoldtype.setValue(this.clientArray[0].AccountClientType)
              // this.form_type_selection.value.type1.DAoldsubtype.setValue(this.clientArray[0].AccountClientSubType)
              // this.form_type_selection.value.Type2.DAoldtype.setValue(this.clientArray[0].AccountClientType)
              // this.form_type_selection.value.type2.DAoldsubtype.setValue(this.clientArray[0].AccountClientSubType)
              // this.form_type_selection.value.Type3.DAoldtype.setValue(this.clientArray[0].AccountClientType)
              // this.form_type_selection.value.type3.DAoldsubtype.setValue(this.clientArray[0].AccountClientSubType)

              // DAoldtype
              // DAnewtype
              // DAoldsubtype
              // DAnewsubtype
              // TAoldtype
              // TAnewtype
              this.showSendLink = true;

              debugger
              if (this.clientArray[0].Mobileno != "") {
                this.Mobile = this.clientArray[0].Mobileno
              }
              if (this.clientArray[0].Email != "") {
                this.Email = this.clientArray[0].Email
              }
              if (this.clientArray[0].Mobileno == "" && this.clientArray[0].Email != "") {
                this.showMob = true
                this.noLink = false
              }
              else {
                this.showMob = false;
              }
              if (this.clientArray[0].Mobileno != "" && this.clientArray[0].Email == "") {
                this.showEmail = true
                this.noLink = false
              }
              else {
                this.showEmail = false;
              }

              if (this.clientArray[0].Mobileno == "" && this.clientArray[0].Email == "") {
                this.Link = false
              }
              else {
                this.Link = true;
              }
              if (this.clientArray[0].Mobileno != "" && this.clientArray[0].Email != "") {
                this.noLink = true
              }
              else {
                this.noLink = false;
              }
            }
            try {
              // console.log("form_type_selection   :  ", this.form_type_selection);
              this.krakyc = response.results[1] ? response.results[1][0] : [];
              if(response.results[0]){
                this.testdata =  response.results[0][0]
                if(this.testdata['AccountName'].includes('No data found against PAN'))
                {
                  this.testdata =[]
                  this.DisableNextButton=true
                }
              }
              else{
                this.testdata =[]
              }
              // this.cmServ.derivativeStatus.next(response.results[1][0].DerivativeStatus)
              // this.IndivitualClient = response.results[1][0].IndivitualClient
              this.krakycCheck = this.krakyc.Processed_Without_KYC_or_CKYC_Flag;
              this.ckycCheck = this.krakyc.CKYC_Flag ? false : true;
              this.rejectedRequests = response.results[3];
              this.pendingRequests = 0//! response.results[2];
              this.pendingcount = 0//! this.krakyc.NoOfPendingRequests;
              this.rejectionCount = 0//! this.krakyc.NoOfRejectionRequests;
              this.approvedCount = 0//! this.krakyc.NoOfApprovedRequests;
              this.approvedRequest = response.results[4] ? response.results[4] : [];
              this.cmServ.saveButtonFlag.next(true);
              this.cmServ.approveOrRejectButtonFlag.next(false)
              this.cmServ.finalApproveOrRejectButtonFlag.next(false)
              this.clientBankAccounts = response.results[6];
              // this.ChangeFlag =  response.results[7]
              this.cmServ.clientBankAccouns.next(this.clientBankAccounts);
              this.cmServ.applicationStatus.next('')
              this.cmServ.pepStatus.next(this.clientArray[0].PEPStatus)
              this.PEP = Number(this.clientArray[0].PEPStatus)
              this.FirstlevelApprove = response.results[8] ? response.results[8] : '';
              this.frstLvlApprovalCount = response.results[8] ? response.results[8][0].Counts : '0';
            }
            catch (err) {
              console.log(err);

            }
            if (!this.fromReportPoolPage || this.rejectEditeEnable) {
              this.SetConversionType()
              // if(!this.Type3disable)
              // {
              // //    Type2: {
              // //   DAoldtype: item.AccountClientType,
              // //   DAoldsubtype: item.AccountClientSubType,
              // //   DAnewtype: this.type2DAnewtypelist[0],
              // //   DAnewsubtype: this.type2DAnewsubtypelist[0]
              // // }
              //   let type3 =this.form_type_selection.controls.Type3

              // }
              // this.GetSpForFiveValidation()
              this.GentBoxNumber()
            }
            else {
              this.setkycinitialize()


            }
            // console.log("AccountClientTypeValidate , ",this.AccountClientTypeValidate);
            // console.log("sameaccounttype , ",this.sameaccounttype);
            // console.log(this.testdata['AccountName']);

            if (this.testdata['AccountName']) {
              this.AccountName = this.testdata['AccountName']
            }
            if (this.FirstlevelApprove != '') {
              this.FirstlevelApprove = this.FirstlevelApprove.map(({ Counts, ...rest }) => ({ ...rest }));
            }
            if (this.FirstlevelApprove.length > 0)
            this.FirstlevelApprove.splice(0, 1);
            // if(this.ChangeFlag){
            //  this.flagReset();
            //   this.ChangeFlag.forEach(items => {
            //     if (items.Type == 'Address' && items.Flag == true ) {
            //       this.addressFlag = true;
            //     }
            //     else if (items.Type == 'Email' && items.Flag == true ) {
            //       this.emailFlag = true;
            //     }
            //     else if (items.Type == 'Mobile' && items.Flag == true ) {
            //       this.mobileFlag = true;
            //     }
            //     else if (items.Type == 'Telephone' && items.Flag == true ) {
            //       this.telephoneFlag = true;
            //     }
            //     else if (items.Type == 'Bank' && items.Flag == true ) {
            //       this.bankFlag = true;
            //     }
            //     else if (items.Type == 'Nominee' && items.Flag == true ) {
              //       this.nomineeFlag = true;
              //     }
              //     else if (items.Type == 'Financials' && items.Flag == true ) {
                //       this.financialFlag = true;
                //     }
            //     else if (items.Type == 'CKYC' && items.Flag == true ) {
            //       this.ckycFlag = true;
            //     }
            //   });
            // }
            ////////////////////////////////////////////////

            // this.disablenominee =false
            // if (this.canAdd) {
            //   this.cmServ.saveButtonFlag.next(true)
            // }
            // else {
            //   this.cmServ.saveButtonFlag.next(false)
            //   this.cmServ.approveOrRejectButtonFlag.next(false)
            //   this.cmServ.finalApproveOrRejectButtonFlag.next(false)
            // }
            this.accountCountArray = response.results[5]?(response.results[5][0] ? response.results[5][0] : {}):{};
            if (this.krakyc.AccountName) {
              this.notification.remove()
              this.notification.success(this.krakyc.AccountName, '', { nzDuration: 1000 });
            }
            this.panValid = true
            this.isSpining = false;
            resolve(true)
          }
          catch (err) {
            console.log(err);
            this.notification.remove()
            this.notification.error('Some Error is there', '', { nzDuration: 1000 })
            this.isSpining = false;
            resolve(true)
          }
        }
        else {
          this.isSpining = false;
          this.noDataflag = true
          this.notification.remove()
          this.notification.error('Client not found', '', { nzDuration: 1000 })
        }

      }
      else {
        this.isSpining = false;
        // this.noDataflag = true
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
      }
    }, err => {
      console.log(err);
      this.notification.remove()
      this.notification.error('Connection error', '', { nzDuration: 1000 })
      this.isSpining = false;
    });
    this.IsForConfirmation = false;
    // this.cmServ.forApproval.next(this.IsForConfirmation);
    this.IsRejectedRequest = false;
    // this.cmServ.isRejected.next(this.IsRejectedRequest);
    // this.cmServ.viewOnly.next(false);

  })
  }
  clearResponseData() {
    this.pendingcount = '';
    this.rejectionCount = '';
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.clientArray = [];
    this.krakyc = [];
    this.clientArrayTemp = [];
    this.noDataflag = true;
    // this.changereq = null;
    this.cmServ.requestID.next('')
    this.FirstlevelApprove = [];
    this.frstLvlApprovalCount = ''
  }
  // flagReset(){
  //   this.addressFlag = false;
  //   this.emailFlag = false;
  //   this.mobileFlag = false;
  //   this.telephoneFlag = false;
  //   this.bankFlag = false;
  //   this.nomineeFlag = false;
  //   this.financialFlag = false;
  //   this.ckycFlag = false;
  // }
  panCheck() {
    this.clientArray.forEach(item => {
      if (item.AccountFlag == 'V') {
        this.validatePan(item.PANNo)
      }
    })
  }
  validatePan(pan) {
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.PanDetails.length > 0) {
            this.notification.remove()
            this.notification.success("Valid Pan", '', { nzDuration: 1000 })
            this.panValid = true;
            return
          }
          else {
            this.panValid = false;
            this.modalService.confirm({
              nzTitle: '<i>Confirmation</i>',
              nzContent: this.clientArray[0].AccountName,
              nzOnOk: () => {
                this.onSelectClient();
              }
            });
            return
          }
        })
    }
  }
  setExistingNomineeDetailsInForm(data) {
    // console.log(data);

    this.form_nominee.patchValue({
      // nomineeEqualShareForNominess:,
      // tradeNominee:,
      firstNomineeDetails: {

        nomineeTitle: data.FirstNomineeNamePrefix,
        nomineeFirstName: data.MFNomineeName,//
        nomineeMiddleName: data.FirstNomineeMiddleName,
        nomineeLastName: data.FirstNomineeLastName,
        //! nomineeResidualshares: data.[null],
        nomineeRelationshipwithapplicant: data.MFNomineeRelShip,//
        nomineeHouseName: data.MFNomineeAdd1,
        nomineeHouseNumber: data.MFNomineeAdd2,//
        nomineeStreet: data.MFNomineeAdd3, //
        nomineePin: data.MFNomineePIN,//
        nomineeCity: data.FirstNomineeCity,
        nomineeState: data.FirstNomineeState,
        //! BOCategory: data.[null],
        nomineeCountry: data.FirstNomineeCountry,
        isdCodeMobile: data.FirstNomineeMobISDCode,
        nomineeMobile: data.FirstNomineeMob,
        isdCodeTelephone: data.FirstNomineeISDCode,
        stdCodetelephone: data.FirstNomineeSTDCode,
        nomineeTelephoneNumber: data.FirstNomineeTelePhone,
        nomineeEmailID: data.FirstNomineeEmailID,
        sharePercentage: data.FirstNomineePercentOfShare,
        nomineeNomineeIdentificaitonDetails: data.FirstNomineeIdentificationDetails,
        nomineeDOB: data.MFNomineeDOB,//
        guardianTitle: data.FirstNomineeGuardianPrefix,
        guardianFirstName: data.MFGuardian,//
        guardianMiddleName: data.FirstNomineeGuardianMiddleName,
        guardianLastName: data.FirstNomineeGuardianLastName,
        guardianRelationshipofGuardian: data.MFminorNomineeRelat,//
        guardianHouseName: data.MFGuardianAdd1,
        guardianHouseNumber: data.MFGuardianAdd2,
        guardianStreet: data.MFGuardianAdd3,
        guardianPin: data.MFGuardianPIN,
        guardianCity: data.FirstNomineeGuardianCity,
        guardianState: data.FirstNomineeGuardianState,
        guardianCountry: data.FirstNomineeGuardianCountry,
        guardianTelephoneNumber: data.FirstNomineeGuardianTelephoneNo,
        guardianMobile: data.FirstNomineeGuardianMobile,
        guardianEmailID: data.FirstNomineeGuardianEmail,
        guardianIdentificaitonDetails: data.FirstNomineeGuardianidentificationDetails
      },
      SecondNomineeDetails: {
        nomineeTitle: data.SecondNomineeNamePrefix,
        nomineeFirstName: data.MFNomineeNamee,//
        nomineeMiddleName: data.SecondNomineeMiddleName,
        nomineeLastName: data.SecondNomineeLastName,
        //!nomineeResidualshares: data.[null],
        nomineeRelationshipwithapplicant: data.MFNomineeRelShip,//
        nomineeHouseName: data.MFNomineeAdd11,
        nomineeHouseNumber: data.MFNomineeAdd2,//
        nomineeStreet: data.MFNomineeAdd3, //
        nomineePin: data.MFNomineePIN,//
        nomineeCity: data.SecondNomineeCity,
        nomineeState: data.SecondNomineeState,
        //! BOCategory: data.[null],
        nomineeCountry: data.SecondNomineeCountry,
        isdCodeMobile: data.SecondNomineeMobISDCode,
        nomineeMobile: data.SecondNomineeMob,
        isdCodeTelephone: data.SecondNomineeISDCode,
        stdCodetelephone: data.SecondNomineeSTDCode,
        nomineeTelephoneNumber: data.SecondNomineeTelePhone,
        nomineeEmailID: data.SecondNomineeEmailID,
        sharePercentage: data.SecondNomineePercentOfShare,
        nomineeNomineeIdentificaitonDetails: data.SecondNomineeIdentificationDetails,
        nomineeDOB: data.MFNomineeDOB,//
        guardianTitle: data.SecondNomineeGuardianPrefix,
        guardianFirstName: data.MFGuardian,//
        guardianMiddleName: data.SecondNomineeGuardianMiddleName,
        guardianLastName: data.SecondNomineeGuardianLastName,
        guardianRelationshipofGuardian: data.MFminorNomineeRelat,//
        guardianHouseName: data.MFGuardianAdd1,//
        guardianHouseNumber: data.MFGuardianAdd2,//
        guardianStreet: data.MFGuardianAdd3,//
        guardianPin: data.MFGuardianPIN,//
        guardianCity: data.SecondNomineeGuardianCity,
        guardianState: data.SecondNomineeGuardianState,
        guardianCountry: data.SecondNomineeGuardianCountry,
        guardianTelephoneNumber: data.SecondNomineeGuardianTelephoneNo,
        guardianMobile: data.SecondNomineeGuardianMobile,
        guardianEmailID: data.SecondNomineeGuardianEmail,
        guardianIdentificaitonDetails: data.SecondNomineeGuardianidentificationDetails
      },
      ThirdNomineeDetails: {
        nomineeTitle: data.ThirdNomineeNamePrefix,
        nomineeFirstName: data.MFNomineeName,//
        nomineeMiddleName: data.ThirdNomineeMiddleName,
        nomineeLastName: data.ThirdNomineeLastName,
        //!nomineeResidualshares: data.[null],
        nomineeRelationshipwithapplicant: data.MFNomineeRelShip,//
        nomineeHouseName: data.MFNomineeAdd1,
        nomineeHouseNumber: data.MFNomineeAdd2,//
        nomineeStreet: data.MFNomineeAdd3, //
        nomineePin: data.MFNomineePIN,//
        nomineeCity: data.ThirdNomineeCity,
        nomineeState: data.ThirdNomineeState,
        //! BOCategory: data.[null],
        nomineeCountry: data.ThirdNomineeCountry,
        isdCodeMobile: data.ThirdNomineeMobISDCode,
        nomineeMobile: data.ThirdNomineeMob,
        isdCodeTelephone: data.ThirdNomineeISDCode,
        stdCodetelephone: data.ThirdNomineeSTDCode,
        nomineeTelephoneNumber: data.ThirdNomineeTelePhone,
        nomineeEmailID: data.ThirdNomineeEmailID,
        sharePercentage: data.ThirdNomineePercentOfShare,
        nomineeNomineeIdentificaitonDetails: data.ThirdNomineeIdentificationDetails,
        nomineeDOB: data.MFNomineeDOB,//
        guardianTitle: data.ThirdNomineeGuardianPrefix,
        guardianFirstName: data.MFGuardian,//
        guardianMiddleName: data.ThirdNomineeGuardianMiddleName,
        guardianLastName: data.ThirdNomineeGuardianLastName,
        guardianRelationshipofGuardian: data.MFminorNomineeRelat,//
        guardianHouseName: data.MFGuardianAdd1,//
        guardianHouseNumber: data.MFGuardianAdd2,//
        guardianStreet: data.MFGuardianAdd2,//
        guardianPin: data.MFGuardianPIN,//
        guardianCity: data.ThirdNomineeGuardianCity,
        guardianState: data.ThirdNomineeGuardianState,
        guardianCountry: data.ThirdNomineeGuardianCountry,
        guardianTelephoneNumber: data.ThirdNomineeGuardianTelephoneNo,
        guardianMobile: data.ThirdNomineeGuardianMobile,
        guardianEmailID: data.ThirdNomineeGuardianEmail,
        guardianIdentificaitonDetails: data.ThirdNomineeGuardianidentificationDetails
      }
    })
  }
  GetNomineeDetailsforkyc() {
    debugger
    // console.log("cln   : ", this.testdata['AccountId']);
    // window.scrollTo(0, document.body.scrollHeight);
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Cln": this.ClientId//this.testdata['AccountId']
        }],
      "requestId": "700130"//"700087",//"6005",
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          try {
            // console.log("GetNomineeDetailsforkyc response :", response);
            this.Nomineecardshow = this.NomineeDetails.length > 0 ? true : false
            this.nomineehidden = response.results[0][0].NomineeExists
            // console.log(response.results[0][0].NomineeExists);


            this.numOfNominees = this.nomineehidden?'NoNominee':'One'
            // this.nomineehidden = true
            // if(this.nomineehidden)
            // this.setExistingNomineeDetailsInForm(response.results[1][0])
            this.NomineeDetails = response.results[0][1]
            this.isSpining = false;
          }
          catch (err) {
            console.log(err);

          }
        }
        else {
          // console.log("result length !== 0 or undefined");
          this.isSpining = false;
          this.noDataflag = true
          this.notification.remove()
          this.notification.error('NomineeDetails for kyc not found', '', { nzDuration: 1000 })
        }
      }
      else {
        // console.log("error code !==0 ");
        this.isSpining = false;
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
      }
    })
  }
  onnextinfirsttab() {//trigger when next click of first tab
    // this.changereq = "CKYC"//"Nominee"
    // this.edittabtitle = this.changereq;
    // window.scroll(0,0);
    if (!this.fromReportPoolPage) {
      this.ValidateFormEnable = false
      this.AllFormEnable = true
      // this.fisttabcompleted = true
      this.personalformenable = true
      this.applicationStatus = 'I'
      this.isSpining = true
      // this.getfinancial()
      this.setkycinitialize()
      this.getidentifyprooforaddressproofdetails()
      this.contactssetvalidation()
      this.getbankdropdown()
      this.nomineeinitialize()
      this.getnomineerelationshipdropdown()
      this.GetNomineeDetailsforkyc()
      setTimeout(() => {
        this.prefillBranchData()
      }, 100);

    }
    else {
      this.setdisableflags()
      this.tempoperations()
      // this.applicationStatus ='P'
    }
    // this.edittabtitle = 'Status Conversion Form'
    // this.activeTabIndex = 1
    // this.TypeTabIndex = 0

    this.saveButtonFlag = true
    //! this.commonscroll('targetRed')
    // this.printButtonFlag = true
    // this.applicationStatus = 'P'
    // window.scrollTo(0, 380);
    // this.myScrollVariable =200
    // this.el.nativeElement.scrollIntoView();
    // setTimeout(() => {
    // }, 2);





    //////////////////
    // this.mobileemailchecked =  String(this.Mobile).match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && this.validateEmail(this.Email) ? true : false
    // this.krastatusandckycnumberchecked =  this.krakycCheck
    //////////////////

  }
  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  Validation() {
    if (!this.panValid) {
      this.notification.remove()
      this.notification.error('Pan not verified', '', { nzDuration: 1000 })
      return false
    }
    if (!this.clientArray.length) {
      this.notification.remove()
      this.notification.error('Please select a client to update', '', { nzDuration: 1000 });
      return false;
    }
    if (!this.changeAccounts.length) {
      this.notification.remove()
      this.notification.error('Atleast one account should be selected ', '', { nzDuration: 1000 })
      return false;
    }
    return true;
  }
  setselectedaccounts() {
    this.changeAccounts = [];
    this.temparray = [];
    this.clientArrayTemp.forEach(data => {
      if (data.AccountFlag == true || data.AccountFlag == "true") {
        this.changeAccounts.push(data)
      }
    })
    this.cmServ.changeAccounts.next(this.changeAccounts)
    this.changeAccounts.forEach((item, index) => {
      var obj = {};;
      var name = '';
      name = "Account";
      obj[name] = item;
      this.temparray.push(obj);
    })
    var changeaccountXML = '';
    changeaccountXML = jsonxml(this.temparray);
    this.cmServ.changeAccountsXML.next(changeaccountXML);
  }
  onviewClick(data) {
    // console.log(data);
    // this.ToLocationField = data? data.AccountLocation:'';
    // console.log(this.model.ToLocationField.AccountLocation);

    this.ToLocationField = this.model.ToLocationField.AccountLocation ?this.model.ToLocationField.AccountLocation :''
    // console.log(typeof this.ToLocationField);
    // console.log(this.ToLocationField);

    // this.model.Cin = data ? data.CINNo : '';
    // this.model.uniqueCode = data ? data.AccountCode : '';
    // this.Changereqdisable = true;
    // this.clientStatus = data ? data.AccountStatus_3 : '';
  }
  ShowSignature(data) {

    if (data.AccountSignature == null) {
      return
    }
    else {

      this.filePreiewContent = {};
      this.filePreiewVisible = true;
      this.fileSourceName = 'Signature'
      this.filePreiewContent["Docdoc"] = data.AccountSignature
      this.acc = data.AccountCode
    }
  }
  // ShowSignature() {
  //   console.log(this.AccountSignature);

  //   if (this.AccountSignature == null) {
  //     return
  //   }
  //   else {
  //     this.Signatureimagepreview = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.AccountSignature);
  //     this.signaturefilePreiewVisible = true;
  //     // this.filePreiewContent = {};
  //     // this.fileSourceName = 'Signature'
  //     // this.filePreiewContent["Docdoc"] = this.AccountSignature
  //     // this.filePreiewContent['DocnameText'] = 'signature'
  //     // this.filePreiewContent["Docfile"] = "signature.jpg"
  //     // this.filePreiewContent['Doctype'] = 'image/jpeg';
  //     // this.acc = 'Signature'
  //   }
  // }
  imageclose() {
    this.signaturefilePreiewVisible = false;
  }
  private createAddressGroup() {
    return this.fb.group({
      houseName: [null, [Validators.required]],
      // houseNumber: [null],
      street: [null],
      pinCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      // addressType:[null,[Validators.required]],
      proofOfAddress: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      landmark: [null],
    });
  }
  private createAddressGroup1() {
    return this.fb.group({
      sameAsPermant: [false],
      houseName: [null, [Validators.required]],
      // houseNumber: [null, [Validators.required]],
      street: [null],
      pinCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      proofOfAddress: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      landmark: [null],
    });
  }

  private createAddressGroup4() {
    return this.fb.group({
      sameAddAs: [null],
      taxCountry: [null, [Validators.required]],
      taxIdentification: [null, [Validators.required]],
      placeOfBirth: [null, [Validators.required]],
      countryOfBirth: [null, [Validators.required]],
      fatca: ['NA', [Validators.required]],
      // document:[''],
      houseName: [null, [Validators.required]],
      // houseNumber: [null, [Validators.required]],
      street: [null],
      pinCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      proofOfAddress: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      landmark: [null],
    });
  }
  private createtypeform() {
    return this.fb.group({
      DAoldtype: [null, [Validators.required]],
      DAnewtype: [null, [Validators.required]],
      DAoldsubtype: [null, [Validators.required]],
      DAnewsubtype: [null, [Validators.required]],
      TAoldtype: [null, [Validators.required]],
      TAnewtype: [null, [Validators.required]],
    })
  }
  // kyc
  setkycinitialize() {
    //! this.verificationStstus = item;
    // this.form.controls.ckyc.patchValue(this.krakyc.CKYC_No)
    if (this.krakyc.NROClnt != 0)
      this.isNRE = true
    else
      this.isNRE = false

    this.form_contacts.controls.isdCodeMobile.patchValue('091')
    // if(!smsFacility)
    if (!this.isNRE) {
    }


  }
  //5 validation
  OpenValidationForm() {

    // this.TypeTabIndex = 0
    // this.isSpining =true
    this.saveButtonFlag = this.CurrentStatus ==='R'?false :true//true//(this.CurrentStatus ==='P'||this.CurrentStatus ==='R')?false :true
    if (!this.fromReportPoolPage) {
      this.isSpining = true
      this.getfinancial()
      this.GetSpForFiveValidation().then(res=>{
        if(res){
          this.activeTabIndex = 1
        this.edittabtitle = 'Status Conversion Form'
          this.fisttabcompleted = true
          this.ValidateFormEnable = true
          this.isSpining = false
        }
        else{
          this.notification.remove()
          this.notification.error('Some Error found ','', { nzDuration: 1000 });
          // this.isSpining = false
        }
      })

      // this.form_FiveValidation.patchValue({
      // openpositionorunsettledchecked : true,
      // debitbalanceintradecodechecked : true,
      // mtfpositionnotintradecodechecked : true,
      // pledgerequestnotintradecodechecked : true,
      // activeSIPnotintradecodechecked : true
      // })
      // this.openpositionorunsettledchecked = true,
      // this.debitbalanceintradecodechecked = true,
      // this.mtfpositionnotintradecodechecked = true,
      // this.pledgerequestnotintradecodechecked = true,
      // this.activeSIPnotintradecodechecked = true
      // this.ValidationNextButtonEnable = true

    }
    else {
      // this.onnextinfirsttab()
      this.activeTabIndex = 1
    this.edittabtitle = 'Status Conversion Form'
      this.ValidateFormEnable = true
      this.AllFormEnable = true
      this.ValidationNextButtonEnable = false
      this.setdisableflags()
      this.tempoperations()
    }
  }
  SetOnOfFiveValidation(type, status?) {
    // alert("kerri")
    if (type == 'branch')
    {
      this.ValidationNextButtonEnable = this.mtfpositionnotintradecodeenable ? (this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked) : (this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
    }
      // this.ValidationNextButtonEnable = (this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
    else if (type == 'ho') {
      // console.log('ho');
      this.HOValidationNextButtonEnable = this.HOpoolpendingchecked && this.HOmarginchecked && this.HOLedgerchecked
    }
    else if (type == 'ho2') {

      this.HOCurrentStatus = status

    }
    // alert(this.ValidationNextButtonEnable)
  }
  // conversion type functions start
  SetConversionType() {
    if(this.clientArray && this.clientArray.length>0)
    {
      let multipleDPCount =0
    this.clientArray.forEach(item => {
      if(item.AccountClientType)
      {
      if (!(item.AccountClientType.includes('NRO') ||item.AccountClientType.includes('ORDINARY') || item.AccountClientType.includes('RESIDENT') || item.AccountClientType.includes('NRE') || item.AccountClientType.includes('NRI') || item.AccountClientType.includes('CL') || item.AccountClientType.includes('INDIVIDUAL'))) {
        this.AccountClientTypeValidate = true
      }
    }
      // console.log(this.AccountClientTypeValidate);

      if (item.AccountType == 'NSDL' || item.AccountType == 'CDS' || item.AccountType == 'CDSL') {
        // this.multipleDPCount++
        multipleDPCount+=1
        // this.MultipleDPAvailable =multipleDPCount>1?true :false
        // if(multipleDPCount==1)
        // {
          if(item.AccountCode.includes("_"))
          {
          this.DPId = item.AccountCode.split('_')[0]
          this.DPAccountNumber = item.AccountCode.split('_')[1]
          }
          else{
          this.DPId = item.AccountCode.substring(0, 7)
          this.DPAccountNumber = item.AccountCode.substring(8, 15)
          }
        // }
        // else if(multipleDPCount ==2){
        //   this.DPId2 = item.AccountCode.split('_')[0]
        //   this.DPAccountNumber2 = item.AccountCode.split('_')[1]
        // }

        this.NSDLAccountType = item.AccountType == 'NSDL' ? 'NSDL' : ''
        this.CDSLAccountType = item.AccountType == 'CDS' ? 'CDS' : 'CDSL' ? 'CDSL' : ''
        // console.log(" DEMAT ", item);

        if (this.type1DAoldtypelist.includes(item.AccountClientType) && this.type1DAoldsubtypelist.includes(item.AccountClientSubType)) {
          // console.log("includes 1 DEMAT ");
          this.form_type_selection.patchValue({
            Type1: {
              DAoldtype: item.AccountClientType,
              DAoldsubtype: item.AccountClientSubType,
              DAnewtype: this.type1DAnewtypelist[0],
              DAnewsubtype: this.type1DAnewsubtypelist[0]
            }
          })
          this.Type1disable = false
          this.TypeTabIndex = 0
        }
        else {
          this.Type1disable = true
        }
        if (this.type2DAoldtypelist.includes(item.AccountClientType) && this.type2DAoldsubtypelist.includes(item.AccountClientSubType)) {
          // console.log("includes 2 DEMAT ");
          this.form_type_selection.patchValue({
            Type2: {
              DAoldtype: item.AccountClientType,
              DAoldsubtype: item.AccountClientSubType,
              DAnewtype: this.type2DAnewtypelist[0],
              DAnewsubtype: this.type2DAnewsubtypelist[0]
            }
          })
          this.Type2disable = false
          this.TypeTabIndex = 1
        }
        else {
          this.Type2disable = true
        }
        if (this.type3DAoldtypelist.includes(item.AccountClientType) && this.type3DAoldsubtypelist.includes(item.AccountClientSubType)) {
          // console.log("includes 3 DEMAT ");
          // console.log(item);
          this.form_type_selection.patchValue({
            Type3: {
              DAoldtype: item.AccountClientType,
              DAoldsubtype: item.AccountClientSubType,
              DAnewtype: this.type3DAnewtypelist[0],
              DAnewsubtype: this.type3DAnewsubtypelist[0]
            }
          })
          this.Type3disable = false
          this.TypeTabIndex = 2
        }
        else {
          this.Type3disable = true
        }



        // this.form_type_selection.patchValue({
        //   Type1: {
        //     DAoldtype: item.AccountClientType,
        //     DAoldsubtype: item.AccountClientSubType
        //   },
        //   Type2: {
        //     DAoldtype: item.AccountClientType,
        //     DAoldsubtype: item.AccountClientSubType
        //   },
        //   Type3: {
        //     DAoldtype: item.AccountClientType,
        //     DAoldsubtype: item.AccountClientSubType
        //   }
        // })
      }
      else if (item.AccountType == 'TRADING') {
        this.TradeCode = item.AccountCode
        this.ClientId = item.AccountId
        this.TradingAccountType = 'TRADING'
        // console.log(" TRADING ", item);
        if (this.type1TAoldtypelist.includes(item.AccountClientType)) {
          // console.log("includes");

          this.form_type_selection.patchValue({
            Type1: {
              TAoldtype: item.AccountClientType,
              TAnewtype: this.type1TAnewtypelist[0]
            }
          })
          this.Type1disable = false
          this.TypeTabIndex = 0
        }
        else {
          this.Type1disable = true
        }
        if (this.type2TAoldtypelist.includes(item.AccountClientType)) {
          // console.log("includes2");
          this.form_type_selection.patchValue({
            Type2: {
              TAoldtype: item.AccountClientType,
              TAnewtype: this.type2TAnewtypelist[0]
            }
          })
          this.Type2disable = false
          this.TypeTabIndex = 1
        }
        else {
          this.Type2disable = true

        }
        if (this.type3TAoldtypelist.includes(item.AccountClientType)) {
          // console.log("includes3");
          // console.log(item.AccountClientType);

          this.form_type_selection.patchValue({
            Type3: {
              TAoldtype: item.AccountClientType,
              TAnewtype: this.type3TAnewtypelist[0]
            }
          })
          this.Type3disable = false
          this.TypeTabIndex = 2
        }
        else {
          this.Type3disable = true
          // this.TypeTabIndex = 0
        }
        // this.form_type_selection.patchValue({
        //   Type1: {
        //     TAoldtype: item.AccountClientType
        //   },
        //   Type2: {
        //     TAoldtype: item.AccountClientType
        //   },
        //   Type3: {
        //     TAoldtype: item.AccountClientType
        //   }
        // })
      }
    })
  }
  }
  // conversion type functions end
  // personal details functions start
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

  loadPanDetails() {//verify KRA
    // this.form.controls.dob.patchValue('1992-12-12')

    if (this.entryAccess == false && this.isServiceBlocked) {
      return
    }
    this.isServiceCallsAllow = true;
    this.isLoadingPanDetails = true;
    let pan = this.form.value.PAN
    let dt = this.form.value.dob
    if (dt == null) {
      this.notification.remove()
      this.notification.error("Date of Birth required", '', { nzDuration: 1000 })
      this.isLoadingPanDetails = false;
      return
    }
    // console.log("pan : ", pan);

    // this.isKRAVerified=false;
    this.dataServ.checkKRA(pan).then(res => {
      try {
        let error = res.length > 0 ? res['Error'] : []
        if (error[0].ErrorCode == 0) {
          let response1 = res['Response']
          // console.log(response1)
          if (response1[0].Status == "Submitted" || response1[0].Status == "KRA Verified") {
            this.Agency = response1[0].Agency
            this.form.controls.ProceedType.patchValue('KRA')
            //  this.form.value.isKRAVerified=true
            // this.cmServ.getKRAdetails().then(res=>{
            //   let error=res['Error']
            //   if(error[0].ErrorCode==0){

            //   }
            //   else
            //     this.notif.error(error[0].ErrorMessage,'')
            // })
          }
          else {
            this.form.controls.changeKRA.patchValue('YES')
          }
          this.isLoadingPanDetails = false;
        }
        else {
          this.form.controls.changeKRA.patchValue('YES')
          this.isLoadingPanDetails = false;
          this.notification.remove()
          this.notification.error(error[0].ErrorMessage, '', { nzDuration: 1000 })
        }
      }
      catch (err) {
        console.log(err);

      }
    })
  }
  charrestrict(val) {
    var key = val.key
    var pattern = /[a-zA-Z\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }
  tempfillvalues(type) {
    let pan = "AJPPJ7996L"
    let temp = 'testfill'
    let mr = "Mr"
    let mrs = "Mrs"
    let gender = 'M'
    let shortnumber = 23
    let longnumber = "1234567890"
    let y = "YES"
    let n = "NO"
    let national = 'INDIA'
    let martialstatus = 'S'
    let residentailstatus = 'Person Of Indian Origin'//'NRI'
    let pincode = "671123"
    let district = "KASARAGOD"
    let state = "KERALA"
    let city = "KASARAGOD"
    let email = "azaruddinam250@gmail.com"
    let relation = "self"
    let date = "2022-08-11 10:40:25"
    let index = 1
    let data = {
      "PAN": this.model.PanNo,
      "AppNamePrefix": mr,
      "FirstName": temp,
      "MiddleName": temp,
      "LastName": temp,
      "MaidenNamePrefix": mr,
      "MaidenFirstName": temp,
      "MaidenMiddleName": temp,
      "MaidenLastName": temp,
      "FatherSpouseIndicator": 'F',
      "FatherSpousePrefix": mr,
      "FatherSpouseFirstName": temp,
      "FatherSpouseMiddleName": temp,
      "FatherSpouseLastName": temp,
      "MotherNamePrefix": mrs,
      "MotherFirstName": temp,
      "MotherMiddleName": temp,
      "MotherLastName": temp,
      "Gender": gender,
      "Age": shortnumber,
      "Minor": n,
      "MaritalStatus": martialstatus,
      "Nationality": national,
      "ResidentialStatus": residentailstatus,
      "CIN": temp,

      "PermanentAddressProof": temp,
      PermanentAddressLine1: temp,
      PermanentAddressLine2: temp,
      PermanentAddressLine3: temp,
      PermanentAddressPINCode: pincode,
      PermanentAddressCity: city,
      PermanentAddressDistrict: district,
      PermanentAddressState: state,
      PermanentAddressCountry: national,
      CorrespondenceAddressLine1: temp,
      CorrespondenceAddressLine2: temp,
      CorrespondenceAddressLine3: temp,
      CorrespondenceAddressPINCode: pincode,
      CorrespondenceAddressCity: city,
      CorrespondenceAddressDistrict: district,
      CorrespondenceAddressState: state,
      CorrespondenceAddressCountry: national,

      // telephoneOffice:,
      ResTelephoneNo: shortnumber,
      FaxNo: shortnumber,
      // smsFacility:,
      MobileNo: longnumber,
      MobileISDCode: '+91',
      MobRelation: relation,
      MobExistingClient: 'Y',
      MobExistingPAN: longnumber,
      // additionalMblNo:,
      // relation1:,
      // existingClient1:,
      // existingPan1:,
      EmailID: email,
      EmailRelation: relation,
      EmailExistingClient: 'Y',
      EmailExistingPAN: longnumber,
      // isdCodeAdditionMobile:,
      // addEmail:,
      // relation3:,
      // existingClient3:,
      // existingPan3:,
      // overseasMobile:,
      AppDeclarationDate: date,
      AppDeclarationPlace: national,
      // derivativeSegment:,
      // nomobileFlag:,
      // noemailFlag:,

      PEP: '',
      AnnualIncome: index,
      NetWorth: 20000,
      AsOnDate: date,
      datetime: date,
      SourceOfFunds: 'Salary Income',
      OccupationType: 'BUSINESS',
      OrganisationName: temp,
      Designation: temp,
      NameOfEmployer: temp,
      OffAddressLine1: temp,
      OffAddressLine2: temp,
      OffAddressLine3: temp,
      OffPIN: pincode,
      OffEmail: email,
      OffMobile: longnumber,
      OffPhone: longnumber,

      KYCVerificationEMPCode: longnumber,
      KYCVerificationName: temp,
      KYCVerificationBranch: temp,
      KYCVerificationDesignation: temp,
      KYCVerificationDate: date,

      ClientName: temp,
      TypeOfAccount: temp,
      ModeOfOperation: temp,
      IFSCCode: temp,
      BankName: temp,
      MICRNO: shortnumber,
      BranchAddress: temp,
      BranchCountry: temp,
      BranchStates: temp,
      BranchCity: temp,
      BranchPIN: pincode,
      BankAC: temp,
      ConfirmAccountNo: temp,
      OnlineFundTransfer: temp,
      RBIReferenceNo: temp,
      // RBIApprovalDate:date,
      PISBank: temp,

      FirstNomineeNamePrefix: mr,
      FirstNomineeFirstName: temp,
      FirstNomineeMiddleName: temp,
      FirstNomineeLastName: temp,
      FirstNomineeFullName: temp,
      FirstNomineeRelShip: temp,
      FirstNomineeAdd1: temp,
      FirstNomineeAdd2: temp,
      FirstNomineeAdd3: temp,
      FirstNomineePIN: pincode,
      FirstNomineeCity: temp,
      FirstNomineeState: temp,
      FirstNomineeCountry: temp,
      FirstNomineeMobISDCode: temp,
      FirstNomineeMob: temp,
      FirstNomineeISDCode: temp,
      FirstNomineeSTDCode: temp,
      FirstNomineeTelePhone: temp,
      FirstNomineeEmailID: temp,
      FirstNomineePercentOfShare: temp,
      FirstNomineeIdentificationDetails: temp,
      // FirstNomineeminorDOB: new Date(),
      SecondNomineeNamePrefix: temp,
      SecondNomineeFirstName: temp,
      SecondNomineeMiddleName: temp,
      SecondNomineeLastName: temp,
      SecondNomineeFullName: temp,
      SecondNomineeRelShip: temp,
      SecondNomineeAdd1: temp,
      SecondNomineeAdd2: temp,
      SecondNomineeAdd3: temp,
      SecondNomineePIN: pincode,
      SecondNomineeCity: temp,
      SecondNomineeState: temp,
      SecondNomineeCountry: temp,
      SecondNomineeMobISDCode: temp,
      SecondNomineeMob: temp,
      SecondNomineeISDCode: temp,
      SecondNomineeSTDCode: temp,
      SecondNomineeTelePhone: temp,
      SecondNomineeEmailID: temp,
      SecondNomineePercentOfShare: temp,
      SecondNomineeIdentificationDetails: temp,
      // SecondNomineeMInorDOB: new Date(),
      ThirdNomineeNamePrefix: temp,
      ThirdNomineeFirstName: temp,
      ThirdNomineeMiddleName: temp,
      ThirdNomineeLastName: temp,
      ThirdNomineeFullName: temp,
      ThirdNomineeRelShip: temp,
      ThirdNomineeAdd1: temp,
      ThirdNomineeAdd2: temp,
      ThirdNomineeAdd3: temp,
      ThirdNomineePIN: pincode,
      ThirdNomineeCity: temp,
      ThirdNomineeState: temp,
      ThirdNomineeCountry: temp,
      ThirdNomineeMobISDCode: temp,
      ThirdNomineeMob: temp,
      ThirdNomineeISDCode: temp,
      ThirdNomineeSTDCode: temp,
      ThirdNomineeTelePhone: temp,
      ThirdNomineeEmailID: temp,
      ThirdNomineePercentOfShare: temp,
      ThirdNomineeIdentificationDetails: temp,
      // ThirdNomineeMinorDOB: new Date()




    }
    let data2 = {
      PAN: pan,
      AppNamePrefix: mr,
      FirstName: 'Ananda',
      MiddleName: 'Krishnan',
      LastName: '',
      MaidenNamePrefix: '',
      MaidenFirstName: '',
      MaidenMiddleName: '',
      MaidenLastName: '',
      FatherSpouseIndicator: 'F',
      FatherSpousePrefix: mr,
      FatherSpouseFirstName: 'Krishnan',
      FatherSpouseMiddleName: 'Nair',
      FatherSpouseLastName: '',
      MotherNamePrefix: mrs,
      MotherFirstName: 'Reshma',
      MotherMiddleName: 'Shetty',
      MotherLastName: '',
      Gender: gender,
      Age: 20,
      Minor: n,
      MaritalStatus: martialstatus,
      Nationality: national,
      ResidentialStatus: residentailstatus,
      CIN: 34567,

      PermanentAddressProof: '',
      PermanentAddressLine1: 'Kavedath Veed',
      PermanentAddressLine2: 'Kavungal Road',
      PermanentAddressLine3: 'Chembmukku',
      PermanentAddressPINCode: '682030',
      PermanentAddressCity: 'Kaloor',
      PermanentAddressDistrict: 'Ernakulam',
      PermanentAddressState: 'Kerala',
      PermanentAddressCountry: 'India',
      CorrespondenceAddressLine1: 'Kavedath Veed',
      CorrespondenceAddressLine2: 'Kavungal Road',
      CorrespondenceAddressLine3: 'Chembmukku',
      CorrespondenceAddressPINCode: "682030",
      CorrespondenceAddressCity: 'Kaloor',
      CorrespondenceAddressDistrict: 'Ernakulam',
      CorrespondenceAddressState: 'Kerala',
      CorrespondenceAddressCountry: 'India',

      // telephoneOffice:,
      ResTelephoneNo: '236722',
      FaxNo: '546145',
      // smsFacility:,
      MobileNo: "2222222222",
      MobileISDCode: shortnumber,
      MobRelation: relation,
      MobExistingClient: 'Y',
      MobExistingPAN: longnumber,
      // additionalMblNo:,
      // relation1:,
      // existingClient1:,
      // existingPan1:,
      EmailID: email,
      EmailRelation: relation,
      EmailExistingClient: 'Y',
      EmailExistingPAN: longnumber,
      // isdCodeAdditionMobile:,
      // addEmail:,
      // relation3:,
      // existingClient3:,
      // existingPan3:,
      // overseasMobile:,
      AppDeclarationDate: date,
      AppDeclarationPlace: national,
      // derivativeSegment:,
      // nomobileFlag:,
      // noemailFlag:,

      PEP: 0,
      AnnualIncome: index,
      NetWorth: 20000,
      AsOnDate: date,
      datetime: date,
      SourceOfFunds: 'Salary Income',
      OccupationType: 'BUSINESS',
      OrganisationName: 'Bluemax',
      Designation: 'Manager',
      NameOfEmployer: 'Sumesh',
      OffAddressLine1: 'Bluemax',
      OffAddressLine2: '2nd floor Karakkal Building',
      OffAddressLine3: 'Ambadimoola',
      OffPIN: "682030",
      OffEmail: email,
      OffMobile: longnumber,
      OffPhone: longnumber,

      KYCVerificationEMPCode: "17780",
      KYCVerificationName: 'Shahana',
      KYCVerificationBranch: 'Palarivattam',
      KYCVerificationDesignation: 'Accountant',
      KYCVerificationDate: date,

      ClientName: 'Malavika',
      TypeOfAccount: temp,
      ModeOfOperation: temp,
      IFSCCode: 'SBIN0070809',
      BankName: temp,
      MICRNO: shortnumber,
      BranchAddress: temp,
      BranchCountry: temp,
      BranchStates: temp,
      BranchCity: temp,
      BranchPIN: "682030",
      BankAC: "6758483930",
      ConfirmAccountNo: "6758483930",
      OnlineFundTransfer: temp,
      RBIReferenceNo: temp,
      // RBIApprovalDate:date,
      PISBank: temp,

      FirstNomineeNamePrefix: mr,
      FirstNomineeFirstName: temp,
      FirstNomineeMiddleName: temp,
      FirstNomineeLastName: temp,
      FirstNomineeFullName: temp,
      FirstNomineeRelShip: temp,
      FirstNomineeAdd1: temp,
      FirstNomineeAdd2: temp,
      FirstNomineeAdd3: temp,
      FirstNomineePIN: "682030",
      FirstNomineeCity: temp,
      FirstNomineeState: temp,
      FirstNomineeCountry: temp,
      FirstNomineeMobISDCode: temp,
      FirstNomineeMob: temp,
      FirstNomineeISDCode: temp,
      FirstNomineeSTDCode: temp,
      FirstNomineeTelePhone: temp,
      FirstNomineeEmailID: email,
      FirstNomineePercentOfShare: temp,
      FirstNomineeIdentificationDetails: temp,
      FirstNomineeGuardianPrefix: mr,
      FirstNomineeGuardianFirstName: temp,
      FirstNomineeGuardianMiddleName: temp,
      FirstNomineeGuardianLastName: temp,
      FirstNomineeGuardianRelationship: temp,
      FirstNomineeGuardianAddress1: temp,
      FirstNomineeGuardianAddress2: temp,
      FirstNomineeGuardianAddress3: temp,
      FirstNomineeGuardianPIN: pincode,
      FirstNomineeGuardianCity: temp,
      FirstNomineeGuardianState: temp,
      FirstNomineeGuardianCountry: temp,
      FirstNomineeGuardianTelephoneNo: longnumber,
      FirstNomineeGuardianMobile: longnumber,
      FirstNomineeGuardianEmail: email,
      FirstNomineeGuardianidentificationDetails: temp,
      // FirstNomineeminorDOB: new Date(),
      SecondNomineeNamePrefix: temp,
      SecondNomineeFirstName: temp,
      SecondNomineeMiddleName: temp,
      SecondNomineeLastName: temp,
      SecondNomineeFullName: temp,
      SecondNomineeRelShip: temp,
      SecondNomineeAdd1: temp,
      SecondNomineeAdd2: temp,
      SecondNomineeAdd3: temp,
      SecondNomineePIN: "682030",
      SecondNomineeCity: temp,
      SecondNomineeState: temp,
      SecondNomineeCountry: temp,
      SecondNomineeMobISDCode: temp,
      SecondNomineeMob: temp,
      SecondNomineeISDCode: temp,
      SecondNomineeSTDCode: temp,
      SecondNomineeTelePhone: temp,
      SecondNomineeEmailID: temp,
      SecondNomineePercentOfShare: temp,
      SecondNomineeIdentificationDetails: temp,
      SecondNomineeGuardianPrefix: mr,
      SecondNomineeGuardianFirstName: temp,
      SecondNomineeGuardianMiddleName: temp,
      SecondNomineeGuardianLastName: temp,
      SecondNomineeGuardianRelationship: temp,
      SecondNomineeGuardianAddress1: temp,
      SecondNomineeGuardianAddress2: temp,
      SecondNomineeGuardianAddress3: temp,
      SecondNomineeGuardianPIN: pincode,
      SecondNomineeGuardianCity: temp,
      SecondNomineeGuardianState: temp,
      SecondNomineeGuardianCountry: temp,
      SecondNomineeGuardianTelephoneNo: longnumber,
      SecondNomineeGuardianMobile: longnumber,
      SecondNomineeGuardianEmail: email,
      SecondNomineeGuardianidentificationDetails: temp,
      // SecondNomineeMInorDOB: new Date(),
      ThirdNomineeNamePrefix: temp,
      ThirdNomineeFirstName: temp,
      ThirdNomineeMiddleName: temp,
      ThirdNomineeLastName: temp,
      ThirdNomineeFullName: temp,
      ThirdNomineeRelShip: temp,
      ThirdNomineeAdd1: temp,
      ThirdNomineeAdd2: temp,
      ThirdNomineeAdd3: temp,
      ThirdNomineePIN: "682030",
      ThirdNomineeCity: temp,
      ThirdNomineeState: temp,
      ThirdNomineeCountry: temp,
      ThirdNomineeMobISDCode: temp,
      ThirdNomineeMob: temp,
      ThirdNomineeISDCode: temp,
      ThirdNomineeSTDCode: temp,
      ThirdNomineeTelePhone: temp,
      ThirdNomineeEmailID: temp,
      ThirdNomineePercentOfShare: temp,
      ThirdNomineeIdentificationDetails: temp,
      ThirdNomineeGuardianPrefix: mr,
      ThirdNomineeGuardianFirstName: temp,
      ThirdNomineeGuardianMiddleName: temp,
      ThirdNomineeGuardianLastName: temp,
      ThirdNomineeGuardianRelationship: temp,
      ThirdNomineeGuardianAddress1: temp,
      ThirdNomineeGuardianAddress2: temp,
      ThirdNomineeGuardianAddress3: temp,
      ThirdNomineeGuardianPIN: pincode,
      ThirdNomineeGuardianCity: temp,
      ThirdNomineeGuardianState: temp,
      ThirdNomineeGuardianCountry: temp,
      ThirdNomineeGuardianTelephoneNo: longnumber,
      ThirdNomineeGuardianMobile: longnumber,
      ThirdNomineeGuardianEmail: email,
      ThirdNomineeGuardianidentificationDetails: temp,
      // ThirdNomineeMinorDOB: new Date()




    }
    this.setformdetails(data2)
    // this.devolopfill()
    // switch (type) {
    //   case 'personal':
    //     {
    //       // this.form.controls.PAN.patchValue(temp)
    //       // this.form.controls.dob.patchValue(temp)
    //       // this.form.controls.nameinpansite.patchValue(temp)
    //       // this.form.controls.ckyc.patchValue(y)
    //       // this.form.controls.ProceedType.patchValue(y)
    //       // this.form.controls.changeKRA.patchValue(n)

    //       this.form.controls.AppNamePrefix.setValue(mr)
    //       this.form.controls.FirstName.patchValue(temp)
    //       this.form.controls.MiddleName.patchValue(temp)
    //       this.form.controls.LastName.patchValue(temp)
    //       this.form.controls.MaidenNamePrefix.setValue(mr)
    //       this.form.controls.MaidenFirstName.patchValue(temp)
    //       this.form.controls.MaidenMiddleName.patchValue(temp)
    //       this.form.controls.MaidenLastName.patchValue(temp)
    //       this.form.controls.FatherSpouseIndicator.setValue('F')
    //       this.form.controls.FatherSpousePrefix.setValue(mr)
    //       this.form.controls.FatherSpouseFirstName.patchValue(temp)
    //       this.form.controls.FatherSpouseMiddleName.patchValue(temp)
    //       // @ClientId,@PAN,@AppNamePrefix,@FirstName,@MiddleName,@LastName,@ApplicantName
    //       // ,@MaidenNamePrefix,@MaidenFirstName,@MaidenMiddleName,@MaidenLastName,
    //       // @MaidenFullName,@FatherSpouseIndicator,@FatherSpousePrefix,@FatherSpouseFirstName,
    //       // @FatherSpouseMiddleName,@FatherSpouseLastName,@FatherSpouseFullName,@MotherNamePrefix,
    //       // @MotherFirstName,@MotherMiddleName,@MotherLastName,@MotherFullName,@Gender,@Age,
    //       // @Minor,@MaritalStatus,@Nationality,@ResidentialStatus,@CIN
    //       this.form.controls.FatherSpouseLastName.patchValue(temp)
    //       this.form.controls.MotherNamePrefix.setValue(mrs)
    //       this.form.controls.MotherFirstName.patchValue(temp)
    //       this.form.controls.MotherMiddleName.patchValue(temp)
    //       this.form.controls.MotherLastName.patchValue(temp)
    //       this.form.controls.Gender.setValue(gender)
    //       this.form.controls.Age.patchValue(shortnumber)
    //       this.form.controls.Minor.patchValue(n)
    //       // this.form.controls.isKRAVerified.patchValue(y)
    //       this.form.controls.MaritalStatus.setValue(martialstatus)
    //       this.form.controls.Nationality.patchValue(national)
    //       this.form.controls.ResidentialStatus.setValue(residentailstatus)
    //       this.form.controls.CIN.patchValue(temp)
    //       // this.form.controls.occupationType.patchValue(temp)
    //       // this.form.controls.otherOccupationValue.patchValue(temp)
    //       // this.form.controls.riskCountry.patchValue(national)
    //       // this.form.controls.merchantnavy.patchValue(temp)

    //     }
    //     break;
    //   case 'address':
    //     {
    //       // houseName: [null, [Validators.required]],
    //       // street: [null, [Validators.required]],
    //       // pinCode: [null, [Validators.required]],
    //       // country: [null, [Validators.required]],
    //       // state: [null, [Validators.required]],
    //       // proofOfAddress: [null, [Validators.required]],
    //       // city: [null, [Validators.required]],
    //       // district: [null, [Validators.required]],
    //       // landmark: [null],
    //       // this.form_address.controls.address1.setValue({
    //       //   houseName:temp,
    //       //   street:temp,
    //       //   pinCode:temp,
    //       //   country:temp,
    //       //   state:temp
    //       //   city:temp,
    //       //   district:temp,
    //       //   landmark:temp
    //       // }
    //       //   )
    //     }
    //     break;

    //   default:
    //     break;
    // }



  }
  //   devolopfill(){
  //     this.form.patchValue({
  //       Age: 4,
  //       AppNamePrefix: "Mr",
  //       ApplicantName: "full1",
  //       CIN: 34567,
  //       FatherSpouseFirstName: "Krishnan",
  //       FatherSpouseFullName: "full3",
  //       FatherSpouseIndicator: "F",
  //       FatherSpouseLastName: "",
  //       FatherSpouseMiddleName: "Nair",
  //       FatherSpousePrefix: "Mr",
  //       FirstName: "Ananda",
  //       Gender: "M",
  //       LastName: "",
  //       MaidenFirstName: "",
  //       MaidenFullName: "full2",
  //       MaidenLastName: "",
  //       MaidenMiddleName: "",
  //       MaidenNamePrefix: "",
  //       MaritalStatus: "S",
  //       MiddleName: "Krishnan",
  //       Minor: true,
  //       MotherFirstName: "Reshma",
  //       MotherFullName: "mfull3",
  //       MotherLastName: "",
  //       MotherMiddleName: "Shetty",
  //       MotherNamePrefix: "Mrs",
  //       Nationality: "INDIA",
  //       PAN: "AJPPJ7996L",
  //       ResidentialStatus: "NRI"
  //     })
  //     this.form_address.patchValue({
  //       address1:{
  //         city: "Kaloor",
  //         country: "India",
  //         district: "Ernakulam",
  //         houseName: "Kavedath Veed",
  //         landmark: "Chembmukku",
  //         pinCode: "682030",
  //         proofOfAddress: "10",
  //         state: "Kerala",
  //         street: "Kavungal Road",
  //         },
  //       address2: {
  //         city: "Kaloor",
  //         country: "India",
  //         district: "Ernakulam",
  //         houseName: "Kavedath Veed",
  //         landmark: "Chembmukku",
  //         pinCode: "682030",
  //         proofOfAddress: "10",
  //         sameAsPermant: false,
  //         state: "Kerala",
  //         street: "Kavungal Road"
  //       }
  //     })

  // this.form_bank.patchValue({
  //   BankAddoption: "0",
  //   accntNumber: "6758483930",
  //   address: "DOORNOVI1050,LITTLEFLOWERCHURCH,BHARATAMATACOLLEGE,SEAPORTAIRPORTROAD,THRIKKAKARA6820",
  //   bankAcType: "Savings",
  //   bankname: "STATE BANK OF INDIA",
  //   city: "VAZHAKKALA",
  //   clntname: "Malavika",
  //   confrmAccntNumber: "6758483930",
  //   country: "INDIA",
  //   ifscCode: "SBIN0070809",
  //   micr: "682002949",
  //   modeOfOperation: "Singly",
  //   oft: "N",
  //   pin: "6820",
  //   pisBank: "SBI",
  //   rbirefNo: "testfill",
  //   state: "KERALA"

  // })

  // this.form_contacts.patchValue({
  //   dateOfDeclaration: "2022-08-11 10:40:25"
  //   email: "azaruddinam250@gmail.com"
  //   existingClient: "Y"
  //   existingClient2: "Y"
  //   existingPan: "1234567890"
  //   fax: "546145"
  //   isdCodeMobile: 23
  //   mobile: "7356035113"
  //   placeOfDeclaration: "INDIA"
  //   relation: "Dependant Parent"
  //   relation2: "Dependant Parent"
  //   telephoneResidence: "236722"
  // })
  // financial: {pep: 0, anualIncome: 1, networth: 20000, networthasondate: "2022-08-11 10:40:25", RejRemarks: null,…}
  // AppRemarks: null
  // RejRemarks: null
  // anualIncome: 1
  // derivativeProof: null
  // designation: "Manager"
  // email: "1234567890"
  // mobile: "1234567890"
  // nameofemployer: "Sumesh"
  // networth: 20000
  // networthasondate: "2022-08-11 10:40:25"
  // occupationType: "BUSINESS"
  // officeaddress1: "Bluemax"
  // officeaddress2: "2nd floor Karakkal Building"
  // officeaddress3: "Ambadimoola"
  // offpin: "682030"
  // organisation: "Bluemax"
  // otherfunds: null
  // pep: 0
  // phone: "azaruddinam250@gmail.com"
  // prof_busi: null
  // skipFin: null
  // sourceOfFund: "Salary Income"
  // typeOfBusiActivity: null
  // ipv: {empCode: "17780", empName: "AZARUDDIN A M", empBranch: "HOGT", empDesingation: "SOFTWARE ENGINEER",…}
  // date: "2022-08-11 10:40:25"
  // empBranch: "HOGT"
  // empCode: "17780"
  // empDesingation: "SOFTWARE ENGINEER"
  // empName: "AZARUDDIN  A M"
  // nominee: {nomineeEqualShareForNominess: false, tradeNominee: 1,…}
  // SecondNomineeDetails: {nomineeTitle: "Mr", nomineeFirstName: "testfill", nomineeMiddleName: "testfill",…}
  // BOCategory: null
  // guardianCity: "testfill"
  // guardianCountry: "testfill"
  // guardianEmailID: "azaruddinam250@gmail.com"
  // guardianFirstName: "testfill"
  // guardianHouseName: "testfill"
  // guardianHouseNumber: "testfill"
  // guardianIdentificaitonDetails: "10"
  // guardianLastName: "testfill"
  // guardianMiddleName: "testfill"
  // guardianMobile: "1234567890"
  // guardianPin: "671123"
  // guardianRelationshipofGuardian: "Daughter"
  // guardianState: "testfill"
  // guardianStreet: "testfill"
  // guardianTelephoneNumber: "1234567890"
  // guardianTitle: "Mr"
  // isdCodeMobile: "testfill"
  // isdCodeTelephone: "testfill"
  // nomineeCity: "testfill"
  // nomineeCountry: "testfill"
  // nomineeDOB: "2022-08-08T11:23:27.320Z"
  // nomineeEmailID: "testfill@gmail.cind"
  // nomineeFirstName: "testfill"
  // nomineeHouseName: "testfill"
  // nomineeHouseNumber: "testfill"
  // nomineeLastName: "testfill"
  // nomineeMiddleName: "testfill"
  // nomineeMobile: "32321321"
  // nomineeNomineeIdentificaitonDetails: "10"
  // nomineePin: "682030"
  // nomineeRelationshipwithapplicant: "Brother"
  // nomineeState: "testfill"
  // nomineeStreet: "testfill"
  // nomineeTelephoneNumber: "2311321233123211"
  // nomineeTitle: "Mr"
  // sharePercentage: "25"
  // stdCodetelephone: "2132"
  // ThirdNomineeDetails: {nomineeTitle: "Mr", nomineeFirstName: "testfill", nomineeMiddleName: "testfill",…}
  // BOCategory: null
  // guardianCity: "testfill"
  // guardianCountry: "testfill"
  // guardianEmailID: "azaruddinam250@gmail.com"
  // guardianFirstName: "testfill"
  // guardianHouseName: "testfill"
  // guardianHouseNumber: "testfill"
  // guardianIdentificaitonDetails: "10"
  // guardianLastName: "testfill"
  // guardianMiddleName: "testfill"
  // guardianMobile: "1234567890"
  // guardianPin: "671123"
  // guardianRelationshipofGuardian: "Daughter"
  // guardianState: "testfill"
  // guardianStreet: "testfill"
  // guardianTelephoneNumber: "1234567890"
  // guardianTitle: "Mr"
  // isdCodeMobile: "testfill"
  // isdCodeTelephone: "testfill"
  // nomineeCity: "testfill"
  // nomineeCountry: "testfill"
  // nomineeDOB: "2022-08-08T11:24:15.361Z"
  // nomineeEmailID: "testfill@ghfgh.gh"
  // nomineeFirstName: "testfill"
  // nomineeHouseName: "testfill"
  // nomineeHouseNumber: "testfill"
  // nomineeLastName: "testfill"
  // nomineeMiddleName: "testfill"
  // nomineeMobile: "testfill"
  // nomineeNomineeIdentificaitonDetails: "10"
  // nomineePin: "682030"
  // nomineeRelationshipwithapplicant: "Brother"
  // nomineeState: "testfill"
  // nomineeStreet: "testfill"
  // nomineeTelephoneNumber: "324323"
  // nomineeTitle: "Mr"
  // sharePercentage: "35"
  // stdCodetelephone: "2342"
  // firstNomineeDetails: {nomineeTitle: "Mr", nomineeFirstName: "testfill", nomineeMiddleName: "testfill",…}
  // BOCategory: null
  // guardianCity: "testfill"
  // guardianCountry: "testfill"
  // guardianEmailID: "azaruddinam250@gmail.com"
  // guardianFirstName: "testfill"
  // guardianHouseName: "testfill"
  // guardianHouseNumber: "testfill"
  // guardianIdentificaitonDetails: "10"
  // guardianLastName: "testfill"
  // guardianMiddleName: "testfill"
  // guardianMobile: "1234567890"
  // guardianPin: "671123"
  // guardianRelationshipofGuardian: "Father-In-Law"
  // guardianState: "testfill"
  // guardianStreet: "testfill"
  // guardianTelephoneNumber: "1234567890"
  // guardianTitle: "Mr"
  // isdCodeMobile: "testfill"
  // isdCodeTelephone: "testfill"
  // nomineeCity: "testfill"
  // nomineeCountry: "testfill"
  // nomineeDOB: "2022-08-08T11:25:05.890Z"
  // nomineeEmailID: "testfill@fgdfg.gfs"
  // nomineeFirstName: "testfill"
  // nomineeHouseName: "testfill"
  // nomineeHouseNumber: "testfill"
  // nomineeLastName: "testfill"
  // nomineeMiddleName: "testfill"
  // nomineeMobile: "3324342432432"
  // nomineeNomineeIdentificaitonDetails: "10"
  // nomineePin: "682030"
  // nomineeRelationshipwithapplicant: "Brother"
  // nomineeState: "testfill"
  // nomineeStreet: "testfill"
  // nomineeTelephoneNumber: "2434324324342323"
  // nomineeTitle: "Mr"
  // sharePercentage: "121"
  // stdCodetelephone: "2343"
  // nomineeEqualShareForNominess: false
  // tradeNominee: 1
  // personaldetails: {PAN: "AJPPJ7996L", AppNamePrefix: "Mr", FirstName: "Ananda", MiddleName: "Krishnan", LastName: "",…}

  //   }
  findInvalidControls(form) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  ValidateFianancialForm() {
    // debugger
    // if (this.form.controls.skipFin.value) {
    //   if (this.verificationstatus.FinStatus == false) {
    //     this.notification.error('Financial details are mandatory', '')
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }
    // }
    // else {
    if (this.form_financial.controls.pep.value == null) {
      this.notification.remove()
      this.notification.error('Please select pep', '', { nzDuration: 1000 })
      this.form_financial.controls['pep'].markAsTouched()
      return false
    }
    if (this.form_financial.controls.anualIncome.value == null) {//&& this.form_financial.controls.networth.value == 0
      this.notification.remove()
      this.notification.error('Please select Annual Income ', '', { nzDuration: 1000 })
      return false
    }
    if (this.form_financial.controls.networth.value != null && this.form_financial.controls.networth.value != 0 && this.form_financial.controls.networthasondate.value == null) {
      this.notification.remove()
      this.notification.error('Please select networth as on date', '', { nzDuration: 1000 })
      return false
    }
    if (this.form_financial.controls.sourceOfFund.value == null || this.form_financial.controls.sourceOfFund.value == '') {
      this.notification.remove()
      this.notification.error('Please Choose the Source of fund', '', { nzDuration: 1000 })
      this.form_financial.controls['sourceOfFund'].markAsTouched()
      return false
    }
    if (this.isvisibleprof_busi) {
      if (!this.form_financial.controls.prof_busi.value) {
        this.notification.remove()
        this.notification.error("Please Enter Professional/Business name", '', { nzDuration: 1000 })
        return false
      }
    }
    if (this.isvisiblebusi) {
      if (!this.form_financial.controls.typeOfBusiActivity.value) {
        this.notification.remove()
        this.notification.error("Please Enter Type of business activity", '', { nzDuration: 1000 })
        return false
      }
    }
    if (this.isotherSource) {
      if (!this.form_financial.controls.otherfunds.value) {
        this.notification.remove()
        this.notification.error("Please specify the source of fund", '', { nzDuration: 1000 })
        return false
      }
    }
    if (this.isOccuVisible) {
      if (this.form_financial.controls.occupationType.value == null || this.form_financial.controls.occupationType.value == '' ||
        this.form_financial.controls.occupationType.value == undefined) {
          this.notification.remove()
          this.notification.error('Please choose Occupation', '', { nzDuration: 1000 })
        return false
      }
      if (this.isOccupdetails) {
        if (this.form_financial.controls.designation.value == null || this.form_financial.controls.designation.value == '' ||
          this.form_financial.controls.designation.value == undefined) {
            this.notification.remove()
            this.notification.error('Please enter designation', '', { nzDuration: 1000 })
          return false
        }
        if (this.form_financial.controls.officeaddress1.value == null || this.form_financial.controls.officeaddress1.value == '' ||
          this.form_financial.controls.officeaddress1.value == undefined) {
            this.notification.remove()
            this.notification.error('Please enter Office address', '', { nzDuration: 1000 })
          return false
        }
      }
      if (this.derivativeStatus) {
        if (this.form_financial.controls.derivativeProof.value == null || this.form_financial.controls.derivativeProof.value == '' ||
          this.form_financial.controls.derivativeProof.value == undefined) {
            this.notification.remove()
            this.notification.error('Please choose derivative proof', '', { nzDuration: 1000 })
          return false
        }
      }
    }
    if (this.form_financial.controls.email && this.form_financial.controls.email.value && this.form_financial.controls.email.value.length > 0) {
      // console.log(this.form_financial.controls.email.value);
      var emailValid: boolean = false
      emailValid = this.ValidateEmail(this.form_financial.controls.email.value)
      // console.log(emailValid);
      if (!emailValid) {
        this.notification.remove()
        this.notification.error('Please enter a valid email', '', { nzDuration: 1000 });
        document.getElementById('financialemail').classList.add('focuscolor')
        // (this.form_financial.controls.email.value.valueAccessor as any)._elementRef.nativeElement.focus();
        return false
      }
      else{
        if (document.getElementById("financialemail").classList.contains('focuscolor'))
          document.getElementById('financialemail').classList.remove('focuscolor')
      }
    }
    return true
    // }
  }
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
  validateallforms() {
    // console.log(this.form_nominee.controls.firstNomineeDetails, this.form_nominee.controls.SecondNomineeDetails, this.form_nominee.controls.ThirdNomineeDetails,);

    // console.log("validate start");
    // console.log(this.form_address.controls.address1);

    if (
      !this.validServ.validateForm(this.form, {}, this.validcongif.PersonalDetails) ||
      !this.validServ.validateForm(this.form_address.controls.address1, {}, this.validcongif.CurrentAddress) ||
      !this.validServ.validateForm(this.form_address.controls.address2, {}, this.validcongif.correspondenceAddress) ||

      !this.validServ.validateForm(this.form_contacts, {}) ||
      !this.validServ.validateForm(this.form_bank, {}) ||

      !this.validServ.validateForm(this.form_financial, {}) ||
      !this.ValidateFianancialForm() //||
    ) {
      // console.log("validate error");
      return false
    }
    if(this.form.value.PAN !== this.form_contacts.value.existingPan && this.form_contacts.value.relation =='Self')
    {
      this.notification.remove()
      this.notification.error( `Mobile Relation 'Self' Cannot be selected for different PAN `, '',{ nzDuration:3000})
      return false
    }
    if(this.form.value.PAN !== this.form_contacts.value.existingPan2 && this.form_contacts.value.relation2 =='Self')
    {
      this.notification.remove()
      this.notification.error( `Email Relation 'Self' Cannot be selected for different PAN `, '',{ nzDuration:3000})
      return false
    }

    // let index = this.relationArray.findIndex(item=>item.Code == 'Self')
    //       if(index !==-1)
    //         this.relationArray.splice(index,1)
    //       console.log("relationArray : ",this.relationArray);
    //       // Code: 'Self'
    if (this.add1.controls.street.value !== undefined || this.add1.controls.street.value !== null || this.add1.controls.street.value !== '') {
      let note = this.add2.controls.sameAsPermant.value ? '' : 'Permanent Addresss'
      if (this.add1.controls.street.value.length !== 0 && this.add1.controls.street.value.length < 25) {
        if (this.add1.controls.landmark.value.length > 0) {
          this.notification.remove()
          this.notification.error(note + 'Need to enter minimum 25 character in address 2.', '', { nzDuration: 1000 })
          return false
        }
      }

    }
    // console.log(this.add1.controls.street.value);

    if (this.add1.controls.street.value.length == 0) {
      if (this.add1.controls.landmark.value.length > 0) {
        this.notification.remove()
        this.notification.error('Need to Fill address 3 only after fill address2 ', '', { nzDuration: 1000 })
        return false
      }
    }
    if (this.add2.controls.street.value !== undefined || this.add2.controls.street.value !== null || this.add2.controls.street.value !== '') {
      let note2 = this.add2.controls.sameAsPermant.value ? '' : 'Currespondance Addresss'
      if (this.add2.controls.street.value.length !== 0 && this.add2.controls.street.value.length < 25) {
        if (this.add2.controls.landmark.value.length > 0) {
          this.notification.remove()
          this.notification.error(note2 + 'Need to enter minimum 25 character in address 2.', '', { nzDuration: 1000 })
          return false
        }
      }
    }
    if (this.add2.controls.street.value.length == 0) {
      if (this.add2.controls.landmark.value.length > 0) {
        this.notification.remove()
        this.notification.error('Need to Fill address 3 only after fill address2 ', '', { nzDuration: 1000 })
        return false
      }
    }
    if (!this.Type3disable) {
      if (!this.validServ.validateForm(this.form_address.controls.address4, {}, this.validcongif.JurisAddress) ||
        !this.validServ.validateForm(this.form_passport, {})
      ) {
        return false
      }
      if (this.add4.controls.street.value !== undefined || this.add4.controls.street.value !== null || this.add4.controls.street.value !== '') {

        if (this.add4.controls.street.value.length !== 0 && this.add4.controls.street.value.length < 25) {
          if (this.add4.controls.landmark.value && this.add4.controls.landmark.value.length > 0) {
            this.notification.remove()
            this.notification.error('Judistictiction Address Need to enter minimum 25 character in address 2.', '', { nzDuration: 1000 })
            return false
          }
        }
      }
      if (this.add4.controls.street.value.length == 0) {
        if (this.add4.controls.landmark.value.length > 0) {
          this.notification.remove()
          this.notification.error('Need to Fill address 3 only after fill address2 ', '', { nzDuration: 1000 })
          return false
        }
      }
    }
    if (this.numOfNominees !== 'Zero') {
      var share1 = this.nomineeForm1.controls.sharePercentage.value == null ? 0 : this.nomineeForm1.controls.sharePercentage.value
      var share2 = this.nomineeForm2.controls.sharePercentage.value == null ? 0 : this.nomineeForm2.controls.sharePercentage.value
      var share3 = this.nomineeForm3.controls.sharePercentage.value == null ? 0 : this.nomineeForm3.controls.sharePercentage.value
      if (this.numOfNominees === 'Three') {
        if ((!this.validServ.validateForm(this.form_nominee.controls.firstNomineeDetails, {}, this.Label) ||
          !this.validServ.validateForm(this.form_nominee.controls.SecondNomineeDetails, {}, this.Label) ||
          !this.validServ.validateForm(this.form_nominee.controls.ThirdNomineeDetails, {}, this.Label))
        ) {
          // console.log("validate nominee3 error");
          return false
        }
        // console.log(this.form_nominee.controls.nomineeEqualShareForNominess.value);

        // console.log(share1, share2, share3);

        if ((Number(share1) + Number(share2) + Number(share3) !== 100) && !this.form_nominee.controls.nomineeEqualShareForNominess.value) {
          this.notification.remove()
          this.notification.error('Net Nominee Shares should be 100 %', '', { nzDuration: 1000 })
          return false
        }
      }
      if (this.numOfNominees === 'Two') {
        if ((!this.validServ.validateForm(this.form_nominee.controls.firstNomineeDetails, {}, this.Label) ||
          !this.validServ.validateForm(this.form_nominee.controls.SecondNomineeDetails, {}, this.Label))
        ) {
          // console.log("validate nominee2 error");
          return false
        }
        if ((Number(share1) + Number(share2) !== 100) && !this.form_nominee.controls.nomineeEqualShareForNominess.value) {
          this.notification.remove()
          this.notification.error('Net Nominee Shares should be 100 %', '', { nzDuration: 1000 })
          return false
        }
      }
      if (this.numOfNominees === 'One') {
        if ((!this.validServ.validateForm(this.form_nominee.controls.firstNomineeDetails, {}, this.Label))
        ) {
          // console.log("validate nominee1 error");
          return false
        }
        if ((Number(share1) !== 100) && !this.form_nominee.controls.nomineeEqualShareForNominess.value) {
          this.notification.remove()
          this.notification.error('Net Nominee Shares should be 100% ', '', { nzDuration: 1000 })
          return false
        }
      }
    }
    if (this.TradeCodeTransfer) {
      if (this.ToLocationField == '' || this.ToLocationField == null) {
        this.notification.remove()
        this.notification.error('ToLocation Field Is Mandatory', '', { nzDuration: 1000 })
        return false
      }
    }
    let identityPoof = this.isIdentityProofValid();
    if (!identityPoof) {
      // console.log("validate identityPoof error");
      return false
    }

    // let smsFacility = this.canAllowSmsFacility()
    // if (!smsFacility) {
    //   // console.log("validate smsFacility error");
    //   return false
    // }

    // console.log("validate success");


    // this.contactsformValidate()
    // this.bankformvalidation()

    return true
  }
  setpersonaldetails(data: any) {
    // console.log(data);
    this.model.PanNo = data.PAN
    this.form.controls.PAN.patchValue(data.PAN)
    // this.form.controls.dob.patchValue(temp)
    // this.form.controls.nameinpansite.patchValue(temp)
    // this.form.controls.ckyc.patchValue(y)
    // this.form.controls.ProceedType.patchValue(y)
    // this.form.controls.changeKRA.patchValue(n)
    this.form.controls.AppNamePrefix.setValue(data.AppNamePrefix)
    this.form.controls.FirstName.patchValue(data.FirstName)
    this.form.controls.MiddleName.patchValue(data.MiddleName)
    this.form.controls.LastName.patchValue(data.LastName)
    this.form.controls.MaidenNamePrefix.setValue(data.MaidenNamePrefix)
    this.form.controls.MaidenFirstName.patchValue(data.MaidenFirstName)
    this.form.controls.MaidenMiddleName.patchValue(data.MaidenMiddleName)
    this.form.controls.MaidenLastName.patchValue(data.MaidenLastName)
    this.form.controls.FatherSpouseIndicator.setValue(data.FatherSpouseIndicator)
    this.form.controls.FatherSpousePrefix.setValue(data.FatherSpousePrefix)
    this.form.controls.FatherSpouseFirstName.patchValue(data.FatherSpouseFirstName)
    this.form.controls.FatherSpouseMiddleName.patchValue(data.FatherSpouseMiddleName)
    // @ClientId,@PAN,@AppNamePrefix,@FirstName,@MiddleName,@LastName,@ApplicantName
    // ,@MaidenNamePrefix,@MaidenFirstName,@MaidenMiddleName,@MaidenLastName,
    // @MaidenFullName,@FatherSpouseIndicator,@FatherSpousePrefix,@FatherSpouseFirstName,
    // @FatherSpouseMiddleName,@FatherSpouseLastName,@FatherSpouseFullName,@MotherNamePrefix,
    // @MotherFirstName,@MotherMiddleName,@MotherLastName,@MotherFullName,@Gender,@Age,
    // @Minor,@MaritalStatus,@Nationality,@ResidentialStatus,@CIN
    this.form.controls.FatherSpouseLastName.patchValue(data.FatherSpouseLastName)
    this.form.controls.MotherNamePrefix.setValue(data.MotherNamePrefix)
    this.form.controls.MotherFirstName.patchValue(data.MotherFirstName)
    this.form.controls.MotherMiddleName.patchValue(data.MotherMiddleName)
    this.form.controls.MotherLastName.patchValue(data.MotherLastName)
    this.form.controls.Gender.setValue(data.Gender)
    this.form.controls.Age.patchValue(data.Age)
    this.form.controls.Minor.patchValue(data.Minor)
    // this.form.controls.isKRAVerified.patchValue(y)
    this.form.controls.MaritalStatus.setValue(data.MaritalStatus)

    this.form.controls.Nationality.patchValue(data.Nationality)
    this.form.controls.ResidentialStatus.setValue(data.ResidentialStatus)
    // this.form.controls.occupationType.patchValue(temp)
    // this.form.controls.otherOccupationValue.patchValue(temp)
    this.form.controls.riskCountry.patchValue(data.RiskCountry)
    this.form.controls.CIN.patchValue(data.CIN)
    // this.form.controls.merchantnavy.patchValue(temp)
    this.setaddressdetails(data)


  }

  prefillformdetails() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "ClStatusChangeSlNo": this.serielno
        }],
      "requestId": "700132"// "700211",//"700132"
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          let data = response.results[0][0]
          this.model.PanNo = data.PAN
          var kradata =[]
          if (this.CurrentStatus == 'P' || this.CurrentStatus == 'I' || this.CurrentStatus == 'R') {//|| this.CurrentStatus == 'A'
            // console.log("prefillpersonaldetails :  ", response.results);
            // console.log("Age : ", data);

            this.rejectEditeEnable =this.CurrentStatus == 'R' ? true :false
            // let completed =
            // if(completed)=
            this.hoDropdowns().then(res => {
              if(res){
                this.setformdetails(data, 'ho')
                if(this.CurrentStatus == 'P')
            {
              setTimeout(() => {

                this.documentValidate()
              }, 500);
            }
          }})


            if(this.CurrentStatus == 'R')
            {
            this.editFlag = true
            }
            this.SupportFiles = response.results[1] ? response.results[1] : [] // to prefill documents


            // this.SupportFiles.sort(function(a, b) {
            //   console.log(a);

            //   return this.compareStrings(a.DocName, b.DocName);

            // })
            // compareStrings(a, b) {
            //   console.log(a);
            //   console.log(b);
            //   // Assuming you want case-insensitive comparison
            //   a = a.toLowerCase();
            //   b = b.toLowerCase();

            //   return (a < b) ? -1 : (a > b) ? 1 : 0;
            // }

            this.setDocumentsData(this.SupportFiles)
          }
          else {
            this.FromLocationField = data.CurLocation
            // let final = this.CurrentStatus == 'AC' && !this.TradeCodeTransfer ? true : this.CurrentStatus == 'AC' && this.TradeCodeTransfer ? true : false
            // if (final) {

            // }

            // console.log("after approval", data);
            this.firstTabView = false
            this.fisttabcompleted = false
            this.AllFormEnable = false
            this.activeTabIndex = 2
            this.isSpining = false
            this.thirdtabdisable = false
            this.secondTabCompleted = true
            this.secondtabdisable = false
            this.TradeCodeTransfer = data.TradeCodeTransfer == '1' ? true : false
            // console.log("this.cpremovalenable before", this.cpremovalenable);
            this.cpremovalenable = data.FOFlag == 1 ? true : false
            // console.log("this.cpremovalenable", this.cpremovalenable);
            if (this.CurrentStatus == 'A') {
              this.TradeCode = data.TradeCode
              this.ConversionType = data.EntryType
              this.DPId = data.DPID
              this.DPAccountNumber = data.DematAcNo
              this.ClientId = data.ClientId
              this.GetSpForThreeValidationHO()
            }
            else {
              if (!this.cpremovalenable && this.CurrentStatus == 'AF') {
                this.CurrentStatus = 'AR'
              }

              this.HOVerifyButtonLabel = this.CurrentStatus == 'AF' ? 'Verify UCC' : this.CurrentStatus == 'AU' ? 'Verify Converted' : this.CurrentStatus == 'AC' ? 'Verify Trade Code Transfer' : this.CurrentStatus == 'AT' ? 'Verify UCC Trade Code Transfer' : ''
              this.CPCodeRemoval = this.CurrentStatus == 'AR' || this.CurrentStatus == 'AU' || this.CurrentStatus == 'AC' || this.CurrentStatus == 'AT' || this.CurrentStatus == 'AE'
              this.UCCManualWork = this.CurrentStatus == 'AU' || this.CurrentStatus == 'AC' || this.CurrentStatus == 'AT' || this.CurrentStatus == 'AE'
              this.UCCConverted = this.CurrentStatus == 'AC' || this.CurrentStatus == 'AT' || this.CurrentStatus == 'AE'
              this.HOValidateTradeCodeTransfer = (this.CurrentStatus == 'AT' || this.CurrentStatus == 'AE') && this.TradeCodeTransfer
              this.HOValidateUCCTradeCodeTransfer = this.CurrentStatus == 'AE' && this.TradeCodeTransfer
              // this.final = this.CurrentStatus == 'AC' && !this.TradeCodeTransfer ? true : this.CurrentStatus == 'AE' && this.TradeCodeTransfer ? true : false
              this.final =  this.CurrentStatus == 'AE'? true : false
              if (this.final) {
                kradata = response.results[2] ? response.results[2] : [{
                  KRAStatus:'',
                  DateOfUploadingKRA:'',
                  KRAHasBeenUploaded:false
                }]
                // console.log("kradata : ",kradata);
// KRASTATUS =NULL OR 'Y'
// dateofuploading-date
// krahasbeenuploaded='Y' OR NULL

                this.KRAUploaded = kradata[0].KRAHasBeenUploaded?kradata[0].KRAHasBeenUploaded:false
                this.KRAUploadedDate = kradata[0].DateOfUploadingKRA?kradata[0].DateOfUploadingKRA:''
                this.KRAstatus = kradata[0].KRAStatus?kradata[0].KRAStatus:''
                // alert(this.final)
                // alert("final")
                // this.KRAUploaded =kradata[0].
                this.edittabtitle = 'Status Conversion Form'

                this.fisttabcompleted = true
                this.secondtabdisable = false
                this.ValidateFormEnable = true
                this.AllFormEnable = true
                this.editFlag = false
                this.personalformenable = true
                this.getidentifyprooforaddressproofdetails()
                this.contactssetvalidation()
                this.getfinancial()
                this.getbankdropdown()
                this.nomineeinitialize()
                this.getnomineerelationshipdropdown()
                this.onSelectClient()
                this.setformdetails(data, 'ho')
                this.SupportFiles = response.results[1] ? response.results[1] : [];

                this.setDocumentsData(this.SupportFiles)
              }
            }
          }
        }
        else {
          this.isSpining = false
          this.notification.remove()
          this.notification.error('Data can not be saved', '', { nzDuration: 1000 })
        }
      }
      else {
        this.isSpining = false
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
      }
    })
  }

  setDocumentsData(SupportFiles: any){
    if(SupportFiles){
      this.cscservice.setDocumentsData(SupportFiles);
    }else{
      this.notification.remove()
      this.notification.error('Something Went Wrong! Please Try Again', '', { nzDuration: 1000 })
    }
  }
  prefillBranchData() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Pan": this.model.PanNo
        }],
      "requestId": "700153",//"6005",
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results && response.results.length) {
          debugger
          this.setformdetails(response.results[0][0], 'branch')
        }
        else {
          this.isSpining = false
          this.notification.remove()
          this.notification.error('No data available', '', { nzDuration: 1000 })
        }
      }
      else {
        this.isSpining = false
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
      }
    })
  }
  // personal details functions end

  // address function start
  getPinData(pin, Address) {
    try {
      var data = pin.target.value ? pin.target.value : null
      if (data == null) {
        return
      }
      if (this.entryAccess == false) {
        return
      }
      if (data.length != 6) {
        if (Address == "address1") {
          // console.log(this.add1);

          this.add1.controls.country.setValue(null)
          this.add1.controls.district.setValue(null)
          this.add1.controls.state.setValue(null)
          this.A1district = [];
        }
        if (Address == "address2") {
          this.add2.controls.country.setValue(null)
          this.add2.controls.district.setValue(null)
          this.add2.controls.state.setValue(null)
          this.A2district = [];
        }
        if (Address == "address3") {
          this.add3.controls.country.setValue(null)
          this.add3.controls.district.setValue(null)
          this.add3.controls.state.setValue(null)
          this.A3district = [];
        }
        if (Address == "address4") {
          this.add4.controls.country.setValue(null)
          this.add4.controls.district.setValue(null)
          this.add4.controls.state.setValue(null)
          this.A4district = [];
        }
        return
      }

      if (data.length == 6) {
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              "Pin": data,
            }],
          "requestId": "5037"
        })
          .then((response) => {
            if (response.results) {
              if (response.results[0].length > 0) {
                let productList = response.results[0][0];
                if (Address == "address1") {
                  if (data == '100000') {
                    this.isAdd1Pin = true
                  }
                  else {
                    this.isAdd1Pin = false
                  }
                  for (let i = 0; i < response.results[0].length; i++) {
                    this.A1district.push(response.results[0][i].District);
                  }
                  // console.log(this.add1);

                  this.add1.controls.country.setValue(productList.Country)
                  this.add1.controls.district.setValue(productList.District)
                  this.add1.controls.city.setValue(productList.District)
                  this.add1.controls.state.setValue(productList.STATENAME)
                }
                if (Address == "address2") {
                  if (data == '100000') {
                    this.isAdd2Pin = true
                  }
                  else {
                    this.isAdd2Pin = false
                  }
                  this.add2.controls.country.setValue(productList.Country)
                  this.add2.controls.district.setValue(productList.District)
                  this.add2.controls.city.setValue(productList.District)
                  this.add2.controls.state.setValue(productList.STATENAME)
                  for (let i = 0; i < response.results[0].length; i++) {
                    this.A2district.push(response.results[0][i].District);
                  }
                }
                if (Address == "address3") {
                  this.add3.controls.country.setValue(productList.Country)
                  this.add3.controls.district.setValue(productList.District)
                  this.add3.controls.state.setValue(productList.STATENAME)
                  for (let i = 0; i < response.results[0].length; i++) {
                    this.A3district.push(response.results[0][i].District);
                  }
                }
                if (Address == "address4") {
                  this.add4.controls.country.setValue(productList.Country)
                  this.add4.controls.district.setValue(productList.District)
                  this.add4.controls.state.setValue(productList.STATENAME)
                  for (let i = 0; i < response.results[0].length; i++) {
                    this.A4district.push(response.results[0][i].District);
                  }
                }

              }
            }
          })

      }
    }
    catch (err) {
      console.log(err);
    }
  }

  // getproof() {
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         Location: "",
  //         EUser: ""
  //       }],
  //     "requestId": "6022",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     if (response.results) {
  //       this.ProofDetials = response.results[2]
  //       this.ProofDetials.forEach(element => {
  //         if (element.PermanentAddressProof == true) {
  //           this.PermanentAddressProofDetails.push(element)
  //         }
  //         if (element.CorrespondanceAddressProof == true) {
  //           this.CorrespondanceAddressProofDetails.push(element)
  //         }
  //       });

  //       this.totalProofDetial = response.results[3]
  //       this.countryArray = response.results[9];

  //       this.code = this.ProofDetials[3].Code
  //       this.add1.controls.proofOfAddress.patchValue(this.code)
  //       this.add2.controls.proofOfAddress.patchValue(this.code)
  //       this.form_address.controls.idProof.patchValue(this.code)
  //     }
  //     // if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
  //     //   this.isReport = true;
  //     //   this.FillApproveData();
  //     // }
  //   })
  // }
  getidentifyprooforaddressproofdetails() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber
        }],
      "requestId": "5052",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        this.cmServ2.kycInitialFillingData.next(response.results)//doubt
        let val = response.results
        if (val.length) {
          this.relationArray = val[8]
          this.countrycode = val[10]

        }

        let citizenshiparray = JSON.stringify(response.results[6])
        this.citizenshipArray = JSON.parse(citizenshiparray)
        this.citizenshipWithNoIndiaArray = JSON.parse(citizenshiparray)
        this.addressTypeArray = response.results[11]
        this.citizenshipWithNoIndiaArray.forEach((element, index) => {
          if (element.Country == 'INDIA') {
            this.citizenshipWithNoIndiaArray.splice(index, 1)
          }
        });
        this.ProofDetials = response.results[1]
        this.ProofDetials.forEach(element => {
          if (element.PermanentAddressProof == true) {
            this.PermanentAddressProofDetails.push(element)
          }
          if (element.CorrespondanceAddressProof == true) {
            this.CorrespondanceAddressProofDetails.push(element)
          }
          if (element.JurisdictionAddressProof == true) {
            this.JurisdictionAddressProofDetails.push(element)
          }
          if (element.IdentityProof == true) {
            this.identityProofDetails.push(element)
          }
        });
        this.totalProofDetial = response.results[2]
        if (this.totalProofDetial.length > 0) {
          this.cmServ2.isTotalProofDatafound.next(true)
        }
        this.code = this.ProofDetials[9].Code
        if (!this.fromReportPoolPage) {
          this.add1.controls.proofOfAddress.patchValue(this.code)
          this.add2.controls.proofOfAddress.patchValue(this.code)
          // this.add3.controls.proofOfAddress.patchValue(this.code)
          this.add4.controls.proofOfAddress.patchValue(this.code)

          this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);
          this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);
          this.Address1formFeilds.forEach(element => {
            if (element.label == "Issuing Authority") {
              element.proof1 = "UIDAI"
            }
          });
          this.Address2formFeilds.forEach(element => {
            if (element.label == "Issuing Authority") {
              element.proof1 = "UIDAI"
            }
          });
          let data = JSON.stringify(this.totalProofDetial)
          let data1 = JSON.parse(data)
          // this.Address3formFeilds = this.cmServ.getControls(data1, this.code)
          let valuesArray = JSON.stringify(this.cmServ.getControls(this.totalProofDetial, this.code))
          this.Address4formFeilds = JSON.parse(valuesArray)
          // this.Address4formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);

          this.cmServ.clientBasicData.subscribe((data) => {
            this.PANNO = data.PANNo ? data.PANNo : data.PanNumber ? data.PanNumber : '';
          });
        }

        // console.log("nri or not ",this.isNRE);

        if (this.isNRE) {
          this.form_address.controls.taxOutsideIndia.patchValue(true)
        }
        // this.form.controls.idProof.patchValue("34")
        // this.identityProofformFeilds = this.cmServ.getControls(this.totalProofDetial,34);
        // this.identityProofformFeilds.forEach(item => {
        //   item.proof0=this.PANNO;

        // });
        // this.form=this.cmServ.getControls(this.totalProofDetial,this.code);
      }
    })
    this.form_address.controls.taxOutsideIndia.valueChanges.subscribe(val => {
      if (val == true) {
        this.isJudisdiction = true
      }
      else {
        this.isJudisdiction = false
        this.clearJurisdictionForm()
      }
    })

    this.cmServ2.isEntryAccess.subscribe(val => {
      this.entryAccess = val
    })
    if (!this.fromReportPoolPage) {
      this.add1.controls.proofOfAddress.valueChanges.subscribe(res => {
        this.Address1formFeilds = this.cmServ2.getControls(this.totalProofDetial, res);
      })
      this.add2.controls.proofOfAddress.valueChanges.subscribe(res => {
        // let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        // this.Address2formFeilds = JSON.parse(valuesArray)
        this.Address2formFeilds = this.cmServ2.getControls(this.totalProofDetial, res);
      })
      this.add3.controls.proofOfAddress.valueChanges.subscribe(res => {
        this.Address3formFeilds = this.cmServ2.getControls(this.totalProofDetial, res)

      })
      this.add4.controls.proofOfAddress.valueChanges.subscribe(res => {
        this.Address4formFeilds = this.cmServ2.getControls(this.totalProofDetial, res);
      })
    }
    this.form_address.controls.idProof.valueChanges.subscribe(res => {
      this.identityProofformFeilds = this.cmServ2.getControls(this.totalProofDetial, res);


    })
    this.add3.controls.pinCode.valueChanges.subscribe(val => {
      if (val && val.length == 6) {
        this.cmServ2.isAdditionalAddressGiven.next(true)
      }
      else {
        this.cmServ2.isAdditionalAddressGiven.next(false)
      }
    })
    this.cmServ2.disableKraFields.subscribe(val => {

      this.disableKrarelatedFields = val

    })
    this.add4.controls.taxCountry.valueChanges.subscribe(val => {
      // console.log("taxCountry :",val,this.form.value.taxOutsideIndia)
      // if (this.form.value.taxOutsideIndia) {
        if(val =='UNITED STATES OF AMERICA'){
          this.add4.controls.fatca.patchValue('USPerson')
          this.fatcadisable =true
        }
        else{
          this.add4.controls.fatca.patchValue('NA')
          this.fatcadisable =false
        }
        if(val){
          let data =  val.toUpperCase()
        // console.log(this.citizenshipWithNoIndiaArray);
          if(this.citizenshipWithNoIndiaArray && this.citizenshipWithNoIndiaArray.length>0)
          {
        this.countryresultArray = this.citizenshipWithNoIndiaArray.filter(ele => {
          return (ele["Country"].startsWith(data))
        })
      }
      }
    // }
    })


    this.add4.controls.countryOfBirth.valueChanges.subscribe(val => {
      if (this.form_address.value.taxOutsideIndia) {
        if(val)
        {
        let data = val.toUpperCase();
        this.resultArray1 = this.citizenshipArray.filter(ele => {
          return (ele["Country"].startsWith(data))
        })
      }
      }
    })

    this.add1.controls.country.valueChanges.subscribe(val => {
      if (val && val.length > 0 && val.toUpperCase() != 'INDIA') {
        this.add1.controls.state.patchValue('OTHER')
      }
    })

    this.add2.controls.country.valueChanges.subscribe(val => {
      if (val && val.length > 0 && val.toUpperCase() != 'INDIA') {
        this.add2.controls.state.patchValue('OTHER')
      }
    })

    this.cmServ2.isServiceCallsAllow.subscribe(val => {
      this.isServiceCallsAllow = val
    })
  }
  selectPermantADD(data) {


    if (data != null && data != undefined) {
      if (data == true) {
        this.A2district = this.A1district
        this.cmServ2.sameAsPermantAddress.next(true)
        this.isPemantSelected = true;
        this.isAdd2Pin = true;
        let form: any = this.form_address.controls.address2
        let targetData: any = this.form_address.controls.address1
        // let pfAdd1: any = this.form.controls.address1Proof
        form.controls.houseName.setValue(targetData.controls.houseName.value)
        // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
        form.controls.street.setValue(targetData.controls.street.value)
        form.controls.city.setValue(targetData.controls.city.value)
        form.controls.country.setValue(targetData.controls.country.value)
        form.controls.district.setValue(targetData.controls.district.value)
        form.controls.pinCode.setValue(targetData.controls.pinCode.value)
        form.controls.state.setValue(targetData.controls.state.value)
        form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
        form.controls.landmark.setValue(targetData.controls.landmark.value)
        this.Address2formFeilds = this.Address1formFeilds
      }
      else {
        this.isPemantSelected = false
        this.cmServ2.sameAsPermantAddress.next(false)

        let form: any = this.form_address.controls.address2
        form.controls.houseName.setValue(null)
        // form.controls.houseNumber.setValue(null)
        form.controls.street.setValue(null)
        form.controls.city.setValue(null)
        // form.controls.address.setValue(null)
        form.controls.country.setValue(null)
        form.controls.state.setValue(null)
        form.controls.district.setValue(null)
        form.controls.pinCode.setValue(null)
        form.controls.landmark.setValue(null)
        if (this.ProofDetials.length)
          form.controls.proofOfAddress.setValue(this.ProofDetials[9].Code)
      }
    }
  }
  clearJurisdictionForm() {
    this.add4.controls.sameAddAs.setValue('none')
    this.add4.controls.taxCountry.setValue(null)
    this.add4.controls.taxIdentification.setValue(null)
    this.add4.controls.placeOfBirth.setValue(null)
    this.add4.controls.countryOfBirth.setValue(null)
    this.add4.controls.fatca.setValue('NA')
    this.add4.controls.houseName.setValue(null)
    this.add4.controls.street.setValue(null)
    this.add4.controls.pinCode.setValue(null)
    this.add4.controls.country.setValue(null)
    this.add4.controls.state.setValue(null)
    this.add4.controls.proofOfAddress.setValue(null)
    this.add4.controls.city.setValue(null)
    this.add4.controls.district.setValue(null)
    this.add4.controls.landmark.setValue(null)
  }
  charrestrictaddress(val) {
    var key = val.key
    var pattern = /[a-zA-Z0-9\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }
  charrestrict1address(val) {
    var key = val.key
    var pattern = /[a-zA-Z\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }

  ValidatePanaddress(val) {

    var charonly = /^[a-zA-Z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key
    if (val.target.selectionStart <= 4) {
      return charonly.test(text)

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      return false;
    }
  }
  numberOnlyaddress(label, val, code) {
    var numonly = /^[0-9]+$/
    if ((val.currentTarget.value.length <= 7) && (label == 'Aadhar No')) {
      if (numonly.test(val.key)) {
        this.setMaskaddress(code, '********')
      }
      else {
        return false
      }
    }
    // else if (( val.currentTarget.value.length == 7) && (label == 'Aadhar No')) {
    //   this.setMask(code, '********' )
    // }
    else {
      return numonly.test(val.key)
    }
  }

  setMaskaddress(code, val) {
    if (code == 'A1')
      this.Address1formFeilds[0].proof0 = val
    else if (code == 'A2')
      this.Address2formFeilds[0].proof0 = val
    else if (code == 'A3')
      this.Address3formFeilds[0].proof0 = val
    else if (code == 'A4')
      this.Address4formFeilds[0].proof0 = val
    else if (code == 'A5')
      this.identityProofformFeilds[0].proof0 = val
  }
  validateDate1address(field, data) {
    this.DateError = false;

    if (field == "DOI")
      this.dataOfIssue1 = data
    if (field == "Expiry Date")
      this.expiryData1 = data
    setTimeout(() => {
      if (this.dataOfIssue1 && this.expiryData1) {
        if (this.expiryData1 <= this.dataOfIssue1) {
          this.notification.remove()
          this.notification.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 1000 });
          this.Address1formFeilds[3].proof3 = null
        }
      }
    }, 200);


  }
  validateDate2address(field, data) {
    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue2 = data
    if (field == "Expiry Date")
      this.expiryData2 = data
    setTimeout(() => {
      if (this.dataOfIssue2 && this.expiryData2) {
        if (this.expiryData2 <= this.dataOfIssue2) {
          this.notification.remove()
          this.notification.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 3000 });
          this.Address2formFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  validateDate3address(field, data) {
    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue3 = data
    if (field == "Expiry Date")
      this.expiryData3 = data
    setTimeout(() => {
      if (this.dataOfIssue3 && this.expiryData3) {
        if (this.expiryData3 <= this.dataOfIssue3) {
          this.notification.remove()
          this.notification.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 3000 });
          this.Address3formFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  validateDate4address(field, data) {
    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue4 = data
    if (field == "Expiry Date")
      this.expiryData4 = data
    setTimeout(() => {
      if (this.dataOfIssue4 && this.expiryData4) {
        if (this.expiryData4 <= this.dataOfIssue4) {
          this.notification.remove()
          this.notification.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 3000 });
          this.Address4formFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  validateDate5address(field, data) {
    if (field == "DOI")
      this.dataOfIssue5 = data
    if (field == "Expiry Date")
      this.expiryData5 = data
    setTimeout(() => {
      if (this.dataOfIssue5 && this.expiryData5) {
        if (this.expiryData5 <= this.dataOfIssue5) {
          this.notification.remove()
          this.notification.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 3000 });
          this.identityProofformFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  maskAdharNumaddress(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address1formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum2address(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address2formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum3address(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address3formFeilds[0].proof0 = str
      }
    }
  }
  maskAdharNum4address(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address4formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum5address(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.identityProofformFeilds[0].proof0 = str
      }
    }
  }
  checkSameAddressAs(data) {
    if (data == null) {
      return
    }
    if (data == "Correspondence") {
      this.isJudisdictionSameAsAny = true;
      this.IsOther = 'false';
      let form: any = this.form_address.controls.address4
      let targetData: any = this.form_address.controls.address2
      this.Address4formFeilds = this.Address2formFeilds
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      form.controls.landmark.setValue(targetData.controls.landmark.value)
      this.Address4formFeilds = this.Address2formFeilds
    }
    if (data == "Permanent") {
      this.isJudisdictionSameAsAny = true;
      this.IsOther = 'false';

      let form: any = this.form_address.controls.address4
      let targetData: any = this.form_address.controls.address1
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      form.controls.landmark.setValue(targetData.controls.landmark.value)
      this.Address4formFeilds = this.Address1formFeilds
    }
    if (data == 'others') {
      this.isJudisdictionSameAsAny = false;
      this.IsOther = 'true';

      this.add4.controls.houseName.setValue(null)
      this.add4.controls.street.setValue(null)
      this.add4.controls.pinCode.setValue(null)
      this.add4.controls.country.setValue(null)
      this.add4.controls.state.setValue(null)
      this.add4.controls.proofOfAddress.patchValue(null)
      this.add4.controls.city.setValue(null)
      this.add4.controls.district.setValue(null)
      this.add4.controls.landmark.setValue(null)
    }
  }
  changCurCity(data) {
    if (data != undefined) {
      if (this.add2.controls.city.value != data) {
        this.add2.controls.city.setValue(data)
      }
      this.add2.controls.district.setValue(data)
    }
  }
  getCorrsAddCountryName(data) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.cmServ2.riskCountry.next(data)
    }, 500)
  }
  changResCity(data) {

    if (data != undefined) {
      if (this.add1.controls.city.value != data) {
        this.add1.controls.city.setValue(data)
      }
      this.add1.controls.district.setValue(data)
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
  setaddressdetails(data) {
    this.form_address.patchValue({
      proofOfAddress: data.PermanentAddressProof,
      address1: {
        houseName: data.PermanentAddressLine1,
        street: data.PermanentAddressLine2,
        landmark: data.PermanentAddressLine3,
        pinCode: data.PermanentAddressPINCode,
        city: data.PermanentAddressCity,
        district: data.PermanentAddressDistrict,
        state: data.PermanentAddressState,
        country: data.PermanentAddressCountry
      },
      address2: {
        houseName: data.CorrespondenceAddressLine1,
        street: data.CorrespondenceAddressLine2,
        landmark: data.CorrespondenceAddressLine3,
        pinCode: data.CorrespondenceAddressPINCode,
        city: data.CorrespondenceAddressCity,
        district: data.CorrespondenceAddressDistrict,
        state: data.CorrespondenceAddressState,
        country: data.CorrespondenceAddressCountry
      }
    })
  }
  tempfilladdress() {
    let data = {}
    data['PermanentAddressLine1'] = 'PermanentAddressLine1'
    data['PermanentAddressLine2'] = 'PermanentAddressLine2'
    data['PermanentAddressLine3'] = 'PermanentAddressLine3'
    data['PermanentAddressPINCode'] = '671123'
    data['PermanentAddressCity'] = 'KASARAGOD'
    data['PermanentAddressDistrict'] = 'KASARAGOD'
    data['PermanentAddressState'] = 'KERALA'
    data['PermanentAddressCountry'] = 'INDIA'
    data['PermanentAddressProof'] = '10'
    data['CorrespondenceAddressLine1'] = 'CorrespondenceAddressLine1'
    data['CorrespondenceAddressLine2'] = 'CorrespondenceAddressLine2'
    data['CorrespondenceAddressLine3'] = 'CorrespondenceAddressLine3'
    data['CorrespondenceAddressPINCode'] = '671124'
    data['CorrespondenceAddressCity'] = 'KASARAGOD'
    data['CorrespondenceAddressDistrict'] = 'KASARAGOD'
    data['CorrespondenceAddressState'] = 'KERALA'
    data['CorrespondenceAddressCountry'] = 'INDIA'
    data['CorrespondenceAddressProof'] = '10'

    this.setaddressdetails(data)
  }
  isIdentityProofValid() {
    let dummydata = this.cmServ.getProofOfDetialsData(this.identityProofformFeilds, "proof")
    if (dummydata.length == 0) {
      this.notification.remove()
      this.notification.error('Please choose Proof of Identity', '', { nzDuration: 3000 })
      return false
    }
    let isValid = this.validServ.validate(dummydata, "Proof Of Identity")
    if (dummydata[0] && dummydata[0].Code && dummydata[0].Code == '10') {
      if (dummydata[0].proof0.length != 12) {
        this.notification.remove()
        this.notification.error('Invalid Aadhaar details', '', { nzDuration: 1000 });
        isValid = false;
        return false
      }
    }
    // let pfdata = this.cmServ.generateJSONfromArray(dummydata)
    // if (isValid) {
    // let data: any = []

    // let pf =
    // {
    //   'proofOfAddress': this.form.controls.idProof.value
    // }
    // let totalData = { ...pf, ...pfdata }
    // this.identyProofOBJ = totalData
    // data.push(totalData)
    // var JSONData = this.utilServ.setJSONArray(data);
    // this.identyProofXmlData = jsonxml(JSONData);
    return isValid
    // }
    // else {
    //   isValid
    // }
  }
  // address function end
  // contacts functions start
  contactssetvalidation() {
    this.form_contacts.controls.isdCodeMobile.valueChanges.subscribe(val => {
      if (val != null) {
        if (val != '091') {
          this.min1 = 3
          this.max1 = 16
        }
        else {
          this.min1 = 10
          this.max1 = 10
        }
        // let data=val.toUpperCase();
        // console.log(this.countrycode);

        if (this.countrycode.length) {
          this.isdCodeArray = this.countrycode.filter(ele => {
            return (ele["ISD_Code"].includes(val))
          })
        }
        // console.log(this.isdCodeArray);

        // /*  ---------doubttttttt
        // clearTimeout(this.timeout);
        // this.timeout = setTimeout(() => {
        //   if (this.form_contacts.value.isdCodeMobile != '091') {
        //     this.notification.remove()
        //     this.notification.error("SMS facility is available only in India", '', { nzDuration: 100 })
        //     this.form_contacts.controls.smsFacility.setValue(false)
        //   }
        // }, 300)

      }
    })
    /*  ---------doubttttttt
        this.form_contacts.controls.mobile.valueChanges.subscribe(val => {
          if (val == null || val == '') {
            if (this.form_contacts.value.smsFacility) {
              if (this.form_contacts.value.mobile == null || this.form_contacts.value.mobile.length < 10) {
                this.notification.remove()
                this.notification.error("Please enter valid mobile number", '', { nzDuration: 1000 })
                return
              }
            }
          }
          if (!this.NRI && val && val.length == 10) {
            this.form_contacts.controls.isdCodeMobile.patchValue('091')
          }
        })

    */
    //! this.cmServ.disableKraFields.subscribe(val => {
    //   this.disableKrarelatedFields = val
    // })
    this.form_contacts.controls.isdCodeAdditionMobile.valueChanges.subscribe(val => {
      if (val != null) {
        // let data=val.toUpperCase();
        if (this.countrycode.length) {
          this.isdCodeArray = this.countrycode.filter(ele => {
            return (ele["ISD_Code"].includes(val))
          })
        }
      }
    })

    this.form_contacts.controls.existingPan.valueChanges.subscribe(val => {
      if (val != null) {
        if (this.form.value.PAN == val) {
          this.form_contacts.controls.relation.patchValue('Self')
          this.mobileRelationEnable=false
        }
        else{
          console.log("changeddddddd mobile");

          this.mobileRelationEnable=true

        }
      }
    });
    this.form_contacts.controls.existingPan2.valueChanges.subscribe(val => {
      if (val != null) {
        if (this.form.value.PAN == val) {
          this.form_contacts.controls.relation2.patchValue('Self')
          this.emailRelationEnable=false
        }
        else{

          this.emailRelationEnable=true
        }
      }
    });
    this.form_ipv.controls.date.valueChanges.subscribe(val => {
      if (val != null && this.form_ipv.controls.dateOfDeclaration.value == null) {
        this.form_ipv.controls.dateOfDeclaration.patchValue(val)
      }
    });
  }
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
  canAllowSmsFacility() {

    let data = this.form_contacts.value.smsFacility;
    if (data) {
      if (this.form_contacts.value.mobile == null || this.form_contacts.value.mobile.length < 10) {
        this.notification.remove()
        this.notification.error("Please enter valid mobile number to avail SMS facility in contact details", '', { nzDuration: 3000 })
        return false
      }
      else if (this.form_contacts.value.isdCodeMobile != '091') {
        this.notification.remove()
        this.notification.error("Please enter India's ISD Code to avail SMS facility in contact details", '', { nzDuration: 3000 })
        return false
      }
      else {
        return true
      }
    }
    else {

      this.notification.remove()
      return true
    }
  }
  validateMobileorEmail(pan, mobEmail, flag, loc, type) {
    if (this.EntryAccess == false) {
      return
    }
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
      if (response.errorCode == 0) {
        if (response.results) {
          this.isSpining = false
          let resultset = response.results[0][0]
          if (type == 'mob1') {
            if (response.results[0].length > 0) {
              this.form_contacts.controls.relation.setValidators(Validators.required);
              this.form_contacts.controls.existingPan.patchValue(resultset.PAN)
              this.form_contacts.controls.existingClient.patchValue(resultset.ClientDetails)
              this.kycContMob1 = true
            }
            else {
              this.form_contacts.controls.relation.setValidators(null);
              this.form_contacts.controls.existingPan.patchValue(null)
              this.form_contacts.controls.existingClient.patchValue(null)
              this.form_contacts.controls.relation.patchValue(null)
              this.kycContMob1 = false
            }
          }

          if (type == 'Addmob1') {
            if (response.results[0].length > 0) {
              this.form_contacts.controls.existingPan1.patchValue(resultset.PAN)
              this.form_contacts.controls.existingClient1.patchValue(resultset.ClientDetails)
              this.kycAddContMob1 = true
            }
            else {
              this.form_contacts.controls.existingPan1.patchValue(null)
              this.form_contacts.controls.existingClient1.patchValue(null)
              this.form_contacts.controls.relation1.patchValue(null)
              this.kycAddContMob1 = false
            }
          }

          if (type == 'email1') {
            if (response.results[0].length > 0) {
              this.form_contacts.controls.relation2.setValidators(Validators.required);
              this.form_contacts.controls.existingPan2.patchValue(resultset.PAN)
              this.form_contacts.controls.existingClient2.patchValue(resultset.ClientDetails)
              this.kycContEmail1 = true
            }
            else {
              this.form_contacts.controls.relation2.setValidators(null);
              this.form_contacts.controls.existingPan2.patchValue(null)
              this.form_contacts.controls.existingClient2.patchValue(null)
              this.form_contacts.controls.relation2.patchValue(null)
              this.kycContEmail1 = false
            }
          }

          if (type == 'addEmail1') {
            if (response.results[0].length > 0) {
              this.form_contacts.controls.existingPan3.patchValue(resultset.PAN)
              this.form_contacts.controls.existingClient3.patchValue(resultset.ClientDetails)
              this.kycContAddEmail1 = true
            }
            else {
              this.form_contacts.controls.existingPan3.patchValue(null)
              this.form_contacts.controls.existingClient3.patchValue(null)
              this.form_contacts.controls.relation3.patchValue(null)
              this.kycContAddEmail1 = false
            }
          }
        }
        else {
          this.isSpining = false
        }
      }
      else {
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
        this.isSpining = false
      }
    })
  }
  contactsformValidate() {

    var email = this.form_contacts.value.email
    var mobile = this.form_contacts.value.mobile

    if (email == undefined || email == null || email == '') {
      this.notification.remove()
      this.notification.error("Please enter Email. Email ID is madatory", '', { nzDuration: 1000 })
      return
    }

    if (mobile == undefined || mobile == null || mobile == '') {
      this.notification.remove()
      this.notification.error("Please enter Mobile. Mobile No is required", '', { nzDuration: 1000 })
      return
    }

    if (this.form_contacts.value.nomobileFlag) {
      if (this.form_contacts.value.mobile && this.form_contacts.value.mobile.length > 0) {
        this.notification.remove()
        this.notification.error("Please Uncheck NO Mobile flag.", '', { nzDuration: 1000 })
        return
      }
    }

    if (this.form_contacts.value.noemailFlag) {
      if (this.form_contacts.value.email && this.form_contacts.value.email.length > 0) {
        this.notification.remove()
        this.notification.error("Please Uncheck NO Email flag.", '', { nzDuration: 1000 })
        return
      }
    }

    if (this.kycContMob1) {
      if (this.form_contacts.value.relation == null) {
        this.notification.remove()
        this.notification.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 1000 })
        return
      }
    }
    if (this.kycContMob1) {
      if (this.form_contacts.value.existingPan != this.model.PanNo) {
        if (this.form_contacts.value.relation == 'Self') {
          this.notification.remove()
          this.notification.error("Pan number mismatch, self cannot be selected as relation for mobile", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycContMob1) {
      if (this.form_contacts.value.existingPan == this.model.PanNo) {
        if (this.form_contacts.value.relation != 'Self') {
          this.notification.remove()
          this.notification.error("Same PAN found, Relation must be Self for mobile", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycAddContMob1) {
      if (this.form_contacts.value.relation1 == null) {
        this.notification.remove()
        this.notification.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 1000 })
        return
      }
    }
    if (this.kycAddContMob1) {
      if (this.form_contacts.value.existingPan1 != this.model.PanNo) {
        if (this.form_contacts.value.relation1 == 'Self') {
          this.notification.remove()
          this.notification.error("Pan number mismatch, self cannot be selected as relation for additional mobile", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycAddContMob1) {
      if (this.form_contacts.value.existingPan1 == this.model.PanNo) {
        if (this.form_contacts.value.relation1 != 'Self') {
          this.notification.remove()
          this.notification.error("Same PAN found, Relation must be Self for additional mobile", '', { nzDuration: 1000 })
          return
        }
      }
    }

    if (this.kycContEmail1) {
      if (this.form_contacts.value.relation2 == null) {
        this.notification.remove()
        this.notification.error("Email already Exists,Specify relationship.", '', { nzDuration: 1000 })
        return
      }
    }
    if (this.kycContEmail1) {
      if (this.form_contacts.value.existingPan2 != this.model.PanNo) {
        if (this.form_contacts.value.relation2 == 'Self') {
          this.notification.remove()
          this.notification.error("Pan number mismatch, self cannot be selected as relation for email", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycContEmail1) {
      if (this.form_contacts.value.existingPan2 == this.model.PanNo) {
        if (this.form_contacts.value.relation2 != 'Self') {
          this.notification.remove()
          this.notification.error("Same PAN found, Relation must be Self for email", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycContAddEmail1) {
      if (this.form_contacts.value.relation3 == null) {
        this.notification.remove()
        this.notification.error("Additional Email  already Exists,Specify relationship.", '', { nzDuration: 1000 })
        return
      }
    }
    if (this.kycContAddEmail1) {
      if (this.form_contacts.value.existingPan3 != this.model.PanNo) {
        if (this.form_contacts.value.relation3 == 'Self') {
          this.notification.remove()
          this.notification.error("Pan number mismatch, self cannot be selected as relation for additional email", '', { nzDuration: 1000 })
          return
        }
      }
    }
    if (this.kycContAddEmail1) {
      if (this.form_contacts.value.existingPan3 == this.model.PanNo) {
        if (this.form_contacts.value.relation3 != 'Self') {
          this.notification.remove()
          this.notification.error("Same PAN found, Relation must be Self for additional email", '', { nzDuration: 1000 })
          return
        }
      }
    }

  }
  // contacts functions end

  //ipv functions start
  getEmpDetails(data) {
    setTimeout(() => {

      //  let data=val.target.value;
      if (data == '' || data == null) {
        this.form_ipv.controls.empDesingation.patchValue(null)
        this.form_ipv.controls.empBranch.patchValue(null)
        this.form_ipv.controls.empName.patchValue(null)
        return
      }
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            EmpCode: data,
          }],
        "requestId": "7011"
      })
        .then((response) => {
          if (response.results.length > 0) {
            let details = response.results[0][0]
            this.form_ipv.controls.empDesingation.patchValue(details.Designation)
            this.form_ipv.controls.empBranch.patchValue(details.Branch)
            this.form_ipv.controls.empName.patchValue(details.EmpName)
          }
          else {
            this.form_ipv.controls.empDesingation.patchValue(null)
            this.form_ipv.controls.empBranch.patchValue(null)
            this.form_ipv.controls.empName.patchValue(null)
          }
        })
    }, 1500);
  }

  charrestrictipv(val) {
    var key = val.key
    var pattern = /[&<>]+$/;
    if (key.match(pattern)) {
      return false
    }
  }
  //ipv functions end

  // upload function start
  //! setproofs(Atcion) {
  //   // this.actionType=Atcion
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         ParamType: Atcion,
  //         Location: "",
  //         EUser: ""
  //       }],
  //     "requestId": "6008",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     if (response.errorCode == 0) {
  //       if (response.results && response.results[0]) {
  //         this.ImgTypeDatalist = response.results[0];
  //         this.Mandatoryproofs = this.ImgTypeDatalist.filter(item => {
  //           return item.DocumentProofRequired == true
  //         })
  //         if (this.retrieveData.length > 0) {
  //           this.retrieveImagedata()
  //         }
  //       }
  //     }
  //   })
  // }
  retrieveImagedata() {
    this.retrieveData.forEach(element => {
      // element.DocnameText = this.ProofTypeList[this.ProofTypeList.findIndex(item => item.slno.toString() === element.DocName)].Document
      element.DocnameText = element.DocName
      element.Docdoc = element.ImgData
      element.Doctype = element.ImgType;
      this.SupportFiles.push(element);
    });
  }
  showModal(data) {
    // this.filePreiewContent = data.Docdoc
    // this.filePreiewFilename = data.DocName
    // this.filePreiewContentType = data.Doctype
    // this.filePreiewVisible = true;
    // var test = 'data:' + data.Doctype + ';base64,' + data.Docdoc
    // var _frame = document.createElement('iframe');
    // _frame.src = test
    // _frame.id = "preview"
    // _frame.style.width = "100%";
    // _frame.style.height = "100%";
    // this.externalWindow = window.open('','_blank','width=1000,height=600,left=200,top=200');
    // this.externalWindow.document.getElementsByTagName('body')[0].appendChild(_frame);

    this.filePreiewContent = {}
    this.filePreiewVisible = false
    this.fileSourceName = 'Proof'
    this.filePreiewContent = data
    this.filePreiewVisible = true
  }

  Deleterow(i) {
    this.SupportFiles.splice(i, 1)
  }
  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'image/jpeg' || file.type == 'image/png') {
      if (this.ImgTypeData == 'Photo') {
        const isLt5K = file.size / 1024 < 50
        if (!isLt5K) {
          this.notification.remove()
          this.notification.error('Image must smaller than 50KB!', '', { nzDuration: 1000 })
          return false;
        }
      }
      else {
        const isLt2M = file.size / 1024 < 1500
        if (!isLt2M) {
          this.notification.remove()
          this.notification.error('Image must smaller than 1500KB!', '', { nzDuration: 1000 })
          return false;
        }
      }
      this.encodeImageFileAsURL(file);
      return false;
    }
    // else if (file.type == 'application/pdf') {
    //   const isLt2Mder = file.size / 1024 < 1500
    //   if (!isLt2Mder) {
    //     this.notification.error('file must smaller than 1500KB!', '', { nzDuration: 1000 })
    //     return false;
    //   }
    //   this.encodeImageFileAsURL(file);
    //   return false;
    // }
    else {
      this.notification.remove()
      this.notification.error("Please uplaod jpeg/png", '', { nzDuration: 1000 })
      return false
    }
  }
  encodeImageFileAsURL(file) {
    let count = 0
    let notallowUpload = false
    let reader = new FileReader();
    this.ImgTypeData


    reader.onloadend = () => {
      var duplicatesindexes =[]
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      // PAN,DocName,DocImage,DocType,FileSize,EUser,ClStatusChangeSlNo
      this.Imglist = {
        // DocName: this.ImgTypeData,//DocName
        // DocNameText: this.ImgTypeData,//DocNameText
        // Docfile: file.name,//Docfile
        // DocType: file.type,//Doctype
        // Docuid: file.uid,//Docuid
        // FileSize: file.size,//Docsize
        // DocImage: document//Docdoc

        // DocName: this.ImgTypeData,
        // DocNameText: this.ImgTypeData,
        // Docfile: file.name,
        // ImgType: file.type,
        // Docuid: file.uid,
        // ImgLength: file.size,
        // ImgData: document//Docdoc
        DocName: this.ImgTypeData,
        DocNameText: this.ImgTypeData,
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document


      }
      var count =0

      for (var i = 0; i < this.SupportFiles.length; i++) {
        // if (this.SupportFiles[i].DocName == this.ImgTypeData) {
        //   this.index = i;
        // }
        if (this.SupportFiles[i].DocName.includes(this.ImgTypeData)) {
          // this.index = i;
          count++
          let r=/\d+/
          let match =this.SupportFiles[i].DocName.match(r)
          // console.log(match);
          if(match !==null)
          {
            let array=[]
            array =Object.values(match)
            let index =duplicatesindexes.length>0?duplicatesindexes.indexOf(Number(array[0])):-1
            if(index ==-1)
              duplicatesindexes.push(Number(array[0]))
          }
        }
      }
      setTimeout(() => {
        // if (this.index >= 0) {
        //   this.modalService.confirm({
        //     nzTitle: '<i>Confirmation</i>',
        //     nzContent: '<b>Are you sure want to Replace the file?</b>',
        //     nzOnOk: () => {
        //       this.SupportFiles[this.index] = this.Imglist
        //       this.index = -1;
        //     }
        //   });
        // }
        // else {
        //   this.SupportFiles.push(this.Imglist)
        //   this.Imglist = [];
        //   this.ImgTypeData = null;
        // }
        // console.log("duplicatesindexes :",duplicatesindexes);


        if (duplicatesindexes.length>0){
          var missing = [];

          for (var i = 2; i <= 5; i++) {
            if (duplicatesindexes.indexOf(i) == -1) {
              if(i!==1)
                missing.push(i);
            }
          }
          let missindex :number =-1
          missindex=missing.length>0?missing[0]:-1
          // console.log("missindex",missindex);

          if(missindex !==-1 )
          {
            // if(missindex !==1)
            // {
          this.Imglist.DocName+=" "+missindex
          this.SupportFiles.push(this.Imglist)
            // }
          }
          else{
            alert("You can not add more than 5 pages in one document")
          }
        }
        else
        {
          if(count ==1)
          {
            this.Imglist.DocName+=" 2"
          }
          this.SupportFiles.push(this.Imglist)
        }

          // console.log( this.SupportFiles,' this.SupportFiles')
          this.Imglist = [];
          this.ImgTypeData = null;
      }, 300);
    }
    reader.readAsDataURL(file);
  }
  checkUploads() {
    let isDoc = true
    // let isDocUploaded = true
    if (this.SupportFiles.length == 0) {
      this.notification.remove()
      this.notification.error('Please Upload Proofs', '',{ nzDuration: 3000 })
      return false
    }
    var proofarray = this.SupportFiles;
    // console.log("proofarray  :  ", proofarray);

    var notlisted: any = [];
    var mandatproofs = []

    if (!this.Type3disable) {
      /*
      this.type3proofofuploadlist[3].DocumentProofRequired = this.numOfNominees == 'Zero' ? true : false//nomineee
      this.type3proofofuploadlist[6].DocumentProofRequired = this.TradeCodeTransfer
      this.type3proofofuploadlist[15].DocumentProofRequired = this.add4.controls.fatca.value == 'USPerson' ? true : false//Us Person
*/
      // this.type1ortyp2proofofuploadlist[6].DocumentProofRequired =true//common email mobile
      mandatproofs = this.type3proofofuploadlist.filter(item => item.DocumentProofRequired);
      mandatproofs.forEach(element => {
        // isDocUploaded = false
        // proofarray.forEach(item => {
        //   if (element.Document == item.Docname || element.Document == item.DocName) {
        //     isDocUploaded = true;
        //     return
        //   }
        // })

        if(element.Document.includes('KRA CKYC form')){
          let index = 0
          // console.log(proofarray);
          index = proofarray.filter(item => item.DocName.includes('KRA CKYC form')).length
          // console.log(index);

          if(index<3)
          {
            notlisted.push(Number(element["slno"]))
          }
        }
        else if(element.Document.includes('Nomination form')){
          let index = 0
          // console.log("Nomination form",proofarray);
          index = proofarray.filter(item =>item.DocName.includes('Nomination form')).length
          // console.log(index);

          if(index<2)
          {
            notlisted.push(Number(element["slno"]))
          }
        }
        // else if(element.Document.includes("Demat account conversion form")){
        //   let index = 0
        //   console.log(proofarray);
        //   index = proofarray.filter(item => item.DocName.includes("Demat account conversion form")).length
        //   console.log(index);

        //   if(index<2)
        //   {
        //     notlisted.push(Number(element["slno"]))
        //   }
        // }
        else{
        let index = -1
        index = proofarray.findIndex(item => item.Docname == element.Document || item.DocName == element.Document)
        if (index == -1) {
          notlisted.push(Number(element["slno"]))
        }
      }
      });
    }
    else if (this.Type3disable) {
      /*this.type1ortyp2proofofuploadlist[2].DocumentProofRequired = this.numOfNominees == 'Zero' ? true : false//nominee
      this.type1ortyp2proofofuploadlist[5].DocumentProofRequired = this.TradeCodeTransfer
      */
      // this.type1ortyp2proofofuploadlist[8].DocumentProofRequired =true//common email mobile
      mandatproofs = this.type1ortyp2proofofuploadlist.filter(item => item.DocumentProofRequired);
      mandatproofs.forEach(element => {
        // isDocUploaded = false
        // proofarray.forEach(item => {
        //   if (element.Document == item.Docname || element.Document == item.DocName) {
        //     isDocUploaded = true;
        //     return
        //   }
        // })
        if(element.Document.includes('KRA CKYC form')){
          let index = 0
          // console.log(proofarray);
          index = proofarray.filter(item =>item.DocName.includes('KRA CKYC form')).length
          // console.log(index);

          if(index<3)
          {
            notlisted.push(Number(element["slno"]))
          }
        }
        else if(element.Document.includes('Nomination form')){
          let index = 0
          // console.log("Nomination form",proofarray);
          index = proofarray.filter(item =>item.DocName.includes('Nomination form')).length
          // console.log(index);

          if(index<2)
          {
            notlisted.push(Number(element["slno"]))
          }
        }
        else if(element.Document.includes("Demat account conversion form")){
          let index = 0
          // console.log(proofarray);
          index = proofarray.filter(item => item.DocName.includes("Demat account conversion form")).length
          // console.log(index);

          if(index<2)
          {
            notlisted.push(Number(element["slno"]))
          }
        }
        else{
        let index = -1
        index = proofarray.findIndex(item => item.Docname == element.Document || item.DocName == element.Document)
        if (index == -1) {
          notlisted.push(Number(element["slno"]))
        }
      }
      });


    }



    if (notlisted.length > 0) {
      // console.log(notlisted);
      let index3 = mandatproofs.findIndex(o => o.slno == notlisted[0])
      if (index3 != -1)
      {
        this.notification.remove()
        this.notification.error('Please Upload ' + mandatproofs[index3].Document, '',{ nzDuration: 3000 })
      }
      isDoc = false
    }
    else {
      isDoc = true;
    }
    return isDoc
    // if (isDoc) {
    //   return this.SupportFiles
    // }
    // else{
    //   return
    // }
    // let DocName = this.SupportFiles[0].DocName
    // let counter = 0;
    // let finalDocuments: any = JSON.stringify(this.SupportFiles)
    // finalDocuments = JSON.parse(finalDocuments)
    // for (let i = 0; i < finalDocuments.length; i++) {
    //   if (DocName == finalDocuments[i].DocName) {
    //     counter = counter + 1;
    //     finalDocuments[i].DocName = finalDocuments[i].DocName
    //   }
    //   else {
    //     DocName = finalDocuments[i].DocName
    //     counter = 1
    //     finalDocuments[i].DocName = finalDocuments[i].DocName
    //   }
    // }
    // let jsond = this.utilServ.setJSONArray(finalDocuments);
    // console.log("jsond : ",jsond);

    // let imageXmlData = jsonxml(jsond);
    // console.log("imageXmlData : ",imageXmlData);

    // return {
    //   DocName:this.SupportFiles[0].DocName,
    //   status: true,
    //   DocImage: this.SupportFiles[0].Docdoc,
    //   DocType: this.SupportFiles[0].Doctype,
    //   FileSize: this.SupportFiles[0].Docsize
    // }

    // obj: finalDocuments

    //         DocName: "Application Form1"
    // DocNameText: "Application Form1"
    // Docdoc: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgWFhYYG
    // Docfile: "dummy2.jfif"
    // Docsize: 9170
    // Doctype: "image/jpeg"
    // Docuid: "j3usn4mml3"


  }
  //upload function end

  //financial function start
  getfinancial() {

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

      if (response.results && response.results.length > 0) {
        if (response.results[10]) {
          this.pepSourceArray = response.results[10]
          // console.log(this.pepSourceArray);

        }
        if (response.results[11]) {
          this.annualIncomeSourceArray = response.results[11]
        }
        if (response.results[12]) {
          this.sourceoffund = response.results[12]
          // console.log("finance source of funds load");

        }
        if (response.results[13]) {
          this.occupationArray = response.results[13]
        }
      }
    })
  }
  NetworthChange(data) {
    var value = data.target.value
    if (value == null || value == 0 || value == undefined) {
      this.networthasvalue = true
      this.form_financial.controls.networthasondate.setValue(null)
      this.form_financial.controls.networth.setValue(0);
    }
    else {
      this.networthasvalue = false
      this.form_financial.controls.networthasondate.setValue(null)
      // this.form_financial.controls.networthasondate.setValidators([Validators.required])
    }
  }
  showinput(data) {
    let datafund = this.sourceoffund;
//     console.log("datafund ",datafund);
// console.log("data : ",data);

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
  financialcharrestrict(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9 .,/()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }
  showOccupation(data) {
    // console.log("showOccupation : ",data);

    if (data == 'AGRICULTURALIST' || data == 'HOUSEWIFE' || data == 'RETIRED') {
      this.isOccupdetails = false;
      this.form_financial.controls.organisation.setValue('');
      this.form_financial.controls.designation.setValue('');
      this.form_financial.controls.nameofemployer.setValue('');
      this.form_financial.controls.officeaddress1.setValue('');
      this.form_financial.controls.officeaddress2.setValue('');
      this.form_financial.controls.officeaddress3.setValue('');
      this.form_financial.controls.offpin.setValue('');
      this.form_financial.controls.phone.setValue('');
      this.form_financial.controls.email.setValue('');
      this.form_financial.controls.mobile.setValue('');
    }
    else {
      this.isOccupdetails = true;
    }
  }
  charrestrictfinancial(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9,/ -()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }

  ValidatePanfinancial(val) {
    // console.log(val);

    var charonly = /^[A-Z]+$/
    var numonly = /^[0-9]+$/
    // console.log("val.currentTarget.value : ",val.currentTarget.value);
    // console.log("val.target.selectionStart :",val.target.selectionStart);
    // console.log("val.target.selectionStart type : ",typeof val.target.selectionStart );

    // val.currentTarget.value.length
    var fullstring = val.currentTarget.value
    var text = val.key
    // console.log(text);

    if (val.target.selectionStart <= 4) {
      // console.log("1");
      // console.log(charonly.test(text));

      return charonly.test(text)

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      // console.log("2");
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      // console.log("3");
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      // console.log("4");
      return false;
    }
  }
  Setdemat(data, item, i) {//  MOd:aksa

    // console.log("i", item, i);
    this.text = data
    // console.log(this.text);


    this.data1 = data;

    if (data.length == 16) {
      // debugger
      // this.notif.error('Please enter valid dpclientid', '');

    }
  }
  SetProofFields(number, val) {
    // console.log("number: ",number);
    // console.log("val : ",val);


    // console.log(this.nomineeIdentificationArray);
    // console.log(this.Nominee1Fields);

    // console.log(this.cmServ.getControls(this.Prooffields, val));
    // console.log(this.Prooffields);


    // console.log(val);
    this.showtext1 = false;
    this.showtext2 = false;
    this.showtext3 = false;
    this.showtext4 = false;
    this.showtext5 = false;
    this.showtext6 = false;
    // this.showtext2=false;//  MOd:aksa
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

  //financial function end




  //bank functions start
  // private createBank() {
  //   return this.fb.group({
  //     // bank: [null, [Validators.required]],
  //     clntname: [null, [Validators.required]],
  //     bankAcType: [null, [Validators.required]],
  //     modeOfOperation: [null],
  //     ifscCode: [null, [Validators.required]],
  //     bankname: [null, [Validators.required]],
  //     address: [null, [Validators.required]],
  //     micr: [null],
  //     country: [null, [Validators.required]],
  //     state: [null, [Validators.required]],
  //     city: [null, [Validators.required]],
  //     pin: [null, [Validators.required]],
  //     accntNumber: [null, [Validators.required]],
  //     confrmAccntNumber: [null, [Validators.required]],
  //     oft: [null],
  //     rbirefNo: [null],
  //     rbiapprvldt: [null],
  //     BankAddoption: [null],
  //     pisBank: [null]
  //   })
  // }
  // CreateRejectionForm() {
  //   return this.fb.group({
  //     AppRemarks: [null],
  //     RejRemarks: [null]
  //   })
  // }
  getbankdropdown() {
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
        console.log("this.tradingBankAccType=", this.tradingBankAccType);

        // this.dpBankAccType = response.results[4]
        // this.debitBankAccType = response.results[5]
        this.ModeOfOperation = response.results[0]
        this.pisBankList = response.results[6]
        // this.Currency = response.results[7]
        this.countryArray = response.results[9]
      }


    });
  }
  bankcharrestrict(val) {
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

        this.form_bank.controls.bankname.setValue(data.BANK_NAME);
        this.form_bank.controls.address.setValue(data.ADDRESS);
        this.form_bank.controls.micr.setValue(data.MICR);
        this.form_bank.controls.state.setValue(data.STATE);
        this.form_bank.controls.city.setValue(data.BRANCH_NAME);
        this.form_bank.controls.country.setValue(data.COUNTRY);
        this.form_bank.controls.pin.setValue(data.Pincode);
        this.form_bank.controls.oft.setValue(data.oft ? 'Y' : 'N');
      }
    })
  }
  CheckCountryvalid(val) {

    // let mBank: any = this.form_bank.controls.masterBank
    var value = val.target.value

    var ind = this.resultArray.findIndex(item => item.Country == value)
    if (ind == -1) {
      this.form_bank.controls["country"].setValue(null)
    }

  }
  bankformvalidation() {
    if ((Number(this.krakyc.NREClnt) != 0) && (this.form_bank.value.BankAddoption == 0)) {
      this.hidRbidetails = false
      // this.SetValidationRbi()
    }
    else {
      this.hidRbidetails = true;
      // this.SetValidationRbi()
    }
    let isValid = this.validServ.validateForm(this.form_bank, {});//this.FormControlNames);
    if (isValid) {
      let accnoValid = this.CheckAccountNumber()
      if (!accnoValid) {
        return
      }
      // let proofvalid
      // if (action == 'savefinalise') {
      //   proofvalid = this.ValidatebankProof()
      // } else {
      //   proofvalid = true
      // }
      // if (proofvalid) {
    }

  }
  // SetValidationRbi() {

  //   let mBank: any = this.form_bank.controls.masterBank
  //   if (!this.hidRbidetails) {
  //     mBank.controls["rbirefNo"].setValidators(Validators.required);
  //     mBank.controls["pisBank"].setValidators(Validators.required);
  //     mBank.controls["rbiapprvldt"].setValidators(Validators.required);
  //     mBank.controls["rbiapprvldt"].updateValueAndValidity();
  //     mBank.controls["rbirefNo"].updateValueAndValidity();
  //     mBank.controls["pisBank"].updateValueAndValidity();
  //   }
  //   else {
  //     mBank.controls["rbirefNo"].setValidators(null);
  //     mBank.controls["pisBank"].setValidators(null);
  //     mBank.controls["rbiapprvldt"].setValidators(null);
  //     mBank.controls["rbiapprvldt"].updateValueAndValidity();
  //     mBank.controls["rbirefNo"].updateValueAndValidity();
  //     mBank.controls["pisBank"].updateValueAndValidity();
  //   }

  // }
  CheckAccountNumber() {

    let accnmber: any = this.form_bank.controls.masterBank
    accnmber.controls.accntNumber
    if (accnmber.controls.confrmAccntNumber.value != accnmber.controls.accntNumber.value) {
      this.notification.remove()
      this.notification.error('Account number missmatch', '',{ nzDuration: 3000 })
      accnmber.controls.confrmAccntNumber.dirty;
      return false;
    }
    return true;

  }
  //bank functions end
  //nominee function start
  nomineeinitialize() {
    this.nomineeForm1 = this.form_nominee.controls.firstNomineeDetails;
    this.nomineeForm2 = this.form_nominee.controls.SecondNomineeDetails;
    this.nomineeForm3 = this.form_nominee.controls.ThirdNomineeDetails;
    this.numOfNominees = "One"


    this.NomineeList = [{ "key": 1, "value": "First Nominee" }]
  }
  createFirstHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null, [Validators.required]],
      nomineeFirstName: [null, [Validators.required]],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      //nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null, [Validators.required]],
      nomineeHouseName: [null, [Validators.required]],
      nomineeHouseNumber: [null],//mod aksa
      nomineeStreet: [null], //mod aksa
      nomineePin: [null, [Validators.required]],
      nomineeCity: [null, [Validators.required]],
      nomineeState: [null, [Validators.required]],
      BOCategory: [null],
      nomineeCountry: [null, [Validators.required]],
      isdCodeMobile: [null],
      nomineeMobile: [null],
      isdCodeTelephone: [null],
      // , [Validators.required]
      stdCodetelephone: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      sharePercentage: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      nomineeDOB: [null],

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
    })
  }

  // createSecondHolderDetails() {
  //   return this.fb.group({
  //     nomineeTitle: [null],
  //     nomineeFirstName: [null],
  //     nomineeMiddleName: [null],
  //     nomineeLastName: [null],
  //     // nomineeResidualshares: [null],
  //     nomineeRelationshipwithapplicant: [null],
  //     nomineeHouseName: [null],
  //     nomineeHouseNumber: [null],
  //     nomineeStreet: [null],
  //     nomineePin: [null],
  //     nomineeCity: [null],
  //     nomineeState: [null],
  //     BOCategory: [null],
  //     nomineeCountry: [null],
  //     isdCodeMobile: [null],
  //     nomineeMobile: [null],
  //     isdCodeTelephone: [null],
  //     stdCodetelephone: [null],
  //     nomineeTelephoneNumber: [null],
  //     nomineeEmailID: [null],
  //     sharePercentage: [null],
  //     nomineeNomineeIdentificaitonDetails: [null],
  //     nomineeDOB: [null],

  //     guardianTitle: [null],
  //     guardianFirstName: [null],
  //     guardianMiddleName: [null],
  //     guardianLastName: [null],
  //     guardianRelationshipofGuardian: [null],
  //     guardianHouseName: [null],
  //     guardianHouseNumber: [null],
  //     guardianStreet: [null],
  //     guardianPin: [null],
  //     guardianCity: [null],
  //     guardianState: [null],
  //     guardianCountry: [null],
  //     guardianTelephoneNumber: [null],
  //     guardianMobile: [null],
  //     guardianEmailID: [null],
  //     guardianIdentificaitonDetails: [null],
  //   })
  // }

  // createThirdHolderDetails() {
  //   return this.fb.group({
  //     nomineeTitle: [null],
  //     nomineeFirstName: [null],
  //     nomineeMiddleName: [null],
  //     nomineeLastName: [null],
  //     // nomineeResidualshares: [null],
  //     nomineeRelationshipwithapplicant: [null],
  //     nomineeHouseName: [null],
  //     nomineeHouseNumber: [null],
  //     nomineeStreet: [null],
  //     nomineePin: [null],
  //     nomineeCity: [null],
  //     nomineeState: [null],
  //     BOCategory: [null],
  //     nomineeCountry: [null],
  //     isdCodeMobile: [null],
  //     nomineeMobile: [null],
  //     isdCodeTelephone: [null],
  //     stdCodetelephone: [null],
  //     nomineeTelephoneNumber: [null],
  //     nomineeEmailID: [null],
  //     sharePercentage: [null],
  //     nomineeNomineeIdentificaitonDetails: [null],
  //     nomineeDOB: [null],

  //     guardianTitle: [null],
  //     guardianFirstName: [null],
  //     guardianMiddleName: [null],
  //     guardianLastName: [null],
  //     guardianRelationshipofGuardian: [null],
  //     guardianHouseName: [null],
  //     guardianHouseNumber: [null],
  //     guardianStreet: [null],
  //     guardianPin: [null],
  //     guardianCity: [null],
  //     guardianState: [null],
  //     guardianCountry: [null],
  //     guardianTelephoneNumber: [null],
  //     guardianMobile: [null],
  //     guardianEmailID: [null],
  //     guardianIdentificaitonDetails: [null],
  //   })
  // }

  // CreateRejectionForm(){}
  SetNomineeNumber(value) {

    switch (value) {
      case "One":
        {
          this.isDisabled = true;
          this.form_nominee.controls.nomineeEqualShareForNominess.setValue(false);
          // this.form.controls.nomineeEqualShareForNominess['value']=false
          // this.form.controls.nomineeEqualShareForNominess.disable();
          // this.OnChangeEquelShare(false)
          this.dsNominee2 = true
          this.dsNominee3 = true
          this.NomineeList = [{ "key": 1, "value": "First Nominee" }]
          this.form_nominee.controls.tradeNominee.patchValue(1)
          break;
        }
      case "Two": {
        this.isDisabled = false;
        this.dsNominee2 = false
        this.dsNominee3 = true
        this.NomineeList = [{ "key": 1, "value": "First Nominee" }, { "key": 2, "value": "Second Nominee" }]
        this.form_nominee.controls.tradeNominee.patchValue(1)
        break;
      }
      case "Three": {
        this.isDisabled = false;
        this.dsNominee2 = false
        this.dsNominee3 = false
        this.NomineeList = [{ "key": 1, "value": "First Nominee" }, { "key": 2, "value": "Second Nominee" }, { "key": 3, "value": "Third Nominee" }]
        this.form_nominee.controls.tradeNominee.patchValue(1)
        break;
      }
      case "Zero": {

        break;
      }
    }
    this.SetValidators(value)
  }
  SetValidators(Nominee) {

    let nominee2: any = this.form_nominee.controls.SecondNomineeDetails;
    let nominee3: any = this.form_nominee.controls.ThirdNomineeDetails;
    if (Nominee == "Two") {
      nominee2.controls["nomineeTitle"].setValidators(Validators.required);
      nominee2.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee2.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee2.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseName"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
      // nominee2.controls["nomineeStreet"].setValidators(Validators.required);
      nominee2.controls["nomineePin"].setValidators(Validators.required);
      nominee2.controls["nomineeCity"].setValidators(Validators.required);
      nominee2.controls["nomineeState"].setValidators(Validators.required);
      nominee2.controls["nomineeCountry"].setValidators(Validators.required);
      nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

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
      nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

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
      nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

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
      nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

    } else if (Nominee == "Three") {
      nominee2.controls["nomineeTitle"].setValidators(Validators.required);
      nominee2.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee2.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee2.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseName"].setValidators(Validators.required);
      nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
      // nominee2.controls["nomineeStreet"].setValidators(Validators.required);
      nominee2.controls["nomineePin"].setValidators(Validators.required);
      nominee2.controls["nomineeCity"].setValidators(Validators.required);
      nominee2.controls["nomineeState"].setValidators(Validators.required);
      nominee2.controls["nomineeCountry"].setValidators(Validators.required);
      nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

      nominee3.controls["nomineeTitle"].setValidators(Validators.required);
      nominee3.controls["nomineeFirstName"].setValidators(Validators.required);
      // nominee3.controls["nomineeLastName"].setValidators(Validators.required);
      // if(this.enbleCDSL){
      //   nominee3.controls["nomineeResidualshares"].setValidators(Validators.required);
      // }
      nominee3.controls["nomineeRelationshipwithapplicant"].setValidators(Validators.required);
      nominee3.controls["nomineeHouseName"].setValidators(Validators.required);
      nominee3.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
      //  nominee3.controls["nomineeStreet"].setValidators(Validators.required);
      nominee3.controls["nomineePin"].setValidators(Validators.required);
      nominee3.controls["nomineeCity"].setValidators(Validators.required);
      nominee3.controls["nomineeState"].setValidators(Validators.required);
      nominee3.controls["nomineeCountry"].setValidators(Validators.required);
      nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

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
      nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

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
      nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();
    }
    // else {
    //   nominee2.controls["nomineeTitle"].setValidators(null);
    //   nominee2.controls["nomineeFirstName"].setValidators(null);
    //   // nominee2.controls["nomineeLastName"].setValidators(null);
    //   //nominee2.controls["nomineeResidualshares"].setValidators(null);
    //   nominee2.controls["nomineeRelationshipwithapplicant"].setValidators(null);
    //   nominee2.controls["nomineeHouseName"].setValidators(null);
    //   nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa

    //   // nominee2.controls["nomineeStreet"].setValidators(null);
    //   nominee2.controls["nomineePin"].setValidators(null);
    //   nominee2.controls["nomineeCity"].setValidators(null);
    //   nominee2.controls["nomineeState"].setValidators(null);
    //   nominee2.controls["nomineeCountry"].setValidators(null);
    //   nominee2.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

    //   nominee3.controls["nomineeTitle"].setValidators(null);
    //   nominee3.controls["nomineeFirstName"].setValidators(null);
    //   // nominee3.controls["nomineeLastName"].setValidators(null);
    //   // nominee3.controls["nomineeResidualshares"].setValidators(null);
    //   nominee3.controls["nomineeRelationshipwithapplicant"].setValidators(null);
    //   nominee3.controls["nomineeHouseName"].setValidators(null);
    //   nominee3.controls["nomineeHouseNumber"].setValidators(null);// mod aksa
    //   // nominee3.controls["nomineeStreet"].setValidators(null);
    //   nominee3.controls["nomineePin"].setValidators(null);
    //   nominee3.controls["nomineeCity"].setValidators(null);
    //   nominee3.controls["nomineeState"].setValidators(null);
    //   nominee3.controls["nomineeCountry"].setValidators(null);
    //   nominee3.controls["nomineeNomineeIdentificaitonDetails"].setValidators(null);

    //   nominee2.controls["nomineeTitle"].updateValueAndValidity();
    //   nominee2.controls["nomineeFirstName"].updateValueAndValidity();
    //   // nominee2.controls["nomineeLastName"].updateValueAndValidity();
    //   // nominee2.controls["nomineeResidualshares"].updateValueAndValidity();
    //   nominee2.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
    //   nominee2.controls["nomineeHouseName"].updateValueAndValidity();
    //   nominee2.controls["nomineeHouseNumber"].setValidators(null);//mod aksa
    //   //  nominee2.controls["nomineeStreet"].updateValueAndValidity();
    //   nominee2.controls["nomineePin"].updateValueAndValidity();
    //   nominee2.controls["nomineeCity"].updateValueAndValidity();
    //   nominee2.controls["nomineeCountry"].updateValueAndValidity();
    //   nominee2.controls["nomineeState"].updateValueAndValidity();
    //   nominee2.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

    //   nominee3.controls["nomineeTitle"].updateValueAndValidity();
    //   nominee3.controls["nomineeFirstName"].updateValueAndValidity();
    //   // nominee3.controls["nomineeLastName"].updateValueAndValidity();
    //   // nominee3.controls["nomineeResidualshares"].updateValueAndValidity();
    //   nominee3.controls["nomineeRelationshipwithapplicant"].updateValueAndValidity();
    //   nominee3.controls["nomineeHouseName"].updateValueAndValidity();
    //   nominee3.controls["nomineeHouseNumber"].updateValueAndValidity();//mod aksa
    //   // nominee3.controls["nomineeStreet"].updateValueAndValidity();
    //   nominee3.controls["nomineePin"].updateValueAndValidity();
    //   nominee3.controls["nomineeCity"].updateValueAndValidity();
    //   nominee3.controls["nomineeCountry"].updateValueAndValidity();
    //   nominee3.controls["nomineeState"].updateValueAndValidity();
    //   nominee3.controls["nomineeNomineeIdentificaitonDetails"].updateValueAndValidity();

    // }
  }
  getnomineerelationshipdropdown() {

    this.form_nominee.controls.tradeNominee.patchValue(1)
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
        this.nomineeRelationArray = response.results[7]
        this.nomineeIdentificationArray = response.results[8]
        this.CountrycodeArray = response.results[5];
        this.Prooffields = response.results[3];
        // console.log(this.Prooffields);
        // console.log(response.results[3]);


        // console.log(this.nomineeForm1);
        if (!this.fromReportPoolPage)
          this.form_nominee.controls.nomineeEqualShareForNominess.setValue(false);
        this.nomineeForm1.controls.isdCodeMobile.setValue('091');
        this.nomineeForm2.controls.isdCodeMobile.setValue('091');
        this.nomineeForm3.controls.isdCodeMobile.setValue('091');

        this.nomineeForm1.controls.isdCodeTelephone.setValue('091');
        this.nomineeForm2.controls.isdCodeTelephone.setValue('091');
        this.nomineeForm3.controls.isdCodeTelephone.setValue('091');

        if (this.applicationStatus == 'T' || this.applicationStatus == 'P' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
          this.FillApproveData();
        }

      }
    })


  }
  FillApproveData() {
    var dataforapprove = this.dataforaprove[0];
    this.IDNO = dataforapprove.Request_IDNO
    this.SerialNumber = dataforapprove.Request_IDNO;
    let nominee1: any = this.form_nominee.controls.firstNomineeDetails;
    let nominee2: any = this.form_nominee.controls.SecondNomineeDetails;
    let nominee3: any = this.form_nominee.controls.ThirdNomineeDetails;
    //! let rejection: any = this.form_nominee.controls.Rejection;

    this.form_nominee.controls.nomineeEqualShareForNominess.setValue(dataforapprove.SharepercEqual == 'true' ? true : false);
    // disable begin
    // nominee1.controls.nomineeTitle.disable()
    this.disableFields();
    // disable end
    if (dataforapprove.T_nomineeTitle && dataforapprove.T_nomineeFirstName) {
      this.dsNominee2 = false;
      this.dsNominee3 = false;
      this.numOfNominees = "Three"
      this.SetNomineeNumber('Three');
    }
    else if (dataforapprove.S_nomineeTitle && dataforapprove.S_nomineeFirstName) {
      this.dsNominee2 = false;
      this.dsNominee3 = true;
      this.numOfNominees = "Two"
      this.SetNomineeNumber('Two');
    }
    else {
      this.dsNominee2 = true;
      this.dsNominee3 = true;
      this.numOfNominees = "One"
      this.SetNomineeNumber('One');
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
    // nominee3.controls.guardianIdentificaitonDetails.setValue(dataforapprove.T_guardianIdentificaitonDetails)
    // nominee3.controls.guardianAaadhar.setValue(dataforapprove.T_guardianAaadhar)
    // nominee3.controls.guardianPAN.setValue(dataforapprove.T_guardianPAN)
    var Nomineeproof3 = { "nomineeproof30": dataforapprove.T_nomineeproof0, "nomineeproof31": dataforapprove.T_nomineeproof1, "nomineeproof32": dataforapprove.T_nomineeproof2, "nomineeproof33": dataforapprove.T_nomineeproof3 }
    var Gadianproof3 = { "guardianproof30": dataforapprove.T_guardianproof0, "guardianproof31": dataforapprove.T_guardianproof1, "guardianproof32": dataforapprove.T_guardianproof2, "guardianproof33": dataforapprove.T_guardianproof3 }
    this.patchNominee3Data(dataforapprove.T_nomineeNomineeIdentificaitonDetails, Nomineeproof3);
    this.patchGardian3Data(dataforapprove.T_guardianIdentificaitonDetails, Gadianproof3);
    // rejection.controls.RejRemarks.setValue(dataforapprove.RejectedReason);
    /* ! if (this.applicationStatus == 'A') {
       rejection.controls.AppRemarks.setValue(dataforapprove.RejectedReason)
     }
     else {
       rejection.controls.RejRemarks.setValue(dataforapprove.RejectedReason);
     } */
    this.form_nominee.controls.tradeNominee.patchValue(dataforapprove.TradingNominee)
    // this.form.controls.tradeNominee.patchValue(2)
  }
  OnChangeEquelShare(value) {
    // console.log(value);

    if (value == true) {
      this.nomineeForm1.controls.sharePercentage.setValue(0)
      this.nomineeForm2.controls.sharePercentage.setValue(0)
      this.nomineeForm3.controls.sharePercentage.setValue(0)

      this.nomineeForm1.controls.sharePercentage.disable();
      this.nomineeForm2.controls.sharePercentage.disable();
      this.nomineeForm3.controls.sharePercentage.disable();
      this.SetResidualValidators(true);

    }
    else {
      this.nomineeForm1.controls.sharePercentage.enable();
      this.nomineeForm2.controls.sharePercentage.enable();
      this.nomineeForm3.controls.sharePercentage.enable();
      this.SetResidualValidators(false);

    }
  }
  SetResidualValidators(data) {
    let nominee1: any = this.form_nominee.controls.firstNomineeDetails;
    if (data) {
      this.residualValidator = true;
    }
    else {
      this.residualValidator = false;
    }
  }
  disableFields() {

    let nominee1: any = this.form_nominee.controls.firstNomineeDetails;
    let nominee2: any = this.form_nominee.controls.SecondNomineeDetails;
    let nominee3: any = this.form_nominee.controls.ThirdNomineeDetails;
    if ((this.applicationStatus == 'P') || this.applicationStatus == 'F' || this.applicationStatus == 'T' || this.applicationStatus == 'A') {

      this.numOfNomineesdisable = true;
      this.form_nominee.controls.nomineeEqualShareForNominess.disable();
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
      this.form_nominee.controls.tradeNominee.disable();
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
  verify(data) {//  MOd:aksa


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          dpclientid: this.DPAccountNumber,
          Euser: this.currentUser.userCode


        }],
      "requestId": "6026",
      "outTblCount": "0"
    })
      .then((response) => {

        // console.log(response);

        //let data1 = response
        // console.log("result", response.results[0][0]);
        // console.log("res2", response.results[0][0][0]);


        // console.log("data", response.results[0][0].Firstholdername);


        if (response.results[0][0].errorCode && response.results[0][0].errorCode == -1) {
          debugger
          this.notification.remove()
          this.notification.error(response.results[0][0].errorMessage, '',{ nzDuration: 3000 })

          return
        }

        if (!response.results[0][0].Firstholdername) {
          debugger
          this.notification.remove()
          this.notification.warning('Please upload demat account cml file', '',{ nzDuration: 3000 });
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
        //   this.iction.error('Please enter valid dpclientid', '');

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
    // console.log("full", fullstring);
    // console.log("inp", inp);
    // console.log("length", fullstring.length);



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
  CheckMinor(Nomine, input) {
    let nominee1: any = this.form_nominee.controls.firstNomineeDetails;
    let nominee2: any = this.form_nominee.controls.SecondNomineeDetails;
    let nominee3: any = this.form_nominee.controls.ThirdNomineeDetails;
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
        nominee1.controls["guardianTitle"].setValidators(Validators.required);
        nominee1.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee1.controls["guardianLastName"].setValidators(Validators.required);
        nominee1.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee1.controls["guardianHouseName"].setValidators(Validators.required);
        nominee1.controls["guardianStreet"].setValidators(null);
        nominee1.controls["guardianPin"].setValidators(Validators.required);
        nominee1.controls["guardianCity"].setValidators(Validators.required);
        nominee1.controls["guardianState"].setValidators(Validators.required);
        nominee1.controls["guardianCountry"].setValidators(Validators.required);
      }
      else {
        this.gardian1 = false;
        nominee1.controls["guardianTitle"].setValidators(null);
        nominee1.controls["guardianFirstName"].setValidators(null);
        // nominee1.controls["guardianLastName"].setValidators(null);
        nominee1.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee1.controls["guardianHouseName"].setValidators(null);
        nominee1.controls["guardianStreet"].setValidators(null);
        nominee1.controls["guardianPin"].setValidators(null);
        nominee1.controls["guardianCity"].setValidators(null);
        nominee1.controls["guardianState"].setValidators(null);
        nominee1.controls["guardianCountry"].setValidators(null);
      }
      nominee1.controls["guardianTitle"].updateValueAndValidity();
      nominee1.controls["guardianFirstName"].updateValueAndValidity();
      // nominee1.controls["guardianLastName"].updateValueAndValidity();
      nominee1.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee1.controls["guardianHouseName"].updateValueAndValidity();
      nominee1.controls["guardianStreet"].updateValueAndValidity();
      nominee1.controls["guardianPin"].updateValueAndValidity();
      nominee1.controls["guardianCity"].updateValueAndValidity();
      nominee1.controls["guardianState"].updateValueAndValidity();
      nominee1.controls["guardianCountry"].updateValueAndValidity();
    }
    if (Nomine == "Second") {

      if (age < 18) {
        this.gardian2 = true;
        nominee2.controls["guardianTitle"].setValidators(Validators.required);
        nominee2.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee2.controls["guardianLastName"].setValidators(Validators.required);
        nominee2.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee2.controls["guardianHouseName"].setValidators(Validators.required);
        nominee2.controls["guardianStreet"].setValidators(null);
        nominee2.controls["guardianPin"].setValidators(Validators.required);
        nominee2.controls["guardianCity"].setValidators(Validators.required);
        nominee2.controls["guardianState"].setValidators(Validators.required);
        nominee2.controls["guardianCountry"].setValidators(Validators.required);
      }
      else {
        this.gardian2 = false;
        nominee2.controls["guardianTitle"].setValidators(null);
        nominee2.controls["guardianFirstName"].setValidators(null);
        // nominee2.controls["guardianLastName"].setValidators(null);
        nominee2.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee2.controls["guardianHouseName"].setValidators(null);
        nominee2.controls["guardianStreet"].setValidators(null);
        nominee2.controls["guardianPin"].setValidators(null);
        nominee2.controls["guardianCity"].setValidators(null);
        nominee2.controls["guardianState"].setValidators(null);
        nominee2.controls["guardianCountry"].setValidators(null);
      }
      nominee2.controls["guardianTitle"].updateValueAndValidity();
      nominee2.controls["guardianFirstName"].updateValueAndValidity();
      // nominee2.controls["guardianLastName"].updateValueAndValidity();
      nominee2.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee2.controls["guardianHouseName"].updateValueAndValidity();
      nominee2.controls["guardianStreet"].updateValueAndValidity();
      nominee2.controls["guardianPin"].updateValueAndValidity();
      nominee2.controls["guardianCity"].updateValueAndValidity();
      nominee2.controls["guardianState"].updateValueAndValidity();
      nominee2.controls["guardianCountry"].updateValueAndValidity();
    }
    if (Nomine == "Third") {

      if (age < 18) {
        this.gardian3 = true;
        nominee3.controls["guardianTitle"].setValidators(Validators.required);
        nominee3.controls["guardianFirstName"].setValidators(Validators.required);
        // nominee3.controls["guardianLastName"].setValidators(Validators.required);
        nominee3.controls["guardianRelationshipofGuardian"].setValidators(Validators.required);
        nominee3.controls["guardianHouseName"].setValidators(Validators.required);
        nominee3.controls["guardianStreet"].setValidators(null);
        nominee3.controls["guardianPin"].setValidators(Validators.required);
        nominee3.controls["guardianCity"].setValidators(Validators.required);
        nominee3.controls["guardianState"].setValidators(Validators.required);
        nominee3.controls["guardianCountry"].setValidators(Validators.required);
      }
      else {
        this.gardian3 = false;
        nominee3.controls["guardianTitle"].setValidators(null);
        nominee3.controls["guardianFirstName"].setValidators(null);
        // nominee3.controls["guardianLastName"].setValidators(null);
        nominee3.controls["guardianRelationshipofGuardian"].setValidators(null);
        nominee3.controls["guardianHouseName"].setValidators(null);
        nominee3.controls["guardianStreet"].setValidators(null);
        nominee3.controls["guardianPin"].setValidators(null);
        nominee3.controls["guardianCity"].setValidators(null);
        nominee3.controls["guardianState"].setValidators(null);
        nominee3.controls["guardianCountry"].setValidators(null);
      }
      nominee3.controls["guardianTitle"].updateValueAndValidity();
      nominee3.controls["guardianFirstName"].updateValueAndValidity();
      // nominee3.controls["guardianLastName"].updateValueAndValidity();
      nominee3.controls["guardianRelationshipofGuardian"].updateValueAndValidity();
      nominee3.controls["guardianHouseName"].updateValueAndValidity();
      nominee3.controls["guardianStreet"].updateValueAndValidity();
      nominee3.controls["guardianPin"].updateValueAndValidity();
      nominee3.controls["guardianCity"].updateValueAndValidity();
      nominee3.controls["guardianState"].updateValueAndValidity();
      nominee3.controls["guardianCountry"].updateValueAndValidity();
    }
  }
  Reject() {

    // if (this.RegectionReason == '' || this.RegectionReason == undefined) {
    //   this.notification.error('Remark is required', '')
    //   return;
    // }
    if (!this.Remarksenable || this.RejectionReason === '') {
      this.Remarksenable = true
      this.notification.remove()
      this.notification.error('You should provide remarks ', '',{ nzDuration: 3000 })
      return
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to Reject with Remark <br>"<b><i>' + this.RejectionReason + '"</i>?</b>',
      nzOnOk: () => {
        this.isSpining = true;
        let serialnumber =this.fromReportPoolPage?this.serielno:this.ClStatusChangeSlNo
        this.dataServ.getResultArray(
          {
            "batchStatus": "false",
            "detailArray":
              [{
                "EUser": this.currentUser.userCode,
                "EName": this.currentUser.firstname,
                "CurrentStatus": "R",//this.applicationStatus,
                "FileDataJson": {},
                "IOrU": this.ioru,
                "ClStatusChangeSlNo": serialnumber,
                "UploadedFileData": [],
                "Remarks": this.RejectionReason
              }],
            "requestId": "700150"//"700150"//"700212",//700150
          }
        ).then((response) => {
          if (response.errorCode == 0) {
            this.isSpining = false
            this.notification.remove()
            this.notification.success('Successfully Rejected', '',{ nzDuration: 3000 });
            let ind = this.wsServ.workspaces.findIndex(item => item.type == "statusconversion")
            if (ind !== -1)
              this.wsServ.removeWorkspace(ind);

          }
          else {
            this.isSpining = false;
            this.notification.remove()
            this.notification.error(response.errorMsg, '',{ nzDuration: 3000 });
          }
        })
      }
    });
  }
  validateAccountNumber() {
    // console.log(this.form_bank);
    // console.log(this.form_bank.controls.accntNumber.value);
    // console.log(this.form_bank.controls.confrmAccntNumber.value);
    if (this.form_bank.controls.confrmAccntNumber.value == null || this.form_bank.controls.confrmAccntNumber.value == '') {
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Bank confirm account number is required</b>',
        // nzOnOk: () => {
        //   return false
        // }
      })
      return false
    }
    if (this.form_bank.controls.accntNumber.value !== this.form_bank.controls.confrmAccntNumber.value) {
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Bank account number mismatch</b>',
        // nzOnOk: () => {
        //   return false
        // }
      })
      return false
    }
    return true
  }
  Approve() {
    // let Remarks = this.Remarks !== '' ? true : false
    // if (!Remarks) {
    //   this.notification.error('Remark is required', '');
    //   return
    // }
    if (!this.AppRemarksenable || this.Remarks === '') {
      this.AppRemarksenable = true
      this.notification.remove()
      this.notification.error('You should provide remarks ', '',{ nzDuration: 3000 })
      return
    }
    let reason: any = ''//! this.form_nominee.controls.Rejection.value.AppRemarks;;
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to approve with Remark <br>"<b><i>' + this.Remarks + '"</i>?</b>',
      nzOnOk: () => {
        let valid = this.validateAccountNumber()
        if (valid) {
          this.isSpining = true;
          this.dataServ.getResultArray(

            {
              "batchStatus": "false",
              "detailArray":
                [{
                  "EUser": this.currentUser.userCode,
                  "EName": this.currentUser.firstname,
                  "CurrentStatus": "A",//this.applicationStatus,
                  "FileDataJson": {},
                  "IOrU": this.ioru,
                  "ClStatusChangeSlNo": this.serielno,
                  "UploadedFileData": [],
                  "Remarks": this.Remarks
                }],
              "requestId": "700150"//"700212",//700150
            }
          ).then((response) => {
            if (response.errorCode == 0) {
              this.isSpining = false
              this.CurrentStatus = 'A'
              this.notification.remove()
              this.notification.success('Successfully Verified', '',{ nzDuration: 3000 });
              this.firstTabView = false
              this.fisttabcompleted = false
              this.AllFormEnable = false
              this.activeTabIndex = 2
              this.isSpining = false
              this.thirdtabdisable = false
              this.secondTabCompleted = true
              this.secondtabdisable = false
              if (this.CurrentStatus == 'A') {


                this.GetSpForThreeValidationHO()
              }
            }
            else {
              this.isSpining = false;
              this.notification.remove()
              this.notification.error(response.errorMsg, '',{ nzDuration: 3000 });
            }
            ///////// this.Crf.edittabtitle = "";
            ///////////// this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
            ////////////// this.Crf.onviewReset();
            // this.img.ResetUploads();

          })
        }
      }
    });
  }

  Nominee() {


  }
  getPinDataNominee(data, type) {
    let nomineeForm1: any = this.form_nominee.controls.firstNomineeDetails;
    let nomineeForm2: any = this.form_nominee.controls.SecondNomineeDetails;
    let nomineeForm3: any = this.form_nominee.controls.ThirdNomineeDetails;
    if (data == null) {
      return
    }
    if (data.length != 6) {
      // console.log(data, type);
      if (type == "firstNominee") {
        nomineeForm1.controls.nomineeState.setValue(null)
        nomineeForm1.controls.nomineeCountry.setValue(null)
        nomineeForm1.controls.nomineeCity.setValue(null)
      }
      if (type == "firstGuardian") {
        nomineeForm1.controls.guardianState.setValue(null)
        nomineeForm1.controls.guardianCountry.setValue(null)
        nomineeForm1.controls.guardianCity.setValue(null)
      }

      if (type == "secondNominee") {
        nomineeForm2.controls.nomineeState.setValue(null)
        nomineeForm2.controls.nomineeCountry.setValue(null)
        nomineeForm2.controls.nomineeCity.setValue(null)
      }
      if (type == "SecondGuardian") {
        nomineeForm2.controls.guardianState.setValue(null)
        nomineeForm2.controls.guardianCountry.setValue(null)
        nomineeForm2.controls.guardianCity.setValue(null)
      }

      if (type == "ThirdNominee") {
        nomineeForm3.controls.nomineeState.setValue(null)
        nomineeForm3.controls.nomineeCountry.setValue(null)
        nomineeForm3.controls.nomineeCity.setValue(null)
      }
      if (type == "ThirdGuardian") {
        nomineeForm3.controls.guardianState.setValue(null)
        nomineeForm3.controls.guardianCountry.setValue(null)
        nomineeForm3.controls.guardianCity.setValue(null)
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
            nomineeForm1.controls.nomineeCity.setValue(productList.District)
          }
          if (type == "firstGuardian") {
            nomineeForm1.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm1.controls.guardianCountry.setValue(productList.Country)
            nomineeForm1.controls.guardianCity.setValue(productList.District)
          }
          if (type == "secondNominee") {
            nomineeForm2.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm2.controls.nomineeCountry.setValue(productList.Country)
            nomineeForm2.controls.nomineeCity.setValue(productList.District)
          }
          if (type == "SecondGuardian") {
            nomineeForm2.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm2.controls.guardianCountry.setValue(productList.Country)
            nomineeForm2.controls.guardianCity.setValue(productList.District)
          }
          if (type == "ThirdNominee") {
            nomineeForm3.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm3.controls.nomineeCountry.setValue(productList.Country)
            nomineeForm3.controls.nomineeCity.setValue(productList.District)
          }
          if (type == "ThirdGuardian") {
            nomineeForm3.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm3.controls.guardianCountry.setValue(productList.Country)
            nomineeForm3.controls.guardianCity.setValue(productList.District)
          }
        }
      })
  }
  // getexistingfinancial(){
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         "Cln": this.testdata['AccountId'],
  //       }],
  //     "requestId": "700087",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     if (response.errorCode == 0) {
  //       if (response.results ) {
  //         console.log(response.results)
  //       }
  //     }
  //   })
  // }
  //nominee function end
  //5 validation function start
  GetSpForFiveValidation() {
    return new Promise((resolve, reject) => {
      // console.log('f1');
    // this.isSpining =true
    // this.openpositionorunsettledchecked = false
    // this.ValidationNextButtonEnable =this.mtfpositionnotintradecodeenable ? (this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked):(this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked  && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: this.FromLocationField,
          TradeCode: this.TradeCode,
          type: `Type${this.TypeTabIndex + 1}`,
          DPid: this.DPId,
          DpClientid: this.DPAccountNumber,
          BOrHo: 'Branch',
          Clnid: this.ClientId
        }],
      "requestId": "700175",
      "outTblCount": "0"
    }).then((validatedresponse) => {
      // console.log("response");
      if (validatedresponse.results) {
        if(validatedresponse.errorCode==0)
        {
        // console.log(validatedresponse.results[0]);
        let data = validatedresponse.results[0] ? validatedresponse.results[0] : []
        let data2 = validatedresponse.results[1] ? validatedresponse.results[1]: []
        // 0: {ErrorCode: 0, ErrorMsg: 'Uncleared Debits in Your Account', validated: true}
        // 1: {ErrorCode: 0, ErrorMsg: 'Pledged Margins In Account', validated: true}
        // 2: {ErrorCode: 0, ErrorMsg: 'MTF Positions In Account', validated: true}
        // 3: {ErrorCode: 0, ErrorMsg: 'Derivative Open Position in Account', validated: true}
        // 4: {ErrorCode: 0, ErrorMsg: 'SIP running in your account', validated: true}
        // console.log(data[1].ErrorCode);
        // console.log(data[2].validated);
        //   console.log("data2 : ",data2);

        this.debitbalanceintradecodechecked = data[0].ErrorCode == 0 ? true : false
        this.pledgerequestnotintradecodechecked = data[1].ErrorCode == 0 ? true : false
        this.mtfpositionnotintradecodeenable = data[2].validated == true ? true : false
        this.mtfpositionnotintradecodechecked = data[2].ErrorCode == 0 && this.mtfpositionnotintradecodeenable ? true : false
        this.openpositionorunsettledchecked = data[3].ErrorCode == 0 ? true : false
        this.activeSIPnotintradecodechecked = data[4].ErrorCode == 0 ? true : false
        this.JoinHolder = data2[0].JointHolder?data2[0].JointHolder :false
        // if(this.mtfpositionnotintradecodeenable){
        //   this.ValidationNextButtonEnable =(this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
        // }
        // else{
        //   this.ValidationNextButtonEnable =(this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked  && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
        // }
        this.ValidationNextButtonEnable = this.mtfpositionnotintradecodeenable ? (!this.JoinHolder && this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked) : ( !this.JoinHolder && this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
        // console.log(this.debitbalanceintradecodechecked);
        // this.isSpining =false
        resolve(true)
        }
        else{
          this.notification.remove()
          this.notification.error(validatedresponse.errorMessage, '', { nzDuration: 1000 })
          resolve(false)
          // this.isSpining =false
        }
      }
    })

  })
  }
  // Ho 5 validation function
  GetSpForThreeValidationHO() {
    // this.thirdtabdisable = false
    // this.secondTabCompleted = true
    // this.secondtabdisable = false
    // this.activeTabIndex = 2
    this.isSpining = true
    // this.TradeCode = data.TradeCode
    // this.ConversionType = data.EntryType
    // this.DPId = data.DPID
    // this.DPAccountNumber = data.DematAcNo
    // this.ClientId = data.ClientId
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: this.FromLocationField,
          TradeCode: this.TradeCode,
          type: this.ConversionType,
          DPid: this.DPId,
          DpClientid: this.DPAccountNumber,
          BOrHo: 'HO',
          Clnid: this.ClientId
        }],
      "requestId": "700175",
      "outTblCount": "0"
    }).then((validatedresponse) => {
      // console.log("response");
      if (validatedresponse.results) {
        // console.log(validatedresponse.results[0]);
        let data = validatedresponse.results[0] ? validatedresponse.results[0] : []

        // 0: {ErrorCode: 0, ErrorMsg: 'Uncleared Debits in Your Account', validated: true}
        // 1: {ErrorCode: 0, ErrorMsg: 'Pledged Margins In Account', validated: true}
        // 2: {ErrorCode: 0, ErrorMsg: 'MTF Positions In Account', validated: true}
        // 3: {ErrorCode: 0, ErrorMsg: 'Derivative Open Position in Account', validated: true}
        // 4: {ErrorCode: 0, ErrorMsg: 'SIP running in your account', validated: true}
        // console.log(data[1].ErrorCode);

        this.HOpoolpendingchecked = data[0].ErrorCode == 0 ? true : false
        this.HOmarginchecked = data[1].ErrorCode == 0 ? true : false
        this.HOLedgerchecked = data[2].ErrorCode == 0 ? true : false


        //azar changed
        this.HOValidationNextButtonEnable = this.HOpoolpendingchecked && this.HOmarginchecked && this.HOLedgerchecked

        // this.cpremovalenable = validatedresponse.results[1].Result
        this.isSpining = false
      }
      else {
        this.isSpining = false
      }
    })
  }
  GentBoxNumber() {
    // this.openpositionorunsettledchecked = false
    // this.ValidationNextButtonEnable =this.mtfpositionnotintradecodeenable ? (this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked && this.mtfpositionnotintradecodechecked && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked):(this.openpositionorunsettledchecked && this.debitbalanceintradecodechecked  && this.pledgerequestnotintradecodechecked && this.activeSIPnotintradecodechecked)
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: this.model.PanNo,
          Clientid: this.ClientId,
        }],
      "requestId": "700200",
      "outTblCount": "0"
    }).then((boxdata) => {
      // console.log("response");
      // console.log(boxdata.results);

      if (boxdata.results.length > 0) {
        // console.log(boxdata.results[0]);
        // console.log(typeof boxdata.results[0][0].BoxNo);
        this.BoxNo = boxdata.results[0][0] ? String(boxdata.results[0][0].BoxNo) : ''
        // console.log(this.BoxNo);
        // console.log(typeof this.BoxNo);
        // alert(this.BoxNo)

      }
    }
    )
  }
  //5 validation function end
  // dummmmmmmmmmmmmy functionssss
  // charrestrict(event) {

  // }


  // dummmmmmmmmmmmmy functionssss ends

  //common functions start
  savecommon(form: FormGroup, formname?: string) {
    // console.log("savecommon  : ", form);
    // alert(form.valid)
    this.saveButtonFlag = true
    // console.log(formname);
    switch (formname) {
      case 'personal': {
        this.addressformenable = true
        this.commonscroll('address')

      }
        break;
      case 'address': {
        this.contactsformenable = true
        this.commonscroll('contacts')
      }
        break;
      case 'contacts': {
        this.financialformenable = true
        this.commonscroll('financial')
      }
        break;
      case 'financial': {
        this.bankformenable = true
        this.commonscroll('bank')
      }
        break;
      case 'bank': {
        this.nomineeformenable = true
        this.commonscroll('nominee')
      }
        break;
      case 'nominee': {
        this.uploadformenable = true
        this.commonscroll('upload')
        // this.nomineeformenable = true
        // this.commonscroll('address')
      }
        break;
      case 'upload': {
        // alert("saved")
        this.save('I')
      }
        break;
      default: console.log('invalid formname');

        break;
    }

    // alert(form)
  }
  commonscroll(el) {
    setTimeout(() => {
      document.getElementById(el).scrollIntoView();
    }, 2)
  }
  setformdetails(data: any, type?) {
    // console.log("setformdetails", data);

    this.model.PanNo = data.PAN

    var lastName
    if (this.fromReportPoolPage) {
      this.BoxNo = data.BoxNo
      this.FromLocationField = data.CurLocation
      this.CurrentStatus = data.CurrentStatus
      this.ClStatusChangeSlNo = data.ClStatusChangeSlNo
      this.TradeCodeTransfer = data.TradeCodeTransfer == '1' || data.TradeCodeTransfer == true ? true : false
      // this.FromLocationField = data.FromLocationField
      this.ToLocationField = data.ToLocationField?JSON.parse(data.ToLocationField):''
      // this.model.ToLocationField = data.ToLocationField
      this.TradingAccountType = data.TradingAccountType
      this.NSDLAccountType = data.NSDLAccountType
      this.CDSLAccountType = data.CDSLAccountType

      var typejson = {}
      typejson['DAoldtype'] = data.DematAccountCurrentType
      typejson['DAnewtype'] = data.DematAccountNewType
      typejson['DAoldsubtype'] = data.DematAccountCurrentSubType
      typejson['DAnewsubtype'] = data.DematAccountNewSubType
      typejson['TAoldtype'] = data.TradeAccountCurrentType
      typejson['TAnewtype'] = data.TradeAccountNewType
      if (data.ConversionType == 1) {
        this.TypeTabIndex = 0
        this.form_type_selection.patchValue({ ConversionType: 'Type1', Type1: typejson })
        this.Type2disable = !this.rejectEditeEnable
        this.Type3disable = true
      }
      else if (data.ConversionType == 2) {
        this.TypeTabIndex = 1
        this.form_type_selection.patchValue({ ConversionType: 'Type2', Type2: typejson })

        this.Type1disable = !this.rejectEditeEnable //true
        this.Type3disable = true
      }
      else if (data.ConversionType == 3) {
        this.TypeTabIndex = 2
        this.form_type_selection.patchValue({ ConversionType: 'Type3', Type3: typejson })
        this.Type1disable = true
        this.Type2disable = true
      }
      lastName = data.LastName
    }
    else {
      this.FromLocationField = data.CurLocation
      let index = -1
      index = data.LastName.indexOf("(")
      if (index !== -1) {
        lastName = data.LastName.slice(0, index)
      }
      else {
        lastName = data.LastName
      }

      // let index = this.pepSourceArray.findIndex(item => item.PEP = data.PEP)
      // if (index !== -1)
      //   data.PEP = this.pepSourceArray[index].Occupation_category

    }

    // this.form.controls.PAN.patchValue(data.PAN)
    // this.form.controls.AppNamePrefix.setValue(data.AppNamePrefix)
    // this.form.controls.FirstName.patchValue(data.FirstName)
    // this.form.controls.MiddleName.patchValue(data.MiddleName)
    // this.form.controls.LastName.patchValue(data.LastName)
    // this.form.controls.MaidenNamePrefix.setValue(data.MaidenNamePrefix)
    // this.form.controls.MaidenFirstName.patchValue(data.MaidenFirstName)
    // this.form.controls.MaidenMiddleName.patchValue(data.MaidenMiddleName)
    // this.form.controls.MaidenLastName.patchValue(data.MaidenLastName)
    // this.form.controls.FatherSpouseIndicator.setValue(data.FatherSpouseIndicator)
    // this.form.controls.FatherSpousePrefix.setValue(data.FatherSpousePrefix)
    // this.form.controls.FatherSpouseFirstName.patchValue(data.FatherSpouseFirstName)
    // this.form.controls.FatherSpouseMiddleName.patchValue(data.FatherSpouseMiddleName)
    // this.form.controls.FatherSpouseLastName.patchValue(data.FatherSpouseLastName)
    // this.form.controls.MotherNamePrefix.setValue(data.MotherNamePrefix)
    // this.form.controls.MotherFirstName.patchValue(data.MotherFirstName)
    // this.form.controls.MotherMiddleName.patchValue(data.MotherMiddleName)
    // this.form.controls.MotherLastName.patchValue(data.MotherLastName)
    // this.form.controls.Gender.setValue(data.Gender)
    // this.form.controls.Age.patchValue(data.Age)
    // this.form.controls.Minor.patchValue(data.Minor)
    // this.form.controls.MaritalStatus.setValue(data.MaritalStatus)
    // this.form.controls.Nationality.patchValue(data.Nationality)
    // this.form.controls.ResidentialStatus.setValue(data.ResidentialStatus)
    // this.form.controls.CIN.patchValue(data.CIN)
    // console.log("dataaaaaaaaaaaaaaaaaaaaasssssssssssss : ", data);
    this.form.patchValue({
      PAN: data.PAN,
      dob: data.DOB,
      nameinpansite: data.NameInPanSite,
      AppNamePrefix: data.AppNamePrefix,
      FirstName: data.FirstName,
      MiddleName: data.MiddleName,
      LastName: lastName,
      MaidenNamePrefix: data.MaidenNamePrefix,
      MaidenFirstName: data.MaidenFirstName,
      MaidenMiddleName: data.MaidenMiddleName,
      MaidenLastName: data.MaidenLastName,
      FatherSpouseIndicator: data.FatherSpouseIndicator,
      FatherSpousePrefix: data.FatherSpousePrefix,
      FatherSpouseFirstName: data.FatherSpouseFirstName,
      FatherSpouseMiddleName: data.FatherSpouseMiddleName,
      FatherSpouseLastName: data.FatherSpouseLastName,
      MotherNamePrefix: data.MotherNamePrefix,
      MotherFirstName: data.MotherFirstName,
      MotherMiddleName: data.MotherMiddleName,
      MotherLastName: data.MotherLastName,
      Gender: data.Gender,
      Age: data.Age,
      Minor: data.Minor,
      MaritalStatus: data.MaritalStatus,
      Nationality: data.Nationality,
      ResidentialStatus: data.ResidentialStatus,
      riskCountry: data.RiskCountry,
      CIN: data.CIN
    })
    // this.form.controls.dob.patchValue(temp)
    // this.form.controls.nameinpansite.patchValue(temp)
    // this.form.controls.ckyc.patchValue(y)
    // this.form.controls.ProceedType.patchValue(y)
    // this.form.controls.changeKRA.patchValue(n)
    // this.form.controls.isKRAVerified.patchValue(y)
    // this.form.controls.occupationType.patchValue(temp)
    // this.form.controls.otherOccupationValue.patchValue(temp)
    // this.form.controls.riskCountry.patchValue(national)
    // this.form.controls.merchantnavy.patchValue(temp)
    // this.setaddressdetails(data)

    this.form_address.patchValue({
      idProof: data.IdProof,
      proofOfAddress: data.PermanentAddressProof,
      address1: {
        houseName: data.PermanentAddressLine1,
        street: data.PermanentAddressLine2,
        landmark: data.PermanentAddressLine3,
        pinCode: data.PermanentAddressPINCode,
        city: data.PermanentAddressCity,
        district: data.PermanentAddressDistrict,
        state: data.PermanentAddressState,
        country: data.PermanentAddressCountry,
        proofOfAddress: data.PermanentAddressProofCode
      },
      address2: {
        sameAsPermant: data.SameAsPermanentAddress == '1' || data.SameAsPermanentAddress == true ? true : false,
        houseName: data.CorrespondenceAddressLine1,
        street: data.CorrespondenceAddressLine2,
        landmark: data.CorrespondenceAddressLine3,
        pinCode: data.CorrespondenceAddressPINCode,
        city: data.CorrespondenceAddressCity,
        district: data.CorrespondenceAddressDistrict,
        state: data.CorrespondenceAddressState,
        country: data.CorrespondenceAddressCountry,
        proofOfAddress: data.CorrespondenceAddressProofCode
        //   sameAsPermant: [false],
        // houseName: [null, [Validators.required]],
        // street: [null, [Validators.required]],
        // pinCode: [null, [Validators.required]],
        // country: [null, [Validators.required]],
        // state: [null, [Validators.required]],
        // proofOfAddress: [null, [Validators.required]],
        // city: [null, [Validators.required]],
        // district: [null, [Validators.required]],
        // landmark: [null],
      },
      address4: {
        sameAddAs: data.SameAsAddress,
        taxCountry: data.JurisdictionTaxCountry,
        taxIdentification: data.JurisdictionTaxIdentification,
        placeOfBirth: data.JurisdictionPlaceOfBirth,
        countryOfBirth: data.JurisdictionCountryOfBirth,
        fatca: data.JurisdictionFatca,
        houseName: data.JurisdictionHouseName,
        street: data.JurisdictionStreet,
        pinCode: data.JurisdictionPinCode,
        country: data.JurisdictionCountry,
        state: data.JurisdictionState,
        proofOfAddress: data.CorrespondenceAddressProofCode,
        city: data.JurisdictionCity,
        district: data.JurisdictionDistrict,
        landmark: data.JurisdictionLandmark
      }
    })

    this.form_contacts.patchValue({
      telephoneOffice: data.OffTelephoneNo,
      telephoneResidence: data.ResTelephoneNo,
      fax: data.FaxNo,
      smsFacility: data.SMSFacility == false ? false : true,
      mobile: data.MobileNo,
      isdCodeMobile: this.isNRE ? data.MobileISDCode : '091',
      relation: data.MobRelation,
      existingClient: data.MobExistingClient,
      existingPan: data.MobExistingPAN,
      // additionalMblNo:,
      // relation1:,
      // existingClient1:,
      // existingPan1:,
      email: data.EmailID,
      relation2: data.EmailRelation,
      existingClient2: data.EmailExistingClient,
      existingPan2: data.EmailExistingPAN,
      // isdCodeAdditionMobile:,
      // addEmail:,
      // relation3:,
      // existingClient3:,
      // existingPan3:,
      // overseasMobile:,

      // derivativeSegment:,
      // nomobileFlag:,
      // noemailFlag:,
    })

    let pepindex
    var finalpep
    if (type == 'branch') {
      finalpep = this.PEP
      // if (typeof data.PEP == "number") {
      //   console.log("number");

      //   finalpep = data.PEP
      // }
      // else {
      //   console.log("else");
      //   console.log(this.pepSourceArray);

      //   pepindex = this.pepSourceArray.findIndex(item => item.Name == data.PEP)
      //   console.log("else index number1", pepindex);

      //   if (pepindex !== -1) {
      //     finalpep = this.pepSourceArray[pepindex].Occupation_category
      //     console.log("else index number2", pepindex);
      //   }
      // }

    }
    else {
      finalpep = data.PEP
      setTimeout(() => {
        this.showOccupation(data.OccupationType)
        this.showinput(data.SourceOfFunds)
      }, 3000);
    }

    this.form_financial.patchValue({
      pep: finalpep,
      anualIncome: data.AnnualIncome,
      networth: data.NetWorth,
      networthasondate: data.AsOnDate,
      // RejRemarks: data.,
      // AppRemarks: data.,
      sourceOfFund: data.SourceOfFunds,
      prof_busi: data.ProfessionalOrBussiness,
      typeOfBusiActivity: data.TypeOfBussinessActivity,
      otherfunds: data.OtherFunds,
      // derivativeProof: data.,
      occupationType: data.OccupationType,
      organisation: data.OrganisationName,
      designation: data.Designation,
      nameofemployer: data.NameOfEmployer,
      officeaddress1: data.OffAddressLine1,
      officeaddress2: data.OffAddressLine2,
      officeaddress3: data.OffAddressLine3,
      offpin: data.OffPIN,
      phone: data.OffPhone,
      email: data.OffEmail,
      mobile: data.OffMobile,
      // skipFin: data.
    })
    this.form_ipv.patchValue({
      empCode: data.KYCVerificationEMPCode,
      empName: data.KYCVerificationName,
      empBranch: data.KYCVerificationBranch,
      empDesingation: data.KYCVerificationDesignation,
      date: data.KYCVerificationDate,
      dateOfDeclaration: data.AppDeclarationDate,
      placeOfDeclaration: data.AppDeclarationPlace,
    })

    if (type == 'ho') {
      // IdProof
      // :
      // 10
      // IdentityProofDetails1
      // :
      // "Aadhar No"
      // IdentityProofDetails2
      // :
      // "********3333"
      // IdentityProofDetails3
      // :
      // null
      // IdentityProofDetails4
      // :
      // null
      // console.log("identityProofformFeilds :", this.identityProofDetails);

      if (data.IdentityProofDetails3 !== null) {
        this.identityProofformFeilds = [
          {
            'proof0': data.IdentityProofDetails2,
            'label': data.IdentityProofDetails1,
            'type': data.IdentityProofDetailsType
          },
          {
            'proof1': data.IdentityProofDetails4,
            'label': data.IdentityProofDetails3,
            'type': data.IdentityProofDetailsType1
          }
        ]
      }
      else if (data.IdentityProofDetails1 !== null) {
        this.identityProofformFeilds = [
          {
            'proof0': data.IdentityProofDetails2,
            'label': data.IdentityProofDetails1,
            'type': data.IdentityProofDetailsType
          }]
      }
      if (data.PermanentAddressProof1 !== null) {
        this.Address1formFeilds = [
          {
            'proof0': data.PermanentAddressProofIDNO,
            'label': data.PermanentAddressProof,
            'type': data.PermanentAddressProofType
          },
          {
            'proof1': data.PermanentAddressProofIDNO1,
            'label': data.PermanentAddressProof1,
            'type': data.PermanentAddressProofType1
          }
        ]
      }
      else if (data.PermanentAddressProof !== null) {
        this.Address1formFeilds = [
          {
            'proof0': data.PermanentAddressProofIDNO,
            'label': data.PermanentAddressProof,
            'type': data.PermanentAddressProofType

          }]
      }
      // console.log(this.Address1formFeilds);

      if (data.CorrespondenceAddressProof1 !== null) {
        this.Address2formFeilds = [
          {
            'proof0': data.CorrespondenceAddressProofIDNO,
            'label': data.CorrespondenceAddressProof,
            'type': data.CorrespondenceAddressProofType
          },
          {
            'proof1': data.CorrespondenceAddressProofIDNO1,
            'label': data.CorrespondenceAddressProof1,
            'type': data.CorrespondenceAddressProofType1
          }
        ]
      }
      else if (data.CorrespondenceAddressProof !== null) {
        this.Address2formFeilds = [
          {
            'proof0': data.CorrespondenceAddressProofIDNO,
            'label': data.CorrespondenceAddressProof,
            'type': data.CorrespondenceAddressProofType
          }]
      }
      // console.log(data.CorrespondenceAddressProofType);
      // console.log(this.Address2formFeilds);

      if (data.JurisdictionAddressProof1 !== null) {
        this.Address4formFeilds = [
          {
            'proof0': data.JurisdictionAddressProofIDNO,
            'label': data.JurisdictionAddressProof,
            'type': data.JurisdictionAddressProofType
          },
          {
            'proof1': data.JurisdictionAddressProofIDNO1,
            'label': data.JurisdictionAddressProof1,
            'type': data.JurisdictionAddressProofType1
          }
        ]
      }
      else if (data.JurisdictionAddressProof !== null) {
        this.Address4formFeilds = [
          {
            'proof0': data.JurisdictionAddressProofIDNO,
            'label': data.JurisdictionAddressProof,
            'type': data.JurisdictionAddressProofType
          }]
      }
      // console.log(this.Address4formFeilds);


      // console.log("data.OnlineFundTransfer", data.OnlineFundTransfer);
      // console.log("data.OnlineFundTransfer", data.TypeOfAccount, 'dropdowns  ' + this.tradingBankAccType);


      this.form_passport.patchValue({
        passportName: data.PassportName,
        placeOfIssue: data.PassportPlaceOFIssue,
        dateOfIssue: data.PassportDateOfIssue,
        expiryDate: data.PassportExpiryDate,
      })
      this.form_bank.patchValue({
        clntname: data.ClientName,
        bankAcType: data.TypeOfAccount,
        modeOfOperation: data.ModeOfOperation,
        ifscCode: data.IFSCCode,
        bankname: data.BankName,
        address: data.BranchAddress,
        micr: data.MICRNO,
        country: data.BranchCountry,
        state: data.BranchStates,
        city: data.BranchCity,
        pin: data.BranchPIN,
        accntNumber: data.BankAC,
        confrmAccntNumber: data.ConfirmAccountNo,
        oft: data.OnlineFundTransfer == false ? 'N' : 'S',
        // rbirefNo: data.RBIReferenceNo,
        // rbiapprvldt: data.RBIApprovalDate,
        // pisBank: data.PISBank,
        BankAddoption: data.BankAddOption
      })
      // this.nomineehidden = data.FirstNomineeFirstName == null ? true : false
      this.nomineehidden =data.NomineeExists == 1 ?true:false
      this.numOfNominees = data.NoOfNominee  //NoNominee
      // console.log("numOfNominees : ",this.numOfNominees);

      this.SetNomineeNumber(data.NoOfNominee)
      // data.FirstNomineeFirstName == null ? 'Zero' : (data.SecondHolderfirstName == null && data.FirstNomineeFirstName != null) ? 'One' : (data.ThirdHolderfirstName == null && data.SecondHolderfirstName != null && data.FirstNomineeFirstName != null) ? 'Two' : (data.ThirdHolderfirstName != null && data.SecondHolderfirstName != null && data.FirstNomineeFirstName != null) ? 'Three' : 'Zero'
      // console.log(this.numOfNominees);


      let equalshare = (data.NomineeEqualShares == false || data.NomineeEqualShares == '0' || data.NomineeEqualShares == null) ? false : true
      // console.log("equalshare", equalshare);

      this.form_nominee.patchValue({
        nomineeEqualShareForNominess: equalshare,
        // tradeNominee:,
        firstNomineeDetails: {
          nomineeTitle: data.FirstNomineeNamePrefix,
          nomineeFirstName: data.FirstNomineeFirstName,
          nomineeMiddleName: data.FirstNomineeMiddleName,
          nomineeLastName: data.FirstNomineeLastName,
          //nomineeResidualshares: data.[null],
          nomineeRelationshipwithapplicant: data.FirstNomineeRelShip,
          nomineeHouseName: data.FirstNomineeAdd1,
          nomineeHouseNumber: data.FirstNomineeAdd2,//mod aksa
          nomineeStreet: data.FirstNomineeAdd3, //mod aksa
          nomineePin: data.FirstNomineePIN,
          nomineeCity: data.FirstNomineeCity,
          nomineeState: data.FirstNomineeState,
          // BOCategory: data.[null],
          nomineeCountry: data.FirstNomineeCountry,
          isdCodeMobile: data.FirstNomineeMobISDCode,
          nomineeMobile: data.FirstNomineeMob,
          isdCodeTelephone: data.FirstNomineeISDCode,
          stdCodetelephone: data.FirstNomineeSTDCode,
          nomineeTelephoneNumber: data.FirstNomineeTelePhone,
          nomineeEmailID: data.FirstNomineeEmailID,
          sharePercentage: data.FirstNomineePercentOfShare,
          nomineeNomineeIdentificaitonDetails: data.FirstNomineeIdentificationDetails,
          nomineeDOB: data.FirstNomineeminorDOB,
          guardianTitle: data.FirstNomineeGuardianPrefix,
          guardianFirstName: data.FirstNomineeGuardianFirstName,
          guardianMiddleName: data.FirstNomineeGuardianMiddleName,
          guardianLastName: data.FirstNomineeGuardianLastName,
          guardianRelationshipofGuardian: data.FirstNomineeGuardianRelationship,
          guardianHouseName: data.FirstNomineeGuardianAddress1,
          guardianHouseNumber: data.FirstNomineeGuardianAddress2,
          guardianStreet: data.FirstNomineeGuardianAddress3,
          guardianPin: data.FirstNomineeGuardianPIN,
          guardianCity: data.FirstNomineeGuardianCity,
          guardianState: data.FirstNomineeGuardianState,
          guardianCountry: data.FirstNomineeGuardianCountry,
          guardianTelephoneNumber: data.FirstNomineeGuardianTelephoneNo,
          guardianMobile: data.FirstNomineeGuardianMobile,
          guardianEmailID: data.FirstNomineeGuardianEmail,
          guardianIdentificaitonDetails: data.FirstNomineeGuardianidentificationDetails
        },
        SecondNomineeDetails: {
          nomineeTitle: data.SecondNomineeNamePrefix,
          nomineeFirstName: data.SecondNomineeFirstName,
          nomineeMiddleName: data.SecondNomineeMiddleName,
          nomineeLastName: data.SecondNomineeLastName,
          //nomineeResidualshares: data.[null],
          nomineeRelationshipwithapplicant: data.SecondNomineeRelShip,
          nomineeHouseName: data.SecondNomineeAdd1,
          nomineeHouseNumber: data.SecondNomineeAdd2,//mod aksa
          nomineeStreet: data.SecondNomineeAdd3, //mod aksa
          nomineePin: data.SecondNomineePIN,
          nomineeCity: data.SecondNomineeCity,
          nomineeState: data.SecondNomineeState,
          // BOCategory: data.[null],
          nomineeCountry: data.SecondNomineeCountry,
          isdCodeMobile: data.SecondNomineeMobISDCode,
          nomineeMobile: data.SecondNomineeMob,
          isdCodeTelephone: data.SecondNomineeISDCode,
          stdCodetelephone: data.SecondNomineeSTDCode,
          nomineeTelephoneNumber: data.SecondNomineeTelePhone,
          nomineeEmailID: data.SecondNomineeEmailID,
          sharePercentage: data.SecondNomineePercentOfShare,
          nomineeNomineeIdentificaitonDetails: data.SecondNomineeIdentificationDetails,
          nomineeDOB: data.SecondNomineeMInorDOB,
          guardianTitle: data.SecondNomineeGuardianPrefix,
          guardianFirstName: data.SecondNomineeGuardianFirstName,
          guardianMiddleName: data.SecondNomineeGuardianMiddleName,
          guardianLastName: data.SecondNomineeGuardianLastName,
          guardianRelationshipofGuardian: data.SecondNomineeGuardianRelationship,
          guardianHouseName: data.SecondNomineeGuardianAddress1,
          guardianHouseNumber: data.SecondNomineeGuardianAddress2,
          guardianStreet: data.SecondNomineeGuardianAddress3,
          guardianPin: data.SecondNomineeGuardianPIN,
          guardianCity: data.SecondNomineeGuardianCity,
          guardianState: data.SecondNomineeGuardianState,
          guardianCountry: data.SecondNomineeGuardianCountry,
          guardianTelephoneNumber: data.SecondNomineeGuardianTelephoneNo,
          guardianMobile: data.SecondNomineeGuardianMobile,
          guardianEmailID: data.SecondNomineeGuardianEmail,
          guardianIdentificaitonDetails: data.SecondNomineeGuardianidentificationDetails
        },
        ThirdNomineeDetails: {
          nomineeTitle: data.ThirdNomineeNamePrefix,
          nomineeFirstName: data.ThirdNomineeFirstName,
          nomineeMiddleName: data.ThirdNomineeMiddleName,
          nomineeLastName: data.ThirdNomineeLastName,
          //nomineeResidualshares: data.[null],
          nomineeRelationshipwithapplicant: data.ThirdNomineeRelShip,
          nomineeHouseName: data.ThirdNomineeAdd1,
          nomineeHouseNumber: data.ThirdNomineeAdd2,//mod aksa
          nomineeStreet: data.ThirdNomineeAdd3, //mod aksa
          nomineePin: data.ThirdNomineePIN,
          nomineeCity: data.ThirdNomineeCity,
          nomineeState: data.ThirdNomineeState,
          // BOCategory: data.[null],
          nomineeCountry: data.ThirdNomineeCountry,
          isdCodeMobile: data.ThirdNomineeMobISDCode,
          nomineeMobile: data.ThirdNomineeMob,
          isdCodeTelephone: data.ThirdNomineeISDCode,
          stdCodetelephone: data.ThirdNomineeSTDCode,
          nomineeTelephoneNumber: data.ThirdNomineeTelePhone,
          nomineeEmailID: data.ThirdNomineeEmailID,
          sharePercentage: data.ThirdNomineePercentOfShare,
          nomineeNomineeIdentificaitonDetails: data.ThirdNomineeIdentificationDetails,
          nomineeDOB: data.ThirdNomineeMinorDOB,
          guardianTitle: data.ThirdNomineeGuardianPrefix,
          guardianFirstName: data.ThirdNomineeGuardianFirstName,
          guardianMiddleName: data.ThirdNomineeGuardianMiddleName,
          guardianLastName: data.ThirdNomineeGuardianLastName,
          guardianRelationshipofGuardian: data.ThirdNomineeGuardianRelationship,
          guardianHouseName: data.ThirdNomineeGuardianAddress1,
          guardianHouseNumber: data.ThirdNomineeGuardianAddress2,
          guardianStreet: data.ThirdNomineeGuardianAddress3,
          guardianPin: data.ThirdNomineeGuardianPIN,
          guardianCity: data.ThirdNomineeGuardianCity,
          guardianState: data.ThirdNomineeGuardianState,
          guardianCountry: data.ThirdNomineeGuardianCountry,
          guardianTelephoneNumber: data.ThirdNomineeGuardianTelephoneNo,
          guardianMobile: data.ThirdNomineeGuardianMobile,
          guardianEmailID: data.ThirdNomineeGuardianEmail,
          guardianIdentificaitonDetails: data.ThirdNomineeGuardianidentificationDetails
        }
      })
      if (this.numOfNominees == 'One' || this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
        // firstNomineeProof
        // firstNomineeGuardianProof
        if (data.FirstNomineeProof3 !== null) {
          this.Nominee1Fields = [
            {
              'nomineeproof10': data.FirstNomineeProofIDNO,
              'label': data.FirstNomineeProof,
              'type': data.FirstNomineeType
            },
            {
              'nomineeproof11': data.FirstNomineeProofIDNO1,
              'label': data.FirstNomineeProof1,
              'type': data.FirstNomineeType1
            },
            {
              'nomineeproof12': data.FirstNomineeProofIDNO2,
              'label': data.FirstNomineeProof2,
              'type': data.FirstNomineeType2
            },
            {
              'nomineeproof13': data.FirstNomineeProofIDNO3,
              'label': data.FirstNomineeProof3,
              'type': data.FirstNomineeType3
            }
          ]
        }
        else if (data.FirstNomineeProof2 !== null) {
          this.Nominee1Fields = [
            {
              'nomineeproof10': data.FirstNomineeProofIDNO,
              'label': data.FirstNomineeProof,
              'type': data.FirstNomineeType
            },
            {
              'nomineeproof11': data.FirstNomineeProofIDNO1,
              'label': data.FirstNomineeProof1,
              'type': data.FirstNomineeType1
            },
            {
              'nomineeproof12': data.FirstNomineeProofIDNO2,
              'label': data.FirstNomineeProof2,
              'type': data.FirstNomineeType2
            }

          ]
        }
        else if (data.FirstNomineeProof1 !== null) {
          this.Nominee1Fields = [
            {
              'nomineeproof10': data.FirstNomineeProofIDNO,
              'label': data.FirstNomineeProof,
              'type': data.FirstNomineeType
            },
            {
              'nomineeproof11': data.FirstNomineeProofIDNO1,
              'label': data.FirstNomineeProof1,
              'type': data.FirstNomineeType1
            }
          ]
        }
        else if (data.FirstNomineeProof !== null) {
          this.Nominee1Fields = [
            {
              'nomineeproof10': data.FirstNomineeProofIDNO,
              'label': data.FirstNomineeProof,
              'type': data.FirstNomineeType

            }]
        }

        if (data.FirstNomineeGuardianProof3 !== null) {
          this.Gardian1Fields = [
            {
              'guardianproof10': data.FirstNomineeGuardianProofIDNO,
              'label': data.FirstNomineeGuardianProof,
              'type': data.FirstNomineeGuardianType
            },
            {
              'guardianproof11': data.FirstNomineeGuardianProofIDNO1,
              'label': data.FirstNomineeGuardianProof1,
              'type': data.FirstNomineeGuardianType1
            },
            {
              'guardianproof12': data.FirstNomineeGuardianProofIDNO2,
              'label': data.FirstNomineeGuardianProof2,
              'type': data.FirstNomineeGuardianType2
            },
            {
              'guardianproof13': data.FirstNomineeGuardianProofIDNO3,
              'label': data.FirstNomineeGuardianProof3,
              'type': data.FirstNomineeGuardianType3
            }
          ]
        }
        else if (data.FirstNomineeGuardianProof2 !== null) {
          this.Gardian1Fields = [
            {
              'guardianproof10': data.FirstNomineeGuardianProofIDNO,
              'label': data.FirstNomineeGuardianProof,
              'type': data.FirstNomineeGuardianType
            },
            {
              'guardianproof11': data.FirstNomineeGuardianProofIDNO1,
              'label': data.FirstNomineeGuardianProof1,
              'type': data.FirstNomineeGuardianType1
            },
            {
              'guardianproof12': data.FirstNomineeGuardianProofIDNO2,
              'label': data.FirstNomineeGuardianProof2,
              'type': data.FirstNomineeGuardianType2
            }

          ]
        }
        else if (data.FirstNomineeGuardianProof1 !== null) {
          this.Gardian1Fields = [
            {
              'guardianproof10': data.FirstNomineeGuardianProofIDNO,
              'label': data.FirstNomineeGuardianProof,
              'type': data.FirstNomineeGuardianType
            },
            {
              'guardianproof11': data.FirstNomineeGuardianProofIDNO1,
              'label': data.FirstNomineeGuardianProof1,
              'type': data.FirstNomineeGuardianType1
            }
          ]
        }
        else if (data.FirstNomineeGuardianProof !== null) {
          this.Gardian1Fields = [
            {
              'guardianproof10': data.FirstNomineeGuardianProofIDNO,
              'label': data.FirstNomineeGuardianProof,
              'type': data.FirstNomineeGuardianType

            }]
        }

        this.CheckMinor('First', data.FirstNomineeminorDOB)
        if (this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
          if (data.SecondNomineeProof3 !== null) {
            this.Nominee2Fields = [
              {
                'nomineeproof20': data.SecondNomineeProofIDNO,
                'label': data.SecondNomineeProof,
                'type': data.SecondNomineeType
              },
              {
                'nomineeproof21': data.SecondNomineeProofIDNO1,
                'label': data.SecondNomineeProof1,
                'type': data.SecondNomineeType1
              },
              {
                'nomineeproof22': data.SecondNomineeProofIDNO2,
                'label': data.SecondNomineeProof2,
                'type': data.SecondNomineeType2
              },
              {
                'nomineeproof23': data.SecondNomineeProofIDNO3,
                'label': data.SecondNomineeProof3,
                'type': data.SecondNomineeType3
              }
            ]
          }
          else if (data.SecondNomineeProof2 !== null) {
            this.Nominee2Fields = [
              {
                'nomineeproof20': data.SecondNomineeProofIDNO,
                'label': data.SecondNomineeProof,
                'type': data.SecondNomineeType
              },
              {
                'nomineeproof21': data.SecondNomineeProofIDNO1,
                'label': data.SecondNomineeProof1,
                'type': data.SecondNomineeType1
              },
              {
                'nomineeproof22': data.SecondNomineeProofIDNO2,
                'label': data.SecondNomineeProof2,
                'type': data.SecondNomineeType2
              }

            ]
          }
          else if (data.SecondNomineeProof1 !== null) {
            this.Nominee2Fields = [
              {
                'nomineeproof20': data.SecondNomineeProofIDNO,
                'label': data.SecondNomineeProof,
                'type': data.SecondNomineeType
              },
              {
                'nomineeproof21': data.SecondNomineeProofIDNO1,
                'label': data.SecondNomineeProof1,
                'type': data.SecondNomineeType1
              }
            ]
          }
          else if (data.SecondNomineeProof !== null) {
            this.Nominee2Fields = [
              {
                'nomineeproof20': data.SecondNomineeProofIDNO,
                'label': data.SecondNomineeProof,
                'type': data.SecondNomineeType

              }]
          }

          if (data.SecondNomineeGuardianProof3 !== null) {
            this.Gardian2Fields = [
              {
                'guardianproof20': data.SecondNomineeGuardianProofIDNO,
                'label': data.SecondNomineeGuardianProof,
                'type': data.SecondNomineeGuardianType
              },
              {
                'guardianproof21': data.SecondNomineeGuardianProofIDNO1,
                'label': data.SecondNomineeGuardianProof1,
                'type': data.SecondNomineeGuardianType1
              },
              {
                'guardianproof22': data.SecondNomineeGuardianProofIDNO2,
                'label': data.SecondNomineeGuardianProof2,
                'type': data.SecondNomineeGuardianType2
              },
              {
                'guardianproof23': data.SecondNomineeGuardianProofIDNO3,
                'label': data.SecondNomineeGuardianProof3,
                'type': data.SecondNomineeGuardianType3
              }
            ]
          }
          else if (data.SecondNomineeGuardianProof2 !== null) {
            this.Gardian2Fields = [
              {
                'guardianproof20': data.SecondNomineeGuardianProofIDNO,
                'label': data.SecondNomineeGuardianProof,
                'type': data.SecondNomineeGuardianType
              },
              {
                'guardianproof21': data.SecondNomineeGuardianProofIDNO1,
                'label': data.SecondNomineeGuardianProof1,
                'type': data.SecondNomineeGuardianType1
              },
              {
                'guardianproof22': data.SecondNomineeGuardianProofIDNO2,
                'label': data.SecondNomineeGuardianProof2,
                'type': data.SecondNomineeGuardianType2
              }

            ]
          }
          else if (data.SecondNomineeGuardianProof1 !== null) {
            this.Gardian2Fields = [
              {
                'guardianproof20': data.SecondNomineeGuardianProofIDNO,
                'label': data.SecondNomineeGuardianProof,
                'type': data.SecondNomineeGuardianType
              },
              {
                'guardianproof21': data.SecondNomineeGuardianProofIDNO1,
                'label': data.SecondNomineeGuardianProof1,
                'type': data.SecondNomineeGuardianType1
              }
            ]
          }
          else if (data.SecondNomineeGuardianProof !== null) {
            this.Gardian2Fields = [
              {
                'guardianproof20': data.SecondNomineeGuardianProofIDNO,
                'label': data.SecondNomineeGuardianProof,
                'type': data.SecondNomineeGuardianType

              }]
          }
          this.CheckMinor('Second', data.SecondNomineeMInorDOB)
          if (this.numOfNominees == 'Three') {
            if (data.ThirdNomineeProof3 !== null) {
              this.Nominee3Fields = [
                {
                  'nomineeproof30': data.ThirdNomineeProofIDNO,
                  'label': data.ThirdNomineeProof,
                  'type': data.ThirdNomineeType
                },
                {
                  'nomineeproof31': data.ThirdNomineeProofIDNO1,
                  'label': data.ThirdNomineeProof1,
                  'type': data.ThirdNomineeType1
                },
                {
                  'nomineeproof32': data.ThirdNomineeProofIDNO2,
                  'label': data.ThirdNomineeProof2,
                  'type': data.ThirdNomineeType2
                },
                {
                  'nomineeproof33': data.ThirdNomineeProofIDNO3,
                  'label': data.ThirdNomineeProof3,
                  'type': data.ThirdNomineeType3
                }
              ]
            }
            else if (data.ThirdNomineeProof2 !== null) {
              this.Nominee3Fields = [
                {
                  'nomineeproof30': data.ThirdNomineeProofIDNO,
                  'label': data.ThirdNomineeProof,
                  'type': data.ThirdNomineeType
                },
                {
                  'nomineeproof31': data.ThirdNomineeProofIDNO1,
                  'label': data.ThirdNomineeProof1,
                  'type': data.ThirdNomineeType1
                },
                {
                  'nomineeproof32': data.ThirdNomineeProofIDNO2,
                  'label': data.ThirdNomineeProof2,
                  'type': data.ThirdNomineeType2
                }

              ]
            }
            else if (data.ThirdNomineeProof1 !== null) {
              this.Nominee3Fields = [
                {
                  'nomineeproof30': data.ThirdNomineeProofIDNO,
                  'label': data.ThirdNomineeProof,
                  'type': data.ThirdNomineeType
                },
                {
                  'nomineeproof31': data.ThirdNomineeProofIDNO1,
                  'label': data.ThirdNomineeProof1,
                  'type': data.ThirdNomineeType1
                }
              ]
            }
            else if (data.ThirdNomineeProof !== null) {
              this.Nominee3Fields = [
                {
                  'nomineeproof30': data.ThirdNomineeProofIDNO,
                  'label': data.ThirdNomineeProof,
                  'type': data.ThirdNomineeType

                }]
            }

            if (data.ThirdNomineeGuardianProof3 !== null) {
              this.Gardian3Fields = [
                {
                  'guardianproof30': data.ThirdNomineeGuardianProofIDNO,
                  'label': data.ThirdNomineeGuardianProof,
                  'type': data.ThirdNomineeGuardianType
                },
                {
                  'guardianproof31': data.ThirdNomineeGuardianProofIDNO1,
                  'label': data.ThirdNomineeGuardianProof1,
                  'type': data.ThirdNomineeGuardianType1
                },
                {
                  'guardianproof32': data.ThirdNomineeGuardianProofIDNO2,
                  'label': data.ThirdNomineeGuardianProof2,
                  'type': data.ThirdNomineeGuardianType2
                },
                {
                  'guardianproof33': data.ThirdNomineeGuardianProofIDNO3,
                  'label': data.ThirdNomineeGuardianProof3,
                  'type': data.ThirdNomineeGuardianType3
                }
              ]
            }
            else if (data.ThirdNomineeGuardianProof2 !== null) {
              this.Gardian3Fields = [
                {
                  'guardianproof30': data.ThirdNomineeGuardianProofIDNO,
                  'label': data.ThirdNomineeGuardianProof,
                  'type': data.ThirdNomineeGuardianType
                },
                {
                  'guardianproof31': data.ThirdNomineeGuardianProofIDNO1,
                  'label': data.ThirdNomineeGuardianProof1,
                  'type': data.ThirdNomineeGuardianType1
                },
                {
                  'guardianproof32': data.ThirdNomineeGuardianProofIDNO2,
                  'label': data.ThirdNomineeGuardianProof2,
                  'type': data.ThirdNomineeGuardianType2
                }

              ]
            }
            else if (data.ThirdNomineeGuardianProof1 !== null) {
              this.Gardian3Fields = [
                {
                  'guardianproof30': data.ThirdNomineeGuardianProofIDNO,
                  'label': data.ThirdNomineeGuardianProof,
                  'type': data.ThirdNomineeGuardianType
                },
                {
                  'guardianproof31': data.ThirdNomineeGuardianProofIDNO1,
                  'label': data.ThirdNomineeGuardianProof1,
                  'type': data.ThirdNomineeGuardianType1
                }
              ]
            }
            else if (data.ThirdNomineeGuardianProof !== null) {
              this.Gardian3Fields = [
                {
                  'guardianproof30': data.ThirdNomineeGuardianProofIDNO,
                  'label': data.ThirdNomineeGuardianProof,
                  'type': data.ThirdNomineeGuardianType

                }]
            }
            this.CheckMinor('Third', data.ThirdNomineeMinorDOB)
          }
        }

      }
      // console.log("After dataas : ", this.form_nominee);
    }
    if(type == 'ho')
    {
      this.TradeCode =data.TradeCode
      this.DPId =data.DPID
      this.DPAccountNumber =data.DematAcNo
      this.ClientId =data.ClientId
      this.GetSpForFiveValidation()
    }
  }
  removeformcontrols() {
    // this.form.removeControl('dob');
    // this.form.removeControl('nameinpansite');
    // this.form.removeControl('ckyc');
    // this.form.removeControl('ProceedType');
    // this.form.removeControl('changeKRA');
    // this.form.removeControl('isKRAVerified');
    // this.form.removeControl('occupationType');
    this.form.removeControl('otherOccupationValue');
    this.form.removeControl('merchantnavy');

    // this.form_contacts.removeControl('telephoneOffice')
    // this.form_contacts.removeControl('smsFacility')
    this.form_contacts.removeControl('additionalMblNo')
    this.form_contacts.removeControl('relation1')
    this.form_contacts.removeControl('existingClient1')
    this.form_contacts.removeControl('existingPan1')
    // this.form_contacts.removeControl('existingPan2')
    this.form_contacts.removeControl('isdCodeAdditionMobile')
    this.form_contacts.removeControl('addEmail')
    this.form_contacts.removeControl('relation3')
    this.form_contacts.removeControl('existingClient3')
    this.form_contacts.removeControl('existingPan3')
    this.form_contacts.removeControl('overseasMobile')
    // this.form_contacts.removeControl('dateOfDeclaration')
    // this.form_contacts.removeControl('placeOfDeclaration')
    this.form_contacts.removeControl('derivativeSegment')
    this.form_contacts.removeControl('nomobileFlag')
    this.form_contacts.removeControl('noemailFlag')
    // this.form_contacts.removeControl('OffTelephoneNo')
    // MobileISDCode: temp ,                   3),
    // MobileNo: temp ,                   10),
    // MobRelation varchar(20),
    // MobExistingClient varchar(2),
    // MobExistingPAN  varchar(10),
    // EmailID varchar(100),
    // EmailRelation varchar(20),
    // EmailExistingClient varchar(2),
    // EmailExistingPAN varchar(10),

  }
  ViewAccounts() {
    this.isVisibleApproved = true;
  }
  handleCancel() {
    this.isVisibleApproved = false;
    // this.isVisibleBankAccounts = false;
  }
  setdisableflags() {
    if(this.CurrentStatus !=='R')
      this.editFlag = false;
    this.disableMobile = true;
  }
  SaveKYC(type) {
    // console.log(type);
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to ' + type + ' ?</b>',
      nzOnOk: () => {
        // this.activeTabIndex-=1
        alert(type)
      }
    })

  }
  back() {
    // this.GetSpForFiveValidation()
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.activeTabIndex -= 1
        if (!this.fromReportPoolPage)
          this.fisttabcompleted = false
        this.AllFormEnable = false
      }
    })
  }
  save(action) {
    // this.isSpining = true
    // console.log("this.model.ToLocationField",this.ToLocationField);


    // uploadProofData = action =='save'? this.validateallforms() : this.checkUploads()
    // let Valid = uploadProofData = this.checkUploads()//false;
    // let Valid = action == 'save' ? true : this.checkUploads()
    let Valid = action == 'save' ? this.validateallforms() : this.checkUploads()

    if (Valid) {

      var uploadProofData
      let imageXmlData
      var proofOfuploadOBJ = []


      var parameter = {}
      if (action == 'save') {
        // let valid =this.validateallforms()
        let valid = true
        if (valid) {
          this.removeformcontrols()
          let finaldata = {}//Object.assign(this.form.value,this.form_contacts.value)
          finaldata['ClientId'] = this.ClientId//Math.floor((Math.random() * 100) + 1)
          finaldata['TradeCode'] = this.TradeCode
          finaldata['DPID'] = this.DPId
          finaldata['DematAcNo'] = this.DPAccountNumber
          finaldata['TradeCodeTransfer'] = this.TradeCodeTransfer
          // finaldata['FromAndToLocationField'] = this.FromAndToLocationField
          finaldata['FromLocationField'] = this.FromLocationField
          finaldata['TradeCodeTransferToLocation'] =  this.ToLocationField?this.ToLocationField.Location :null
          finaldata['ToLocationField'] = this.ToLocationField? JSON.stringify(this.ToLocationField):null
          finaldata['TradingAccountType'] = this.TradingAccountType
          finaldata['NSDLAccountType'] = this.NSDLAccountType
          finaldata['CDSLAccountType'] = this.CDSLAccountType
          finaldata['BoxNo'] = this.BoxNo
          finaldata['idProof'] = this.form_address.controls.idProof.value
          finaldata['proofOfAddress'] = this.form_address.controls.proofOfAddress.value

          // console.log(this.Address1formFeilds);
          // console.log(this.Address2formFeilds);
          // console.log(this.Address4formFeilds);


          finaldata['EntryLocation'] = this.branch

          // DPId  :string =''
          // DPAccountNumber :string =''
          // TradeCode :string =''
          finaldata['personaldetails'] = this.form.value




          finaldata['address1'] = this.form_address.controls.address1.value
          finaldata['address1']['label0'] = this.Address1formFeilds.length > 0 ? (this.Address1formFeilds[0].label ? this.Address1formFeilds[0].label : null) : null
          finaldata['address1']['proof0'] = this.Address1formFeilds.length > 0 ? (this.Address1formFeilds[0].proof0 ? this.Address1formFeilds[0].proof0 : null) : null
          finaldata['address1']['type0'] = this.Address1formFeilds.length > 0 ? (this.Address1formFeilds[0].type ? this.Address1formFeilds[0].type : null) : null
          finaldata['address1']['label1'] = this.Address1formFeilds.length > 1 ? (this.Address1formFeilds[1].label ? this.Address1formFeilds[1].label : null) : null
          finaldata['address1']['proof1'] = this.Address1formFeilds.length > 1 ? (this.Address1formFeilds[1].proof1 ? this.Address1formFeilds[1].proof1 : null) : null
          finaldata['address1']['type1'] = this.Address1formFeilds.length > 1 ? (this.Address1formFeilds[1].type ? this.Address1formFeilds[1].type : null) : null
          finaldata['address2'] = this.form_address.controls.address2.value
          finaldata['address2']['label0'] = this.Address2formFeilds.length > 0 ? (this.Address2formFeilds[0].label ? this.Address2formFeilds[0].label : null) : null
          finaldata['address2']['proof0'] = this.Address2formFeilds.length > 0 ? (this.Address2formFeilds[0].proof0 ? this.Address2formFeilds[0].proof0 : null) : null
          finaldata['address2']['type0'] = this.Address2formFeilds.length > 0 ? (this.Address2formFeilds[0].type ? this.Address2formFeilds[0].type : null) : null
          finaldata['address2']['label1'] = this.Address2formFeilds.length > 1 ? (this.Address2formFeilds[1].label ? this.Address2formFeilds[1].label : null) : null
          finaldata['address2']['proof1'] = this.Address2formFeilds.length > 1 ? (this.Address2formFeilds[1].proof1 ? this.Address2formFeilds[1].proof1 : null) : null
          finaldata['address2']['type1'] = this.Address2formFeilds.length > 1 ? (this.Address2formFeilds[1].type ? this.Address2formFeilds[1].type : null) : null
          finaldata['address4'] = this.form_address.controls.address4.value
          finaldata['address4']['label0'] = this.Address4formFeilds.length > 0 ? (this.Address4formFeilds[0].label ? this.Address4formFeilds[0].label : null) : null
          finaldata['address4']['proof0'] = this.Address4formFeilds.length > 0 ? (this.Address4formFeilds[0].proof0 ? this.Address4formFeilds[0].proof0 : null) : null
          finaldata['address4']['type0'] = this.Address4formFeilds.length > 0 ? (this.Address4formFeilds[0].type ? this.Address4formFeilds[0].type : null) : null
          finaldata['address4']['label1'] = this.Address4formFeilds.length > 1 ? (this.Address4formFeilds[1].label ? this.Address4formFeilds[1].label : null) : null
          finaldata['address4']['proof1'] = this.Address4formFeilds.length > 1 ? (this.Address4formFeilds[1].proof1 ? this.Address4formFeilds[1].proof1 : null) : null
          finaldata['address4']['type1'] = this.Address4formFeilds.length > 1 ? (this.Address4formFeilds[1].type ? this.Address4formFeilds[1].type : null) : null

          finaldata['label0'] = this.identityProofformFeilds.length > 0 ? (this.identityProofformFeilds[0].label ? this.identityProofformFeilds[0].label : null) : null
          finaldata['proof0'] = this.identityProofformFeilds.length > 0 ? (this.identityProofformFeilds[0].proof0 ? this.identityProofformFeilds[0].proof0 : null) : null
          finaldata['type0'] = this.identityProofformFeilds.length > 0 ? (this.identityProofformFeilds[0].type ? this.identityProofformFeilds[0].type : null) : null
          finaldata['label1'] = this.identityProofformFeilds.length > 1 ? (this.identityProofformFeilds[1].label ? this.identityProofformFeilds[1].label : null) : null
          finaldata['proof1'] = this.identityProofformFeilds.length > 1 ? (this.identityProofformFeilds[1].proof1 ? this.identityProofformFeilds[1].proof1 : null) : null
          finaldata['type1'] = this.identityProofformFeilds.length > 1 ? (this.identityProofformFeilds[1].type ? this.identityProofformFeilds[1].type : null) : null

          finaldata['contacts'] = this.form_contacts.value
          finaldata['financial'] = this.form_financial.value
          finaldata['bank'] = this.form_bank.value
          finaldata['passport'] = this.form_passport.value
          finaldata['NoOfNominee'] = this.numOfNominees
          finaldata['NomineeExists'] = this.nomineehidden
          finaldata['nominee'] = this.form_nominee.value //this.nomineehidden ? {} :
          // Nominee1Fields
          if (this.numOfNominees == 'One' || this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
            finaldata['nominee']['firstNomineeDetails']['label0'] = this.Nominee1Fields.length > 0 ? (this.Nominee1Fields[0].label ? this.Nominee1Fields[0].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['proof0'] = this.Nominee1Fields.length > 0 ? (this.Nominee1Fields[0].nomineeproof10 ? this.Nominee1Fields[0].nomineeproof10 : null) : null
            finaldata['nominee']['firstNomineeDetails']['type0'] = this.Nominee1Fields.length > 0 ? (this.Nominee1Fields[0].type ? this.Nominee1Fields[0].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['label1'] = this.Nominee1Fields.length > 1 ? (this.Nominee1Fields[1].label ? this.Nominee1Fields[1].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['proof1'] = this.Nominee1Fields.length > 1 ? (this.Nominee1Fields[1].nomineeproof11 ? this.Nominee1Fields[1].nomineeproof11 : null) : null
            finaldata['nominee']['firstNomineeDetails']['type1'] = this.Nominee1Fields.length > 1 ? (this.Nominee1Fields[1].type ? this.Nominee1Fields[1].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['label2'] = this.Nominee1Fields.length > 2 ? (this.Nominee1Fields[2].label ? this.Nominee1Fields[2].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['proof2'] = this.Nominee1Fields.length > 2 ? (this.Nominee1Fields[2].nomineeproof12 ? this.Nominee1Fields[2].nomineeproof12 : null) : null
            finaldata['nominee']['firstNomineeDetails']['type2'] = this.Nominee1Fields.length > 2 ? (this.Nominee1Fields[2].type ? this.Nominee1Fields[2].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['label3'] = this.Nominee1Fields.length > 3 ? (this.Nominee1Fields[3].label ? this.Nominee1Fields[3].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['proof3'] = this.Nominee1Fields.length > 3 ? (this.Nominee1Fields[3].nomineeproof13 ? this.Nominee1Fields[3].nomineeproof13 : null) : null
            finaldata['nominee']['firstNomineeDetails']['type3'] = this.Nominee1Fields.length > 3 ? (this.Nominee1Fields[3].type ? this.Nominee1Fields[3].type : null) : null

            finaldata['nominee']['firstNomineeDetails']['glabel0'] = this.Gardian1Fields.length > 0 ? (this.Gardian1Fields[0].label ? this.Gardian1Fields[0].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['gproof0'] = this.Gardian1Fields.length > 0 ? (this.Gardian1Fields[0].nomineeproof10 ? this.Gardian1Fields[0].nomineeproof10 : null) : null
            finaldata['nominee']['firstNomineeDetails']['gtype0'] = this.Gardian1Fields.length > 0 ? (this.Gardian1Fields[0].type ? this.Gardian1Fields[0].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['glabel1'] = this.Gardian1Fields.length > 1 ? (this.Gardian1Fields[1].label ? this.Gardian1Fields[1].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['gproof1'] = this.Gardian1Fields.length > 1 ? (this.Gardian1Fields[1].nomineeproof11 ? this.Gardian1Fields[1].nomineeproof11 : null) : null
            finaldata['nominee']['firstNomineeDetails']['gtype1'] = this.Gardian1Fields.length > 1 ? (this.Gardian1Fields[1].type ? this.Gardian1Fields[1].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['glabel2'] = this.Gardian1Fields.length > 2 ? (this.Gardian1Fields[2].label ? this.Gardian1Fields[2].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['gproof2'] = this.Gardian1Fields.length > 2 ? (this.Gardian1Fields[2].nomineeproof12 ? this.Gardian1Fields[2].nomineeproof12 : null) : null
            finaldata['nominee']['firstNomineeDetails']['gtype2'] = this.Gardian1Fields.length > 2 ? (this.Gardian1Fields[2].type ? this.Gardian1Fields[2].type : null) : null
            finaldata['nominee']['firstNomineeDetails']['glabel3'] = this.Gardian1Fields.length > 3 ? (this.Gardian1Fields[3].label ? this.Gardian1Fields[3].label : null) : null
            finaldata['nominee']['firstNomineeDetails']['gproof3'] = this.Gardian1Fields.length > 3 ? (this.Gardian1Fields[3].nomineeproof13 ? this.Gardian1Fields[3].nomineeproof13 : null) : null
            finaldata['nominee']['firstNomineeDetails']['gtype3'] = this.Gardian1Fields.length > 3 ? (this.Gardian1Fields[3].type ? this.Gardian1Fields[3].type : null) : null

            if (this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {

              finaldata['nominee']['SecondNomineeDetails']['label0'] = this.Nominee2Fields.length > 0 ? (this.Nominee2Fields[0].label ? this.Nominee2Fields[0].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['proof0'] = this.Nominee2Fields.length > 0 ? (this.Nominee2Fields[0].nomineeproof20 ? this.Nominee2Fields[0].nomineeproof20 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['type0'] = this.Nominee2Fields.length > 0 ? (this.Nominee2Fields[0].type ? this.Nominee2Fields[0].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['label1'] = this.Nominee2Fields.length > 1 ? (this.Nominee2Fields[1].label ? this.Nominee2Fields[1].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['proof1'] = this.Nominee2Fields.length > 1 ? (this.Nominee2Fields[1].nomineeproof21 ? this.Nominee2Fields[1].nomineeproof21 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['type1'] = this.Nominee2Fields.length > 1 ? (this.Nominee2Fields[1].type ? this.Nominee2Fields[1].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['label2'] = this.Nominee2Fields.length > 2 ? (this.Nominee2Fields[2].label ? this.Nominee2Fields[2].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['proof2'] = this.Nominee2Fields.length > 2 ? (this.Nominee2Fields[2].nomineeproof22 ? this.Nominee2Fields[2].nomineeproof22 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['type2'] = this.Nominee2Fields.length > 2 ? (this.Nominee2Fields[2].type ? this.Nominee2Fields[2].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['label3'] = this.Nominee2Fields.length > 3 ? (this.Nominee2Fields[3].label ? this.Nominee2Fields[3].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['proof3'] = this.Nominee2Fields.length > 3 ? (this.Nominee2Fields[3].nomineeproof23 ? this.Nominee2Fields[3].nomineeproof23 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['type3'] = this.Nominee2Fields.length > 3 ? (this.Nominee2Fields[3].type ? this.Nominee2Fields[3].type : null) : null

              finaldata['nominee']['SecondNomineeDetails']['glabel0'] = this.Gardian2Fields.length > 0 ? (this.Gardian2Fields[0].label ? this.Gardian2Fields[0].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gproof0'] = this.Gardian2Fields.length > 0 ? (this.Gardian2Fields[0].nomineeproof20 ? this.Gardian2Fields[0].nomineeproof20 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gtype0'] = this.Gardian2Fields.length > 0 ? (this.Gardian2Fields[0].type ? this.Gardian2Fields[0].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['glabel1'] = this.Gardian2Fields.length > 1 ? (this.Gardian2Fields[1].label ? this.Gardian2Fields[1].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gproof1'] = this.Gardian2Fields.length > 1 ? (this.Gardian2Fields[1].nomineeproof21 ? this.Gardian2Fields[1].nomineeproof21 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gtype1'] = this.Gardian2Fields.length > 1 ? (this.Gardian2Fields[1].type ? this.Gardian2Fields[1].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['glabel2'] = this.Gardian2Fields.length > 2 ? (this.Gardian2Fields[2].label ? this.Gardian2Fields[2].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gproof2'] = this.Gardian2Fields.length > 2 ? (this.Gardian2Fields[2].nomineeproof22 ? this.Gardian2Fields[2].nomineeproof22 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gtype2'] = this.Gardian2Fields.length > 2 ? (this.Gardian2Fields[2].type ? this.Gardian2Fields[2].type : null) : null
              finaldata['nominee']['SecondNomineeDetails']['glabel3'] = this.Gardian2Fields.length > 3 ? (this.Gardian2Fields[3].label ? this.Gardian2Fields[3].label : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gproof3'] = this.Gardian2Fields.length > 3 ? (this.Gardian2Fields[3].nomineeproof23 ? this.Gardian2Fields[3].nomineeproof23 : null) : null
              finaldata['nominee']['SecondNomineeDetails']['gtype3'] = this.Gardian2Fields.length > 3 ? (this.Gardian2Fields[3].type ? this.Gardian2Fields[3].type : null) : null

              if (this.numOfNominees == 'Three') {
                finaldata['nominee']['ThirdNomineeDetails']['label0'] = this.Nominee3Fields.length > 0 ? (this.Nominee3Fields[0].label ? this.Nominee3Fields[0].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['proof0'] = this.Nominee3Fields.length > 0 ? (this.Nominee3Fields[0].nomineeproof30 ? this.Nominee3Fields[0].nomineeproof30 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['type0'] = this.Nominee3Fields.length > 0 ? (this.Nominee3Fields[0].type ? this.Nominee3Fields[0].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['label1'] = this.Nominee3Fields.length > 1 ? (this.Nominee3Fields[1].label ? this.Nominee3Fields[1].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['proof1'] = this.Nominee3Fields.length > 1 ? (this.Nominee3Fields[1].nomineeproof31 ? this.Nominee3Fields[1].nomineeproof31 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['type1'] = this.Nominee3Fields.length > 1 ? (this.Nominee3Fields[1].type ? this.Nominee3Fields[1].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['label2'] = this.Nominee3Fields.length > 2 ? (this.Nominee3Fields[2].label ? this.Nominee3Fields[2].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['proof2'] = this.Nominee3Fields.length > 2 ? (this.Nominee3Fields[2].nomineeproof32 ? this.Nominee3Fields[2].nomineeproof32 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['type2'] = this.Nominee3Fields.length > 2 ? (this.Nominee3Fields[2].type ? this.Nominee3Fields[2].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['label3'] = this.Nominee3Fields.length > 3 ? (this.Nominee3Fields[3].label ? this.Nominee3Fields[3].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['proof3'] = this.Nominee3Fields.length > 3 ? (this.Nominee3Fields[3].nomineeproof33 ? this.Nominee3Fields[3].nomineeproof33 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['type3'] = this.Nominee3Fields.length > 3 ? (this.Nominee3Fields[3].type ? this.Nominee3Fields[3].type : null) : null

                finaldata['nominee']['ThirdNomineeDetails']['glabel0'] = this.Gardian3Fields.length > 0 ? (this.Gardian3Fields[0].label ? this.Gardian3Fields[0].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gproof0'] = this.Gardian3Fields.length > 0 ? (this.Gardian3Fields[0].nomineeproof30 ? this.Gardian3Fields[0].nomineeproof30 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gtype0'] = this.Gardian3Fields.length > 0 ? (this.Gardian3Fields[0].type ? this.Gardian3Fields[0].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['glabel1'] = this.Gardian3Fields.length > 1 ? (this.Gardian3Fields[1].label ? this.Gardian3Fields[1].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gproof1'] = this.Gardian3Fields.length > 1 ? (this.Gardian3Fields[1].nomineeproof31 ? this.Gardian3Fields[1].nomineeproof31 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gtype1'] = this.Gardian3Fields.length > 1 ? (this.Gardian3Fields[1].type ? this.Gardian3Fields[1].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['glabel2'] = this.Gardian3Fields.length > 2 ? (this.Gardian3Fields[2].label ? this.Gardian3Fields[2].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gproof2'] = this.Gardian3Fields.length > 2 ? (this.Gardian3Fields[2].nomineeproof32 ? this.Gardian3Fields[2].nomineeproof32 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gtype2'] = this.Gardian3Fields.length > 2 ? (this.Gardian3Fields[2].type ? this.Gardian3Fields[2].type : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['glabel3'] = this.Gardian3Fields.length > 3 ? (this.Gardian3Fields[3].label ? this.Gardian3Fields[3].label : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gproof3'] = this.Gardian3Fields.length > 3 ? (this.Gardian3Fields[3].nomineeproof33 ? this.Gardian3Fields[3].nomineeproof33 : null) : null
                finaldata['nominee']['ThirdNomineeDetails']['gtype3'] = this.Gardian3Fields.length > 3 ? (this.Gardian3Fields[3].type ? this.Gardian3Fields[3].type : null) : null
              }
            }
          }

          // console.log(finaldata);

          // // finaldata['type'] = this.form_type_selection.controls.Type3.value
          // console.log(this.TypeTabIndex);
          finaldata['type'] = this.TypeTabIndex == 0 ? this.form_type_selection.controls.Type1.value : this.TypeTabIndex == 1 ? this.form_type_selection.controls.Type2.value : this.TypeTabIndex == 2 ? this.form_type_selection.controls.Type3.value : undefined
          finaldata['type']['ConversionType'] = finaldata['type'] ? this.TypeTabIndex + 1 : undefined

          finaldata['EntryType'] = finaldata['type'] ? `Type${this.TypeTabIndex + 1}` : undefined


          // this.documentValidate()
          parameter = {
            "batchStatus": "false",
            "detailArray":
              [{
                "EUser": this.currentUser.userCode,
                "EName": this.currentUser.firstname,
                "CurrentStatus": "P",//this.applicationStatus,
                "FileDataJson": finaldata,
                "IOrU": this.ioru,
                "ClStatusChangeSlNo": this.ioru == 'U' ? this.ClStatusChangeSlNo : undefined,
                "UploadedFileData": [],
                "Remarks": ''
              }],
            "requestId": "700150"//"700150"//"700215"//"700150"//"700212",//700150
          }
        }
      }
      else if (action == 'savefinalysed') {
        if (!this.validServ.validateForm(this.form_ipv, {}, this.validcongif.IPVDetails)) {
          return
        }
        let finaldata = {}
        finaldata['ipv'] = this.form_ipv.value

        parameter = {
          "batchStatus": "false",
          "detailArray":
            [{
              "Euser": this.currentUser.userCode,
              "EName": this.currentUser.firstname,
              "CurrentStatus": 'I',
              "FileDataJson": finaldata,
              "IOrU": this.ioru,
              "ClStatusChangeSlNo": this.ClStatusChangeSlNo,
              "UploadedFileData": this.SupportFiles,
              "Remarks": ''
            }],
          "requestId": "700150"//"700150"//"700215"//"700150"//"700212"//"700150"
        }
      }
      // else if(action == 'approve')
      // {
      //     parameter = {
      //       "batchStatus": "false",
      //       "detailArray":
      //       [{
      //         Pan: this.PAN,
      //         EntryType: this.tab,
      //         ActionType: 'F',
      //         FileData: reactivationxmldata,
      //         ActionUser: this.currentUser.userCode,
      //         IDNO: this.requestID,
      //         Rejection: this.AppRemarks? this.AppRemarks : '',
      //         RiskCountry: '',
      //         CommunicationAddress: '',
      //         SMSFlag: ''
      //       }],
      //     "requestId": "700072",
      //     "outTblCount": "0"
      //   }
      this.isSpining = true
      this.dataServ.getResultArray(parameter).then((response) => {
        this.isSpining = false
        if (response.errorCode == 0) {

          if (action == 'save') {
            this.notification.remove()
            this.notification.success('Data Saved ', '', { nzDuration: 1000 })
            this.documentValidate()
            // this.ioru = ioru =='I' ? 'U' : ioru
            // console.log(response);
            this.isSpining = false
            this.ClStatusChangeSlNo = response.results[0][0].ClStatusChangeSlNo
            this.saveButtonFlag = true
            this.SaveandFinalizebuttonenable = true
            this.printallbuttonenable = true
            this.rejectEditeEnableAfterSave =this.CurrentStatus =='R'?true:false
            this.CurrentStatus = 'P'
            this.rejectEditeEnable = false

            // this.applicationStatus = 'T'
          }
          else {
            this.notification.remove()
            this.notification.success('Data Save Finalised ', '', { nzDuration: 1000 })
            let ind = this.wsServ.workspaces.findIndex(item => item.type == "statusconversion")
            if (ind !== -1)
              this.wsServ.removeWorkspace(ind);
            // ((ws[i]['type']) == "statusconversion")
            // this.BackButtonClick();
            // return
          }

          //   this.savebuttonenable = false


          // this.previewImageData = []
          // this.subscriptions.forEach(ele => {
          //   ele.unsubscribe()
          // })
          // this.notification.success(details.errorMessage, '', { nzDuration: 1000 });
          // if (action == 'savefinalise') {
          //   this.BackButtonClick();
          //   return
          // }
          // else if (action == 'approve') {
          //   this.BackButtonClick();
          //   return
          // }
          // else {
          //   this.applicationStatus = 'T';
          //   this.cmServ.applicationStatus.next('T');
          //   this.modalService.info({
          //     nzTitle: '<i>Info</i>',
          //     nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

          //   })
          // }
          // this.cmServ.requestID.next(Number(response.results[0][0].requestID))
          // this.printButtonFlag = true
        }
        //   else {
        //     this.notification.error(details.errorMessage, '', { nzDuration: 1000 })
        //   }
        //   this.isSpining = false
        // }
        else {
          this.isSpining = false
          this.notification.remove()
          this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
        }
      })

    }
  }
  BackButtonClick() {
    this.edittabtitle = "";
    this.activeTabIndex = this.activeTabIndex - 1;
  }
  sptest(spid) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // "UserCode": this.currentUser.userCode,
          // "ProjectID": this.wsServ.getProjectId(), //this.currentUser.defaultProjId,
          // "SpId":"700065"
        }],
      "requestId": spid,
      "outTblCount": "0",
      // "SpId":"700065"
      // "dbConn": 'db',
    }).then((response) => {
      // console.log(response);

    })
  }
  Printbutton() {
    let params = {
      "Euser": this.currentUser.userCode,
      "Pan":  this.form.value.PAN,//this.form.value.PAN,
      "BarCode":  this.ClStatusChangeSlNo,//165097,//this.ClStatusChangeSlNo,//this.requestID,
      // "DPId": this.DPId,
      // "DPClientId":this.DPAccountNumber
    }
    let params2 = {
      "Euser": this.currentUser.userCode,
      "Pan":  this.form.value.PAN,//this.form.value.PAN,
      "BarCode":  this.ClStatusChangeSlNo,//165097,//this.ClStatusChangeSlNo,//this.requestID,
      "DPId": this.DPId2,
      "DPClientId":this.DPAccountNumber2
    }
    // let params3 = {
    //   "Euser": this.currentUser.userCode,
    //   "Pan":  this.form.value.PAN,//this.form.value.PAN,
    //   "BarCode":  this.ClStatusChangeSlNo,//165097,//this.ClStatusChangeSlNo,//this.requestID,
    //   "DPId": this.DPId3,
    //   "DPClientId":this.DPAccountNumber3
    // }
    this.PrintForm('700307')//Running Account Authorization
    this.PrintForm('700165')//for form bank
    this.printTradeCodeLetterFormorTransfer('700103')//tradecode conversion letter
    if(this.TradeCodeTransfer)
      this.printTradeCodeLetterFormorTransfer('700305')//tradecode transfer letter
    // this.PrintForm('700103', params)//letter
    if (!this.Type3disable)
    {
      if(this.multipleDPCount>0)
        this.PrintFormDemat('700314',params)//demat 2 anexure B
      // demat account form b spid and spname 700314,'USPGET_CSCReportB'
      // if(this.MultipleDPAvailable)
      // {
      //   this.PrintFormDemat('700314',params2)//demat 2 anexure B
      // }
    }
    else{
      if(this.multipleDPCount>0)
        this.PrintFormDemat('700119',params)//for form A  //demat1  anexure A
      // if(this.MultipleDPAvailable)
      // {
      //   this.PrintFormDemat('700119',params2)//demat 2 anexure B
      // }
    }



    this.PrintForm('700308')//for Anual KYC

    this.PrintForm('700235')// CKYC form
    if (!(this.form_contacts.controls.relation.value == 'Self' && this.form_contacts.controls.relation2.value == 'Self')) {
      this.PrintForm('700122')//common email
    }
    if (this.numOfNominees == 'One' || this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
      this.printNomineeForm()//nominee form
    }
    if (this.numOfNominees == 'Zero') {
      this.PrintForm('700240')//optout form
    }
    //// this.PrintForm('700108')//



    // this.sptest('700108')
  }
  printTradeCodeLetterFormorTransfer(spid) {
    this.isSpining = true
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [
        // params
        {
          //     "Euser": 'N',
          // "Pan": this.model.PanNo,
          // "BarCode": 2
          // "Euser": 'N',
          // "PanNo": this.form.value.PAN,//this.form.value.PAN,
          "BarCode": this.ClStatusChangeSlNo//165097,//this.ClStatusChangeSlNo,//this.requestID,
          //"IncludeRelatedPerson": 'N'
          // "PanNo":  'AAAAA0035A',
          // "SlNo": 0,
          // "EUser": '01671',
          // "Type": 'Mobile',
          // "BarcodeID":  0,
          // "Flag":  1
        }

      ],
      "requestId": spid,//"7050",//"700101",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notification.remove()
        this.notification.error("No Data Found", '', { nzDuration: 1000 });
        return;
      }
      else {
        // this.PrintForm('700102')
        if (!isPreview) {
          // console.log(response);
          this.notification.remove()
          this.notification.success('File downloaded successfully', '', { nzDuration: 1000 });
          return;
        }
      }
    }, (error) => {
      this.isSpining = false
      console.log(error);
      this.notification.remove()
      this.notification.error("Server encountered an Error", '', { nzDuration: 1000 });
    });
  }
  printNomineeForm() {
    this.isSpining = true
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [
        // params
        {
          //     "Euser": 'N',
          // "Pan": this.model.PanNo,
          // "BarCode": 2
          "Euser": this.currentUser.userCode,
          "PanNo": this.form.value.PAN,//this.form.value.PAN,
          "BarcodeID": this.ClStatusChangeSlNo//165097,//this.ClStatusChangeSlNo,//this.requestID,
          //"IncludeRelatedPerson": 'N'
          // "PanNo":  'AAAAA0035A',
          // "SlNo": 0,
          // "EUser": '01671',
          // "Type": 'Mobile',
          // "BarcodeID":  0,
          // "Flag":  1
        }

      ],
      "requestId": '700233',//"7050",//"700101",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notification.remove()
        this.notification.error("No Data Found", '', { nzDuration: 1000 });
        return;
      }
      else {
        // this.PrintForm('700102')
        if (!isPreview) {
          // console.log(response);
          this.notification.remove()
          this.notification.success('File downloaded successfully', '', { nzDuration: 1000 });
          return;
        }
      }
    }, (error) => {
      this.isSpining = false
      console.log(error);
      this.notification.remove()
      this.notification.error("Server encountered an Error", '', { nzDuration: 1000 });
    });
  }
  PrintForm(spid, params?) {

    this.isSpining = true
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [
        // params
        {
          //     "Euser": 'N',
          // "Pan": this.model.PanNo,
          // "BarCode": 2
          "Euser": this.currentUser.userCode,
          "Pan":  this.form.value.PAN,//this.form.value.PAN,
          "BarCode":  this.ClStatusChangeSlNo//165097,//this.ClStatusChangeSlNo,//this.requestID,
          //"IncludeRelatedPerson": 'N'
          // "PanNo":  'AAAAA0035A',
          // "SlNo": 0,
          // "EUser": '01671',
          // "Type": 'Mobile',
          // "BarcodeID":  0,
          // "Flag":  1
        }

      ],
      "requestId": spid,//"7050",//"700101",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notification.remove()
        this.notification.error("No Data Found", '', { nzDuration: 1000 });
        return;
      }
      else {
        // this.PrintForm('700102')
        if (!isPreview) {
          // console.log(response);
          this.notification.remove()
          this.notification.success('File downloaded successfully', '', { nzDuration: 1000 });
          return;
        }
      }
    }, (error) => {
      this.isSpining = false
      console.log(error);
      this.notification.remove()
      this.notification.error("Server encountered an Error", '', { nzDuration: 1000 });
    });
  }
  PrintFormDemat(spid, params?) {

    this.isSpining = true
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [
        params


      ],
      "requestId": spid,//"7050",//"700101",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notification.remove()
        this.notification.error("No Data Found", '', { nzDuration: 1000 });
        return;
      }
      else {
        // this.PrintForm('700102')
        if (!isPreview) {
          console.log(response);
          this.notification.remove()
          this.notification.success('File downloaded successfully', '', { nzDuration: 1000 });
          return;
        }
      }
    }, (error) => {
      this.isSpining = false
      console.log(error);
      this.notification.remove()
      this.notification.error("Server encountered an Error", '', { nzDuration: 1000 });
    });
  }
  //  common functions end

  // report functions start
  editButton() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.notification.remove()
        this.notification.success("Editing enabled..!", '', { nzDuration: 1000 });
      }
    });
  }
  // report functions end
  //document verification function start
  DocumentVerification() {
    var form = this.formProvider()
    // console.log(form);

    document.body.appendChild(form);
    form.submit();
  }
  formProvider() {
    var method = "post";
    var form, key, hiddenField;
    var target = "_blank"
    var url_path = ''
    if ((this.dataServ.ipAddress.substring(8, 10) == '29')) {
      url_path = "http://devgsl.geojit.net/aspx2/ClientRegistration/PrintDoc.aspx"
    }
    else {
      url_path = "http://www.geojit.net/aspx2/ClientRegistration/PrintDoc.aspx"
    }
    form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("target", target);
    form.setAttribute("action", url_path);
    var paramValues = {
      "Id": '183753',//'182753',//this.ClStatusChangeSlNo,//'182753',//this.requestID,
      "DB": "GFSL2021",
      "UserCode": this.currentUser.userCode,
      "flag": "SPICE_CRF", //"CSC",//"SPICE_CRF",
      "type": "BRANCH",
      "ScanImageId": "0"
    }
    // var target
    for (key in paramValues) {
      if (paramValues.hasOwnProperty(key)) {
        hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", paramValues[key]);
        form.appendChild(hiddenField);
      }
    }
    return form;
  }
  //ocument verification function end


  onviewReset() {
    this.clientArray = [];
    this.krakyc = [];
    this.model = <ClientChangeRequest>{};
    this.krakyc = [];
    this.changereq = null;
    this.krakycCheck = false;
    this.ckycCheck = false;
    this.panValid = true;
    this.pendingcount = '';
    this.rejectionCount = '';
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.IsForConfirmation = false;
    this.IsRejectedRequest = false;
    this.approvedRequest = [];
    this.isVisibleApproved = false;
    this.approvedCount = '';
    this.accountCountArray = {};
    this.clientArrayTemp = [];
    this.DisableCheck = false;
    this.Changereqdisable = false;
    this.isApproved = false;
    this.noDataflag = true;
    this.pendingOrRejected = false
    this.cmServ.requestID.next('')
    this.serielno = 0;
    this.showMob = false;
    this.showEmail = false;
    this.Email = '';
    this.Mobile = '';
    this.MobileorEmaillabel = '';
    this.showSendLink = false;
    this.newEmail = '';
    this.newMobile = '';
    this.Link = true;
    this.noLink = false;
    // this.flagReset();
    this.FirstlevelApprove = [];
    this.frstLvlApprovalCount = ''
    this.sameaccounttype = true
    this.MultipleDPAvailable = true
    this.afterpansearch = false
    this.AccountClientTypeValidate = false
    this.DisableNextButton=false
  }
  getFanfO(type) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // "EUser": this.currentUser.userCode,
          "ClStatusChangeSlNo": this.serielno,//this.CurrentStatus,//this.applicationStatus,

        }],
      "requestId": "700249",//"700246",//"700231",//"700072",//"6005",
    }).then((FOFlags) => {
      if (FOFlags.errorCode == 0) {
        // this.notification.error('', '')
        // console.log(FOFlags.results);

        // console.log(FOFlags.results[0][0].FOFlag);

        this.cpremovalenable = FOFlags.results[0][0].FOFlag == 1 ? true : false
        // console.log("this.cpremovalenable 2", this.cpremovalenable);
        // this.cpremovalenable = true

        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              // "EUser": this.currentUser.userCode,
              "CurrentStatus": this.HOCurrentStatus,//this.CurrentStatus,//this.applicationStatus,
              "ClStatusChangeSlNo": this.serielno,
              "EUser": this.currentUser.userCode,
              "EName": this.currentUser.firstname
            }],
          "requestId": "700245",//"700231",//"700246",//"700231",//"700072",//"6005",
        }).then((response) => {
          if (response.errorCode == 0) {
            this.CurrentStatus = this.HOCurrentStatus
            if (!this.cpremovalenable && this.CurrentStatus == 'AF') {
              this.CurrentStatus = 'AR'
            }
            this.HOVerifyButtonLabel = this.CurrentStatus == 'AF' ? ' CP Removal' : this.CurrentStatus == 'AR' ? ' UCC' : this.CurrentStatus == 'AU' ? ' Converted' : this.CurrentStatus == 'AC' ? ' Trade Code Transfer' : this.CurrentStatus == 'AT' ? ' UCC Trade Code Transfer' : ''
            if (type == 'AF') {
              this.notification.remove()
              this.notification.success('Successfully Final Verified', '',{ nzDuration: 1000 })
            }
            else {
              this.notification.remove()
              this.notification.success('Verified ', '',{ nzDuration: 1000 })
            }


            this.HOVerifyButtonLabel = 'Verify' + this.HOVerifyButtonLabel
            this.isSpining = false
          }
          else {
            this.isSpining = false;
            this.notification.remove()
            this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
          }
        })
        // return this.cpremovalenable
      }
      else {
        this.isSpining = false;
        this.notification.remove()
        this.notification.error(FOFlags.errorMsg, '', { nzDuration: 1000 })
        // return this.cpremovalenable
      }



    })
  }
  statuschange(type?) {
    if (type == 'AF') {
      this.HOCurrentStatus = 'AF'
      this.getFanfO(type)
    }
    else {
      if (this.CurrentStatus == 'AF' && !this.CPCodeRemoval) {
        // this.notification.error('You need to removal CP Code ', '')
        this.notification.remove()
        this.notification.error('Please mark the checkbox to proceed ', '', { nzDuration: 1000 })
        return
      }
      if (this.CurrentStatus == 'AR' && !this.UCCManualWork) {
        // this.notification.error('You need to verify UCC ', '')
        this.notification.remove()
        this.notification.error('Please mark the checkbox to proceed ', '', { nzDuration: 1000 })
        return
      }
      if (this.CurrentStatus == 'AU' && !this.UCCConverted) {
        // this.notification.error('You need to verify Converted ', '')
        this.notification.remove()
        this.notification.error('Please mark the checkbox to proceed ', '', { nzDuration: 1000 })
        return
      }
      if (this.CurrentStatus == 'AC' && !this.HOValidateTradeCodeTransfer && this.TradeCodeTransfer) {
        // this.notification.error('You need to verify Trade Code Transfer ', '')
        this.notification.remove()
        this.notification.error('Please mark the checkbox to proceed ', '', { nzDuration: 1000 })
        return
      }
      if (this.CurrentStatus == 'AT' && !this.HOValidateUCCTradeCodeTransfer && this.TradeCodeTransfer) {
        // this.notification.error('You need to verify UCC Trade code transfer ', '')
        this.notification.remove()
        this.notification.error('Please mark the checkbox to proceed ', '', { nzDuration: 1000 })
        return
      }
      this.isSpining = true;
      if (this.HOCurrentStatus == 'AC' && !this.TradeCodeTransfer) {
        this.HOCurrentStatus = 'AE'
      }
      // if (this.HOCurrentStatus == 'AE'){
      //   this.HOCurrentStatus = 'C'
      // }
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            // "EUser": this.currentUser.userCode,
            "CurrentStatus": this.HOCurrentStatus,//this.CurrentStatus,//this.applicationStatus,
            "ClStatusChangeSlNo": this.serielno,
            "EUser": this.currentUser.userCode,
            "EName": this.currentUser.firstname
          }],
        "requestId": "700245",//"700231",//"700246",//"700231",//"700072",//"6005",
      }).then((response) => {
        if (response.errorCode == 0) {
          this.CurrentStatus = this.HOCurrentStatus

          if (!this.cpremovalenable && this.CurrentStatus == 'AF') {
            this.CurrentStatus = 'AR'
          }
          this.HOVerifyButtonLabel = this.CurrentStatus == 'AF' ? ' CP Removal' : this.CurrentStatus == 'AR' ? ' UCC' : this.CurrentStatus == 'AU' ? ' Converted' : this.CurrentStatus == 'AC' ? ' Trade Code Transfer' : this.CurrentStatus == 'AT' ? ' UCC Trade Code Transfer' : ''

          // if (this.CurrentStatus == 'C') {
          //   if (!this.TradeCodeTransfer)
          //   {
          //   this.notification.success('Status Updated Successfully', '')
          //     this.sendMail()
          //   }
          //   else{
          //     this.notification.success('Trade Code Transfer Status Updated Successfully', '')
          //     this.sendMail()
          //   }
          // }

          // if (this.CurrentStatus == 'AC') {
          //   this.notification.success('Status Updated Successfully', '')
          //   if (!this.TradeCodeTransfer)
          //     this.sendMail()
          // }
          // else
          if (this.CurrentStatus == 'AE') {
            // this.notification.success('Trade Code Transfer Status Updated Successfully', '')
            this.notification.remove()
            this.notification.success('Status Updated Successfully', '', { nzDuration: 1000 })
            this.sendMail()
          }
          else {
            if (type == 'AF') {
              this.notification.remove()
              this.notification.success('Successfully Final Verified', '', { nzDuration: 1000 })
            }
            else {
              //  + this.HOVerifyButtonLabel
              this.notification.remove()
              this.notification.success('Verified ', '', { nzDuration: 1000 })
            }

          }
          this.HOVerifyButtonLabel = 'Verify' + this.HOVerifyButtonLabel
          this.isSpining = false
        }
        else {
          this.isSpining = false;
          this.notification.remove()
          this.notification.error(response.errorMsg, '', { nzDuration: 1000 })
        }
      })
    }
  }
  sendMail() {
    this.isSpining = true;
    this.dataServ.getResultArray(

      {
        "batchStatus": "false",
        "detailArray":
          [{
            "ClStatusChangeSlNo": this.serielno,

          }],
        "requestId": "700241"//"700150"//"700212",//700150
      }
    ).then((response) => {
      if (response.errorCode == 0) {
        this.isSpining = false
        this.notification.remove()
        this.notification.success('Mail sent', '', { nzDuration: 1000 });
        let ind = this.wsServ.workspaces.findIndex(item => item.type == "statusconversion")
        if (ind !== -1)
          this.wsServ.removeWorkspace(ind);
      }
      else {
        this.isSpining = false;
        this.notification.remove()
        this.notification.error(response.errorMsg, '', { nzDuration: 1000 });
        let ind = this.wsServ.workspaces.findIndex(item => item.type == "statusconversion")
        if (ind !== -1)
          this.wsServ.removeWorkspace(ind);
      }
    })
  }

  openmodaldata(event:any){
    this.cscservice.openmodalview()
  }
  documentValidate(){
    if (!this.Type3disable) {
      if (!this.add2.controls.sameAsPermant.value) {
        // (this.add1.controls.proofOfAddress.value !== this.add1.controls.proofOfAddress)
        let pind1 = this.PermanentAddressProofDetails.findIndex(item => item.Code == this.add1.controls.proofOfAddress.value)
        let pind2 = this.CorrespondanceAddressProofDetails.findIndex(item => item.Code == this.add2.controls.proofOfAddress.value)

        if (pind1 !== -1 && pind2 !== -1) {
          if (this.PermanentAddressProofDetails[pind1].Description !== this.CorrespondanceAddressProofDetails[pind2].Description) {
            this.type3proofofuploadlist.push({ slno: 24, Document: "Proof of address 2", DocumentProofRequired: true })
          }
        }
      }
//       console.log(this.Type3disable);
//       console.log("before" ,this.type3proofofuploadlist);
// console.log("validate this.numOfNominees ,",this.numOfNominees);

      if (this.numOfNominees !== 'Zero')//no nomineee
      {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 50)
        // console.log(ind);

        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }
      // debugger
      // console.log(this.type3proofofuploadlist);

      if (this.numOfNominees !== 'One' && this.numOfNominees !== 'Two' && this.numOfNominees !== 'Three') {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 17)
        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }

      // this.type3proofofuploadlist[3].DocumentProofRequired = this.numOfNominees == 'Zero' ? true : false//nomineee
      if (!this.TradeCodeTransfer)//no nomineee
      {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 7)
        // console.log(ind);

        if (ind !== -1) {
          this.type3proofofuploadlist.splice(ind, 1)
        }

        // let ind2 = this.type3proofofuploadlist.findIndex(item => item.slno == 5)
        // if (ind2 !== -1)
        //   this.type3proofofuploadlist.splice(ind2, 1)
      }
      // debugger
      // console.log("multipleDPCount : ",this.multipleDPCount);

      if(this.multipleDPCount===0){
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 6)
        // console.log(ind);

        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }
      // this.type3proofofuploadlist[6].DocumentProofRequired = this.TradeCodeTransfer
      if (this.add4.controls.fatca.value !== 'USPerson')//no nomineee
      {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 16)
        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }
      if (this.form_contacts.controls.relation.value == null && this.form_contacts.controls.relation2.value == null) {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 9)
        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }
      if (this.form_contacts.controls.relation.value == 'Self' && this.form_contacts.controls.relation2.value == 'Self') {
        let ind = this.type3proofofuploadlist.findIndex(item => item.slno == 9)
        if (ind !== -1)
          this.type3proofofuploadlist.splice(ind, 1)
      }
      if (this.numOfNominees == 'One' || this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
        if (this.nomineeForm1.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
          this.type3proofofuploadlist.push({ slno: 18, Document: "First Nominee identification details proof", DocumentProofRequired: true })
        }
        if (this.nomineeForm1.controls.guardianIdentificaitonDetails.value !== null) {
          this.type3proofofuploadlist.push({ slno: 19, Document: "First Nominee Guardian identification details proof", DocumentProofRequired: true })
        }

        if (this.numOfNominees == 'Three' || this.numOfNominees == 'Two') {
          if (this.nomineeForm2.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
            this.type3proofofuploadlist.push({ slno: 20, Document: "Second Nominee identification details proof", DocumentProofRequired: true })
          }
          if (this.nomineeForm2.controls.guardianIdentificaitonDetails.value !== null) {
            this.type3proofofuploadlist.push({ slno: 21, Document: "Second Nominee Guardian identification details proof", DocumentProofRequired: true })
          }
          if (this.numOfNominees == 'Three') {

            if (this.nomineeForm3.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
              this.type3proofofuploadlist.push({ slno: 22, Document: "Third Nominee identification details proof", DocumentProofRequired: true })
            }
            if (this.nomineeForm3.controls.guardianIdentificaitonDetails.value !== null) {
              this.type3proofofuploadlist.push({ slno: 23, Document: "Third Nominee Guardian identification details proof", DocumentProofRequired: true })
            }
          }
        }
      }
      // this.type3proofofuploadlist[15].DocumentProofRequired = this.add4.controls.fatca.value == 'USPerson' ? true : false//Us Person
    }
    else if (this.Type3disable) {
      if (!this.add2.controls.sameAsPermant.value) {
        // (this.add1.controls.proofOfAddress.value !== this.add1.controls.proofOfAddress)
        let pind1 = this.PermanentAddressProofDetails.findIndex(item => item.Code == this.add1.controls.proofOfAddress.value)
        let pind2 = this.CorrespondanceAddressProofDetails.findIndex(item => item.Code == this.add2.controls.proofOfAddress.value)

        if (pind1 !== -1 && pind2 !== -1) {
          if (this.PermanentAddressProofDetails[pind1].Description !== this.CorrespondanceAddressProofDetails[pind2].Description) {
            this.type1ortyp2proofofuploadlist.push({ slno: 24, Document: "Proof of address 2", DocumentProofRequired: true })
          }
        }
      }
      if (this.numOfNominees !== 'Zero')//no nomineee
      {
        // console.log("nominee");

        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 50)
        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
      }
      if (this.numOfNominees !== 'One' && this.numOfNominees !== 'Two' && this.numOfNominees !== 'Three') {
        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 12)
        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
      }
      // this.type1ortyp2proofofuploadlist[2].DocumentProofRequired = this.numOfNominees == 'Zero' ? true : false//nominee
      if (!this.TradeCodeTransfer)//no nomineee
      {
        console.log("this.TradeCodeTransfer ", this.TradeCodeTransfer);

        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 6)
        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
        // let ind2 = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 4)
        // if (ind2 !== -1)
        //   this.type1ortyp2proofofuploadlist.splice(ind2, 1)
      }
      if(this.multipleDPCount===0){
        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 5)
        // console.log(ind);

        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
      }
      if (this.form_contacts.controls.relation.value == null && this.form_contacts.controls.relation2.value == null) {
        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 7)
        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
      }
      if (this.form_contacts.controls.relation.value == 'Self' && this.form_contacts.controls.relation2.value == 'Self') {
        let ind = this.type1ortyp2proofofuploadlist.findIndex(item => item.slno == 7)
        if (ind !== -1)
          this.type1ortyp2proofofuploadlist.splice(ind, 1)
      }

      // this.type1ortyp2proofofuploadlist[5].DocumentProofRequired = this.TradeCodeTransfer
      if (this.numOfNominees == 'One' || this.numOfNominees == 'Two' || this.numOfNominees == 'Three') {
        if (this.nomineeForm1.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
          this.type1ortyp2proofofuploadlist.push({ slno: 13, Document: "First Nominee identification details proof", DocumentProofRequired: true })
        }
        if (this.nomineeForm1.controls.guardianIdentificaitonDetails.value !== null) {
          this.type1ortyp2proofofuploadlist.push({ slno: 14, Document: "First Nominee Guardian identification details proof", DocumentProofRequired: true })
        }

        if (this.numOfNominees == 'Three' || this.numOfNominees == 'Two') {
          if (this.nomineeForm2.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
            this.type1ortyp2proofofuploadlist.push({ slno: 15, Document: "Second Nominee identification details proof", DocumentProofRequired: true })
          }
          if (this.nomineeForm2.controls.guardianIdentificaitonDetails.value !== null) {
            this.type1ortyp2proofofuploadlist.push({ slno: 16, Document: "Second Nominee Guardian identification details proof", DocumentProofRequired: true })
          }
          if (this.numOfNominees == 'Three') {

            if (this.nomineeForm3.controls.nomineeNomineeIdentificaitonDetails.value !== null) {
              this.type1ortyp2proofofuploadlist.push({ slno: 17, Document: "Third Nominee identification details proof", DocumentProofRequired: true })
            }
            if (this.nomineeForm3.controls.guardianIdentificaitonDetails.value !== null) {
              this.type1ortyp2proofofuploadlist.push({ slno: 18, Document: "Third Nominee Guardian identification details proof", DocumentProofRequired: true })
            }
          }
        }
      }
      // console.log(this.type1ortyp2proofofuploadlist);
    }
  }

  // Test() {

  //   this.isSpining = true
  //   let requestParams = {
  //     "batchStatus": "false",
  //     "detailArray": [
  //       // params
  //       {
  //         //     "Euser": 'N',
  //         // "Pan": this.model.PanNo,
  //         // "BarCode": 2
  //         "Euser": "01671",
  //         "Pan":  "AJPPJ7996L",//this.form.value.PAN,
  //         "BarCode":  "2"//165097,//this.ClStatusChangeSlNo,//this.requestID,
  //         //"IncludeRelatedPerson": 'N'
  //         // "PanNo":  'AAAAA0035A',
  //         // "SlNo": 0,
  //         // "EUser": '01671',
  //         // "Type": 'Mobile',
  //         // "BarcodeID":  0,
  //         // "Flag":  1
  //       }

  //     ],
  //     "requestId": "700308",//"700235",//"7050",//"700101",
  //     "outTblCount": "0",
  //     "fileType": "2",
  //     "fileOptions": {
  //       "pageSize": "A3"
  //     }
  //   }
  //   let isPreview = false
  //   this.dataServ.generateReport(requestParams, false).then((response) => {
  //     this.isSpining = false
  //     if (response.errorMsg != undefined && response.errorMsg != '') {
  //       this.notification.remove()
  //       this.notification.error("No Data Found", '', { nzDuration: 1000 });
  //       return;
  //     }
  //     else {
  //       // this.PrintForm('700102')
  //       if (!isPreview) {
  //         console.log(response);
  //         this.notification.remove()
  //         this.notification.success('File downloaded successfully', '', { nzDuration: 1000 });
  //         return;
  //       }
  //     }
  //   }, (error) => {
  //     this.isSpining = false
  //     console.log(error);
  //     this.notification.remove()
  //     this.notification.error("Server encountered an Error", '', { nzDuration: 1000 });
  //   });
  // }

  hoDropdowns(){
    return new Promise((resolve, reject) => {
      // console.log('f1');

            this.onSelectClient()
            .then(res =>{
              if(res)
              {
              this.getidentifyprooforaddressproofdetails()
              this.contactssetvalidation()
              this.getfinancial()
              this.getbankdropdown()
              this.nomineeinitialize()
              this.getnomineerelationshipdropdown()
              resolve(true);
              }
            })
          });
  }

}
