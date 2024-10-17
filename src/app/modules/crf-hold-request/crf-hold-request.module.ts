import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrfHoldRequestComponent } from './crf-hold-request.component';
import { SharedModule } from 'shared';
@NgModule({
  declarations: [CrfHoldRequestComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[CrfHoldRequestComponent],
})
export class CrfHoldRequestModule { }
