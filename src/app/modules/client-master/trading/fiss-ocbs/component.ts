import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'fiss-ocbs-other',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class  fissAndOcbsComponent implements OnInit {

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
      Foreignaddress:[null,[Validators.required]],
      Country:[null,[Validators.required]],
      State:[null,[Validators.required]],
      city:[null,[Validators.required]],
      Pin:[null,[Validators.required]],
      SEBIRegistrationNo:[null,[Validators.required]],
      RBIReferencenumber:[null,[Validators.required]],
      RBIapprovaldate:[null,[Validators.required]],
    })
  }

}
