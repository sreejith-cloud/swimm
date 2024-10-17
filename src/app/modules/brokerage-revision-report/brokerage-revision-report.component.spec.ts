import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageRevisionReportComponent } from './brokerage-revision-report.component';

describe('BrokerageRevisionReportComponent', () => {
  let component: BrokerageRevisionReportComponent;
  let fixture: ComponentFixture<BrokerageRevisionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageRevisionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageRevisionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
