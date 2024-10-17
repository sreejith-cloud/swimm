import { NgModule } from '@angular/core';

import { SharedModule } from 'shared';
import { DashboardComponent } from "./dashboard.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [DashboardComponent],
})

export class DashboardModule { }
