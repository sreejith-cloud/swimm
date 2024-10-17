import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NseBseUploadComponent } from './nse-bse-upload.component';
import { SharedModule } from 'shared';
import { HistoryComponent } from './history/history.component';
import { UploadComponent } from './upload/upload.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
@NgModule({
  declarations: [NseBseUploadComponent,HistoryComponent, UploadComponent, ViewDetailsComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [NseBseUploadComponent],
})
export class NseBseUploadModule { }
