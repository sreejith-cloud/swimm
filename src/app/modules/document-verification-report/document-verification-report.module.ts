import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentVerificationReportComponent } from './document-verification-report.component';
import { SharedModule } from 'shared';
import { FindOptions } from "shared";

@NgModule({
  declarations: [DocumentVerificationReportComponent],
  imports: [
    SharedModule,
    
  ],
  bootstrap:[DocumentVerificationReportComponent]

})
export class DocumentVerificationReportModule { }
