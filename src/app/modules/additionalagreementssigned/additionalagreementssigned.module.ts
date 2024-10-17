import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalagreementssignedComponent } from './additionalagreementssigned.component';
import { SharedModule } from 'shared';


@NgModule({
  imports: [
    SharedModule,
     
  ],
  declarations: [
    AdditionalagreementssignedComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [AdditionalagreementssignedComponent],
})

export class AdditionalagreementssignedModule { }
