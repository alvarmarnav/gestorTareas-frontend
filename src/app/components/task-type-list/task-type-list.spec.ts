import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypeList } from './task-type-list';

describe('TaskTypeList', () => {
  let component: TaskTypeList;
  let fixture: ComponentFixture<TaskTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTypeList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskTypeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
