import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzNotificationService } from 'ng-zorro-antd';
import { DataService } from 'shared';

@Component({
  selector: 'trading-agreement-status',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class AgreementStatusComponent implements OnInit,AfterViewInit {
  timeout=null;

  form: FormGroup;
  clientType:string;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  RAccpayoutsetArray: any[];
  isFoSelected: boolean=false;
  generalDetails: any;
  isNRE: boolean;
  kycReceivedType: any=[];
  isCOMSelected: boolean;
  today=new Date();

  constructor(
    private fb: FormBuilder,  private dataServ: DataService,
    private ngZone: NgZone,
    private cmServ: ClientMasterService,private notif: NzNotificationService
  ) {
    this.form=fb.group({
      POA:[null,[Validators.required]],
      // date:[null],
      runningAc:[null],
      ECNVarifiedBy:[null],
      ECNVarifiedName:[null],
      ECNVarifiedDate:[null],
      RunningAccpayoutsettlementtype:[null],
      kycRecievedType:[null,[Validators.required]],
      WSPdeclaration:['NO',[Validators.required]],
      WSPdate:[null],
      FAOexposureagainstholdingagreement:[null,[Validators.required]],
      NROUndertaking:[null],
      NREUndertaking:[null],
    })
  }

  ngOnInit() {
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.form.controls.WSPdeclaration.valueChanges.subscribe(val=>{
      if(val=='YES'){
        this.form.controls.WSPdate.setValidators(Validators.required)
        this.form.controls.WSPdate.updateValueAndValidity()
      }
      else{
        this.form.controls.WSPdate.patchValue(null)
        this.form.controls.WSPdate.setValidators(null)
        this.form.controls.WSPdate.updateValueAndValidity()
      }
    })
    // this.cmServ.isFOselected.subscribe(val=>{
    //   if(val==true)
    //   this.form.controls.POA.patchValue(null)
    //   this.isFoSelected=val
    // })

    // this.form.controls.POA.valueChanges.subscribe(val=>{
    //   if(val=='YES'){
    //     this.form.controls.date.setValidators(Validators.required)
    //     this.form.controls.date.updateValueAndValidity()
    //   }
    //  else{
    //     this.form.controls.date.setValidators(null)
    //     this.form.controls.date.patchValue(null)
    //     this.form.controls.date.updateValueAndValidity()
    //   }
    // })
    this.cmServ.isCOMselected.subscribe(val=>{
      this.isCOMSelected=val
      if(val){
        this.form.controls.ECNVarifiedBy.setValidators(Validators.required)
        this.form.controls.ECNVarifiedName.setValidators(Validators.required)
        this.form.controls.ECNVarifiedDate.setValidators(Validators.required)
        this.form.controls.ECNVarifiedBy.updateValueAndValidity()
        this.form.controls.ECNVarifiedName.updateValueAndValidity()
        this.form.controls.ECNVarifiedDate.updateValueAndValidity()
      }
      else{
        this.form.controls.ECNVarifiedBy.patchValue(null)
        this.form.controls.ECNVarifiedName.patchValue(null)
        this.form.controls.ECNVarifiedDate.patchValue(null)

        this.form.controls.ECNVarifiedBy.setValidators(null)
        this.form.controls.ECNVarifiedName.setValidators(null)
        this.form.controls.ECNVarifiedDate.setValidators(null)

        this.form.controls.ECNVarifiedBy.updateValueAndValidity()
        this.form.controls.ECNVarifiedName.updateValueAndValidity()
        this.form.controls.ECNVarifiedDate.updateValueAndValidity()
      }

    })
    this.cmServ.kycReceivedType.subscribe(val=>{
      this.kycReceivedType=val
    })
    this.form.controls.runningAc.valueChanges.subscribe(val=>{
     if(val=='YES'){
      this.form.controls.RunningAccpayoutsettlementtype.setValidators(Validators.required)
      this.form.controls.RunningAccpayoutsettlementtype.updateValueAndValidity()
     }else{
      this.form.controls.RunningAccpayoutsettlementtype.patchValue(null)
      this.form.controls.RunningAccpayoutsettlementtype.setValidators(null)
      this.form.controls.RunningAccpayoutsettlementtype.updateValueAndValidity()
     }
    }) 
    this.cmServ.RunningAccpayoutsettlementtype.subscribe((val) => {
      this.RAccpayoutsetArray = val;
    })
    this.cmServ.generalDetails.subscribe(val=>{
      console.log('agreement singned status',val)
      this.generalDetails=val
      if(this.generalDetails.AccType=="NRE"){
        this.form.controls.NREUndertaking.patchValue('YES')
        this.isNRE=true
        this.form.controls.runningAc.patchValue(null)
        this.form.controls.runningAc.setValidators(null)
        this.form.controls.runningAc.updateValueAndValidity()
      }
      else{
        // this.form.controls.runningAc.patchValue(null)
        // this.form.controls.RunningAccpayoutsettlementtype.patchValue(null)
        this.isNRE=false
        this.form.controls.runningAc.setValidators(Validators.required)
        this.form.controls.runningAc.updateValueAndValidity()
        
      }

      if(this.generalDetails.AccType=="NRO"||this.generalDetails.AccType=="NROCM"){
        this.form.controls.NROUndertaking.patchValue('YES')
      }
      // else{
      //   this.form.controls.NROUndertaking.patchValue(null)
      //   this.form.controls.NROUndertaking.patchValue(null)

      // }
      if(this.generalDetails.AccType=="CL"){
        this.form.controls.NROUndertaking.patchValue('NO')
        this.form.controls.NREUndertaking.patchValue('NO')
      }
    })
  }
  filldata(){
    this.form.controls.POA.patchValue(true)
  }
  ngAfterViewInit(){
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  
  getEmpDetails(val){
    let data=val.target.value
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

    if(data==''||data==null){
      this.form.controls.ECNVarifiedName.patchValue(null)
      this.form.controls.ECNVarifiedDate.patchValue(null)
      return
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EmpCode: data,
        }],
      "requestId": "7011"
    })
      .then((response) => {    
        if (response.results.length>0) {
          let details=response.results[0][0]
          this.form.controls.ECNVarifiedName.patchValue(details.EmpName)
          // this.form.controls.ECNVarifiedDate.patchValue(details.date)
        }
        else{
          this.form.controls.ECNVarifiedName.patchValue(null)
          this.form.controls.ECNVarifiedDate.patchValue(null)
        }
    })
          
  }, 100);
       }

}
