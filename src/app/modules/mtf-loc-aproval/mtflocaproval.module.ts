import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { MtfLocAprovalComponent } from "./mtflocaproval.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    MtfLocAprovalComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [MtfLocAprovalComponent],
})

export class mtflocaprovalModule { }
