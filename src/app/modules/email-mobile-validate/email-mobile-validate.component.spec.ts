import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMobileValidateComponent } from './email-mobile-validate.component';

describe('EmailMobileValidateComponent', () => {
  let component: EmailMobileValidateComponent;
  let fixture: ComponentFixture<EmailMobileValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailMobileValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMobileValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
