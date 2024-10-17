import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemiserCommissionSlabComponent } from './remiser-commission-slab.component';
import { SharedModule } from 'shared';
// import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [RemiserCommissionSlabComponent],
  imports: [
    CommonModule,
    SharedModule
    // DragDropModule
  ],
  providers: [
  ],
  bootstrap: [RemiserCommissionSlabComponent],
})
export class RemiserCommissionSlabModule { }
