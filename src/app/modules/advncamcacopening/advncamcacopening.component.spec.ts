import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvncamcacopeningComponent } from './advncamcacopening.component';

describe('AdvncamcacopeningComponent', () => {
  let component: AdvncamcacopeningComponent;
  let fixture: ComponentFixture<AdvncamcacopeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvncamcacopeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvncamcacopeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
