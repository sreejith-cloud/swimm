import { NgModule } from '@angular/core';
import { PandetailsComponent } from './pandetails.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [PandetailsComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [PandetailsComponent],
})
export class PandetailsModule { }
