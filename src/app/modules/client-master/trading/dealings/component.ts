import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns } from 'shared';

import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'trading-dealings',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class DealingsComponent implements OnInit {
  inputMasks = InputMasks;

  form: FormGroup;

  Section1: boolean = true;
  Section2: boolean = true;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
    this.form=fb.group({
     
     
      subBroker:this.crateSubBroker(),
      stockBroker:this.crateStockBroker()
    })
  }

  ngOnInit() {
    // this.form.controls.hasSection1.valueChanges.subscribe(val=>{
    //     this.Section1=val;
    // })
    // this.form.controls.hasSection2.valueChanges.subscribe(val=>{
    //   this.Section2=val
    // })
  }
  crateSubBroker(){
    return this.fb.group({
      hasSection1:[false],
      subBokerName:[null,[Validators.required]],
      NSERegNO:[null,[Validators.required]],
      BSERegNO:[null,[Validators.required]],
      registeredOfficeAddress:[null,[Validators.required]],
      phoneNo:[null],
      website:[null],
    })
  }
  crateStockBroker(){
    return this.fb.group({
      hasSection2:[false],
      stockBroker:[null,[Validators.required]],
      ClientCode:[null,[Validators.required]],
      subBrokerName:[null,[Validators.required]],
      Exchange:[null,[Validators.required]],
      nameOfMember:[null,[Validators.required]],
      MenberClientCode:[null,[Validators.required]],
      details:[null,[Validators.required]],
    })
  }
}
