import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalagreementssignedComponent } from './additionalagreementssigned.component';

describe('AdditionalagreementssignedComponent', () => {
  let component: AdditionalagreementssignedComponent;
  let fixture: ComponentFixture<AdditionalagreementssignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalagreementssignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalagreementssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
