import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFileSinglePageViewComponent } from './multi-file-single-page-view.component';

describe('MultiFileSinglePageViewComponent', () => {
  let component: MultiFileSinglePageViewComponent;
  let fixture: ComponentFixture<MultiFileSinglePageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileSinglePageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFileSinglePageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
