import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { AcctOpeningrptComponent } from "./AcctOpeningrpt.component";
import { AcOpeningShared } from '../ACCOSharedModule';


@NgModule({
  imports: [
    SharedModule,AcOpeningShared

  ],
  declarations: [
    AcctOpeningrptComponent,
  ],
  exports: [SharedModule,AcOpeningShared],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [AcctOpeningrptComponent],
})

export class AcctOpeningrptModule { }
