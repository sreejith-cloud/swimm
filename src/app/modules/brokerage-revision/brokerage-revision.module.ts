import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerageRevisionComponent } from './brokerage-revision.component';
import { SharedModule } from 'shared';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [BrokerageRevisionComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  bootstrap:[BrokerageRevisionComponent],
  providers:[DatePipe]
})
export class BrokerageRevisionModule { }
