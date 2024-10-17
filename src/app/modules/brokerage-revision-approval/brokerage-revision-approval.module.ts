import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerageRevisionApprovalComponent } from './brokerage-revision-approval.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [BrokerageRevisionApprovalComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [BrokerageRevisionApprovalComponent],
})
export class BrokerageRevisionApprovalModule { }
