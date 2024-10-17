import { Component, OnInit, ViewChild } from '@angular/core';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

import * as FileSaver from 'file-saver';




import { FindOptions, AppConfig, DataService, User, AuthService, UtilService, FormHandlerComponent } from "shared";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-poa',
  templateUrl: './poa.component.html',
  styleUrls: ['./poa.component.css']
})
export class POAComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  panFindOption: FindOptions;
  kitnoFindOption: FindOptions
  geojitUniqueCodeFindOption: FindOptions;
  cinFindOption: FindOptions;
  fdate: any
  tdate: any;
  today: any = new Date();
  Pan: any;
  Cin: any;
  uniqueCode: any;
  kitno: any;
  DetailData: any = [];
  detailDataHeads: any = [];
result:any;
currentUser: User;

  constructor(private dataServ: DataService, private authServ: AuthService, private notif: NzNotificationService,private http:HttpClient) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadsearch();
  }

  ngOnInit() {
    this.tdate = new Date();//mod aksa
    this.fdate = new Date();//mod aksa


  }

  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showCancelBtn = false;
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showCancelBtn = true;


  }

  private handleError(error: Response) {
    // console.log(error)
    // return 'Server error';
    return error;
    //Observable.throw(error.json(). || );
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
  }


  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };


  // onChangeRegion(data) {
  //   console.log("data", data);


  //   this.Pan 
  //   this.Cin 
  //   this.uniqueCode 

  //   // this.kitno = data


  //   // if (data != null) {
  //   //   this.kinoforreport = data.AccountKitNo
  //   //   this.bookletslno = data.BookletSerialNo
  //   // }
  // }

  preview() {debugger
    // if (!this.Pan) {
    //   this.notif.error('Please select PAN', '')
    //   return
    // }
    console.log("pan",this.Pan);
    
    debugger
    this.DetailData = []
    this.detailDataHeads = []
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
        
          Pan:  this.Pan ? this.Pan["PAN"]:'',
          Cin: this.Cin? this.Cin["CINNo"]:'',
          GeojitUnicode: this.uniqueCode ?this.uniqueCode["AccountCode"]:'',
          FromDate: this.fdate ? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.tdate ? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          euser: '09680'

        }],
      "requestId": "7287",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log("responsess", response);
        this.result=response.results
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.DetailData = data1;
            console.log(this.DetailData);

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

      })

  }
  resetForm(){
    this.fdate=''
    this.tdate='';
    this.uniqueCode='';
    this.Cin='';
    this.Pan='';
    this.DetailData = []
    this.detailDataHeads = []
  }


 

  
  post(url: string, body: any, options?: any) {
    return this.http
      .post(url, body, options)
     // .pipe(flatMap(this.extractData))
      .toPromise()
      .catch(this.handleError);
  }


  getimage(){
    console.log("result",this.result[0]);
    console.log("result1",this.result[0]["0"]);
    console.log("result2",this.result[0]["0"].AccountSerialNo);
    
   
    
    
    let body={
      
      "batchStatus":"false",  
      "detailArray":
      [{
      "accountSerialNo":this.result[0]["0"].AccountSerialNo,
      "euser":this.currentUser.userCode
      }],
      "requestId":"7277",
      "outTblCount":"0"
    }
    return this.post(environment.api_img_url, body,{responseType:'blob', observe: 'response'})
    .then((response: any) => {
      console.log("respdataserv",response);
      console.log("body",response.body)
     
     if(response.body){debugger
      console.log("responseresults",response.results);
      var blob = new Blob([response.body], { type: "text/plain;charset=utf-8" })


    FileSaver.saveAs(blob, 'image.pdf')
    this.notif.success('File Downloaded Successfully', '');
    
     }
       else{
        this.notif.error(" Error", '');
       }
        
    });
  }
}
