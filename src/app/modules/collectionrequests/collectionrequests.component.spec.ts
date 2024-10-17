import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionrequestsComponent } from './collectionrequests.component';

describe('CollectionrequestsComponent', () => {
  let component: CollectionrequestsComponent;
  let fixture: ComponentFixture<CollectionrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
