import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns, DataService } from 'shared';
import { ClientMasterService } from '../../client-master.service';
import { ValidationService } from 'shared';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { NzNotificationService } from 'ng-zorro-antd';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
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
  citizenshipArray: any = [];
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
      ProceedType: ['AOF', [Validators.required]],
      changeKRA: ['NO', [Validators.required]],
      nametitle: null,
      namefirstName: null,
      namemiddleName: null,
      namelastName: null,
      MaidenNametitle: null,
      MaidenNamefirstName: null,
      MaidenNamemiddleName: null,
      MaidenNamelastName: null,
      fatherOrSpouse: [null, [Validators.required]],
      Fathertitle: null,
      FatherfirstName: null,
      FathermiddleName: null,
      FatherlastName: null,
      Mothertitle: ["Mrs"],
      MotherfirstName: null,
      MothermiddleName: null,
      MotherlastName: null,
      gender: [null, [Validators.required]],
      age: [null, [Validators.required]],
      isMinor: [false, [Validators.required]],
      isKRAVerified: [false, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      citizenship: [null, [Validators.required]],
      residentialStatus: [null, [Validators.required]],
      occupationType: ['PROFESSIONAL', [Validators.required]],
      otherOccupationValue: [null],
      pep: [null, [Validators.required]],
      riskCountry: [null],

      // nameInPan: [null, [Validators.required]],
      cin: [null],

    });
    this.cmServ.kycInitialFillingData.subscribe(val=>{
      if(val.length){
        this.isSpining=false
        this.pepArray = val[4]
        this.citizenshipArray = val[6]
        this.occupationArray = val[3]
        this.ResidentialStatusArray = val[7]
        let totalProofDetial = val[2]
        this.cmServ.proofKeys = totalProofDetial[2]
        this.addressTypeArray = val[11]
        this.form.controls.citizenship.patchValue("INDIA")
      }
      else{
        this.isSpining=true
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
    this.cmServ.clientType.subscribe(val=>{
      this.clientType=val
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
          this.form.controls.FatherfirstName.setValue(null)

        }
        else {
          this.form.controls.Fathertitle.setValue(null)
          this.form.controls.FatherfirstName.setValue(null)

        }
      })
      this.form.controls.changeKRA.valueChanges.subscribe(val => {
        let kra = this.form.value.isKRAVerified
        if (val == 'NO' && kra) {
          this.disableKraFields = true;
          this.cmServ.disableKraFields.next(true)
        }
        if (val == 'YES') {
          this.disableKraFields = false;
          this.cmServ.disableKraFields.next(false)
        }
      })

      this.form.controls.citizenship.valueChanges.subscribe(val => {
        if (val != null) {
          let data = val.toUpperCase();
          if (this.citizenshipArray.length) {
            this.resultArray = this.citizenshipArray.filter(ele => {
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
          if (this.citizenshipArray.length) {
            this.riskCountryresultArray = this.citizenshipArray.filter(ele => {
              return (ele["Country"].startsWith(data))
            })
          }
        }
        else {
          this.riskCountryresultArray = []
        }
      })

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
    else{
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
              this.form.controls.isKRAVerified.patchValue(true)
              let response = res['Response']
              console.log(response)
              this.form.controls.nametitle.setValue(response[0].APP_GEN == 'MALE' ? 'Mr' : 'Ms')
              // this.form.controls.namefirstName.patchValue(response[0].APP_NAME)
              this.form.controls.Fathertitle.patchValue('Mr')
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
            this.form.controls.ProceedType.patchValue('AOF')
            this.disableKraFields = false;
            this.cmServ.disableKraFields.next(false)
            this.cmServ.chooseAOF.next(true)

          }
        })

      }
      this.isSpining = false
    }
    else if (val == "AOF") {
      this.form.controls.gender.setValue(null)
      this.form.controls.maritalStatus.setValue(null)
      this.form.controls.FatherfirstName.patchValue(null)
      this.form.controls.Fathertitle.patchValue(null)
      this.form.controls.age.setValue(this.calculateAge(dt))
      this.cmServ.chooseAOF.next(true)
      this.isSpining = false
      // this.cmServ.kraAccountOpeiningFirstHolderData.next(null)
      this.disableKraFields = false;
      this.cmServ.disableKraFields.next(false)
      this.isServiceCallsAllow = true
    }
    else {
      this.isSpining = false
      // this.cmServ.kraAccountOpeiningFirstHolderData.next(null)
      this.disableKraFields = false;
      this.cmServ.disableKraFields.next(false)


    }

  }

  calculateAge(birthDate) {
    birthDate = new Date(birthDate);
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
  //     debugger
  //     console.clear()
  //     console.log(event)
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //   }
  // }
  loadPanDetails() {
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
    // this.isKRAVerified=false;
    this.dataServ.checkKRA(pan).then(res => {
      let error = res['Error']
      if (error[0].ErrorCode == 0) {
        let response1 = res['Response']
        console.log(response1)
        if (response1[0].Status == "Submitted" || response1[0].Status == "KRA Verified") {
          this.Agency = response1[0].Agency
          this.form.controls.ProceedType.patchValue('KRA')
          //  this.form.value.isKRAVerified=true
          // this.cmServ.getKRAdetails().then(res=>{
          //   let error=res['Error']
          //   if(error[0].ErrorCode==0){

          //   }
          //   else
          //     this.notif.error(error[0].ErrorMessage,'')
          // })
        }
        else {
          this.form.controls.changeKRA.patchValue('YES')
        }
        this.isLoadingPanDetails = false;
      }
      else {
        this.form.controls.changeKRA.patchValue('YES')
        this.isLoadingPanDetails = false;
        this.notif.error(error[0].ErrorMessage, '', { nzDuration: 60000 })
      }
    })

    // this.form.controls.ProceedType.setValue('AOF')
    // this.isKRAVerified = true;

  }
  charrestrict(val) {
    var key = val.key
    var pattern = /[a-zA-Z0-9\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }
}
