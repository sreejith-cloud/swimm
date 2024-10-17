import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalActivationKitReportComponent } from './physical-activation-kit-report.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [PhysicalActivationKitReportComponent],
  imports: [
    SharedModule,CommonModule
  ],
  bootstrap: [PhysicalActivationKitReportComponent],
})
export class PhysicalActivationKitReportModule { }
