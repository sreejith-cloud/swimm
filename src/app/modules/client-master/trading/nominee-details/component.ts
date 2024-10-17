import { Component, OnInit, NgZone, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns } from 'shared';
import { ClientMasterService } from '../../client-master.service';
import { ValidationService, UtilService, DataService } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
@Component({
  selector: 'trading-nominee-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class NomineeDetailsComponent implements OnInit {

  form: FormGroup;
  inputMasks = InputMasks;
  inputPatterns = InputPatterns
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  holderdetails: any;
  clientSerialNumber: number;
  identityProof: any = [];
  relationshipArray: any = [];
  age: number = 0;
  entryAccess: boolean = true;
  today = new Date()


  constructor(
    private fb: FormBuilder,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private ngZone: NgZone,
    private dataServ: DataService,
    private cmServ: ClientMasterService,
  ) {
    this.form = fb.group({
      isNominee:[false],
      NomineeTitle: [null, [Validators.required]],
      NomineeFirstName: [null, [Validators.required]],
      NomineeMiddleName: [null],
      NomineeLastName: [null],
      RelationshipWithNominee: [null, [Validators.required]],
      NomineehouseName: [null, [Validators.required]],
      NomineehouseNumber: [null,[Validators.required]],
      Nomineestreet: [null],
      NomineePIN: [null, [Validators.required]],
      NomineeCity: [null, [Validators.required]],
      NomineeState: [null, [Validators.required]],
      NomineeCountry: [null, [Validators.required]],
      NomineeMobile: [null],
      NomineeTelephoneNo: [null],
      NomineeEmailId: [null],
      NomineeID: [null, [Validators.required]],
      NomineeIdNumber: [null],
      // NomineePAN:[null],
      // NomineeAdhaar:[null],
      NomineeDOB: [null, [Validators.required]],
      GuardianTitle: [null],
      GuardianFirstName: [null],
      GuardianMiddleName: [null],
      GuardianLastName: [null],
      GuardianRelation: [null],
      GuardianhouseName: [null],
      GuardianhouseNumber: [null],
      Guardianstreet: [null],
      GuardianPIN: [null],
      GuardianCity: [null],
      GuardianState: [null],
      GuardianCountry: [null],
      GuardianMobile: [null],
      GuardianTelephoneNO: [null],
      GuardianEmailID: [null],
      GuardianId: [null],
      GuardianProofNumber: [null],
      // GuardianAdhaar:[null],

    })
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };

  ngOnInit() {
    this.cmServ.isEntryAccess.subscribe(val => {
      this.entryAccess = val
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      this.holderdetails = val
      // console.log(this.holderdetails);
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.cmServ.nomineeRelation.subscribe(val => {
      this.relationshipArray = val
    })
    this.cmServ.nomineeIdProof.subscribe(val => {
      this.identityProof = val
    })
    this.form.controls.GuardianId.valueChanges.subscribe(val => {
      this.form.controls.GuardianProofNumber.patchValue(null)
    })
    // this.form.controls.isNominee.valueChanges.subscribe(val=>{
      
    //   if(!val){
    //     this.form.reset();
    //     this.form.updateValueAndValidity()
    //   }
    // })
    // this.form.controls.NomineeAdhaar.valueChanges.subscribe(str=>{
    //   if(str!=null){
    //     str=str.replace(/\d(?=\d{4})/g, '*');
    //     // this.form.value.NomineeAdhaar=str
    //     this.form.controls["NomineeAdhaar"].enable();
    //     this.form.controls.NomineeAdhaar.patchValue(str)
    //   }
    // })
    this.form.controls.NomineeID.valueChanges.subscribe(val => {
      if (val == 'Photograph & Signature') {
        this.form.controls.NomineeIdNumber.setValidators(null)
        this.form.controls["NomineeIdNumber"].updateValueAndValidity();
      }
      else {
        this.form.controls.NomineeIdNumber.setValidators([Validators.required])
        this.form.controls["NomineeIdNumber"].updateValueAndValidity();
      }
      // if (val == 'PAN') {
      //   this.form.controls.NomineeIdNumber.setValidators([Validators.required])
      //   this.form.controls["NomineeIdNumber"].updateValueAndValidity();
      // }
      // else if (val == "Aadhaar") {
      //   this.form.controls.NomineeIdNumber.setValidators([Validators.required])
      //   this.form.controls["NomineeIdNumber"].updateValueAndValidity();
      // }
      // else {
      //   this.form.controls.NomineeIdNumber.setValidators(null)
      //   this.form.controls["NomineeIdNumber"].updateValueAndValidity();
      // }
    })
    this.form.controls.NomineeDOB.valueChanges.subscribe(val => {
      if (val == null) {
        this.age = null
        this.form.controls.GuardianTitle.setValidators(null)
        this.form.controls.GuardianFirstName.setValidators(null)
        this.form.controls.GuardianMiddleName.setValidators(null)
        this.form.controls.GuardianLastName.setValidators(null)
        this.form.controls.GuardianRelation.setValidators(null)
        this.form.controls.GuardianPIN.setValidators(null)
        this.form.controls.GuardianCity.setValidators(null)
        this.form.controls.GuardianhouseName.setValidators(null)
        this.form.controls.GuardianhouseNumber.setValidators(null)
        this.form.controls.GuardianState.setValidators(null)
        this.form.controls.GuardianCountry.setValidators(null)
        this.form.controls.GuardianMobile.setValidators(null)
        this.form.controls.GuardianTelephoneNO.setValidators(null)
        this.form.controls.GuardianEmailID.setValidators(null)
        this.form.controls.GuardianId.setValidators(null)
        this.form.controls.GuardianProofNumber.setValidators(null)

        this.form.controls.GuardianTitle.updateValueAndValidity();
        this.form.controls.GuardianFirstName.updateValueAndValidity();
        this.form.controls.GuardianMiddleName.updateValueAndValidity();
        this.form.controls.GuardianLastName.updateValueAndValidity();
        this.form.controls.GuardianRelation.updateValueAndValidity();
        this.form.controls.GuardianPIN.updateValueAndValidity();
        this.form.controls.GuardianCity.updateValueAndValidity();
        this.form.controls.GuardianhouseName.updateValueAndValidity();
        this.form.controls.GuardianhouseNumber.updateValueAndValidity();
        this.form.controls.GuardianState.updateValueAndValidity();
        this.form.controls.GuardianCountry.updateValueAndValidity();
        this.form.controls.GuardianMobile.updateValueAndValidity();
        this.form.controls.GuardianTelephoneNO.updateValueAndValidity();
        this.form.controls.GuardianEmailID.updateValueAndValidity();
        this.form.controls.GuardianId.updateValueAndValidity();
        // this.form.controls.GuardianId.updateValueAndValidity();
        this.form.controls.GuardianProofNumber.updateValueAndValidity();
        return
      }
      this.age = this.calculateAge(val)
      console.log(this.age)
      if (this.age < 18 && val != null) {
        this.form.controls.GuardianTitle.setValidators(Validators.required)
        this.form.controls.GuardianFirstName.setValidators(Validators.required)
        // this.form.controls.GuardianMiddleName.setValidators(Validators.required)
        // this.form.controls.GuardianLastName.setValidators(Validators.required)
        this.form.controls.GuardianRelation.setValidators(Validators.required)
        this.form.controls.GuardianhouseName.setValidators(Validators.required)
        this.form.controls.GuardianhouseNumber.setValidators(Validators.required)
        this.form.controls.GuardianPIN.setValidators(Validators.required)
        this.form.controls.GuardianCity.setValidators(Validators.required)
        // this.form.controls.GuardianhouseNumber.setValidators(Validators.required)
        this.form.controls.GuardianState.setValidators(Validators.required)
        this.form.controls.GuardianCountry.setValidators(Validators.required)
        // this.form.controls.GuardianMobile.setValidators(Validators.required)
        // this.form.controls.GuardianTelephoneNO.setValidators(Validators.required)
        // this.form.controls.GuardianEmailID.setValidators(Validators.required)
        this.form.controls.GuardianId.setValidators(Validators.required)
        this.form.controls.GuardianProofNumber.setValidators(Validators.required)
        
        
        this.form.controls.GuardianTitle.updateValueAndValidity();
        this.form.controls.GuardianFirstName.updateValueAndValidity();
        this.form.controls.GuardianMiddleName.updateValueAndValidity();
        this.form.controls.GuardianLastName.updateValueAndValidity();
        this.form.controls.GuardianRelation.updateValueAndValidity();
        this.form.controls.GuardianPIN.updateValueAndValidity();
        this.form.controls.GuardianCity.updateValueAndValidity();
        this.form.controls.GuardianhouseName.updateValueAndValidity();
        this.form.controls.GuardianhouseNumber.updateValueAndValidity();
        this.form.controls.GuardianState.updateValueAndValidity();
        this.form.controls.GuardianCountry.updateValueAndValidity();
        this.form.controls.GuardianMobile.updateValueAndValidity();
        this.form.controls.GuardianTelephoneNO.updateValueAndValidity();
        this.form.controls.GuardianEmailID.updateValueAndValidity();
        this.form.controls.GuardianId.updateValueAndValidity();
        this.form.controls.GuardianId.updateValueAndValidity();
        this.form.controls.GuardianProofNumber.updateValueAndValidity();
      }
      else {
        this.form.controls.GuardianTitle.setValidators(null)
        this.form.controls.GuardianFirstName.setValidators(null)
        this.form.controls.GuardianMiddleName.setValidators(null)
        this.form.controls.GuardianLastName.setValidators(null)
        this.form.controls.GuardianRelation.setValidators(null)
        this.form.controls.GuardianPIN.setValidators(null)
        this.form.controls.GuardianCity.setValidators(null)
        this.form.controls.GuardianhouseName.setValidators(null)
        this.form.controls.GuardianhouseNumber.setValidators(null)
        this.form.controls.GuardianhouseNumber.setValidators(null)
        this.form.controls.GuardianState.setValidators(null)
        this.form.controls.GuardianCountry.setValidators(null)
        this.form.controls.GuardianMobile.setValidators(null)
        this.form.controls.GuardianTelephoneNO.setValidators(null)
        this.form.controls.GuardianEmailID.setValidators(null)
        this.form.controls.GuardianId.setValidators(null)
        this.form.controls.GuardianProofNumber.setValidators(null)

        this.form.controls.GuardianTitle.updateValueAndValidity();
        this.form.controls.GuardianFirstName.updateValueAndValidity();
        this.form.controls.GuardianMiddleName.updateValueAndValidity();
        this.form.controls.GuardianLastName.updateValueAndValidity();
        this.form.controls.GuardianRelation.updateValueAndValidity();
        this.form.controls.GuardianPIN.updateValueAndValidity();
        this.form.controls.GuardianCity.updateValueAndValidity();
        this.form.controls.GuardianhouseName.updateValueAndValidity();
        this.form.controls.GuardianhouseNumber.updateValueAndValidity();
        this.form.controls.GuardianState.updateValueAndValidity();
        this.form.controls.GuardianCountry.updateValueAndValidity();
        this.form.controls.GuardianMobile.updateValueAndValidity();
        this.form.controls.GuardianTelephoneNO.updateValueAndValidity();
        this.form.controls.GuardianEmailID.updateValueAndValidity();
        this.form.controls.GuardianId.updateValueAndValidity();
        this.form.controls.GuardianId.updateValueAndValidity();
        this.form.controls.GuardianProofNumber.updateValueAndValidity();
      }
    })
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
  maskAdharNum(id, data) {
    debugger
    let str = data
    if (id == 'N')
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.form.controls.NomineeIdNumber.patchValue(str, { emitEvent: true })
      }

    if (id == 'G') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.form.controls.GuardianProofNumber.patchValue(str, { emitEvent: true })
      }
    }
  }
  getPinData(pin, type) {
    var data=pin.target.value
    if (data == null) {
      return
    }
    if (this.entryAccess == false) {
      return
    }
    if (data.length != 6) {
      if (type == "Nominee") {
        this.form.controls.NomineeState.setValue(null)
        this.form.controls.NomineeCountry.setValue(null)
        this.form.controls.NomineeCity.setValue(null)

      }
      if (type == "Guardian") {
        this.form.controls.GuardianState.setValue(null)
        this.form.controls.GuardianCountry.setValue(null)
        this.form.controls.GuardianCity.setValue(null)

      }
      return
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Pin": data,
        }],
      "requestId": "5037"
    })
      .then((response) => {
        if (response.results[0].length > 0) {
          let productList = response.results[0][0];
          if (type == "Nominee") {
            this.form.controls.NomineeState.setValue(productList.STATENAME)
            this.form.controls.NomineeCountry.setValue(productList.Country)
            this.form.controls.NomineeCity.setValue(productList.District)
          }
          if (type == "Guardian") {
            this.form.controls.GuardianState.setValue(productList.STATENAME)
            this.form.controls.GuardianCountry.setValue(productList.Country)
            this.form.controls.GuardianCity.setValue(productList.District)
          }
        }
      })
  }
  charrestrict(val) {
    var key = val.key
    var pattern = /[a-zA-Z0-9]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern)||key.match(pattern1)) {
      return true
    }
    else{
      return false
    }
  }
  ValidatePan(val) {
    debugger
    var charonly = /^[a-zA-Z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key
    if (val.target.selectionStart <= 4) {
      return charonly.test(text)

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      return false;
    }
  }
  numberOnly(val) {
    var fullstring = val.currentTarget.value
    if (fullstring.length < 12) {
      var paterns = /^[0-9]/
      return paterns.test(val.key);
    }
    else {
      return false
    }
  }
  clearid(id,val)
  {
    if(id=='N')
    {
      this.form.controls.NomineeIdNumber.patchValue(null);
    }
    if(id=='G')
    {
      this.form.controls.GuardianProofNumber.patchValue(null);
    }

  }

}