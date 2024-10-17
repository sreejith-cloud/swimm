import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscellaneousComponent } from './miscellaneous/miscellaneous.component';
import { SharedModule } from 'shared';
@NgModule({
  declarations: [MiscellaneousComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[MiscellaneousComponent],
})
export class MiscellaneousModule { }
