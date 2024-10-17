import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { ModuleComponent } from "./module.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      ModuleComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [ModuleComponent],
})

export class DashboardModule { }
