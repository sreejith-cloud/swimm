import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemereportComponent } from './schemereport.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SchemereportComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [SchemereportComponent],
})
export class SchemereportModule { }
