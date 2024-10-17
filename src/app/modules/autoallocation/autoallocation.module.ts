import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrfautoallocationComponent } from './crfautoallocation/crfautoallocation.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [CrfautoallocationComponent],
  imports: [
    CommonModule,
    SharedModule
    
  ],
  bootstrap:[CrfautoallocationComponent],
})
export class AutoallocationModule { }
