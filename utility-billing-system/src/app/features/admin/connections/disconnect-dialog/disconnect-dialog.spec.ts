import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectDialog } from './disconnect-dialog';

describe('DisconnectDialog', () => {
  let component: DisconnectDialog;
  let fixture: ComponentFixture<DisconnectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisconnectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisconnectDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
