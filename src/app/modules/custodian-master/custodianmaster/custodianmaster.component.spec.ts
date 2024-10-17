import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodianmasterComponent } from './custodianmaster.component';

describe('CustodianmasterComponent', () => {
  let component: CustodianmasterComponent;
  let fixture: ComponentFixture<CustodianmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustodianmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustodianmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
