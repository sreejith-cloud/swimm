import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusConversionReportComponent } from './status-conversion-report.component';
import { AcctOpeningrptModule } from '../AcctOpeningrpt/AcctOpeningrpt.module';
import { CRFDataService } from '../crf/CRF.service';

@NgModule({
  declarations: [StatusConversionReportComponent],
  imports: [
    CommonModule,AcctOpeningrptModule
  ],
  bootstrap: [StatusConversionReportComponent],
  providers:[CRFDataService]
})
export class StatusConversionReportModule { }
