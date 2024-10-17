import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, ValidationService } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CRFDataService } from '../CRF.service';

@Component({
  selector: 'app-crfipv',
  templateUrl: './crfipv.component.html',
  styleUrls: ['./crfipv.component.less']
})
export class CrfipvComponent implements OnInit {
  @Input() Heading: string = 'Identity of account holder/ Authorized representative and original document verified by/ IPV done '
  
  formdisable: boolean = false;
  form: FormGroup;
  ipv: any;
  today = new Date();
  applicationStatus: any;

  constructor(
    private fb: FormBuilder,
    private dataServ: DataService,
    private validServ: ValidationService,
    private cmServ: CRFDataService,
  ) {
    this.form = fb.group({
      crfIPV: this.createIPV(),
    });
    this.ipv = this.form.controls.crfIPV

    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    });
  }

  ngOnInit() {
  }

  private createIPV() {
    return this.fb.group({
      empCode: [null],
      empName: [null],
      empBranch: [null],
      empDesingation: [null],
      date: [null],
    })
  }

  getEmpDetails(data) {
    if (data == '' || data == null) {
      this.ipv.controls.empDesingation.setValue(null)
      this.ipv.controls.empBranch.setValue(null)
      this.ipv.controls.empName.setValue(null)
      return
    }
    else {
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            EmpCode: data,
          }],
        "requestId": "7011"
      })
        .then((response) => {
          if (response.results.length > 0) {
            let details = response.results[0][0]
            this.ipv.controls.empDesingation.patchValue(details.Designation)
            this.ipv.controls.empBranch.setValue(details.Branch)
            this.ipv.controls.empName.setValue(details.EmpName)
          }
          else {
            this.ipv.controls.empDesingation.setValue(null)
            this.ipv.controls.empBranch.setValue(null)
            this.ipv.controls.empName.setValue(null)
          }
        })
    }
  }

  setIPVDetails(empCode, date,status) {debugger
    if (empCode == '' || empCode == null) {
      if (status == 'A' || status == 'R' || status == 'P' || status == 'F'){
        this.disableFields(status);
      }
      this.ipv.controls.empDesingation.setValue(null)
      this.ipv.controls.empBranch.setValue(null)
      this.ipv.controls.empName.setValue(null)
      this.ipv.controls.date.setValue(null)
      return
    }
    else {
      this.disableFields(status)
      this.ipv.controls.date.setValue(date);
      this.ipv.controls.empCode.setValue(empCode);
      this.getEmpDetails(empCode);
    }
  }

  disableFields(status) {
    if(status == 'A' || status == 'R' || status == 'P' || status == 'F'){
      this.ipv.controls.empCode.disable();
      this.ipv.controls.empDesingation.disable();
      this.ipv.controls.empBranch.disable();
      this.ipv.controls.empName.disable();
      this.ipv.controls.date.disable();
    }
  }
  enableEmp()
  {
    this.ipv.controls.empCode.enable();
    this.ipv.controls.date.enable();
  }
  disabledFutureDate = (current: Date): boolean => {
     return differenceInCalendarDays(current, this.today) > 0;
  };


}
