import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrfHoldRequestComponent } from './crf-hold-request.component';

describe('CrfHoldRequestComponent', () => {
  let component: CrfHoldRequestComponent;
  let fixture: ComponentFixture<CrfHoldRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrfHoldRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrfHoldRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
