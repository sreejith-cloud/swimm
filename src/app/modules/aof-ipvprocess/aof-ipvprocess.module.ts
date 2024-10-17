import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared';
import { AofIpvprocessComponent } from './aof-ipvprocess.component';

@NgModule({
  declarations: [AofIpvprocessComponent],
  imports: [
    SharedModule,
    CommonModule
  ],
  bootstrap: [AofIpvprocessComponent],
})
export class AOFIPVProcessModule { }
