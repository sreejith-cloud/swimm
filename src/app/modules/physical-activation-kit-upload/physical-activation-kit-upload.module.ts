import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalActivationKitUploadComponent } from './physical-activation-kit-upload/physical-activation-kit-upload.component';
import { PhysicalActivationkitService } from './physical-activationkit.service';
import { SharedModule } from 'shared';


@NgModule({
  declarations: [PhysicalActivationKitUploadComponent],
  imports: [
    SharedModule,CommonModule
  ],
  bootstrap:[PhysicalActivationKitUploadComponent]
})
export class PhysicalActivationKitUploadModule { } 
