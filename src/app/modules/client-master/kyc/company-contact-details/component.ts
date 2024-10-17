import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'kyc-company-contact-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CompanyContactDetailsComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
    this.form=this.fb.group({
      TelephoneOffice:[null],
      TelephoneRes:[null],
      Mobile:[null],
      Relation:[null],
      ExistingClient:[null],
      ExistingPan:[null],
      Fax:[null],
      Email:[null],
    })
  }

}
