import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDialog } from './view-dialog';

describe('ViewDialog', () => {
  let component: ViewDialog;
  let fixture: ComponentFixture<ViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
