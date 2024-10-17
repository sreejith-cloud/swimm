import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FormHandlerComponent, User } from 'shared';

@Component({
  selector: 'app-brokerage-revision-approval',
  templateUrl: './brokerage-revision-approval.component.html',
  styleUrls: ['./brokerage-revision-approval.component.less']
})
export class BrokerageRevisionApprovalComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  radioValue: any = '';
  currentUser: User;
  dataSet: Array<any> = [];
  modalShow: boolean = false;
  BrokerageRevisionModalTbl: boolean = false;
  DetailData = [];
  isSpining: boolean = false;
  brokerageRevisionDownwrdArray = [];
  RevisionReason: string = '';
  BrokerageRejRemarks: string = '';
  slNo_Processing: number = null;
  processingDate = new (Date);


  constructor(private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showPreviewBtn=true;
  }

  radioChange() {
    console.log(this.radioValue);
  }

  reset() {
    this.radioValue = null;
    this.dataSet = null;
  }

  handleCancel() {
    this.modalShow = false;
  }

  findData() {
    this.isSpining = true;
    this.dataSet = [];
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          slno: 0,
          Loc: '',
          tradecode: '',
          RMorSHorED: this.radioValue || '',
          flag: 1,
          usercode: this.currentUser.userCode
        }],
      "requestId": "1000079",
      "outTblCount": "0"
    }).then((response) => {
      // console.log('brokerage approval ', response[0].rows);
      if (response.errorCode == 1) {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '');
        return
      }
      else {
        if (response[0].rows.length == 0) {
          this.notif.error('No Data Found', '');
          this.dataSet = [];
          this.isSpining = false;
          return
        }

        if (response[0].rows[0][0] == 1) {
          this.notif.error(response[0].rows[0][1], '');
          this.dataSet = [];
          this.isSpining = false;
          return
        }
        else {
          this.dataSet = response[0].rows;
          this.isSpining = false;
        }

      }
    })
  }

  showBrokerageModal(data) {
    this.isSpining = true;
    this.slNo_Processing = data
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Loc: data[1],
          tradecode: data[2],
          flag: 0,
          Delivery: 0,
          Speculation: 0,
          BrokMin: 0,
          usercode: this.currentUser.userCode
        }],
      "requestId": "1000080",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 1) {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '');
        return
      }
      else {
        if (response[0].rows[0][0] == 1) {
          this.notif.error(response[0].rows[0][1], '')
          this.isSpining = false;
          this.modalShow = false;
          return
        }
        else {
          // this.DetailData = data;
          this.modalShow = true;
          var x = response[0].metadata.columns
          this.DetailData = response[0].rows[0]
          console.log('Present Brokerage table data', x, this.DetailData);  //DetailData[0]?.OnlineDlvBrokerage   [0]?.OnlineSpecBrokerage
          this.isSpining = false;
        }
      }
    })

  }
  brokerageRevisionFn(data) {
    this.isSpining = true;
    console.log('Brokerage Revision function data', data);
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          slno: data[0],
          Loc: data[1],
          tradecode: data[2],
          RMorSHorED: this.radioValue || '',
          flag: 0,
          usercode: this.currentUser.userCode
        }],
      "requestId": "1000079",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 1) {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '');
        this.BrokerageRevisionModalTbl = false;
        return
      }
      else {
        if (response[0].rows[0][0] == 1) {
          this.notif.error(response[0].rows[0][1], '')
          this.dataSet = [];
          this.isSpining = false;
          this.BrokerageRevisionModalTbl = false;
          return
        }
        else {
          this.BrokerageRevisionModalTbl = true;
          var x = response[0].metadata.columns
          this.brokerageRevisionDownwrdArray = response[0].rows[0]
          this.RevisionReason = this.brokerageRevisionDownwrdArray[41]
          this.BrokerageRejRemarks = ''
          console.log('brokerage revision data', x, this.brokerageRevisionDownwrdArray);
        }
      }
    })
  }

  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  ApproveorReject(action) {
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Slno: this.slNo_Processing[0],
          Location: this.slNo_Processing[1].toUpperCase(),
          tradecode: this.slNo_Processing[2].toUpperCase(),
          UpwardorDownward: '',
          Del: '',
          Delivery: 0,
          Speculation: 0,
          Slab: 0,
          BrokMin: 0,
          FuturesPercent: 0,
          FuturesperLot: 0,
          OptionsperLot: 0,
          OptionOnlineIntradayPerlot: 0,
          OptionOnlineCarryforwardPerlot: 0,
          OptionOfflineIntradayPerlot: 0,
          OptionofflineCarryforwardPerlot: 0,
          CDSFuturesperLot: 0,
          CDSOptionsperLot: 0,
          MCXSXFuturesperLot: 0,
          MCXSXOptionsperLot: 0,
          comMCXNormalBrkPer: 0,
          comMCXDeliveryBrok: 0,
          comMCXIntradayBrok: 0,
          comNCDEXNormalBrok: 0,
          comNCDEXDeliveryBrok: 0,
          comNCDEXIntradayBrok: 0,
          ComOptionsNormal: 0,
          ComOptionsIntraday: 0,
          comICEXNormalBrok: 0,
          comICEXDeliveryBrok: 0,
          comICEXIntradayBrok: 0,
          Bond: '0',
          BondDelivery: 0,
          BondSpeculation: 0,
          BondSlab: 0,
          Onlinechkd: '',
          OnlineDelivery: '0',
          OnlineSpeculation: '0',
          OnlineSlab: 0,
          OnlineFuturesPercent: '0',
          OnlineFuturesperLot: '0',
          ProjectedBrok: 0, //500
          ReasonForRevision: this.RevisionReason,
          AdditionalRemarks: '',
          flag: 1,
          RMorSHorED: this.radioValue,
          RMorSHorEDapproved: action,
          RejectedRemarks: this.BrokerageRejRemarks, //.toUpperCase(),
          DOE: this.convertDate(this.processingDate),
          ApprovedUser: this.currentUser.userCode,
          usercode: '',
          SLB_Brok_Per: this.DetailData[6],
        }],
      "requestId": "1000086",
      "outTblCount": "0",
      "dbConn": undefined
    }).then((response) => {
      // console.log(response, action);
      if (response.errorCode == 0) {
        this.isSpining = false;
        if (action == 'Y') {
          console.log('Approve clicked');
          if (response.results[0][0]) {
            console.log(response);
            this.isSpining = false;
            this.sendmail(this.slNo_Processing[0])
            this.notif.success(response.results[0][0].Result, '');
            this.findData()
            this.modalShow = false;
          }
        }
        else if (action == 'R') {
          console.log('Reject clicked');
          // if (this.BrokerageRejRemarks == '' || this.BrokerageRejRemarks == null) {
          //   this.notif.error('Please enter remarks for rejection', '')
          //   return
          // }
          if (response.results[0][0].errorcode == 1) {
            this.isSpining = false;
            this.notif.error(response.results[0][0].Result, '');
            return
          }
          if (response.results[0][0]) {
            this.isSpining = false;
            this.sendmail(this.slNo_Processing[0])
            this.notif.success(response.results[0][0].Result, '');
            this.findData()
            this.modalShow = false;
            return
          }

        }
      }
      else {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '');
        return
      }

    })
  }
  sendmail(slno) {
    console.log(slno, this.slNo_Processing[1], this.slNo_Processing[2]);
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Slno: slno,
          Loc: this.slNo_Processing[1],
          tradecode: this.slNo_Processing[2],
          RMorSHorED: this.radioValue,
          flag: 1,
          usercode: this.currentUser.userCode
        }],
      "requestId": "10000101",
      "outTblCount": "0"
    }).then((response) => {
      console.log(response);
    })
  }



}
