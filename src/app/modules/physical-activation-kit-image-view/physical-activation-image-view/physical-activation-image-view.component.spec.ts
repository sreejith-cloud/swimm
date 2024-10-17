import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalActivationImageViewComponent } from './physical-activation-image-view.component';

describe('PhysicalActivationImageViewComponent', () => {
  let component: PhysicalActivationImageViewComponent;
  let fixture: ComponentFixture<PhysicalActivationImageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalActivationImageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalActivationImageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
