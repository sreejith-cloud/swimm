import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { clientcommoditycategorisationComponent } from "./clientcommoditycategorisation.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    clientcommoditycategorisationComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [clientcommoditycategorisationComponent],
})

export class clientcommoditycategorisationModule { }
