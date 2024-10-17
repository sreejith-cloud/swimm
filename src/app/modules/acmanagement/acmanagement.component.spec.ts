import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACManagementComponent } from './acmanagement.component';

describe('ACManagementComponent', () => {
  let component: ACManagementComponent;
  let fixture: ComponentFixture<ACManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
