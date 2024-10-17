import { TestBed } from '@angular/core/testing';

import { PoaserviceService } from './poaservice.service';

describe('PoaserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PoaserviceService = TestBed.get(PoaserviceService);
    expect(service).toBeTruthy();
  });
});
