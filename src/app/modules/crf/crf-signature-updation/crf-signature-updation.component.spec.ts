import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrfSignatureUpdationComponent } from './crf-signature-updation.component';

describe('CrfSignatureUpdationComponent', () => {
  let component: CrfSignatureUpdationComponent;
  let fixture: ComponentFixture<CrfSignatureUpdationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrfSignatureUpdationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrfSignatureUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
