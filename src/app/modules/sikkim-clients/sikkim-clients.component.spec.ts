import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SikkimClientsComponent } from './sikkim-clients.component';

describe('SikkimClientsComponent', () => {
  let component: SikkimClientsComponent;
  let fixture: ComponentFixture<SikkimClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SikkimClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SikkimClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
