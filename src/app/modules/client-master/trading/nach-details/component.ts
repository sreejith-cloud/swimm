import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns } from 'shared';
import { ClientMasterService } from '../../client-master.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'trading-natch-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class NatchDetailsComponent implements OnInit {

  form: FormGroup;
  inputMasks = InputMasks;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  nachFrequency: any=[];
  nachType: any=[];
  nachBanksArray: any=[];
  today=new Date();

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
    this.form=fb.group({
      DebitmandatefromNACH:[false],
      NACHtype:[null],
      EffectiveForm:[null],
      EffectiveTo:[null],
      Amount:[null],
      Frequency:[null],
      ECSserialNo:[null],
      termsAndcondRate:[null],
      NACHBank:[null],
      NACHtermsAndcond:[null],
    })
  }

  ngOnInit() {
    this.cmServ.nachFrequency.subscribe(val=>{
      this.nachFrequency=val
    })
    this.cmServ.nachType.subscribe(val=>{
      this.nachType=val
    })
    this.cmServ.nachBanks.subscribe(val=>{
      this.nachBanksArray=val;
    })
  }
  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
}
