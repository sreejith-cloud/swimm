import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'member-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class  memberDetailsComponent implements OnInit {

  form: FormGroup;
  clientType:string;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
   
    })
    this.form=this.fb.group({
      NameofStockExchange:[null],
      NameofClearingCorporation:[null],
      ClearingMemberID:[null],
      SEBIRegistrationNo:[null],
      TradeName:[null],
      CMBPID:[null],
      NameofCoparcenerorMember:[null],
      Gender:[null],
      DateofBirth:[null],
      RelationwithKartha:[null],
      WhetherCoparcenerorMember:[null],
    })
  }

}
