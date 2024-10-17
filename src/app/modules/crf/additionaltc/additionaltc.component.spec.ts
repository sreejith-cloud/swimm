import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionaltcComponent } from './additionaltc.component';

describe('AdditionaltcComponent', () => {
  let component: AdditionaltcComponent;
  let fixture: ComponentFixture<AdditionaltcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionaltcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionaltcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
