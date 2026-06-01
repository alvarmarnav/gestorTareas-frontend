import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubtask } from './create-subtask';

describe('CreateSubtask', () => {
  let component: CreateSubtask;
  let fixture: ComponentFixture<CreateSubtask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubtask],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSubtask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
