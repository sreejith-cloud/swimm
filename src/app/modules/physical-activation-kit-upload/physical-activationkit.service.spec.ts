import { TestBed } from '@angular/core/testing';

import { PhysicalActivationkitService } from './physical-activationkit.service';

describe('PhysicalActivationkitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysicalActivationkitService = TestBed.get(PhysicalActivationkitService);
    expect(service).toBeTruthy();
  });
});
