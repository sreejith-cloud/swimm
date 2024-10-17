import { NgModule } from '@angular/core';
import { KraliveenquiryComponent } from './kraliveenquiry.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    KraliveenquiryComponent
  ],
  bootstrap: [
    KraliveenquiryComponent
  ]
})
export class KraliveenquiryModule { }
