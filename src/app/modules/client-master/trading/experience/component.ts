import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'trading-experience',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class InvestmentTradingExperienceComponent implements OnInit {

  form: FormGroup;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
  }

}
