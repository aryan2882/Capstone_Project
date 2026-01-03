import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingOfficerLayout } from './billing-officer-layout';

describe('BillingOfficerLayout', () => {
  let component: BillingOfficerLayout;
  let fixture: ComponentFixture<BillingOfficerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingOfficerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingOfficerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
