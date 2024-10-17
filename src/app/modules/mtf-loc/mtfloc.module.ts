import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { MtflocComponent } from "./mtfloc.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    MtflocComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [MtflocComponent],
})

export class mtflocModule { }
