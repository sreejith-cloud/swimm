import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageRevisionApprovalComponent } from './brokerage-revision-approval.component';

describe('BrokerageRevisionApprovalComponent', () => {
  let component: BrokerageRevisionApprovalComponent;
  let fixture: ComponentFixture<BrokerageRevisionApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageRevisionApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageRevisionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
