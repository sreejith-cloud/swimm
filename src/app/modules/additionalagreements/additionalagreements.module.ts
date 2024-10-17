import { NgModule } from '@angular/core';
import { AdditionalagreementsComponent } from './additionalagreements.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [AdditionalagreementsComponent],
  imports: [
    SharedModule,
     
  ],
  bootstrap: [AdditionalagreementsComponent],
})
export class AdditionalagreementsModule { }
