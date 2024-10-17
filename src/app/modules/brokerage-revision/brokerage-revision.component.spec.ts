import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageRevisionComponent } from './brokerage-revision.component';

describe('BrokerageRevisionComponent', () => {
  let component: BrokerageRevisionComponent;
  let fixture: ComponentFixture<BrokerageRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
