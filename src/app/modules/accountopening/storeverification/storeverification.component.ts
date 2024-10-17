import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService, FormHandlerComponent } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import * as  jsonxml from 'jsontoxml'
import { InputMasks, InputPatterns } from 'shared';
export interface store {
  crforpostacc: String

}
@Component({
  selector: 'app-storeverification',
  templateUrl: './storeverification.component.html',
  styleUrls: ['./storeverification.component.less']
})
export class StoreverificationComponent implements OnInit, AfterViewInit {
  @ViewChild('batch3') batch: ElementRef;
  model: store
  boxnumber: number
  currentUser: User;
  barcodeFindOption: FindOptions
  DetailData = []
  barcodeid_temp: number
  detailDataHeads = []
  DetailDataTemp = []
  barcodeid: Number;
  tempbolean: Boolean = false
  ReciveDate: Date
  barcodeenable: boolean = true
  timeout = null
  inputMasks = InputMasks;
  tempbarcode: number
  CallAcceptDataagain:boolean=false
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
  ) {
    this.model = <store>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit() {
    this.batch.nativeElement.focus()
  }

  ngOnInit() {
    this.model.crforpostacc = 'POSTACCOPEN'
    this.ReciveDate = new Date()
  }
  view() {

    if(this.boxnumber==null || this.boxnumber==undefined){
      this.notif.warning("Please enter box number", '');
      return;
    }
    // this.isSpinVisible = true;
    this.dataServ.getResponse({
      "batchStatus": "false",

      "detailArray":
        [{

          "Boxno": this.boxnumber ? this.boxnumber : 0,
          "Euser": this.currentUser.userCode,
          "barcodeid":this.barcodeid?this.barcodeid:0

        }],
      "requestId": "6053",
      "outTblCount": "0"

    }).then((response) => {
      // this.isSpinVisible = false;
      let data = this.utilServ.convertToObject(response[0]);

      if (data.length > 0) {
        this.barcodeenable = false
        this.DetailData = [...data];
        this.detailDataHeads = Object.keys(this.DetailData[0])
      }
      else {
        this.notif.error("No Data Found", '');
        this.DetailData = [];
        this.detailDataHeads = [];
        return;
      }
    })

  }

  reset() {
    this.DetailData = [];
    this.detailDataHeads = [];
    this.boxnumber = null;
    this.barcodeid = null;
    this.barcodeenable = true
    this.CallAcceptDataagain=false
  }
  AcceptData() {
    this.tempbolean = false
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.DetailData.forEach(element => {
        if (element.barcodeid == Number(this.barcodeid)) {
          this.tempbolean = true
        }
      });
      if (!this.tempbolean) {
        this.notif.warning("Barcode does not exist", '')
        this.barcodeid = null
        return;
      }
      for (var i = 0; i < this.DetailData.length; i++) {
        if (this.DetailData[i].barcodeid == Number(this.barcodeid)) {
          if (this.DetailData[i].selectedtopool) {
            this.notif.success("Data already saved", '')
            return;
          }
          this.barcodeid = null
          this.save(this.DetailData[i], i);
        }
      }
    },2000)
  }
  save(data, index) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "RecordType": this.model.crforpostacc ? this.model.crforpostacc : '',
          "AccountSerialNo": data.AccountSerialNo ? data.AccountSerialNo : 0,
          "Boxno": Number(this.boxnumber) ? Number(this.boxnumber) : 0,
          "Euser": this.currentUser.userCode,
          "ReceivedAtStoreFlag": 'Y',
          "ReceivedAtStoreDate": '',
          "Remarks": ''
        }],
      "requestId": "6054",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        this.DetailData[index].selectedtopool = true
        var data = this.DetailData
        this.DetailData = []
        setTimeout(() => {
          var row = data[index]
          data.splice(index, 1)
          data.unshift(row)
          this.DetailData = data
        }, 50);
        this.notif.success("Store verification done successfully", '')
      }
      if (response.errorCode == 1) {
        this.notif.error(response.errorMsg, '')
      }
    })
  }
}
