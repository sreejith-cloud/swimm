import { NgModule } from '@angular/core';
import { FinideastncstatusComponent } from './finideastncstatus.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [FinideastncstatusComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [FinideastncstatusComponent]
})
export class FinideastncstatusModule { }
