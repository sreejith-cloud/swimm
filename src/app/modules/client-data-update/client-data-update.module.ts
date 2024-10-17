import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDataUpdateComponent } from './client-data-update/client-data-update.component';
import { SharedModule } from 'shared';


@NgModule({
  declarations: [ClientDataUpdateComponent],
  imports: [
    SharedModule,
    CommonModule
  ],
  bootstrap: [ClientDataUpdateComponent],
})
export class ClientDataUpdateModule { }
