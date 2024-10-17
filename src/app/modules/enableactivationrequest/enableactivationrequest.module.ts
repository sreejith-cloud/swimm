import { NgModule } from '@angular/core';
import { SharedModule } from 'shared';
import { EnableactivationrequestComponent } from './enableactivationrequest.component';

@NgModule({
  declarations: [EnableactivationrequestComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [EnableactivationrequestComponent]
})
export class EnableactivationrequestModule { }
