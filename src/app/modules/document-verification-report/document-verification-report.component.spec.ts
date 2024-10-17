import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVerificationReportComponent } from './document-verification-report.component';

describe('DocumentVerificationReportComponent', () => {
  let component: DocumentVerificationReportComponent;
  let fixture: ComponentFixture<DocumentVerificationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentVerificationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVerificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
