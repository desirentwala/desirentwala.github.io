import { TestBed } from '@angular/core/testing';

import { BusyIndicatorService } from './busy-indicator.service';

describe('BusyIndicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusyIndicatorService = TestBed.get(BusyIndicatorService);
    expect(service).toBeTruthy();
  });
});
