import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CKYCEmaillogComponent } from './ckycemaillog.component';

describe('CKYCEmaillogComponent', () => {
  let component: CKYCEmaillogComponent;
  let fixture: ComponentFixture<CKYCEmaillogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CKYCEmaillogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CKYCEmaillogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
