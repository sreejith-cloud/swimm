import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountopeningComponent } from './accountopening.component';
import { SharedModule } from 'shared';
import { BookRecievedComponent } from './book-recieved/book-recieved.component';
import { AuditallocationComponent } from './auditallocation/auditallocation.component';
import { AuditoracceptanceComponent } from './auditoracceptance/auditoracceptance.component';
import { GfslacceptanceComponent } from './gfslacceptance/gfslacceptance.component';
import { AuditorreviewComponent } from './auditorreview/auditorreview.component';
import { HoreviewComponent } from './horeview/horeview.component';
import { ReportsComponent } from './reports/reports.component';
import {NgxPrintModule} from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BoxnumbergnrtnComponent } from './boxnumbergnrtn/boxnumbergnrtn.component';
import { StoreverificationComponent } from './storeverification/storeverification.component';
import {WebcamModule} from 'ngx-webcam';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [AccountopeningComponent, BookRecievedComponent, AuditallocationComponent, AuditoracceptanceComponent, GfslacceptanceComponent, AuditorreviewComponent, HoreviewComponent, ReportsComponent, BoxnumbergnrtnComponent, StoreverificationComponent],
  imports: [
    SharedModule,
    NgxPrintModule,
    NgxBarcodeModule,
    WebcamModule,
    NzToolTipModule,
    ImageCropperModule
    
  ],
  bootstrap: [AccountopeningComponent],
})
export class AccountopeningModule { }
