import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailaccountclosureComponent } from './emailaccountclosure.component';

describe('EmailaccountclosureComponent', () => {
  let component: EmailaccountclosureComponent;
  let fixture: ComponentFixture<EmailaccountclosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailaccountclosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailaccountclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
