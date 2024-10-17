import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FranchiseestaffcontrolComponent } from './franchiseestaffcontrol.component';
import { SharedModule } from 'shared';
@NgModule({
  declarations: [FranchiseestaffcontrolComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[FranchiseestaffcontrolComponent]
})
export class FranchiseestaffcontrolModule { }
