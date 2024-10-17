import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KRAComponent } from './kra.component';

describe('KRAComponent', () => {
  let component: KRAComponent;
  let fixture: ComponentFixture<KRAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KRAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
