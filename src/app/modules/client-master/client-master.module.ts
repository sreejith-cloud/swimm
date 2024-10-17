import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'shared';
import { ModuleComponent } from "./module.component";
import { ClientMasterService } from './client-master.service';
import { AcOpeningComponent } from './ac-opening/ac-opening.component';
import { KYCComponent } from './kyc/kyc.component';
import { KYCPersonalDetailsComponent } from './kyc/personal-details/component';
import { IdntityProofComponent } from './kyc/identity-proof/component';
import { AddressComponent } from './kyc/address/component';
import { ContactDetailsComponent } from './kyc/contact-details/component';
import { IPVComponent } from './kyc/ipv/component';
import { ProofUploadComponent } from './kyc/proof-upload/component';
import { KRADetailsComponent } from './kyc/kra-details/component';
import { KYCCompanyBasicComponent } from './kyc/company-basic/component';
import { KYCCompanyAddressComponent } from './kyc/company-address/component';
import {CompanyContactDetailsComponent} from './kyc/company-contact-details/component'
import {CompanyRelationDetailsComponent} from './kyc/company-relation-details/component'
import { FinancialsComponent } from './financials/financials.component';
import { BankDetailsComponent } from './financials/bank-details/component';
import { FinancialDetailsComponent } from './financials/financial-details/financial';
 import { WindowComponent } from './window/window.component';

import { RejectionsComponent } from './rejections/component';
import { ImageuploadComponent } from './imageupload/component';
import { schemeComponent } from './scheme/component';

import { DpComponent } from './dp/dp.component';

import { TradingComponent } from './trading/component';
import { GeneralDetailsComponent } from './trading/general-details/component';
import { MembershipDetailsComponent } from './trading/membership/component';
import { AdditionalDetailsComponent } from './trading/additional-details/component';
import { InvestmentTradingExperienceComponent } from './trading/experience/component';
import { DealingsComponent } from './trading/dealings/component';
import { IntroducerDetailsComponent } from './trading/introducer-details/component';
import { LeadDetailsComponent } from './trading/lead-details/component';
import { LeadConvDetailsComponent } from './trading/lead-conv-details/component';
import { RelativeOfGeojitEployeeComponent } from './trading/relative-geojit-employee/component';
import { NomineeDetailsComponent } from './trading/nominee-details/component';
import { GuardianDetailsComponent } from './trading/guardian-details/component';
import { NatchDetailsComponent } from './trading/nach-details/component';
import { AgreementStatusComponent } from './trading/agreement-status/component';
import {fissAndOcbsComponent} from './trading/fiss-ocbs/component';
import { ThirdPartyPOAComponent } from './trading/third-party-poa/component';
import { AdditionalDocumentsComponent } from './trading/additional-documents/component';
import { memberDetailsComponent} from './trading/member-details/component';
import {PortalModule} from '@angular/cdk/portal';
import { AcOpeningShared } from '../ACCOSharedModule';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    DragDropModule,PortalModule,AcOpeningShared
  ],
  declarations: [
    ModuleComponent,
    AcOpeningComponent,
     WindowComponent,
    KYCComponent,
    KYCPersonalDetailsComponent,
    IdntityProofComponent,
    AddressComponent,
    ContactDetailsComponent,
    IPVComponent,ProofUploadComponent,
    KRADetailsComponent,
    KYCCompanyBasicComponent,
    KYCCompanyAddressComponent,
    FinancialsComponent,
    BankDetailsComponent,
    FinancialDetailsComponent,
    RejectionsComponent,
    schemeComponent,
    ImageuploadComponent,
    DpComponent,
    TradingComponent,
    GeneralDetailsComponent,
    MembershipDetailsComponent,
    AdditionalDetailsComponent,
    InvestmentTradingExperienceComponent,
    DealingsComponent,
    IntroducerDetailsComponent,
    LeadDetailsComponent,
    LeadConvDetailsComponent,
    RelativeOfGeojitEployeeComponent,
    NomineeDetailsComponent,
    GuardianDetailsComponent,
    NatchDetailsComponent,
    AgreementStatusComponent,
    ThirdPartyPOAComponent,
    AdditionalDocumentsComponent,
    fissAndOcbsComponent,
    memberDetailsComponent,
    CompanyContactDetailsComponent,
    CompanyRelationDetailsComponent
  ],
  providers: [
    ClientMasterService
    
  ],
  entryComponents: [
  ],
  bootstrap: [ModuleComponent],
})

export class ClientMasterModule { }
