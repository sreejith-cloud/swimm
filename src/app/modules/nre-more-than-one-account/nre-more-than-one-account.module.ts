import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NreMoreThanOneAccountComponent } from './nre-more-than-one-account.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [NreMoreThanOneAccountComponent],
  imports: [
    SharedModule
  ],
  bootstrap: [NreMoreThanOneAccountComponent],
})
export class NreMoreThanOneAccountModule { }
