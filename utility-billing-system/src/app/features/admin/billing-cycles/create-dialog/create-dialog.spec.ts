import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillingCycleDialogComponent } from './create-dialog';

describe('CreateDialog', () => {
  let component: CreateBillingCycleDialogComponent;
  let fixture: ComponentFixture<CreateBillingCycleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBillingCycleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBillingCycleDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
