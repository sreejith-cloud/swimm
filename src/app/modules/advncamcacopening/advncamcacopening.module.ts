import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { advncamcacopeningComponent } from './advncamcacopening.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [advncamcacopeningComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap: [advncamcacopeningComponent],
})
export class AdvncamcacopeningModule { }
