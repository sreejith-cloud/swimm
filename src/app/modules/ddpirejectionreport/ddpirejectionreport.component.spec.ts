import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdpirejectionreportComponent } from './ddpirejectionreport.component';

describe('DdpirejectionreportComponent', () => {
  let component: DdpirejectionreportComponent;
  let fixture: ComponentFixture<DdpirejectionreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdpirejectionreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdpirejectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
