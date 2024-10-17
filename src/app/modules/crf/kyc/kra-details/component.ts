import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../../client-master.service';
// import { ClientMasterService } from '../../../client-master/client-master.service';


@Component({
  selector: 'kyc-kra-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class KRADetailsComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
  }

}
