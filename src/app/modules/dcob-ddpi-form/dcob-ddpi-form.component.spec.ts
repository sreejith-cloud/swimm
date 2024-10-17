import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcobDDPIFormComponent } from './dcob-ddpi-form.component';

describe('DcobDDPIFormComponent', () => {
  let component: DcobDDPIFormComponent;
  let fixture: ComponentFixture<DcobDDPIFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcobDDPIFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcobDDPIFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
