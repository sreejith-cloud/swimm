import { TestBed } from '@angular/core/testing';

import { CollectionrequestsService } from './collectionrequests.service';

describe('CollectionrequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionrequestsService = TestBed.get(CollectionrequestsService);
    expect(service).toBeTruthy();
  });
});
