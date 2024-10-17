import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraliveenquiryComponent } from './kraliveenquiry.component';

describe('KraliveenquiryComponent', () => {
  let component: KraliveenquiryComponent;
  let fixture: ComponentFixture<KraliveenquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraliveenquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraliveenquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
