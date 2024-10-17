import { TestBed } from '@angular/core/testing';

import { StatusconversionService } from './statusconversion.service';

describe('StatusconversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusconversionService = TestBed.get(StatusconversionService);
    expect(service).toBeTruthy();
  });
});
