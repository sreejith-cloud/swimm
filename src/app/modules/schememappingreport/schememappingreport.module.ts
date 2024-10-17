import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchememappingreportComponent } from './schememappingreport.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SchememappingreportComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [SchememappingreportComponent],
})

export class SchememappingreportModule { }
