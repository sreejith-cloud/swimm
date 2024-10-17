import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveClientActivationComponent } from './inactive-client-activation.component';

describe('InactiveClientActivationComponent', () => {
  let component: InactiveClientActivationComponent;
  let fixture: ComponentFixture<InactiveClientActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveClientActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveClientActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
