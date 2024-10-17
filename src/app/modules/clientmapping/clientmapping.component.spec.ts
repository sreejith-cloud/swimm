import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientmappingComponent } from './clientmapping.component';

describe('ClientmappingComponent', () => {
  let component: ClientmappingComponent;
  let fixture: ComponentFixture<ClientmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
