import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { SharedModule } from 'shared';
import { BankChangeComponent } from './bank-change.component';

@NgModule({
  declarations: [BankChangeComponent],
  imports: [
    SharedModule,
    PortalModule
  ],
  bootstrap: [BankChangeComponent],

})
export class BankChangeModule { }
