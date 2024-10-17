import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcnactivationreportComponent } from './dcnactivationreport.component';

describe('DcnactivationreportComponent', () => {
  let component: DcnactivationreportComponent;
  let fixture: ComponentFixture<DcnactivationreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcnactivationreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcnactivationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
