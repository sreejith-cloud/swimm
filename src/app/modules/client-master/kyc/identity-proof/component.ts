import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../../client-master.service';
import { DataService,ValidationService } from 'shared';

@Component({
  selector: 'kyc-identity-proof',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class IdntityProofComponent implements OnInit,AfterViewInit {

  form: FormGroup;
  Validform: any;
  ProofDetials: any;
  totalProofDetial = [];
  controls: any;
  formFeilds: any=[];
  keys: any;
formControlName={}
  constructor(
    private dataServ: DataService,
    private fb: FormBuilder,
    private validServ: ValidationService,
    private cmServ: ClientMasterService,
    
  ) {
    this.form = fb.group({
      idProof: [null, [Validators.required]],
    })
  }
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         Loc:''
  //       }],
  //     "requestId": "5052",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //   if(response.results){
  //    this.ProofDetials=response.results[7]
  //   this.totalProofDetial=response.results[8]
  //   this.cmServ.keys=this.totalProofDetial[0]
  //   this.form.controls.idProof.patchValue(this.ProofDetials[0].Code)
  //   this.formFeilds=this.cmServ.getControls(this.totalProofDetial,this.ProofDetials[0].Code);
  //   }
  //   })
  //   this.form.controls.idProof.valueChanges.subscribe(res=>{
  //       this.formFeilds= this.cmServ.getControls(this.totalProofDetial,res)
  //   })
  //   this.cmServ.isIdentityProofLoaded.next(true)
    
  // }

  ngOnInit() {
   
  }
  ngAfterViewInit(){
  }
  
  // getData(){
  //     let result=this.cmServ.getProofOfDetialsData(this.formFeilds,"proof")
  //     return result
  // }

  // patchData(id,obj){
  //   setTimeout(() => {      
  //     this.formFeilds=this.cmServ.getControls(this.totalProofDetial,id);  
  //     let objKeys = Object.keys(obj);
  //     objKeys.shift()
  //     objKeys.forEach((o,i) => {
  //       this.form.controls.idProof.patchValue(id)
  //       if(obj[o]==null){
  //         return
  //       }
  //       else
  //       this.formFeilds[i][o]=obj[o];
  //     })
  //   },600)
  
   
  // }
  // patchData1(id,obj){
       
  //     this.formFeilds=this.cmServ.getControls(this.totalProofDetial,id);  
  //     this.form.controls.idProof.patchValue(id)
  //     // let objKeys = Object.keys(obj);
  //     // objKeys.forEach((o,i) => {
  //     //   if(obj[o]==null){
  //     //     return
  //     //   }
  //     //   else
  //     //   this.formFeilds[i][o]=obj[o];
  //     // })
  
  //     this.formFeilds=obj
  
   
  // }
  // ss(){
  //   this.form.controls.idProof.patchValue('03')

  // }
}