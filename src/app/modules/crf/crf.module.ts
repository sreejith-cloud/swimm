import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { CrfComponent } from "./crf.component";
import { EditwindowComponent } from './editwindow/editwindow.component';
import { CRFAddressComponent } from './CRFaddress/component';
import { CRFDataService } from './CRF.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CRFContactDetailsComponent } from './CRFcontact-details/component';
import { CRFBankDetailsComponent } from './CRFbank-details/component';
import { CRFNomineeDetailsComponent } from './CRFnominee-details/component';
import { CRFImageUploadComponent } from './CRFimage upload/component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import {PortalModule} from '@angular/cdk/portal';
// import { KYCComponent } from './kyc/kyc.component';
import { AddressComponent } from './kyc/address/component';
import { KYCCompanyAddressComponent } from './kyc/company-address/component';
import { KYCCompanyBasicComponent } from './kyc/company-basic/component';
import { CompanyContactDetailsComponent } from './kyc/company-contact-details/component';
import { CompanyRelationDetailsComponent } from './kyc/company-relation-details/component';
import { ContactDetailsComponent } from './kyc/contact-details/component';
import { IdntityProofComponent } from './kyc/identity-proof/component';
import { IPVComponent } from './kyc/ipv/component';
import { KRADetailsComponent } from './kyc/kra-details/component';
import { KYCPersonalDetailsComponent } from './kyc/personal-details/component';
import { ProofUploadComponent } from './kyc/proof-upload/component';
// import { ClientMasterService } from './kyc/client-master.service';
import { WindowComponent } from './kyc/window/window.component';
import { FinancialsComponent } from './financials/financials.component';
import { CRFKYCComponent } from './kyc/kyc.component';
// import { ClientMasterService } from '../client-master/client-master.service';

import { AcOpeningShared } from '../ACCOSharedModule';
import { AssistWindowModule } from '../assist-window/assist-window.module';
import { ClientMasterService } from './client-master.service';
import { CrfipvComponent } from './crfipv/crfipv.component';
import { CrfSignatureUpdationComponent } from './crf-signature-updation/crf-signature-updation.component';
import { ModeofOperationComponent } from './modeof-operation/modeof-operation.component';
import { CrfSegmentAdditionComponent } from './crf-segment-addition/crf-segment-addition.component';
import { AdditionaltcComponent } from './additionaltc/additionaltc.component';



@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,PortalModule,AcOpeningShared,AssistWindowModule

  ],
  exports: [
    CrfComponent,
    EditwindowComponent,
    WindowComponent,
    CRFAddressComponent,
    CRFContactDetailsComponent,
    CRFBankDetailsComponent,
    CRFNomineeDetailsComponent,
    CRFImageUploadComponent,
    ImagePreviewComponent,
    CRFKYCComponent,
    AddressComponent,
    KYCCompanyAddressComponent,
    KYCCompanyBasicComponent,
    CompanyContactDetailsComponent,
    CompanyRelationDetailsComponent,
    ContactDetailsComponent,
    IdntityProofComponent,
    IPVComponent,
    KRADetailsComponent,
    KYCPersonalDetailsComponent,
    ProofUploadComponent,
    FinancialsComponent,
    WindowComponent,
    CrfipvComponent
  ],
  declarations: [
    CrfComponent,
    EditwindowComponent,
    WindowComponent,
    CRFAddressComponent,
    CRFContactDetailsComponent,
    CRFBankDetailsComponent,
    CRFNomineeDetailsComponent,
    CRFImageUploadComponent,
    ImagePreviewComponent,
    CRFKYCComponent,
    AddressComponent,
    KYCCompanyAddressComponent,
    KYCCompanyBasicComponent,
    CompanyContactDetailsComponent,
    CompanyRelationDetailsComponent,
    ContactDetailsComponent,
    IdntityProofComponent,
    IPVComponent,
    KRADetailsComponent,
    KYCPersonalDetailsComponent,
    ProofUploadComponent,
    FinancialsComponent,
    WindowComponent,
    CrfipvComponent,
    CrfSignatureUpdationComponent,
    ModeofOperationComponent,
    CrfSegmentAdditionComponent,
    AdditionaltcComponent
   ],
  providers: [
    CRFDataService,ClientMasterService
  ],
  entryComponents: [
  ],
  bootstrap: [CrfComponent],
})

export class CRFModule { }
