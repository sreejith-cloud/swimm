import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent } from "shared";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-additionalagreementssigned',
  templateUrl: './additionalagreementssigned.component.html',
  styleUrls: ['./additionalagreementssigned.component.less']
})
export class AdditionalagreementssignedComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  currentUser: User;
  TradeFindopt: FindOptions;
  locationFindopt : FindOptions;
  Tradecode:any;
  Branchlocation: any;
  ReportResponse: any = [];
  ReportResponseHeader: any = [];
  Location : any;
  isSpinning: boolean = false;
  i : any;
  Records: Array<any> = [];
  Columns: Array<any> = [];
  constructor(
     private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notif: NzNotificationService) {
      
  this.Location = { Location: this.dataServ.branch };

 this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    debugger
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

      this.TradeFindopt = {
      findType: 3010,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: true,
      requestId: 8,
      whereClause:  "LOCATION='" + this.dataServ.branch + "'"
    }
   }
   onChangelocation(data){
     
    if (data == null) {
      return
    }
    this.Tradecode = "";
    this.TradeFindopt = {
      findType: 3010,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      requestId: 8  ,
      whereClause:  "LOCATION='" + data.Location + "'"
    }
  }

  ngOnInit() {
    debugger
    
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
  }
  View()
  {
    debugger
    if (this.Location == '' || this.Location == undefined) {
      this.notif.error('Location should be selected', '')
      return false
    }
    this.isSpinning = true;
    var requestParams
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Location : this.Location.Location,
          Tradecode : this.Tradecode ? this.Tradecode.Tradecode : '',
          Flag : 'V'
        }],
        
      "requestId": "7176",
      "outTblCount": "0"
    }
    
    requestParams = reqParams

  this.dataServ.getResponse(requestParams).then(Response => {

        
        console.log(this.Tradecode)
        let data = this.utilServ.convertToResultArray(Response[0]);
      if (data.length > 0) {
        debugger
        // if( data[0].NewPOA = true)
        // {
        //   data[0].NewPOA ='T'
        // }
        this.ReportResponse = data
        this.ReportResponseHeader = Object.keys(data[0])
        this.isSpinning = false;
        this.notif.success('Data displayed successfully', '')
        
      }
      else {
        this.isSpinning = false
        this.notif.error('No data found', '')
        this.ReportResponse=[];
      
      }
    })
  }
  exportData() {
    if (this.Location == '' || this.Location == undefined) {
      this.notif.error('Location should be selected', '')
      return false
    }
  this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Location : this.Location.Location,
          Tradecode : this.Tradecode ? this.Tradecode.Tradecode : '',
          Flag : 'E'
        }],
        
      "requestId": "7176",
      "outTblCount": "0"
    }).then((response) => {
      debugger
      this.dataServ.viewLog();
      this.dataServ.isExport = false;
      let res;

      if (response[0].rows.length > 0) {
        debugger
        this.isSpinning = false
        let records = this.utilServ.convertToResultArray(response[0]);
        for (var i in records) {
          if (records[i].MCXPOA == null) {
            records[i].MCXPOA = '';
          }
        }
        this.isSpinning = false;
        this.Records = records;
        this.Columns = response[0].metadata.columns;
        this.Excel(this.Columns, this.Records, 'Additional Agreements Signed')
        this.notif.success('File downloaded successfully', '')

      } else {
        this.isSpinning = false;
        this.notif.error("No Data Found", '');

        return;
      }
    });

  }
  Excel(colums, data, filename) {
    let html;
    let tableHeader;
    var date =new Date();
 var newDate = date.getDate();
 var newMonth = date.getMonth() + 1;
 var newYear =date.getFullYear();
 var Hour = date.getHours();
 var Minutes = date.getMinutes();
 var seconds = date.getSeconds();
    html = "<table><tr><td style='border:1px solid #d6d5d2;border-width: thin;' colspan='19'><b>Date created : " +newDate+"."+newMonth+"."+ newYear +" "+ Hour + ":" + Minutes +":" +seconds+"</b></td></tr><tr>&nbsp</tr><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      html = html + "<th style='border:1px solid #30302f;border-width: thin;'>" + tableHeader[i] + "</th>";
    }
    html = html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        html = html + "<td style='border:1px solid #d6d5d2;border-width: thin; white-space: nowrap;'>" + data[i][tableHeader[j]] + "</td>";
      }
      html = html + "<tr>";
    }
    html = html + "</tr><table>";

    let blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, filename + " Report.xls");


  }
  Resetform()
  {
    this.Tradecode = ""
    this.TradeFindopt = {
      findType: 3010,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: true,
      requestId: 8,
      whereClause:  "LOCATION='" + this.dataServ.branch + "'"
    }
     this.ReportResponse = [];
     this.Location = { Location: this.dataServ.branch };
  
  }

}