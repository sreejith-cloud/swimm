import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns, DataService } from 'shared';
import { ValidationService } from 'shared';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { NzNotificationService } from 'ng-zorro-antd';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { ClientMasterService } from '../../client-master.service';
// import { ClientMasterService } from '../../../client-master/client-master.service';
@Component({
  selector: 'kyc-personal-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class KYCPersonalDetailsComponent implements OnInit {
  disableKraFields: boolean = false
  inputMasks = InputMasks;
  isSpining: boolean = false;
  inputPatterns = InputPatterns;
  form: FormGroup;
  isShowOtherOccupation: boolean = false;
  @Input() holderNumber: string;
  isLoadingPanDetails: boolean = false;
  nameinpan: string = ''
  dateFormat = 'dd-MM-yyyy';
  FormControlNames: any = {};
  pepArray: any;
  Agency: string = null;
  nationalityArray: any = [];
  occupationArray: any;
  resultArray: any;
  ResidentialStatusArray: any;
  entryAccess: boolean = true;
  isServiceBlocked: boolean = false;
  today = new Date();
  riskCountryresultArray: any;
  addressTypeArray: any = [];
  isServiceCallsAllow: boolean;
  clientType: string;
  disableStatus: boolean = true;
  BOResStatus: any;
  merchantnavyStatus: boolean = false;
  applicationStatus: any;
  nameinpansit: any;

  constructor(
    private ngZone: NgZone,
    private validServ: ValidationService,
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
    private dataServ: DataService,
    private notif: NzNotificationService,
  ) { }


  ngOnInit() {

    this.form = this.fb.group({
      // location: [null, [Validators.required]],
      pan: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      nameinpansite: [null],
      ckyc: [null],
      ProceedType: [null],
      changeKRA: ['NO', [Validators.required]],
      nametitle: [null, [Validators.required]],
      namefirstName: [null, [Validators.required]],
      namemiddleName: null,
      namelastName: null,
      MaidenNametitle: null,
      MaidenNamefirstName: null,
      MaidenNamemiddleName: null,
      MaidenNamelastName: null,
      fatherOrSpouse: [null, [Validators.required]],
      Fathertitle: [null, [Validators.required]],
      FatherfirstName: [null, [Validators.required]],
      FathermiddleName: null,
      FatherlastName: null,
      Mothertitle: [null],
      MotherfirstName: null,
      MothermiddleName: null,
      MotherlastName: null,
      gender: [null, [Validators.required]],
      age: [null, [Validators.required]],
      isMinor: [false],
      isKRAVerified: [false, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      residentialStatus: [null, [Validators.required]],
      occupationType: [null],
      otherOccupationValue: [null],
      riskCountry: [null],
      // nameInPan: [null, [Validators.required]],
      cin: [null],
      // statusChanger: [false],
      merchantnavy: [null]

    });

    this.cmServ.kycInitialFillingData.subscribe(val => {
      if (val.length) {
        this.isSpining = false
        // this.pepArray = val[4]
        this.nationalityArray = val[6]
        this.occupationArray = val[3]
        this.ResidentialStatusArray = val[7]
        let totalProofDetial = val[2]
        this.cmServ.proofKeys = totalProofDetial[2]
        this.addressTypeArray = val[11]
        this.form.controls.nationality.patchValue("INDIA")
      }
      else {
        this.isSpining = true
      }
    })

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       Loc: ''
    //     }],
    //   "requestId": "5052",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results.length) {       

    //   }
    // })
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //      Flag:"Holder1",
    //      Pan:'abcd101011',

    //     }],
    //   "requestId": "5050",
    //   "outTblCount": "0"
    // }).then((response) => {
    // if(response.results){  
    //  console.log(response.results)
    //  let personalDetails=response.results[0][0]
    //  this.form.patchValue(personalDetails)
    //  let a=personalDetails.Fathertitle;
    // a= a.trim()
    //  console.log(a)
    //       this.form.controls.MaidenNametitle.setValue(a)
    // }
    // })

    this.cmServ.isEntryAccess.subscribe(val => {
      this.entryAccess = val
    })
    this.cmServ.clientType.subscribe(val => {
      this.clientType = val
    })
    this.cmServ.isServiceCallsAllow.subscribe(val => {
      this.isServiceCallsAllow = val
    })
    this.cmServ.isServiceBlocked.subscribe(val => {
      this.isServiceBlocked = val
    })
    this.cmServ.riskCountry.subscribe(val => {
      this.form.controls.riskCountry.setValue(val)
    })
    this.cmServ.defaultBOResStatus.subscribe(val => {
      this.BOResStatus = val
    })
    this.cmServ.merchantnavyStatus.subscribe(val => {
      this.merchantnavyStatus = val
    })

    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })

    this.ngZone.run(() => {

      this.form.controls.dob.valueChanges.subscribe(dt => {
        // let date=dt.getDate()+"-"+(dt.getMonth() + 1) +"-"+dt.getFullYear() 
        let age = this.calculateAge(dt)
        this.form.controls.age.setValue(age)
        if (age > 18) {
          this.form.controls.isMinor.setValue(false)
        }
        else {
          this.form.controls.isMinor.setValue(true)
        }
      })

      this.form.controls.fatherOrSpouse.valueChanges.subscribe(val => {
        if (val == 'F') {
          this.form.controls.Fathertitle.setValue("Mr")
        }
        else {
          if (this.form.controls.gender.value == 'M')
            this.form.controls.Fathertitle.setValue('Mrs')
          else
            this.form.controls.Fathertitle.setValue('Mr')
        }
      })

      this.form.controls.changeKRA.valueChanges.subscribe(val => {
        let kra = this.form.value.isKRAVerified
        let proceedtype = this.form.controls.ProceedType.value
        if (val == 'NO' && kra && proceedtype == 'KRA') {
          this.disableKraFields = true;
          this.cmServ.disableKraFields.next(true)
        }
        if (val == 'YES') {
          this.disableKraFields = false;
          this.cmServ.disableKraFields.next(false)
        }
      })

      this.form.controls.nationality.valueChanges.subscribe(val => {
        if (val != null) {
          let data = val.toUpperCase();
          if (this.nationalityArray.length) {
            this.resultArray = this.nationalityArray.filter(ele => {
              return (ele["Country"].startsWith(data))
            })
          }
        }
        else {
          this.resultArray = []
        }
      })

      this.form.controls.riskCountry.valueChanges.subscribe(val => {
        if (val != null) {
          let data = val.toUpperCase();
          if (this.nationalityArray.length) {
            this.riskCountryresultArray = this.nationalityArray.filter(ele => {
              return (ele["Country"].startsWith(data))
            })
          }
        }
        else {
          this.riskCountryresultArray = []
        }
      })

      this.form.controls.gender.valueChanges.subscribe(val => {
        this.form.controls.nametitle.setValue(val == 'M' ? 'Mr' : 'Ms')
      })

      this.form.controls.MotherfirstName.valueChanges.subscribe(val => {
        this.form.controls.Mothertitle.setValue((val == '' || val == null) ? null : 'Mrs')
      })

      // this.form.controls.statusChanger.valueChanges.subscribe(val => {
      //   if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
      //     val = null
      //   }
      //   if (val != null) {
      //     if (val) {
      //       this.form.controls.residentialStatus.enable();
      //     }
      //     else {
      //       this.form.controls.residentialStatus.disable();
      //       this.form.controls.residentialStatus.setValue(this.BOResStatus)
      //     }
      //   }
      // })

    })
    //   this.form.controls.ProceedType.valueChanges.subscribe(val=>{  
    // let pan=this.form.value.pan
    //  this.cmServ.chooseKRA.next(true)

    //   })
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };


  otherOccupationChoosen(val) {
    if (val == 'OTHER') {
      this.isShowOtherOccupation = true
      this.form.controls.otherOccupationValue.setValidators([Validators.required])
      this.form.controls.otherOccupationValue.updateValueAndValidity()
    }
    else {
      this.form.controls.otherOccupationValue.setValidators(null)
      this.form.controls.otherOccupationValue.updateValueAndValidity()
      this.isShowOtherOccupation = false
    }

  }
  ngAfterViewInit() {

  }
  fillKraDetials(val) {

    if (this.entryAccess == false) {
      return
    }
    this.isSpining = true
    let pan = this.form.value.pan
    let dt = this.form.value.dob
    if (typeof (dt) == 'string') {
      dt = new Date(dt)
    }

    if (val == 'KRA' && this.isServiceCallsAllow == true) {
      //   if(this.form.value.isKRAVerified==false){
      //     this.form.controls.isKRAVerified.patchValue(false)
      //    this.notif.warning('Please verify your KRA to continue','')
      //    this.isSpining=false

      //    return
      //  }
      if (dt == null) {
        this.notif.error("Date of Birth required", '', { nzDuration: 60000 })
        this.isSpining = false
        return
      }
      else {
        let date = dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear()
        let data: string = pan + "," + date + "," + this.Agency
        this.dataServ.getKRA(data).then(res => {
          let data = Object.keys(res)
          if (data.length == 2) {
            let error = res['Error']
            if (error[0].ErrorCode == 0) {
              if (error[0].ErrorMessage != '') {
                this.notif.error(error[0].ErrorMessage, '')
              }
              this.form.controls.isKRAVerified.patchValue(true)
              let response = res['Response']
              this.form.controls.nametitle.setValue(response[0].APP_GEN == 'MALE' ? 'Mr' : 'Ms')
              // this.form.controls.namefirstName.patchValue(response[0].APP_NAME)
              this.form.controls.namemiddleName.patchValue(null)
              this.form.controls.namelastName.patchValue(null)
              this.form.controls.FatherfirstName.patchValue(response[0].APP_F_NAME)
              let applicantName = response[0].APP_NAME
              let index = applicantName.lastIndexOf(" ");
              if (index >= 0) {
                let firstname = applicantName.substring(0, index)
                let lastname = applicantName.substring(index, applicantName.length)
                this.form.controls.namelastName.patchValue(lastname)
                this.form.controls.namefirstName.patchValue(firstname)
              }
              else {
                this.form.controls.namefirstName.patchValue(response[0].APP_NAME)
              }
              if (this.form.value.changeKRA == 'NO') {
                this.disableKraFields = true;
                this.cmServ.disableKraFields.next(true)
              }
              // this.form.controls.gender.setValue(response[0].APP_F_NAME)
              this.form.controls.maritalStatus.setValue(response[0].APP_MAR_STATUS == 'MARRIED' ? 'M' : response[0].APP_MAR_STATUS == 'SINGLE' ? 'S' : 'D')
              this.form.controls.gender.setValue(response[0].APP_GEN == 'MALE' ? 'M' : response[0].APP_GEN == 'FEMALE' ? 'F' : 'O')
              this.form.controls.age.setValue(this.calculateAge(dt))
              return;
            }
          }
          else {
            this.notif.error(res[0].ErrorMessage, '', { nzDuration: 60000 })
            this.form.controls.ProceedType.patchValue('BO')
            this.disableKraFields = false;
            this.cmServ.disableKraFields.next(false)
            this.cmServ.chooseAOF.next(true)
          }
        })
      }
      this.isSpining = false
    }
    else {
      this.isSpining = false
      // this.cmServ.kraAccountOpeiningFirstHolderData.next(null)
      this.disableKraFields = false;
      this.cmServ.disableKraFields.next(false)
    }
    if (this.nameinpansit && this.nameinpansit != '') {
      this.form.controls.nameinpansite.setValue(this.nameinpansit);
    }
  }
  calculateAge(birth) {
    let birthDate = new Date(this.form.controls.dob.value);
    let otherDate = new Date()
    var years = (otherDate.getFullYear() - birthDate.getFullYear());
    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }
    return years;
  }
  // validate(event){
  //   let val=event.target.value
  //   if(val.length>10){
  //     
  //     console.clear()
  //     console.log(event)
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //   }
  // }
  loadPanDetails() {debugger
    // this.form.controls.dob.patchValue('1992-12-12')

    if (this.entryAccess == false && this.isServiceBlocked) {
      return
    }
    this.isServiceCallsAllow = true;
    this.isLoadingPanDetails = true;
    let pan = this.form.value.pan
    let dt = this.form.value.dob
    if (dt == null) {
      this.notif.error("Date of Birth required", '', { nzDuration: 60000 })
      this.isLoadingPanDetails = false;
      return
    }
    if (pan.length == 10) {debugger
      var PanDetails = [];
      console.log("pan",PanDetails);
      
      this.dataServ.varifyPan(pan).
        then(result => {debugger
          PanDetails = result
          if (PanDetails && PanDetails.length > 0) {debugger
            console.log("pandetails",PanDetails);
            
            this.form.value.nameinpansite = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            if (this.form.value.nameinpansite && this.form.value.nameinpansite != '') {
              this.cmServ.nameinpansite.next(PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName)
              this.nameinpansit = PanDetails[0].FirstName + ' ' + PanDetails[0].MiddleName + ' ' + PanDetails[0].LastName
            }
          }
        })
    }

    // this.isKRAVerified=false; 
    this.dataServ.checkKRA(pan).then(res => {
      let error = res['Error']
      if (error[0].ErrorCode == 0) {
        let response1 = res['Response']
        if (response1[0].Agency != '') {
          this.Agency = response1[0].Agency;
          this.form.controls.ProceedType.patchValue('KRA');
          this.cmServ.proceedType.next('KRA');
        }
        else {
          this.form.controls.ProceedType.patchValue('BO');
          this.form.controls.changeKRA.patchValue('YES');
          this.cmServ.proceedType.next('BO');
        }
      }
      else {
        this.form.controls.ProceedType.patchValue('BO');
        this.form.controls.changeKRA.patchValue('YES');
        this.cmServ.proceedType.next('BO');
        this.isLoadingPanDetails = false;
      }
      this.isLoadingPanDetails = false;
    })

    // this.form.controls.ProceedType.setValue('AOF')
    // this.isKRAVerified = true;
    //Sac
    // this.form.controls.ProceedType.patchValue('BO');
    // this.form.controls.changeKRA.patchValue('YES');
    // this.cmServ.proceedType.next('BO');
    //Sac


  }
  charrestrict(val) {
    var key = val.key
    var pattern = /[a-zA-Z\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }




}
