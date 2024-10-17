import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVerificationDelphiComponent } from './document-verification-delphi.component';

describe('DocumentVerificationDelphiComponent', () => {
  let component: DocumentVerificationDelphiComponent;
  let fixture: ComponentFixture<DocumentVerificationDelphiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentVerificationDelphiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVerificationDelphiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
