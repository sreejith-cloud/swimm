import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { schememappingComponent } from "./schememapping.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    schememappingComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [schememappingComponent],
})

export class schememappingModule { }
