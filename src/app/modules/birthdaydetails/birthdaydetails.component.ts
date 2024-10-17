import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, User, UtilService } from 'shared';
import { FindOptions } from 'shared/lib/components/form-controls/master-nonautofind/master-nonautofind.component';

@Component({
  selector: 'app-birthdaydetails',
  templateUrl: './birthdaydetails.component.html',
  styleUrls: ['./birthdaydetails.component.less']
})
export class BirthdaydetailsComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  fromDate:any
  toDate:any
  today:any=new Date()
  isSpinning:boolean=false
  currentUser:User
  location:any
  ReportResponseHeader:any = [];
  ReportResponse:any = [];
  locationFindopt:FindOptions
  locationview:boolean=false
  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private authServ: AuthService
  ) {
    this.authServ.getUser().subscribe(user => {
      console.log(user);
      
      this.currentUser = user;
    })
    

    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    // console.log('dataserb',this.dataServ);
    
   }

  ngOnInit() {

    if (!((this.dataServ.Groupid == 1) || (this.dataServ.Groupid == 2))) {
      this.location = { Location: this.dataServ.branch };
      this.locationview=true;
    }

    this.formHdlr.config.showExportExcelBtn=false
    this.formHdlr.config.showFindBtn=false
    this.formHdlr.config.showSaveBtn=false
    this.formHdlr.config.showPreviewBtn=true
    this.fromDate=this.today
    this.toDate=this.today
    //this.location=this.dataServ.branch
  }

  view(){
    if(!this.location){this.notif.error('Please select Location','');return}
    if(!this.fromDate){this.notif.error('please select From date','');return}
    if(!this.toDate){this.notif.error('please select To date','');return}
    let sumDiff=Math.floor((Date.UTC(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate()) - Date.UTC(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate()) ) /(1000 * 60 * 60 * 24));
    console.log('sumdiff',sumDiff);
    if(sumDiff>31){
      this.notif.error('Date difference greater than 31 days is not allowed','')
      return;
    }
    //let diff_date=Math.floor((Date.UTC(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate()) - Date.UTC(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate()) ) /(1000 * 60 * 60 * 24));
    console.log('location',this.location);
    this.ReportResponse=[];
    this.ReportResponseHeader=[];
    
    var requestParams
    this.isSpinning = true
      let reqParams = {
        "batchStatus": "false",
        "detailArray":
          [{
            Location:this.location?this.location.Location:'',
            fdate:this.fromDate ? moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
            tdate:this.toDate? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
            Euser:this.currentUser.userCode

          }],
        "requestId": "200015",
        "outTblCount": "0"
      }
      requestParams = reqParams
    debugger
    this.dataServ.getResponse(requestParams).then(Response => {
      this.isSpinning = false;
      if (Response && Response[0] && Response[0].rows.length > 1) {
        let data = this.utilServ.convertToResultArray(Response[0]);

        this.ReportResponse = data
        this.ReportResponseHeader = Object.keys(data[0])

        // this.ReportResponse.forEach(item=>{
        //   item.Phone1=item.Phone1.replace(/\d(?=\d{4})/g, "*");
        //   item.Phone2=item.Phone2.replace(/\d(?=\d{4})/g, "*");
        // })
      }

      else {
        this.notif.error('No data found', '')
        this.ReportResponse = []
        // this.Reset()
      }
    })
  }

  Reset(){
    this.ReportResponse=[];
    this.ReportResponseHeader=[];
    this.fromDate=this.today;
    this.toDate=this.today;
    if(this.locationview==false){
      this.location=null
    }
   // this.location=null
  }


}
