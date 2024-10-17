import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, User, UtilService, WorkspaceService } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzModalService, NzNotificationService, UploadFile, UploadFilter } from 'ng-zorro-antd';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import * as Chart from 'chart.js';
import { Observable, Observer } from 'rxjs';
import * as  jsonxml from 'jsontoxml'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
// import jsPDF from 'jspdf';


export interface reportFilter {
  fromDate: any;
  toDate: any;
}
@Component({
  selector: 'app-kra',
  templateUrl: './kra.component.html',
  styleUrls: ['./kra.component.less']
})
export class KRAComponent implements OnInit {
  // @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  // model: PostAccountOpening;
  // fileContent: string = '';
  uints = [];
  urlDATA: any;
  fileContent: any;
  public pageData: Array<any>;
  recordTableLength: any;
  currentPage: number = 1;
  recordPerPage: number = 10;
  date: any = {};
  dates: reportFilter;
  today = new Date();
  fromDate = 1 - 11 - 2022;
  html;
  pdfData: any
  URL: any;
  doc: any;
  totalDrwerPages: any;
  buttonContent: any;
  processData: boolean = false;
  isLoading: boolean = false;
  clientData: boolean = false;
  crfData: boolean = false;
  showdrwer: boolean = false;
  showdrwerPdf: boolean = false;
  showdrwerKra: boolean = false;
  visible: boolean = false;
  isSpinVisible: boolean = false;
  downloadPdf: boolean = false;
  downloadXml: boolean = false;
  downloadExcel: boolean = false;
  heading: any;
  htmlmodal: any;
  // pageIndexVal: any;
  pageIndexVal: any = 1;
  totalPages: any;
  pages: any;
  upload: any;
  uploadBtn: any;
  filegen1: any = '';
  filegen2: any = '';
  file: any;
  fileName: any;
  FileTypelist = [];
  dwnlodBtn: any;
  options: any;
  dropDownOpt: any;
  viewtoken: any;
  uplodfilename: any;
  // failedRecords: boolean = false;
  isVisible: boolean = false;
  filterSearch: boolean = false;
  filterSearchPan: boolean = false;
  filterSearchApp: boolean = false;
  isMobile: boolean = false;
  uploadButton: boolean = false;
  tableContentsTrue: boolean = false;
  recordTable: any;
  totalPdf: any;
  totalXml: any;
  pdfPercent: any;
  xmlPercent: any;
  totalKraXmlPer: any;
  successPdfPercent: any;
  successXmlPercent: any;
  successKraXmlPercent: any;
  xmlFailurePercent: any;
  pdfFailurePercent: any;
  kraXmlFailurePercent: any;
  kraXmlData: any;
  kraXmlData2: any;
  panSearch: any;
  appSearch: any;
  kraCilents: any;
  reqKraClients: any;
  totalKraClients: any;
  reportingStatus: any;
  kraReport: any;
  KraR: any;
  ReportS: any;
  doneKra: any;
  headers: any;
  rows: any;
  progressDataColumns: any;
  progressData: any;
  Reporttypes: any;
  ReportTypes: any;
  dropDown: any;
  dataTable: any;
  ReportFindopt: FindOptions;
  filterFindopt: FindOptions;
  htmlContent: any;
  Report: any;
  summary: any;
  TOTAL: any;
  DONE: any;
  PENDING: any;
  PieChart: any = [];
  modalHeader: any
  spacevalidator: boolean = false;
  filevalidator: boolean = false
  // doughnutChart:any;
  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef | undefined;
  piedata: any = [];
  pieSource: any = [];
  pieTotalcount: any = [];
  pieColor: any = [];
  treeData: any = [];
  nomineeIdfileList1: any;
  nomineeIdfileList2: any;
  msg: any;
  currentUser: User;
  drawerTable: any;
  drawerName: any;
  // nc:String;
  // form: FormGroup;
  tableContents: any;
  Columns: any;
  shwPg: boolean = false;
  ClientRow = ['Process', 'Records', 'Progress', 'Reporting Status']
  token: any;
  tokenObj: any[];
  encryptedData: any;
  modalVisible: boolean = false;
  modalColumns: any;
  isOkLoading: boolean = false;
  SearchButton:boolean=false;
  Search:any;
  rpt:any;
  tokenGenerate:any;
  datePipe: DatePipe = new DatePipe('en-US');
  kraTypes:Array<any>=[]
  kraType:string=''
  kraTypeShow:boolean=false
  manualXmlFromDate
  manualXmlToDate
  manualXmlDateShow:boolean=false
  // manualXmlKraTypes:Array<any>=[{manualXmlKraType:'test'}]
  manualXmlKraTypeShow:boolean=false
  kraModes:Array<any>=[]
  kraMode:string=''
  kraModeShow:boolean=false
  selectFileDisable:boolean =false
  manualXmlDateDisable:boolean =false
  resetButtonShow:boolean =false
  errorMsg:string=''
  constructor(
    private notif: NzNotificationService,
    private dataServ: DataService,
    private utilServ: UtilService,
    // private fb: FormBuilder,
    private authServ: AuthService,
    private wsServ: WorkspaceService,
    private http: HttpClient,
    // private comnDtServ: CommonDataService,
    private sanitizer: DomSanitizer,
    private modelService:NzModalService
  ) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.ReportFindopt = {
      findType: 5006,
      codeColumn: 'ReportType',
      codeLabel: 'ReportType',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.filterFindopt = {
      findType: 5006,
      codeColumn: 'DROPDOWN',
      codeLabel: 'DROPDOWN',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }

  ngOnInit() {
    var date = new Date();
    this.date.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.date.td = new Date();
    this.manualXmlFromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.manualXmlToDate = new Date();
    this.date.nc = 'N';
    // this.date.doctype = 'DCOB';
    this.date.searchBtns = 'P';
    this.filterSearchPan = true;
    this.processData = true;
    this.errorMsg=''
    this.getReport();
    // this.downloadExcel=true;

    // this.Report=this.Reporttypes[1].ReportType;
    // console.log(this.Reporttypes[1].ReportType)


  }

  getReport() {
    this.isLoading =true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: 'GIT'
        }],
      "requestId": "700310"
    }).then((response) => {
      this.isLoading =false
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ Euser: '' }];
          // this.Reporttypes = ar.concat(this.utilServ.convertToObject(response[0]));
          this.Reporttypes = (this.utilServ.convertToObject(response[0]));
          // console.log(this.Reporttypes)
          // this.ReportTypes = this.Reporttypes[0].Euser;
          this.ReportTypes = this.Reporttypes[0].ReportType;

          // this.options = ar.concat(this.utilServ.convertToObject(response[1]));
          this.options = (this.utilServ.convertToObject(response[1]));
          this.dropDownOpt = this.options[0].DROPDOWN;


          // console.log(this.options)
          // this.upload = this.utilServ.convertToObject(response[0])
          // console.log(this.upload)
          this.uploadBtn = this.Reporttypes[0].Button;
          this.dwnlodBtn = this.Reporttypes[0].Download_Button;
          this.buttonContent = this.Reporttypes[0].Button_Name;
          this.Search = this.Reporttypes[0].Search;
          this.tokenGenerate=this.Reporttypes[0].Token;
          this.kraTypeShow=this.Reporttypes[0].kraTypeShow
          this.manualXmlDateShow=this.Reporttypes[0].manualXmlDateShow
          this.manualXmlKraTypeShow=this.Reporttypes[0].manualXmlKraTypeShow
          this.kraModeShow=this.Reporttypes[0].kraModeShow

          this.resetButtonShow=this.Reporttypes[0].resetButtonShow//true// RESET button set for manual kra xml file generation
          //KRA Types dropdown from db
          this.kraTypes = this.utilServ.convertToObject(response[2])
          this.kraType =this.kraTypes[0].KRAType
          //KRA Types dropdown for manual xml file genration from db
          // this.manualXmlKraType =this.kraTypes[0].KRAType
          //KRA Modes dropdown from db
          this.kraModes = this.utilServ.convertToObject(response[3])
          this.kraMode =this.kraModes[0].KRAMode
          console.log(this.tokenGenerate);
          console.log(this.Search);

          // console.log("uploadBtn", this.uploadBtn)
          if (this.uploadBtn) {
            // debugger
            this.uploadButton = true;
          }
          else {
            this.uploadButton = false;
          }
          if (this.Search) {
            debugger
            this.SearchButton = true;
          }
          else {
            this.SearchButton = false;
          }
          // if (this.dwnlodBtn == 'XL') {
          //   // debugger
          //   this.downloadExcel = true;
          // }
          // if (this.dwnlodBtn == 'XML') {
          //   this.downloadXml = true;
          // }
          // if (this.dwnlodBtn == 'PDF') {
          //   this.downloadPdf = true;
          // }
        }
      }
    });
  }
  getReportType(data) {
    this.ReportFindopt = {
      findType: 5006,
      codeColumn: 'DROPDOWN',
      codeLabel: 'DROPDOWN',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "ReportTypes ='" + data + "'"
    }

    // debugger
    this.tableContentsTrue = false;
    // this.tableContents=[];
    // !this.tableContents
    this.headers = [];
    this.totalPages = [];
    // this.selectFileDisable=false
    // if(this.ReportTypes ==='Manual XML File Generation')
    // {
    // }
    this.manualXmlReset()
    this.uploadOpt();
    // this.getReport()
    this.nomineeIdfileList1 = [];
    this.nomineeIdfileList2 = [];
  }
  getOptions(data) {
    this.filterFindopt = {
      findType: 5006,
      codeColumn: 'ReportType',
      codeLabel: 'ReportType',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "dropDownOpt ='" + data + "'"
    }
  }
  uploadOpt() {
    // console.log("uploadBtn", this.uploadBtn)
    this.isLoading = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: 'GIT'
        }],
      "requestId": "700310"
    }).then((response) => {
      this.isLoading = false;
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          const index = this.Reporttypes.findIndex((item) => item.ReportType === this.ReportTypes);
          // console.log(index)
          let i = index
          this.uploadBtn = this.Reporttypes[i].Button;
          this.dwnlodBtn = this.Reporttypes[i].Download_Button;
          this.Search = this.Reporttypes[i].Search;
          this.tokenGenerate=this.Reporttypes[i].Token;
          this.kraTypeShow=this.Reporttypes[i].kraTypeShow
          this.manualXmlDateShow=this.Reporttypes[i].manualXmlDateShow
          this.manualXmlKraTypeShow=this.Reporttypes[i].manualXmlKraTypeShow
          this.kraModeShow=this.Reporttypes[i].kraModeShow
          this.resetButtonShow=this.Reporttypes[i].resetButtonShow
          //selection reset
          this.kraType =this.kraTypes[0].KRAType
          // this.manualXmlKraType =this.kraTypes[0].KRAType
          this.kraMode =this.kraModes[0].KRAMode
          console.log(this.tokenGenerate);
          // console.log("dwnlodBtn", this.dwnlodBtn)
          if (this.uploadBtn) {
            // debugger
            this.uploadButton = true;
            this.buttonContent = this.Reporttypes[i].Button_Name;
            // if (this.nomineeIdfileList1[0].name == '' || this.nomineeIdfileList1[0].name == null) {
            //   debugger
            //   this.isLoading = false;
            //   this.notif.warning('please select a file', '')
            // }
          }
          else {
            this.uploadButton = false;
          }
          if (this.Search) {
            debugger
            this.SearchButton = true;
          }
          else {
            this.SearchButton = false;
          }
        }
      }
    });
  }
  Viewdata() {
    this.htmlContent = [];
    this.appSearch = [];
    this.clientData = false;
    if (!this.date.fd) {
      this.isLoading = false;
      this.notif.error("Please Select From Date ", '');
      return
    }
    if (!this.date.td) {
      this.isLoading = false;
      this.notif.error("Please Select To Date", '');
      return
    }
    if (new Date(this.datePipe.transform(this.date.td)) < new Date(this.datePipe.transform(this.date.fd))) {
      this.isLoading = false;
      this.notif.error("Invalid Date Selection", '');
      return
    }
    if (this.date.nc == "") {
      // this.notif.error("No data found", '');
      // debugger
      this.notif.error("Please select New Client or CRF", "")
      return
    }
    // console.log("new cilent", this.date.nc)

    // else {
    // if ((this.date.nc == 'N' && this.date.doctype == 'DIGITAL') || (this.date.nc == 'N' && this.date.doctype == 'A')) {
    if (this.date.nc == 'N') {
      // this.clientData = true;
      this.isLoading = true;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            // KitType: this.date.doctype,
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: "",
            // PageNum:1,
            PageNum: this.pageIndexVal,
            RecCnt: 10,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: "",
            Download: ""

          }],
        "requestId": "700260",
        "outTblCount": "0"
      }).then((response) => {
        // console.log("response", response)
        this.isLoading = false;
        // if (response.errorCode == 0) {
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, '')
        }
        else {
          // console.log("pageIndexVal", this.pageIndexVal)
          this.progressData = this.utilServ.convertToObject(response[0]);
          // this.drawerName= this.progressData[]
          // let otherData =this.progressData.Others
          // console.log("otherData",otherData)
          // console.log("progressData", this.progressData)
          this.progressDataColumns = Object.keys(response[0]);
          // console.log("progressDataColumns", this.progressDataColumns)
          this.kraCilents = this.utilServ.convertToResultArray(response[1]);
          // console.log("kraCilents", this.kraCilents)
          this.Columns = Object.keys(this.kraCilents[0]);
          // console.log(this.Columns);
          this.rows = response[1].rows[0];
          this.reportingStatus = this.progressData[0]['Reporting Status']
          // this.successXmlPercent =this.progressData[0]['Success Percentage'];
          // this.xmlFailurePercent= this.progressData[0]['FailurePercentage'];
          // this.totalXml =this.successXmlPercent + this.xmlFailurePercent;
          // console.log(this.totalXml);
          this.summary = this.utilServ.convertToResultArray(response[2]);
          this.TOTAL = this.summary[0].TOTAL
          this.DONE = this.summary[0].DONE
          this.PENDING = this.summary[0].PENDING
          // this.totalPages = this.pages[0].TotalRowCount
          // console.log("TOTAL", this.TOTAL)
          // console.log(this.totalXml);
          //   this.upload = this.utilServ.convertToObject(response[5]);
          // this.uploadBtn = this.upload[0].Upload_Button
          // console.log("uploadBtn", this.uploadBtn)
          // }
          // else {
          //   this.isLoading = false;
          //   this.notif.error(response.errorMsg, '');
        }
      })

    }

    if (this.date.nc == 'C') {
      this.isLoading = false;
      // this.clientData = false;
      this.notif.error("No data found", '');
      this.Reset();
      return
    }
  }
  downloadView()
  {
    if(this.ReportTypes ==='KRA Re-upload')
    {
    this.modelService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Do you confirm re-upload</b>',
      nzOkText: 'YES',
      nzCancelText: 'NO',
      nzOnOk: () => {
        this.downloadViewApi()
      },
      nzOnCancel: () => {
        this.nomineeIdfileList1 = []
      }
    })
    }
    else
    {
      this.downloadViewApi()
    }
  }

  downloadViewApi() {
    // console.log(this.dwnlodBtn);
    this.isLoading = true;
    if (this.dwnlodBtn == 'XL') {
      this.uploadButton = this.ReportTypes ==='KRA Re-upload' || 'Manual XML File Generation'?true:false;

      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            // KitType: this.date.doctype,
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: this.ReportTypes,
            PageNum: 1,
            // PageNum: this.pageIndexVal,
            RecCnt: 10,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: this.ReportTypes ==='KRA Re-upload' || this.ReportTypes === 'Manual XML File Generation'?(this.nomineeIdfileList1[0]?this.nomineeIdfileList1[0].name:""):"",
            // ClientSerialNoFile:"" || this.nomineeIdfileList1[0].name ,
            Download: "",
            KRAType:this.ReportTypes ==='KRA Re-upload'?this.kraType:''

          }],
        "requestId": "700260",
        "outTblCount": "0"
      }).then((response) => {
        // console.log("response", response)
        // console.log("ReportTypes", this.ReportTypes)
        this.isLoading = false;
        // if (response.errorCode == 0) {
        // if(response && response.errorCode==0) {
        // this.dataTable = this.utilServ.convertToObject(response[2]);
        // this.htmlContent = this.dataTable[0].HTML
        //  console.log(this.htmlContent);
        if (response.errorMsg) {
          // debugger
          this.notif.error(response.errorMsg, '')
          this.tableContentsTrue = false

        }
        else {
          if(this.ReportTypes ==='Manual XML File Generation' || this.ReportTypes ==='KRA Re-upload')
          {
            let resp1 =this.utilServ.convertToObject(response[0])
            if( resp1[0] && resp1[0].Error_Code ==0)
            {
              this.notif.success(resp1[0].errorMsg, '')
              // this.manualXmlReset()
              this.nomineeIdfileList1=[]
          }
          else
          {
            this.notif.error(resp1[0].errorMsg, '')
          }
        }
        else
        {
          this.pages = this.utilServ.convertToObject(response[3]);
          // this.totalPages = this.pages[0].TOTAL
          this.totalPages = this.pages[0].TotalRowCount

          // if(this.totalPages.length>10){
          //   this.shwPg=true
          // }
          this.tableContents = this.utilServ.convertToObject(response[2]);
          // this.headers = Object.keys(this.tableContents[0])
          // console.log("tableContents", this.tableContents)
          // console.log("headers", this.headers)
          if (this.tableContents.length > 0) {
            // console.log("ok")
            this.headers = Object.keys(this.tableContents[0])
            this.tableContentsTrue = true


            this.tableContents.forEach((element, i) => {
              console.log("data", element)
              if (element.KRAChange == true) {
                // debugger
                element.KRAChange = "Y"
                console.log(element.KRAChange);

              } else if(element.KRAChange==false) {
                // debugger
                element.KRAChange = "N"
                console.log(element.KRAChange);
              }
            })
          }
          else {
            // console.log("ok")
            this.tableContentsTrue = false
            this.notif.warning('No Data Found', '')
          }
          if (this.tableContents.length > 0) {
            this.tableContents.forEach((element, index) => {
              // console.log("data", element)
            }

            )
          };
          // }
          // else {
          //   this.notif.error(response.errorMsg, '')
        }
        }
      })
    }
    if (this.dwnlodBtn == 'XML' || this.dwnlodBtn == 'PDF' || this.dwnlodBtn == 'AXML') {
      this.uploadButton = true;
      if (this.nomineeIdfileList1[0]) {
        // this.processFile(0);
        // debugger
        this.dataServ.getResponse({
          "batchStatus": "false",
          "detailArray":
            [{
              ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
              Status: "",
              // KitType: this.date.doctype,
              KitType: this.dropDownOpt,
              SerialNo: 0,
              PANNO: "",
              TradeCode: "",
              DocType: "",
              DPID: "",
              APPNo: "",
              ReportType: this.ReportTypes,
              PageNum: 1,
              // PageNum: this.pageIndexVal,
              RecCnt: 10,
              FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
              // Flag: "",
              Euser: this.currentUser.userCode,
              // ClientSerialNoFile: "",
              ClientSerialNoFile: this.nomineeIdfileList1[0].name,
              Download: ""
            }],
          "requestId": "700260",
          "outTblCount": "0"
        }).then((response) => {
          // console.log("response", response)

          this.isLoading = false;
          // if (response.errorCode == 0) {
          if (response.errorMsg) {
            // debugger
            this.notif.error(response.errorMsg, '')
            this.tableContentsTrue = false

          }
          else {
            if(this.ReportTypes ==='KRA Re-upload')
          {
            let resp1 =this.utilServ.convertToObject(response[0])
            if( resp1[0] && resp1[0].Error_Code ==0)
            {
              this.notif.success(resp1[0].errorMsg, '')
              this.manualXmlReset()
            }
          }
          else
          {
            // debugger
            this.pages = this.utilServ.convertToObject(response[3]);
            this.totalPages = this.pages[0].TotalRowCount

            this.tableContents = this.utilServ.convertToObject(response[2]);
            // this.tableContentsTrue = true
            // console.log("tableContents", this.tableContents)
            // console.log("totalPages", this.totalPages)
            if (this.tableContents.length > 0) {
              // console.log("ok")
              // debugger
              this.headers = Object.keys(this.tableContents[0])
              this.tableContentsTrue = true
              this.tableContents.forEach((element, index) => {
                // console.log("data", element)
              })

            }
            else {
              // console.log("ok")
              // debugger
              this.tableContentsTrue = false
              this.notif.warning('No Data Found', '')
            }
          }

          }
        })
      }

      else {
        this.isLoading = false;
        this.tableContentsTrue = false
        this.notif.error("Please select a File", '');
        return
      }
    }

  }
  // fileRemove=()=>{
  // this.token =''
  // return this.token='' ;
  // }

  fileChangeEvent = () => {

    // this.tableContentsTrue=false
    return (file: UploadFile): boolean => {
      this.nomineeIdfileList1 = [file];
      console.log(this.nomineeIdfileList1);
      //  NoWhitespaceRegExp: RegExp = new RegExp("\\S");
      // var strs = ['a  b c', ' a b b', 'a b c '];
      this.errorMsg=''
      if (file.type == 'text/csv') {

          this.manualXmlDateDisable=this.ReportTypes ==='Manual XML File Generation'?true:this.manualXmlDateDisable

        if (this.tokenGenerate==true) {
          this.generateToken();
        }
        else if(this.tokenGenerate==false){
          this.processFile(0)
        }

      }
      else {
        this.notif.error("Invalid File Format", "")
        this.nomineeIdfileList1 = []
        this.tableContentsTrue = false
        // this.token=''
        return false
      }

      return false;
    };
  }

  generateToken() {
    this.processFile(0)
    // console.log(this.nomineeIdfileList1[0].name);
    this.isLoading = true
    // if(this.nomineeIdfileList1[0].name){
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{

          ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
          Status: "",
          // KitType: this.date.doctype,
          KitType: this.dropDownOpt,
          SerialNo: 0,
          PANNO: "",
          TradeCode: "",
          DocType: "",
          DPID: "",
          APPNo: "",
          ReportType: this.ReportTypes,
          // PageNum:1,
          PageNum: this.pageIndexVal,
          RecCnt: 10,
          FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
          // Flag: "",
          Euser: this.currentUser.userCode,
          ClientSerialNoFile: this.nomineeIdfileList1[0].name,
          Download: ""

        }],
      "requestId": "700260",
      "outTblCount": "0"
    }).then((response) => {
      // debugger
      // console.log(response);
      this.isLoading = false
      // console.log(response.errorCode);

      if (response.errorMsg) {
        this.notif.error(response.errorMsg, '')
        this.token = ''
      }
      else {
        this.tokenObj = this.utilServ.convertToObject(response[3]);
        this.token = this.tokenObj[0].Token
        // console.log(this.token);
        return this.token
      }
      // this.processFile()
    })
    // }
  }
  // fileChangeEvent2 = () => {
  //   return (file: UploadFile): boolean => {
  //     this.nomineeIdfileList2 = [file];
  //     return false;
  //   };
  // }
  processFile(i) {

    // debugger
    return new Promise((resolve, reject) => {
      let val = this.nomineeIdfileList1;

      if (val) {
        val.status = "Processing";
        const formdata: FormData = new FormData();
        formdata.append('file', val[0]);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          // console.log("formdata", formdata);

          console.log("response", response);

          if (response && response.errorCode == 0) {
            this.fileName = response.fileName;
            resolve(this.fileName)
            // console.log("fileName", this.fileName);

            // this.updateData(this.fileName, 0)
            // debugger
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        });
      }
    });

  }
  // private updateData(fileName, i) {
  //   // if (i == 0) {
  //   // debugger
  //   // let parsedfilname
  //   // parsedfilname=JSON.stringify(fileName)
  //   // console.log("ufname", fileName);

  //   return new Promise((resolve, reject) => {
  //     this.dataServ.getResponse({
  //       "batchStatus": "false",
  //       "detailArray":
  //         [{

  //           ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
  //           Status: "",
  //           // KitType: this.date.doctype,
  //           KitType: this.dropDownOpt,
  //           SerialNo: 0,
  //           PANNO: "",
  //           TradeCode: "",
  //           DocType: "",
  //           DPID: "",
  //           APPNo: "",
  //           ReportType: this.ReportTypes,
  //           // PageNum:1,
  //           PageNum: this.pageIndexVal,
  //           RecCnt: 10,
  //           FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
  //           // Flag: "",
  //           Euser: this.currentUser.userCode,
  //           // ClientSerialNoFile: "",
  //           ClientSerialNoFile: this.nomineeIdfileList1[0].name,

  //         }],
  //       "requestId": "700260",
  //       "outTblCount": "0"
  //     }).then((response) => {
  //       // console.log("response", response)

  //       this.isLoading = false;
  //       // if (response.errorCode == 0) {
  //       if (response.errorMsg) {
  //         // debugger
  //         this.notif.error(response.errorMsg, '')
  //         this.tableContentsTrue = false

  //       }
  //       else {
  //         // debugger
  //         this.pages = this.utilServ.convertToObject(response[3]);
  //         this.totalPages = this.pages[0].TotalRowCount

  //         this.tableContents = this.utilServ.convertToObject(response[2]);
  //         // console.log("tableContents", this.tableContents)
  //         // console.log("totalPages", this.totalPages)
  //         if (this.tableContents.length > 0) {
  //           // console.log("ok")
  //           // debugger
  //           this.headers = Object.keys(this.tableContents[0])
  //           this.tableContentsTrue = true
  //           this.tableContents.forEach((element, index) => {
  //             // console.log("data", element)
  //           })
  //         }
  //         else {
  //           // console.log("ok")
  //           // debugger
  //           this.tableContentsTrue = false
  //           this.notif.warning('No Data Found', '')
  //         }
  //         // if (this.tableContents.length > 0) {

  //         // };
  //         // }
  //         // else {
  //         //   this.notif.error(response.errorMsg, '')
  //       }
  //     })
  //   })

  // }
  pageIndexChanged(index, data) {
    // debugger
    this.pageIndexVal = index;
    // console.log("pageIndexVal", this.pageIndexVal)
    this.isLoading = true;
    if (data == 'V') {
      if (this.nomineeIdfileList1.length != 0) {
        this.uplodfilename = this.nomineeIdfileList1[0].name
        // console.log(this.uplodfilename);

      }
      else {
        this.uplodfilename = '';
        // console.log(this.uplodfilename);

      }
      // if (this.nomineeIdfileList1[0].name) {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: this.ReportTypes,
            // PageNum:1,
            PageNum: this.pageIndexVal,
            RecCnt: 10,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            // ClientSerialNoFile: this.nomineeIdfileList1[0].name || ''
            ClientSerialNoFile: this.uplodfilename,
            Download: ""


          }],
        "requestId": "700260",
        "outTblCount": "0"
      }).then((response) => {
        this.isLoading = false;

        // if (response.errorCode == 0) {
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, '')
        }
        else {
          // // this.dataTable = this.utilServ.convertToObject(response[2]);
          // // this.htmlContent = this.dataTable[0].HTML
          // this.tableContents = this.utilServ.convertToObject(response[2]);
          // this.headers = Object.keys(this.tableContents[0])
          // this.pages = this.utilServ.convertToObject(response[3]);
          // // this.recordTableLength = this.recordTable.length
          // this.totalPages = this.pages[0].TotalRowCount
          // if (this.totalPages.length > 10) {
          //   this.tableContentsTrue = true
          // }
          // // console.log("totalPages", this.totalPages)
          this.pages = this.utilServ.convertToObject(response[3]);
          this.totalPages = this.pages[0].TotalRowCount

          this.tableContents = this.utilServ.convertToObject(response[2]);
          // console.log("tableContents", this.tableContents)
          // console.log("totalPages", this.totalPages)
          if (this.tableContents.length > 0) {
            // console.log("ok")
            // debugger
            this.headers = Object.keys(this.tableContents[0])
            this.tableContentsTrue = true
            this.tableContents.forEach((element, index) => {
              // console.log("data", element)
            })
          }

        }
        // else {
        //   this.notif.error(response.errorMsg, '')
        // }
      })

    }
    if (data == 'P') {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: this.ReportTypes,
            // PageNum:1,
            PageNum: this.pageIndexVal,
            RecCnt: 10,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: this.nomineeIdfileList1[0].name,
            Download: ""


          }],
        "requestId": "700260",
        "outTblCount": "0"
      }).then((response) => {
        this.isLoading = false;
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, '')
        }
        else {
          this.tableContents = this.utilServ.convertToObject(response[2]);
          this.headers = Object.keys(this.tableContents[0])
          this.pages = this.utilServ.convertToObject(response[3]);
          // this.recordTableLength = this.recordTable.length
          this.totalPages = this.pages[0].TotalRowCount
          if (this.totalPages.length > 10) {
            this.shwPg = true
          }
        }
      })
    }
    if (data == 'X') {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            // DocType: this.doc,
            DPID: "",
            APPNo: "",
            ReportType: this.doc,
            // PageNum:1,
            PageNum: this.pageIndexVal,
            RecCnt: 10,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: "",
            Download: ""


          }],
        "requestId": "700260",
        "outTblCount": "0"
      }).then((response) => {
        // console.log(this.doc);

        this.isLoading = false;
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, '')
        }
        else {
          this.drawerTable = this.utilServ.convertToObject(response[2]);
          // this.headers = Object.keys(this.tableContents[0])
          this.pages = this.utilServ.convertToObject(response[3]);
          // this.recordTableLength = this.recordTable.length
          this.totalDrwerPages = this.pages[0].TotalRowCount
          if (this.totalDrwerPages.length > 10) {
            this.shwPg = true
          }
        }
      })
    }

  }
  newClient(data) {
    // console.log(this.date.nc);
    if (this.date.nc == 'N') {
      this.date.doctype = 'DIGITAL';

    }
    if (data == 'N') {
      this.processData = true;
      // this.Viewdata()
    }
    if (data == 'C') {
      this.processData = false;
    }
    if (data == '') {
      this.processData = false;
      // console.log("data", data);
      // debugger
    }
  }

  // testfileDownload(){
  //   // fileName = response[1].rows[0];

  //   // let fileData = response[2].rows;
  //   // let details = response[0].rows[0];
  //   // fileData.forEach(data => {
  //   //   details += '\r\n';
  //   //   details += data;
  //   //  // details += '\r\n';
  //   // });
  //     this.downloadFile(fileName,details);
  //     this.notif.success('Success', 'Downloaded DPM transmission file');
  //     this.showLoading = false;
  // }
  downloadFile(fileName: string, data: string) {
    var file = new Blob([data]);
    // var file = new Blob([data], { type: '.txt' });

    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 50);
  }
  Reset() {
    // this.downloadFile('test','test');
    this.processData = false;
    // this.clientData = false;
    // this.showdrwer = false;
    this.progressData = false;
    this.dataTable = false
    // debugger
    this.date.nc = '';
    var date = new Date();
    this.date.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.date.td = new Date();
    this.manualXmlReset()
    this.getReport();
    // this.tableContents=[];
    this.tableContentsTrue = false;
    // this.downloadXml = false;
    // this.downloadPdf = false;
    this.nomineeIdfileList1 = [];


  }
  clear() {
    this.panSearch = [];
  }
  filter(data,type) {

    if (data == 'P') {
      if (this.panSearch == null || this.panSearch == undefined || this.panSearch == '') {
        // this.recordTable=[];
        this.notif.warning('Please enter a PAN', '')
        return;
      }
      else {
        // this.SearchButton=true
        this.isLoading = true;
        // if (this.nomineeIdfileList1.length != 0) {
        //   this.uplodfilename = this.nomineeIdfileList1[0].name
        // }
        // else {
        //   this.uplodfilename = '';
        // }
        if(type=='D'){
          this.rpt=this.doc
        }
        if(type=='R'){
          this.rpt=this.ReportTypes
        }
        debugger
        this.dataServ.getResponse({
          "batchStatus": "false",
          "detailArray":
            [{
              ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
              Status: "",
              // KitType: "DIGITAL",
              KitType: this.dropDownOpt,
              SerialNo: 0,
              PANNO: this.panSearch,
              TradeCode: "",
              DocType: "",
              // DocType: this.doc,
              DPID: "",
              APPNo: "",
              ReportType:this.rpt,
              PageNum: 1,
              // PageNum: this.pageIndexVal,
              RecCnt: 10,
              FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
              // Flag: "",
              Euser: this.currentUser.userCode,
              // ClientSerialNoFile: this.uplodfilename,
              ClientSerialNoFile:"",
              Download: ""


            }],
          "requestId": "700260",
          "outTblCount": "0"
        }).then((response) => {
          console.log(response);

          if(type=='D'){
            debugger
          this.isLoading = false;
          this.drawerTable = this.utilServ.convertToObject(response[2]);
          this.pages = this.utilServ.convertToObject(response[3]);
          this.totalDrwerPages = this.pages[0].TotalRowCount
          }
          if(type=='R'){
            this.isLoading = false;
            debugger
            this.tableContents = this.utilServ.convertToObject(response[2]);
            this.pages = this.utilServ.convertToObject(response[3]);
            this.totalPages = this.pages[0].TotalRowCount
            }
          // this.htmlContent = this.dataTable[0].HTML
          //  console.log(this.htmlContent);
          // this.pages = this.utilServ.convertToObject(response[3]);
          // this.totalPages = this.pages[0].TotalRowCount
          // console.log("totalPages", this.totalPages)
        })
      }
    }
  }


  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;

  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today
    // debugger
    return differenceInCalendarDays(current, this.fromDate) < 0;

  };
  getTotalpages(){
    // debugger
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{

          ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
          Status: "",
          // KitType: "DIGITAL",
          KitType: this.dropDownOpt,
          SerialNo: 0,
          PANNO: "",
          TradeCode: "",
          DocType: "",
          DPID: "",
          APPNo: "",
          ReportType: this.ReportTypes,
          PageNum: 1,
          RecCnt: this.totalPages,
          FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
          // Flag: "",
          Euser: this.currentUser.userCode,
          ClientSerialNoFile: "",
          Download: "Y"

        }],
      "requestId": "700260",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    // this.isLoading = true;
    console.log(this.totalPages);

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      // console.log(response);

      this.isLoading = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error('No data to export', '');
        // this.formHdlr.config.showExportExcelBtn = false
        return;
      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an error", '');
      this.isLoading = false;
    });
  }
  download(key) {
    this.errorMsg=''
    this.isLoading = true;
    if (key == 'C') {
      // this.dwnlodBtn = 'TXT'
      if (this.dwnlodBtn == 'XL') {
        this.dataServ.getResponse({
          "batchStatus": "false",
          "detailArray":
            [{
              ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
              Status: "",
              KitType: this.dropDownOpt,
              SerialNo: 0,
              PANNO: "",
              TradeCode: "",
              DocType: "",
              DPID: "",
              APPNo: "",
              ReportType: this.ReportTypes,
              PageNum: 1,
              RecCnt: 10,
              FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
              Euser: this.currentUser.userCode,
              ClientSerialNoFile: "",
              Download: ""
            }],
          "requestId": "700260",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorMsg) {
            this.notif.error(response.errorMsg, '')
            this.tableContentsTrue = false
            this.isLoading = false;
          }
          else {
            if(response.resultSet=''){
            this.notif.error("Error", '')
            this.isLoading = false;
            }
            else{
            this.pages = this.utilServ.convertToObject(response[3]);
            this.totalPages = this.pages[0].TotalRowCount
            console.log(this.totalPages);
            // this.isLoading = false;
            if(this.totalPages>0){
               this.getTotalpages()
            }
            }
          }
        })

    // setTimeout(() => {
        // if (this.totalPages > 0) {
        // if (this.totalPages !=undefined || this.totalPages!=null ||this.totalPages!='' && this.totalPages>0) {
          // this.isLoading = true;

      //   }
      // }, 10000)

      }
      else if (this.dwnlodBtn == 'TXT') {
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{

              ToDate: moment(this.manualXmlFromDate).format(AppConfig.dateFormat.apiMoment),
              Status: "",
              KitType: this.dropDownOpt,
              SerialNo: 0,
              PANNO: "",
              TradeCode: "",
              DocType: "",
              DPID: "",
              APPNo: "",
              ReportType: this.ReportTypes,
              PageNum: 1,
              RecCnt: 10,
              FromDate: moment(this.manualXmlToDate).format(AppConfig.dateFormat.apiMoment),
              Euser: this.currentUser.userCode,
              ClientSerialNoFile: this.nomineeIdfileList1[0]?this.nomineeIdfileList1[0].name:"",
              Download: "",
              KRAType:this.kraType
            }],
          "requestId": "700260",
          "outTblCount": "0"
        }).then((response) => {
          this.isLoading = false;
          // console.log("response", response);
          // if(response && response.errorCode==0) {
          // let recordTableData = this.utilServ.convertToObject(response[4]);
          // let headersData = response[4].metadata.columns;
          if (response.errorMsg) {
            // debugger
            this.notif.error(response.errorMsg, '')

          }
          else {
            console.log(response,"response");

      let fileName = response[0][0].fileData//'gfg'//response[1].rows[0];
      // console.log(fileData,"fileData");
      let fileData =response[0][0].fileData
      let details:string =''// 'tes\r\ntttt\r\n'//
      fileData.forEach(data => {
        details += data;
        details += '\r\n';
      // details += '\r\n';
      });
      this.downloadFile(fileName,details);
      this.notif.success('Success', 'Downloaded DPM transmission file');

            // let recordTableData = this.utilServ.convertToObject(response[2]);
            // let headersData = Object.keys(recordTableData[0])
            // // console.log("recordTableData", recordTableData)
            // let header = this.ReportTypes
            // this.Excel(headersData, header, recordTableData, 'Reports')
            // this.Excel(this.headers, header, this.tableContents, 'Reports')
            // }
            // else{
            //       debugger
            //       this.isLoading = false;
            //       this.notif.error(response.errorMsg, '');
          }
        })
      }
      else if (this.dwnlodBtn == 'XML') {
        // if (this.filevalidator == true) {
        // if (this.nomineeIdfileList1[0]) {
          // else{
          this.dataServ.getResponse({
            "batchStatus": "false",
            "detailArray":
              [{
                ApplicationNoFile: this.selectFileDisable?'':(this.nomineeIdfileList1[0]?this.nomineeIdfileList1[0].name?this.nomineeIdfileList1[0].name:'':''),
                FromDate:  this.manualXmlDateDisable?'':(this.manualXmlFromDate?moment(this.manualXmlFromDate).format(AppConfig.dateFormat.apiMoment):''),
                ToDate: this.manualXmlDateDisable?'':(this.manualXmlToDate?moment(this.manualXmlToDate).format(AppConfig.dateFormat.apiMoment):''),
                KRAType:this.kraType?this.kraType:'',
                KRAMode:this.kraMode?this.kraMode:''
                // Appno:0
              }],
            "requestId": "700318",
            "outTblCount": "0",

          }).then((response) => {
            // console.log("resp",response);
            this.isLoading = false;
            // if (this.nomineeIdfileList1[0].name) {
            // console.log('result', this.utilServ.convertToObject(response[0].rows[0].RESULT));
            // let resultData = this.utilServ.convertToObject(response[0]);
            if (response.errorMsg) {
              // debugger
              this.notif.error(response.errorMsg, '')
              return

            }
            else {
              let resultData = response[0].rows;//response.results[0];
              if(resultData.length>0)
              {
              if(this.kraMode ==='NDML')
              {

              let headerData = response[1].rows[0]?{FileName:response[1].rows[0][0],HeaderData:response[1].rows[0][1]}:{FileName:'',HeaderData:''}//response.results[1][0]?response.results[1][0]:{FileName:'',HeaderData:''}//response[1].rows[0];
              // console.log(headerData,"fileData");
              let fileData =resultData
              // console.log(fileData);
              let details:string =headerData.HeaderData+'\r\n'// 'tes\r\ntttt\r\n'//
              fileData.forEach((data,index) => {
                // console.log(typeof data[0],data);

                if(data[0] !==null)
                {
                  details += data[0]
                  details += '\r\n';
                }
                // if(index ===fileData.length-1){
                //   details = details+headerData.FooterData
                //   details += '\r\n';
                // }
              // details += '\r\n';
              });
              this.downloadFile(headerData.FileName,details);
              console.log(response[2].rows[0]);

              if(response && response[2] && response[2].rows[0] && response[2].rows[0][0])
              {
                this.errorMsg=response[2].rows[0][0]
              }


            }
            else{
              let result = resultData[0][0]?resultData[0][0]:''
              // console.log(result,"xml");

              let fileName =response[1].rows[0][0]?response[1].rows[0][0]:''
              // console.log(fileName,"fileName");

              // console.log('result', result)
              // let result = resultData[0].RESULT;
              // if (this.tableContentsTrue == true) {
                let blob = new Blob([result], { type: 'application/xml' });
                // console.log('blob', blob)
                let date =moment(new Date).format('dd_MM_yyyy')
                FileSaver.saveAs(blob, fileName)//'ManualXml_' +date+ ".xml");
                if(response && response[2] && response[2].rows[0] && response[2].rows[0][0])
                {
                  this.errorMsg=response[2].rows[0][0]
                }
              }
              }
              else {
                this.notif.warning('No data found', '')
              }
              // XML download
            }
          })
        // }
        // else {
        //   this.isLoading = false;
        //   this.notif.error('Please select a file', '')
        // }
        // }
        // else {
        //   this.isLoading = false;
        //   this.notif.error('Please select a valid file', '')
        // }
      }
      else if (this.dwnlodBtn == 'AXML') {
        // debugger
        // console.log(this.token);
        // if (this.filevalidator == true) {

        if (this.nomineeIdfileList1 == '' || this.nomineeIdfileList1 == undefined) {
          this.token = ''
          this.tableContentsTrue = false
          this.notif.warning("Please select a file", '')
          this.isLoading = false;
          // console.log('null');
        }
        else {
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Token: this.token,
                ReportType: 'xml'
              }],
            // "requestId": "700324",
            "requestId": "700325",
            "outTblCount": "0",
          }).then((response) => {
            console.log("response", response);
            this.isLoading = false;
            if (response.errorMsg) {
              // debugger
              this.notif.error(response.errorMsg, '')

            }
            else {
              // console.log(this.token);

              // if(response.results[0].rows> 0){
              setTimeout(() => {
                // let data = environment.api_zip_url + this.token;
                const link = document.createElement('a');
                link.setAttribute('target', '_blank');
                link.setAttribute('href', environment.api_zip_url + this.token + "&reportType=xml");
                // console.log(environment.api_zip_url + this.token + "&reportType=xml");

                document.body.appendChild(link);
                link.click();
                link.remove();
                this.isLoading = false;
                // this.notif.success('File Downloaded Successfully', '');

                // let data = environment.api_zip_url +2;
                // console.log(data);
              }, 1000);
              // this.token='';
            }

          });
        }
        //   }
        //   else{
        //     this.isLoading = false;
        //     this.notif.error('Please select a valid file', '')
        // }
      }
      else if (this.dwnlodBtn == 'PDF') {
        // if (this.filevalidator == true) {
        if (this.nomineeIdfileList1 == '' || this.nomineeIdfileList1 == undefined) {
          this.token = ''
          this.tableContentsTrue = false
          this.notif.warning("Please select a file", '')
          this.isLoading = false;
          // console.log('null');
        }
        else {
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Token: this.token,
                ReportType: ''
                // Token: 1,
                // ReportType:'',
              }],
            // "requestId": "700324",
            "requestId": "700325",
            "outTblCount": "0",
          }).then((response) => {
            // console.log("response", response);


            // if(this.viewtoken!=this.token){
            if (response.errorMsg) {
              // debugger
              this.isLoading = false;
              this.notif.error(response.errorMsg, '')

            }
            else {
              // console.log(this.token);
              //  this.viewtoken=this.token
              // console.log(this.viewtoken);
              setTimeout(() => {
                // let data = environment.api_zip_url + this.token;
                const link = document.createElement('a');
                link.setAttribute('target', '_blank');
                link.setAttribute('href', environment.api_zip_url + this.token);
                document.body.appendChild(link);
                link.click();
                link.remove();
                this.isLoading = false;
                // this.notif.success('File Downloaded Successfully', '');
                // let data = environment.api_zip_url +2;
                // console.log(data);
              }, 1000);
            }
            // }
          });
        }
        //   }
        //   else{
        //     this.isLoading = false;
        //     this.notif.error('Please select a valid file', '')
        // }
      }
      else {
        this.isLoading = false;
        this.notif.error('Please select a file', '')
      }
      // }
    }
    else if (key == 'T') {     //Total KRA List
      let reqParams = {
        "batchStatus": "false",
        "detailArray": [{
          ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
          Status: "",
          // KitType: "DIGITAL",
          KitType: this.dropDownOpt,
          SerialNo: 0,
          PANNO: "",
          TradeCode: "",
          DocType: "",
          DPID: "",
          APPNo: "",
          ReportType: 'Total KRA List',
          PageNum: 1,
          RecCnt: this.TOTAL,
          FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
          // Flag: "",
          Euser: this.currentUser.userCode,
          ClientSerialNoFile: "",
          Download: "Y"

        }],
        "requestId": "700260",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isLoading = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        console.log(response);

        this.isLoading = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          // this.formHdlr.config.showExportExcelBtn = false
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an error", '');
        this.isLoading = false;
      });


    }
    else if (key == 'D') {   //KRA Done
      let reqParams = {

        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            // KitType: "DIGITAL",
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: 'KRA Done',
            PageNum: 1,
            RecCnt: this.DONE,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: "",
            Download: "Y"


          }],
        "requestId": "700260",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isLoading = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        console.log(response);

        this.isLoading = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          // this.formHdlr.config.showExportExcelBtn = false
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an error", '');
        this.isLoading = false;
      });
    }
    else if (key == 'P') {    //Total KRA Pending
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{

            ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
            Status: "",
            // KitType: "DIGITAL",
            KitType: this.dropDownOpt,
            SerialNo: 0,
            PANNO: "",
            TradeCode: "",
            DocType: "",
            DPID: "",
            APPNo: "",
            ReportType: 'Total KRA Pending',
            PageNum: 1,
            RecCnt: this.PENDING,
            FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
            // Flag: "",
            Euser: this.currentUser.userCode,
            ClientSerialNoFile: "",
            Download: "Y"

          }],
        "requestId": "700260",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isLoading = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        console.log(response);

        this.isLoading = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          // this.formHdlr.config.showExportExcelBtn = false
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an error", '');
        this.isLoading = false;
      });
    }
    else if (key == 'TII') {     //T+2 days
      let reqParams = {
        "batchStatus": "false",
        "detailArray": [{
          ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
          Status: "",
          KitType: this.dropDownOpt,
          SerialNo: 0,
          PANNO: "",
          TradeCode: "",
          DocType: "",
          DPID: "",
          APPNo: "",
          ReportType: 'T2Days',
          PageNum: 1,
          RecCnt: this.TOTAL,
          FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
          Euser: this.currentUser.userCode,
          ClientSerialNoFile: "",
          Download: "Y"
        }],
        "requestId": "700260",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.isLoading = true;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        this.isLoading = false;
        if (response.errorMsg != undefined && response.errorMsg != '') {
          this.notif.error('No data to export', '');
          return;
        }
        else {
          if (!isPreview) {
            this.notif.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notif.error("Server encountered an error", '');
        this.isLoading = false;
      });
    }

  }


  Excel(colums, header, data, filename) {
    let html;
    let tableHeader;
    html = "<h2> " + header + " </h2>"
    html = html + "<table><tr>";
    // html = "<table><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      html = html + "<th style='border:1px solid black;border-width: thin;'>" + tableHeader[i] + "</th>";
    }
    html = html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        html = html + "<td style='border:1px solid black;border-width: thin;'>" + data[i][tableHeader[j]] + "</td>";
      }
      html = html + "<tr>";
    }
    html = html + "</tr><table>";
    let blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, filename + ".xls")
    // console.log('html', html)
    // console.log('blob', blob);
  }

  PDF(colums, data, filename) {

    let html;
    let tableHeader;
    // html = "<h2> " + header + " </h2>"
    // html = html + "<table><tr>";
    html = "<table><tr>";
    // html = "<table><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      html = html + "<th style='border:1px solid black;border-width: thin;'>" + tableHeader[i] + "</th>";
    }
    html = html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        html = html + "<td style='border:1px solid black;border-width: thin;'>" + data[i][tableHeader[j]] + "</td>";
      }
      html = html + "<tr>";
    }
    html = html + "</tr><table>";
    let blob = new Blob([html], {
      type: "application/pdf;charset=utf-8"
    });
    FileSaver.saveAs(blob, filename + ".pdf")
    // console.log('html', html)
    // console.log('blob', blob);

  }


  isNumber(val): boolean { return typeof val === 'number'; }

  showDrawer(index) {
    this.pageIndexVal = 1;
    this.showdrwer = true
    this.isLoading = true;
    this.filterSearch = true;
    if (index == '1') {
      this.doc = 'PDF'
      this.drawerName = 'PDF Document'
    }
    if (index == '2') {
      this.doc = 'XML'
      this.drawerName = 'Aadhar XML'
    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{

          ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
          Status: "",
          KitType: this.dropDownOpt,
          // KitType: "DIGITAL",
          SerialNo: 0,
          PANNO: "",
          TradeCode: "",
          DocType: "",
          DPID: "",
          APPNo: "",
          ReportType: this.doc,
          // PageNum:1,
          PageNum: this.pageIndexVal,
          RecCnt: 10,
          FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
          // Flag: "",
          Euser: this.currentUser.userCode,
          ClientSerialNoFile: "",
          Download: ""


        }],
      "requestId": "700260",
      "outTblCount": "0"
    }).then((response) => {
      // console.log("response", response)
      this.isLoading = false;
      // this.drawerName = this.utilServ.convertToObject(response[0][index].Progress);
      // console.log(this.drawerName);
      this.drawerTable = this.utilServ.convertToObject(response[2]);
      if (this.drawerTable.length > 0) {
        // console.log("ok")
        this.heading = Object.keys(this.drawerTable[0])
        // this.tableContentsTrue = true
      }
      // let heading = Object.keys(this.drawerTable[0])
      // console.log(this.heading);
      this.pages = this.utilServ.convertToObject(response[3]);
      this.totalDrwerPages = this.pages[0].TotalRowCount
      // console.log("drawerTable", this.drawerTable);

    });
  }
  close() {
    this.showdrwer = false
    this.date.nc = 'N';
    this.drawerTable = [];
    this.totalDrwerPages = []
    this.panSearch = []
  }



  searchFilter(data) {
    this.filterSearch = true;
    if (data == 'P') {
      this.filterSearchPan = true;
      this.filterSearchApp = false;

    }
    if (data == 'A') {
      this.filterSearchApp = true;
      this.filterSearchPan = false;

    }
  }
  // modalView(i) {
  //   console.log(i);
  //   this.isLoading = true;
  //   this.dataServ.getResponse({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{

  //         ToDate: moment(this.date.td).format(AppConfig.dateFormat.apiMoment),
  //         Status: "",
  //         KitType: this.date.doctype,
  //         // KitType: "DIGITAL",
  //         SerialNo: 0,
  //         PANNO: "",
  //         TradeCode: "",
  //         DocType: "",
  //         DPID: "",
  //         APPNo: "",
  //         ReportType: "",
  //         // PageNum:1,
  //         PageNum: this.pageIndexVal,
  //         RecCnt: 10,
  //         FromDate: moment(this.date.fd).format(AppConfig.dateFormat.apiMoment),
  //         // Flag: "",
  //         Euser: this.currentUser.userCode,
  //         ClientSerialNoFile: "",
  //  Download:""


  //       }],
  //     "requestId": "700260",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     // console.log("response", response)
  //     this.isLoading = false;
  //     // this.progressData = this.utilServ.convertToObject(response[0]);
  //     // this.progressDataColumns = Object.keys(response[0]);
  //     // console.log("progressDataColumns", this.progressDataColumns)
  //     let Cilents = this.utilServ.convertToResultArray(response[1]);
  //     console.log("Cilents", Cilents)
  //     this.modalHeader = Cilents[i]['HEADING'];
  //     console.log("modalHeader", this.modalHeader)
  //     this.modalVisible = true;

  //     // this.Columns = Object.keys(this.kraCilents[0]);
  //     // this.modalColumns=Cilents[i]['HEADING'];

  //     // if(this.modalColumns==true){
  //     // this.modalVisible = true;
  //     // }
  //     // else{
  //     // this.modalVisible = false;
  //     // }

  //       this.htmlmodal="<table><tr><th style='border:1px solid black;border-width: thin;'>ffff</th><th>ffff</th><th>ffff</th></tr><tr><td>hhh</td><td>hhh</td><td>hhh</td></tr></table>"
  //   //  '<tr><td>hhh</td><td>hhh</td><td>hhh</td></tr></table>'
  //   })

  // }

  // handleOk(): void {
  //   this.modalVisible = false;
  // }

  // handleCancel(): void {
  //   this.modalVisible = false;
  // }
  selectFileRemove= () => {
    return (file: UploadFile): boolean => {
    // alert("removed")
    // this.selectFileDisable=true
    this.errorMsg=''
    this.manualXmlDateDisable =false
    // console.log(this.manualXmlDateDisable);

    return true
    }
  }
  manualXmlFromDateChange()
  {
    this.errorMsg=''
    // alert("changed")
    let date = new Date();

    // console.log(this.manualXmlToDate,this.manualXmlFromDate);
    // alert(!this.manualXmlFromDate)
    this.selectFileDisable=(!this.manualXmlFromDate && this.datePipe.transform(date,'yyyy-MM-dd')===this.datePipe.transform(this.manualXmlToDate,'yyyy-MM-dd'))?false:true
    this.manualXmlFromDate =!this.manualXmlFromDate?new Date(date.getFullYear(), date.getMonth(), 1):this.manualXmlFromDate
  }
  manualXmlToDateChange()
  {
    this.errorMsg=''
    // alert("changed")
    let date = new Date();
    let fromdate =new Date(date.getFullYear(), date.getMonth(), 1)
    // console.log(this.manualXmlToDate,this.manualXmlFromDate);

    this.selectFileDisable=(!this.manualXmlToDate && this.datePipe.transform(fromdate,'yyyy-MM-dd')===this.datePipe.transform(this.manualXmlFromDate,'yyyy-MM-dd'))?false:true
    this.manualXmlToDate =!this.manualXmlToDate?date:this.manualXmlToDate
  }

  manualXmlReset()
  {
    let date = new Date();
    this.manualXmlFromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.manualXmlToDate = new Date();
    this.nomineeIdfileList1=[]
    this.selectFileDisable =false
    this.manualXmlDateDisable =false
    this.kraType = this.kraTypes[0].KRAType
    this.kraMode = this.kraModes[0].KRAMode
    this.errorMsg =''
  }
}
