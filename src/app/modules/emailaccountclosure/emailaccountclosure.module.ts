import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailaccountclosureComponent } from './emailaccountclosure.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [EmailaccountclosureComponent],
  imports: [
    SharedModule,
    CommonModule
  ],
  bootstrap:[EmailaccountclosureComponent]
})
export class EmailaccountclosureModule { }