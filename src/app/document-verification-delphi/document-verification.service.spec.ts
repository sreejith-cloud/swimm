import { TestBed } from '@angular/core/testing';

import { DocumentVerificationService } from './document-verification.service';

describe('DocumentVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentVerificationService = TestBed.get(DocumentVerificationService);
    expect(service).toBeTruthy();
  });
});
