import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustodianmasterComponent } from './custodianmaster/custodianmaster.component';
import { SharedModule } from 'shared';
import { FormGroup, FormBuilder, Validators, RequiredValidator, AbstractControl } from '@angular/forms';

@NgModule({
  declarations: [CustodianmasterComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [CustodianmasterComponent],
})
export class CustodianMasterModule { }
