import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { EmailMobileValidateComponent } from './email-mobile-validate.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmailMobileValidateComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule

  ],
  bootstrap: [EmailMobileValidateComponent]
})
export class EmailMobileValidateModule { }
