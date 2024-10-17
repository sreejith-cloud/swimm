import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import { ThemeService } from 'ng2-charts';
import { InputMasks, InputPatterns, User, AuthService, DataService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'trading-additional-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class AdditionalDetailsComponent implements OnInit,AfterViewInit {
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;

  form: FormGroup;
  currentUser: User;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  generalDetails: any;
  comoditySelected: boolean;
  HolderDetails: any;
  IP: any;
  emailNotEditable: boolean;
  myurl: any;

  constructor(
    private fb: FormBuilder,
    private authServ: AuthService,
    private dataServ: DataService,
    private cmServ: ClientMasterService,private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    })
    this.form=fb.group({
      electronicContractNote:[null,[Validators.required]],
      emailIdforECN:[null],
      wishtoAvailInternetTrading:[null,[Validators.required]],
      AlertstoInvestorsbystockExchanges:[null,[Validators.required]],
      PriorExperience:[null,[Validators.required]],
      Yearsincapitalmarksheet:[null],
      Yearsincommodities:[null],
    })
  }
  ngOnInit() {
    
    this.cmServ.generalDetails.subscribe(val=>{
      this.generalDetails=val;
      if(this.generalDetails.Email==null || this.generalDetails.Email==""){
        this.form.controls.electronicContractNote.patchValue('NO');
        this.form.controls.emailIdforECN.setValue(null);
        this.form.controls.wishtoAvailInternetTrading.patchValue('NO')
        this.form.controls.AlertstoInvestorsbystockExchanges.patchValue('notrequied')
        console.log("Electronic contract",this.generalDetails.Email)
      }
      else{
        this.emailNotEditable=true;
        this.form.controls.electronicContractNote.patchValue('YES')
      }
    })

    this.dataServ.getIp().then((response: any) => {
    this.IP= response.IP;
    });

    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })

    this.form.controls.electronicContractNote.valueChanges.subscribe(val=>{
      if(val=='YES'){
        if(this.generalDetails.Email){
          this.form.controls.emailIdforECN.setValue(this.generalDetails.Email)
        }
        // this.emailNotEditable=true;
        this.form.controls.emailIdforECN.setValidators(Validators.required)
        this.form.controls.emailIdforECN.updateValueAndValidity()
      }
      else{
        // this.emailNotEditable=false;
        this.form.controls.emailIdforECN.setValue(null)
        this.form.controls.emailIdforECN.setValidators(null)
        this.form.controls.emailIdforECN.updateValueAndValidity()
        this.form.controls.wishtoAvailInternetTrading.patchValue('NO')

      }
    })
    this.cmServ.isCOMselected.subscribe(val=>{
      this.comoditySelected=val
    })
    // this.form.controls.wishtoAvailInternetTrading.valueChanges.subscribe(val=>{
    //   if(val=='YES'){
    //     if(this.form.value.electronicContractNote =='YES' && this.form.value.emailIdforECN!=null && this.form.value.emailIdforECN.match('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$')){
    //       this.notif.remove()
    //     }
    //     else{
    //       this.notif.error("Please enter valid email Id For ECN to avail internet trading ",'',{nzDuration:60000})
    //     }
    //   }

    // })
  }
  ngAfterViewInit(){
    this.Retrieve()
  }
  comodityprofile(){
let url=this.myurl+this.HolderDetails.FirstHolderpanNumber+"&SessionId=&Euser="+this.currentUser.userCode+"&timestamp=13:31:33&IPAddress="+this.IP+"&Project=BO&ClientType=CL"
      window.open(url)
  }
  Retrieve() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
        }],
      "requestId": "5030",
    }).then((response) => {

      if (response.results && response.results.length) {
      let commodities = response.results[0];
        this.myurl = commodities[0].Default_Project

      }
    });
  }
}
