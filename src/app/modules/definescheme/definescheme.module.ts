import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { defineschemeComponent } from "./definescheme.component";


@NgModule({
  imports: [
    SharedModule,
     
  ],
  declarations: [
    defineschemeComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [defineschemeComponent],
})

export class defineschemeModule { }