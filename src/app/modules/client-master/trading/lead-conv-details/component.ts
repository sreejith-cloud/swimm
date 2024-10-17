import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import { FindOptions, DataService } from 'shared';

@Component({
  selector: 'trading-lead-conv-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class LeadConvDetailsComponent implements OnInit {
  Empcode:any;
  Empcode1:any;
  form: FormGroup;
  EmployeeFindopt: FindOptions;
  EmployeeFindopt1: FindOptions;
  timeout=null;

  constructor(
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
    private dataServ: DataService,

  ) {
    this.form=fb.group({
      leadConverterCode:[null],
      leadConverterID:[null],
      leadConverterName:[null],
      Relativeofgeojit:[null,[Validators.required]],
      EmployeeCode:[null,[Validators.required]],
      EmployeeName:[null,[Validators.required]],
    })

    
    this.EmployeeFindopt = {
      findType: 1001,
      codeColumn: 'Empcode',
      codeLabel: 'Empcode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
      // whereClause: "R.ReportingState ='" + data.ReportingState + "'"
    }
    this.EmployeeFindopt1 = {
      findType: 1001,
      codeColumn: 'Empcode',
      codeLabel: 'Empcode',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
      // whereClause: "R.ReportingState ='" + data.ReportingState + "'"
    }


  }

  ngOnInit() {
    this.form.controls.Relativeofgeojit.valueChanges.subscribe(val=>{
      if(val=='YES'){
        this.form.controls.EmployeeCode.setValidators([Validators.required])
        this.form.controls.EmployeeName.setValidators([Validators.required])
        this.form.controls["EmployeeName"].updateValueAndValidity();
        this.form.controls["EmployeeCode"].updateValueAndValidity();
      }
      else{
        this.form.controls.EmployeeCode.setValidators(null)
        this.form.controls.EmployeeName.setValidators(null)
        this.form.controls["EmployeeName"].updateValueAndValidity();
        this.form.controls["EmployeeCode"].updateValueAndValidity();
      }
    })
  }



       

          getEmpDetails(val){
            let data=val.target.value
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {

            if(data==''||data==null){
              this.form.controls.leadConverterName.patchValue(null)
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
                if (response.results.length>0) {
                  let details=response.results[0][0]
                  this.form.controls.leadConverterName.patchValue(details.EmpName)
                }
                else{
                  this.form.controls.leadConverterName.patchValue(null)
                }
            })
                  
          }, 100);
               }

               getEmpDetails11(val){
                 let data=val.target.value
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                if(data==''||data==null){
                  this.form.controls.EmployeeName.patchValue(null)
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
                    if (response.results.length>0) {
                      let details=response.results[0][0]
                      this.form.controls.EmployeeName.patchValue(details.EmpName)
                    }
                    else{
                      this.form.controls.EmployeeName.patchValue(null)
                    }
                })
              }, 100);
                   }
}
