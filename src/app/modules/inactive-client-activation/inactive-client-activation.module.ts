import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { InactiveClientActivationComponent } from './inactive-client-activation/inactive-client-activation.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

  ],
  declarations: [
    InactiveClientActivationComponent,
  ],
  bootstrap: [InactiveClientActivationComponent],
})
export class InactiveClientActivationModule { }
