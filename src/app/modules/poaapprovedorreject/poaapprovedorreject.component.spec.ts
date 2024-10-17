import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoaapprovedorrejectComponent } from './poaapprovedorreject.component';

describe('PoaapprovedorrejectComponent', () => {
  let component: PoaapprovedorrejectComponent;
  let fixture: ComponentFixture<PoaapprovedorrejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoaapprovedorrejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoaapprovedorrejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
