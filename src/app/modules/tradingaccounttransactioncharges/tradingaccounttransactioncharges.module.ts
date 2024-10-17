import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingaccounttransactionchargesComponent } from './tradingaccounttransactioncharges.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [TradingaccounttransactionchargesComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [TradingaccounttransactionchargesComponent],
})
export class TradingaccounttransactionchargesModule { }
