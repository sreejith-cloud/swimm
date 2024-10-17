import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { FormHandlerComponent, AppConfig, DataService, FindOptions, AuthService, User, UtilService, WorkspaceService } from 'shared';
import { bounce, flip, fadeInDown, fadeInLeft, fadeInRight, zoomIn, fadeIn } from 'ng-animate';
import { trigger, transition, useAnimation, AnimationMetadataType } from '@angular/animations';
import { EventEmitter } from '@angular/core';
import { PoaserviceService } from './poaservice.service';
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clientpoadashboard',
  templateUrl: './clientpoadashboard.component.html',
  styleUrls: ['./clientpoadashboard.component.less'],
  animations: [
    trigger('fadeLeft', [transition(':enter', useAnimation(fadeInLeft, {
      params: { timing: 1, delay: 0 }
    }))])

  ],

})
export class ClientpoadashboardComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  randomcolor: any;
  data: any = [];
  euser: any;
  showverification: boolean = false;
  clienttype: any;
  location: any;
  // dpClientDetails : any;
  locationFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  TradeFindopt: FindOptions;
  Tradecode: any;
  trandate: any;
  todate: any;
  today: any = new Date();
  ReportResponse: any = [];
  type: any;
  detailDataHeads: any = [];
  DetailData: any = [];
  detailDataHeads1: any = [];
  DetailData1: any = [];
  fdate: any;//mod aksa
  tdate: any;//mod aksa
  ShowExcel: boolean = false;//mod aksa
  Showfromdate: boolean = false;
  Showtodate: boolean = false;
  showReport: boolean = false;
  Showrequest: boolean = false;
  currentUser: User;
  //data1: any[] = [];
  requestfrom: any;
  requestvalueArray: any
  switchValue2: boolean = true;
  toggleDisable: boolean = false;
  B2BPartner: any;
  B2BvalueArray: any;
  hideToggle: boolean = false;
  isSpinningVisible: boolean = false;
  downloadBtn1: boolean = false;
  downloadBtn2: boolean = false;
  ResponseData: any;
  ResponseData2: any;
  shwBTN: any;
  includeDwnld: boolean = true;
  dwnldOpt:any;
  reportexcel: boolean = false;
  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private wsServ: WorkspaceService,
    private poaserv: PoaserviceService,
    private notif: NzNotificationService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,

  ) {
    this.locationFindopt = {
      findType: 3102,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.dpClientIdFindopt = {
      findType: 5021,
      codeColumn: 'DpClientid',
      codeLabel: 'DpClientid',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.TradeFindopt = {
      findType: 4000,
      codeColumn: 'ClientCode',
      codeLabel: 'ClientCode',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getdata();

    this.trandate = new Date();
    this.todate = this.today;

    // this.getRandomColor();
    // this.tdate = new Date();//mod aksa
    // this.fdate = new Date();//mod aksa

  }
  // ngAfterViewInit() {
  //   this.formHdlr.setFormType('default');
  //   this.formHdlr.config.showPreviewBtn = false;
  //   this.formHdlr.config.showFindBtn = false;
  //   this.formHdlr.config.showDeleteBtn = false;
  //   this.formHdlr.config.showSaveBtn = false;
  //   this.formHdlr.config.showCancelBtn = false;
  //   this.formHdlr.config.showExportExcelBtn=true;


  // }

  getdata() {
    this.reportexcel = false
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          id: 0,
          dpid: '',
          loc: '',
          clientid: 0,
          trandt: '',//mod aksa
          // FromDate: '',//mod aksa 
          // ToDate: '',//mod aksa
          type: 'D',
          // euser: '16048',
          euser: this.currentUser.userCode,
          frdt: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          todt: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          requestfrom: '',
          B2BOnly: ''
        }],
      "requestId": "7278",
      "outTblCount": "0"
    }).then((response) => {
      // debugger
      console.log("respo", response);
      // this.requestfrom='GCC'

      this.data = response.results[0]
      console.log("data", this.data);

      for (var i = 0; i < this.data.length; i++) {
        this.getRandomColor();
        this.data[i].Color = this.randomcolor
      }
    });
  }

  Changecolor() {
    // for (var i = 0; i < this.data.length; i++) {
    this.getRandomColor();
    this.data[0].Color = this.randomcolor
    // }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    this.randomcolor = '#' + ('000000' + color).slice(-6);
    return this.randomcolor
  }

  showPending(data, Type) {


    // debugger;
    if (Type == "DDPI") {
      this.type = data
      console.log("type", this.type);

      // this.Reset()
      this.showverification = !this.showverification
      // this.getdata()
      // this.Viewdata()
      this.hideToggle=false;
      // this.getDropdownData()
    }
    else {
      this.poaserv.crfRPTStatus = data;
      this.viewProfileChangeReport();

    }
    if (this.type == 'A') {
      // debugger//mod aksa
      this.ShowExcel = true
      this.Showfromdate = true;
      this.Showtodate = true;
      this.Showrequest = true;
      this.getDropdownData()

    }
    // else if(this.type == 'R'){
    //   this.Showrequest = true;

    // }
    else {
      this.ShowExcel = false
      this.Showfromdate = false;
      this.Showtodate = false;
      this.Showrequest = false;

    }

    if (this.type == "P") {
      this.showReport = true;
    } else {
      this.showReport = false;
    }

    this.Reset()

    // this.DetailData1=[]
    // this.detailDataHeads1=[]
    // this.reportexcel=false

  }
  viewProfileChangeReport() {

    let workspaceData = this.wsServ.workspaces;
    let approveTab: boolean = false
    var approveIndex
    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((workspaceData[i]['type']) == "crfrpt") {
        // debugger
        approveTab = true
        approveIndex = i;
      }
    }
    if (approveTab) {
      this.wsServ.removeWorkspace(approveIndex);
      this.poaserv.fromApproveList = true;
      setTimeout(() => {
        this.wsServ.createWorkspace("crfrpt");
      }, 200);
    }
    else {
      setTimeout(() => {
        this.poaserv.fromApproveList = true;
        this.wsServ.createWorkspace("crfrpt");
      }, 200);
    }
  }

  getDropdownData() {
    this.isSpinningVisible = true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 1,
          Euser: this.currentUser.userCode
        }],
      "requestId": "700432",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinningVisible = false;
      console.log("drpdwn", response);
      //  this.requestvalueArray = Object.values(response.results[0])
      this.requestvalueArray = (response.results[0])
      console.log("this.requestvalueArray", this.requestvalueArray);
      debugger
      this.ResponseData = response.results[0];
      this.requestfrom = response.results[0][0].code
      this.downloadBtn1 = this.ResponseData[0].Show
      console.log("drpdwn2", response);
      this.B2BvalueArray = (response.results[1])
      console.log("this.B2BvalueArray", this.B2BvalueArray);
      // this.B2BPartner=
      this.ResponseData2 = response.results[1];
      this.B2BPartner = response.results[1][0].code
      // this.shwBTN=this.ResponseData
      this.downloadBtn2 = this.ResponseData2[0].Show

      // this.downloadBtn2 = response.results[1][0].Show
      if (this.downloadBtn1 == true && this.downloadBtn2 == true) {
        this.hideToggle = true;
      }

    })

  }

  Viewdata() {
    // debugger
    
    this.DetailData = []
    this.detailDataHeads = []

    if (this.type == 'R') {
      // || this.type == 'A'
      if (this.Tradecode == "" || this.Tradecode == undefined) {
        this.notif.error('Please select Tradecode', '')
        return
      }
    }

    this.isSpinningVisible = true;

    console.log(this.type)
    // this.fdate = JSON.stringify(this.fdate)//mod aksa
    // this.fdate = this.fdate.slice(1, 11)
    // this.tdate = JSON.stringify(this.tdate)
    // this.tdate = this.tdate.slice(1, 11)
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          id: 0,
          dpid: '',
          loc: this.location ? this.location.Location : '',
          clientid: this.Tradecode ? this.Tradecode.Clientid : 0,
          trandt: this.trandate ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment) : '',
          // this.trandate ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment) : '',
          // FromDate:'2022-02-11',
          // ToDate:'2022-03-15',
          // FromDate: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',//mod aksa
          // ToDate: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',//mod aksa
          type: this.type || '',
          // euser: '16048',
          euser: this.currentUser.userCode,
          frdt: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          todt: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          requestfrom: this.requestfrom ? this.requestfrom : '',
          // requestfrom: 'GCC',
          B2BOnly: this.B2BPartner ? this.B2BPartner : ''

        }],
      "requestId": "7278",
      "outTblCount": "0"
    }).then((response) => {
      console.log("res", response);
      this.isSpinningVisible = false;


      if (response.results.length > 0) {

        //this.requestvalueArray = response.results[0]

        // this.requestvalueArray = Object.values(response.results[1])
        // console.log("this.requestvalueArray", this.requestvalueArray);
        let data1 = response.results[0]

        if (data1.length > 0) {

          this.DetailData = data1;
          console.log(this.DetailData);
          this.DetailData.forEach(element => {
            if (element.DDPI_Transfer == true) {
              element.DDPI_Transfer = 'Y'
            } else if (element.DDPI_Transfer == false) {
              element.DDPI_Transfer = 'N'
            }
            if (element.DDPI_Tender == true) {
              element.DDPI_Tender = 'Y'
            } else if (element.DDPI_Tender == false) {
              element.DDPI_Tender = 'N'
            }
            if (element.DDPI_Pledge == true) {
              element.DDPI_Pledge = 'Y'
            } else if (element.DDPI_Pledge == false) {
              element.DDPI_Pledge = 'N'
            }
            if (element.DDPI_MF == true) {
              element.DDPI_MF = 'Y'
            } else if (element.DDPI_MF == false) {
              element.DDPI_MF = 'N'
            }
            if (element.DDPI_Pledge_DPM_STATUS == true) {
              element.DDPI_Pledge_DPM_STATUS = 'Y'
            } else if (element.DDPI_Pledge_DPM_STATUS == false) {
              element.DDPI_Pledge_DPM_STATUS = 'N'
            }
            if (element.DDPI_Transfer_DPM_STATUS == true) {
              element.DDPI_Transfer_DPM_STATUS = 'Y'
            } else if (element.DDPI_Transfer_DPM_STATUS == false) {
              element.DDPI_Transfer_DPM_STATUS = 'N'
            }

            if (element.DDPI_MF_DPM_STATUS == true) {
              element.DDPI_MF_DPM_STATUS = 'Y'
            } else if (element.DDPI_MF_DPM_STATUS == false) {
              element.DDPI_MF_DPM_STATUS = 'N'
            }

            if (element.DDPI_Tender_DPM_STATUS == true) {
              element.DDPI_Tender_DPM_STATUS = 'Y'
            } else if (element.DDPI_Tender_DPM_STATUS == false) {
              element.DDPI_Tender_DPM_STATUS = 'N'
            }
          });

          this.detailDataHeads = Object.keys(this.DetailData[0])

        }
        else {
          this.notif.error('No Data found', '');
          // this.isSpinning = false
          return

        }
        if (response.errorCode) {
          this.notif.error(response.errorCode, '');
          return
        }

      }
    });

  }

  // MOD NAJAD FOR REPORT
  Report() {
    // debugger;
    this.DetailData = [];
    this.DetailData1 = [];
    this.detailDataHeads1 = [];
    this.isSpinningVisible = true;
    // console.log(this.type);

    this.dataServ
      .getResultArray({
        batchStatus: "false",
        detailArray: [
          {
            id: 0,
            dpid: "",
            loc: this.location ? this.location.Location : "",
            clientid: this.Tradecode ? this.Tradecode.CLIENTID : 0,
            // trandt: this.trandate || '',
            trandt: this.trandate
              ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment)
              : "",
            type: "S",
            euser: this.currentUser.userCode,
            frdt: this.fdate
              ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment)
              : "",
            todt: this.tdate
              ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment)
              : "",
          },
        ],
        requestId: "7278",
        outTblCount: "0",
      })
      .then((response) => {
        // console.log("res", response);

        this.isSpinningVisible = false;
        if (response.results.length > 0) {
          let data2 = response.results[0];

          if (data2.length > 0) {
            this.reportexcel = true;

            this.DetailData1 = data2;
            // console.log(this.DetailData);

            this.detailDataHeads1 = Object.keys(this.DetailData1[0]);

            // console.log(this.detailDataHeads1, "full data");
          } else {
            this.notif.error("No Data found", "");
            // this.isSpinning = false
            return;
          }
          if (response.errorCode) {
            this.notif.error(response.errorCode, "");
            return;
          }
        }
      });
  }

  ReportExcel() {
    let reqParams = {
      batchStatus: "false",
      detailArray: [
        {
          id: 0,
          dpid: "",
          loc: this.location ? this.location.Location : "",
          clientid: this.Tradecode ? this.Tradecode.CLIENTID : 0,
          // trandt: this.trandate || '',
          trandt: this.trandate
            ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment)
            : "",
          type: "S",
          euser: this.currentUser.userCode,
          frdt: this.fdate
            ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment)
            : "",
          todt: this.tdate
            ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment)
            : "",
        },
      ],
      requestId: "7278",
      outTblCount: "0",
    };
    reqParams["fileType"] = "3";
    reqParams["fileOptions"] = { pageSize: "A3" };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then(
      (response) => {
        // debugger;
        // this.isSpinning = false;
        if (response.errorMsg) {
          this.notif.error(response.errorMsg, "");
          return;
        } else {
          if (!isPreview) {
            this.notif.success("File downloaded successfully", "");
            return;
          }
        }
      },
      () => {
        this.notif.error("Server encountered an Error", "");
      }
    );
  }

  // END

  viewapproveorreject(data) {
    let workspaceData = this.wsServ.workspaces;
    let approveTab: boolean = false
    var approveIndex
    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((workspaceData[i]['type']) == "poaapprovedorreject") {
        approveTab = true
        approveIndex = i;
      }
    }
    if (approveTab) {
      this.wsServ.removeWorkspace(approveIndex);
      setTimeout(() => {
        this.wsServ.createWorkspace("poaapprovedorreject");
      }, 200);
    }
    else {
      setTimeout(() => {
        this.wsServ.createWorkspace("poaapprovedorreject");
      }, 200);
    }


    this.poaserv.clientid.next(data.ClientID)
    this.poaserv.dpid.next(data.DPID)
    this.poaserv.id.next(data.ID)
    this.poaserv.type.next(this.type)

  }

  Reset() {
    this.location = '';
    this.Tradecode = '';
    this.trandate = this.today;
    this.ReportResponse = [];
    this.fdate = '';
    this.tdate = '';
    this.requestfrom = null;
    this.B2BPartner = null;
    this.DetailData = []
    this.detailDataHeads = [];
    this.detailDataHeads1=[]
    this.DetailData1=[]
    this.reportexcel=false
    this.hideToggle=false

  }

  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.today) > 0)
  };

  Export() {
    // if (this.fdate == "" || this.fdate == undefined && this.tdate == "" || this.tdate == undefined) {
    //   this.notif.error('Please select fromdate and todate', '')
    //   return


    //   this.tdate = new Date();//mod aksa
    //   // this.fdate
    // }
    this.isSpinningVisible = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          id: 0,
          dpid: '',
          loc: this.location ? this.location.Location : '',
          clientid: this.Tradecode ? this.Tradecode.Clientid : 0,
          trandt: this.trandate ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment) : '',
          // FromDate:'2022-02-11',
          // ToDate:'2022-03-15',
          FromDate: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',//mod aksa
          ToDate: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',//mod aksa
          euser: this.currentUser.userCode,
          requestfrom: this.requestfrom ? this.requestfrom : '',
          B2BOnly: this.B2BPartner ? this.B2BPartner : '',
        }],
      "requestId": "7941",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      // debugger
      this.isSpinningVisible = false;
      console.log(response);
      
      // this.isSpinning = false;
      if (response.errorMsg) {
        this.notif.error(response.errorMsg, '');
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

  reqvaluechange(val, type) {
    // debugger
    this.isSpinningVisible = true;
    if (type == 'R') {
      this.requestfrom = val
      // console.log("requestfrom", this.requestfrom);
      this.poaserv.requestvalue.next(val)
      // console.log(i);

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Code: 1,
            Euser: this.currentUser.userCode
          }],
        "requestId": "700432",
        "outTblCount": "0"
      }).then((response) => {
        this.isSpinningVisible = false;
        // console.log(this.ResponseData);
        const index = this.ResponseData.findIndex((item) => item.code === val);
        let i = index;
        // console.log(i);
        this.downloadBtn1 = this.ResponseData[i].Show
        console.log(this.downloadBtn1);
        console.log(this.downloadBtn2);
        if (this.downloadBtn1 == true && this.downloadBtn2 == true) {
          this.hideToggle = true;
        }
        else {
          this.hideToggle = false;
        }
      })
    }
    if (type == 'B') {
      this.B2BPartner = val
      console.log("B2BPartner", this.B2BPartner);
      this.poaserv.requestvalue.next(val)
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Code: 1,
            Euser: this.currentUser.userCode
          }],
        "requestId": "700432",
        "outTblCount": "0"
      }).then((response) => {
        this.isSpinningVisible = false;
        console.log(this.ResponseData2);
        // this.ResponseData2=response.results[1];
        const index2 = this.ResponseData2.findIndex((item) => item.code === val);
        let b = index2;
        console.log(b);
        this.downloadBtn2 = this.ResponseData2[b].Show
        console.log(this.downloadBtn1);
        console.log(this.downloadBtn2);
        if (this.downloadBtn1 == true && this.downloadBtn2 == true) {
          this.hideToggle = true;
        }
        else {
          this.hideToggle = false;
        }
      })
      // if(this.B2BPartner=='All'){
      //   this.switchValue2=false;
      //   // this.toggleDisable=true;
      //   this.hideToggle=true;
      // }
      // else if(this.B2BPartner==''){
      //   this.switchValue2=true;
      //   this.hideToggle=false;
      // }
      // else{
      //   this.switchValue2=true;
      //   // this.toggleDisable=false;
      //   this.hideToggle=true;

      // }
    }
  }
  DownloadV() {
    this.isSpinningVisible = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          id: 0,
          dpid: '',
          loc: this.location ? this.location.Location : '',
          clientid: this.Tradecode ? this.Tradecode.Clientid : 0,
          trandt: this.trandate ? moment(this.trandate).format(AppConfig.dateFormat.apiMoment) : '',
          type: this.type || '',
          euser: this.currentUser.userCode,
          frdt: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          todt: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          requestfrom: this.requestfrom ? this.requestfrom : '',
          B2BOnly: this.B2BPartner ? this.B2BPartner : '',
          DownloadIncluded: this.dwnldOpt ? this.dwnldOpt : 'Y'
        }],
      "requestId": "700433",
      "outTblCount": "0"
    }).then((response) => {
      // console.log(response);
      // console.log('log',response.results[0][0]);
      // this.isSpinningVisible = false;
      let token = 0;
      if (response.errorCode == 0 && response.results[0][0][""] == 1) {
        // this.dataServ.get(environment.api_zip_url + token, { responseType: 'text' }).then(response => {
        //   // debugger
        //   this.isSpinningVisible = false;
        //   if (response.errorCode == 1) {
        //     // debugger
        //     this.notif.error(response.errorMsg, '')
        //   }
        //   else {
            debugger
            this.isSpinningVisible = false;
            console.log('res ', response);
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', environment.api_zip_url + token);
            document.body.appendChild(link);
            link.click();
      }
        // }).catch(err => {
        //   this.notif.error('Error in downloading pdf', '')
        //   console.log("err=", err)
        //   this.isSpinningVisible = false;
        // });
      // }
      else {
        this.isSpinningVisible = false;
        this.notif.error('Error in downloading pdf', '')
      }
    })
    // this.isSpinningVisible = true;


    // this.http.get(environment.api_zip_url + token, { responseType: 'text' }).subscribe(response => {
    //     console.log('res ', response);
    //   this.isSpinningVisible = false;
    //   let body = JSON.stringify(response);  
    // // console.log('body',body);
    // let body2 = JSON.parse(body)
    // console.log('body',body2);

    //  if(response.errorCode==1){
    //     debugger
    //     this.notif.error('response.errorMsg', '')
    //   }
    //   else{
    //     debugger
    //     console.log('res ', response);
    //     const link = document.createElement('a');
    //     link.setAttribute('target', '_blank');
    //     link.setAttribute('href', environment.api_zip_url + token);
    //     // link.setAttribute('href', environment.api_zip_url + token);
    //     link.click();
    //   }
    // })    

    //   this.http.get(environment.api_zip_url + token).map((res:Response) => (
    //     res.json() //Convert response to JSON
    // )).subscribe(data => {console.log(data)})


    // setTimeout(() => {
    //   const link = document.createElement('a');
    //   link.setAttribute('target', '_blank');
    //   link.setAttribute('href', environment.api_zip_url + 0);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    //   this.isSpinningVisible = false;
    // let data = environment.api_zip_url + token;
    // let url= this.sanitizer.bypassSecurityTrustResourceUrl(data);
    // console.log(url);
    // document.body.appendChild(url);
    // url.click();

    // }, 1000);

    // })
  }
  toggleChange() {
    // console.log(this.includeDwnld);
    if (this.includeDwnld == true) {
      this.dwnldOpt = 'Y';
    // console.log(this.includeDwnld);
    }
    else if (this.includeDwnld == false) {
      this.dwnldOpt = 'N';
    // console.log(this.includeDwnld);
    }
  }
}






