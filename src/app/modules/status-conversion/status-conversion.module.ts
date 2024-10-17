import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'shared';
import { AcOpeningShared } from '../ACCOSharedModule';
import { ClientMasterService } from '../crf/client-master.service';
import { CRFDataService } from '../crf/CRF.service';
import { StatusConversionComponent } from './statusconversion/status-conversion.component';
import { PortalModule } from '@angular/cdk/portal';
import { CRFModule } from '../crf/crf.module';
import { MultiFileSinglePageViewComponent } from './statusconversion/multi-file-single-page-view/multi-file-single-page-view.component';

@NgModule({
  declarations: [
    StatusConversionComponent,
    MultiFileSinglePageViewComponent,
  ],
  imports: [
    CRFModule,
    SharedModule,
    ReactiveFormsModule,
    PortalModule,
    AcOpeningShared
  ],
  providers: [CRFDataService, ClientMasterService
  ],
  entryComponents: [
  ],
  bootstrap: [StatusConversionComponent],
})
export class StatusConversionModule { }
