import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMobileChangeintimationComponent } from './email-mobile-changeintimation.component';

describe('EmailMobileChangeintimationComponent', () => {
  let component: EmailMobileChangeintimationComponent;
  let fixture: ComponentFixture<EmailMobileChangeintimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMobileChangeintimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailMobileChangeintimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
