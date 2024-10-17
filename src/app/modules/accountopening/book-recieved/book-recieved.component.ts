
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService, FormHandlerComponent } from "shared";
import * as  jsonxml from 'jsontoxml'
import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { truncateSync } from 'fs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';


export interface bookletmarkingForm {
  mode: any;
  Accepted: any;
  PanNo: any;
  Cin: any;
  uniqueCode: any;
  kitno: any;
  slno: any;
  accslno: any;
  crforpostacc: String
  pouchno: number;
}

@Component({
  selector: 'app-book-recieved',
  templateUrl: './book-recieved.component.html',
  styleUrls: ['./book-recieved.component.less'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class BookRecievedComponent implements OnInit {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild('canvas') myCanvas: HTMLCanvasElement;

  public context: CanvasRenderingContext2D;
  imageChangedEvent: any = '';
  imgobj: any;
  croppedImage: any = '';
  state: string = 'default';
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  imageIndex: string
  scancamera: boolean = true
  POAScannedFlag: boolean = false
  KitNo: string
  angleInDegrees: number = 0
  showcrop: boolean = false
  degree: number = 0
  count: number

  DDPIStatus: boolean = false;
  DDPIstamped: boolean;

  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  WebcamImage1: WebcamImage;
  val1: string;
  public triggerSnapshot(data): void {
    this.imageIndex = data
    this.trigger.next();

  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
    //  this.scannedImages3=null
    //  this.firstImage=false
  }

  public handleImage(webcamImage: WebcamImage): void {
    // this.fileChangeEvent(WebcamImage)
    this.scancamera = false
    this.firstImage = true;
    this.secondImage = true;
    this.thirdImage = true;

    if (this.B2B) this.modalsave = false;


    console.info('received webcam image', webcamImage);
    // this.pictureTaken.emit(webcamImage);
    if (this.imageIndex == '1') {
      // let WebcamImage1=webcamImage
      this.scannedImages1 = webcamImage.imageAsDataUrl
      this.firsthover = true
      this.secondhover = false
      this.thirdhover = false

    }
    else if (this.imageIndex == '2') {

      this.scannedImages2 = webcamImage.imageAsDataUrl
      this.firsthover = false
      this.secondhover = true
      this.thirdhover = false
    }
    else if (this.imageIndex == '3') {
      this.scannedImages3 = webcamImage.imageAsDataUrl
      this.firsthover = false
      this.secondhover = false
      this.thirdhover = true
    }

    //   if(this.scannedImages3==undefined||this.scannedImages3==null){
    //     this.scannedImages3=this.WebcamImage1.imageAsDataUrl
    //  }
    this.modalsave = false;
  }




  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }






  panFindOption: FindOptions;
  slnoFindOption: FindOptions
  accslnoFindOption: FindOptions
  kitnoFindOption: FindOptions
  geojitUniqueCodeFindOption: FindOptions;
  cinFindOption: FindOptions;
  pouchnoFindOption: FindOptions;
  scannedImages3: any
  scannedImages2: any
  scannedImages1: any
  modalsave: boolean = true
  firstImage: boolean = false
  secondImage: boolean = true
  thirdImage: boolean = true
  firsthover: boolean = true
  secondhover: boolean = false
  today = new Date();
  BarCodeId: Number
  thirdhover: boolean = false
  scanimagevisible: boolean = false
  dcmntrecieved1: boolean
  scannedImages = []
  Scanneditems_temp = []
  scannedDetails = []
  EnrolDate: Date
  MTF: Boolean
  dateFormat = 'dd-MM-yyyy';
  bookletslno: string
  isSpinning: boolean = false;
  model: bookletmarkingForm;
  accountTypeOptions = []
  pouchslnoDetails = []
  Scanneditems = []
  pouchslnoDetailsHead = []
  dateforreport: string
  StoreName: String
  kinoforreport: string
  buttonactive: boolean = true
  height = 30;
  width = 1;
  fontSize = 10;
  // marginLeft = 100;
  // marginRight = 100;
  value: number = 1;
  accslnoforreport: number
  currentUser: User;
  slno: number
  html_print: string
  totalData: any;
  passedtoauditor: boolean
  TempDPClientID: number
  ClientId: number
  AcceptedDate: Date;
  hideval: boolean = false
  Tradecode: any;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  imgData: any;
  xmlData: any
  Location: any;
  fromdate: Date
  isVisibleRejection: boolean = false
  todate: Date = new Date();
  FileTypelist = [];
  FileTypelist1 = [];
  temparray = [];
  Trading: Boolean
  NSDL: Boolean
  CDSL: Boolean
  B2BPartner: any
  B2B: Boolean = false
  holdername: String
  holderpan: string
  Secondholdername: String
  Secondholderpan: string
  code: String
  acctype: String
  dpcode: String
  subtype: String
  dcmntrecieved: boolean
  receiveddate: Date
  holderno: number
  batchno: number
  poasigned: boolean
  poasigneddate: Date
  poadebited: boolean
  poadebiteddate: Date
  poastamped: boolean
  tradingregionname: string
  TradingLocation: string
  tradecode: string
  tradinglocname: string
  dpaccid: string
  dpaccbenid: string
  initialstatus: string
  updatestaus: string
  boxno: number
  a: number = 1
  dcobDetails = []
  dcobDetailsHead = []
  Receiveddata = []
  dateforreport1 = new Date()
  dateforreport2 = moment(this.dateforreport).format(AppConfig.dateFormat.apiMoment)





  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private sanitizer: DomSanitizer,
    private modalService: NzModalService

  ) {
    this.model = <bookletmarkingForm>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadsearch();


  }


  reset() {
    this.model.PanNo = null;
    this.model.Cin = null;
    this.model.uniqueCode = null;
    this.model.kitno = null;
    this.model.uniqueCode = null;
    this.model.slno = null;
    this.model.accslno = null;
    this.totalData = [];
    this.boxno = null
    this.tradingregionname = null;
    this.TradingLocation = null;
    this.tradecode = null;
    this.tradinglocname = null;
    this.dpaccid = null;
    this.dpaccbenid = null;
    this.initialstatus = null;
    this.updatestaus = null;
    this.model.pouchno = null;
    this.holderno = null
    this.holdername = null;
    this.holderpan = null;
    this.dcmntrecieved1 = null;
    this.dcmntrecieved = null;
    this.pouchslnoDetails = []
    this.pouchslnoDetailsHead = []
    this.receiveddate = new Date()
    this.EnrolDate = null
    this.poadebiteddate = null
    this.poasigneddate = null
    this.poasigned = false
    this.poadebited = false
    this.poastamped = false
    this.DDPIstamped = false
    this.BarCodeId = null
    this.dcobDetails = []
    this.passedtoauditor = false
  }
  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    // this.dcmntrecieved=true;
    // this.passedtoauditor=true;
    this.model.crforpostacc = 'POSTACCOPEN'

    // this.formHdlr.setFormType('viewsave');
    this.FileTypelist = [{ "code": "NSDL", "FileType": 'NSDL Only' }, { "code": "CDSL", "FileType": 'CDSL Only' },
    { "code": "TRADE", "FileType": 'TRADING Only' }, { "code": "TRADENSDL", "FileType": 'TRADINGNSDL' }
      , { "code": "TRADECDSL", "FileType": 'TRADINGCDSL' }]
    this.FileTypelist1 = [{ "code": "Y", "FileType": 'YES' },
    { "code": "N", "FileType": 'NO' }]
    this.Receiveddata = [
      { "code": "Y", "Mode": 'YES' },
      { "code": "N", "Mode": 'NO' }]

  }



  loadsearch() {
    this.panFindOption = {
      findType: 3001,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"


    }
    this.geojitUniqueCodeFindOption = {
      findType: 3001,
      codeColumn: 'AccountCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.cinFindOption = {
      findType: 3001,
      codeColumn: 'CINNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.kitnoFindOption = {
      findType: 3001,
      codeColumn: 'AccountKitNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.slnoFindOption = {
      findType: 3001,
      codeColumn: 'BookletSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.accslnoFindOption = {
      findType: 3001,
      codeColumn: 'AccountSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.pouchnoFindOption = {
      findType: 3004,
      codeColumn: 'AccountSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

  }

  getData() {
    if (this.model.PanNo == null || this.model.Cin == null || this.model.kitno == null || this.model.uniqueCode == null || this.model.slno == null || this.model.accslno == null) {
      this.notif.warning('warning', 'Required Field is missing')
      return;
    }
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          GeojitUniqueType: this.model.uniqueCode ? this.model.uniqueCode.AccountType : '',
          GeojitUniqueCode: this.model.uniqueCode ? this.model.uniqueCode.AccountCode : '',
          PanNo: this.model.PanNo ? this.model.PanNo.PAN : '',
          CinNo: this.model.Cin ? this.model.Cin.CINNo : '',
          KitNo: this.model.kitno ? this.model.kitno.AccountKitNo : '',
          AccountSerialNo: this.model.accslno ? this.model.accslno.AccountSerialNo : 0,
          BookletSerialNo: this.model.slno ? this.model.slno.BookletSerialNo : 0,
          Euser: this.currentUser.userCode,
          RecordType: 'POSTACCOPEN'
        }],
      "requestId": "6041",
      "outTblCount": "0"
    }).then((response) => {
      debugger
      if (response && response.results) {
        if (response.results[0][0].PANNo == "") {
          this.notif.warning('warning', 'Nothing To View')
          this.isSpinning = false;
          return;
        }

        //  this.totalData=response.results[0][0]
        this.Trading = response.results[0][0].Trading_Account == true ? true : false
        this.NSDL = response.results[0][0].NSDL_Account == true ? true : false
        this.CDSL = response.results[0][0].CDSL_Account == true ? true : false
        this.poasigned = response.results[0][0].POASigned
        this.poasigneddate = response.results[0][0].POASignedDate ? response.results[0][0].POASignedDate : ''
        this.poadebited = response.results[0][0].POADebited
        this.poadebiteddate = response.results[0][0].POADebitedDate ? response.results[0][0].POADebitedDate : ''
        this.poastamped = response.results[0][0].POAStamped
        this.tradingregionname = response.results[0][0].TradingRegionName
        this.TradingLocation = response.results[0][0].TradingLocation
        this.tradecode = response.results[0][0].TradingTradeCode
        this.tradinglocname = response.results[0][0].TradingLocationName
        this.dpaccid = response.results[0][0].DpAccountId
        this.dpaccbenid = response.results[0][0].DpAccountBenId
        this.initialstatus = response.results[0][0].FirstHolder_KRAInitialStatus
        this.updatestaus = response.results[0][0].FirstHolder_KRAUpdateStatus
        this.TempDPClientID = response.results[0][0].TempDPClientID
        this.ClientId = response.results[0][0].ClientId
        this.model.pouchno = response.results[0][0].PouchSerialNo
        this.dcmntrecieved = response.results[0][0].BookReceivedFlag == true ? true : false
        this.dcmntrecieved1 = response.results[0][0].BookReceivedFlag == true ? true : false
        this.StoreName = response.results[0][0].StoreName
        this.receiveddate = response.results[0][0].BookReceivedDate ? response.results[0][0].BookReceivedDate : new Date();
        this.pouchslnoDetails = response.results[1]
        this.pouchslnoDetailsHead = Object.keys(response.results[1][0])


        //  this.dcobDetailsHead=Object.keys(re sponse.results[2][0])
        this.MTF = response.results[0][0].MTFAccount

        this.EnrolDate = response.results[0][0].EnrolDate ? response.results[0][0].EnrolDate : ''
        this.DDPIstamped = response.results[0][0].ddpistamped

        this.passedtoauditor = response.results[0][0].PassedToAuditorFlag == true ? true : false
        this.B2BPartner = response.results[0][0].B2B_Partner
        if (response.results[0][0].B2B_Account == "") {
          this.DDPIStatus = true;
          this.B2B = false;
        }
        if (response.results[0][0].B2B_Account == true) {
          debugger
          this.B2B = true
          this.DDPIStatus = true;
        }
        this.holdername = response.results[0][0].FirstHolderName
        this.holderpan = response.results[0][0].FirstHolderPANNo
        this.code = response.results[0][0].TradingAccountType
        this.acctype = response.results[0][0].TradingAccountName
        this.dpcode = response.results[0][0].DpAccountType
        this.subtype = response.results[0][0].DpAccountName
        this.holderno = response.results[0][0].NoofHolder
        this.Secondholdername = response.results[0][0].SecondHolderName
        this.Secondholderpan = response.results[0][0].SecondHolderPANNo
        this.POAScannedFlag = response.results[0][0].POAScannedFlag
        console.log(" this.POAScannedFlag ", this.POAScannedFlag);

        this.KitNo = response.results[0][0].KitNo ? response.results[0][0].KitNo : ''
        this.value = response.results[0][0].BarCodeId
        this.dcobDetails = response.results[2] ? response.results[2] : []
        if (this.dcobDetails != []) {
          for (var i = 0; i <= this.dcobDetails.length - 1; i++) {
            this.dcobDetails[i].RECEIVED == true ? this.dcobDetails[i].RECEIVED = 'Y' : this.dcobDetails[i].RECEIVED = 'N'
            this.dcobDetails[i].sts == true ? this.dcobDetails[i].sts = 'Y' : this.dcobDetails[i].sts = 'N'
            if (this.KitNo[0] == 'D')
              this.dcobDetails[i].RECEIVEDDATE = this.dcobDetails[i].RECEIVEDDATE != '' ? this.FormatDate(this.dcobDetails[i].RECEIVEDDATE) : this.dcobDetails[i].RECEIVEDDATE != ''
          }
        }
        this.isSpinning = false;

      }

      this.isSpinning = false;
    })

  }
  save() {
    if (this.receiveddate == null || this.receiveddate == undefined) {
      this.notif.warning("Received Date is required", '')
      return;

    }
    if (this.dcmntrecieved == false && this.B2BPartner !=='ESAF') {
      this.notif.warning("Please tick the document received", '')
      return;

    }
    this.a = this.a + 1
    if (this.dcobDetails.length > 0) {
      var dcobDetails = [...this.dcobDetails]
      for (let i = 0; i < dcobDetails.length; i++) {
        if (dcobDetails[i].RECEIVED == 'Y' && (dcobDetails[i].RECEIVEDDATE == null || dcobDetails[i].RECEIVEDDATE == "" || dcobDetails[i].RECEIVEDDATE == undefined)) {
          this.notif.warning("Please select received date", '');
          return;
        }
        if (dcobDetails[i].RECEIVED == 'N') {
          // this.dcobDetails.splice(i,1)
          this.dcobDetails.splice(this.dcobDetails.findIndex(it => it.Docname == dcobDetails[i].Docname), 1)
        }
      }
      if (this.dcobDetails.length > 0) {
        this.Savedcobdoc();
      }
    }
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.holderpan ? this.holderpan : '',
          Cin: this.model.Cin ? this.model.Cin.CINNo : '',
          GeojitUnicode: this.model.uniqueCode ? this.model.uniqueCode.AccountCode : '',
          KitNumber: this.model.kitno ? this.model.kitno.AccountKitNo : '',
          BookletSerialNo: this.model.slno ? this.model.slno.BookletSerialNo : 0,
          AccSerialNo: this.model.accslno ? this.model.accslno.AccountSerialNo : 0,
          FirstHolderName: this.holdername ? this.holdername : '',
          TradingAccType: this.code ? this.code : '',
          TradingAccName: this.acctype ? this.acctype : '',
          DpAccType: this.dpcode ? this.dpcode : '',
          DpAccSubType: this.subtype ? this.subtype : '',
          NoOfHolders: this.holderno ? this.holderno : 0,
          Param_BookReceivedFlag: this.dcmntrecieved == true ? 'Y' : 'N',
          PassedToAuditorFlag: this.passedtoauditor == true ? 'Y' : 'N',
          Param_BookReceivedDate: this.receiveddate ? moment(this.receiveddate).format(AppConfig.dateFormat.apiMoment) : '',
          poasigned: this.poasigned == true ? 'Y' : 'N',
          poasigneddate: this.poasigneddate ? moment(this.poasigneddate).format(AppConfig.dateFormat.apiMoment) : '',
          poadebited: this.poadebited == true ? 'Y' : 'N',
          poadebiteddate: this.poadebiteddate ? moment(this.poadebiteddate).format(AppConfig.dateFormat.apiMoment) : '',
          poastamped: this.poastamped == true ? 'Y' : 'N',
          tradingregionname: this.tradingregionname ? this.tradingregionname : '',
          TradingLocation: this.TradingLocation ? this.TradingLocation : '',
          tradecode: this.tradecode ? this.tradecode : '',
          tradinglocname: this.tradinglocname ? this.tradinglocname : '',
          dpaccid: this.dpaccid ? this.dpaccid : '',
          dpaccbenid: this.dpaccbenid ? this.dpaccbenid : '',
          KRA_initialstatus: this.initialstatus ? this.initialstatus : '',
          KRA_updatestaus: this.updatestaus ? this.updatestaus : '',
          TempDPClientID: this.TempDPClientID ? this.TempDPClientID : 0,
          ClientId: this.ClientId ? this.ClientId : '',
          boxno: this.boxno ? this.boxno : 0,
          RecordType: this.model.crforpostacc,
          NSDL: this.NSDL == true ? 'Y' : 'N',
          CDSL: this.CDSL == true ? 'Y' : 'N',
          Trading: this.Trading == true ? 'Y' : 'N',
          b2b: this.B2B == true ? 'Y' : 'N',
          b2bpartner: this.B2BPartner ? this.B2BPartner : '',
          slno: this.slno ? this.slno : 0,
          Euser: this.currentUser.userCode,
          PouchSerialNo: this.model.pouchno ? this.model.pouchno : 0,
          EnrolDate: moment(this.EnrolDate).format(AppConfig.dateFormat.apiMoment),
          MTFAccount: this.MTF == true ? 'Y' : 'N',
          REGION: '',
          Secondholdername: this.Secondholdername ? this.Secondholdername : '',
          Secondholderpan: this.Secondholderpan ? this.Secondholderpan : '',
          ddpistamped: this.DDPIstamped == true ? 'Y' : 'N',
        }],
      "requestId": "6042",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {


        // this.html_print=response.results[0][0].html
        this.notif.success("Booklet saved successFully", '')
        this.value = response.results[0][0].BarCodeId
        this.isSpinning = false;
        setTimeout(() => {
          let el: HTMLElement = document.getElementById('btnPrint') as HTMLElement;
          el.click();
          this.reset();
        }, 300)
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
        this.isSpinning = false;
      }
    })

  }

  // hidevalues(data,e){
  //   if(data.POADebited=='N'){
  //     this.hideval=true;
  //     return;
  //   }else{
  //     this.hideval=false;
  //     return;
  //   }
  // }

  getdate(data) {
    if (data.Accepted) {
      var d = new Date()
      data.acceptDate = moment(d).format(AppConfig.dateFormat.apiMoment)
    }


  }
  onChangeRegion(data) {
    this.holdername = null
    this.holderpan = null
    this.code = null
    this.acctype = null
    this.dpcode = null
    this.subtype = null
    this.holderno = null
    this.Trading = false
    this.NSDL = false
    this.CDSL = false
    this.B2B = false
    this.model.PanNo = data
    this.model.Cin = data
    this.model.uniqueCode = data

    this.model.kitno = data
    this.model.slno = data
    this.model.accslno = data
    if (data != null) {
      this.kinoforreport = data.AccountKitNo
      this.bookletslno = data.BookletSerialNo
      this.accslnoforreport = data.AccountSerialNo
      this.dateforreport = moment(this.receiveddate).format(AppConfig.dateFormat.apiMoment)
      this.getData();
      this.buttonactive = false
    } else {
      this.buttonactive = true
    }


  }

  getPouchSlno() {
    if (this.model.pouchno != null) {
      this.isVisibleRejection = true
    }
  }

  handleCancel() {
    this.isVisibleRejection = false

  }

  SetPendingdata(data) {
    this.model.pouchno = data.BookletSerialNo
    this.isVisibleRejection = false
  }


  getScannedData() {
    debugger
    if (!this.poastamped && !this.DDPIstamped) {
      return;
    }
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          RecordType: this.model.crforpostacc ? this.model.crforpostacc : '',
          AccountSerialNo: this.model.accslno ? this.model.accslno.AccountSerialNo : 0,
          ClientID: this.ClientId ? this.ClientId : 0,
          Location: this.TradingLocation ? this.TradingLocation : '',
          kitno: this.KitNo ? this.KitNo : '',
          EUser: this.currentUser.userCode
        }],
      "requestId": "6082",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response.errorCode == 0) {
        debugger
        this.Scanneditems = response.results[0]
        this.Scanneditems_temp = response.results[0]
        for (var i = 0; i <= this.Scanneditems.length - 1; i++) {
          if (this.Scanneditems[i].DOCImage != null) {
            let image = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.Scanneditems[i].DOCImage) ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.Scanneditems[i].DOCImage) : '';
            // let image=this.Scanneditems[i].DOCImage)? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+this.Scanneditems[i].DOCImage):'';
            this.scannedImages.push(image)
          }
        }
        this.scannedImages1 = this.scannedImages[0]
        this.scannedImages2 = this.scannedImages[1]
        this.scannedImages3 = this.scannedImages[2]

        if (this.Scanneditems.length > 0) {
          this.scanimagevisible = this.POAScannedFlag
        }
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
      }
    }, (error) => {
      this.isSpinning = false;
    })
  }
  handleCancelscan() {
    // this.POAScannfalseedFlag=
    this.scanimagevisible = false;
    // this.POAScannedFlag=false
    this.scannedImages = []
    this.modalsave = true
    // this.allowCameraSwitch=true
    // WebcamImage:null
    // this.showWebcam = !this.showWebcam;
    // this.WebcamImage1=null
  }

  getimageData(data) {
    this.degree = 0
    // this.showcrop=true
    // event.type="change"
    // this.context = this.myCanvas.getContext('2d');
    // this.context.drawImage(this.scannedImages1, this.myCanvas.width / 2 - this.scannedImages1.width / 2, this.myCanvas.height / 2 - this.scannedImages1.width / 2);
    if (data == '1') {
      this.firstImage = false
      this.secondImage = true
      this.thirdImage = true
      this.scancamera = true
      this.firsthover = true
      this.secondhover = false
      this.thirdhover = false




      // this.imageCropped(this.scannedImages1)
    }
    else if (data == '2') {
      this.secondImage = false
      this.firstImage = true
      this.thirdImage = true
      this.scancamera = true
      this.secondhover = true
      this.thirdhover = false
      this.firsthover = false
    }
    else if (data == '3') {
      this.secondImage = true
      this.firstImage = true
      this.thirdImage = false
      this.scancamera = true
      this.thirdhover = true
      this.firsthover = false
      this.secondhover = false
    }
  }

  handleSavescan() {

    // this.Scanneditems.splice(0, 1)
    // this.Scanneditems.push(insertimage)
    // for(var i=0;i<=this.Scanneditems.length-1;i++){
    // let image=this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+this.Scanneditems[i].DOCImage)? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+this.Scanneditems[0].DOCImage):'';
    // let dataUrl2 = this.scannedImages2.toString();

    //  let dataUrl3 = this.scannedImages3.toString();
    // let document3= dataUrl3.split(',')[1];
    // let document1 = this.scannedImages1.changingThisBreaksApplicationSecurity.toString().split(',')[1];
    //let document1= dataUrl1
    let document1, document2, document3
    if (this.scannedImages1) {
      document1 = this.scannedImages1.changingThisBreaksApplicationSecurity ? this.scannedImages1.changingThisBreaksApplicationSecurity.toString().split(',')[1] : this.scannedImages1.toString().split(',')[1]
    }
    if (this.scannedImages2) {
      document2 = this.scannedImages2.changingThisBreaksApplicationSecurity ? this.scannedImages2.changingThisBreaksApplicationSecurity.toString().split(',')[1] : this.scannedImages2.toString().split(',')[1]
    }
    if (this.scannedImages3) {
      document3 = this.scannedImages3.changingThisBreaksApplicationSecurity ? this.scannedImages3.changingThisBreaksApplicationSecurity.toString().split(',')[1] : this.scannedImages3.toString().split(',')[1]
    }
    // changingThisBreaksApplicationSecurity
    this.Scanneditems[0].DOCImage = document1
    this.Scanneditems[1].DOCImage = document2 ? document2 : ''
    this.Scanneditems[2].DOCImage = document3 ? document3 : ''

    // }
    var JSONData = this.utilServ.setJSONArray(this.Scanneditems);
    var xmlData = jsonxml(JSONData);

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          RecordType: this.model.crforpostacc ? this.model.crforpostacc : '',
          AccountSerialNo: this.model.accslno ? this.model.accslno.AccountSerialNo : 0,
          ClientID: this.ClientId ? this.ClientId : 0,
          Name: this.holdername ? this.holdername : '',
          Location: this.TradingLocation ? this.TradingLocation : '',
          ScanImageXml: xmlData,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6083",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        this.notif.success("Image Saved Successfully", '')
        this.handleCancelscan();
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
      }
    })
  }

  confirmation(data): void {
    this.modalService.confirm({
      nzTitle: 'This is confirmation message',
      nzContent: 'You want to close the window'
    });
  }
  rotateimage(Img) {
    this.degree += 90
    var canvas = document.createElement("canvas");
    var img = new Image();
    img.src = Img;
    if (this.degree == 90) {
      canvas.height = img.width;
      canvas.width = img.height;

    } else if (this.degree == 180) {
      canvas.height = img.height;
      canvas.width = img.width;
    } else if (this.degree == 270) {
      canvas.height = img.width;
      canvas.width = img.height;
    } else if (this.degree == 360) {
      canvas.height = img.height;
      canvas.width = img.width;
      this.degree = 0
    }

    var context = canvas.getContext("2d");
    context.translate(canvas.width / 2, canvas.height / 2);
    // context.translate(img.width, img.height);
    context.rotate(this.degree * Math.PI / 180);
    context.drawImage(img, -img.width / 2, -img.height / 2);
    var rotatedImageSrc = canvas.toDataURL();
    if (!this.firstImage) {
      this.scannedImages1 = rotatedImageSrc
    } else if (!this.secondImage) {
      this.scannedImages2 = rotatedImageSrc
    } else if (!this.thirdImage) {
      this.scannedImages3 = rotatedImageSrc
    }
  }

  rotateimage1() {

    if (!this.firstImage) {
      this.rotateimage(this.scannedImages1.changingThisBreaksApplicationSecurity ? this.scannedImages1.changingThisBreaksApplicationSecurity : this.scannedImages1)
    } else if (!this.secondImage) {
      this.rotateimage(this.scannedImages2.changingThisBreaksApplicationSecurity ? this.scannedImages2.changingThisBreaksApplicationSecurity : this.scannedImages2)
    } else if (!this.thirdImage) {
      this.rotateimage(this.scannedImages3.changingThisBreaksApplicationSecurity ? this.scannedImages3.changingThisBreaksApplicationSecurity : this.scannedImages3)
    }
  }
  Savedcobdoc() {
    var JSONData = this.setJSONArray_DUP(this.dcobDetails);
    var xmlData = jsonxml(JSONData);
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Clientid: this.ClientId ? this.ClientId : 0,
          Str: xmlData,
          Euser: this.currentUser.userCode ? this.currentUser.userCode : ''
        }],
      "requestId": "6086",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        this.notif.success("Data Saved Successfully", '')
        this.dcobDetails = []
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
      }
    })
  }

  setJSONArray_DUP(jsonArray: any) {
    let array = [];
    // array=jsonArray
    // let keys = array[0].Object.keys();


    for (let i = 0; i < jsonArray.length; i++) {
      array.push({ "REC": [] });
      let keys = Object.keys(jsonArray[i])
      for (let j = 0; j < keys.length - 1; j++) {
        let val1 = keys[j]
        let val = jsonArray[i][val1]
        array[i]["REC"].push({ "FLD": val });
      }

      // array[0].Document[i].Data[0] = jsonArray[i];
    }
    return array;
  }
  resetDate(data, index) {
    if (data.RECEIVED == 'N') {
      this.dcobDetails[index].RECEIVEDDATE = ''
    }
  }


  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };

  FormatDate(date) {
    var day = date.split('.')[0]
    var month = date.split('.')[1]
    var year = date.split('.')[2]
    var formateddate = year + '-' + month + '-' + day
    return formateddate
  }
  ticked(data) {
    if (data) {
      this.dcobDetails[1].RECEIVEDDATE = new Date();
      this.dcobDetails[1].RECEIVED = 'Y'
    }
  }


}
