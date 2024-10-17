import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FindOptions, FormHandlerComponent, User } from 'shared';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dcob-ddpi-form',
  templateUrl: './dcob-ddpi-form.component.html',
  styleUrls: ['./dcob-ddpi-form.component.less']
})
export class DcobDDPIFormComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  TradecodeFindopt: FindOptions;
  tradeCode
  dpClientId
  pan
  fromDate: Date = new Date();
  toDate: Date;
  today: Date = new Date();
  isSpining: boolean = false;
  disableFuttoDate: boolean = false;
  dpClientIdFindopt: FindOptions;
  panFindOption: FindOptions;
  detailData:Array<any>=[]
  detailDataHeads:Array<any>=[]
  currentUser: User;

  constructor(private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private http: HttpClient) {
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      });
      this.dpClientIdFindopt = {
        findType: 5007,
        codeColumn: 'DpClientid',
        codeLabel: '',
        descColumn: 'dpid',
        descLabel: 'dpid',
        hasDescInput: false,
        requestId: 8,
        whereClause: "1=1"
      }
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
    this.TradecodeFindopt = {
      findType: 7021,
      codeColumn: 'ClientCode',
      codeLabel: '',
      descColumn: 'Name',
      descLabel: 'Name',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }

  }

  ngOnInit() {
    this.formHdlr.config.showSaveBtn =false
    // this.formHdlr.config.btnSaveText ='Download'
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showExportBtn = false;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showPreviewBtn = true;
    this.fromDate = null;
  }





  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  download(id?:any) {
    
    // if(this.tradeCode)
    // {
    //   if((!this.fromDate || !this.toDate )|| (!this.fromDate && !this.toDate) )
    //   {
    //     this.notif.error('Please provide required details', '')
    //     return
    //   }
    // }
    // else
    // {
    // if (!this.fromDate && !this.toDate ) {
    //   this.notif.error('Please provide required details', '')
    //   return
    // }
    // }
    // if(this.tradeCode)
    // {
    //   if((!this.fromDate || !this.toDate )|| (!this.fromDate && !this.toDate) )
    //   {
    //     this.notif.error('Please provide required details', '')
    //     return
    //   }
    // }

    // if (!this.tradeCode) {
    //   if (!this.fromDate || !this.toDate) {
    //     this.notif.error('Please provide required details', '')
    //     return
    //   }
    // }


    // if (!this.tradeCode) {
    //   this.notif.error('Please provide required details1', '')
    //     return
    // }
    // // else{
    // //   // if (this.fromDate ==null || this.toDate ==null) {
    // //     if (!this.fromDate  || !this.toDate ) {
    // //     this.notif.error('Please provide required details2', '')
    // //     return
    // //   }
    // // }
    if ((!this.fromDate || !this.toDate) && !id && !this.tradeCode && !this.pan && !this.dpClientId) {
      this.notif.error('Please provide From and To date details', '')
      return
    }
    const token = this.authServ.getAuthToken();
    this.isSpining = true;
    let reqParams: any = {
      "batchStatus": "false",
      "detailArray":
        [{
          TradeCode: this.tradeCode && this.tradeCode.ClientCode? this.tradeCode.ClientCode : '',
          Pan:this.pan && this.pan.PAN ?this.pan.PAN:'',
          DpClientId:this.dpClientId && this.dpClientId.DpClientid ?this.dpClientId.DpClientid:'',
          Dpid:this.dpClientId && this.dpClientId.dpid ?this.dpClientId.dpid:'',
          Fromdate: this.fromDate ? this.convertDate(this.fromDate) : '',
          Todate: this.toDate ? this.convertDate(this.toDate) : '',
          Flag:id?'S':'M',
          Id:id?id:'',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "1000090",
      "outTblCount": "0"
    }
    const headers = new HttpHeaders().set('Authorization', token);
    const requestOptions = {
      headers: headers,
      responseType: 'blob' as 'json',
    };
    this.http.post(environment.downloadPDF, reqParams, requestOptions).subscribe((response: any)=>{
      this.isSpining = false;
      const responseText = response;
      console.log(responseText,"responseText");
      
      responseText.text().then((data)=>{
        const textData = JSON.parse(data);
        if(textData && textData.errorCode === 1 && textData.errorMsg){
          this.notif.error(textData.errorMsg,'');
        }
        else{
          this.downloadPDF(response);
        }
      }).catch(error=>{
        console.log(error,"error");
        
        this.downloadPDF(response);
      })
    },
    (error:HttpErrorResponse)=>{
      this.isSpining = false;
      this.notif.error('Server encountered an Error','');
    })
  }

  downloadPDF(responseData){
    console.log(responseData);
    
    if (responseData instanceof Blob) {
      const blob = new Blob([responseData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      this.notif.success('File Downloaded Successfully','');
    }
    else{
      this.notif.error('Server encountered an Error','');
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.toDate) {
      return false;
    }
    return startValue.getTime() > this.toDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fromDate) {
      return false;
    }
    return endValue.getTime() <= this.fromDate.getTime();
  };

  reset() {
    this.tradeCode = null;
    this.fromDate = null;
    this.toDate = null;
    this.pan=null
    this.dpClientId=null
    this.detailData =[]
    this.detailDataHeads =[]
  }

  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };

  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today
    const todayDate = new Date();
    const yesterdayDate = new Date();
    const todaysDayOfMonth = todayDate.getDate();
    yesterdayDate.setDate(todaysDayOfMonth - 15);

    return (differenceInCalendarDays(current, yesterdayDate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };




  disabledDate = (current: Date): boolean => {
    // let date =this.fromDate
    // date.setDate( date.getDate() + 3 )
    // Can not select days before today and today
    // console.log(fromdate,"fromdate");
    console.log(this.fromDate);


    // console.log(current,"current");

    let date: Date = new Date(this.fromDate);
    date.setDate(this.fromDate.getDate() + 20);

    if (date > this.today) {
      date = this.today
    }

    return (differenceInCalendarDays(current, date) > 0 || differenceInCalendarDays(current, this.fromDate) < 0)
  };
view()
{
  if ((!this.fromDate || !this.toDate) && !this.tradeCode && !this.pan && !this.dpClientId) {
    this.notif.error('Please provide From and To date details', '')
    return
  }
  this.isSpining = true
    this.detailData = []
    this.detailDataHeads = []
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          TradeCode: this.tradeCode && this.tradeCode.ClientCode ? this.tradeCode.ClientCode : '',
          Pan:this.pan && this.pan.PAN ?this.pan.PAN:'',
          DpClientId:this.dpClientId && this.dpClientId.DpClientid ?this.dpClientId.DpClientid:'',
          Dpid:this.dpClientId && this.dpClientId.dpid ?this.dpClientId.dpid:'',
          Fromdate: this.fromDate ? this.convertDate(this.fromDate) : '',
          Todate: this.toDate ? this.convertDate(this.toDate) : '',
          Flag:'V',
          Id:'',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "1000090",
      "outTblCount": "0"
    })
      .then((response) => {
        if (response.errorCode == 0) {
          if (response.results && response.results.length > 0) {
            let data1 = response.results[0]

            if (data1 && data1.length > 0) {
              this.detailData = data1;
              this.detailDataHeads = Object.keys(this.detailData[0])
              this.isSpining = false
            }
            else {
              this.notif.error('No Data Found', '');
              this.isSpining = false
            }
          }
          else {
            this.notif.error('No Data Found', '');
            this.isSpining = false
          }
        }
        else {
          this.isSpining = false
          this.notif.error(response.errorMsg, '');
        }

      })
}
excel()
{
  if ((!this.fromDate || !this.toDate) && !this.tradeCode && !this.pan && !this.dpClientId) {
    this.notif.error('Please provide From and To date details', '')
    return
  }
let reqParams = {
  "batchStatus": "false",
  "detailArray":
    [{
          TradeCode: this.tradeCode && this.tradeCode.ClientCode ? this.tradeCode.ClientCode : '',
          Pan:this.pan && this.pan.PAN ?this.pan.PAN:'',
          DpClientId:this.dpClientId && this.dpClientId.DpClientid ?this.dpClientId.DpClientid:'',
          Dpid:this.dpClientId && this.dpClientId.dpid ?this.dpClientId.dpid:'',
          Fromdate: this.fromDate ? this.convertDate(this.fromDate) : '',
          Todate: this.toDate ? this.convertDate(this.toDate) : '',
          Flag:'E',
          Id:'',
          Euser: this.currentUser.userCode,
    }],
  "requestId": "1000090",//25460
  "outTblCount": "0"
}
reqParams['fileType'] = "3";
reqParams['fileOptions'] = { 'pageSize': 'A3R' };
let isPreview: boolean;
isPreview = false;
this.isSpining = true;

this.dataServ.generateReportmultiexcel(reqParams, isPreview).then((response) => {
  this.isSpining = false;
  if (response.errorMsg != undefined && response.errorMsg != '') {
    this.isSpining = false;
    this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
    return;
  }
  else {
    if (!isPreview) {
      this.isSpining = false;
      this.notif.success('File downloaded successfully', '',{ nzDuration: 1000});
      return;
    }
  }
}, () => {
  this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
});
}
// exportExcelData() {
//   if (!this.fromDate || !this.toDate) {
//     this.notif.error('Please provide From and To date details', '')
//     return
//   }
//   this.isSpining = true;
//   let reqParams = {
//     "batchStatus": "false",
//     "detailArray":
//       [{
//           TradeCode: this.tradeCode && this.tradeCode.ClientCode ? this.tradeCode.ClientCode : '',
//           Pan:this.pan && this.pan.PAN ?this.pan.PAN:'',
//           DpClientId:this.dpClientId && this.dpClientId.DpClientid ?this.dpClientId.DpClientid:'',
//           Dpid:this.dpClientId && this.dpClientId.dpid ?this.dpClientId.dpid:'',
//           Fromdate: this.fromDate ? this.convertDate(this.fromDate) : '',
//           Todate: this.toDate ? this.convertDate(this.toDate) : '',
//           Flag:'E',
//           // Toggling:'N',
//           Id:'',
//           Euser: this.currentUser.userCode,
//       }],
//     "requestId": "1000090",
//     "outTblCount": "0"
//   }

//   reqParams['fileType'] = "3";//"2"
//   reqParams['fileOptions'] = { 'pageSize': 'A3R' };//A3
//   let isPreview: boolean;
//   isPreview = false;
//   // this.isSpinning = true;
//   this.dataServ.generateReport(reqParams, isPreview).then((response) => {
//     this.isSpining = false;
//     if (response.errorMsg != undefined && response.errorMsg != '') {
//       this.notif.error("No Data Found", '');
//       return;

//     }
//     else {
//       if (!isPreview) {
//         this.notif.success('File downloaded successfully', '');
//         return;
//       }
//     }
//   }, () => {
//     this.notif.error("Server encountered an Error", '');
//   });
// }
}
