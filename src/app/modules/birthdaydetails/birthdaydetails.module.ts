import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdaydetailsComponent } from './birthdaydetails.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [BirthdaydetailsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [BirthdaydetailsComponent],
})
export class BirthdaydetailsModule { }
