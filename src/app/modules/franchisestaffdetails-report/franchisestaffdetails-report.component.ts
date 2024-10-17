import { Component, OnInit, ViewChild } from '@angular/core';
import { FindOptions } from "shared";
import { FormHandlerComponent } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import { WorkspaceService } from 'shared';
import { AuthService } from 'shared';
import { User } from 'shared/lib/models/user';
import * as moment from 'moment';
import { AppConfig } from 'shared';

export interface FranchiseReports {
  fromdate:Date
  todate:Date
  location:any
  ISIN:any
  type:string
}
@Component({
  selector: 'app-franchisestaffdetails-report',
  templateUrl: './franchisestaffdetails-report.component.html',
  styleUrls: ['./franchisestaffdetails-report.component.less']
})
export class FranchisestaffdetailsreportComponent implements OnInit {
 @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
model:FranchiseReports
ReportType=[]
Location:string
ISINFindopt: FindOptions;
locationFindopt:FindOptions;
isSpinVisible:boolean=false
DetailedData=[]
detailDataHeads=[]
Bank=[]
currentUser:User
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService
  ) {
    this.model = <FranchiseReports>{
  
    };
    this.ISINFindopt = {
      findType: 6005,
      codeColumn: 'ISIN',
      codeLabel: 'ISIN',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    },
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
   }
   
 

  ngOnInit() {
    // this.getLocation();
    this.Location=this.dataServ.branch
    this.ReportType = [{ "code": "C", "Mode": 'Consolidated' },
    { "code": "D", "Mode": 'Detailed' }]
    this.model.fromdate=new Date()
    this.model.todate=new Date()
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
    this.model.type='D'

       this.model.location = { Location: this.dataServ.branch };
  }


  getLocation() {
    this.dataServ.getResponse({
  "batchStatus": "false",
  "detailArray":
  [{
     Location: this.dataServ.branch
   // Location: 'KH'
  }],
  "requestId": "7080",
  
}).then((response) => {debugger
  debugger
  let res;
  if (response) {
    if (response[0].rows.length > 0) {
      //var ar = [{ Bank: '' }];
      //this.Bank = ar.concat(this.utilServ.convertToObject(response[0]));
      this.Bank = this.utilServ.convertToObject(response[0]);
      this.Location = this.Bank[0].Accountcode;
    }
  }
});
}

  view(){
    debugger
    this.isSpinVisible = true;
    // if (this.Location==""||this.Location==null) {
    //   this.isSpinVisible = false;
    //   this.notif.warning("Please enter location ", ''); //date validation    
    //   return
    // }

    

      let val;
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
        [{
          location:this.model.location ? this.model.location.Location : '',
         Euser:this.currentUser.userCode
//Loc:'NP'
        }],
        "requestId": "7067",
        "outTblCount": "0"


      }).then((response) => {
        this.dataServ.viewLog(); //keeps log 
        debugger
        if (response && response[0] && response[0].rows.length > 0) {
          this.isSpinVisible = false;
          this.DetailedData = this.utilServ.convertToObject(response[0]);
          this.detailDataHeads=Object.keys(this.DetailedData[0])

        }
        else {
          this.isSpinVisible = false;
          this.DetailedData=[];
          this.notif.error("No Data Found", '');
          return;
        }
      })
    
  }

  export(){
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
        [{
          location:this.model.location ? this.model.location.Location : '',
         Euser:this.currentUser.userCode
  
        }],
        "requestId": "7067",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3' };
      let isPreview: boolean;
      isPreview = false;
  
      this.dataServ.generateReport(reqParams, isPreview).then((response) => { debugger
        // this.isSpinning = false;
        if (response.errorMsg) {
          this.notification.error(response.errorMsg, '');
          return;
        }
        else {
          if (!isPreview) {
            this.notification.success('File downloaded successfully', '');
            return;
          }
        }
      }, () => {
        this.notification.error("Server encountered an Error", '');
      });
    } 
  
  

  Reset(){
    this.model.fromdate=new Date()
    this.model.todate=new Date()
    this.model.type='D'
    this.detailDataHeads=[]
    this.DetailedData=[]
  }

}
