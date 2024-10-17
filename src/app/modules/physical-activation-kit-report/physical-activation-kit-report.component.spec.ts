import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalActivationKitReportComponent } from './physical-activation-kit-report.component';

describe('PhysicalActivationKitReportComponent', () => {
  let component: PhysicalActivationKitReportComponent;
  let fixture: ComponentFixture<PhysicalActivationKitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalActivationKitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalActivationKitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
