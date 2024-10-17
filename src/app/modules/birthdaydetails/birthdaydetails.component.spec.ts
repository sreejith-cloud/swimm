import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdaydetailsComponent } from './birthdaydetails.component';

describe('BirthdaydetailsComponent', () => {
  let component: BirthdaydetailsComponent;
  let fixture: ComponentFixture<BirthdaydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdaydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdaydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
