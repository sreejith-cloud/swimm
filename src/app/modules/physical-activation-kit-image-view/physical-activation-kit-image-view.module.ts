import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalActivationImageViewComponent } from'./physical-activation-image-view/physical-activation-image-view.component'
import { SharedModule } from 'shared';


@NgModule({
  declarations: [PhysicalActivationImageViewComponent],
  imports: [
    SharedModule,CommonModule
  ],
  bootstrap: [PhysicalActivationImageViewComponent],
})
export class PhysicalActivationKitImageViewModule { }
