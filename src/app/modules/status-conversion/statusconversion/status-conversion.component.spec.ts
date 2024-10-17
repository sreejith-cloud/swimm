import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusConversionComponent } from './status-conversion.component';

describe('StatusConversionComponent', () => {
  let component: StatusConversionComponent;
  let fixture: ComponentFixture<StatusConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
