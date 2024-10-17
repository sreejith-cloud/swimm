import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { DdpirejectionreportComponent } from './ddpirejectionreport.component';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [DdpirejectionreportComponent],

  bootstrap: [DdpirejectionreportComponent],
})
export class DdpirejectionreportModule { }
