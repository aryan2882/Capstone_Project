import { TestBed } from '@angular/core/testing';

import { BillingCycle } from './billing-cycle';

describe('BillingCycle', () => {
  let service: BillingCycle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingCycle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
