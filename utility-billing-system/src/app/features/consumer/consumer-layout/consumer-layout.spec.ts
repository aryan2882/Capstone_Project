import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerLayout } from './consumer-layout';

describe('ConsumerLayout', () => {
  let component: ConsumerLayout;
  let fixture: ComponentFixture<ConsumerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
