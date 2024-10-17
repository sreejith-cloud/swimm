import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FranchisestaffdetailsreportComponent } from './franchisestaffdetails-report.component';
import { SharedModule } from 'shared';

@NgModule({
  
  imports: [
    SharedModule
  ],

  declarations: [FranchisestaffdetailsreportComponent],
    providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [FranchisestaffdetailsreportComponent],
})
export class FranchiseReportModule { }
