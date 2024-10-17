import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DcnactivationreportComponent } from './dcnactivationreport/dcnactivationreport.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [DcnactivationreportComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[DcnactivationreportComponent],
})
export class DcnactivationModule { }
