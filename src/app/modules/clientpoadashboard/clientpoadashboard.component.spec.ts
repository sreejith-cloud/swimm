import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpoadashboardComponent } from './clientpoadashboard.component';

describe('ClientpoadashboardComponent', () => {
  let component: ClientpoadashboardComponent;
  let fixture: ComponentFixture<ClientpoadashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientpoadashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientpoadashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
