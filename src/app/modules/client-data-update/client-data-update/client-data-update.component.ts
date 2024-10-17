import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FindOptions, DataService, AuthService } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { Chart } from 'chart.js';
import { NzNotificationService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { User } from 'shared/shared';

@Component({
  selector: 'app-client-data-update',
  templateUrl: './client-data-update.component.html',
  styleUrls: ['./client-data-update.component.css']
})
export class ClientDataUpdateComponent implements OnInit {

  // url: any = 'http://192.168.34.175:8080/fileUpload'
  isProcessing: boolean = false;
  BranchFindopt: FindOptions;
  RegionFindopt: FindOptions;
  TradeFindopt: FindOptions;
  selectedBranch: any;
  selectedRegion: any;
  selectedTradeCode: any;

  selectedBranch1: any;
  selectedRegion1: any;
  selectedTradeCode1: any;

  fromDate: Date;
  toDate: Date;
  cDate = new (Date);
  chart: any;
  chartData: any = [];
  erxResultSet: any = [];
  currentUser: User;

  radioValue: any = 'A';
  index: any = 0;
  allBranchesBoolean: boolean = false;
  uploadCountIfWeChooseIncrementel: any = 0;
  regionButtonBoolean: boolean = false;
  branchButtonBoolean: boolean = false;
  tradecodeButtonBoolean: boolean = false;

  regionButtonBooleanForDashboard: boolean = false;
  branchButtonBooleanForDashboard: boolean = false;
  tradecodeButtonBooleanForDashboard: boolean = false;

  incrNumOfDays: any;
  incrNumOfDaysStatus: boolean = false;
  formatter = incrNumOfDays => `${incrNumOfDays}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parser = incrNumOfDays => incrNumOfDays.replace(/\$\s?|(,*)/g, '');

  showtableModel:boolean =false
  innerTableData:Array<any> =[]
  innerTableDataHead:Array<any> =[]
  constructor(private http: HttpClient, private dataServ: DataService, private notif: NzNotificationService, private authServ: AuthService) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    })
    this.loadsearch();
  }

  ngOnInit() {

    this.fromDate = this.cDate;
    this.toDate = this.cDate;
  }
  loadsearch() {
    this.BranchFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.TradeFindopt = {
      findType: 6049,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'Name',
      descLabel: 'Name',
      requestId: 8,
      whereClause: '1=1'
    }
  }

  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.cDate) > 0;
  };

  disabledPastDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.fromDate) < 0;
  };


upload() {
  this.isProcessing = true;
  const url = environment.erx_api;
  const authKey = sessionStorage.getItem('authToken');
  const requestBody = {
      "batchStatus": "false",
      "detailArray": {
        "Incr": this.radioValue == 'A' ? 'Y' : '',
        "loc": this.selectedBranch1 && !this.allBranchesBoolean ? this.selectedBranch1.Location : "",
        "reg": this.selectedRegion1 && !this.allBranchesBoolean ? this.selectedRegion1.REGION : "",
        "Euser": this.currentUser.userCode,
        "tradeCode": this.selectedTradeCode1 && !this.allBranchesBoolean ? this.selectedTradeCode1.Tradecode : '',
        "process": "N",
        "cmdty": "N",
        "Incrnodays": Number(this.incrNumOfDays) || 0,
        "forceTransfer": "N",
        "Flag": "Y",
      },
      "fileType": this.radioValue === 'A' ? 'Incremental' : this.radioValue === 'B' ? 'Full' : '',
      "fileSequence": "Data",
      'type': this.radioValue === 'A' ? 'Y' : '',
      'incrementalNoOfDays': Number(this.incrNumOfDays) || 0,
      "requestId": "10000160",
      "dbConn": undefined//"dbgfsl22"//dbgfsl22
  };

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: authKey
    })
  };

  const timeoutDuration = 600000; // increase the timeout

  const requestPromise = new Promise((resolve, reject) => {
    this.http.post(url, requestBody, httpOptions).subscribe(resolve, reject);
  });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Middleware request timed out.');
    }, timeoutDuration);
  });

  Promise.race([requestPromise, timeoutPromise])
    .then((res: any) => {
      this.isProcessing = false;
      if (res.errorCode == 0) {
        this.notif.success('Success', 'Data Uploaded');
        this.uploadCountIfWeChooseIncrementel = 0;
      }
      if (res.errorCode == 1) {
        this.notif.error('Error', res.errorMsg);
        this.clear();
      }
    })
    .catch((error) => {
      this.isProcessing = false;
      if (error === 'Middleware request timed out.') {
        this.notif.error('Timeout', 'The request to the middleware has timed out.');
      } else {
        this.notif.error('Error', 'Something went wrong.');
      }
    });
}



  // upload() {
  //   this.isProcessing = true;
  //   const req = {
  //     "batchStatus": "false",
  //     "detailArray": {
  //       "Incr": "Y",
  //       "loc": this.selectedBranch1 && !this.allBranchesBoolean ? this.selectedBranch1.Location : "",
  //       "reg": this.selectedRegion1 && !this.allBranchesBoolean ? this.selectedRegion1.REGION : "",
  //       "Euser": this.currentUser.userCode,
  //       "tradeCode": this.selectedTradeCode1 && !this.allBranchesBoolean ? this.selectedTradeCode1.Tradecode : '',
  //       "process": "N",
  //       "cmdty": "N",
  //       "Incrnodays": Number(this.incrNumOfDays) || 0,
  //       "forceTransfer": "N",
  //       "Flag": "C",
  //       "AllBranch": this.allBranchesBoolean ? 'Y' : 'N'
  //     },
  //     "fileType": this.radioValue === 'A' ? 'Incremental' : this.radioValue === 'B' ? 'Full' : '',
  //     "fileSequence": "Data",
  //     'type': this.radioValue === 'A' ? 'Y' : '',
  //     'allBranch': this.allBranchesBoolean ? 'Y' : '',
  //     'incrementalNoOfDays': Number(this.incrNumOfDays) || 0,
  //     "requestId": "900002",
  //     "dbConn": "dbgfsl22"//dbgfsl22
  //   }
  //   this.dataServ.post(environment.erx_api, req).then((res: any) => {
  //     this.isProcessing = false;
  //     if (res.errorCode == 0) {
  //       this.notif.success('Success', 'Data Uploaded')
  //       this.uploadCountIfWeChooseIncrementel = 0;
  //     }
  //     if (res.errorCode == 1) {
  //       this.notif.error('Error', res.errorMsg)
  //       this.clear();
  //     }
  //   },(error)=>{
  //     this.isProcessing = false;
  //     this.notif.error('Error','something went wrong')
  //   })
  // }

  getUploadCount() {
    this.isProcessing = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Incr: this.radioValue == 'A' ? 'Y' : '',  //
          loc: this.selectedBranch1 ? this.selectedBranch1.Location : "",  //
          reg: this.selectedRegion1 ? this.selectedRegion1.REGION : "",   //
          Euser: this.currentUser.userCode,
          tradeCode: this.selectedTradeCode1 ? this.selectedTradeCode1.Tradecode : "",  //
          process: "N",
          cmdty: "N",
          Incrnodays: Number(this.incrNumOfDays) || 0,  //
          forceTransfer: "N",
          Flag: "C",
        }],
      "requestId": "10000160",
      'dbConn': undefined
    }).then((response: any) => {
      this.isProcessing = false;
      if (response && response.errorCode == 0) {
        if (response && response.results && response.results[0] && response.results[0] && response.results[0][0] && response.results[0][0].TotalRecords) {

          if (response.results[0][0].TotalRecords > 0) {
            this.uploadCountIfWeChooseIncrementel = response.results[0][0].TotalRecords;
            this.incrNumOfDaysStatus = true;
          }
          else {
            this.notif.error('No Records to Upload', '')
            this.uploadCountIfWeChooseIncrementel = 0;
          }
        }
        else {
          this.notif.error('No Records to Upload', '')
          this.uploadCountIfWeChooseIncrementel = 0;
        }
      }
      if (response && response.errorCode == 1) {
        this.notif.error('Error', response.errorMsg)
      }
    },(error)=>{
      this.isProcessing = false;
      this.notif.error('Error','something went wrong')
    })
  }

  getERXData() {
    this.isProcessing = true;
    this.chartData = [];
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Fromdate: this.convertDate(this.fromDate) || '',
          ToDate: this.convertDate(this.toDate) || '',
          Tradecode: this.selectedTradeCode ? this.selectedTradeCode.Tradecode : '',
          Location: this.selectedBranch ? this.selectedBranch.Location : "",
          Region: this.selectedRegion ? this.selectedRegion.REGION : "",
          Flag:'V'
        }],
      "requestId": "900001",
      'dbConn': undefined//'dbgfsl22' //uat connection db23
    }).then((response: any) => {
      this.isProcessing = false;
      if (response && response.errorCode == 0) {
        this.erxResultSet = response.results[0];
        if (this.erxResultSet) {
          // this.chartData.push(this.erxResultSet[0].DataUpdated)
          // this.chartData.push(this.erxResultSet[0].DataReverted)
          // this.chartData.push(this.erxResultSet[0].TotalCount)
          // this.chartData=this.erxResultSet.filter(item=>item.DataUpdated)
          var Label=[]
          var Color=[]
          this.erxResultSet.forEach(item => {
            if(item.DataUpdated)
              this.chartData.push(item.DataUpdated)
            if(item.Label)
              Label.push(item.Label)
            if(item.Color)
              Color.push(item.Color)
          });
          this.showChart(Label,Color);
        } else {
          this.notif.error('Error', 'No Data Found')
          this.clearChartData();
          // this.clear();
        }
      }
      if (response && response.errorCode == 1) {
        this.notif.error('Error', response.errorMsg)
        this.clearChartData();
        this.clear();
      }

    })

  }

  showChart(label,color) {



    if (this.chart) {
      this.chart.destroy()
    }
    this.chart = new Chart('canvasChart', {
      type: 'doughnut',
      data: {
        labels: label,//['Data Updated', 'Data Reverted'],
        datasets: [
          {
            label: 'My First Dataset',
            data: this.chartData,
            backgroundColor: color,
            hoverBackgroundColor: 'grey'
          },
        ],
      },
    });

  }

  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  clear() {
    this.showtableModel =false
    this.innerTableData=[]
    this.innerTableDataHead=[]

    this.selectedBranch = '';
    this.selectedRegion = '';
    this.selectedTradeCode = '';
    this.fromDate = new Date();
    this.toDate = new Date();
    this.incrNumOfDaysStatus = false;
    this.clearChartData();
    this.enableAllFilterFieldsofDashboard();
  }

  clearUploadData() {
    this.selectedBranch1 = '';
    this.selectedRegion1 = '';
    this.selectedTradeCode1 = '';
    this.radioValue = 'A';
    this.uploadCountIfWeChooseIncrementel = 0;
    this.allBranchesBoolean = false;
    this.incrNumOfDays = ''
    this.enableAllFilterFields()
  }

  clearChartData() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.chartData = [];
    this.erxResultSet = [];
  }

  clearOnTabChange() {
    if (this.index == 0) {
      this.clearUploadData();
    } else {
      this.clear();
    }
  }

  choosedallBranchesBoolean() {
    if (this.allBranchesBoolean) {
      this.selectedTradeCode1 = '';
      this.selectedBranch1 = '';
      this.selectedRegion1 = '';
    }
  }

  enableAllFilterFields() {
    this.regionButtonBoolean = false;
    this.branchButtonBoolean = false;
    this.tradecodeButtonBoolean = false;
  }

  disableFilterFieldsBasedOnSelection(selectedField) {
    setTimeout(() => {
      if (selectedField === 'region' && this.selectedRegion1) {
        this.branchButtonBoolean = true;
        this.tradecodeButtonBoolean = true;
      }
      else if (selectedField === 'branch' && this.selectedBranch1) {
        this.regionButtonBoolean = true;
        this.tradecodeButtonBoolean = true;
      }
      else if (selectedField === 'tradecode' && this.selectedTradeCode1) {
        this.regionButtonBoolean = true;
        this.branchButtonBoolean = true;
      }
      else {
        this.enableAllFilterFields();
      }
    }, 1)
  }

  enableAllFilterFieldsofDashboard() {
    this.regionButtonBooleanForDashboard = false;
    this.branchButtonBooleanForDashboard = false;
    this.tradecodeButtonBooleanForDashboard = false;
  }

  disableFilterFieldsBasedOnSelectionOnDashboard(selectedField) {
    setTimeout(() => {
      if (selectedField === 'region' && this.selectedRegion) {
        this.branchButtonBooleanForDashboard = true;
        this.tradecodeButtonBooleanForDashboard = true;
      }
      else if (selectedField === 'branch' && this.selectedBranch) {
        this.regionButtonBooleanForDashboard = true;
        this.tradecodeButtonBooleanForDashboard = true;
      }
      else if (selectedField === 'tradecode' && this.selectedTradeCode) {
        this.regionButtonBooleanForDashboard = true;
        this.branchButtonBooleanForDashboard = true;
      }
      else {
        this.enableAllFilterFieldsofDashboard();
      }
    }, 1)
  }

  checkIncrementalNoOfDays(){
    if (Number(this.incrNumOfDays) > 20){
      this.notif.error('Maximum No of Days is 20','');
      this.incrNumOfDays = this.incrNumOfDays.slice(0, -1);
    }
  }

  onIncrementNoOfDayChange(){
    if (Number(this.incrNumOfDays) && (this.incrNumOfDays > 0) && (this.incrNumOfDays!='')){
      this.incrNumOfDaysStatus = true;
    }else{
      this.incrNumOfDaysStatus = false;
      if(this.incrNumOfDays.length >0){
        this.incrNumOfDays = this.incrNumOfDays.slice(0, -1);
      }
    }
  }
  openPopup(flag)
  {
    this.innerTableData = []
    this.isProcessing = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Fromdate: this.convertDate(this.fromDate) || '',
          ToDate: this.convertDate(this.toDate) || '',
          Tradecode: this.selectedTradeCode ? this.selectedTradeCode.Tradecode : '',
          Location: this.selectedBranch ? this.selectedBranch.Location : "",
          Region: this.selectedRegion ? this.selectedRegion.REGION : "",
          Flag:flag
        }],
      "requestId": "900001",//SpBrokerageReductionFoSymbolwise
      'dbConn': undefined,
    })
      .then((response) => {
        console.log("responsess", response);
        if(response.errorCode == 0)
        {
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.innerTableData = data1;

            this.innerTableDataHead = Object.keys(this.innerTableData[0])
            this.isProcessing = false
          }
          else {
            // this.notif.error('No Data found', '',{ nzDuration: 1000});
            this.isProcessing = false
            return

          }
        }
        else{
          // this.notif.error('No Data found', '',{ nzDuration: 1000});
          this.isProcessing = false
          return
        }
        this.showtableModel =true
      }
          else {
            this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
            this.showtableModel =false
            this.isProcessing = false
            return
          }



      },err=>{
        console.log(err);
        // this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
        this.isProcessing = false
        return
      })
  }

}
