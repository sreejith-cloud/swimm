import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CrfComponent } from '../crf.component'
import { CRFDataService } from '../CRF.service';
import { DataService } from 'shared';
import { Subscription } from 'rxjs';
import { User } from 'shared/shared';
import { UtilService, AuthService } from 'shared';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';



@Component({
  selector: 'crf-app-editwindow',
  templateUrl: './editwindow.component.html',
  styleUrls: ['./editwindow.component.less']
})
export class EditwindowComponent implements OnInit {
  edit: any;
  edittabtitle: any;
  @ViewChild('mainwindow') MainWindow: ElementRef;
  @ViewChild('CrfComponent') crfcom;
  @ViewChild('Addresss') Addresss;
  // @ViewChild(AddressComponent) addressComp:AddressComponent
  @Input() tab: string;
  @Input() Data: string[];
  clientDetails: any[];
  clientName: any;
  AccountType: any;
  AccountNo: any;
  PANNO: any;
  changeAccounts: any[] = [];
  dataforaprove: any = [];
  idno: any;
  isVisibleApproved: boolean = false;
  BankAccountsArray: any = [];
  BankAccountsArrayHead: any = [];
  isVisibleBankAccounts: boolean = false;
  filePreiewContent: {};
  filePreiewVisible: boolean = true;
  opentype: string;
  acc: any;
  Clientbasicdata: any;
  applicationStatus: any
  requestID: any;
  HO: boolean;
  subscriptions: Subscription[] = [];
  currentUser: User;
  approveOrRejectButtonFlag: boolean = false;
  finalApproveOrRejectButtonFlag: boolean;
  saveButtonFlag: boolean = false;
  HOModificationContent: any = [];
  SecondHolderName:any=null;
  ThirdHolderName:any=null;
  constructor(
    private cmServ: CRFDataService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private modalService: NzModalService,
    private notif: NzNotificationService,
  ) {
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      })
    )

    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })

    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
    })

    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })
    this.cmServ.DataForAprooval.subscribe(item => {
      this.dataforaprove = item;
    })
    this.cmServ.clientBankAccouns.subscribe(item => {
      this.BankAccountsArray = item;
    })

    this.cmServ.HOModification.subscribe(item => {
      this.HOModificationContent = item;
    })
    this.cmServ.clientBasicData.subscribe((data) => {
      this.clientName = data.AccountName ? data.AccountName : '';
      this.AccountType = data.AccountType ? data.AccountType : '';
      this.AccountNo = data.AccountCode ? data.AccountCode : '';
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber ? data.PanNumber : '';
      // console.log( "editwindow",this.Clientbasicdata)
      // this.cmServ.ClientBasicData1.next(data)  
    })
    this.cmServ.jointAccountHolderForModeOfOperation.subscribe((data) => {
      data.map((accountHolder) => {
        accountHolder.SecondHolderName ? this.SecondHolderName = accountHolder.SecondHolderName : '';
        accountHolder.ThirdHolderName ? this.ThirdHolderName = accountHolder.ThirdHolderName : '';
      })
    })
    this.cmServ.changeAccounts.subscribe((data) => {
      this.changeAccounts = [];
      this.changeAccounts = data;
    })
    this.cmServ.requestID.subscribe(item => {
      this.requestID = item
    })


  }
  ngAfterViewInit() {

    // this.cmServ.isRejected.subscribe(items => {
    //   this.IsRejected = items;
    // })
    // this.cmServ.forApproval.subscribe(i => {
    //   this.IsForAprove = i;
    // })
    // if (this.IsForAprove||this.IsRejected) {
    //   this.cmServ.DataForAprooval.subscribe(item => {
    //     this.dataforaprove = item;
    //     console.log("approvaldata",this.dataforaprove)

    //   })
    // }
  }
  ngOnInit() {
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {

      this.HO = true
    }
  }
  ngOnDestroy() {
    // this.cmServ.clientBasicData.unsubscribe();
  }
  ViewAccounts() {
    this.isVisibleApproved = true;
  }
  handleCancel() {
    this.isVisibleApproved = false;
    this.isVisibleBankAccounts = false;
  }
  ShowBankAccounts() {
    this.BankAccountsArrayHead = [];
    this.BankAccountsArrayHead = Object.keys(this.BankAccountsArray[0]);
    this.isVisibleBankAccounts = true;
  }
  ShowSignature(data) {

    if (data.AccountSignature == null) {
      return
    }
    else {
      this.filePreiewContent = {};
      this.filePreiewVisible = true;
      this.opentype = "Signature"
      this.filePreiewContent["Docdoc"] = data.AccountSignature;
      this.acc = data.AccountCode
    }

  }
  ShowexistingAddress(data) {
    this.filePreiewContent = {};
    this.filePreiewVisible = true;
    this.opentype = "Address"
    this.filePreiewContent["permanentAddress"] = data.AccountPermanentAddress ? data.AccountPermanentAddress : '';
    this.filePreiewContent["currespondanceAddress"] = data.AccountCorrespondenceAddress ? data.AccountCorrespondenceAddress : '';
    this.filePreiewContent["crfpermanentAddress"] = data.CRFAccountPermanentAddress ? data.CRFAccountPermanentAddress : '';
    this.filePreiewContent["crfcurrespondanceAddress"] = data.CRFAccountCorrespondenceAddress ? data.CRFAccountCorrespondenceAddress : '';
    this.acc = data.AccountCode
  }

  formProvider() {
    var method = "post";
    var form, key, hiddenField;
    var target = "_blank"
    var url_path = ''
    if ((this.dataServ.ipAddress.substring(8, 10) == '29')) {
      url_path = "http://devgsl.geojit.net/aspx2/ClientRegistration/PrintDoc.aspx"
    }
    else {
      url_path = "http://www.geojit.net/aspx2/ClientRegistration/PrintDoc.aspx"
    }
    form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("target", target);
    form.setAttribute("action", url_path);
    var paramValues = {
      "Id": this.requestID,
      "DB": "GFSL2021",
      "UserCode": this.currentUser.userCode,
      "flag": "SPICE_CRF",
      "type": "BRANCH",
      "ScanImageId": "0"
    }
    // var target
    for (key in paramValues) {
      if (paramValues.hasOwnProperty(key)) {
        hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", paramValues[key]);
        form.appendChild(hiddenField);
      }
    }
    return form;
  }

  callURL() {
    var form = this.formProvider()
    document.body.appendChild(form);
    form.submit();
  }

  ShowHOModifications() {
    this.filePreiewContent = {};
    this.filePreiewVisible = true;
    this.opentype = "HOMod"
    this.filePreiewContent["htmlData"] = this.HOModificationContent ? this.sanitizer.bypassSecurityTrustHtml(this.HOModificationContent) : '';
    this.acc = undefined
  }
}
