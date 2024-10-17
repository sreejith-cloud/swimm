import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUnblockReportComponent } from './block-unblock-report.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [BlockUnblockReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzInputModule
  ],
  bootstrap: [BlockUnblockReportComponent],
})
export class BlockUnblockReportModule { }
