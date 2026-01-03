import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityTypes } from './utility-types';

describe('UtilityTypes', () => {
  let component: UtilityTypes;
  let fixture: ComponentFixture<UtilityTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
