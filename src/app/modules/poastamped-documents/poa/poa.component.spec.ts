import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POAComponent } from './poa.component';

describe('POAComponent', () => {
  let component: POAComponent;
  let fixture: ComponentFixture<POAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
