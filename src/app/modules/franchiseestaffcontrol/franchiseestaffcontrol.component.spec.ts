import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseestaffcontrolComponent } from './franchiseestaffcontrol.component';

describe('FranchiseestaffcontrolComponent', () => {
  let component: FranchiseestaffcontrolComponent;
  let fixture: ComponentFixture<FranchiseestaffcontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseestaffcontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseestaffcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
