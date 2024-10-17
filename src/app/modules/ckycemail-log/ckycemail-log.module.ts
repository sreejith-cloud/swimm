import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKYCEmaillogComponent } from './ckycemaillog/ckycemaillog.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [CKYCEmaillogComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [CKYCEmaillogComponent],
})
export class CKYCEmailLogModule { }
 