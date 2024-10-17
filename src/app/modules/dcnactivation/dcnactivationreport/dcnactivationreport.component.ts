import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, User, FindOptions, UtilService } from "shared";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
@Component({
  selector: 'app-dcnactivationreport',
  templateUrl: './dcnactivationreport.component.html',
  styleUrls: ['./dcnactivationreport.component.css']
})
export class DcnactivationreportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  currentUser: User;
  tdate: any;
  fdate: any;
  result: any;
  DetailData: any;
  detailDataHeads: any;
  dcnvalueArray: any
  value: any;
  dcn: any;
  dcnvalue: any
  panFindOption: FindOptions;
  kitnoFindOption: FindOptions
  geojitUniqueCodeFindOption: FindOptions;
  cinFindOption: FindOptions;
  TradeFindopt: FindOptions;
  DpAcNOFindopt: FindOptions;
  DpIDFindopt: FindOptions;
  today: any
  Pan: any;
  Tradecode: any;
  uniqueCode: any;
  DpClientId: any
  DpId: any;
  Dpids: any;

  constructor
    (private dataServ: DataService,
      private authServ: AuthService,
      private notif: NzNotificationService,
      private utilServ: UtilService
    ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.panFindOption = {
      findType: 5036,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"


    }
    this.geojitUniqueCodeFindOption = {
      findType: 5036,
      codeColumn: 'AccountCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.TradeFindopt = {
      findType: 4000,
      codeColumn: 'Clientid',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.DpAcNOFindopt = {
      findType: 5006,
      codeColumn: 'DPACNO',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    // this.DpIDFindopt = {
    //   findType: 5006,
    //   codeColumn: 'DPID',
    //   codeLabel: '',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    // }

  }

  ngOnInit() {


    console.log("this.Tradecode", this.Tradecode);


    this.tdate = new Date();
    this.fdate = new Date();
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          fromdate: "",
          todate: "",
          Euser: "",
          flag: "",
          Pan: "",
          GeojitUnicode: "",
          DPID: "",
          DPclientid: "",
          type: '',
          search: 'L'



        }],
      "requestId": "7062",
      "outTblCount": "0"
    })
      .then((response) => {
        console.log(response);
        this.result = response.results
        console.log("this.result", this.result);
        this.dcnvalueArray = Object.values(this.result[0])
        console.log("this.dcnvalueArray", this.dcnvalueArray);



      })
    this.getDpid()

  }


  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showCancelBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showCancelBtn = true;


  }
  DCNvaluechange(val) {
   
    this.dcn = val
    console.log("dcn", this.dcn);

  }
  preview() {
  

    this.DetailData = []
    this.detailDataHeads = []
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          fromdate: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          todate: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          Euser: this.currentUser.userCode,
          flag: this.dcn ? this.dcn : '',
          Pan: this.Pan ? this.Pan["PAN"] : '',
          GeojitUnicode: this.uniqueCode ? this.uniqueCode["AccountCode"] : '',
          DPID: this.DpId,
          DPclientid: this.DpClientId ? this.DpClientId["DPACNO"] : '',
          type: '',
          search: 'S'

        }],
      "requestId": "7062",
      "outTblCount": "0"
    })
      .then((response) => {
        debugger
       
        this.result = response.results
      
        if (response.errorCode == 1) {

          this.notif.error(response.errorMsg, '');
          return
        }
        else {
          debugger
          if (response.results.length > 0) {

            let data1 = response.results[0]
            console.log("data1", data1);

            
            if (data1.length > 0) {
              this.DetailData = data1;
              console.log(this.DetailData);

              this.detailDataHeads = Object.keys(this.DetailData[0])


            }

            else {
              debugger
              this.notif.error('No Data found', '');
              return

            }

            this.DetailData.forEach((element, i) => {

              if (element.DCN == true) {

                element.DCN = "Y"

                console.log(element.DCN);
              }
              else if ((element.DCN == false)) {
                element.DCN = "N"
                console.log(element.DCN);
              }
              if (element.OnlineTrading == true) {

                element.OnlineTrading = "Y"

                console.log(element.OnlineTrading);
              }
              else if ((element.OnlineTrading == false)) {
                element.OnlineTrading = "N"
                console.log(element.OnlineTrading);
              }


              if (element.Additional_T_C == true) {

                element.Additional_T_C = "Y"

                console.log(element.Additional_T_C);
              }
              else if ((element.Additional_T_C == false)) {
                element.Additional_T_C = "N"
                console.log(element.Additional_T_C);
              }


              if (element.DematECN == true) {

                element.DematECN = "Y"

                console.log(element.DematECN);
              }
              else if ((element.DematECN == false)) {
                element.DematECN = "N"
                console.log(element.DematECN);
              }


            })


          }


       }

      })

  }



  resetForm() {
    this.fdate = '';
    this.tdate = '';
    this.DetailData = '';
    this.dcn = null;
    this.Pan = '';
    this.Tradecode = ''
    this.uniqueCode = '';
    this.DpClientId = '';
    this.DpId = '';

  }
  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };



  exportData() {


    if ((this.fdate == "" || this.fdate == undefined || this.fdate ==null )&& (this.tdate == "" || this.tdate == undefined || this.tdate==null)
    &&  (this.Pan=="" || this.Pan==undefined || this.Pan==null )&& (this.DpClientId=="" || this.DpClientId==undefined || this.DpClientId==null) && 
    (this.uniqueCode=="" || this.uniqueCode==undefined || this.uniqueCode==null) && (this.DpId=="" || this.DpId==undefined || this.DpId==null) 
    && (this.dcn=="" ||this.dcn==undefined || this.dcn==null)){debugger
      this.notif.error('Please select any', '')
      return
    }
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          fromdate: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          todate: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          Euser: this.currentUser.userCode,
          flag: this.dcn ? this.dcn : '',
          Pan: this.Pan ? this.Pan["PAN"] : '',
          GeojitUnicode: this.uniqueCode ? this.uniqueCode["AccountCode"] : '',
          //clientid: this.Tradecode ? this.Tradecode["Clientid"] : '',
          DPID: this.DpId,
          DPclientid: this.DpClientId ? this.DpClientId["DPACNO"] : '',
          type: 'Excel',
          search:'S'
        }],
      "requestId": "7062",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      console.log("req", reqParams);

      console.log("excel", response);

      debugger
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

  getDPdetails(data) {
    debugger
    this.DpAcNOFindopt = {
      findType: 5006,
      codeColumn: 'DPACNO',
      codeLabel: 'DPACNO',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "dpid ='" + data + "'"
    }
  }
  getDpid() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 1
        }],
      "requestId": "3"
    }).then((response) => {
      console.log("resss", response);

      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));

          this.DpId = this.Dpids[0].DPID;
          console.log(this.DpId)

        }
      }
    });
  }
}

