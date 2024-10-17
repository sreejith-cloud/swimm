import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankChangeComponent } from './bank-change.component';

describe('BankChangeComponent', () => {
  let component: BankChangeComponent;
  let fixture: ComponentFixture<BankChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
