import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofVerificationComponent } from './proof-verification.component';

describe('ProofVerificationComponent', () => {
  let component: ProofVerificationComponent;
  let fixture: ComponentFixture<ProofVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
