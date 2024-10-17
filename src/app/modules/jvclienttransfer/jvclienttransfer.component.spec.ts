import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvclienttransferComponent } from './jvclienttransfer.component';

describe('JvclienttransferComponent', () => {
  let component: JvclienttransferComponent;
  let fixture: ComponentFixture<JvclienttransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvclienttransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvclienttransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
