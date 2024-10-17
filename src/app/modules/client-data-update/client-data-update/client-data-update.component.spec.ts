import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDataUpdateComponent } from './client-data-update.component';

describe('ClientDataUpdateComponent', () => {
  let component: ClientDataUpdateComponent;
  let fixture: ComponentFixture<ClientDataUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDataUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDataUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
