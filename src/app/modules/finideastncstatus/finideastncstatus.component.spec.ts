import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinideastncstatusComponent } from './finideastncstatus.component';

describe('FinideastncstatusComponent', () => {
  let component: FinideastncstatusComponent;
  let fixture: ComponentFixture<FinideastncstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinideastncstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinideastncstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
