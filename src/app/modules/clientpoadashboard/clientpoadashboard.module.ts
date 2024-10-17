import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { ClientpoadashboardComponent } from './clientpoadashboard.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ClientpoadashboardComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [ClientpoadashboardComponent],
})
export class ClientpoadashboardModule { }
