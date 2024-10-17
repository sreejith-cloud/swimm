import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { UtilService, AuthService, DataService, ValidationService, User } from 'shared';
import { CrfComponent } from '../crf.component';
import { CRFDataService } from '../CRF.service';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { CrfipvComponent } from '../crfipv/crfipv.component';
import * as  jsonxml from 'jsontoxml'


interface Product {
  Product: string;
  ActiveFlag: boolean;
  Hide: boolean;
  Mtype: string;
  Info: string;
  BankProof: boolean;
  Fgenie: boolean;
  Commodity: boolean;
}
@Component({
  selector: 'app-crf-segment-addition',
  templateUrl: './crf-segment-addition.component.html',
  styleUrls: ['./crf-segment-addition.component.less']
})
export class CrfSegmentAdditionComponent implements OnInit {
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent

  @ViewChild(CrfipvComponent) ipv: CrfipvComponent
  @Input() tab: string;


  subscriptions: Subscription[] = [];
  currentUser: User;
  applicationStatus: any;
  saveButtonFlag: any;
  approveOrRejectButtonFlag: any;
  finalApproveOrRejectButtonFlag: any;
  PANNO: any;
  ChangeAccounts: any = [];
  IDNO: any = '';
  printFlag: boolean = false;
  verificationstatus: any = [];
  RejRemarks: boolean = false;
  dataforaprove: any = [];
  SerialNumber: any = 0;
  Remks: any;
  isVisible = false;
  popup: boolean = false;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  requestID: any;
  ID: any;
  serielno; any = 0;
  AppRemarks: boolean = false;
  isSpining: boolean = false;
  nomineeDetailsxml: any;
  RequestFrom: any;
  reasonsList: any = [];
  Cbox_Disabled: boolean
  checkBoxSelect: boolean;
  checkboxSelected: any = []
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkedArray: any = [];
  reasonList: any = [];
  convertedData: any = [];
  nse: any;
  bse: any;
  nsefo: any;
  nsecds: any;
  mcx: any;
  ncdex: any;
  nsemfss: any;
  ipvXmlData: any;
  segmentproducts: any;
  disablense: boolean = true;
  disablebse: boolean = true;
  disablensefo: boolean = true;
  disablensecds: boolean = true;
  disablemcx: boolean = true;
  disablencdex: boolean = true;
  disablensemfss: boolean = true;
  findata: any;
  hidefin: any;
  checktick: any
  mcxticked: any;
  bseticked: any;
  nseticked: any;

  nsefoticked: any;
  nsecdsticked: any;
  ncdexticked: any;
  productset: any;
  segmentfin: any = []
  proofsection: any;
  additionalcheck: any;
  disableFld: boolean = false;
  additionaltc: any;

  datatick: any;
  derivativeStatus: boolean;
  categryList: any;
  categoryHeader: string[];
  toggled: { [key: string]: boolean }[] = []; categoryData: any;
  bsefo: boolean;
  bsemfdp: boolean;
  bsemfd: boolean;
  bsecds: boolean;
  isSaved: boolean = false;
  commcx: any;
  comncdex: any;
  initialCategoryData: any;
  ApproveDataArray: { key: string; value: any; }[];
  toApproveSegmentDataArray: any;
  originalData: any;
  clientId: any;
  changedData: any[];
  AdditionalTCShow: any;
  ;

  // checkOptions: Array<any> = [
  //   { label: 'NSE', value: 'NSE' },
  //   { label: 'BSE', value: 'BSE' },
  //   { label: 'NSE F&O', value: 'NSEFO' },
  //   { label: 'NSE CDS', value: 'NSECDS' },
  //   { label: 'MCX', value: 'MCX' },
  //   { label: 'NCDEX', value: 'NCDEX' }

  // ];


