import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalActivationKitUploadComponent } from './physical-activation-kit-upload.component';

describe('PhysicalActivationKitUploadComponent', () => {
  let component: PhysicalActivationKitUploadComponent;
  let fixture: ComponentFixture<PhysicalActivationKitUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalActivationKitUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalActivationKitUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
