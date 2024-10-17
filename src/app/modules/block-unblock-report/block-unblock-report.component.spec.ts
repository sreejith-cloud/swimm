import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnblockReportComponent } from './block-unblock-report.component';

describe('BlockUnblockReportComponent', () => {
  let component: BlockUnblockReportComponent;
  let fixture: ComponentFixture<BlockUnblockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockUnblockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUnblockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