  constructor(private Crf: CrfComponent,
    private modalService: NzModalService,
    private cmServ: CRFDataService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private crfServ: CRFDataService,
    private validServ: ValidationService) {
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;

      })
    )
    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item

    })
    this.cmServ.clientId.subscribe(item => {
      this.clientId = item
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

    this.cmServ.segmentpro.subscribe(items => {
      debugger
      this.segmentproducts = items;

    })

    this.cmServ.lastfinupdated.subscribe(items => {
      debugger
      this.findata = items;

    })

    this.cmServ.hidefins.subscribe(items => {
      debugger
      this.hidefin = items;

    })

    this.crfServ.derivativeStatus.subscribe(item => {
      this.derivativeStatus = item

    })

    this.cmServ.applicationStatus.subscribe(item => {

      this.applicationStatus = item


      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
        debugger
        this.cmServ.DataForAprooval.subscribe(item => {
          this.dataforaprove = item;
          const data = item[0].ProductDetails;

          const dataArray = JSON.parse(data);
          this.toApproveSegmentDataArray = dataArray.map(item => {
            return {
              ProductName: item.ProductName.trim(),            // Trim spaces from ProductName
              ProductStatus: item.ProductStatus.toUpperCase()  // Convert ProductStatus to uppercase
            };
          });

          this.isSaved = true;
          this.proofsection = this.dataforaprove[1]
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

      this.requestID = item

    })
    this.cmServ.segfin.subscribe(item => {
      this.segmentfin = item

    })
    this.cmServ.approvelRemarks.subscribe((data) => {
      debugger
      this.approvelRemarks = data

    })
    this.cmServ.rejectionRemarks.subscribe((data) => {
      console.log("data",data)
      this.rejectionRemarks = data
    })

    this.cmServ.tickedCheckBox.subscribe((data) => {
      debugger
      this.checktick = data
    })


    this.cmServ.additionalTC.subscribe((data) => {
      this.additionaltc = data

    })


    if (this.findata == true) {
      debugger

      this.hidefin = false;

    }
  }

  ngOnInit() {
    debugger
    this.getData()
    var branch = this.dataServ.branch;
    if (this.additionaltc == true) {
      debugger
      this.disableFld = true;
    }
    else {
      this.disableFld = false;
    }

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
  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }
  ngAfterViewInit() {
    this.img.setproofs(this.tab)
    debugger
    let branch = this.dataServ.branch;
    if (branch == 'HO') {
      debugger
      this.FillApproveData();
    }
    var dataforapproval = this.dataforaprove[0]
    debugger


    this.ipv.setIPVDetails(dataforapproval['IPVDoneBy'], dataforapproval['IPVDoneOn'], this.applicationStatus)
    this.IDNO = this.cmServ.serielno.value

    if (dataforapproval.AdditionalTC == "Y") {
      debugger

      this.additionaltc = dataforapproval.AdditionalTC;
    }
    else if (dataforapproval.AdditionalTC == "N" || null) {
      debugger
      this.disableFld = true;
    }

    if (this.segmentfin.derivativeSegment_proofDoc && this.segmentfin.derivativeSegment_proofDoc.length > 0) {
      debugger
      this.crfServ.derivativeStatus.next(true)
    }
    else {
      this.crfServ.derivativeStatus.next(false)
    }

  }

  onticked(tick) {
    this.datatick = tick
  }

  
  SaveSegment(action) {
    this.changedData = []

    this.initialCategoryData.forEach(element => {
      if (this.categryList[element.Mtype]) {
        this.categryList[element.Mtype].forEach(item => {
          if (element.Product == item.Product && element.ActiveFlag != item.ActiveFlag) {
            element.ActiveFlag = item.ActiveFlag ? 'A' : 'D'
            this.changedData.push(element)
          }
        })
      }
    })

    if(this.changedData.length == 0 && action == 'save'){

      this.notif.error("Please Activate/Reactivate Product","")
      return

    }

    debugger
    if (this.additionaltc == false && this.datatick == undefined && this.AdditionalTCShow == true) {
      debugger
      this.notif.error('Please select AdditionalTC', '')
      return
    }
    // if (action == 'save') {
    //   debugger
      this.changedData.forEach(element => {

        if (element.Product == 'NSEFO') {
          this.nsefo = true;
        }
        if (element.Product == 'COMMCX') {
          this.mcx = true;
        }
        if (element.Product == 'COMNCDEX') {
          this.ncdex = true;
        }
        if (element.Product == 'NSECDS') {
          this.nsecds = true;
        }
        if (element.Product == 'NSE') {
          this.nse = true;
        }
        if (element.Product == 'NSEMFSS') {
          this.nsemfss = true;
        }
        if (element.Product == 'BSE') {
          this.bse = true;
        }
        if (element.Product == 'BSEMFD') {
          this.bsemfd = true;
        }
        if (element.Product == 'BSEMFDP') {
          this.bsemfdp = true;
        }
        if (element.Product == 'BSEFO') {
          this.bsefo = true;
        }
        if (element.Product == 'BSECDS') {
          this.bsecds = true;
        }


      })

    // }
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to save ?</b>',
      nzOnOk: () => {
        var proof = []
        proof = this.img.setDataForxml();
        var segmentfulldata: any = []

        segmentfulldata.push({ "ApplicableAccounts": this.ChangeAccounts });
        segmentfulldata.push({ "VerificationStatus": this.verificationstatus });
        segmentfulldata.push({ "ProofUpload": proof })
        this.changedData.map(product => {

          segmentfulldata.push({
            Product: ({
              ProductName: product.Product,
              ProductStatus: product.ActiveFlag
            })
          })
        })

        segmentfulldata.push({ "Additionaltc": this.datatick ? 'Y' : 'N' });
        var segmentdetailsjson = this.utilServ.setJSONMultipleArray(segmentfulldata);
        var segmentDetailsXml = jsonxml(segmentdetailsjson)
        let ipvValid = true;
        if (action == 'savefinalise') {


          let ipvdata: any = []
          let ipvtotalData = { ...this.ipv.form.controls.crfIPV.value }
          ipvdata.push(ipvtotalData)

          this.ipvXmlData = jsonxml(ipvdata);

        }
        if (action == 'savefinalise') {
          debugger

          var documents = [];
          documents = this.img.reternImagefinalArray()


          let appFormReceived: boolean = false
          let add: boolean = false;
          let add1: boolean = false;
          let add2: boolean = false;
          let add3: boolean = false;
          let add4: boolean = false;
          let add5: boolean = false;
          if (documents && documents.length > 0) {
            documents.forEach(item => {
              if ((!add4) && ((this.nsefo == true) || (this.nsecds == true) || (this.nse == true) ||(this.nsemfss == true) || (this.ncdex == true)  || (this.mcx == true) || (this.bse == true) || (this.bsecds == true)|| (this.bsefo == true) || (this.bsemfd == true) || (this.bsemfdp == true) )) {
                debugger
                if (item.ProofDoc.DocName == 'Trade preference Form') {
                  add4 = true;
                }
              }
              if ((!add) && ((this.nsefo == true) || (this.nsecds == true) || (this.mcx == true) || (this.ncdex == true))) {
                debugger
                if (item.ProofDoc.DocName == 'Derivative Proof' || item.ProofDoc.DocName == 'DerivativeProof') {
                  add = true;
                }
              }
              if ((!add1) && ((this.mcx == true) || (this.ncdex == true))) {
                debugger
                if (item.ProofDoc.DocName == 'Commodity Categorisation Form') {
                  add1 = true;
                }
              }
              if ((this.mcx == true) || (this.ncdex == true)) {
                debugger
                if (item.ProofDoc.DocName == 'Running Account Authorisation Form') {
                  add2 = true;
                }
              }

              if ((this.mcx == true) || (this.ncdex == true)) {
                debugger
                if (item.ProofDoc.DocName == 'Schedule of Charges for commodity') {
                  add3 = true;
                }
              }

              if (this.datatick == true) {
                if (item.ProofDoc.DocName == 'Additional TandC') {
                  add5 = true;
                }
              }


            })
            if ((!add) && ((this.nsefo == true) || (this.nsecds == true) || (this.mcx == true) || (this.ncdex == true))) {
              // this.img.SupportFiles.length = 0
              this.notif.error('Please Upload Derivative Proof', '')
              return
            }

            if (!add1 && ((this.mcx == true) || (this.ncdex == true))) {

              // this.img.SupportFiles.length = 0
              this.notif.error('Please Upload Commodity Categorisation Form', '')

              return
            }


            if ((!add2) && ((this.mcx == true) || (this.ncdex == true))) {
              this.notif.error('Please Upload Running Account Autorisation Form', '')

              return
            }

            if ((!add3) && ((this.mcx == true) || (this.ncdex == true))) {
              // this.img.SupportFiles.length = 0
              this.notif.error('Please Upload Schedule of Charges for commodity', '')
              return
            }

            if ((!add4)) {
              // this.img.SupportFiles.length = 0
              this.notif.error('Please Upload Trade preference Form', '')
              return
            }
            if ((!add5) && (this.datatick == true)) {
              // this.img.SupportFiles.length = 0
              this.notif.error('Please Upload Additional T&C ', '')
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
            this.notif.error('No documents uploaded', '')
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
              FileData: segmentDetailsXml.replace(/&/gi, '&amp;'),
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
              IDNO: this.IDNO ? this.IDNO : this.requestID ? this.requestID : '',
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
        this.isSpining = true;
        this.dataServ.getResultArray(action == 'save' ? save : savefinalysed).then((response) => {
          this.isSpining = false;
          if (response.errorCode == 0) {
            this.isSaved = true;
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
    let reason: any = this.AppRemarks;
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
              IDNO: this.requestID,
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
                this.notif.error(response.results[0][0].errorMessage + response.results[0][0].errorinfo, '');
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
    let Remarks = this.nomineeDetailsxml != undefined ? true : false
    console.log(Remarks,this.RejRemarks,this.nomineeDetailsxml)
    if(Remarks)
    {
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
              IDNO: this.requestID,
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
                this.notif.success(response.results[0][0].errorMessage, '');
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
}else{
    this.notif.error('Please Select atleast one rejection remark', '');  
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
      this.reasonsList = response.results[0]?response.results[0]:[];
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
          Request_IDNO: this.IDNO?this.IDNO:this.requestID ,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      if(response && response.results && response.results[7]){
        this.reasonList = response.results[7];
      }
      if(response && response.results && response.results[2] && response.results[2][0] && response.results[2][0].Status){
      let applicationStatus = response.results && response.results[2]?response.results[2][0].Status:'';
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }
       console.log("RejeRemarks",this.RejRemarks,response,this.rejectionRemarks)
      let Rejremarks: any = this.RejRemarks
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }

    }
  })
  

    // new spice SP integration
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          clientid: this.clientId
        }],
      "requestId": "6006",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining = false;
      if (response && response.errorCode == 0){
      const initialCategoryData = response && response.results[0] ? response.results[0]:[];
      this.AdditionalTCShow = response && response.results[0] ? response.results[0][0].AdditionalTCShow:'';
      this.originalData = initialCategoryData;
      this.initialCategoryData = JSON.parse(JSON.stringify(initialCategoryData));
      this.categoryData = response && response.results[0] ? response.results[0]:[]
      if (this.dataforaprove.length > 0 && this.toApproveSegmentDataArray) {
        // const dataApproveList = Object.keys(this.dataforaprove[0])
        this.categoryData.forEach(data => {
          this.toApproveSegmentDataArray.forEach(product => {
            if (data.Product == product.ProductName) {
              data.ActiveFlag = product.ProductStatus === 'A' ? true : false;
            }
          });
        });
      }


      this.categryList = this.categoryData.reduce((result, product) => {
        if (!product.Hide) {
          if (!result[product.Mtype]) {
            result[product.Mtype] = [];
          }
          result[product.Mtype].push(product);
        }
        return result;

      }, {} as { [key: string]: Product[] });

      this.categoryHeader = Object.keys(this.categryList)
 
    this.categoryHeader.sort((a, b) => {
      if (a === "Mutual Funds") return 1;
      if (b === "Mutual Funds") return -1;
      return 0;
    });
       console.log(this.categoryHeader) 
      this.categoryHeader.forEach(element => {

        this.updateCategoryCheckboxState(element)
      })
    }
    else{
      this.notif.error('No Segments found for the client', '');
      return;
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
    }
    else {
      this.checkboxSelected[index] = false
      let msg = this.reasonsList[index].Description
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1)

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
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


  FillApproveData() {
    debugger

    // var dataforapproval = this.productset
    var dataforapproval = this.dataforaprove[0]
    var proofsegment = this.dataforaprove[1]
    //this.img.setproofs=this.dataforaprove[1]
    this.categryList.forEach(element => {
      if (dataforapproval.NSE == "Y" && element.product == 'NSE') {
        debugger
        element.ActiveFlag = true
      }
      else if (dataforapproval.NSE == "N" && element.product == 'NSE') {
        element.ActiveFlag = false
      }

    });
    this.additionaltc = this.cmServ.additionalTC
    this.IDNO = dataforapproval.RequestIdNo;
    if (this.applicationStatus == 'A') {
      debugger
      this.AppRemarks = (dataforapproval.RejectedReason)
    }
    else {
      this.RejRemarks = (dataforapproval.RejectedReason || '')
    }
  }
  areAllProductsActive(category: any): boolean {
    return this.categryList[category].every(product => product.ActiveFlag);
  }
  toggleAllCheckboxes(category: string): void {
    if (this.toggled[category]) {
      this.categryList[category].forEach(item => {
        item.ActiveFlag = false;
        this.toggled[category] = false;
      });
    } else {
      this.categryList[category].forEach(item => {
        item.ActiveFlag = true;
        this.toggled[category] = true;
      });
    }
    this.updateCategoryCheckboxState(category)
  }

  updateCategoryCheckboxState(category: string) {
    this.toggled[category] = this.categryList[category].some(product => product.ActiveFlag) ? true : false
  }

}
