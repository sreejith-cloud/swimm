import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NreMoreThanOneAccountComponent } from './nre-more-than-one-account.component';

describe('NreMoreThanOneAccountComponent', () => {
  let component: NreMoreThanOneAccountComponent;
  let fixture: ComponentFixture<NreMoreThanOneAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NreMoreThanOneAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NreMoreThanOneAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
