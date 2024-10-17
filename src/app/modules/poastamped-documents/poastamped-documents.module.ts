import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POAComponent } from './poa/poa.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [POAComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[POAComponent],
})
export class POAStampedDocumentsModule { }
