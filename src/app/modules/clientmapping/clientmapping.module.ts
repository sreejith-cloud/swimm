import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { ClientmappingComponent } from './clientmapping.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ClientmappingComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [ClientmappingComponent],
})
export class ClientmappingModule { }
