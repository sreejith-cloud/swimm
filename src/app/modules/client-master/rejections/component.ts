import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';

import { ClientMasterService } from '../client-master.service';
import { DataService, UtilService, AuthService, User } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { NzNotificationService, NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { interval, Subscription } from 'rxjs';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'client-master-rejections',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class RejectionsComponent implements OnInit, AfterViewInit {
  confirmModal: NzModalRef;
  subscriptions: Subscription[] = [];
  searchWithSelection: boolean = false
  data = [
    'Client  Self attestation is missing in the Proof/s.',
    'Scan image of the supporting Proof/s is not clear/readable.',
    'Proof of Correspondence address is not provided/uploaded.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];
  HolderDetails: any = {};
  clientSerialNumber: number;
  rejTypeData: any;
  searchValue: any;
  rejectionType: string;
  totalData: any = [];
  reasonsArray: any = [];
  currentUser: User;
  ho: boolean = false;
  checkedData: any = [];
  ReasonToRejectData: any = [];
  resultArray: any = [];
  showcheckedGrid: boolean = false;
  checkedDataArray: any = [];
  showKra: boolean = false;
  isLoadingKRADetails: boolean = false;
  AdditionalRejection: any;
  isFinalise: boolean;
  finalisedByClick: boolean = false;
  isEntryMadeUser: boolean;
  spin: boolean = false;
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private ngZone: NgZone,
    private utilServ: UtilService, private modal: NzModalService,
    private cmServ: ClientMasterService, private notif: NzNotificationService,
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      let branch = this.dataServ.branch
      if (branch == 'HOGT' || branch == 'HO') {
        this.ho = true;
      }
      else {
        this.ho = false;
      }
    })
  }

  ngOnInit() {
    // this.subscriptions.push(interval(120000).subscribe(x =>{
    //   this.showConfirm()
    // }))
    this.cmServ.finalize.subscribe(val => {
      this.isFinalise = val
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val

    })
    this.spin = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [],
      "requestId": "5035",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results.length) {
        this.rejTypeData = response.results[0]
        this.totalData = response.results;
      }
    })

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [
        {
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          ClientSerialNo: this.clientSerialNumber,
          Location: this.dataServ.branch,
          Euser: this.currentUser.userCode
        }
      ],
      "requestId": "5057",
      "outTblCount": "0"
    }).then((response) => {
      console.log(response)
      if (response.results) {
        if (response.results[0].length > 0) {
          this.checkedData = response.results[0]
          if (this.currentUser.userCode == this.checkedData[0].MakerEmployeeCode) {
            this.isEntryMadeUser = true;
          }
          else {
            this.isEntryMadeUser = false
          }
          this.spin = false;
        } else {
          setTimeout(() => {
            this.isEntryMadeUser = false
          });
          this.spin = false;
        }
      }
      else {
        // this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        this.spin = false;
      }

      //   if(this.ho==true){    
      //     if(response.results.length>0) {
      //     this.rejTypeData=response.results[0]
      //     this.totalData=response.results
      //     }
      //   else{
      //     console.log(response)
      //     if(response.results.length>0){
      //     this.ReasonToRejectData=response.results[1]
      //     }
      //   }
      // }
    })


  }

  checkChecked() {
    if (this.ho == false) {
      return
    }
    this.showcheckedGrid = false
    this.totalData.forEach(element => {
      if (element[0].Description) {
        element.forEach(ele => {
          if (ele["checked"] == true)
            this.showcheckedGrid = true;
          return
        });
        if (this.showcheckedGrid)
          return
      }
    });

  }
  // showConfirm(): void {
  //   this.confirmModal = this.modal.confirm({
  //     nzTitle: 'Do you Want to save these changes?',
  //     nzContent: 'When clicked the OK button, Data will be saved to draft. ',
  //     nzOnOk: () =>{
  //      this.Tempsave()
  //     }
  //   });
  // }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkChecked()
    }, 400);

    this.ngZone.run(() => {


    })
  }
  // getReasons(data){
  //    this.reasonsArray=this.totalData.filter(element=>{
  //       return element[0].Type==data
  //     })
  // }
  getReasons(data) {
    this.searchWithSelection = true;
    this.totalData.forEach(element => {
      if (element[0].Type == data) {
        this.reasonsArray = element
      }
    });
    // setTimeout(() => {

    //   this.checkChecked(this.totalData)
    // },50);

  }
  findReasons(data) {
    this.searchWithSelection = false;
    this.resultArray = []
    this.totalData.forEach(element => {
      if (element[0].Description) {
        element.forEach(ele => {
          if ((ele["Description"].toLowerCase()).indexOf(data.toLowerCase()) >= 0)
            this.resultArray.push(ele)
        });
      }
    });
    this.checkChecked()
    // setTimeout(() => {

    //   this.checkChecked(this.totalData)
    // },50);

  }
  continueNext() {
    this.cmServ.activeTabIndex.next(1);
  }
  save() {
    this.totalData.shift()
    let x = JSON.stringify(this.totalData)
    let data = JSON.parse(x)

    let obj = []
    data.forEach(element => {
      element.forEach(subel => {
        subel["TempField"] = subel["TempField"].replace("(", "#1")
        subel["TempField"] = subel["TempField"].replace(")", "#2")
        subel["TempField"] = subel["TempField"].replace("&", "|#")
        subel["TempField"] = subel["TempField"].replace(/'/gi, "#$")

        subel["Type"] = subel["Type"].replace("(", "#1")
        subel["Type"] = subel["Type"].replace(")", "#2")
        subel["Type"] = subel["Type"].replace("&", "|#")
        subel["Type"] = subel["Type"].replace(/'/gi, "#$")

        subel["Description"] = subel["Description"].replace("(", "#1")
        subel["Description"] = subel["Description"].replace(")", "#2")
        subel["Description"] = subel["Description"].replace("&", "|#")
        subel["Description"] = subel["Description"].replace(/'/gi, "#$")
        obj.push(subel)
      });
    });
    setTimeout(() => {

      console.log(obj)
      let addRej = {
        TempField: 'Additional Remarks',
        Type: 'Additional Remarks',
        Description: this.AdditionalRejection,
        checked: true
      }
      obj.push(addRej)
      let JSONData = this.utilServ.setJSONArray(obj);
      let rejXml = jsonxml(JSONData);
      console.log(rejXml)
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_RejectionDetails: rejXml,
          ClientSerialNo: this.clientSerialNumber,
          AutoSave: 'N',
        }],
        "requestId": "5036",
        "outTblCount": "0"
      }).then((response) => {
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          this.notif.success(resultSet.Msg, '');
          this.subscriptions.forEach(ele => {
            ele.unsubscribe()
          })
          // this.cmServ.activeTabIndex.next();
          // this.cmServ.trigerRejection.next(true)
        }
        else {
          this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        }
      })

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{

          FirstHolderPAN: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          ClientSerialNo: this.clientSerialNumber,
          Flag: 'R',
          Location: this.dataServ.branch
        }],
        "requestId": "5058",
        "outTblCount": "0"
      }).then((response) => {
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          this.notif.success(resultSet.Msg, '');

        }
        else {
          this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        }
      })


    }, 300);

  }
  approve() {
    this.spin = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [{

        FirstHolderPAN: this.HolderDetails["FirstHolderpanNumber"],
        Euser: this.currentUser.userCode,
        ClientSerialNo: this.clientSerialNumber,
        Flag: 'A',
        Location: this.dataServ.branch
      }],
      "requestId": "5058",
      "outTblCount": "0"
    }).then((response) => {
      if (response.ErrorCode == 0) {
        this.spin = false;
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          this.notif.success(resultSet.Msg, '');
          this.showKra = true;
        }

        else {
          this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        }

      }
      else {
        this.spin = false;
        this.notif.error(response.errorMsg, '', { nzDuration: 60000 })

      }
    })

  }

  test() {

    this.isLoadingKRADetails = true;
    let data = {
      "clientSlNo": this.clientSerialNumber,
      "userCode": this.currentUser.userCode
    }
    this.dataServ.UploadKYCRecordToCVL(data).then(response => {
      let result = response
      result.forEach(ele => {
        this.notif.info(ele.pan + "-" + ele.response, '')
      })
      this.isLoadingKRADetails = false;
    })
  }

  final() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [{

        FirstHolderPAN: this.HolderDetails["FirstHolderpanNumber"],
        Euser: this.currentUser.userCode,
        ClientSerialNo: this.clientSerialNumber,
        Flag: 'F',
        Location: this.dataServ.branch
      }],
      "requestId": "5058",
      "outTblCount": "0"
    }).then((response) => {
      let resultSet = response.results[0][0]
      if (resultSet.ErrorCode == 0) {
        this.notif.success(resultSet.Msg, '');
        // this.finalisedByClick=true;
        // this.cmServ.isEntryfinalised.next(true)
        this.cmServ.finalize.next(true)
        // this.cmServ.trigerAcOpening.next(true)
        // this.cmServ.trigerKYC.next(false)
        // this.cmServ.trigerFinancial.next(false)
        // this.cmServ.trigerTrading.next(false)
        // this.cmServ.trigerDp.next(false)
        // this.cmServ.trigerScheme.next(false)
        // this.cmServ.trigerIU.next(false)
      }
      else {
        this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
      }
    })

  }



  Tempsave() {
    this.totalData.shift()
    let x = JSON.stringify(this.totalData)
    let data = JSON.parse(x)
    let obj = []
    data.forEach(element => {
      element.forEach(subel => {
        subel["TempField"] = subel["TempField"].replace("(", "#1")
        subel["TempField"] = subel["TempField"].replace(")", "#2")
        subel["TempField"] = subel["TempField"].replace("&", "|#")
        subel["TempField"] = subel["TempField"].replace(/'/gi, "#$")

        subel["Type"] = subel["Type"].replace("(", "#1")
        subel["Type"] = subel["Type"].replace(")", "#2")
        subel["Type"] = subel["Type"].replace("&", "|#")
        subel["Type"] = subel["Type"].replace(/'/gi, "#$")

        subel["Description"] = subel["Description"].replace("(", "#1")
        subel["Description"] = subel["Description"].replace(")", "#2")
        subel["Description"] = subel["Description"].replace("&", "|#")
        subel["Description"] = subel["Description"].replace(/'/gi, "#$")
        obj.push(subel)
      });
    });
    setTimeout(() => {
      let JSONData = this.utilServ.setJSONArray(obj);
      let rejXml = jsonxml(JSONData);
      console.log(rejXml)
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_RejectionDetails: rejXml,
          ClientSerialNo: this.clientSerialNumber,
          AutoSave: 'Y',
        }],
        "requestId": "5036",
        "outTblCount": "0"
      }).then((response) => {
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          this.notif.success(resultSet.Msg, '');
          this.subscriptions.forEach(ele => {
            ele.unsubscribe()
          })
          // this.cmServ.activeTabIndex.next();
          // this.cmServ.trigerRejection.next(true)
        }
        else {
          this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        }
      })

    }, 300);

  }

}
