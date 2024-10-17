import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { uccfilegenerationComponent } from "./uccuploadfilegeneration.component";


@NgModule({
  imports: [
    SharedModule,
     
  ],
  declarations: [
      uccfilegenerationComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [uccfilegenerationComponent],
})

export class uccfilegenerationModule { }