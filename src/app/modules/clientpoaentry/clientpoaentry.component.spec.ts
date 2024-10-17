import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpoaentryComponent } from './clientpoaentry.component';

describe('ClientpoaentryComponent', () => {
  let component: ClientpoaentryComponent;
  let fixture: ComponentFixture<ClientpoaentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientpoaentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientpoaentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
