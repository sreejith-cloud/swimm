import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvclienttransferreportComponent } from './jvclienttransferreport.component';

describe('JvclienttransferreportComponent', () => {
  let component: JvclienttransferreportComponent;
  let fixture: ComponentFixture<JvclienttransferreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvclienttransferreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvclienttransferreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
