import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { futureDateValidator } from '../../core/validators/future-date-validator.validator';
import { CreateSubTaskDto } from '../../models/sub-task-dto/create-sub-task-dto.model';
import { TaskPriority } from '../../models/task-priority';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-create-subtask',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-subtask.html',
  styleUrl: './create-subtask.css',
})
export class CreateSubtask {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected taskService = inject(TaskService);
  // title: any;
  // dueTime: any;

  @Input({ required: true }) compositeTaskId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  readonly TaskPriority = TaskPriority;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    taskDescription: [''],
    taskPriority: this.fb.nonNullable.control<TaskPriority>(
      this.TaskPriority.Normal,
      Validators.required,
    ),
    dueTime: [null as string | null, futureDateValidator()],
  });

  get title() {
    return this.form.controls.title;
  }

  get dueTime() {
    return this.form.controls.dueTime;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    const dto: CreateSubTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      taskPriority: value.taskPriority ?? TaskPriority.Normal,
      dueTime: this.toIsoDateOrNull(value.dueTime) ?? null,
    };

    this.taskService.createSubTask(this.compositeTaskId, dto).subscribe(() => {
      this.created.emit();
      this.close.emit();
    });
  }

  cancel(): void {
    this.close.emit();
  }
  private toIsoDateOrNull(value: string | null | undefined): string | null {
    if (!value) return null;
    return new Date(`${value}T23:59:00`).toISOString();
  }
}
