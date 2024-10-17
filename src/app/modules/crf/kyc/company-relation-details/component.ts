import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../../../client-master/client-master.service';

// import { ClientMasterService } from '../../client-master.service';

@Component({
  selector: 'kyc-company-relation-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CompanyRelationDetailsComponent implements OnInit {

  form: FormGroup;
  rowCount: number = 1;
  rows: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
  }

  updateRows() {
    if (!isNaN(this.rowCount) && this.rowCount > 0)
      this.rows = Array(this.rowCount);
  }

}
