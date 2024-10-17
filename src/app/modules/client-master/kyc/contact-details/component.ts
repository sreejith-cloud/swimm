import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService,UtilService,DataService } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import { ClientMasterService } from '../../client-master.service';
import {IPVComponent} from '../ipv/component'
import * as  jsonxml from 'jsontoxml'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { KYCvalidataions} from '../kycValidationConfig'
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'kyc-contact-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class ContactDetailsComponent implements OnInit {
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;

  form: FormGroup;
  @ViewChild(IPVComponent) IPVComponent:IPVComponent
  FormControlNames: any={};
  addressAndIpvData: any;
  relationArray: any;
  countrycode: any=[];
  isdCodeArray: any=[];
  disableKrarelatedFields: boolean=false;
  today=new Date();
  customValidationMsgObj=KYCvalidataions
  timeout=null;

  constructor(
    private validServ: ValidationService,
    private fb: FormBuilder,
    private utilServ: UtilService,
    private dataServ: DataService,
    private cmServ: ClientMasterService,private notif: NzNotificationService
  ) {
    this.form = fb.group({
      telephoneOff: [null],
      telephoneRes: [null],
      fax: [null],
      smsFacility: [false],
      mobile: [null],
      isdCode: [null],
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
      AddisdCode: [null],
      addEmail: [null],
      relation3: [null],
      existingClient3: [null],
      existingPan3: [null],
      dateOfDeclaration:[null,[Validators.required]],
      placeOfDeclaration:[null,[Validators.required]]
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
    this.cmServ.kycInitialFillingData.subscribe(val=>{
      if(val.length){
        this.relationArray=val[8]
        this.countrycode=val[10]
        this.form.controls.isdCode.patchValue('091')
        this.form.controls.AddisdCode.patchValue('091')
      }
    })

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       Loc:''
    //     }],
    //   "requestId": "5052",
    //   "outTblCount": "0"
    // }).then((response) => {debugger
    // if(response.results){

    //   console.log(response.results)
    //   this.relationArray=response.results[8]
    //   this.countrycode=response.results[10]
    //   this.form.controls.isdCode.patchValue('091')
    //   this.form.controls.AddisdCode.patchValue('091')
    // }
    // })
    this.form.controls.isdCode.valueChanges.subscribe(val=>{
      if(val!=null){
      // let data=val.toUpperCase();
     if(this.countrycode.length){
       this.isdCodeArray= this.countrycode.filter(ele=>{
          return (ele["ISD_Code"].includes(val))
        })
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if(this.form.value.isdCode !='091' && this.form.value.smsFacility){
          this.notif.remove()
          this.notif.error("SMS facility is available only in India", '', { nzDuration: 60000 })
        }
      },300)
    }
    })

    this.form.controls.mobile.valueChanges.subscribe(val=>{
      if(val==null|| val==''){
        if(this.form.value.smsFacility){
        if(this.form.value.mobile==null ||this.form.value.mobile.length<10){
          this.notif.remove()
          this.notif.error("Please enter valid mobile number", '', { nzDuration: 60000 })
          return
        }
      }
    }
 
    })

    this.cmServ.disableKraFields.subscribe(val=>{
this.disableKrarelatedFields=val
    })
    this.form.controls.AddisdCode.valueChanges.subscribe(val=>{
      if(val!=null){
      // let data=val.toUpperCase();
     if(this.countrycode.length){
       this.isdCodeArray= this.countrycode.filter(ele=>{
          return (ele["ISD_Code"].includes(val))
        })
      }
    }
    })
  }


  isAddressAndIpvDeclarationValid(){
    let isIpvValid=this.validServ.validateForm(this.IPVComponent.form,this.FormControlNames,this.customValidationMsgObj.IPVDetails)
    if(isIpvValid){
      if(this.form.value.smsFacility==true){
        if(this.form.value.mobile==null ||this.form.value.mobile.length<10){
          this.notif.remove()
          this.notif.error("Please enter valid mobile number in contact details", '', { nzDuration: 60000 })
          return false
        }
      if(this.form.value.isdCode !='091'){
        this.notif.remove()
        this.notif.error("SMS facility is available only in India", '', { nzDuration: 60000 })
          return false
      }
 
    }
      let declaration = this.validServ.validateForm(this.form,this.FormControlNames,this.customValidationMsgObj.ContactDetails);
    
      if(declaration){
        let data: any = []
        let totalData = { ...this.form.value,...this.IPVComponent.form.value}
        data.push(totalData)
        var JSONData = this.utilServ.setJSONArray(data);
        this.addressAndIpvData = jsonxml(JSONData);
        return true
       }
       return false
    }
    return false
  }



AddressAndIpvDeclaratioTempSave(){
  // let isIpvValid=this.validServ.validateForm(this.IPVComponent.form,this.FormControlNames)
  // if(isIpvValid){
  //   let declaration = this.validServ.validateForm(this.form,this.FormControlNames);
  //   if(declaration){
      let data: any = []
      let totalData = { ...this.form.value,...this.IPVComponent.form.value}
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
canAllowSmsFacility(){
  // if(this.form.value.isdCode==null || this.form.value.mobile==null){
  //   return 
  // }
  let data=this.form.value.smsFacility;
  if(data){
    if(this.form.value.mobile==null ||this.form.value.mobile.length<10){
      this.notif.remove()
      this.notif.error("Please enter valid mobile number to avail SMS facility in contact details", '', { nzDuration: 60000 })
      return false
    }

    else if(this.form.value.isdCode !='091'){
      this.notif.remove()
      this.notif.error("Please enter India's ISD Code to avail SMS facility in contact details", '', { nzDuration: 60000 })
      return false
    }
    else{
      return true
    }
  }
  else{
    this.notif.remove()
    return true
  }
}
}
