import { NgModule } from '@angular/core';
import { SikkimClientsComponent } from './sikkim-clients.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SikkimClientsComponent
  ],
  bootstrap: [SikkimClientsComponent]
})
export class SikkimClientsModule { }
