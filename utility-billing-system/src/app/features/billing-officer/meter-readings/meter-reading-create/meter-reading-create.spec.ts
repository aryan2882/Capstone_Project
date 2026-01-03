import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReadingCreate } from './meter-reading-create';

describe('MeterReadingCreate', () => {
  let component: MeterReadingCreate;
  let fixture: ComponentFixture<MeterReadingCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeterReadingCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterReadingCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
