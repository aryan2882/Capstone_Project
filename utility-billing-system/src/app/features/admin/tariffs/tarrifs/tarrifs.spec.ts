import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tarrifs } from './tarrifs';

describe('Tarrifs', () => {
  let component: Tarrifs;
  let fixture: ComponentFixture<Tarrifs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tarrifs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tarrifs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
