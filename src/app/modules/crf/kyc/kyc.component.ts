import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, OnDestroy, QueryList, ViewChildren, HostListener, Input } from '@angular/core';
import { ValidationService, UtilService, DataService, AuthService, User, WorkspaceService } from 'shared'
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { KYCvalidataions } from './kycValidationConfig'

// import { KYCPersonalDetailsComponent } from './personal-details/component'
// import { AddressComponent } from './address/component'
// import { ProofUploadComponent } from './proof-upload/component'
// import { ContactDetailsComponent } from './contact-details/component'
import * as  jsonxml from 'jsontoxml'
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
// import { ClientMasterService } from '../../client-master/client-master.service';
import { CRFDataService } from '../CRF.service';
import { CrfComponent } from '../crf.component';
import { ClientMasterService } from '../client-master.service';

// @AutoUnsubscribe({
//   includeArrays: true,
//   arrayName: 'subscriptions'

// })

@Component({
  selector: 'crf-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.less']
})
export class CRFKYCComponent implements OnInit, AfterViewInit {
  confirmModal: NzModalRef; // For testing by now
  subscriptions: Subscription[] = [];
  @Input() tab: string;
  @ViewChild('tabsContentRef') el: ElementRef;
  @ViewChild('addressSecRef') addel: ElementRef;
  @ViewChild('tabsContacttRef') contactel: ElementRef;
  @ViewChild('kycRef') kycel: ElementRef;
  @ViewChild('kycPersnalDetails1') kycPersnalDetails1;
  @ViewChild('kycAddress1') kycAddress1;
  @ViewChild('kycContactDetails1') kycContactDetails1;
  // @ViewChild('financials') financials;
  @ViewChild('kycProofUpload1') kycProofUpload1;
  @ViewChildren('kycpersonal') kycpersonal: QueryList<CRFKYCComponent>;
  @ViewChildren('kycAddress') kycAddress: QueryList<CRFKYCComponent>;
  @ViewChildren('kycContactDetails') kycContactDetails: QueryList<CRFKYCComponent>;
  @ViewChildren('kycProofUpload') kycProofUpload: QueryList<CRFKYCComponent>;
  @ViewChildren('kycCompBasic') kycCompBasic: QueryList<CRFKYCComponent>;
  @ViewChildren('kycCompContactDetails') kycCompContactDetails: QueryList<CRFKYCComponent>;
  @ViewChildren('kycCompAdd') kycCompAdd: QueryList<CRFKYCComponent>;
  currentUser: User;
  FormControlNames: {} = {};
  // @ViewChild(KYCPersonalDetailsComponent) KYCPersonalDetails: KYCPersonalDetailsComponent
  // @ViewChild(AddressComponent) Address: AddressComponent
  // @ViewChild(ProofUploadComponent) ProofUpload: ProofUploadComponent
  // @ViewChild(ContactDetailsComponent) contactDetails: ContactDetailsComponent
  tabs: any[] = [];
  indTabs: any[] = [];
  kycCount: number = 3;
  clientType: string;
  activeTabIndex: number = 0
  KYCPersonalDetailsXmlData: any;
  numberOfHolders: number;
  // kycCurrentAddressData1: any;
  // kycAdditionalAddressData1: any;
  // kycCorrespondenceAddressData1: any;
  kycJurisdictionAddressData1: any;
  // kycCurrentAddressData2: any;
  // kycAdditionalAddressData2: any;
  // kycCorrespondenceAddressData2: any;
  kycJurisdictionAddressData2: any;
  // kycCurrentAddressData3: any;
  // kycAdditionalAddressData3: any;
  // kycCorrespondenceAddressData3: any;
  kycJurisdictionAddressData3: any;
  HolderDetails: any;
  isSpining: boolean = false;
  Holder1PanDetails: any;
  Holder2PanDetails: any;
  Holder3PanDetails: any;
  clientSerialNumber: number;
  showPortal: boolean;
  previewImageData: any;
  branch: string;
  nonIndPersonaldetails: any = [];
  nonIndAddress: any = [];
  nonIndContactDetails: any = [];
  nonIndProofUpload: any = [];
  nonIndComBasic: any = [];
  nonIndComAddress: any = [];
  nonIndCompContactDetails: any = [];
  EntryAccess: any;
  timeout = null;
  kycContMob1: boolean = false;
  kycAddContMob1: boolean = false;
  kycContEmail1: boolean = false;
  kycContAddEmail1: boolean = false;
  kycContMob2: boolean = false;
  kycAddContMob2: boolean = false;
  kycContEmail2: boolean = false;
  kycContAddEmail2: boolean = false;
  kycAddContMob3: boolean = false;
  kycContEmail3: boolean = false;
  kycContAddEmail3: boolean = false;
  kycContMob3: boolean = false;
  NRI: boolean = false;
  isServiceBocked: boolean;
  currTabIndex: number;
  wsKey: string;
  clientProfileEdit: boolean = false;
  clientIdDetails: any;
  autosaveTiming: any = 60000;
  today = new Date();
  customValidationMsgObj = KYCvalidataions;
  isServiceCallsAllow: boolean;
  firstHolderFetchingDone: boolean = false;
  isEntryfinalised: boolean;
  clientdata: any;
  BasicData: any = []
  boDataReceived: boolean = false
  verificationStstus: any;
  accountsToBeChanged: any;
  changeRequest: any;
  dataforaprove: any;
  RejRemarks: any;
  AppRemarks: any;
  isFfromReport: boolean;
  saveButtonFlag: boolean
  approveOrRejectButtonFlag: boolean
  finalApproveOrRejectButtonFlag: boolean
  printButtonFlag: boolean
  PAN: any;
  DOB: any;
  idno
  SerialNumber: any;
  printFlag: boolean
  applicationStatus: any;
  requestID: any;
  HO: boolean = false;
  proofCount: number = 0;
  derivativeStatus: boolean
  defaultResStatus: any;
  nameinpansite: any;
  BOCount: any = 0;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  editFlag: boolean = false;
  reasonList: any = [];
  reasonsList: any = [];
  Cbox_Disabled: boolean;
  checkedArray: any = [];
  nomineeDetailsxml: any;
  checkBoxSelect: boolean;
  convertedData: any = [];
  allcheckedArray: any = [];
  popup: boolean = false;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  checkboxSelected: any = [];
  isVisible = false;
  RequestFrom: any;


