import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService, UtilService, DataService } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
// import { ClientMasterService } from '../../client-master.service';
import { IPVComponent } from '../ipv/component'
import * as  jsonxml from 'jsontoxml'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { KYCvalidataions } from '../kycValidationConfig'
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ClientMasterService } from '../../client-master.service';
import { FinancialsComponent } from '../../financials/financials.component';
import { CRFDataService } from '../../CRF.service';
import { KycService } from '../kyc.service';



@Component({
  selector: 'kyc-contact-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class ContactDetailsComponent implements OnInit {
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;

  form: FormGroup;
  @ViewChild(IPVComponent) IPVComponent: IPVComponent
  @ViewChild(FinancialsComponent) financials: FinancialsComponent
  FormControlNames: any = {};
  addressAndIpvData: any;
  relationArray: any;
  countrycode: any = [];
  isdCodeArray: any = [];
  disableKrarelatedFields: boolean = false;
  today = new Date();
  customValidationMsgObj = KYCvalidataions
  timeout = null;
  addressAndIpvDataOBJ: any;
  NRI: boolean;
  max1: any = 10;
  min1: any = 10;
  PAN: any;
  derivativeStatus: boolean
  applicationStatus: any;

  emailVerifiedStatus: boolean;
  mobileVerifiedStatus: boolean;
  emailOrMobileVerifiedStatus: boolean = true;
  PANNO: any;
  MobileUsedStatus: boolean;
  emailUsedStatus: boolean;

  constructor(
    private validServ: ValidationService,
    private fb: FormBuilder,
    private utilServ: UtilService,
    private dataServ: DataService,
    private cmServ: ClientMasterService,
    private notif: NzNotificationService,
    private crfServ: CRFDataService,
    private kycServ: KycService,
    private modalService: NzModalService
  ) {
    this.crfServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })

    this.crfServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
    })

    this.form = fb.group({
      telephoneOffice: [null],
      telephoneResidence: [null],
      fax: [null],
      smsFacility: [null],
      mobile: [null],
      isdCodeMobile: [null],
      relation: [null],
      existingClient: [null],
      existingPan: [null],
      additionalMblNo: [null],
      relation1: [null],
      existingClient1: [null],
      existingPan1: [null],
      email: [null],
      relation2: [null],
      existingClient2: [null],
      existingPan2: [null],
      isdCodeAdditionMobile: [null],
      addEmail: [null],
      relation3: [null],
      existingClient3: [null],
      existingPan3: [null],
      overseasMobile: [null],
      dateOfDeclaration: [null],
      placeOfDeclaration: [null],
      derivativeSegment: [null],
      nomobileFlag: [null],
      noemailFlag: [null]
    });

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


  ngOnInit() {
    this.cmServ.kycInitialFillingData.subscribe(val => {
      if (val.length) {
        this.relationArray = val[8]
        this.countrycode = val[10]
      }
    })

    this.cmServ.isNRE.subscribe(val => {
      this.NRI = val
      // var isd = this.form.controls.isdCodeMobile.value
      // var smsFacility = this.form.controls.smsFacility.value
      if (!this.NRI) {
        this.form.controls.isdCodeMobile.patchValue('091')
        // if(!smsFacility)
        this.form.controls.smsFacility.setValue(true);
      }
    })

    this.cmServ.PAN.subscribe(val => {
      this.PAN = val
    });
    this.cmServ.derivativeStatus.subscribe(val => {
      this.derivativeStatus = val
    });

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       Loc:''
    //     }],
    //   "requestId": "5052",
    //   "outTblCount": "0"
    // }).then((response) => {
    // if(response.results){

    //   console.log(response.results)
    //   this.relationArray=response.results[8]
    //   this.countrycode=response.results[10]
    //   this.form.controls.isdCodeMobile.patchValue('091')
    //   this.form.controls.isdCodeAdditionalMobile.patchValue('091')
    // }
    // })
    this.form.controls.isdCodeMobile.valueChanges.subscribe(val => {
      if (val != null) {
        if (val != '091') {
          this.min1 = 3
          this.max1 = 16
        }
        else {
          this.min1 = 10
          this.max1 = 10
        }
        // let data=val.toUpperCase();
        if (this.countrycode.length) {
          this.isdCodeArray = this.countrycode.filter(ele => {
            return (ele["ISD_Code"].includes(val))
          })
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (this.form.value.isdCodeMobile != '091' && this.form.value.smsFacility) {
            this.notif.remove()
            this.notif.error("SMS facility is available only in India", '', { nzDuration: 6000 })
            this.form.controls.smsFacility.setValue(false)
          }
        }, 300)
      }
    })

    this.form.controls.mobile.valueChanges.subscribe(val => {
      if (val == null || val == '') {
        if (this.form.value.smsFacility) {
          if (this.form.value.mobile == null || this.form.value.mobile.length < 10) {
            this.notif.remove()
            this.notif.error("Please enter valid mobile number", '', { nzDuration: 60000 })
            return
          }
        }
      }
      if (!this.NRI && val && val.length == 10) {
        this.form.controls.isdCodeMobile.patchValue('091')
      }
    })

    // this.form.controls.derivativeSegment.valueChanges.subscribe(val => {
    //   if (val == true) {
    //     this.cmServ.isderivativeSegment.next(true)
    //   }
    //   else {
    //     this.cmServ.isderivativeSegment.next(false)
    //   }
    // })

    this.cmServ.disableKraFields.subscribe(val => {
      this.disableKrarelatedFields = val
    })
    this.form.controls.isdCodeAdditionMobile.valueChanges.subscribe(val => {
      if (val != null) {
        // let data=val.toUpperCase();
        if (this.countrycode.length) {
          this.isdCodeArray = this.countrycode.filter(ele => {
            return (ele["ISD_Code"].includes(val))
          })
        }
      }
    })

    this.form.controls.existingPan.valueChanges.subscribe(val => {
      if (val != null) {
        if (this.PAN == val) {
          this.form.controls.relation.patchValue('Self')
        }
      }
    });
    this.form.controls.existingPan2.valueChanges.subscribe(val => {
      if (val != null) {
        if (this.PAN == val) {
          this.form.controls.relation2.patchValue('Self')
        }
      }
    });
    this.IPVComponent.form.controls.date.valueChanges.subscribe(val => {
      if (val != null && this.form.controls.dateOfDeclaration.value == null) {
        this.form.controls.dateOfDeclaration.patchValue(val)
      }
    });
  }


  isAddressAndIpvDeclarationValid(action) {
    let isIpvValid: boolean = true
    if (action == 'savefinalise') {
      isIpvValid = this.validServ.validateForm(this.IPVComponent.form, this.FormControlNames, this.customValidationMsgObj.IPVDetails)

      if (isIpvValid) {
        if (this.form.value.dateOfDeclaration == null || this.form.value.dateOfDeclaration == undefined || this.form.value.dateOfDeclaration == '') {
          this.notif.remove()
          this.notif.error("Please enter Date Of Declaration", '', { nzDuration: 60000 })
          return false
        }
        if (this.form.value.placeOfDeclaration == null || this.form.value.placeOfDeclaration == undefined || this.form.value.placeOfDeclaration == '') {
          this.notif.remove()
          this.notif.error("Please enter Place Of Declaration", '', { nzDuration: 60000 })
          return false
        }
      }
      else {
        return false
      }
    }

    if (this.form.value.smsFacility == true) {
      if (this.form.value.mobile == null || this.form.value.mobile.length < 10) {
        this.notif.remove()
        this.notif.error("Please enter valid mobile number in contact details", '', { nzDuration: 60000 })
        return false
      }
      if (this.form.value.isdCodeMobile != '091') {
        this.notif.remove()
        this.notif.error("SMS facility is available only in India", '', { nzDuration: 60000 })
        this.form.controls.smsFacility.patchValue(false)
        return false
      }

    }
    let declaration = this.validServ.validateForm(this.form, this.FormControlNames, this.customValidationMsgObj.ContactDetails);
    if (this.form.value.mobile) {
      if (this.form.value.mobile.length > 0) {
        if (this.form.value.mobile.length < this.min1 || this.form.value.mobile.length > this.max1) {
          this.notif.remove()
          this.notif.error("Please enter valid Mobile number", '', { nzDuration: 6000 })
          return false
        }
      }
    }
    if (declaration) {
      let data: any = []
      let totalData = { ...this.form.value, ...this.IPVComponent.form.value }
      this.addressAndIpvDataOBJ = totalData
      data.push(totalData)
      var JSONData = this.utilServ.setJSONArray(data);
      this.addressAndIpvData = jsonxml(JSONData);
      return true
    }
    return false
  }



  AddressAndIpvDeclaratioTempSave() {
    // let isIpvValid=this.validServ.validateForm(this.IPVComponent.form,this.FormControlNames)
    // if(isIpvValid){
    //   let declaration = this.validServ.validateForm(this.form,this.FormControlNames);
    //   if(declaration){
    let data: any = []
    let totalData = { ...this.form.value, ...this.IPVComponent.form.value }
    this.addressAndIpvDataOBJ = totalData
    data.push(totalData)
    var JSONData = this.utilServ.setJSONArray(data);
    this.addressAndIpvData = jsonxml(JSONData);
    //       return true
    //      }
    //      return false
    //   }
    //   return false
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };

  charrestrict(val) {
    var key = val.key
    var pattern = /[&<>]+$/;
    if (key.match(pattern)) {
      return false
    }
  }
  canAllowSmsFacility() {
    // if(this.form.value.isdCodeMobile==null || this.form.value.mobile==null){
    //   return 
    // }
    let data = this.form.value.smsFacility;
    if (data) {
      if (this.form.value.mobile == null || this.form.value.mobile.length < 10) {
        this.notif.remove()
        this.notif.error("Please enter valid mobile number to avail SMS facility in contact details", '', { nzDuration: 60000 })
        return false
      }

      else if (this.form.value.isdCodeMobile != '091') {
        this.notif.remove()
        this.notif.error("Please enter India's ISD Code to avail SMS facility in contact details", '', { nzDuration: 60000 })
        return false
      }
      else {
        return true
      }
    }
    else {
      this.notif.remove()
      return true
    }
  }

  verifyEmailOrMobile(countryCode: any = null) {
    return new Promise<boolean>((resolve, reject) => {
      let nrewithDiffCountryCode = countryCode && countryCode != '091' && this.NRI;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            PAN: this.PANNO ? this.PANNO : '',
            Mobile: nrewithDiffCountryCode ? '' : this.form.value.mobile ? this.form.value.mobile : '',
            Email: this.form.value.email || '',
            EntryType: '',
            Flag: 'Y'
          }],
        "requestId": "800217",
        "outTblCount": "0"
      }).then((response: any) => {
        if (response && response.errorCode == 0) {
          this.mobileVerifiedStatus = response.results[0][0] ? response.results[0][0].MobileVerifiedStatus : false;
          this.emailVerifiedStatus = response.results[1][0] ? response.results[1][0].EmailVerifiedStatus : false;
          this.MobileUsedStatus = this.getMobileUsedStatus(response);
          this.emailUsedStatus = this.getEmailUsedStatus(response);
          let errorMessage = this.getResponseMsg(response);

          if (((this.mobileVerifiedStatus) && (this.emailVerifiedStatus) && (this.MobileUsedStatus) && (this.emailUsedStatus))
          || (nrewithDiffCountryCode && this.emailVerifiedStatus)) {
            this.emailOrMobileVerifiedStatus = true;
            resolve(true)
          }
          else {
            if (!this.MobileUsedStatus || !this.emailUsedStatus) {
              this.modalService.error({
                nzTitle: 'Save Failed',
                nzContent: errorMessage
              });
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
            if (!this.mobileVerifiedStatus && this.form.value.mobile) {
              console.log("mobile");
              this.modalService.error({
                nzTitle: 'Warning',
                nzContent: 'Mobile Verification pending. Please Verify.'
              });
              this.form.patchValue({
                mobile: ''
              })
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
            if (!this.emailVerifiedStatus && this.form.value.email) {
              console.log("email");
              this.modalService.error({
                nzTitle: 'Warning',
                nzContent: 'Email Verification pending. Please Verify.'
              });
              this.form.patchValue({
                email: ''
              })
              this.emailOrMobileVerifiedStatus = false;
              resolve(this.emailOrMobileVerifiedStatus);
              return;
            }
          }
          resolve(this.emailOrMobileVerifiedStatus);
        }
        else {
          resolve(false);
        }
      }, (err) => {
        resolve(false)
      })
    })
  }

  getMobileUsedStatus(response: any) {
    if (response.results[2] && response.results[2][0] && response.results[2][0].errorMessage === 'T') {
      return true;
    }
    else if (response.results[2] && response.results[2][0].errorMessage != 'T' && (this.form.value.mobile)) {
      return false;
    }
    else if (this.mobileVerifiedStatus && !(this.form.value.mobile)) {
      return true;
    }
    else {
      return false;
    }
  }

  getEmailUsedStatus(response: any) {
    if (response.results[2] && response.results[2][0] && response.results[2][0].errorMessage === 'T') {
      return true;
    }
    else if (response.results[2] && response.results[2][0].errorMessage != 'T' && (this.form.value.email)) {
      return false;
    }
    else if (this.emailVerifiedStatus && !(this.form.value.email)) {
      return true;
    } else {
      return false;
    }
  }

  getResponseMsg(response: any) {
    if ((response.results[2]) && (response.results[2][0].errorCode != 0) && (response.results[2][0].errorMessage != 'T')) {
      return (response.results[2][0].errorMessage)
    }
    else if ((response.results[3]) && (response.results[3][0].errorCode != 0) && (response.results[3][0].errorMessage != 'T')) {
      return (response.results[3][0].errorMessage)
    } else {
      return ('Something Went Wrong! Please Try Again.')
    }
  }

  toggleSwitch() {
    var countrycode = this.form.controls.isdCodeMobile.value;
    if (countrycode == '091') {
      this.form.controls.smsFacility.setValue(true)
    }
  }

}
