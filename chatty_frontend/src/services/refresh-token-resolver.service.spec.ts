import { TestBed } from '@angular/core/testing';

import { RefreshTokenResolverService } from './refresh-token-resolver.service';

describe('RefreshTokenResolverService', () => {
  let service: RefreshTokenResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTokenResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
