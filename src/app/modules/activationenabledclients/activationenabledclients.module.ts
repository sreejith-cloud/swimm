import { NgModule } from '@angular/core';
import { ActivationenabledclientsComponent } from './activationenabledclients.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [ActivationenabledclientsComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [ActivationenabledclientsComponent],
})
export class ActivationenabledclientsModule { }
