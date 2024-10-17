import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProofVerificationComponent } from './proof-verification.component';
import { SharedModule } from 'shared';
import { ImagePreviewComponentVerification } from './image-preview/image-preview.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [
    ProofVerificationComponent,
    ImagePreviewComponentVerification
  ],
  imports: [
    SharedModule,
    PortalModule
  ],
  bootstrap: [ProofVerificationComponent],

})
export class ProofverificationModule { }
