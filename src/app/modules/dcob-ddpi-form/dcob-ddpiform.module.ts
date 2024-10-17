import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { DcobDDPIFormComponent } from './dcob-ddpi-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DcobDDPIFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  bootstrap: [DcobDDPIFormComponent],
})
export class DcobDDPIFormModule { }
