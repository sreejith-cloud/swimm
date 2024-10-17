import { NgModule } from '@angular/core';
import { SharedModule } from 'shared';
import { PanVerificationComponent } from './pan-verification.component';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [PanVerificationComponent],
  imports: [
    SharedModule,
    NzInputModule
  ],
  bootstrap: [PanVerificationComponent]
})
export class PanVerificationModule { }
