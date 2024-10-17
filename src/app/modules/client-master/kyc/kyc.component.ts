import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, OnDestroy, QueryList, ViewChildren, AfterViewChecked, HostListener } from '@angular/core';
import { ValidationService, UtilService, DataService, AuthService, User, WorkspaceService } from 'shared'
import { ClientMasterService } from '../client-master.service';
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

@AutoUnsubscribe({
  includeArrays: true,
  arrayName: 'subscriptions'
})

@Component({
  selector: 'client-master-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.less']
})
export class KYCComponent implements OnInit, AfterViewInit, AfterViewChecked {
  confirmModal: NzModalRef; // For testing by now
  subscriptions: Subscription[] = [];
  @ViewChild('tabsContentRef') el: ElementRef;
  @ViewChild('addressSecRef') addel: ElementRef;
  @ViewChild('tabsContacttRef') contactel: ElementRef;
  @ViewChild('kycRef') kycel: ElementRef;
  @ViewChild('kycPersnalDetails1') kycPersnalDetails1;
  @ViewChild('kycPersnalDetails2') kycPersnalDetails2;
  @ViewChild('kycPersnalDetails3') kycPersnalDetails3;
  @ViewChild('kycAddress1') kycAddress1;
  @ViewChild('kycAddress2') kycAddress2;
  @ViewChild('kycAddress3') kycAddress3;
  @ViewChild('kycContactDetails1') kycContactDetails1;
  @ViewChild('kycContactDetails2') kycContactDetails2;
  @ViewChild('kycContactDetails3') kycContactDetails3;
  @ViewChild('kycProofUpload1') kycProofUpload1;
  @ViewChild('kycProofUpload2') kycProofUpload2;
  @ViewChild('kycProofUpload3') kycProofUpload3;
  @ViewChildren('kycpersonal') kycpersonal: QueryList<KYCComponent>;
  @ViewChildren('kycAddress') kycAddress: QueryList<KYCComponent>;
  @ViewChildren('kycContactDetails') kycContactDetails: QueryList<KYCComponent>;
  @ViewChildren('kycProofUpload') kycProofUpload: QueryList<KYCComponent>;
  @ViewChildren('kycCompBasic') kycCompBasic: QueryList<KYCComponent>;
  @ViewChildren('kycCompContactDetails') kycCompContactDetails: QueryList<KYCComponent>;
  @ViewChildren('kycCompAdd') kycCompAdd: QueryList<KYCComponent>;

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
  SecondHolderFetchingDone: boolean = false;
  ThirdHolderFetchingDone: boolean = false;
  isEntryfinalised: boolean;
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


  ) {
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
        this.branch = this.dataServ.branch
      }))
    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })
    this.cmServ.autoSaveTiming.subscribe(val => {
      this.autosaveTiming = val
    })
    this.cmServ.isServiceCallsAllow.subscribe(val => {
      this.isServiceCallsAllow = val
    })
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      if (this.wsKey == 'Client Profile Edit') {
        this.clientProfileEdit = true
      }
      else {
        this.clientProfileEdit = false
      }
    })

    this.subscriptions.push(interval(this.autosaveTiming).subscribe(x => {
      if (this.EntryAccess == false || this.currTabIndex != 1 || this.clientProfileEdit) {
        return
      }
      else {
        // this.modal.closeAll()
        // this.showConfirm()
        this.saveToTemprary()
      }
    }))
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'KYC',
    //     }],
    //   "requestId": "5034",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results) {
    //    this.customValidationMsgObj=response.results[0]
    //   }
    // })

  }
  ngAfterViewInit() {

    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
      this.fillAofData()
      // if(this.clientProfileEdit){
      //    
      //   setTimeout(() => {
      //     this.fetchProfileEditData(0)
      //   }, 300);
      // }else{
      // this.fetchData(0)
      // }
      this.cmServ.activeTab.subscribe(val => {
        if (val == 1) {
          this.fetchData(0)
        }
      })
      if (this.dataServ.branch == "HO" || this.dataServ.branch == "HOGT") {

      }
    })

    this.ngZone.run(() => {
      if (this.clientType == "individual") {
        // this.HolderDetails["SecondHolderpanNumber"]
        // this.HolderDetails["ThirdHolderpanNumber"]
        this.cmServ.isTotalProofDatafound.subscribe(val => {
          if (val == true) {
            this.kycAddress1.add1.controls.proofOfAddress.valueChanges.subscribe(val => {
              if (val == '34') {
                this.kycAddress1.Address1formFeilds[0].proof0 = this.HolderDetails["FirstHolderpanNumber"]
              }
            })
            this.kycAddress1.add2.controls.proofOfAddress.valueChanges.subscribe(val => {
              if (val == '34') {
                this.kycAddress1.Address2formFeilds[0].proof0 = this.HolderDetails["FirstHolderpanNumber"]
              }
            })
            this.kycAddress1.add3.controls.proofOfAddress.valueChanges.subscribe(val => {
              if (val == '34') {
                this.kycAddress1.Address3formFeilds[0].proof0 = this.HolderDetails["FirstHolderpanNumber"]
              }
            })
            this.kycAddress1.add4.controls.proofOfAddress.valueChanges.subscribe(val => {
              if (val == '34') {
                this.kycAddress1.Address4formFeilds[0].proof0 = this.HolderDetails["FirstHolderpanNumber"]
              }
            })
            this.kycAddress1.form.controls.idProof.valueChanges.subscribe(val => {

              if (val == '34') {
                this.kycAddress1.identityProofformFeilds[0].proof0 = this.HolderDetails["FirstHolderpanNumber"]
              }
            })
          }
        })
        this.kycPersnalDetails1.form.controls.ProceedType.valueChanges.subscribe(val => {
          if (this.EntryAccess == false && this.isServiceBocked) {
            return
          }
          this.kycPersnalDetails1.fillKraDetials(val);
          if (val == 'KRA') {
            // this.cmServ.chooseAOF.next(false)
            this.dataServ.getKRAdetails.subscribe(res => {
              if ((Object.keys(res)).length == 0) {
                return
              }
              else {
                let error = res['Error']
                if (error[0].ErrorCode == 0) {
                  let response = res['Response']
                  this.kycAddress1.add2.controls.city.setValue(response[0].APP_COR_CITY)
                  this.kycAddress1.add2.controls.pinCode.setValue(response[0].APP_COR_PINCD)
                  this.kycAddress1.add2.controls.houseName.setValue(response[0].APP_COR_ADD1)
                  // this.kycAddress1.add2.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                  this.kycAddress1.add2.controls.state.setValue(response[0].APP_COR_STATE)
                  this.kycAddress1.add2.controls.country.setValue(response[0].APP_COR_CTRY)

                  this.kycAddress1.add2.controls.street.setValue(response[0].APP_COR_ADD3)
                  this.kycAddress1.add1.controls.city.setValue(response[0].APP_PER_CITY)
                  this.kycAddress1.add1.controls.pinCode.setValue(response[0].APP_PER_PINCD)

                  this.kycAddress1.add1.controls.houseName.setValue(response[0].APP_PER_ADD1)
                  // this.kycAddress1.add1.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                  this.kycAddress1.add1.controls.street.setValue(response[0].APP_PER_ADD3)
                  this.kycAddress1.add1.controls.state.setValue(response[0].APP_PER_STATE)
                  this.kycAddress1.add1.controls.country.setValue(response[0].APP_PER_CTRY)
                  let valuesArray = JSON.stringify(this.cmServ.getControls(this.kycAddress1.totalProofDetial, this.kycAddress1.code))
                  this.kycAddress1.Address1formFeilds = JSON.parse(valuesArray)
                  this.kycAddress1.Address2formFeilds = JSON.parse(valuesArray)
                  this.kycAddress1.add1.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                  this.kycAddress1.add2.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                  // this.kycAddress1.add3.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                  // this.kycAddress1.add4.controls.proofOfAddress.patchValue(this.kycAddress1.code)
                  this.kycContactDetails1.form.controls.mobile.setValue(response[0].APP_MOB_NO)
                  this.kycContactDetails1.form.controls.email.setValue(response[0].APP_EMAIL)
                  setTimeout(() => {
                    this.kycAddress1.kraGetDistrictbyPincode(response[0].APP_COR_PINCD, 'Address2')
                    this.kycAddress1.kraGetDistrictbyPincode(response[0].APP_PER_PINCD, 'Address1')
                  }, 50)
                  // let obj = {
                  //   firstHolderFirstname: response[0].APP_NAME,
                  //   firstHolderLastname: response[0].APP_F_NAME
                  // }
                  if (this.activeTabIndex == 0)
                    this.cmServ.kraAccountOpeiningFirstHolderData.next(response[0].APP_NAME)
                }
              }
            })
          }
          else {
            this.kycAddress1.kraGetDistrictbyPincode(123, 'Address2')
            this.kycAddress1.kraGetDistrictbyPincode(123, 'Address1')
            // this.kycContactDetails1.form.controls.mobile.setValue(null)
            // this.kycContactDetails1.form.controls.email.setValue(null)
            if (this.activeTabIndex == 0)
              this.cmServ.kraAccountOpeiningFirstHolderData.next(null)

            //  this.kycAddress1.add1.reset()
            //  this.kycAddress1.add2.reset()
            //   let valuesArray=JSON.stringify(this.cmServ.getControls(this.kycAddress1.totalProofDetial,this.kycAddress1.code))
            //  this.kycAddress1.Address1formFeilds = JSON.parse(valuesArray)
            //  this.kycAddress1.Address2formFeilds = JSON.parse(valuesArray)
          }

        })
        if (this.numberOfHolders > 1) {
          this.kycAddress2.add1.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress2.Address1formFeilds[0].proof0 = this.HolderDetails["SecondHolderpanNumber"]
            }
          })
          this.kycAddress2.add2.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress2.Address2formFeilds[0].proof0 = this.HolderDetails["SecondHolderpanNumber"]
            }
          })
          this.kycAddress2.add3.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress2.Address3formFeilds[0].proof0 = this.HolderDetails["SecondHolderpanNumber"]
            }
          })
          this.kycAddress2.add4.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress2.Address4formFeilds[0].proof0 = this.HolderDetails["SecondHolderpanNumber"]
            }
          })
          this.kycAddress2.form.controls.idProof.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress2.identityProofformFeilds[0].proof0 = this.HolderDetails["SecondHolderpanNumber"]
            }
          })
          this.kycPersnalDetails2.form.controls.ProceedType.valueChanges.subscribe(val => {
            if (this.EntryAccess == false && this.isServiceBocked) {
              return
            }
            this.kycPersnalDetails2.fillKraDetials(val);
            if (val == 'KRA') {
              this.cmServ.chooseAOF.next(false)
              this.dataServ.getKRAdetails.subscribe(res => {
                if ((Object.keys(res)).length == 0) {
                  return
                }
                else {
                  let error = res['Error']
                  if (error[0].ErrorCode == 0) {
                    let response = res['Response']
                    this.kycAddress2.add2.controls.city.setValue(response[0].APP_COR_CITY)
                    this.kycAddress2.add2.controls.pinCode.setValue(response[0].APP_COR_PINCD)
                    this.kycAddress2.add2.controls.houseName.setValue(response[0].APP_COR_ADD1)
                    // this.kycAddress2.add2.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                    this.kycAddress2.add2.controls.street.setValue(response[0].APP_COR_ADD3)
                    this.kycAddress2.add1.controls.city.setValue(response[0].APP_PER_CITY)
                    this.kycAddress2.add1.controls.pinCode.setValue(response[0].APP_PER_PINCD)
                    this.kycAddress2.add1.controls.houseName.setValue(response[0].APP_PER_ADD1)
                    // this.kycAddress2.add1.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                    this.kycAddress2.add2.controls.state.setValue(response[0].APP_COR_STATE)
                    this.kycAddress2.add2.controls.country.setValue(response[0].APP_COR_CTRY)
                    this.kycAddress2.add1.controls.state.setValue(response[0].APP_PER_STATE)
                    this.kycAddress2.add1.controls.country.setValue(response[0].APP_PER_CTRY)
                    this.kycAddress2.add1.controls.street.setValue(response[0].APP_PER_ADD3)
                    let valuesArray = JSON.stringify(this.cmServ.getControls(this.kycAddress2.totalProofDetial, this.kycAddress2.code))
                    this.kycAddress2.Address1formFeilds = JSON.parse(valuesArray)
                    this.kycAddress2.Address2formFeilds = JSON.parse(valuesArray)
                    this.kycAddress2.add1.controls.proofOfAddress.patchValue(this.kycAddress2.code)
                    this.kycAddress2.add2.controls.proofOfAddress.patchValue(this.kycAddress2.code)
                    // this.kycAddress2.add3.controls.proofOfAddress.patchValue(this.kycAddress2.code)
                    // this.kycAddress2.add4.controls.proofOfAddress.patchValue(this.kycAddress2.code)
                    this.kycContactDetails2.form.controls.mobile.setValue(response[0].APP_MOB_NO)
                    this.kycContactDetails2.form.controls.email.setValue(response[0].APP_EMAIL)
                    setTimeout(() => {
                      this.kycAddress2.kraGetDistrictbyPincode(response[0].APP_COR_PINCD, 'Address2')
                      this.kycAddress2.kraGetDistrictbyPincode(response[0].APP_PER_PINCD, 'Address1')
                    }, 100);
                    if (this.activeTabIndex == 1)
                      this.cmServ.kraAccountOpeiningSecondHolderData.next(response[0].APP_NAME)
                  }
                }
              })
            }
            else {
              // this.kycContactDetails2.form.controls.mobile.setValue(null)
              // this.kycContactDetails2.form.controls.email.setValue(null)
              this.kycAddress2.kraGetDistrictbyPincode(123, 'Address2')
              this.kycAddress2.kraGetDistrictbyPincode(123, 'Address1')
              if (this.activeTabIndex == 1)
                this.cmServ.kraAccountOpeiningSecondHolderData.next(null)
            }

          })
        }
        if (this.numberOfHolders > 2) {
          this.kycAddress3.add1.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress3.Address1formFeilds[0].proof0 = this.HolderDetails["ThirdHolderpanNumber"]
            }
          })
          this.kycAddress3.add2.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress3.Address2formFeilds[0].proof0 = this.HolderDetails["ThirdHolderpanNumber"]
            }
          })
          this.kycAddress3.add3.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress3.Address3formFeilds[0].proof0 = this.HolderDetails["ThirdHolderpanNumber"]
            }
          })
          this.kycAddress3.add4.controls.proofOfAddress.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress3.Address4formFeilds[0].proof0 = this.HolderDetails["ThirdHolderpanNumber"]
            }
          })
          this.kycAddress3.form.controls.idProof.valueChanges.subscribe(val => {
            if (val == '34') {
              this.kycAddress3.identityProofformFeilds[0].proof0 = this.HolderDetails["ThirdHolderpanNumber"]
            }
          })

          this.kycPersnalDetails3.form.controls.ProceedType.valueChanges.subscribe(val => {
            if (this.EntryAccess == false && this.isServiceBocked) {
              return
            }
            this.kycPersnalDetails3.fillKraDetials(val);
            if (val == 'KRA') {
              this.cmServ.chooseAOF.next(false)
              this.dataServ.getKRAdetails.subscribe(res => {
                if ((Object.keys(res)).length == 0) {
                  return
                }
                else {
                  let error = res['Error']
                  if (error[0].ErrorCode == 0) {
                    let response = res['Response']
                    this.kycAddress3.add2.controls.city.setValue(response[0].APP_COR_CITY)
                    this.kycAddress3.add2.controls.pinCode.setValue(response[0].APP_COR_PINCD)
                    this.kycAddress3.add2.controls.houseName.setValue(response[0].APP_COR_ADD1)
                    // this.kycAddress3.add2.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                    this.kycAddress3.add2.controls.street.setValue(response[0].APP_COR_ADD3)
                    this.kycAddress3.add1.controls.city.setValue(response[0].APP_PER_CITY)
                    this.kycAddress3.add1.controls.pinCode.setValue(response[0].APP_PER_PINCD)
                    this.kycAddress3.add1.controls.houseName.setValue(response[0].APP_PER_ADD1)
                    // this.kycAddress3.add1.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                    this.kycAddress3.add2.controls.state.setValue(response[0].APP_COR_STATE)
                    this.kycAddress3.add2.controls.country.setValue(response[0].APP_COR_CTRY)
                    this.kycAddress3.add1.controls.state.setValue(response[0].APP_PER_STATE)
                    this.kycAddress3.add1.controls.country.setValue(response[0].APP_PER_CTRY)
                    this.kycAddress3.add1.controls.street.setValue(response[0].APP_PER_ADD3)
                    let valuesArray = JSON.stringify(this.cmServ.getControls(this.kycAddress3.totalProofDetial, this.kycAddress3.code))
                    this.kycAddress3.Address1formFeilds = JSON.parse(valuesArray)
                    this.kycAddress3.Address2formFeilds = JSON.parse(valuesArray)
                    this.kycAddress3.add1.controls.proofOfAddress.patchValue(this.kycAddress3.code)
                    this.kycAddress3.add2.controls.proofOfAddress.patchValue(this.kycAddress3.code)
                    // this.kycAddress3.add3.controls.proofOfAddress.patchValue(this.kycAddress3.code)
                    // this.kycAddress3.add4.controls.proofOfAddress.patchValue(this.kycAddress3.code)
                    this.kycContactDetails3.form.controls.mobile.setValue(response[0].APP_MOB_NO)
                    this.kycContactDetails3.form.controls.email.setValue(response[0].APP_EMAIL)
                    setTimeout(() => {
                      this.kycAddress3.kraGetDistrictbyPincode(response[0].APP_COR_PINCD, 'Address2')
                      this.kycAddress3.kraGetDistrictbyPincode(response[0].APP_PER_PINCD, 'Address1')
                    }, 50)
                    // let obj = {
                    //   firstHolderFirstname: response[0].APP_NAME,
                    //   firstHolderLastname: response[0].APP_F_NAME
                    // }
                    if (this.activeTabIndex == 2)
                      this.cmServ.kraAccountOpeiningThirdHolderData.next(response[0].APP_NAME)
                  }
                }
              })
            }
            else {
              // this.kycContactDetails3.form.controls.mobile.setValue(null)
              // this.kycContactDetails3.form.controls.email.setValue(null)
              this.kycAddress3.kraGetDistrictbyPincode(123, 'Address2')
              this.kycAddress3.kraGetDistrictbyPincode(123, 'Address1')
              if (this.activeTabIndex == 2)
                this.cmServ.kraAccountOpeiningThirdHolderData.next(null)

              //  this.kycAddress3.add1.reset()
              //  this.kycAddress3.add2.reset()
              //   let valuesArray=JSON.stringify(this.cmServ.getControls(this.kycAddress3.totalProofDetial,this.kycAddress3.code))
              //  this.kycAddress3.Address1formFeilds = JSON.parse(valuesArray)
              //  this.kycAddress3.Address2formFeilds = JSON.parse(valuesArray)
            }
          })
        }
      }

      this.kycContactDetails1.form.controls.mobile.valueChanges.subscribe(val => {
        if (val != null) {
          if (val.length == 10) {
            this.validateMobileorEmail(this.HolderDetails["FirstHolderpanNumber"], val, 'M', this.branch, 'mob1')
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
      })
      this.kycContactDetails1.form.controls.additionalMblNo.valueChanges.subscribe(val => {
        if (val != null) {
          if (val.length == 10) {
            this.validateMobileorEmail(this.HolderDetails["FirstHolderpanNumber"], val, 'M', this.branch, 'Addmob1')
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
      })

      this.kycContactDetails1.form.controls.email.valueChanges.subscribe(val => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (val != null && val != "") {
            this.validateMobileorEmail(this.HolderDetails["FirstHolderpanNumber"], val, 'E', this.branch, 'email1')
          } else {
            this.kycContactDetails1.form.controls.existingPan2.patchValue(null)
            this.kycContactDetails1.form.controls.existingClient2.patchValue(null)
            this.kycContactDetails1.form.controls.relation2.patchValue(null)
            this.kycContEmail1 = false
          }
        }, 1000);
      })
      this.kycContactDetails1.form.controls.addEmail.valueChanges.subscribe(val => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (val != null && val != "") {
            this.validateMobileorEmail(this.HolderDetails["FirstHolderpanNumber"], val, 'E', this.branch, 'addEmail1')
          } else {
            this.kycContactDetails1.form.controls.existingPan3.patchValue(null)
            this.kycContactDetails1.form.controls.existingClient3.patchValue(null)
            this.kycContactDetails1.form.controls.relation3.patchValue(null)
            this.kycContAddEmail1 = false
          }
        }, 1000);

      })
      if (this.kycContactDetails2) {
        this.kycContactDetails2.form.controls.mobile.valueChanges.subscribe(val => {
          if (val != null && val != "") {
            if (val.length == 10) {
              this.validateMobileorEmail(this.HolderDetails["SecondHolderpanNumber"], val, 'M', this.branch, 'mob2')
            }
            else {
              this.kycContactDetails2.form.controls.existingPan.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient.patchValue(null)
              this.kycContactDetails2.form.controls.relation.patchValue(null)
              this.kycContMob2 = false

            }
          } else {
            this.kycContactDetails2.form.controls.existingPan.patchValue(null)
            this.kycContactDetails2.form.controls.existingClient.patchValue(null)
            this.kycContactDetails2.form.controls.relation.patchValue(null)
            this.kycContMob2 = false

          }
        })
        this.kycContactDetails2.form.controls.additionalMblNo.valueChanges.subscribe(val => {
          if (val != null && val != "") {
            if (val.length == 10) {
              this.validateMobileorEmail(this.HolderDetails["SecondHolderpanNumber"], val, 'M', this.branch, 'Addmob2')
            }
            else {
              this.kycContactDetails2.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails2.form.controls.relation1.patchValue(null)
              this.kycAddContMob2 = false

            }
          } else {
            this.kycContactDetails2.form.controls.existingPan1.patchValue(null)
            this.kycContactDetails2.form.controls.existingClient1.patchValue(null)
            this.kycContactDetails2.form.controls.relation1.patchValue(null)
            this.kycAddContMob2 = false
          }
        })

        this.kycContactDetails2.form.controls.email.valueChanges.subscribe(val => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.HolderDetails["SecondHolderpanNumber"], val, 'E', this.branch, 'email2')
            } else {
              this.kycContactDetails2.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails2.form.controls.relation2.patchValue(null)
              this.kycContEmail2 = false
            }
          }, 1000);
        })
        this.kycContactDetails2.form.controls.addEmail.valueChanges.subscribe(val => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.HolderDetails["SecondHolderpanNumber"], val, 'E', this.branch, 'addEmail2')
            }
            else {
              this.kycContAddEmail2 = false
              this.kycContactDetails2.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails2.form.controls.relation3.patchValue(null)
            }
          }, 1000);
        })
      }
      if (this.kycContactDetails3) {
        this.kycContactDetails3.form.controls.mobile.valueChanges.subscribe(val => {
          if (val != null && val != "") {
            if (val.length == 10) {
              this.validateMobileorEmail(this.HolderDetails["ThirdHolderpanNumber"], val, 'M', this.branch, 'mob3')
            }
            else {
              this.kycContactDetails3.form.controls.existingPan.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient.patchValue(null)
              this.kycContactDetails3.form.controls.relation.patchValue(null)
              this.kycContMob3 = false

            }
          } else {
            this.kycContactDetails3.form.controls.existingPan.patchValue(null)
            this.kycContactDetails3.form.controls.existingClient.patchValue(null)
            this.kycContactDetails3.form.controls.relation.patchValue(null)
            this.kycContMob3 = false
          }
        })
        this.kycContactDetails3.form.controls.additionalMblNo.valueChanges.subscribe(val => {
          if (val != null && val != "") {
            if (val.length == 10) {
              this.validateMobileorEmail(this.HolderDetails["ThirdHolderpanNumber"], val, 'M', this.branch, 'Addmob3')
            }
            else {
              this.kycContactDetails3.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails3.form.controls.relation1.patchValue(null)
              this.kycAddContMob3 = false
            }
          } else {
            this.kycContactDetails3.form.controls.existingPan1.patchValue(null)
            this.kycContactDetails3.form.controls.existingClient1.patchValue(null)
            this.kycContactDetails3.form.controls.relation1.patchValue(null)
            this.kycAddContMob3 = false
          }
        })

        this.kycContactDetails3.form.controls.email.valueChanges.subscribe(val => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.HolderDetails["ThirdHolderpanNumber"], val, 'E', this.branch, 'email3')
            } else {
              this.kycContactDetails3.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails3.form.controls.relation2.patchValue(null)
              this.kycContEmail3 = false
            }
          }, 1000);
        })
        this.kycContactDetails3.form.controls.addEmail.valueChanges.subscribe(val => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (val != null && val != "") {
              this.validateMobileorEmail(this.HolderDetails["ThirdHolderpanNumber"], val, 'E', this.branch, 'addEmail3')
            } else {
              this.kycContactDetails3.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails3.form.controls.relation3.patchValue(null)
              this.kycContAddEmail3 = false
            }
          }, 1000);
        })
      }


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
          //ClientDetails: "EIA051 - ANISH M"
          // PAN: "AWOPM4980F"
          // BranchEmail: "anil@geojit.com"
          if (type == 'mob1') {
            if (response.results[0].length > 0) {
              // this.notif.error("Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
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
              // this.notif.error("Additonal Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
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
              // this.notif.error(" Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
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
              // this.notif.error("Additonal Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
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

          if (type == 'mob2') {
            if (response.results[0].length > 0) {
              // this.notif.error("Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails2.form.controls.existingPan.patchValue(resultset.PAN)
              this.kycContactDetails2.form.controls.existingClient.patchValue(resultset.ClientDetails)
              this.kycContMob2 = true
            }
            else {
              this.kycContactDetails2.form.controls.existingPan.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient.patchValue(null)
              this.kycContactDetails2.form.controls.relation.patchValue(null)
              this.kycContMob2 = false
            }
          }

          if (type == 'Addmob2') {
            if (response.results[0].length > 0) {
              // this.notif.error("Additonal Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails2.form.controls.existingPan1.patchValue(resultset.PAN)
              this.kycContactDetails2.form.controls.existingClient1.patchValue(resultset.ClientDetails)

              this.kycAddContMob2 = true
            }
            else {
              this.kycContactDetails2.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails2.form.controls.relation1.patchValue(null)
              this.kycAddContMob2 = false
            }
          }

          if (type == 'email2') {
            if (response.results[0].length > 0) {
              // this.notif.error(" Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails2.form.controls.existingPan2.patchValue(resultset.PAN)
              this.kycContactDetails2.form.controls.existingClient2.patchValue(resultset.ClientDetails)

              this.kycContEmail2 = true
            }
            else {
              this.kycContactDetails2.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails2.form.controls.relation2.patchValue(null)
              this.kycContEmail2 = false
            }
          }

          if (type == 'addEmail2') {
            if (response.results[0].length > 0) {
              // this.notif.error("Additonal Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails2.form.controls.existingPan3.patchValue(resultset.PAN)
              this.kycContactDetails2.form.controls.existingClient3.patchValue(resultset.ClientDetails)

              this.kycContAddEmail2 = true
            }
            else {
              this.kycContAddEmail2 = false
              this.kycContactDetails2.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails2.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails2.form.controls.relation3.patchValue(null)
            }
          }


          if (type == 'mob3') {
            if (response.results[0].length > 0) {
              // this.notif.error("Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails3.form.controls.existingPan.patchValue(resultset.PAN)
              this.kycContactDetails3.form.controls.existingClient.patchValue(resultset.ClientDetails)

              this.kycContMob3 = true
            }
            else {
              this.kycContactDetails3.form.controls.existingPan.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient.patchValue(null)
              this.kycContactDetails3.form.controls.relation.patchValue(null)
              this.kycContMob3 = false
            }
          }

          if (type == 'Addmob3') {
            if (response.results[0].length > 0) {
              // this.notif.error("Additonal Mobile number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails3.form.controls.existingPan1.patchValue(resultset.PAN)
              this.kycContactDetails3.form.controls.existingClient1.patchValue(resultset.ClientDetails)

              this.kycAddContMob3 = true
            }
            else {
              this.kycContactDetails3.form.controls.existingPan1.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient1.patchValue(null)
              this.kycContactDetails3.form.controls.relation1.patchValue(null)
              this.kycAddContMob3 = false
            }
          }

          if (type == 'email3') {
            if (response.results[0].length > 0) {
              // this.notif.error(" Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails3.form.controls.existingPan2.patchValue(resultset.PAN)
              this.kycContactDetails3.form.controls.existingClient2.patchValue(resultset.ClientDetails)

              this.kycContEmail3 = true
            }
            else {
              this.kycContactDetails3.form.controls.existingPan2.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient2.patchValue(null)
              this.kycContactDetails3.form.controls.relation2.patchValue(null)
              this.kycContEmail3 = false
            }
          }

          if (type == 'addEmail3') {
            if (response.results[0].length > 0) {
              // this.notif.error("Additonal Email number already Exists,Specify relationship.", '',{nzDuration: 60000 })
              this.kycContactDetails3.form.controls.existingPan3.patchValue(resultset.PAN)
              this.kycContactDetails3.form.controls.existingClient3.patchValue(resultset.ClientDetails)
              this.kycContAddEmail3 = true
            }
            else {
              this.kycContactDetails3.form.controls.existingPan3.patchValue(null)
              this.kycContactDetails3.form.controls.existingClient3.patchValue(null)
              this.kycContactDetails3.form.controls.relation3.patchValue(null)
              this.kycContAddEmail3 = false
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

  tabChange(data) {
    // if(this.clientProfileEdit){
    //   this.fetchProfileEditData(data)
    // }else{
    this.fetchData(data)

  }
  fetchData(tabIndex) {

    if (this.clientType.toLowerCase() == 'individual') {
      let Maintabindex = this.currTabIndex
      if (tabIndex == 0) {
        if(this.firstHolderFetchingDone){
          return
        }
        this.previewImageData = []
        if (!this.clientProfileEdit)
          // this.getimagedata()
          //  this.isSpining = true
          this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              // Pan: this.HolderDetails["FirstHolderpanNumber"],
              // ClientSerialNo: this.clientSerialNumber
              Tab: 'KYC',
              PAN: this.HolderDetails["FirstHolderpanNumber"] || '',
              Flag: this.clientProfileEdit ? 'P' : 'A',
              Euser: this.currentUser.userCode,
              ClientSerialNo: this.clientSerialNumber || '',
              DPID: '',
              ClientID: this.clientIdDetails["FirstHolderClientID"] || ''
            }],
          "requestId": "5065",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results) {
              let dataSet = response.results
              console.clear()
              console.log(dataSet)
              if (dataSet[0].length > 0) {
                this.kycPersnalDetails1.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails1.form.patchValue(response.results[0][0])
                  this.kycPersnalDetails1.form.controls.changeKRA.patchValue(response.results[0][0].changeKRA)
                }, 400);
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
                console.log("contact details", response.results[10][0])
              }
              if (dataSet[11].length > 0) {
                this.kycContactDetails1.IPVComponent.form.patchValue(response.results[11][0]);
                // this.kycContactDetails1.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
              }

              if (dataSet[12].length > 0) {
                // if (response.results[12][0].doc)
                this.kycProofUpload1.SupportFiles = response.results[12];
              }

              if (dataSet[13].length > 0) {
                if (response.results[13][0].doc) {
                  this.kycAddress1.fileList.push(dataSet[13][0])
                  this.kycAddress1.financialDocument = dataSet[13][0]
                }
              }
              if (dataSet[14].length > 0) {
                this.kycPersnalDetails1.form.patchValue(response.results[14][0])
              }

              this.isSpining = false;
              this.firstHolderFetchingDone = true;


            }

          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '')
          }

        })
        // this.isSpining = true

      }
      if (tabIndex == 1) {
        if(this.SecondHolderFetchingDone){
          return
        }
        this.previewImageData = []
        if (!this.clientProfileEdit)
          // this.getimagedata()

          this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Tab: 'KYC',
              PAN: this.HolderDetails["SecondHolderpanNumber"] || '',
              Flag: this.clientProfileEdit ? 'P' : 'A',
              Euser: this.currentUser.userCode,
              ClientSerialNo: this.clientSerialNumber || '',
              DPID: '',
              ClientID: this.clientIdDetails["SecondHolderpanNumber"] || ''
            }],
          "requestId": "5065",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results) {
              let dataSet = response.results
              console.clear()
              console.log(dataSet)
              if (dataSet[0].length > 0) {
                this.kycPersnalDetails2.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails2.form.patchValue(response.results[0][0])
                }, 300);
              }
              setTimeout(() => {
                let form = this.kycAddress2.form.controls;
                if (dataSet[1].length > 0)
                  form.address1.patchValue(response.results[1][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[2].length > 0) {
                    var add12Pf = response.results[2][0]
                    if (response.results[1][0]["proofOfAddress"])
                      this.kycAddress2.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add12Pf)
                  }
                })
                if (dataSet[3].length > 0)
                  form.address2.patchValue(response.results[3][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[4].length > 0) {
                    var add22Pf = response.results[4][0]
                    if (response.results[3][0]["proofOfAddress"])
                      this.kycAddress2.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add22Pf)

                  }
                })
                if (dataSet[5].length > 0)
                  form.address3.patchValue(response.results[5][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[6].length > 0) {
                    var add32Pf = response.results[6][0]
                    if (response.results[5][0]["proofOfAddress"])
                      this.kycAddress2.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add32Pf)

                  }
                })
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[7].length > 0) {

                    var idPf = response.results[7][0];
                    let proof = idPf["proofOfAddress"]
                    if (proof) {
                      delete idPf["proofOfAddress"]
                      this.kycAddress2.patchIdentityProofData(proof, idPf)
                    }

                  }
                })

                if (dataSet[8].length > 0) {
                  let data = response.results[8][0]
                  form.address4.patchValue(data)
                  form.taxOutsideIndia.patchValue(data.JurisdictionFlag)

                }
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[9].length > 0) {
                    var add42Pf = response.results[9][0]
                    if (response.results[8].length > 0)
                      this.kycAddress2.patchADDProof4Data(response.results[8][0]["proofOfAddress"], add42Pf)

                  }
                })
                if (dataSet[10].length > 0) {
                response.results[10][0].smsFacility = response.results[10][0].smsFacility == 'true' ? true : false;
                  this.kycContactDetails2.form.patchValue(response.results[10][0]);

                }
                if (dataSet[11].length > 0) {
                  this.kycContactDetails2.IPVComponent.form.patchValue(response.results[11][0]);
                  // this.kycContactDetails2.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
                }

                if (dataSet[12].length > 0) {
                  // if (response.results[12][0].doc)
                  this.kycProofUpload2.SupportFiles = response.results[12];
                }

                if (dataSet[13].length > 0) {
                  if (response.results[13][0].doc) {
                    this.kycAddress2.fileList.push(dataSet[13][0])
                    this.kycAddress2.financialDocument = dataSet[13][0]
                  }
                }
                if (dataSet[14].length > 0) {
                  this.kycPersnalDetails2.form.patchValue(response.results[14][0])
                }
                // this.isSpining = false
                
                this.SecondHolderFetchingDone=true;
              }, 100);
            }
            this.isSpining = false
          } else {
            this.isSpining = false
            this.notif.error(response.errorMsg, '')
          }
        })

      }
      if (tabIndex == 2) {
        if(this.ThirdHolderFetchingDone){
          return
        }
        this.previewImageData = []
        if (!this.clientProfileEdit)
          // this.getimagedata()


          this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray": [{
            Tab: 'KYC',
            PAN: this.HolderDetails["ThirdHolderpanNumber"] || '',
            Flag: this.clientProfileEdit ? 'P' : 'A',
            Euser: this.currentUser.userCode,
            ClientSerialNo: this.clientSerialNumber || '',
            DPID: '',
            ClientID: this.clientIdDetails["ThirdHolderpanNumber"] || ''
          }],
          "requestId": "5065",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results) {
              let dataSet = response.results
              console.clear()
              console.log(dataSet)
              if (dataSet[0].length > 0) {
                this.kycPersnalDetails3.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails3.form.patchValue(response.results[0][0])
                }, 200);
              }
              setTimeout(() => {
                let form = this.kycAddress3.form.controls;
                if (dataSet[1].length > 0)
                  form.address1.patchValue(response.results[1][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[2].length > 0) {
                    var add13Pf = response.results[2][0]
                    if (response.results[1][0]["proofOfAddress"])
                      this.kycAddress3.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add13Pf)
                  }
                })
                if (dataSet[3].length > 0)
                  form.address2.patchValue(response.results[3][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[4].length > 0) {
                    var add23Pf = response.results[4][0]
                    if (response.results[3][0]["proofOfAddress"])
                      this.kycAddress3.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add23Pf)
                  }
                })

                if (dataSet[5].length > 0)
                  form.address3.patchValue(response.results[5][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[6].length > 0) {
                    var add33Pf = response.results[6][0]
                    if (response.results[5][0]["proofOfAddress"])
                      this.kycAddress3.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add33Pf)
                  }
                })

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[7].length > 0) {
                    var idPf = response.results[7][0];
                    let proof = idPf["proofOfAddress"]
                    if (proof) {
                      delete idPf["proofOfAddress"]
                      this.kycAddress3.patchIdentityProofData(proof, idPf)
                    }
                  }
                })

                if (dataSet[8].length > 0) {
                  let data = response.results[8][0]
                  form.address4.patchValue(data)
                  form.taxOutsideIndia.patchValue(data.JurisdictionFlag)
                }

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[9].length > 0) {
                    var add43Pf = response.results[9][0]
                    if (response.results[8].length > 0)
                      this.kycAddress3.patchADDProof4Data(response.results[8][0]["proofOfAddress"], add43Pf)
                  }
                })
                if (dataSet[10].length > 0){
                response.results[10][0].smsFacility = response.results[10][0].smsFacility == 'true' ? true : false;
                this.kycContactDetails3.form.patchValue(response.results[10][0]);
                }

                if (dataSet[11].length > 0) {
                  this.kycContactDetails3.IPVComponent.form.patchValue(response.results[11][0]);
                  // this.kycContactDetails3.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
                }

                if (dataSet[12].length > 0) {
                  // if (response.results[12][0].doc)
                  this.kycProofUpload3.SupportFiles = response.results[12];
                }

                if (dataSet[13].length > 0) {
                  if (response.results[13][0].doc) {
                    this.kycAddress3.fileList.push(dataSet[13][0])
                    this.kycAddress3.financialDocument = dataSet[13][0]
                  }
                }
                if (dataSet[14].length > 0) {
                  this.kycPersnalDetails3.form.patchValue(response.results[14][0])
                }
              }, 200);
              this.isSpining = false
              this.ThirdHolderFetchingDone=true;
            }
          }
          else {
            this.isSpining = false
            this.notif.error(response.errorMsg, '')

          }
        })
       
      }
    }
  }

  fetchProfileEditData(tabIndex) {

    if (this.clientType.toLowerCase() == 'individual') {
      let Maintabindex = this.currTabIndex
      if (tabIndex == 0 && Maintabindex == 1) {
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              ClientID: this.clientIdDetails["FirstHolderClientID"],
            }],
          "requestId": "5074",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {

            if (response.results) {
              let dataSet = response.results
             console.clear()
              console.log(dataSet)
              if (dataSet[0].length > 0) {
                // this.kycPersnalDetails1.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails1.form.patchValue(response.results[0][0])
                }, 300);
              }
              let form = this.kycAddress1.form.controls;
              if (dataSet[1].length > 0)
                form.address1.patchValue(response.results[1][0])
              this.cmServ.isTotalProofDatafound.subscribe(val => {
                if (val == true && dataSet[2].length > 0) {
                  var add1Pf = response.results[2][0]
                  if (response.results[1][0]["proofOfAddress"])
                    this.kycAddress1.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add1Pf)
                }
              })
              if (dataSet[3].length > 0)
                form.address2.patchValue(response.results[3][0])
              this.cmServ.isTotalProofDatafound.subscribe(val => {
                if (val == true && dataSet[4].length > 0) {
                  var add2Pf = response.results[4][0]
                  if (response.results[3][0]["proofOfAddress"])
                    this.kycAddress1.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add2Pf)
                }
              })
              if (dataSet[5].length > 0)
                form.address3.patchValue(response.results[5][0])
              this.cmServ.isTotalProofDatafound.subscribe(val => {
                if (val == true && dataSet[6].length > 0) {
                  var add3Pf = response.results[6][0]
                  if (response.results[5][0]["proofOfAddress"])
                    this.kycAddress1.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add3Pf)
                }
              })
              if (dataSet[7].length > 0) {
                var idPf = response.results[7][0];

                let proof = idPf["proofOfAddress"]
                if (proof) {
                  delete idPf["proofOfAddress"]
                  this.kycAddress1.patchIdentityProofData(proof, idPf)
                }
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
              if (dataSet[10].length > 0)
                this.kycContactDetails1.form.patchValue(response.results[10][0]);

              if (dataSet[11].length > 0) {
                this.kycContactDetails1.IPVComponent.form.patchValue(response.results[11][0]);
                // this.kycContactDetails1.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
              }

              // if (dataSet[12].length > 0)
              //   this.kycProofUpload1.fileList = response.results[12];
              // if (dataSet[13].length > 0)
              //   this.kycProofUpload1.fileList1 = response.results[13]
              // if (dataSet[14].length > 0)
              //   this.kycProofUpload1.fileList2 = response.results[14]
              // if (dataSet[15].length > 0)
              //   this.kycProofUpload1.fileList3 = response.results[15]
              // if (dataSet[16].length > 0)
              //   this.kycProofUpload1.fileList4 = response.results[16]
              // if (dataSet[17].length > 0)
              //   this.kycProofUpload1.fileList5 = response.results[17]
              // if (dataSet[18].length > 0) {
              //   this.kycAddress1.fileList.push(dataSet[18][0])
              //   this.kycAddress1.financialDocument = dataSet[18][0]
              // }
            }
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        })
      }
      if (tabIndex == 1) {
        this.previewImageData = []
        // this.getimagedata(this.HolderDetails["SecondHolderpanNumber"])

        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              ClientID: this.clientIdDetails["FirstHolderClientID"],
            }],
          "requestId": "5074",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results) {
              let dataSet = response.results
              console.log(dataSet)
              if (dataSet[0].length > 0) {
                this.kycPersnalDetails2.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails2.form.patchValue(response.results[0][0])
                }, 300);
              }
              setTimeout(() => {
                let form = this.kycAddress2.form.controls;
                if (dataSet[1].length > 0)
                  form.address1.patchValue(response.results[1][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[2].length > 0) {
                    var add12Pf = response.results[2][0]
                    this.kycAddress2.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add12Pf)
                  }
                })
                if (dataSet[3].length > 0)
                  form.address2.patchValue(response.results[3][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[4].length > 0) {
                    var add22Pf = response.results[4][0]
                    this.kycAddress2.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add22Pf)

                  }
                })
                if (dataSet[5].length > 0)
                  form.address3.patchValue(response.results[5][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[6].length > 0) {
                    var add32Pf = response.results[6][0]
                    this.kycAddress2.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add32Pf)

                  }
                })
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[7].length > 0) {
                    var idPf = response.results[7][0];
                    let proof = idPf["proofOfAddress"]
                    if (proof) {
                      delete idPf["proofOfAddress"]
                      this.kycAddress2.patchIdentityProofData(proof, idPf)
                    }
                  }
                })

                if (dataSet[8].length > 0) {
                  let data = response.results[8][0]
                  form.address4.patchValue(data)
                  form.taxOutsideIndia.patchValue(data.JurisdictionFlag)

                }
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[9].length > 0) {
                    var add42Pf = response.results[9][0]
                    this.kycAddress2.patchADDProof4Data(response.results[8][0]["proofOfAddress"], add42Pf)

                  }
                })
                if (dataSet[10].length > 0) {
                response.results[10][0].smsFacility = response.results[10][0].smsFacility == 'true' ? true : false;
                  this.kycContactDetails2.form.patchValue(response.results[10][0]);

                }
                if (dataSet[11].length > 0) {
                  this.kycContactDetails2.IPVComponent.form.patchValue(response.results[11][0]);
                  // this.kycContactDetails2.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
                }
                if (dataSet[12].length > 0)
                  this.kycProofUpload2.fileList = response.results[12];
                if (dataSet[13].length > 0)
                  this.kycProofUpload2.fileList1 = response.results[13]
                if (dataSet[14].length > 0)
                  this.kycProofUpload2.fileList2 = response.results[14]
                if (dataSet[15].length > 0)
                  this.kycProofUpload2.fileList3 = response.results[15]
                if (dataSet[16].length > 0)
                  this.kycProofUpload2.fileList4 = response.results[16]
                if (dataSet[17].length > 0)
                  this.kycProofUpload2.fileList5 = response.results[17]
                if (dataSet[18].length > 0) {
                  this.kycAddress2.fileList.push(dataSet[18][0])
                  this.kycAddress2.financialDocument = dataSet[18][0]
                }
                // this.isSpining = false

              }, 100);
            }
            this.isSpining = false
          }
          else {
            this.isSpining = false
            this.notif.error(response.errorCode, '')
          }
        })

      }
      if (tabIndex == 2) {
        this.previewImageData = []
        // this.getimagedata(this.HolderDetails["ThirdHolderpanNumber"])

        this.isSpining = true
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              ClientID: this.clientIdDetails["FirstHolderClientID"],
            }],
          "requestId": "5074",
          "outTblCount": "0"
        }).then((response) => {
          if (response.results) {
            if (response.errorCode == 0) {
              let dataSet = response.results
              console.log(dataSet)

              if (dataSet[0].length > 0) {
                this.kycPersnalDetails3.Agency = response.results[0][0].Agency
                setTimeout(() => {
                  this.kycPersnalDetails3.form.patchValue(response.results[0][0])
                }, 200);
              }
              setTimeout(() => {
                let form = this.kycAddress3.form.controls;
                if (dataSet[1].length > 0)
                  form.address1.patchValue(response.results[1][0])
                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[2].length > 0) {
                    var add13Pf = response.results[2][0]
                    this.kycAddress3.patchADDProof1Data(response.results[1][0]["proofOfAddress"], add13Pf)
                  }
                })
                if (dataSet[3].length > 0)
                  form.address2.patchValue(response.results[3][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[4].length > 0) {
                    var add23Pf = response.results[4][0]
                    this.kycAddress3.patchADDProof2Data(response.results[3][0]["proofOfAddress"], add23Pf)
                  }
                })

                if (dataSet[5].length > 0)
                  form.address3.patchValue(response.results[5][0])

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[6].length > 0) {
                    var add33Pf = response.results[6][0]
                    this.kycAddress3.patchADDProof3Data(response.results[5][0]["proofOfAddress"], add33Pf)
                  }
                })

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[7].length > 0) {
                    var idPf = response.results[7][0];
                    let proof = idPf["proofOfAddress"]
                    delete idPf["proofOfAddress"]
                    this.kycAddress3.patchIdentityProofData(proof, idPf)
                  }
                })

                if (dataSet[8].length > 0) {
                  let data = response.results[8][0]
                  form.address4.patchValue(data)
                  form.taxOutsideIndia.patchValue(data.JurisdictionFlag)
                }

                this.cmServ.isTotalProofDatafound.subscribe(val => {
                  if (val == true && dataSet[9].length > 0) {
                    var add43Pf = response.results[9][0]
                    this.kycAddress3.patchADDProof4Data(response.results[8][0]["proofOfAddress"], add43Pf)
                  }
                })
                if (dataSet[10].length > 0)
                  this.kycContactDetails3.form.patchValue(response.results[10][0]);

                if (dataSet[11].length > 0) {
                  this.kycContactDetails3.IPVComponent.form.patchValue(response.results[11][0]);
                  // this.kycContactDetails3.IPVComponent.Empcode = { Empcode: response.results[11][0].empCode }
                }

                if (dataSet[12].length > 0)
                  this.kycProofUpload3.fileList = response.results[12];
                if (dataSet[13].length > 0)
                  this.kycProofUpload3.fileList1 = response.results[13]
                if (dataSet[14].length > 0)
                  this.kycProofUpload3.fileList2 = response.results[14]
                if (dataSet[15].length > 0)
                  this.kycProofUpload3.fileList3 = response.results[15]
                if (dataSet[16].length > 0)
                  this.kycProofUpload3.fileList4 = response.results[16]
                if (dataSet[17].length > 0)
                  this.kycProofUpload3.fileList5 = response.results[17]
                if (dataSet[18].length > 0) {
                  this.kycAddress3.fileList.push(dataSet[18][0])
                  this.kycAddress3.financialDocument = dataSet[18][0]
                }
              }, 200);
            }
          }
          else {
            this.isSpining = false
            this.notif.error(response.errorMsg, '')
          }
        })
        this.isSpining = false
      }
    }
  }


  fillAofData() {
    let i = this.activeTabIndex
    let details = Object.keys(this.HolderDetails)
    if (this.clientType == "individual") {
      if (details.length == 6 && this.HolderDetails["FirstHolderpanNumber"] != null) {
        this.kycPersnalDetails1.form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.kycPersnalDetails1.form.controls.dob.patchValue(this.HolderDetails["FirstHolderdob"])
        this.kycPersnalDetails1.form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.kycPersnalDetails1.form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.kycPersnalDetails1.form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.kycPersnalDetails1.form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // if (this.Holder1PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails1.nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName
      }

      if (details.length == 12) {
        this.kycPersnalDetails1.form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.kycPersnalDetails1.form.controls.dob.patchValue(this.HolderDetails["FirstHolderdob"])
        this.kycPersnalDetails1.form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.kycPersnalDetails1.form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.kycPersnalDetails1.form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.kycPersnalDetails1.form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // if (this.Holder1PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails1.nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName

        this.kycPersnalDetails2.form.controls.pan.patchValue(this.HolderDetails["SecondHolderpanNumber"])
        this.kycPersnalDetails2.form.controls.dob.patchValue(this.HolderDetails["SecondHolderdob"])
        this.kycPersnalDetails2.form.controls.nametitle.patchValue(this.HolderDetails["SecondHoldertitle"])
        this.kycPersnalDetails2.form.controls.namefirstName.patchValue(this.HolderDetails["SecondHolderfirstName"])
        this.kycPersnalDetails2.form.controls.namemiddleName.patchValue(this.HolderDetails["SecondHoldermiddleName"])
        this.kycPersnalDetails2.form.controls.namelastName.patchValue(this.HolderDetails["SecondHolderlastName"])
        // if (this.Holder2PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails2.nameinpan = this.Holder2PanDetails.SurName + " " + this.Holder2PanDetails.FirstName + " " + this.Holder2PanDetails.LastName
      }
      if (details.length == 18) {
        this.kycPersnalDetails1.form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.kycPersnalDetails1.form.controls.dob.patchValue(this.HolderDetails["FirstHolderdob"])
        this.kycPersnalDetails1.form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.kycPersnalDetails1.form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.kycPersnalDetails1.form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.kycPersnalDetails1.form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // if (this.Holder1PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails1.nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName

        this.kycPersnalDetails2.form.controls.pan.patchValue(this.HolderDetails["SecondHolderpanNumber"])
        this.kycPersnalDetails2.form.controls.dob.patchValue(this.HolderDetails["SecondHolderdob"])
        this.kycPersnalDetails2.form.controls.nametitle.patchValue(this.HolderDetails["SecondHoldertitle"])
        this.kycPersnalDetails2.form.controls.namefirstName.patchValue(this.HolderDetails["SecondHolderfirstName"])
        this.kycPersnalDetails2.form.controls.namemiddleName.patchValue(this.HolderDetails["SecondHoldermiddleName"])
        this.kycPersnalDetails2.form.controls.namelastName.patchValue(this.HolderDetails["SecondHolderlastName"])
        // if (this.Holder2PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails2.nameinpan = this.Holder2PanDetails.SurName + " " + this.Holder2PanDetails.FirstName + " " + this.Holder2PanDetails.LastName

        this.kycPersnalDetails3.form.controls.pan.patchValue(this.HolderDetails["ThirdHolderpanNumber"])
        this.kycPersnalDetails3.form.controls.dob.patchValue(this.HolderDetails["ThirdHolderdob"])
        this.kycPersnalDetails3.form.controls.nametitle.patchValue(this.HolderDetails["ThirdHoldertitle"])
        this.kycPersnalDetails3.form.controls.namefirstName.patchValue(this.HolderDetails["ThirdHolderfirstName"])
        this.kycPersnalDetails3.form.controls.namemiddleName.patchValue(this.HolderDetails["ThirdHoldermiddleName"])
        this.kycPersnalDetails3.form.controls.namelastName.patchValue(this.HolderDetails["ThirdHolderlastName"])
        // if (this.Holder3PanDetails.hasOwnProperty('SurName') && !this.isServiceBocked)
        //   this.kycPersnalDetails3.nameinpan = this.Holder3PanDetails.SurName + " " + this.Holder3PanDetails.FirstName + " " + this.Holder3PanDetails.LastName
      }
    }
    else if (this.nonIndPersonaldetails.length) {
      if (details.length == 6 && this.HolderDetails["FirstHolderpanNumber"] != null && this.tabs.length > 0) {
        this.nonIndPersonaldetails[0].form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.nonIndPersonaldetails[0].form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.nonIndPersonaldetails[0].form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.nonIndPersonaldetails[0].form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.nonIndPersonaldetails[0].form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // this.nonIndPersonaldetails[0].nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName
      }

      if (details.length == 12 && this.tabs.length > 1) {
        this.nonIndPersonaldetails[0].form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.nonIndPersonaldetails[0].form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.nonIndPersonaldetails[0].form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.nonIndPersonaldetails[0].form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.nonIndPersonaldetails[0].form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // this.nonIndPersonaldetails[0].nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName

        this.nonIndPersonaldetails[1].form.controls.pan.patchValue(this.HolderDetails["SecondHolderpanNumber"])
        this.nonIndPersonaldetails[1].form.controls.nametitle.patchValue(this.HolderDetails["SecondHoldertitle"])
        this.nonIndPersonaldetails[1].form.controls.namefirstName.patchValue(this.HolderDetails["SecondHolderfirstName"])
        this.nonIndPersonaldetails[1].form.controls.namemiddleName.patchValue(this.HolderDetails["SecondHoldermiddleName"])
        this.nonIndPersonaldetails[1].form.controls.namelastName.patchValue(this.HolderDetails["SecondHolderlastName"])
        // this.nonIndPersonaldetails[1].nameinpan = this.Holder2PanDetails.SurName + " " + this.Holder2PanDetails.FirstName + " " + this.Holder2PanDetails.LastName
      }
      if (details.length == 18 && this.tabs.length > 2) {
        this.nonIndPersonaldetails[0].form.controls.pan.patchValue(this.HolderDetails["FirstHolderpanNumber"])
        this.nonIndPersonaldetails[0].form.controls.nametitle.patchValue(this.HolderDetails["FirstHoldertitle"])
        this.nonIndPersonaldetails[0].form.controls.namefirstName.patchValue(this.HolderDetails["FirstHolderfirstName"])
        this.nonIndPersonaldetails[0].form.controls.namemiddleName.patchValue(this.HolderDetails["FirstHoldermiddleName"])
        this.nonIndPersonaldetails[0].form.controls.namelastName.patchValue(this.HolderDetails["FirstHolderlastName"])
        // this.nonIndPersonaldetails[0].nameinpan = this.Holder1PanDetails.SurName + " " + this.Holder1PanDetails.FirstName + " " + this.Holder1PanDetails.LastName

        this.nonIndPersonaldetails[1].form.controls.pan.patchValue(this.HolderDetails["SecondHolderpanNumber"])
        this.nonIndPersonaldetails[1].form.controls.nametitle.patchValue(this.HolderDetails["SecondHoldertitle"])
        this.nonIndPersonaldetails[1].form.controls.namefirstName.patchValue(this.HolderDetails["SecondHolderfirstName"])
        this.nonIndPersonaldetails[1].form.controls.namemiddleName.patchValue(this.HolderDetails["SecondHoldermiddleName"])
        this.nonIndPersonaldetails[1].form.controls.namelastName.patchValue(this.HolderDetails["SecondHolderlastName"])
        // this.nonIndPersonaldetails[1].nameinpan = this.Holder2PanDetails.SurName + " " + this.Holder2PanDetails.FirstName + " " + this.Holder2PanDetails.LastName

        this.nonIndPersonaldetails[2].form.controls.pan.patchValue(this.HolderDetails["ThirdHolderpanNumber"])
        this.nonIndPersonaldetails[2].form.controls.nametitle.patchValue(this.HolderDetails["ThirdHoldertitle"])
        this.nonIndPersonaldetails[2].form.controls.namefirstName.patchValue(this.HolderDetails["ThirdHolderfirstName"])
        this.nonIndPersonaldetails[2].form.controls.namemiddleName.patchValue(this.HolderDetails["ThirdHoldermiddleName"])
        this.nonIndPersonaldetails[2].form.controls.namelastName.patchValue(this.HolderDetails["ThirdHolderlastName"])
        // this.nonIndPersonaldetails[2].nameinpan = this.Holder3PanDetails.SurName + " " + this.Holder3PanDetails.FirstName + " " + this.Holder3PanDetails.LastName
      }
    }
  }

  ngOnInit() {
    // this.subscriptions.push(
    this.cmServ.isEntryAccess.subscribe((val) => {
      this.EntryAccess = val
    })
    this.cmServ.finalize.subscribe(val=>{
      this.isEntryfinalised=val
    })
    
    this.cmServ.isServiceBlocked.subscribe((val) => {
      this.isServiceBocked = val
    })

    this.ngZone.run(() => {
      this.cmServ.clientType.subscribe((val) => {
        this.clientType = val;
        console.log(this.clientType)
      })
      // )
      // this.subscriptions.push(
      this.cmServ.holderLength.subscribe(val => {

        this.indTabs = Array(val);
        this.numberOfHolders = val

      })
      // )
      // this.subscriptions.push(
      this.cmServ.clientSerialNumber.subscribe(val => {
        this.clientSerialNumber = val
      })
      this.cmServ.clientIdDetails.subscribe(val => {
        this.clientIdDetails = val
      })
      // )
      // this.subscriptions.push(
      this.cmServ.hoder1PanDetails.subscribe(val => {
        this.Holder1PanDetails = val
      })
      // )
      // this.subscriptions.push(
      this.cmServ.hoder2PanDetails.subscribe(val => {
        this.Holder2PanDetails = val

      })


      // )
      // this.subscriptions.push(
      this.cmServ.hoder3PanDetails.subscribe(val => {
        this.Holder3PanDetails = val
      })
      // )
      // this.subscriptions.push(
      this.cmServ.chooseAOF.subscribe(val => {
        if (val == true) {
          this.fillAofData()
        }
      })
    })
    // )
    // this.cmServ.isIdentityProofLoaded.subscribe(val=>{
    //   if(val==true){
    //     this.setIdPf()
    //   }
    // })
    this.updateTabs();


  }

  getimagedata() {
    let pan = ''
    if (this.activeTabIndex == 0) {
      pan = this.HolderDetails["FirstHolderpanNumber"]
    }
    if (this.activeTabIndex == 1) {
      pan = this.HolderDetails["SecondHolderpanNumber"]
    }
    if (this.activeTabIndex == 2) {
      pan = this.HolderDetails["ThirdHolderpanNumber"]
    }

    this.showPortal = true;
    this.previewImageData = {
      ImageFrom: 'KYC-ACCOP',
      PAN: pan
    }

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
    if (!isNaN(this.kycCount) && this.kycCount > 0)
      this.tabs = Array(this.kycCount);
  }
  ngAfterViewChecked() {
    if (this.nonIndPersonaldetails.length == 0) {
      this.nonIndPersonaldetails = this.kycpersonal.toArray()
      this.nonIndAddress = this.kycAddress.toArray()
      this.nonIndContactDetails = this.kycContactDetails.toArray()
      this.nonIndProofUpload = this.kycProofUpload.toArray()
      this.nonIndComBasic = this.kycCompBasic.toArray()
      this.nonIndComAddress = this.kycCompAdd.toArray()
      this.nonIndCompContactDetails = this.kycCompContactDetails.toArray()
      if (this.nonIndPersonaldetails.length) {
        this.nonIndPersonaldetails[0].form.controls.ProceedType.valueChanges.subscribe(val => {
          let i = this.activeTabIndex
          this.nonIndPersonaldetails[i].fillKraDetials(val);
          if (val == 'KRA') {
            this.cmServ.chooseAOF.next(false)
            this.dataServ.getKRAdetails.subscribe(res => {

              if ((Object.keys(res)).length == 0) {
                return
              }
              else {
                let error = res['Error']
                if (error[0].ErrorCode == 0) {
                  let response = res['Response']
                  console.log("kra response", response)
                  // APP_BRANCH_CODE: "HEADOFFICE"
                  // APP_COMMENCE_DT: "01/01/1900"
                  // APP_COMP_STATUS: ""
                  // APP_COR_ADD1: "1132"
                  // APP_COR_ADD2: "GALI SAMOSAN "
                  // APP_COR_ADD3: "FARASH KHANA"
                  // APP_COR_ADD_DT: "23/03/2010"
                  // APP_COR_ADD_PROOF: "Voter Identity Card"
                  // APP_COR_ADD_REF: "TUF1301191"
                  // APP_COR_CITY: "NEW DELHI"
                  // APP_COR_CTRY: "India"
                  // APP_COR_PINCD: "110006"
                  // APP_COR_STATE: "Delhi"
                  // APP_DATE: "11/01/2012"
                  // APP_DNLDDT: "03/02/2020"
                  // APP_DOB_DT: "10/10/1986"
                  // APP_DOC_PROOF: "Self Certified Copies Submitted "
                  // APP_DOI_DT: ""
                  // APP_DUMP_TYPE: "S"
                  // APP_EMAIL: "SHWETAP@CDSLINDIA.COM"
                  // APP_ERROR_DESC: "Success"
                  // APP_EXMT: "NO "
                  // APP_EXMT_CAT: ""
                  // APP_EXMT_ID_PROOF: "PAN"
                  // APP_FAX_NO: ""
                  // APP_FILLER1: ""
                  // APP_FILLER2: ""
                  // APP_FILLER3: ""
                  // APP_F_NAME: "HARI KISHAN"
                  // APP_GEN: "MALE"
                  // APP_INCOME: "1-5 LAC"
                  // APP_INCORP_PLC: ""
                  // APP_INTERNAL_REF: "WEBSOLICIT"
                  // APP_INT_CODE: "GEOJITBNP"
                  // APP_IOP_FLG: null
                  // APP_IPV_DATE: "16/11/2011"
                  // APP_IPV_FLAG: "YES       "
                  // APP_KRA_INFO: "CVLKRA"
                  // APP_KYC_MODE: "Normal KYC"
                  // APP_MAR_STATUS: "UNMARRIED"
                  // APP_MOB_NO: "9873625580"
                  // APP_NAME: "SACHIN KUMAR"
                  // APP_NATIONALITY: "INDIAN"
                  // APP_NETWORTH_DT: "01/01/1900"
                  // APP_NETWRTH: ""
                  // APP_NO: "APPNO"
                  // APP_OCC: "Private Sector Service"
                  // APP_OFF_NO: ""
                  // APP_OTHERINFO: ""
                  // APP_OTH_COMP_STATUS: "          "
                  // APP_OTH_NATIONALITY: ""
                  // APP_OTH_OCC: ""
                  // APP_PANEX_NO: ""
                  // APP_PAN_COPY: "YES"
                  // APP_PAN_NO: "AXKPS4079A"
                  // APP_PER_ADD1: "1132"
                  // APP_PER_ADD2: "GALI SAMOSAN "
                  // APP_PER_ADD3: "FARASH KHANA"
                  // APP_PER_ADD_DT: "23/03/2010"
                  // APP_PER_ADD_PROOF: "Voter Identity Card"
                  // APP_PER_ADD_REF: "TUF1301191"
                  // APP_PER_CITY: "NEW DELHI"
                  // APP_PER_CTRY: "India"
                  // APP_PER_PINCD: "110006"
                  // APP_PER_STATE: "Delhi"
                  // APP_POL_CONN: "Not Applicable"
                  // APP_POS_CODE: null
                  // APP_REGNO: ""
                  // APP_REMARKS: ""
                  // APP_RES_NO: ""
                  // APP_RES_STATUS: "Resident Individual             "
                  // APP_RES_STATUS_PROOF: ""
                  // APP_SIGNATURE: null
                  // APP_STATUS: "DOCUMENTS RECEIVED"
                  // APP_STATUSDT: "11/03/2014 13:22"
                  // APP_TYPE: "Individual"
                  // APP_UID_NO: "N"
                  // APP_UPDTFLG: "Dump"
                  this.nonIndAddress[i].add2.controls.city.setValue(response[0].APP_COR_CITY)
                  this.nonIndAddress[i].add2.controls.pinCode.setValue(response[0].APP_COR_PINCD)
                  this.nonIndAddress[i].add2.controls.houseName.setValue(response[0].APP_COR_ADD1)
                  // this.nonIndAddress[i].add2.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                  this.nonIndAddress[i].add2.controls.street.setValue(response[0].APP_COR_ADD3)
                  this.nonIndAddress[i].add2.controls.state.setValue(response[0].APP_COR_STATE)
                  this.nonIndAddress[i].add2.controls.country.setValue(response[0].APP_COR_CTRY)

                  this.nonIndAddress[i].add1.controls.city.setValue(response[0].APP_PER_CITY)
                  this.nonIndAddress[i].add1.controls.pinCode.setValue(response[0].APP_PER_PINCD)
                  this.nonIndAddress[i].add1.controls.houseName.setValue(response[0].APP_PER_ADD1)
                  // this.nonIndAddress[i].add1.controls.houseNumber.setValue(response[0].APP_PER_ADD2)
                  this.nonIndAddress[i].add1.controls.street.setValue(response[0].APP_PER_ADD3)
                  this.nonIndAddress[i].add1.controls.state.setValue(response[0].APP_PER_STATE)
                  this.nonIndAddress[i].add1.controls.country.setValue(response[0].APP_COR_CTRY)
                  let valuesArray = JSON.stringify(this.cmServ.getControls(this.nonIndAddress[i].totalProofDetial, this.nonIndAddress[i].code))
                  this.nonIndAddress[i].Address1formFeilds = JSON.parse(valuesArray)
                  this.nonIndAddress[i].Address2formFeilds = JSON.parse(valuesArray)
                  this.nonIndAddress[i].add1.controls.proofOfAddress.patchValue(this.nonIndAddress[i].code)
                  this.nonIndAddress[i].add2.controls.proofOfAddress.patchValue(this.nonIndAddress[i].code)
                  // this.nonIndAddress[i].add3.controls.proofOfAddress.patchValue(this.nonIndAddress[i].code)
                  // this.nonIndAddress[i].add4.controls.proofOfAddress.patchValue(this.nonIndAddress[i].code)
                  this.nonIndContactDetails[i].form.controls.mobile.setValue(response[0].APP_MOB_NO)
                  this.nonIndContactDetails[i].form.controls.email.setValue(response[0].APP_EMAIL)
                }
              }
            })
          }
          else {
            // this.nonIndContactDetails[i].form.controls.mobile.setValue(null)
            // this.nonIndContactDetails[i].form.controls.email.setValue(null)
            //  this.kycAddress1.add1.reset()
            //  this.kycAddress1.add2.reset()
            //   let valuesArray=JSON.stringify(this.cmServ.getControls(this.kycAddress1.totalProofDetial,this.kycAddress1.code))
            //  this.kycAddress1.Address1formFeilds = JSON.parse(valuesArray)
            //  this.kycAddress1.Address2formFeilds = JSON.parse(valuesArray)
          }

        })
      }
      if (this.clientType == 'nonIndividual')
        this.fillAofData()
    }
  }

  continueNext() {
    if (this.EntryAccess == false) {
      this.next1()
      return
    }
    if (this.indTabs.length > 1) {
      if (this.activeTabIndex < this.indTabs.length) {
        if (this.activeTabIndex == 0) {
          this.isSpining = true
          let PAN = this.kycPersnalDetails1.form.value.pan;
          let isValid = this.validServ.validateForm(this.kycPersnalDetails1.form, this.FormControlNames, this.customValidationMsgObj.PersonalDetails);
          if (!isValid) {
            this.el.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }

          let data = []
          let obj = {
            Agency: this.kycPersnalDetails1.Agency
          }
          let tdata = { ...this.kycPersnalDetails1.form.value, ...obj }
          data.push(tdata)
          var JSONData1 = this.utilServ.setJSONArray(data);
          let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
          KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//added By Sachin
          // console.log(KYCPersonalDetailsXmlData)
          let isAddressValid = this.kycAddress1.isAddressValid();
          if (!isAddressValid) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let currentPermantAddressXmlData = this.kycAddress1.currentPermantAddressXmlData
          currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          let AdditionalcorresLocalAddressXmlData = this.kycAddress1.AdditionalcorresLocalAddressXmlData
          AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          let corresLocalAddressXmlData = this.kycAddress1.corresLocalAddressXmlData
          corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          if (this.kycAddress1.isJudisdiction == true) {
            this.kycJurisdictionAddressData1 = this.kycAddress1.jurisdictionsAddressXmlData
            this.kycJurisdictionAddressData1 = this.kycJurisdictionAddressData1.replace(/&/gi, '#||')//Added By Sachin
          }

          let identityPoof = this.kycAddress1.isIdentityProofValid();
          if (!identityPoof) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let identyProofXmlData = this.kycAddress1.identyProofXmlData
          identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
          // console.log(identyProofXmlData)

          let smsFacility = this.kycContactDetails1.canAllowSmsFacility()
          if (!smsFacility) {
            this.isSpining = false;
            return;
          }
          if (this.kycContMob1) {
            if (this.kycContactDetails1.form.value.relation == null) {
              this.isSpining = false;
              this.notif.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycAddContMob1) {
            if (this.kycContactDetails1.form.value.relation1 == null) {
              this.isSpining = false;
              this.notif.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContEmail1) {
            if (this.kycContactDetails1.form.value.relation2 == null) {
              this.isSpining = false;
              this.notif.error("Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContAddEmail1) {
            if (this.kycContactDetails1.form.value.relation3 == null) {
              this.isSpining = false;
              this.notif.error("Additional Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }

          let isIpvValid = this.kycContactDetails1.isAddressAndIpvDeclarationValid()
          if (!isIpvValid) {
            this.contactel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }

          let addressAndIpvXmlData = this.kycContactDetails1.addressAndIpvData
          addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
          console.log(addressAndIpvXmlData)
          let uploadProofData = this.kycProofUpload1.checkUploads()
          if (uploadProofData['status'] != true) {
            this.isSpining = false
            return
          }
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          let imageXmlData = jsonxml(jsond);
          console.log(imageXmlData)
          this.notif.remove()
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: PAN,
                Euser: this.currentUser.userCode,
                KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
                KycXML_PerAdd: currentPermantAddressXmlData,
                KycXML_CorresAdd: corresLocalAddressXmlData,
                KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
                KycXML_IdentityProof: identyProofXmlData,
                KycXML_TaxDetails: this.kycJurisdictionAddressData1 ? this.kycJurisdictionAddressData1 : '',
                KycXML_ContactDetails: addressAndIpvXmlData,
                KYCXML_ImageDetails: imageXmlData || '',
                ClientSerialNo: this.clientSerialNumber,
                AutoSave: 'N',
                Flag: this.clientProfileEdit ? 'P' : 'A'
              }],
            "requestId": "5061",
            "outTblCount": "0"
          }).then((response) => {
            if (response.errorCode == 0) {
              let details = response.results[0][0]
              if (details.ErrorCode == 0) {
                this.notif.success(details.Msg, '', { nzDuration: 60000 });
                this.isSpining = false
                this.el.nativeElement.scrollIntoView();

                this.activeTabIndex++;
              }
              else {
                this.notif.error(details.Msg, '', { nzDuration: 60000 })
                this.isSpining = false

              }
            }
            else {
              this.isSpining = false
              this.notif.error(response.errorMsg, '')
            }
          })
        }
        if (this.activeTabIndex == 1) {
          this.isSpining = true

          let PAN = this.kycPersnalDetails2.form.value.pan;
          let isValid = this.validServ.validateForm(this.kycPersnalDetails2.form, this.customValidationMsgObj.PersonalDetails);
          if (!isValid) {
            this.el.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let data = []
          let obj = {
            Agency: this.kycPersnalDetails2.Agency
          }
          let tdata = { ...this.kycPersnalDetails2.form.value, ...obj }
          data.push(tdata)
          var JSONData1 = this.utilServ.setJSONArray(data);
          let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
          KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
          console.log(KYCPersonalDetailsXmlData)
          let isAddressValid = this.kycAddress2.isAddressValid();
          if (!isAddressValid) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let currentPermantAddressXmlData = this.kycAddress2.currentPermantAddressXmlData
          currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

          let AdditionalcorresLocalAddressXmlData = this.kycAddress2.AdditionalcorresLocalAddressXmlData
          AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

          let corresLocalAddressXmlData = this.kycAddress2.corresLocalAddressXmlData
          corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          if (this.kycAddress2.isJudisdiction == true) {
            this.kycJurisdictionAddressData2 = this.kycAddress2.jurisdictionsAddressXmlData
            this.kycJurisdictionAddressData2 = this.kycJurisdictionAddressData2.replace(/&/gi, '#||')//Added By Sachin
          }

          let identityPoof = this.kycAddress2.isIdentityProofValid();
          if (!identityPoof) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let identyProofXmlData = this.kycAddress2.identyProofXmlData
          identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
          console.log(identyProofXmlData)

          let smsFacility = this.kycContactDetails2.canAllowSmsFacility()
          if (!smsFacility) {
            this.isSpining = false;
            return;
          }
          if (this.kycContMob2) {
            if (this.kycContactDetails2.form.value.relation == null) {
              this.isSpining = false;
              this.notif.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycAddContMob2) {
            if (this.kycContactDetails2.form.value.relation1 == null) {
              this.isSpining = false;
              this.notif.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContEmail2) {
            if (this.kycContactDetails2.form.value.relation2 == null) {
              this.isSpining = false;
              this.notif.error("Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContAddEmail2) {
            if (this.kycContactDetails2.form.value.relation3 == null) {
              this.isSpining = false;
              this.notif.error("Additional Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }

          let isIpvValid = this.kycContactDetails2.isAddressAndIpvDeclarationValid()
          if (!isIpvValid) {
            this.contactel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let addressAndIpvXmlData = this.kycContactDetails2.addressAndIpvData
          addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin

          console.log(addressAndIpvXmlData)
          let uploadProofData = this.kycProofUpload2.checkUploads()
          if (uploadProofData['status'] != true) {
            this.isSpining = false
            return
          }
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          let imageXmlData = jsonxml(jsond);
          console.log(imageXmlData)
          this.notif.remove()
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: PAN,
                Euser: this.currentUser.userCode,
                KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
                KycXML_PerAdd: currentPermantAddressXmlData,
                KycXML_CorresAdd: corresLocalAddressXmlData,
                KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
                KycXML_IdentityProof: identyProofXmlData,
                KycXML_TaxDetails: this.kycJurisdictionAddressData2 ? this.kycJurisdictionAddressData2 : '',
                KycXML_ContactDetails: addressAndIpvXmlData,
                KYCXML_ImageDetails: imageXmlData || '',
                ClientSerialNo: this.clientSerialNumber,
                AutoSave: 'N',
                Flag: this.clientProfileEdit ? 'P' : 'A'

              }],
            "requestId": "5061",
            "outTblCount": "0"
          }).then((response) => {
            if (response.errorCode == 0) {


              let details = response.results[0][0]
              if (details.ErrorCode == 0) {
                this.isSpining = false
                this.notif.success(details.Msg, '', { nzDuration: 60000 });
                this.el.nativeElement.scrollIntoView();
                this.activeTabIndex++;

              }
              else {
                this.isSpining = false

                this.notif.error(details.Msg, '', { nzDuration: 60000 })
              }
            }
            else {
              this.notif.error(response.errorMsg, '')
              this.isSpining = false
            }
          })
        }
        if (this.activeTabIndex == 2) {
          this.isSpining = true
          let PAN = this.kycPersnalDetails3.form.value.pan;
          let isValid = this.validServ.validateForm(this.kycPersnalDetails3.form, this.FormControlNames, this.customValidationMsgObj.PersonalDetails);
          if (!isValid) {
            this.el.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let data = []
          let obj = {
            Agency: this.kycPersnalDetails3.Agency
          }
          let tdata = { ...this.kycPersnalDetails3.form.value, ...obj }
          data.push(tdata)
          var JSONData1 = this.utilServ.setJSONArray(data);
          let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
          KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
          console.log(KYCPersonalDetailsXmlData)
          let isAddressValid = this.kycAddress3.isAddressValid();
          if (!isAddressValid) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let currentPermantAddressXmlData = this.kycAddress3.currentPermantAddressXmlData
          currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          let AdditionalcorresLocalAddressXmlData = this.kycAddress3.AdditionalcorresLocalAddressXmlData
          AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
          let corresLocalAddressXmlData = this.kycAddress3.corresLocalAddressXmlData
          corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

          if (this.kycAddress3.isJudisdiction == true) {
            this.kycJurisdictionAddressData3 = this.kycAddress3.jurisdictionsAddressXmlData
            this.kycJurisdictionAddressData3 = this.kycJurisdictionAddressData3.replace(/&/gi, '#||')//Added By Sachin
          }
          let identityPoof = this.kycAddress3.isIdentityProofValid();
          if (!identityPoof) {
            this.addel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let identyProofXmlData = this.kycAddress3.identyProofXmlData
          identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin

          console.log(identyProofXmlData)
          let smsFacility = this.kycContactDetails3.canAllowSmsFacility()
          if (!smsFacility) {
            this.isSpining = false;
            return;
          }

          if (this.kycContMob3) {
            if (this.kycContactDetails3.form.value.relation == null) {
              this.isSpining = false;
              this.notif.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycAddContMob3) {
            if (this.kycContactDetails3.form.value.relation1 == null) {
              this.isSpining = false;
              this.notif.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContEmail3) {
            if (this.kycContactDetails3.form.value.relation2 == null) {
              this.isSpining = false;
              this.notif.error("Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }
          if (this.kycContAddEmail3) {
            if (this.kycContactDetails3.form.value.relation3 == null) {
              this.isSpining = false;
              this.notif.error("Additional Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
              return
            }
          }

          let isIpvValid = this.kycContactDetails3.isAddressAndIpvDeclarationValid()
          if (!isIpvValid) {
            this.contactel.nativeElement.scrollIntoView();
            this.isSpining = false
            return
          }
          let addressAndIpvXmlData = this.kycContactDetails3.addressAndIpvData
          addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin

          console.log(addressAndIpvXmlData)

          let uploadProofData = this.kycProofUpload3.checkUploads()
          if (uploadProofData['status'] != true) {
            this.isSpining = false
            return
          }
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          let imageXmlData = jsonxml(jsond);
          console.log(imageXmlData)
          this.notif.remove()
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Pan: PAN,
                Euser: this.currentUser.userCode,
                KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
                KycXML_PerAdd: currentPermantAddressXmlData,
                KycXML_CorresAdd: corresLocalAddressXmlData,
                KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
                KycXML_IdentityProof: identyProofXmlData,
                KycXML_TaxDetails: this.kycJurisdictionAddressData3 ? this.kycJurisdictionAddressData3 : '',
                KycXML_ContactDetails: addressAndIpvXmlData,
                KYCXML_ImageDetails: imageXmlData || '',
                ClientSerialNo: this.clientSerialNumber,
                AutoSave: 'N',
                Flag: this.clientProfileEdit ? 'P' : 'A'

              }],
            "requestId": "5061",
            "outTblCount": "0"
          }).then((response) => {
            if (response.errorCode == 0) {
              let details = response.results[0][0]
              if (details.ErrorCode == 0) {
                this.notif.success(details.Msg, '', { nzDuration: 60000 });

                this.cmServ.activeTabIndex.next(2);
                this.cmServ.trigerFinancial.next(true)
              }
              else {
                this.notif.error(details.Msg, '', { nzDuration: 60000 })
              }
              this.isSpining = false
            }
            else {
              this.notif.error(response.errorMsg, '')
            }
          })

        }

      }
      else {
        this.el.nativeElement.scrollIntoView();
        this.subscriptions.forEach(ele => {
          ele.unsubscribe()
        })
        this.previewImageData = []
        this.cmServ.activeTabIndex.next(2);
        this.cmServ.trigerFinancial.next(true)
        this.el.nativeElement.scrollIntoView();

      }

    }
    //if  only one holder
    else {

      this.isSpining = true

      let isValid = this.validServ.validateForm(this.kycPersnalDetails1.form, this.FormControlNames, this.customValidationMsgObj.PersonalDetails);
      if (!isValid) {
        this.el.nativeElement.scrollIntoView();
        this.isSpining = false
        return
      }
      let PAN = this.kycPersnalDetails1.form.value.pan;
      let data = []
      let obj = {
        Agency: this.kycPersnalDetails1.Agency
      }
      let tdata = { ...this.kycPersnalDetails1.form.value, ...obj }
      data.push(tdata)
      var JSONData1 = this.utilServ.setJSONArray(data);
      this.KYCPersonalDetailsXmlData = jsonxml(JSONData1);
      this.KYCPersonalDetailsXmlData = this.KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin

      console.log(this.KYCPersonalDetailsXmlData)
      let isAddressValid = this.kycAddress1.isAddressValid();
      if (!isAddressValid) {
        this.addel.nativeElement.scrollIntoView();
        this.isSpining = false

        return
      }
      let currentPermantAddressXmlData = this.kycAddress1.currentPermantAddressXmlData
      currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let AdditionalcorresLocalAddressXmlData = this.kycAddress1.AdditionalcorresLocalAddressXmlData
      AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let corresLocalAddressXmlData = this.kycAddress1.corresLocalAddressXmlData
      corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      if (this.kycAddress1.isJudisdiction == true) {
        var jurisdictionsAddressXmlData = this.kycAddress1.jurisdictionsAddressXmlData
        jurisdictionsAddressXmlData = jurisdictionsAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

        // console.log(a, b, c,d)
      }
      let identityPoof = this.kycAddress1.isIdentityProofValid();
      if (!identityPoof) {
        this.addel.nativeElement.scrollIntoView();
        this.isSpining = false

        return
      }
      let identyProofXmlData = this.kycAddress1.identyProofXmlData
      identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin

      console.log(identyProofXmlData)

      let smsFacility = this.kycContactDetails1.canAllowSmsFacility()
      if (!smsFacility) {
        this.isSpining = false;
        return;
      }

      if (this.kycContMob1) {
        if (this.kycContactDetails1.form.value.relation == null) {
          this.isSpining = false;
          this.notif.error("Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycAddContMob1) {
        if (this.kycContactDetails1.form.value.relation1 == null) {
          this.isSpining = false;
          this.notif.error("Additional Mobile number already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycContEmail1) {
        if (this.kycContactDetails1.form.value.relation2 == null) {
          this.isSpining = false;
          this.notif.error("Email already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }
      if (this.kycContAddEmail1) {
        if (this.kycContactDetails1.form.value.relation3 == null) {
          this.isSpining = false;
          this.notif.error("Additional Email  already Exists,Specify relationship.", '', { nzDuration: 60000 })
          return
        }
      }



      let isIpvValid = this.kycContactDetails1.isAddressAndIpvDeclarationValid()
      if (!isIpvValid) {
        this.contactel.nativeElement.scrollIntoView();
        this.isSpining = false

        return
      }
      let addressAndIpvXmlData = this.kycContactDetails1.addressAndIpvData
      addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin

      console.log(addressAndIpvXmlData)


      let uploadProofData = this.kycProofUpload1.checkUploads()
      if (uploadProofData['status'] != true) {
        this.isSpining = false

        return
      }
      let proofOfupload = []
      proofOfupload.push(uploadProofData['data'])
      let jsond = this.utilServ.setJSONArray(proofOfupload);
      let imageXmlData = jsonxml(jsond);
      console.log(imageXmlData)
      this.notif.remove()
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: PAN,
            Euser: this.currentUser.userCode,
            KycXML_PersonalDetails: this.KYCPersonalDetailsXmlData,
            KycXML_PerAdd: currentPermantAddressXmlData,
            KycXML_CorresAdd: corresLocalAddressXmlData,
            KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
            KycXML_IdentityProof: identyProofXmlData,
            KycXML_TaxDetails: jurisdictionsAddressXmlData ? jurisdictionsAddressXmlData : '',
            KycXML_ContactDetails: addressAndIpvXmlData,
            KYCXML_ImageDetails: imageXmlData || '',
            ClientSerialNo: this.clientSerialNumber,
            AutoSave: 'N',
            Flag: this.clientProfileEdit ? 'P' : 'A'

          }],
        "requestId": "5061",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          let details = response.results[0][0]
          if (details.ErrorCode == 0) {
            this.previewImageData = []
            this.cmServ.activeTabIndex.next(2);
            this.cmServ.trigerFinancial.next(true)
            this.subscriptions.forEach(ele => {
              ele.unsubscribe()
            })
            this.notif.success(details.Msg, '', { nzDuration: 60000 });

          }
          else {
            this.notif.error(details.Msg, '', { nzDuration: 60000 })
          }
          this.isSpining = false
        }
        else {
          this.isSpining = false
          this.notif.error(response.errorMsg, '')
        }
      })
    }
  }
  saveToTemprary() {

    if (this.indTabs.length > 1) {
      // if (this.activeTabIndex < this.indTabs.length) {
      if (this.activeTabIndex == 0) {
        let PAN = this.kycPersnalDetails1.form.value.pan;
        let data = []
        let obj = {
          Agency: this.kycPersnalDetails1.Agency
        }
        let tdata = { ...this.kycPersnalDetails1.form.value, ...obj }
        data.push(tdata)
        var JSONData1 = this.utilServ.setJSONArray(data);
        let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
        KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycAddress1.addressTempSave();
        let currentPermantAddressXmlData = this.kycAddress1.currentPermantAddressXmlData
        currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        let AdditionalcorresLocalAddressXmlData = this.kycAddress1.AdditionalcorresLocalAddressXmlData
        AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin

        let corresLocalAddressXmlData = this.kycAddress1.corresLocalAddressXmlData
        corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        if (this.kycAddress1.isJudisdiction == true) {
          this.kycJurisdictionAddressData1 = this.kycAddress1.jurisdictionsAddressXmlData
          this.kycJurisdictionAddressData1 = this.kycJurisdictionAddressData1.replace(/&/gi, '#||')//Added By Sachin
        }

        this.kycAddress1.identityTempsave();
        let identyProofXmlData = this.kycAddress1.identyProofXmlData
        identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycContactDetails1.AddressAndIpvDeclaratioTempSave()
        let addressAndIpvXmlData = this.kycContactDetails1.addressAndIpvData
        addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
        let imageXmlData = ''
        let uploadProofData = this.kycProofUpload1.uploadTempSave()
        if (uploadProofData['status'] == true) {
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          imageXmlData = jsonxml(jsond);
        }

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: PAN,
              Euser: this.currentUser.userCode,
              KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
              KycXML_PerAdd: currentPermantAddressXmlData,
              KycXML_CorresAdd: corresLocalAddressXmlData,
              KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
              KycXML_IdentityProof: identyProofXmlData,
              KycXML_TaxDetails: this.kycJurisdictionAddressData1 ? this.kycJurisdictionAddressData1 : '',
              KycXML_ContactDetails: addressAndIpvXmlData,
              KYCXML_ImageDetails: imageXmlData,
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'Y',
            }],
          "requestId": "5061",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // this.notif.success(details.Msg, '',{nzDuration: 60000 });
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          }
          else {
            this.notif.error(response.errorMsg, '')
          }
        })
      }
      if (this.activeTabIndex == 1) {
        let PAN = this.kycPersnalDetails2.form.value.pan;
        let data = []
        let obj = {
          Agency: this.kycPersnalDetails2.Agency
        }
        let tdata = { ...this.kycPersnalDetails2.form.value, ...obj }
        data.push(tdata)

        var JSONData1 = this.utilServ.setJSONArray(data);
        let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
        KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycAddress2.addressTempSave();
        let currentPermantAddressXmlData = this.kycAddress2.currentPermantAddressXmlData
        currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        let AdditionalcorresLocalAddressXmlData = this.kycAddress2.AdditionalcorresLocalAddressXmlData
        AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        let corresLocalAddressXmlData = this.kycAddress2.corresLocalAddressXmlData
        corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        if (this.kycAddress2.isJudisdiction == true) {
          this.kycJurisdictionAddressData2 = this.kycAddress2.jurisdictionsAddressXmlData
          this.kycJurisdictionAddressData2 = this.kycJurisdictionAddressData2.replace(/&/gi, '#||')//Added By Sachin
        }
        this.kycAddress2.identityTempsave();
        let identyProofXmlData = this.kycAddress2.identyProofXmlData
        identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycContactDetails2.AddressAndIpvDeclaratioTempSave()
        let addressAndIpvXmlData = this.kycContactDetails2.addressAndIpvData

        addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
        let uploadProofData = this.kycProofUpload2.uploadTempSave()
        let imageXmlData = ''

        if (uploadProofData['status'] == true) {
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          imageXmlData = jsonxml(jsond);
        }

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: PAN,
              Euser: this.currentUser.userCode,
              KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
              KycXML_PerAdd: currentPermantAddressXmlData,
              KycXML_CorresAdd: corresLocalAddressXmlData,
              KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
              KycXML_IdentityProof: identyProofXmlData,
              KycXML_TaxDetails: this.kycJurisdictionAddressData2 ? this.kycJurisdictionAddressData2 : '',
              KycXML_ContactDetails: addressAndIpvXmlData,
              KYCXML_ImageDetails: imageXmlData,
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'Y',
            }],
          "requestId": "5061",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // // this.notif.success(details.Msg, '',{nzDuration:60000 });
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          }
          else {
            this.notif.error(response.errorMsg, '')
          }
        })

      }
      if (this.activeTabIndex == 2) {
        let PAN = this.kycPersnalDetails3.form.value.pan;

        let data = []
        let obj = {
          Agency: this.kycPersnalDetails3.Agency
        }
        let tdata = { ...this.kycPersnalDetails3.form.value, ...obj }
        data.push(tdata)
        var JSONData1 = this.utilServ.setJSONArray(data);
        let KYCPersonalDetailsXmlData = jsonxml(JSONData1);

        KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycAddress3.addressTempSave();
        let currentPermantAddressXmlData = this.kycAddress3.currentPermantAddressXmlData
        currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By sachin

        let AdditionalcorresLocalAddressXmlData = this.kycAddress3.AdditionalcorresLocalAddressXmlData
        AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        let corresLocalAddressXmlData = this.kycAddress3.corresLocalAddressXmlData
        corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        if (this.kycAddress3.isJudisdiction == true) {
          this.kycJurisdictionAddressData3 = this.kycAddress3.jurisdictionsAddressXmlData
          this.kycJurisdictionAddressData3 = this.kycJurisdictionAddressData3.replace(/&/gi, '#||')//added by sachin
        }
        this.kycAddress3.identityTempsave();
        let identyProofXmlData = this.kycAddress3.identyProofXmlData
        identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
        this.kycContactDetails3.AddressAndIpvDeclaratioTempSave()
        let addressAndIpvXmlData = this.kycContactDetails3.addressAndIpvData
        addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
        let imageXmlData = ''
        let uploadProofData = this.kycProofUpload3.uploadTempSave()
        if (uploadProofData['status'] == true) {
          let proofOfupload = []
          proofOfupload.push(uploadProofData['data'])
          let jsond = this.utilServ.setJSONArray(proofOfupload);
          imageXmlData = jsonxml(jsond);
        }

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: PAN,
              Euser: this.currentUser.userCode,
              KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
              KycXML_PerAdd: currentPermantAddressXmlData,
              KycXML_CorresAdd: corresLocalAddressXmlData,
              KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
              KycXML_IdentityProof: identyProofXmlData,
              KycXML_TaxDetails: this.kycJurisdictionAddressData3 ? this.kycJurisdictionAddressData3 : '',
              KycXML_ContactDetails: addressAndIpvXmlData,
              KYCXML_ImageDetails: imageXmlData,
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'Y',
            }],
          "requestId": "5061",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // this.notif.success(details.Msg, '',{nzDuration: 60000 });
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          }
          else {
            this.notif.error(response.errorMsg, '')
          }

        })

      }
      // this.activeTabIndex++;
      // }
      // else {
      //   this.el.nativeElement.scrollIntoView();
      //   this.cmServ.activeTabIndex.next(2);
      //   this.cmServ.trigerFinancial.next(true)

      // }


    }
    //if  only one holder
    else {
      let PAN = this.kycPersnalDetails1.form.value.pan;
      let data = []
      let obj = {
        Agency: this.kycPersnalDetails1.Agency
      }
      let tdata = { ...this.kycPersnalDetails1.form.value, ...obj }
      data.push(tdata)
      var JSONData1 = this.utilServ.setJSONArray(data);
      let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
      KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
      this.kycAddress1.addressTempSave();
      let currentPermantAddressXmlData = this.kycAddress1.currentPermantAddressXmlData
      currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let AdditionalcorresLocalAddressXmlData = this.kycAddress1.AdditionalcorresLocalAddressXmlData
      AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let corresLocalAddressXmlData = this.kycAddress1.corresLocalAddressXmlData
      corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      if (this.kycAddress1.isJudisdiction == true) {
        this.kycJurisdictionAddressData1 = this.kycAddress1.jurisdictionsAddressXmlData
        this.kycJurisdictionAddressData1 = this.kycJurisdictionAddressData1.replace(/&/gi, '#||')//Added By Sachin
      }
      this.kycAddress1.identityTempsave();
      let identyProofXmlData = this.kycAddress1.identyProofXmlData
      identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin

      this.kycContactDetails1.AddressAndIpvDeclaratioTempSave()
      let addressAndIpvXmlData = this.kycContactDetails1.addressAndIpvData
      addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
      // let uploadProofData = this.kycProofUpload1.uploadTempSave()
      // if (uploadProofData['status'] != true) {
      //   return
      // }
      let imageXmlData = ''
      let uploadProofData = this.kycProofUpload1.uploadTempSave()
      if (uploadProofData['status'] == true) {
        let proofOfupload = []
        proofOfupload.push(uploadProofData['data'])
        let jsond = this.utilServ.setJSONArray(proofOfupload);
        imageXmlData = jsonxml(jsond);
      }

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: PAN,
            Euser: this.currentUser.userCode,
            KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
            KycXML_PerAdd: currentPermantAddressXmlData,
            KycXML_CorresAdd: corresLocalAddressXmlData,
            KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
            KycXML_IdentityProof: identyProofXmlData,
            KycXML_TaxDetails: this.kycJurisdictionAddressData1 ? this.kycJurisdictionAddressData1 : '',
            KycXML_ContactDetails: addressAndIpvXmlData,
            KYCXML_ImageDetails: imageXmlData,
            ClientSerialNo: this.clientSerialNumber,
            AutoSave: 'Y',

          }],
        "requestId": "5061",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          let details = response.results[0][0]
          if (details.ErrorCode == 0) {
            // this.notif.success(details.Msg, '',{nzDuration: 60000 });

          }
          else {
            // this.notif.error(details.Msg, '',{nzDuration: 60000 })
          }
        }
        else {
          this.notif.error(response.errorMsg, '')
        }
      })
    }
  }


  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to save these changes?',
      nzContent: 'When clicked the OK button, Data will be saved to draft. ',
      nzOnOk: () => {
        if (this.clientType == "individual")
          this.saveToTemprary()
        else
          this.nonIndividualNext()
      }
    });
  }
  back() {
    this.previewImageData = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    this.cmServ.activeTabIndex.next(0);
  }
  next1() {
    this.previewImageData = []
    this.el.nativeElement.scrollIntoView();
    this.cmServ.activeTabIndex.next(2);
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    this.cmServ.trigerFinancial.next(true)
  }
  nonIndividualNext() {
    let i = this.activeTabIndex;
    if (this.activeTabIndex < this.tabs.length - 1) {
      console.log(this.nonIndPersonaldetails[i])

      let isValid = this.validServ.validateForm(this.nonIndPersonaldetails[i].form, this.FormControlNames);
      if (!isValid) {
        this.el.nativeElement.scrollIntoView();
        return
      }
      let PAN = this.nonIndPersonaldetails[i].form.value.pan;
      let data = []
      data.push(this.nonIndPersonaldetails[i].form.value)
      var JSONData1 = this.utilServ.setJSONArray(data);
      let KYCPersonalDetailsXmlData = jsonxml(JSONData1);
      KYCPersonalDetailsXmlData = KYCPersonalDetailsXmlData.replace(/&/gi, '#||')//Added By Sachin
      console.log(KYCPersonalDetailsXmlData)
      let isAddressValid = this.nonIndAddress[i].isAddressValid();
      if (!isAddressValid) {
        this.addel.nativeElement.scrollIntoView();
        return
      }
      let currentPermantAddressXmlData = this.nonIndAddress[i].currentPermantAddressXmlData
      currentPermantAddressXmlData = currentPermantAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let AdditionalcorresLocalAddressXmlData = this.nonIndAddress[i].AdditionalcorresLocalAddressXmlData
      AdditionalcorresLocalAddressXmlData = AdditionalcorresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      let corresLocalAddressXmlData = this.nonIndAddress[i].corresLocalAddressXmlData
      corresLocalAddressXmlData = corresLocalAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
      if (this.nonIndAddress[i].isJudisdiction == true) {
        var jurisdictionsAddressXmlData = this.nonIndAddress[i].jurisdictionsAddressXmlData
        jurisdictionsAddressXmlData = jurisdictionsAddressXmlData.replace(/&/gi, '#||')//Added By Sachin
        // console.log(a, b, c,d)
        console.log(currentPermantAddressXmlData)
        console.log(AdditionalcorresLocalAddressXmlData)

      }
      let identityPoof = this.nonIndAddress[i].isIdentityProofValid();
      if (!identityPoof) {
        this.addel.nativeElement.scrollIntoView();
        return
      }
      let identyProofXmlData = this.nonIndAddress[i].identyProofXmlData
      identyProofXmlData = identyProofXmlData.replace(/&/gi, '#||')//Added By Sachin
      console.log(identyProofXmlData)

      let uploadProofData = this.nonIndProofUpload[i].checkUploads()
      if (uploadProofData['status'] != true) {
        return
      }
      let proofOfupload = []
      proofOfupload.push(uploadProofData['data'])
      let jsond = this.utilServ.setJSONArray(proofOfupload);
      let imageXmlData = jsonxml(jsond);
      console.log(imageXmlData)

      let isIpvValid = this.nonIndContactDetails[i].isAddressAndIpvDeclarationValid()
      if (!isIpvValid) {
        this.contactel.nativeElement.scrollIntoView();
        return
      }
      let addressAndIpvXmlData = this.nonIndContactDetails[i].addressAndIpvData
      addressAndIpvXmlData = addressAndIpvXmlData.replace(/&/gi, '#||')//Added By Sachin
      console.log(addressAndIpvXmlData)

      let isKYCCompanyValid = this.validServ.validateForm(this.kycCompBasic[i].form, this.FormControlNames);
      if (!isKYCCompanyValid) {
        this.kycel.nativeElement.scrollIntoView();
        return
      }
      let data11 = []
      data.push(this.kycCompBasic[i].form.value)
      var JSONData = this.utilServ.setJSONArray(data11);
      let KYCCompanyXmlData = jsonxml(JSONData);
      console.log(KYCCompanyXmlData)

      let ikycCompContactDetails = this.validServ.validateForm(this.kycCompContactDetails[i].form, this.FormControlNames);
      if (!ikycCompContactDetails) {
        this.kycel.nativeElement.scrollIntoView();
        return
      }
      let kycContdata = []
      data.push(this.kycCompContactDetails[i].form.value)
      var kycContJSONData = this.utilServ.setJSONArray(kycContdata);
      let kycCompContactDetailsXML = jsonxml(kycContJSONData);
      console.log(kycCompContactDetailsXML)

      let KYCAddDetails = this.kycCompAdd[i].getCompanyAddData()
      if (!KYCAddDetails.status) {
        return
      }
      let KYCData = KYCAddDetails.data
      console.log(KYCData)

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: PAN,
            Euser: this.currentUser.userCode,
            KycXML_PersonalDetails: KYCPersonalDetailsXmlData,
            KycXML_PerAdd: currentPermantAddressXmlData,
            KycXML_CorresAdd: corresLocalAddressXmlData,
            KycXML_AdditionalCorresAdd: AdditionalcorresLocalAddressXmlData,
            KycXML_IdentityProof: identyProofXmlData,
            KycXML_TaxDetails: jurisdictionsAddressXmlData ? jurisdictionsAddressXmlData : '',
            KycXML_ContactDetails: addressAndIpvXmlData,
            KYCXML_ImageDetails: imageXmlData || '',
            ClientSerialNo: this.clientSerialNumber,
            AutoSave: 'N',
          }],
        "requestId": "5061",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {

        }
        else {
          this.notif.error(response.errorMsg, '')
        }
      })
      this.activeTabIndex++
    }
    else {
      this.cmServ.activeTabIndex.next(2);
      this.subscriptions.forEach(ele => {
        ele.unsubscribe()
      })
      this.cmServ.trigerFinancial.next(true)
    }

  }

  // @HostListener('window:keydown',['$event'])

  // onKeyPress($event: KeyboardEvent) { 
  //   this.cmServ.lastActivateTabIndex.subscribe(val=>{
  //     this.currTabIndex=val;
  //   })

  //   setTimeout(() => {
  //   if(this.currTabIndex==1){
  //     if($event.altKey && $event.key === 's')
  //        this.saveToTemprary()
  //     if($event.ctrlKey  && $event.key === 's'){
  //        $event.preventDefault();
  //        $event.stopPropagation();
  //        this.continueNext()
  //     }
  //   }
  // }, 500);

  // }
}
