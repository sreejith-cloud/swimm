import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FormHandlerComponent, User } from 'shared';
export interface DetailData {
  Name: string;
  PAN: string
  Requestidno: string
  EntryDate: string
  EntryLocation: string
  EntryType: string
}

@Component({
  selector: 'app-crf-hold-request',
  templateUrl: './crf-hold-request.component.html',
  styleUrls: ['./crf-hold-request.component.css']
})
export class CrfHoldRequestComponent implements OnInit {
  currentUser: User;
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  serialNo: string = ''
  DetailData: DetailData[] = [];
  detailDataHeads=[];
  isSpining: boolean = false
  buttonStatus: string = ''
  permissionUserList:Array<string>=[]
  detailDataTitles:Array<any>=['Sl. No','Emp Code','Emp Name','Entry Type','Allocated User','Allocated Date']
  constructor(
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private modalService: NzModalService,
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
   }

  ngOnInit() {
    this.getPermissionUserList()

  }

  getPermissionUserList(){
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: 'L',
          empcode: '',
          currentstatus: '',
          empname: '',
          Euser: this.currentUser.userCode,
          Entrytype: '',
          requestidno: 0
        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {
        console.log(response);

        if (response.errorCode == 0) {
          console.log("kerri");

          if (response.results && response.results[0]) {
            if (response.results[0][0].errorCode == 1) {
              this.notif.error(response.results[0][0].errorMsg, '');
              this.isSpining = false
            }
            else {
              this.permissionUserList = JSON.parse(response.results[0][0].permissionUserList)
              this.isSpining = false
            }
          }
          else {
            this.notif.error(response.errorMsg, '');
            this.isSpining = false
          }
        }
        else {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }
      }, (err) => {
        console.log(err, "errr");
        this.isSpining = false
      })
  }
  search() {
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles = []
    this.buttonStatus = 'search'
    if (this.serialNo == '' || this.serialNo == null) {
      this.notif.error('Please Enter Serial Number', '');
      this.serialNo = ''
      return
    }
    console.log(isNaN(Number(this.serialNo)), "this.serialNo.match");

    if (isNaN(Number(this.serialNo))) {
      this.notif.error('Please Enter Valid Serial Number', '');
      this.serialNo = ''
      return
    }
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: 'SN',
          empcode: '',
          currentstatus: '',
          empname: '',
          Euser: this.currentUser.userCode,
          Entrytype: '',
          requestidno: this.serialNo ? Number(this.serialNo) : 0
        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {
        console.log(response);

        if (response.errorCode == 0) {
          console.log("kerri");

          if (response.results && response.results[0]) {
            if (response.results[0][0].errorCode == 1) {
              this.notif.error(response.results[0][0].errorMsg, '');
              this.isSpining = false
            }
            else {
              this.DetailData = response.results[0]
              console.log(this.DetailData, "this.DetailData");

              this.detailDataTitles=['Name','Trade Code','Demat A/c No','Entry Type','Trade Code Location','Entry Location','Serial No','PAN','Entry Date']
              this.detailDataHeads = Object.keys(this.DetailData[0])

              this.isSpining = false
            }
          }
          else {
            this.notif.error(response.errorMsg, '');
            this.isSpining = false
          }
        }
        else {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }
      }, (err) => {
        console.log(err, "errr");
        this.isSpining = false
      })
  }

  hold() {
    if(this.DetailData.length===0 ){
      this.notif.error('Search for a serial number', '');//There is no entry for hold
      return
    }

    let serialNo = 0
    serialNo = (this.DetailData && this.DetailData[0] && this.DetailData[0].Requestidno) ? Number(this.DetailData[0].Requestidno) : 0
    if(this.serialNo =='' || this.serialNo !==String(serialNo)){
      this.notif.error('Search for a serial number', '');//There is no entry for hold
      return
    }
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles = []
    this.buttonStatus = 'hold'
    this.isSpining = true
    console.log(serialNo, "serialNo");

    if (this.permissionUserList.includes(this.currentUser.userCode)) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: 'H',
          empcode: '',
          currentstatus: '',
          empname: '',
          Entrytype: '',
          Euser: this.currentUser.firstname,
          requestidno: this.serialNo?this.serialNo:this.serialNo
        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log("responsess", response);
        if (response.errorCode == 0) {
          let data = response.results[0] ? response.results[0] : []
          console.log(data, "data");

          if (data && data.length > 0) {
            if (data[0].errorCode == 0) {
              this.notif.success(data[0].errorMsg, '')
              this.serialNo=''
              this.isSpining = false
            }
            else {
              this.notif.error(data[0].errorMsg, '')
              this.isSpining = false
            }
          }
          else {
            this.notif.error('Some Error From DB', '')
            this.isSpining = false
          }
        }
        else {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }
      }, err => {
        console.log(err, "errr");
        this.isSpining = false
      })
    }
    else {
      this.notif.error('No permission to add ', '');
      this.isSpining = false
    }

  }
  view() {
    this.buttonStatus = 'view'
    this.isSpining = true
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles = []
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: 'HV',
          empcode: '',
          currentstatus: '',
          empname: '',
          Entrytype: '',
          Euser: this.currentUser.userCode,
          requestidno: 0
        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log("responsess", response);
        if (response.errorCode == 0) {
          if (response.results && response.results.length > 0) {
            let data1 = response.results[0]

            if (data1 && data1.length > 0) {
              this.DetailData = data1;
              console.log(this.DetailData);
              this.detailDataTitles=['Name','Trade Code','Demat A/c No','Entry Type','Trade Code Location','Entry Location','Serial No','PAN','Entry Date','Held Date','Held User Name']
              this.detailDataHeads = Object.keys(this.DetailData[0])
              this.isSpining = false
            }
            else {
              this.notif.error('No Data found', '');
              this.isSpining = false


            }


          }
          else {
            this.notif.error('No Data found', '');
            this.isSpining = false


          }
        }
        else {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }

      })
  }
  retrieve(data) {
    if (this.permissionUserList.includes(this.currentUser.userCode)) {

    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to proceed</b>',
      nzOnOk: () => {
        this.isSpining = true
        // this.DetailData = this.DetailData.filter((item:DetailData) => item.id !== data.id);
        // this.notif.success('Deleted Successfully', '');
        this.dataServ.getResultArray({

          "batchStatus": "false",
          "detailArray":
            [{
              flag: 'RV',
              empcode: '',
              currentstatus: '',
              empname: '',
              Entrytype: '',
              Euser: this.currentUser.userCode,
              requestidno: data.Requestidno ? data.Requestidno : 0
            }],
          "requestId": "7945",
          "outTblCount": "0"
        })
          .then((response) => {
            console.log("responsess", response);
            if (response.errorCode == 0) {
              if (response.results && response.results.length > 0) {
                let data1 = response.results[0]

                if (data1 && data1.length > 0) {
                  this.DetailData = data1;
                  console.log(this.DetailData);
                  this.detailDataTitles=['Name','Trade Code','Demat A/c No','Entry Type','Trade Code Location','Entry Location','Serial No','PAN','Entry Date','Held Date','Held User Name']
                  this.detailDataHeads = Object.keys(this.DetailData[0])
                  this.notif.success('Retrieved Successfully', '');
                  this.isSpining = false
                }
                else {
                  this.notif.success('Retrieved Successfully', '');
                  this.DetailData = []
                  this.detailDataHeads = []
                  this.detailDataTitles = []
                  this.isSpining = false


                }


              }
              else {
                this.notif.error('No Data found', '');
                this.DetailData = []
                this.detailDataHeads = []
                this.detailDataTitles = []
                this.isSpining = false


              }
            }
            else {
              this.notif.error(response.errorMsg, '');
              this.isSpining = false
            }
          }, (err) => {
            console.log(err, "errrr");
            this.isSpining = false

          })
      }
    })
    }
    else {
      this.notif.error('No permission to delete', '');
      this.isSpining = false
    }
  }
  reset() {
    this.serialNo = '';
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles = []
  }

}
