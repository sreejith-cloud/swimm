import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusConversionReportComponent } from './status-conversion-report.component';

describe('StatusConversionReportComponent', () => {
  let component: StatusConversionReportComponent;
  let fixture: ComponentFixture<StatusConversionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusConversionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusConversionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
