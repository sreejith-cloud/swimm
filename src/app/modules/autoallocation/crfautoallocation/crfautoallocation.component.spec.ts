import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrfautoallocationComponent } from './crfautoallocation.component';

describe('CrfautoallocationComponent', () => {
  let component: CrfautoallocationComponent;
  let fixture: ComponentFixture<CrfautoallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrfautoallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrfautoallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
