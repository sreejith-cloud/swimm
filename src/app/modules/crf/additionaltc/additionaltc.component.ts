import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CRFDataService } from '../CRF.service';
import * as  jsonxml from 'jsontoxml'
import { UtilService, AuthService, DataService, ValidationService } from 'shared';
import { UploadFile, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { CrfComponent } from '../crf.component';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { User } from 'shared/shared';
import { Subscription } from 'rxjs';
// import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CrfipvComponent } from '../crfipv/crfipv.component';
import { truncate } from 'fs';

@Component({
  selector: 'app-additionaltc',
  templateUrl: './additionaltc.component.html',
  styleUrls: ['./additionaltc.component.css']
})
export class AdditionaltcComponent implements OnInit {

  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent

  @ViewChild(CrfipvComponent) ipv: CrfipvComponent




  @Input() tab: string;
  applicationStatus: any;
  saveButtonFlag: any;
  approveOrRejectButtonFlag: any;
  finalApproveOrRejectButtonFlag: any;
  datatick: any;
  PANNO: any;
  printFlag: boolean = false;
  currentUser: User;
  ChangeAccounts: any = [];
  IDNO: any = '';
  subscriptions: Subscription[] = [];
  verificationstatus: any = [];
  ipvXmlData: any;
  FormControlNames: any = {};
  reasonList: any = [];
  AppRemarks: boolean = false;
  isSpining: boolean = false;
  RejRemarks: boolean = false;
  dataforaprove: any = [];
  SerialNumber: any = 0;
  additionaltc: any;
  Remks: any;
  isVisible = false;
  popup: boolean = false;
  RequestFrom: any;
  reasonsList: any = [];
  Cbox_Disabled: boolean
  checkBoxSelect: boolean;
  checkboxSelected: any = []
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkedArray: any = [];
  nomineeDetailsxml: any;
  convertedData: any = [];
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  requestID: any;
  ID: any;
  serielno; any = 0;
  disableFld: boolean;
  constructor(private Crf: CrfComponent,
    private modalService: NzModalService,
    private cmServ: CRFDataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private validServ: ValidationService) {

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
    this.cmServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
      this.printFlag = false

    })
    this.cmServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })
    this.cmServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;

    })



    this.cmServ.applicationStatus.subscribe(item => {

      this.applicationStatus = item
      console.log("item", item);


      // if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {

      //   this.cmServ.DataForAprooval.subscribe(item => {
      //     this.dataforaprove = item;


      //   })
      // }


      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {debugger

        this.cmServ.DataForAprooval.subscribe(item => {
          debugger
          this.dataforaprove = item;
          console.log("this.dataforaprove", this.dataforaprove);


        })
      }
      if (this.applicationStatus == 'F' || this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
        this.Remks = 'Rejection Remarks'
      }
      else {
        this.Remks = 'Remarks'
      }

    })

    this.cmServ.requestID.subscribe(item => {
      console.log("item", item);

      this.requestID = item
      console.log(" this.requestID ", this.requestID);

    })

    this.cmServ.approvelRemarks.subscribe((data) => {
      debugger
      this.approvelRemarks = data
      console.log("approvelRemarks", this.approvelRemarks);

    })
    this.cmServ.rejectionRemarks.subscribe((data) => {
      this.rejectionRemarks = data
    })

    // this.cmServ.additionalTC.subscribe((data) => {
    //   this.additionaltc = data
    //   console.log("adddd", this.additionaltc);

    // })
  }

  ngOnInit() {


    console.log(" this.cmServ.serielno", this.cmServ.serielno.value);

       console.log("This.additionalTC",this.additionaltc);

    if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
      this.FillApproveData();
    }
    this.getData()
    this.additionaltc = true
  }



  onBackClick() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {

        this.BackButtonClick();
      }
    })
  }
  ngAfterViewInit() {debugger
    console.log("this.tab",this.tab)
    this.img.setproofs(this.tab)
    var dataforapproval = this.dataforaprove[0];
    this.IDNO = dataforapproval.Request_IDNO;
    this.additionaltc = dataforapproval.TandC_Check;
    this.disableFld = true;
    console.log("dataforapproval", dataforapproval);

    debugger


    this.ipv.setIPVDetails(dataforapproval['IPVDoneBy'], dataforapproval['IPVDoneOn'], this.applicationStatus)
   // this.IDNO = this.cmServ.serielno.value
    console.log(this.IDNO);

  }


  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }
  onticked(tick) {
    console.log(tick);
    this.datatick = tick
    console.log(this.datatick);



  }

  SaveTandC(action) {
    if(this.additionaltc == '' || this.additionaltc ==undefined || this.additionaltc == false){
      this.notif.error("Please accept the terms and condition","")
      return
    }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to save ?</b>',
      nzOnOk: () => {
        this.disableFld = true;
        var proof = []
        proof = this.img.setDataForxml();
        var tandcfulldata: any = []

        tandcfulldata.push({ "ApplicableAccounts": this.ChangeAccounts });
        tandcfulldata.push({ "VerificationStatus": this.verificationstatus });
        tandcfulldata.push({ "ProofUpload": proof })
        tandcfulldata.push({ "TandCcheck": this.datatick });

        var tandcdetailsjson = this.utilServ.setJSONMultipleArray(tandcfulldata);
        var tandcDetailsXml = jsonxml(tandcdetailsjson)
        let ipvValid = true;
        if (action == 'savefinalise') {
          debugger//mod

          let ipvdata: any = []
          let ipvtotalData = { ...this.ipv.form.controls.crfIPV.value }
          ipvdata.push(ipvtotalData)
          this.ipvXmlData = jsonxml(ipvdata);

        }//mod    




        if (action == 'savefinalise') {
          debugger

          var documents = [];
          documents = this.img.reternImagefinalArray()
          let appFormReceived: boolean = false
          if (documents && documents.length > 0) {
            documents.forEach(item => {
              console.log(item["ProofDoc"]["DocName"].substring(0, 16),item.ProofDoc.DocName)
              if (item.ProofDoc.DocName == 'Additional TandC Form') {
                appFormReceived = true
              }
            })
            if (!appFormReceived) {
              this.notif.error('Additional T&C form not uploaded', '')
              return
            }
            else {
              var imageFulldata: any = []
              imageFulldata.push(documents)
              imageFulldata.push({ "ipvData": this.ipvXmlData ? this.ipvXmlData : '' });//mod
              var documentJson = this.utilServ.setJSONMultipleArray(imageFulldata)
              var documentxmldata = jsonxml(documentJson)
              var documentxml = documentxmldata.replace(/&/gi, '&amp;')
            }
          }
          else {
            this.notif.error('Please Upload Additional T&C', '')
            return
          }
        }

        var save = {
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'P',
              FileData: tandcDetailsXml.replace(/&/gi, '&amp;'),
              ActionUser: this.currentUser.userCode,
              IDNO: this.IDNO ? this.IDNO : '',
              Rejection: '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }
        var savefinalysed = {
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'I',
              FileData: documentxml,
              ActionUser: this.currentUser.userCode,
              IDNO: this.IDNO,
              Rejection: '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }

        this.dataServ.getResultArray(action == 'save' ? save : savefinalysed).then((response) => {
            this.disableFld =true;

          if (response.errorCode == 0) {
           
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {

                this.notif.success(response.results[0][0].errorMessage, '');

                if (action == 'savefinalise') {
                  this.BackButtonClick()
                  return
                }
                else {
                  this.applicationStatus = 'T';
                  this.cmServ.applicationStatus.next(this.applicationStatus);

                  this.IDNO = response.results[0][0].requestID;
                  this.modalService.info({
                    nzTitle: '<i>Info</i>',
                    nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                  })
                }
                this.cmServ.requestID.next(response.results[0][0].requestID)
                this.printFlag = true

              }
              else if (response.results[0][0].errorCode == 1) {

                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {

                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else {

                this.notif.error('Error', '');
              }
            }
            else {

              this.notif.error('Error', '');
            }
          }
          else {

            this.notif.error(response.errorMsg, '');
          }
        })

      }
    })
  }




  Approve() {
    let Remarks = this.AppRemarks ? true : false
    if (!Remarks) {
      this.notif.error('Approval remark is required', '');
      return
    }
    let reason: any = this.AppRemarks;;
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to approve with Remark <br>"<b><i>' + reason + '"</i>?</b>',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'A',
              FileData: '',
              IDNO: this.IDNO,
              ActionUser: this.currentUser.userCode,
              Rejection: reason ? reason : '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.Crf.onviewReset();
                this.img.ResetUploads();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }

            }
            else {
              this.isSpining = false
              this.notif.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    });
  }



  Reject() {
    let Remarks = this.RejRemarks ? true : false

    let reason: any = this.RejRemarks
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to reject ?', //with Remarks <br>"<b><i>' + reason + '"</i>?</b>
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.IDNO,
              ActionUser: this.currentUser.userCode,
              Rejection: reason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml

            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.img.ResetUploads();
                this.Crf.onviewReset();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
                this.Crf.onviewReset();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
                this.Crf.onviewReset();
                this.BackButtonClick();
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }

            }
            else {
              this.isSpining = false
              this.notif.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    });

  }
  FillApproveData() {
    debugger

    var dataforapproval = this.dataforaprove[0];

    console.log("dataforapproval", dataforapproval);

    this.IDNO = dataforapproval.Request_IDNO;
    this.additionaltc = dataforapproval.TandC_Check;
    this.disableFld = true;
    console.log("dataforapproval.RequestIdNo", dataforapproval.Request_IDNO);
    console.log("this.IDNO123456777", this.IDNO);

    this.SerialNumber = dataforapproval.RequestIdNo;
    console.log("this.SerialNumber", this.SerialNumber);

    // this.additionaltc = (dataforapproval.TandC_Check);
    // console.log(dataforapproval.IPVDoneBy);
    // console.log(dataforapproval.IPVDoneOn);


    
    console.log("additionalTC123456",this.additionaltc)
   

    if (this.applicationStatus == 'A') {
      debugger
      this.AppRemarks = (dataforapproval.RejectedReason)
    }
    else {
      this.RejRemarks = (dataforapproval.RejectedReason || '')
    }



  }
  fetchReasons() {

    this.isVisible = true;
    this.popup = true
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EntryType: this.tab,
          EUser: this.currentUser.userCode,
          RequestFrom: this.RequestFrom || ''
        }],
      "requestId": "7942",
      "outTblCount": "0"
    }).then((response) => {
      this.reasonsList = response.results[0];
    })
  }
  getData() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
 
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.IDNO,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      if(response && response.results && response.results[7]){
        this.reasonList = response.results[7];
      }
      if(response && response.results && response.results[2] && response.results[2][0] && response.results[2][0].Status){
      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      let Rejremarks: any = this.RejRemarks
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }

    }
  })
  }
  popOut() {
    if (this.checkBoxArray.length != 0 || this.AllcheckboxArray.length != 0) {
      this.isVisible = false

    }
    else {
      this.notif.error("You need to select at least one reason or proceed by selecting cancel button", '')
    }

  }

  changed(event, data) {
    let index = this.reasonsList.findIndex(x => x.ID === data.ID)
    if (event.target.checked == true) {
      this.checkBoxArray.push(data)
      this.checkboxSelected[index] = true

      this.checkedArray.push({ "RejectionReason": { "Reason": data.ID } })
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('checked', this.nomineeDetailsxml);
    }
    else {
      this.checkboxSelected[index] = false
      let msg = this.reasonsList[index].Description
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1)

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('Unchecked', this.nomineeDetailsxml);
    }
  }


  onSaveCheckBoxChanged(event) {
    if (event.target.checked == true) {
      this.checkBoxSelect = true
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.AllcheckboxArray.push(this.reasonsList[i].Description)
        this.convertedData.push({ "RejectionReason": { "Reason": this.reasonsList[i].ID } })
        this.checkboxSelected[i] = true
      }
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.convertedData)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('array selected', this.nomineeDetailsxml)
    }
    else {
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.checkboxSelected[i] = false
      }
      this.checkBoxSelect = false
      this.AllcheckboxArray.splice(0)
      this.convertedData.splice(0)
    }
  }
}
