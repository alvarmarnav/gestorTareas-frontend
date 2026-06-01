import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDeleteModal } from './confirmation-delete-modal';

describe('ConfirmationDeleteModal', () => {
  let component: ConfirmationDeleteModal;
  let fixture: ComponentFixture<ConfirmationDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDeleteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDeleteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
