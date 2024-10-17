import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistWindowComponent } from './assist-window.component';

describe('AssistWindowComponent', () => {
  let component: AssistWindowComponent;
  let fixture: ComponentFixture<AssistWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
