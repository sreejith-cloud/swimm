import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { KRAComponent } from './kra.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

  ],
  declarations: [
    KRAComponent,
  ],
  bootstrap: [KRAComponent],
})
export class KRAModule { }
