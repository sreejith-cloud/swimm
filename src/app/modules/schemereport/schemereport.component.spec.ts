import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemereportComponent } from './schemereport.component';

describe('SchemereportComponent', () => {
  let component: SchemereportComponent;
  let fixture: ComponentFixture<SchemereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
