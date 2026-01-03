import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCycles } from './billing-cycles';

describe('BillingCycles', () => {
  let component: BillingCycles;
  let fixture: ComponentFixture<BillingCycles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingCycles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingCycles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
