import { Component, OnInit } from '@angular/core';
import { FormHandlerComponent, DataService, FindOptions, User, AuthService } from 'shared';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-crfautoallocation',
  templateUrl: './crfautoallocation.component.html',
  styleUrls: ['./crfautoallocation.component.css']
})
export class CrfautoallocationComponent implements OnInit {
  empcode: string='';
  empname: string='';
  currentUser: User;
  DetailData: any = [];
  detailDataHeads: any = [];
  result: any;
  entryType:string='All'
  isSpining:boolean=false
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
              console.log(this.permissionUserList);

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

  Search() {
    if (this.empcode == '' || this.empcode == null) {
      this.notif.error('Please Enter Employee Code', '');
      return
    }
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          flag: 'S',
          empcode: this.empcode?this.empcode:'',
          currentstatus: '',
          empname: '',
          entryType:'',
          Euser: this.currentUser.userCode,
          requestidno: 0
        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {
        if (response.errorCode == 0) {
          this.empname = response.results[0][0].empname
          this.isSpining = false
        }
        if (response.errorCode) {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
          return
        }
      })
  }

  Save() {
console.log(this.entryType,"this.entryType");
console.log(this.permissionUserList,"this.permissionUserList",this.currentUser.userCode);
console.log(this.permissionUserList.includes(this.currentUser.userCode));

    if (this.permissionUserList.includes(this.currentUser.userCode)) {
      this.isSpining=true
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            flag: 'I',
            empcode: this.empcode ? this.empcode : '',
            currentstatus: 'S',
            empname: this.empname ? this.empname : '',
            Entrytype:this.entryType?this.entryType:'All',
            Euser: this.currentUser.userCode,
            requestidno: 0
          }],
        "requestId": "7945",
        "outTblCount": "0"
      })
        .then((response) => {

          console.log("responsess", response);
          if (response.errorCode == 0) {

            this.notif.success("Saved Successfully", '')
            this.isSpining = false
          }
          else if(response.errorCode == 1) {
            this.notif.error(response.errorMsg, '');
            this.isSpining = false
            return
          }
          else{
            this.notif.error(response.errorMsg, '');
            this.isSpining = false
            return
          }
        })
    }
    else {
      this.notif.error('No permission to add ', '');
      this.isSpining = false
    }

  }
  View() {
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles=[]
    this.isSpining=true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: 'V',
          empcode: this.empcode ? this.empcode : '',
          currentstatus: '',
          empname: this.empname ? this.empname : '',
          Entrytype:'',
          Euser: this.currentUser.userCode,
          requestidno: 0


        }],
      "requestId": "7945",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log("responsess", response);
        this.result = response.results
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.DetailData = data1;
            console.log(this.DetailData);

            this.detailDataTitles=['Sl. No','Emp Code','Emp Name','Entry Type','Allocated User','Allocated Date']
            this.detailDataHeads = Object.keys(this.DetailData[0])
            this.isSpining = false
          }
          else {
            this.notif.error('No Data found', '');
            this.isSpining = false
            return

          }
          if (response.errorCode) {
            this.notif.error(response.errorCode, '');
            this.isSpining = false
            return
          }

        }

      })
  }

  Deleterow(data) {
    if (this.permissionUserList.includes(this.currentUser.userCode)) {
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure you want to proceed</b>',
        nzOnOk: () => {
          this.DetailData = this.DetailData.filter((item) => item.id !== data.id);
          this.notif.success('Deleted Successfully', '');
        }
      })
      console.log("data",data);

      this.dataServ.getResultArray({

        "batchStatus": "false",
        "detailArray":
          [{

            flag: 'D',
            empcode: data.empcode ? data.empcode : '',
            currentstatus: 'D',
            empname: data.empname ? data.empname : '',
            Entrytype:'',
            Euser: this.currentUser.userCode,
            requestidno: 0


          }],
        "requestId": "7945",
        "outTblCount": "0"
      })
        .then((response) => {
          console.log("dempcode", data.empcode);
          console.log("emp", data.empcode);




          console.log("responsess", response);
        })
    }
    else {
      this.notif.error('No permission to delete', '');

    }
  }


  Reset() {
    this.empcode = '';
    this.empname = '';
    this.DetailData = []
    this.detailDataHeads = []
    this.detailDataTitles=[]
    this.entryType='All'
  }
  onChangeemployeecode(event) {

    console.log("eve", event);
    this.empname = ''

  }
}
