import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NseBseUploadComponent } from './nse-bse-upload.component';

describe('NseBseUploadComponent', () => {
  let component: NseBseUploadComponent;
  let fixture: ComponentFixture<NseBseUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NseBseUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NseBseUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
