import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import { FindOptions, DataService } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
@Component({
  selector: 'kyc-ipv',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class IPVComponent implements OnInit {

  form: FormGroup;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  EmployeeFindopt: FindOptions;
  // Empcode:any;
  today=new Date();
  timeout=null;
  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
    private dataServ: DataService,
  ) { 
   this.form = fb.group({
     empCode: [null, [Validators.required]],
     empName: [null, [Validators.required]],
     empBranch: [null, [Validators.required]],
     empDesingation: [null, [Validators.required]],
     date: [null, [Validators.required]],
    });

    // this.EmployeeFindopt = {
    //   findType: 1001,
    //   codeColumn: 'Empcode',
    //   codeLabel: 'Empcode',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    // }
  }

  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    
    return differenceInCalendarDays(current, this.today) > 0;
  };

  ngOnInit() {}

//   ss(data){
//  if(data==null)
//    return
//     this.form.controls.empDesingation.patchValue(data.Designation)
//     this.form.controls.empBranch.patchValue(data.Location)
//     this.form.controls.empCode.patchValue(data.Empcode)
//     this.form.controls.empName.patchValue(data.Empname)
//    }

   getEmpDetails(val){
let data=val.target.value;
if(data==''||data==null){
  this.form.controls.empDesingation.patchValue(null)
  this.form.controls.empBranch.patchValue(null)
  this.form.controls.empName.patchValue(null)
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
    console.log(response)
    if (response.results.length>0) {
     let details=response.results[0][0]
      this.form.controls.empDesingation.patchValue(details.Designation)
      this.form.controls.empBranch.patchValue(details.Branch)
      this.form.controls.empName.patchValue(details.EmpName)
    }
    else{
      this.form.controls.empDesingation.patchValue(null)
  this.form.controls.empBranch.patchValue(null)
  this.form.controls.empName.patchValue(null)
    }
})
   }

   charrestrict(val) {
    var key = val.key
    var pattern = /[&<>]+$/;
    if (key.match(pattern)) {
      return false
    }
  }
}

