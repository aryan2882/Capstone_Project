import { TestBed } from '@angular/core/testing';

import { Tarrif } from './tarrif';

describe('Tarrif', () => {
  let service: Tarrif;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tarrif);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
