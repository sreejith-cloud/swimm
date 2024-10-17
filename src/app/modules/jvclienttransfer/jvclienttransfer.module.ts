import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JvclienttransferComponent } from './jvclienttransfer.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [
    SharedModule,
     
  ],
  declarations: [
    JvclienttransferComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [JvclienttransferComponent],
})
export class JvclienttransferModule { }
