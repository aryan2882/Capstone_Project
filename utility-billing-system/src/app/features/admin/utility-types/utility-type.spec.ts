import { TestBed } from '@angular/core/testing';

import { UtilityType } from './utility-type';

describe('UtilityType', () => {
  let service: UtilityType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
