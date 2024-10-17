import { Component, OnInit } from '@angular/core';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService } from "shared";
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-jvclienttransfer',
  templateUrl: './jvclienttransfer.component.html',
  styleUrls: ['./jvclienttransfer.component.less']
})
export class JvclienttransferComponent implements OnInit {
  model: any = {}
  currentUser: User;
  TradeFindopt: FindOptions;
  PANFindopt: FindOptions;
  isSpinning: boolean;
  JVCdetails: boolean;
  jvcdata: any = [];
  constructor(private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
    private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.loadsearch();
    });
  }
  loadsearch() {
    this.TradeFindopt = {
      findType: 5076,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.PANFindopt = {
      findType: 5076,
      codeColumn: 'PAN',
      codeLabel: 'PAN',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }
  ngOnInit() {
  }
  getjvcdetails(data) {

    this.JVCdetails = false;
    if (data == null) {
      return;
    }
    this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Tradecode: data.Tradecode || '',
        Euser: this.currentUser.userCode,
        pan: this.model.PAN ? this.model.PAN.PAN : '',
        flag: '',
        referraldate: '',
      }],
      "requestId": "7025",
      "outTblCount": "0"

    }).then((response) => {
      debugger
      debugger
      var a = this.utilServ.convertToObject(response[0]); debugger

      if (a[0].errorCode) {
        debugger
        this.isSpinning = false;
        this.JVCdetails = false;
        this.notification.error(a[0].msg, '')
        debugger
        return;
      }
      else {
        debugger
        this.model.PAN = { PAN: data.PAN.trim() };
        debugger
        this.JVCdetails = true;
        this.isSpinning = false;
        this.jvcdata = a; debugger
        debugger
        this.model.location = this.jvcdata[0].Curlocation;
        this.model.locationdescription = this.jvcdata[0].LocDescription;
        this.model.clientname = this.jvcdata[0].Name;
        this.model.referraldate = this.jvcdata[0].referraldate;
      } debugger
    })
  }

  save() {
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Tradecode: this.model.Tradecode.Tradecode || '',
        Euser: this.currentUser.userCode,
        pan: this.model.PAN ? this.model.PAN.PAN : this.model.Tradecode.PAN || '',
        flag: 'S',
        referraldate: this.model.referraldate ? moment(this.model.referraldate).format(AppConfig.dateFormat.apiMoment) : '',
      }],
      "requestId": "7025",
      "outTblCount": "0"
    })
      .then((response) => {
        debugger
        if (response && response[0] && response[0].rows.length > 0) {
          var a = this.utilServ.convertToObject(response[0]);

          if (a[0].errorMsg) {
            debugger
            var b = a[0].errorMsg
            this.notif.error(b, '')
            return;
          }
        }
        else {
          debugger
          this.notif.success('Data save successfully', '');
          // this.Voucherid1 = a[0].VOUCHERID

        } debugger
      });
  }
  resetForm() {

    this.JVCdetails = false;
    this.model.PAN = '';
    this.model.Tradecode = '';
  }
}