import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingaccounttransactionchargesComponent } from './tradingaccounttransactioncharges.component';

describe('TradingaccounttransactionchargesComponent', () => {
  let component: TradingaccounttransactionchargesComponent;
  let fixture: ComponentFixture<TradingaccounttransactionchargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingaccounttransactionchargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingaccounttransactionchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
