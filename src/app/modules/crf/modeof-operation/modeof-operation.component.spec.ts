import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeofOperationComponent } from './modeof-operation.component';

describe('ModeofOperationComponent', () => {
  let component: ModeofOperationComponent;
  let fixture: ComponentFixture<ModeofOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeofOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeofOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
