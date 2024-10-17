import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { AccountClosureApprovalComponent } from './accountclosureapproval.component';

@NgModule({
  declarations: [AccountClosureApprovalComponent],
  imports: [
    CommonModule, SharedModule
  ],
  bootstrap: [AccountClosureApprovalComponent],
})
export class AccountClosureApprovalModule { }