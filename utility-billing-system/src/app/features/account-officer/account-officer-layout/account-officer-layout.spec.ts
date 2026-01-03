import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOfficerLayout } from './account-officer-layout';

describe('AccountOfficerLayout', () => {
  let component: AccountOfficerLayout;
  let fixture: ComponentFixture<AccountOfficerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOfficerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountOfficerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
