import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, User } from 'shared';

@Component({
  selector: 'app-nre-more-than-one-account',
  templateUrl: './nre-more-than-one-account.component.html',
  styleUrls: ['./nre-more-than-one-account.component.less']
})
export class NreMoreThanOneAccountComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  isSpining:boolean=false
  currentUser:User
  fromDate:Date
  toDate:Date
  today:Date=new Date
  detailData:Array<any>=[]
  detailDataHeads:Array<any>=[]
  constructor(private dataServ:DataService, private notif:NzNotificationService,private authServ:AuthService) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
   }
   disabledFutureDate = (current: Date): boolean => {
    return ( differenceInCalendarDays(current, this.today) > 0)
  };
  ngOnInit() {
    this.buttonSet()
  }
  buttonSet()
  {
    this.formHdlr.config.showPreviewBtn=true
    // this.formHdlr.config.showExportExcelBtn=true
    this.formHdlr.config.showFindBtn=false
    this.formHdlr.config.showSaveBtn=false
  }
  view()
  {
    if(!this.fromDate)
    {
      this.notif.error("Please provide 'From' date", '',{ nzDuration: 1000});
      return
    }
    if(!this.toDate)
    {
      this.notif.error("Please provide 'To' date", '',{ nzDuration: 1000});
      return
    }
    if(this.fromDate > this.toDate)
    {
      this.notif.error("The 'From' date must have a greater value than the 'To' date", '',{ nzDuration: 1000});
      return
    }
    this.detailData = []
    this.detailDataHeads = []
    this.isSpining=true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "FromDate":this.fromDate?moment(this.fromDate).format(AppConfig.dateFormat.apiMoment):'',
          "ToDate":this.toDate?moment(this.toDate).format(AppConfig.dateFormat.apiMoment):'',
          "EUser":this.currentUser.userCode?this.currentUser.userCode:''
        }],
      "requestId": "10000112",
      "outTblCount": "0"
    })
      .then((response) => {
        console.log("responsess", response);
        if(response.errorCode == 0)
        {
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.detailData = data1;
            // console.log(this.detailData);

            this.detailDataHeads = Object.keys(this.detailData[0])
            this.isSpining = false
          }
          else {
            this.notif.error('No Data found', '',{ nzDuration: 1000});
            this.isSpining = false
            return
          }
        }
        else{
          this.notif.error('No Data found', '',{ nzDuration: 1000});
          this.isSpining = false
          return
        }
      }
          else {
            this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
            this.isSpining = false
            return
          }



      },err=>{
        console.log(err);
        this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
        this.isSpining = false
        return
      })
  }
  reset()
  {
    this.fromDate=undefined
    this.toDate=undefined
    this.detailData=[]
    this.detailDataHeads=[]
  }

}
