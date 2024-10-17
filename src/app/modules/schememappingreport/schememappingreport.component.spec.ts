import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchememappingreportComponent } from './schememappingreport.component';

describe('SchememappingreportComponent', () => {
  let component: SchememappingreportComponent;
  let fixture: ComponentFixture<SchememappingreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchememappingreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchememappingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
