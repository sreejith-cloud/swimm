import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrfSegmentAdditionComponent } from './crf-segment-addition.component';

describe('CrfSegmentAdditionComponent', () => {
  let component: CrfSegmentAdditionComponent;
  let fixture: ComponentFixture<CrfSegmentAdditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrfSegmentAdditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrfSegmentAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
