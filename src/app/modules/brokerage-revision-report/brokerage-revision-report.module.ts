import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerageRevisionReportComponent } from './brokerage-revision-report.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [BrokerageRevisionReportComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [BrokerageRevisionReportComponent],
})
export class BrokerageRevisionReportModule { }