  constructor(
    private ngZone: NgZone,
    private dataServ: DataService,
    private authServ: AuthService,
    private cmServ: ClientMasterService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
    private modal: NzModalService,
    private wsServ: WorkspaceService,
    private crfServe: CRFDataService,
    private crf: CrfComponent
  ) {
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
        this.branch = this.dataServ.branch
        // console.log("sadasd",this.currentUser)
      }))
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
    })

    // this.CRFService.ClientBasicData1.subscribe(val => {
    //   this.clientdata = val
    //   console.log("full data",this.clientdata)
    //   var heads=Object.keys(this.clientdata)
    //   console.log("testheads",heads)
    //   if(heads.length>0)
    //   {
    //   this.fillClientBasicdata()
    //   }
    // })
    //   this.crfServe.clientBasicData.subscribe((data) => {
    //     this.BasicData=data
    //     console.log("basic data",this.BasicData)
    //     var heads=[]
    //     heads=Object.keys(data)
    //     if(heads.length>0)
    //     {
    //       this.PAN=this.BasicData.PANNo?this.BasicData.PANNo:this.BasicData.PanNumber
    //       this.DOB=this.BasicData.AccountDOB?this.BasicData.AccountDOB:this.BasicData.DOB
    //     this.fillClientBasicdata(data)
    //     // this.fetchData()
    //     }   

    // })

    // this.crfServe.verificationstatus.subscribe(item=>{
    //   this.verificationStstus=item;
    // })
    // this.crfServe.changeAccountsXML.subscribe(item=>{
    //   this.accountsToBeChanged=item
    // })
    this.crfServe.applicationStatus.subscribe(item => {
      this.applicationStatus = item
      this.cmServ.applicationStatus.next(item)
    })

    this.crfServe.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })

    this.crfServe.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.crfServe.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
    })

    this.cmServ.nameinpansite.subscribe(item => {
      if (item && item != '') {
        this.nameinpansite = item
      }
    })

    this.crfServe.derivativeStatus.subscribe(item => {
      this.derivativeStatus = item
      this.cmServ.derivativeStatus.next(this.derivativeStatus)
    })

    this.cmServ.isNRE.subscribe(val => {
      this.NRI = val
    });

    this.crfServe.approvelRemarks.subscribe((data) => {
      this.approvelRemarks = data
    })

    this.crfServe.requestID.subscribe(item => {
      this.requestID = item
    })

  }
  ngAfterViewInit() {
    // this.cmServ.nameinpansite.next('');
    this.cmServ.merchantnavyStatus.next(false);
    this.kycProofUpload1.setproofs(this.tab)

    this.crfServe.verificationstatus.subscribe(item => {
      this.verificationStstus = item;
      this.kycPersnalDetails1.form.controls.ckyc.patchValue(item.CKYC_No)
      if (item.NROClnt != 0)
        this.cmServ.isNRE.next(true)
      else
        this.cmServ.isNRE.next(false)
    })
    this.crfServe.changeAccountsXML.subscribe(item => {
      this.accountsToBeChanged = item
    })
    this.crfServe.DataForAprooval.subscribe(item => {
      this.dataforaprove = item;
      if (this.dataforaprove.length > 0) {
        this.idno = this.dataforaprove[0].Request_IDNO;
        if (this.applicationStatus == 'A') {
          this.AppRemarks = this.dataforaprove[0].RejectedReason;
        }
        else {
          this.RejRemarks = this.dataforaprove[0].RejectedReason || '';
        }
      }
    })
    this.crfServe.requestID.subscribe(item => {
      this.requestID = item
    })
    this.crfServe.changeRequest.subscribe(item => {
      this.changeRequest = item
    })

    this.crfServe.clientBasicData.subscribe((data) => {
      this.BasicData = data
      var heads = []
      heads = Object.keys(data)
      if (heads.length > 0) {
        debugger
        this.PAN = this.BasicData.PANNo ? this.BasicData.PANNo : this.BasicData.PanNumber
        this.DOB = this.BasicData.AccountDOB ? this.BasicData.AccountDOB : this.BasicData.DOB
        this.cmServ.PAN.next(this.PAN)
        // this.fillClientBasicdata(data)
        if (this.DOB) {
          var dtarray = this.DOB.split('.')
          var dt = dtarray[0]
          var mm = dtarray[1]
          var yr = dtarray[2]
          var date = yr + '-' + mm + '-' + dt
        }
        this.kycPersnalDetails1.form.controls.pan.patchValue(this.PAN)
        // this.kycPersnalDetails1.form.controls.dob.patchValue(data)
        this.kycPersnalDetails1.form.controls.dob.patchValue(date)
        if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
          this.fetchData()
        }
        // this.fetchData()
      }

    })

    this.cmServ.proceedType.subscribe(val => {
      if (!this.dataServ.fromreport) {
        if (this.kycPersnalDetails1.form.controls.ProceedType.value == '' || this.kycPersnalDetails1.form.controls.ProceedType.value == undefined) {
          return
        }
        if (val != '') {
          if (val == 'KRA') {
            this.kycPersnalDetails1.fillKraDetials(val);
            // this.crfServe.chooseAOF.next(false)
            this.dataServ.getKRAdetails.subscribe(res => {
              if ((Object.keys(res)).length == 0) {
                return
              }
              else {
                let error = res['Error']
                let response = []
                if (error[0].ErrorCode == 0) {
                  response = res['Response']
                  if (response != [] && response.length > 0) {
                    this.kycAddress1.add2.controls.city.setValue(response[0].APP_COR_CITY)
                    this.kycAddress1.add2.controls.pinCode.setValue(response[0].APP_COR_PINCD)
                    this.kycAddress1.add2.controls.houseName.setValue(response[0].APP_COR_ADD1)
                    this.kycAddress1.add2.controls.state.setValue(response[0].APP_COR_STATE)
                    this.kycAddress1.add2.controls.country.setValue(response[0].APP_COR_CTRY)

                    this.kycAddress1.add2.controls.street.setValue(response[0].APP_COR_ADD3)
                    this.kycAddress1.add1.controls.city.setValue(response[0].APP_PER_CITY)
                    this.kycAddress1.add1.controls.pinCode.setValue(response[0].APP_PER_PINCD)

                    this.kycAddress1.add1.controls.houseName.setValue(response[0].APP_PER_ADD1)
                    this.kycAddress1.add1.controls.street.setValue(response[0].APP_PER_ADD3)
                    this.kycAddress1.add1.controls.state.setValue(response[0].APP_PER_STATE)
                    this.kycAddress1.add1.controls.country.setValue(response[0].APP_PER_CTRY)
                    this.kycPersnalDetails1.form.controls.residentialStatus.setValue(response[0].APP_RES_STATUS)
                    this.kycPersnalDetails1.form.controls.nationality.setValue(response[0].APP_NATIONALITY)
                    let valuesArray = JSON.stringify(this.cmServ.getControls(this.kycAddress1.totalProofDetial, this.kycAddress1.code))
                    this.kycAddress1.Address1formFeilds = JSON.parse(valuesArray)
                    this.kycAddress1.Address2formFeilds = JSON.parse(valuesArray)
                    this.kycAddress1.add1.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                    this.kycAddress1.add2.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                    this.kycContactDetails1.form.controls.mobile.setValue(response[0].APP_MOB_NO)
                    this.kycContactDetails1.form.controls.email.setValue(response[0].APP_EMAIL)
                    // this.kycPersnalDetails1.form.controls.nameinpansite.setValue(this.nameinpansite);
                    setTimeout(() => {
                      this.kycAddress1.kraGetDistrictbyPincode(response[0].APP_COR_PINCD, 'Address2')
                      this.kycAddress1.kraGetDistrictbyPincode(response[0].APP_PER_PINCD, 'Address1')
                    }, 50)
                    if (this.activeTabIndex == 0)
                      this.cmServ.kraAccountOpeiningFirstHolderData.next(response[0].APP_NAME)
                  }
                  else {
                    this.kycPersnalDetails1.form.controls.ProceedType.patchValue('BO')
                  }
                }
              }
            })
          }
          else if (val == 'BO') {
            this.fetchData()
            setTimeout(() => {
              this.kycPersnalDetails1.form.controls.ProceedType.patchValue('BO')
              if (this.nameinpansite && this.nameinpansite != '') {
                this.kycPersnalDetails1.form.controls.nameinpansite.setValue(this.nameinpansite)
              }
            }, 1000)
          }
        }
      }
      if (this.NRI) {
        this.kycAddress1.form.controls.taxOutsideIndia.patchValue(true)
      }

    })

    this.ngZone.run(() => {

      this.kycContactDetails1.form.controls.mobile.valueChanges.subscribe(val => {
        if (!this.dataServ.fromreport || this.applicationStatus == 'R') {
          if (val != null) {
            if (val.length == 10) {
              this.validateMobileorEmail(this.PAN, val, 'M', this.branch, 'mob1')
            }
            else {
              this.kycContactDetails1.form.controls.existingPan.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient.patchValue(null)
              this.kycContactDetails1.form.controls.relation.patchValue(null)
              this.kycContMob1 = false
            }
          }
          else {
            this.kycContMob1 = false
          }
        }
      })
      this.kycContactDetails1.form.controls.additionalMblNo.valueChanges.subscribe(val => {
        if (!this.dataServ.fromreport) {
          if (val != null) {
            if (val.length == 10) {
              this.validateMobileorEmail(this.PAN, val, 'M', this.branch, 'Addmob1')
            }
            else {
              this.kycContactDetails1.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails1.form.controls.relation1.patchValue(null)
              this.kycAddContMob1 = false
            }
          } else {
            this.kycAddContMob1 = false
          }
        }
      })

      this.kycContactDetails1.form.controls.email.valueChanges.subscribe(val => {
        if (!this.dataServ.fromreport || this.applicationStatus == 'R') {
          setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.PAN, val, 'E', this.branch, 'email1')
            } else {
              this.kycContactDetails1.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails1.form.controls.relation2.patchValue(null)
              this.kycContEmail1 = false
            }
          }, 500);
        }
      })
      this.kycContactDetails1.form.controls.addEmail.valueChanges.subscribe(val => {
        if (!this.dataServ.fromreport) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.PAN, val, 'E', this.branch, 'addEmail1')
            } else {
              this.kycContactDetails1.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails1.form.controls.relation3.patchValue(null)
              this.kycContAddEmail1 = false
            }
          }, 1000);
        }
      })
    })
  }
  validateMobileorEmail(pan, mobEmail, flag, loc, type) {
    if (this.EntryAccess == false) {
      return
    }
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: pan,
          MobEmail: mobEmail,
          Flag: flag,
          location: loc,
          sFlag: '',
          Tradecode: '',
          Dpid: '',
          Clnt_Id: '',
        }],
      "requestId": "6015",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results) {
          this.isSpining = false
          let resultset = response.results[0][0]
          if (type == 'mob1') {
            if (response.results[0].length > 0) {
              this.kycContactDetails1.form.controls.existingPan.patchValue(resultset.PAN)
              this.kycContactDetails1.form.controls.existingClient.patchValue(resultset.ClientDetails)
              this.kycContMob1 = true
            }
            else {
              this.kycContactDetails1.form.controls.existingPan.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient.patchValue(null)
              this.kycContactDetails1.form.controls.relation.patchValue(null)
              this.kycContMob1 = false
            }
          }

          if (type == 'Addmob1') {
            if (response.results[0].length > 0) {
              this.kycContactDetails1.form.controls.existingPan1.patchValue(resultset.PAN)
              this.kycContactDetails1.form.controls.existingClient1.patchValue(resultset.ClientDetails)
              this.kycAddContMob1 = true
            }
            else {
              this.kycContactDetails1.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails1.form.controls.relation1.patchValue(null)
              this.kycAddContMob1 = false
            }
          }

          if (type == 'email1') {
            if (response.results[0].length > 0) {
              this.kycContactDetails1.form.controls.existingPan2.patchValue(resultset.PAN)
              this.kycContactDetails1.form.controls.existingClient2.patchValue(resultset.ClientDetails)
              this.kycContEmail1 = true
            }
            else {
              this.kycContactDetails1.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails1.form.controls.relation2.patchValue(null)
              this.kycContEmail1 = false
            }
          }

          if (type == 'addEmail1') {
            if (response.results[0].length > 0) {
              this.kycContactDetails1.form.controls.existingPan3.patchValue(resultset.PAN)
              this.kycContactDetails1.form.controls.existingClient3.patchValue(resultset.ClientDetails)
              this.kycContAddEmail1 = true
            }
            else {
              this.kycContactDetails1.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails1.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails1.form.controls.relation3.patchValue(null)
              this.kycContAddEmail1 = false
            }
          }
        }
        else {
          this.isSpining = false
        }
      }
      else {
        this.notif.error(response.errorMsg, '')
        this.isSpining = false
      }
    })
  }
  fetchData() {
    this.cmServ.disableKraFields.next(false)
    if (this.boDataReceived) {
      return
    }

    this.previewImageData = []
    // this.getimagedata()
    //  this.isSpining = true
    this.isSpining = true;
    this.dataServ.getOrginalResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.PAN || '',
          Type: this.dataServ.fromreport ? 'CRF' : 'BO',
          Request_IDNo: this.requestID ? this.requestID : 0
        }],
      "requestId": "5060",
      "outTblCount": "0"
    }).then((response) => {
      debugger
      this.isSpining = false;
      if (response.errorCode == 0) {

        if (response.results) {
          let dataSet = response.results
          if (dataSet[0].length > 0) {
            this.boDataReceived = true
            this.kycPersnalDetails1.Agency = response.results[0][0].Agency;
            this.kycPersnalDetails1.form.patchValue(response.results[0][0])
            this.defaultResStatus = response.results[0][0].residentialStatus;
            this.cmServ.defaultBOResStatus.next(this.defaultResStatus)
            if (response.results[0][0].nameinpansite && response.results[0][0].nameinpansite != '') {
              this.cmServ.nameinpansite.next(response.results[0][0].nameinpansite)
            }
          }
          let form = this.kycAddress1.form.controls;
          if (dataSet[1].length > 0)
            form.address1.patchValue(response.results[1][0])
          this.cmServ.isTotalProofDatafound.subscribe(val => {
            if (val == true && dataSet[2].length > 0) {
              var add1Pf = response.results[2][0]
              // if(response.results[1][0]["proofOfAddress"])
              this.kycAddress1.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add1Pf)
            }
          })
          if (dataSet[3].length > 0)
            form.address2.patchValue(response.results[3][0])
          this.cmServ.isTotalProofDatafound.subscribe(val => {
            if (val == true && dataSet[4].length > 0) {
              var add2Pf = response.results[4][0]
              // if(response.results[3][0]["proofOfAddress"])
              this.kycAddress1.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add2Pf)
            }
          })
          if (dataSet[5].length > 0)
            form.address3.patchValue(response.results[5][0])
          this.cmServ.isTotalProofDatafound.subscribe(val => {
            if (val == true && dataSet[6].length > 0) {
              var add3Pf = response.results[6][0]
              // if(response.results[5][0]["proofOfAddress"])
              this.kycAddress1.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add3Pf)
            }
          })
          if (dataSet[7].length > 0) {
            var idPf = response.results[7][0];
            let proof = idPf["proofOfAddress"]
            this.cmServ.isTotalProofDatafound.subscribe(val => {
              if (val && proof) {
                delete idPf["proofOfAddress"]
                this.kycAddress1.patchIdentityProofData(proof, idPf)
              }
            })
          }
          if (dataSet[8].length > 0) {
            let data = response.results[8][0]
            form.address4.patchValue(data)
            form.taxOutsideIndia.patchValue(data.JurisdictionFlag)
          }
          this.cmServ.isTotalProofDatafound.subscribe(val => {
            if (val == true && dataSet[9].length > 0) {
              var add4Pf = response.results[9][0]
              if (response.results[8].length > 0)
                this.kycAddress1.patchADDProof4Data(response.results[8][0]["proofOfAddress"], add4Pf, response.results[8][0]["JurisdictionFlag"])
            }
          })
          if (dataSet[10].length > 0) {
            response.results[10][0].smsFacility = response.results[10][0].smsFacility == 'true' ? true : false;

            this.kycContactDetails1.form.patchValue(response.results[10][0]);
          }
          if (dataSet[11].length > 0) {
            this.kycContactDetails1.IPVComponent.form.patchValue(response.results[11][0]);
          }
          if (dataSet[12].length > 0) {
            if (this.dataServ.fromreport) {
              this.kycContactDetails1.financials.form.patchValue(response.results[12][0])
              if (response.results[12][0].derivativeProof && response.results[12][0].derivativeProof.length > 0) {
                this.crfServe.derivativeStatus.next(true)
              }
              else {
                this.crfServe.derivativeStatus.next(false)
              }

            }
          }
          if (dataSet[13].length > 0) {

            this.kycProofUpload1.SupportFiles = response.results[13];
          }
          if (dataSet[14].length > 0) {
            this.kycAddress1.financialDocument = response.results[14]
          }
          if (this.NRI) {
            if (!this.dataServ.fromreport) {
              this.kycAddress1.form.controls.taxOutsideIndia.patchValue(true)
            }
          }
        }
      }
      else {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '')
      }
    })
  }
  // fillClientBasicdata(data) {
  //  var dtarray=this.DOB.split('.')
  //   var dt=dtarray[0]
  //   var mm=dtarray[1]
  //   var yr=dtarray[2]
  //       var date=yr+'-'+mm+'-'+dt
  //       this.kycPersnalDetails1.form.controls.pan.patchValue(this.PAN)
  //       // this.kycPersnalDetails1.form.controls.dob.patchValue(data)
  //       this.kycPersnalDetails1.form.controls.dob.patchValue(date)
  //       
  //       if (this.applicationStatus=='P'||this.applicationStatus=='T'||this.applicationStatus=='A'||this.applicationStatus=='R') 
  //       {
  //           this.fetchData()
  //       }
  // }
  ngOnInit() {
    // this.subscriptions.push(
    // this.cmServ.isEntryAccess.subscribe((val) => {
    //   this.EntryAccess = val
    // })
    // this.cmServ.finalize.subscribe(val=>{
    //   this.isEntryfinalised=val
    // })

    // this.cmServ.isServiceBlocked.subscribe((val) => {
    //   this.isServiceBocked = val
    // })

    // // this.ngZone.run(() => {
    //   this.cmServ.clientType.subscribe((val) => {
    //     this.clientType = val;
    //     console.log(this.clientType)
    //   })
    //   // )
    //   // this.subscriptions.push(
    //   this.cmServ.holderLength.subscribe(val => {

    //     this.indTabs = Array(val);
    //     this.numberOfHolders = val

    //   })
    //   // )
    //   // this.subscriptions.push(
    //   this.cmServ.clientSerialNumber.subscribe(val => {
    //     this.clientSerialNumber = val
    //   })
    //   this.cmServ.clientIdDetails.subscribe(val => {
    //     this.clientIdDetails = val
    //   })
    //   // )
    //   // this.subscriptions.push(
    //   this.cmServ.hoder1PanDetails.subscribe(val => {
    //     this.Holder1PanDetails = val
    //   })
    //   // )
    //   // this.subscriptions.push(
    //   this.cmServ.hoder2PanDetails.subscribe(val => {
    //     this.Holder2PanDetails = val

    //   })


    //   // )
    // this.subscriptions.push(
    // this.cmServ.hoder3PanDetails.subscribe(val => {
    //   this.Holder3PanDetails = val
    // })
    // )
    // this.subscriptions.push(
    // this.cmServ.chooseAOF.subscribe(val => {
    //   if (val == true) {
    //     this.fillClientBasicdata()
    //   }  
    // })
    // })
    this.isFfromReport = this.dataServ.fromreport
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {
      this.HO = true
    }
    this.getData()
  }
  getData() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.requestID,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      this.reasonList = response.results[7];

      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      let Rejremarks: any = this.RejRemarks
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }
    })
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

  popOut() {
    if (this.checkBoxArray.length != 0 || this.AllcheckboxArray.length != 0) {
      this.isVisible = false
      // this.checkBoxSelected = true
      // this.Cbox_Disabled = true
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
  getimagedata() {
    // let pan = ''
    // if (this.activeTabIndex == 0) {
    //   pan = this.PAN
    // }
    // if (this.activeTabIndex == 1) {
    //   pan = this.HolderDetails["SecondHolderpanNumber"]
    // }
    // if (this.activeTabIndex == 2) {
    //   pan = this.HolderDetails["ThirdHolderpanNumber"]
    // }

    // this.showPortal = true;
    // this.previewImageData = {
    //   ImageFrom: 'KYC-ACCOP',
    //   PAN: pan
    // }

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       ClientSerialNo: this.clientSerialNumber,
    //       PAN: pan,
    //       Euser: this.currentUser.userCode,
    //       ImageFrom: 'KYC-ACCOP'
    //     }],
    //   "requestId": "6002",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.errorCode==0) {
    //     if (response.results) {
    //       if (response.results[0].length > 0) {
    //         this.showPortal = true;
    //         this.previewImageData = response.results[0]
    //       }
    //     }
    //   }
    //   else {
    //     this.notif.error(response.errorMsg, '')
    //   }
    // })
  }
  updateTabs() {
    // if (!isNaN(this.kycCount) && this.kycCount > 0)
    //   this.tabs = Array(this.kycCount);
  }
  SaveKYC(action) {
    //   if (this.kycPersnalDetails1.form.controls.statusChanger.value) {
    if (action == 'savefinalise') {
      this.modal.confirm({
        nzTitle: '<i>Info</i>',
        nzContent: '<b>If SPICE CRF form not used then separate Annual KYC form is Mandatory </b>',
        nzOnOk: () => {
          this.save(action)
        },
        nzOnCancel: () => {
        }
      })
    }
    else {
      this.save(action)
    }
  }


  save(action) {
    debugger
    let isValid = this.validServ.validateForm(this.kycPersnalDetails1.form, this.FormControlNames, this.customValidationMsgObj.PersonalDetails);
    if (!isValid) {
      // this.el.nativeElement.scrollIntoView();

      return
    }
    let PAN = this.kycPersnalDetails1.form.value.pan;
    let data = []
    let obj = {
      Agency: this.kycPersnalDetails1.Agency
    }
    let tdata = { ...this.kycPersnalDetails1.form.value, ...obj }
    let personaldetailsOBj = tdata
    data.push(tdata)
    var JSONData1 = this.utilServ.setJSONArray(data);
    this.KYCPersonalDetailsXmlData = jsonxml(JSONData1);
    this.KYCPersonalDetailsXmlData = this.KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin

    let isAddressValid = this.kycAddress1.isAddressValid(action);
    if (!isAddressValid) {
      // this.addel.nativeElement.scrollIntoView();
      return
    } debugger
    let currentPermantAddressXmlData = this.kycAddress1.currentPermantAddressXmlData
    currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
    let AdditionalcorresLocalAddressXmlData = this.kycAddress1.AdditionalcorresLocalAddressXmlData
    AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
    let corresLocalAddressXmlData = this.kycAddress1.corresLocalAddressXmlData
    corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
    if (this.NRI && this.kycAddress1.isJudisdiction == true) {
      var jurisdictionsAddressXmlData = this.kycAddress1.jurisdictionsAddressXmlData
      jurisdictionsAddressXmlData = jurisdictionsAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

    }
    let identityPoof = this.kycAddress1.isIdentityProofValid();
    if (!identityPoof) {
      // this.addel.nativeElement.scrollIntoView();
      return
    }
    let identyProofXmlData = this.kycAddress1.identyProofXmlData
    identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin

    let smsFacility = this.kycContactDetails1.canAllowSmsFacility()
    if (!smsFacility) {

      return;
    }

    var navyStatus: boolean = false;
    var resStatus = this.kycPersnalDetails1.form.value.residentialStatus.toUpperCase()
    if (resStatus && resStatus.length > 0 && action != 'savefinalise') {
      if (resStatus == 'NRE' || resStatus == 'NRO' || resStatus == 'NRO CASH MARKET' || resStatus == 'NRI') {
        if (this.kycAddress1.add1.controls.country.value.toUpperCase() == 'INDIA' &&
          this.kycAddress1.add2.controls.country.value.toUpperCase() == 'INDIA') {
          if (!this.kycPersnalDetails1.form.value.merchantnavy) {
            this.modal.warning({
              nzTitle: '<i>Warning</i>',
              nzContent: '<b> Foreign address is mandatory for NRI Clients!.<br> Please mark if the client is Merchant NAVY ?</b>',
              nzOnOk: () => {
                this.cmServ.merchantnavyStatus.next(true)
                return
              },
            })
          }
          else {
            navyStatus = true;
          }
        }
        else {
          navyStatus = true;
        }
      }
      else {
        navyStatus = true;
      }
    }
    else {
      navyStatus = true;
    }

    if (navyStatus) {
      var email = this.kycContactDetails1.form.value.email
      var mobile = this.kycContactDetails1.form.value.mobile

      if (email == undefined || email == null || email == '') {
        this.notif.error("Please enter Email. Email ID is madatory", '', { nzDuration: 60000 })
        return
      }

      if (mobile == undefined || mobile == null || mobile == '') {
        this.notif.error("Please enter Mobile. Mobile No is required", '', { nzDuration: 60000 })
        return
      }

      if (this.kycContactDetails1.form.value.nomobileFlag) {
        if (this.kycContactDetails1.form.value.mobile && this.kycContactDetails1.form.value.mobile.length > 0) {
          this.notif.error("Please Uncheck NO Mobile flag.", '', { nzDuration: 60000 })
          return
        }
      }

      if (this.kycContactDetails1.form.value.noemailFlag) {
        if (this.kycContactDetails1.form.value.email && this.kycContactDetails1.form.value.email.length > 0) {
          this.notif.error("Please Uncheck NO Email flag.", '', { nzDuration: 60000 })
          return
        }
      }

      if (this.kycContMob1) {
        if (this.kycContactDetails1.form.value.relation == null) {
          this.notif.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycContMob1) {
        if (this.kycContactDetails1.form.value.existingPan != this.PAN) {
          if (this.kycContactDetails1.form.value.relation == 'Self') {
            this.notif.error("Pan number mismatch, self cannot be selected as relation for mobile", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycContMob1) {
        if (this.kycContactDetails1.form.value.existingPan == this.PAN) {
          if (this.kycContactDetails1.form.value.relation != 'Self') {
            this.notif.error("Same PAN found, Relation must be Self for mobile", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycAddContMob1) {
        if (this.kycContactDetails1.form.value.relation1 == null) {
          this.notif.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycAddContMob1) {
        if (this.kycContactDetails1.form.value.existingPan1 != this.PAN) {
          if (this.kycContactDetails1.form.value.relation1 == 'Self') {
            this.notif.error("Pan number mismatch, self cannot be selected as relation for additional mobile", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycAddContMob1) {
        if (this.kycContactDetails1.form.value.existingPan1 == this.PAN) {
          if (this.kycContactDetails1.form.value.relation1 != 'Self') {
            this.notif.error("Same PAN found, Relation must be Self for additional mobile", '', { nzDuration: 60000 })
            return
          }
        }
      }

      if (this.kycContEmail1) {
        if (this.kycContactDetails1.form.value.relation2 == null) {

          this.notif.error("Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycContEmail1) {
        if (this.kycContactDetails1.form.value.existingPan2 != this.PAN) {
          if (this.kycContactDetails1.form.value.relation2 == 'Self') {
            this.notif.error("Pan number mismatch, self cannot be selected as relation for email", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycContEmail1) {
        if (this.kycContactDetails1.form.value.existingPan2 == this.PAN) {
          if (this.kycContactDetails1.form.value.relation2 != 'Self') {
            this.notif.error("Same PAN found, Relation must be Self for email", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycContAddEmail1) {
        if (this.kycContactDetails1.form.value.relation3 == null) {

          this.notif.error("Additional Email  already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycContAddEmail1) {
        if (this.kycContactDetails1.form.value.existingPan3 != this.PAN) {
          if (this.kycContactDetails1.form.value.relation3 == 'Self') {
            this.notif.error("Pan number mismatch, self cannot be selected as relation for additional email", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (this.kycContAddEmail1) {
        if (this.kycContactDetails1.form.value.existingPan3 == this.PAN) {
          if (this.kycContactDetails1.form.value.relation3 != 'Self') {
            this.notif.error("Same PAN found, Relation must be Self for additional email", '', { nzDuration: 60000 })
            return
          }
        }
      }
      let isIpvValid = this.kycContactDetails1.isAddressAndIpvDeclarationValid(action)
      if (!isIpvValid) {
        // this.contactel.nativeElement.scrollIntoView();
        return
      }
      let addressAndIpvXmlData = this.kycContactDetails1.addressAndIpvData
      addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
      if (action == 'save') {
        let financialvalid = this.kycContactDetails1.financials.ValidateFianancialForm()
        if (!financialvalid) {
          return
        }
      }


      let financialdata = []
      financialdata.push(this.kycContactDetails1.financials.form.value)
      let financialjson = this.utilServ.setJSONArray(financialdata)
      let financialxml = jsonxml(financialjson)
      let uploadProofData
      let imageXmlData
      let proofOfuploadOBJ = []
      if (action == 'savefinalise') {
        debugger
        if (this.kycAddress1.add1.value.proofOfAddress == this.kycAddress1.form.controls.idProof.value ||
          this.kycAddress1.add2.value.proofOfAddress == this.kycAddress1.form.controls.idProof.value) {
          this.cmServ.proofIdentity.next(true)
        }
        else {
          this.cmServ.proofIdentity.next(false)
        }

        if (this.kycAddress1.add2.value.proofOfAddress == this.kycAddress1.add1.value.proofOfAddress) {
          this.cmServ.proofCorres.next(true)
        }
        else {
          this.cmServ.proofCorres.next(false)
        }

        var der = this.kycContactDetails1.financials.form.value.derivativeProof
        if (der && der.length > 0) {
          this.cmServ.isderivativeSegment.next(true)
        }
        else {
          this.cmServ.isderivativeSegment.next(false)
        }

        if (this.kycAddress1.add1.value.proofOfAddress == '01' ||
          this.kycAddress1.form.controls.idProof.value == '01' ||
          this.kycAddress1.add2.value.proofOfAddress == '01') {
          this.cmServ.proofPassport.next(true)
        }
        else {
          this.cmServ.proofPassport.next(false)
        }

        uploadProofData = this.kycProofUpload1.checkUploads()
        if (uploadProofData['status'] != true) {
          return
        }
        let proofOfupload = []
        proofOfupload.push(uploadProofData['data'])
        // proofOfuploadOBJ=[]
        uploadProofData['obj'].forEach(item => {
          proofOfuploadOBJ.push({ "ProofDoc": item })
        })
        let jsond = this.utilServ.setJSONArray(proofOfupload);
        imageXmlData = jsonxml(jsond);
      }


      var ReactivationFulldata = []
      // ReactivationFulldata.push({"PersonalDetails":this.KYCPersonalDetailsXmlData})
      // ReactivationFulldata.push({"PerAdd": currentPermantAddressXmlData}) 
      // ReactivationFulldata.push({"CorresAdd": corresLocalAddressXmlData})
      // ReactivationFulldata.push({"AdditionalCorresAdd": AdditionalcorresLocalAddressXmlData})
      // ReactivationFulldata.push({"IdentityProof": identyProofXmlData})
      // ReactivationFulldata.push({"TaxDetails": jurisdictionsAddressXmlData ? jurisdictionsAddressXmlData : ''})
      // ReactivationFulldata.push({"ContactDetails": addressAndIpvXmlData})
      // ReactivationFulldata.push({"FinancialDetails":financialxml})
      // ReactivationFulldata.push({"ApplicableAccounts": this.accountsToBeChanged})
      // ReactivationFulldata.push({"ProofUpload": imageXmlData || ''})
      // ReactivationFulldata.push({"VerificationStatus": this.verificationStstus})

      ReactivationFulldata.push({ "PersonalDetails": personaldetailsOBj })
      ReactivationFulldata.push({ "CurrentAddress": this.kycAddress1.currentPermantAddressOBJ })
      ReactivationFulldata.push({ "CurrespondaceAddress": this.kycAddress1.corresLocalAddressOBJ })
      // ReactivationFulldata.push({ "AdditionalCorresAdd": this.kycAddress1.corresLocalAddressOBJ })
      ReactivationFulldata.push({ "IdentityProof": this.kycAddress1.identyProofOBJ })
      ReactivationFulldata.push({ "TaxDetails": this.kycAddress1.jurisdictionsAddressOBJ ? this.kycAddress1.jurisdictionsAddressOBJ : '' })
      ReactivationFulldata.push({ "ChangeInContact ": this.kycContactDetails1.addressAndIpvDataOBJ })
      ReactivationFulldata.push({ "Financialdata": this.kycContactDetails1.financials.form.value })
      ReactivationFulldata.push({ "ApplicableAccounts": this.accountsToBeChanged })
      ReactivationFulldata.push({ "ProofUpload": proofOfuploadOBJ || '' })
      ReactivationFulldata.push({ "VerificationStatus": this.verificationStstus })
      // let reactivationJson= this.utilServ.setJSONMultipleArray(ReactivationFulldata)
      let reactivationJson = []
      reactivationJson.push({ "Document": [] })
      reactivationJson[0]["Document"].push({ "Data": ReactivationFulldata })
      let reactivationxml = jsonxml(reactivationJson)
      let reactivationxmldata = reactivationxml.replace(/&/gi, '&amp;')
      if (action == 'savefinalise') {
        var documents = [];

        let appFormReceived: boolean = false
        if (proofOfuploadOBJ && proofOfuploadOBJ.length > 0) {
          this.proofCount = 0;
          proofOfuploadOBJ.forEach(item => {
            if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
              this.proofCount = this.proofCount + 1
            }
          })
          if (this.proofCount > 1) {
            appFormReceived = true
          }
          if (!appFormReceived) {
            this.notif.error('Application form1 & Application form2 are mandatory', '')
            return
          }
          else {
            var imageFulldata: any = []
            imageFulldata.push(proofOfuploadOBJ)
            imageFulldata.push({ "ipvData": this.kycContactDetails1.addressAndIpvDataOBJ ? this.kycContactDetails1.addressAndIpvDataOBJ : '' });
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

      if (action == 'approve') {
        if ((this.AppRemarks == '' || this.AppRemarks == undefined) && this.applicationStatus != 'P') {
          this.notif.error('Approvel Remarks should be filled', '')
          return
        }
      }

      this.notif.remove()
      var save = {
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: this.PAN,
            EntryType: this.tab,
            ActionType: 'P',
            FileData: reactivationxmldata,
            ActionUser: this.currentUser.userCode,
            Rejection: '',
            IDNO: '',
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
            Pan: this.PAN,
            EntryType: this.tab,
            ActionType: 'I',
            FileData: documentxml,
            ActionUser: this.currentUser.userCode,
            IDNO: this.requestID,
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

      var approve = {
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: this.PAN,
            EntryType: this.tab,
            ActionType: 'F',
            FileData: reactivationxmldata,
            ActionUser: this.currentUser.userCode,
            IDNO: this.requestID,
            Rejection: this.AppRemarks ? this.AppRemarks : '',
            RiskCountry: '',
            CommunicationAddress: '',
            SMSFlag: '',
            RequestFrom: '',
            RejectReason: ''

          }],
        "requestId": "6010",
        "outTblCount": "0"
      }
      this.isSpining = true
      let countryCode: any = this.kycContactDetails1.form.value.isdCodeMobile;
      this.kycContactDetails1.verifyEmailOrMobile(countryCode).then((response: any) => {
        if ((response)) {
          this.dataServ.getResultArray(action == 'save' ? save : action == 'approve' ? approve : savefinalysed
            // {
            // "batchStatus": "false",
            // "detailArray":
            //   [{
            //     Pan: PAN,
            //     Euser: this.currentUser.userCode,
            //     KycXML_PersonalDetails: this.KYCPersonalDetailsXmlData,
            //     KycXML_PerAdd: currentPermantAddressXmlData,
            //     KycXML_CorresAdd: corresLocalAddressXmlData,
            //     KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
            //     KycXML_IdentityProof: identyProofXmlData,
            //     KycXML_TaxDetails: jurisdictionsAddressXmlData ? jurisdictionsAddressXmlData : '',
            //     KycXML_ContactDetails: addressAndIpvXmlData,
            //     KycXML_FinancialDetails:financialxml,
            //     KYCXML_ImageDetails: imageXmlData || '',
            //   }],
            // "requestId": "5074",
            // "outTblCount": "0"
            // }
          ).then((response) => {
            this.isSpining = false
            if (response.errorCode == 0) {
              let details = response.results[0][0]
              if (details.errorCode == 0) {
                this.previewImageData = []
                this.subscriptions.forEach(ele => {
                  ele.unsubscribe()
                })
                this.notif.success(details.errorMessage, '', { nzDuration: 60000 });
                if (action == 'savefinalise') {
                  this.BackButtonClick();
                  return
                }
                else if (action == 'approve') {
                  this.BackButtonClick();
                  return
                }
                else {
                  this.applicationStatus = 'T';
                  this.crfServe.applicationStatus.next('T');
                  this.modal.info({
                    nzTitle: '<i>Info</i>',
                    nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                  })
                }
                this.crfServe.requestID.next(Number(response.results[0][0].requestID))
                // this.SerialNumber=Number(response.results[0][0].requestID)
                this.printButtonFlag = true
              }
              else {
                this.notif.error(details.errorMessage, '', { nzDuration: 60000 })
              }
              this.isSpining = false
            }
            else {
              this.isSpining = false
              this.notif.error(response.errorMsg, '')
            }
          })
        } else {
          this.isSpining = false;
        }
      })
    }

  }

  back() {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {
        this.BackButtonClick()
      }
    })
  }

  Approve() {
    if (this.AppRemarks == '' || this.AppRemarks == undefined) {
      this.notif.error('Approvel Remarks should be filled', '')
      return
    }
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to apporve ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PAN,
              EntryType: this.tab,
              ActionType: 'A',
              FileData: '',
              IDNO: this.requestID,
              ActionUser: this.currentUser.userCode,
              Rejection: this.AppRemarks ? this.AppRemarks : '',
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: ''
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {

                this.notif.success(response.results[0][0].errorMessage, '');
                this.crf.edittabtitle = "";
                this.crf.activeTabIndex = this.crf.activeTabIndex - 1;
                this.crf.onviewReset();

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
  Reject() {
    if (this.RejRemarks == '' || this.RejRemarks == undefined) {
      // this.notif.error('Rejection Remarks is required', '')
      // return
    }
    // if (this.checkedArray.length != 0 || this.convertedData.length !== 0) {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to reject ?</b>',
      nzOnOk: () => {
        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PAN,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.requestID,
              ActionUser: this.currentUser.userCode,
              Rejection: this.RejRemarks,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpining = false
          if (response.errorCode == 0) {

            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.notif.success(response.results[0][0].errorMessage, '');
                this.crf.edittabtitle = "";
                this.crf.activeTabIndex = this.crf.activeTabIndex - 1;
                this.crf.onviewReset();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == 1) {

                this.notif.error(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {

                this.notif.success(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
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
    // }
    // else {
    //   this.notif.error('Rejection reason is required, Please select any', '')
    // }
  }

  BranchReject() {
    if (this.RejRemarks == '' || this.RejRemarks == undefined) {
      this.notif.error('Rejection Remarks should be filled', '')
      return
    }
    if (this.RejRemarks) {
      let reason: any = this.RejRemarks;
      this.modal.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure you want to reject ?</b>',
        nzOnOk: () => {
          this.isSpining = true;
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: this.PAN,
                EntryType: this.tab,
                ActionType: 'R',
                FileData: '',
                IDNO: this.requestID,
                ActionUser: this.currentUser.userCode,
                Rejection: "Branch rejected-" + reason,
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
                  this.crf.edittabtitle = "";
                  this.crf.activeTabIndex = this.crf.activeTabIndex - 1;
                  this.crf.onviewReset();
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
  }

  PrintForm(req) {
    this.isSpining = true
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [{
        "Euser": '',
        "Pan": this.PAN,
        "BarCode": this.requestID,
        "IncludeRelatedPerson": 'N'
      }],
      "requestId": "7063",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error("No Data Found", '');
        return;
      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.isSpining = false
      this.notif.error("Server encountered an Error", '');
    });
  }
  BackButtonClick() {
    this.crf.edittabtitle = "";
    this.crf.activeTabIndex = this.crf.activeTabIndex - 1;
  }

  initialApprove() {

  }
  editButton() {
    this.modal.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.notif.success("Editing enabled..!", '');
      }

    });
  }

}
