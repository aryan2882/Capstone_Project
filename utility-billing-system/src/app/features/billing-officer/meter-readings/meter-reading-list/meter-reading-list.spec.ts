import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReadingListComponent } from './meter-reading-list';

describe('MeterReadingList', () => {
  let component: MeterReadingListComponent;
  let fixture: ComponentFixture<MeterReadingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeterReadingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterReadingListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
