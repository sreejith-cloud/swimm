import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanBasedClientProfileMasterComponent } from './pan-based-client-profile-master.component';

describe('PanBasedClientProfileMasterComponent', () => {
  let component: PanBasedClientProfileMasterComponent;
  let fixture: ComponentFixture<PanBasedClientProfileMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanBasedClientProfileMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanBasedClientProfileMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
