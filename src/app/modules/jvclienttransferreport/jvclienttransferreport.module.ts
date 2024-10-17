import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { JvclienttransferreportComponent } from './jvclienttransferreport.component';

@NgModule({
  imports: [
    SharedModule,
     
  ],
  declarations: [
    JvclienttransferreportComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [JvclienttransferreportComponent],
})
export class JvclienttransferreportModule { }
