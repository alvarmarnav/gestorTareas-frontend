import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { futureDateValidator } from '../../core/validators/future-date-validator.validator';
import { CreateCompositeTaskDto } from '../../models/composite-task-dto/create-composite-task-dto.model';
import { CreateCollaborativeTaskDto } from '../../models/create-collaborativetask-dto.model';
import { CreateTaskDto } from '../../models/create-task-dto.model';
import { FormTaskType } from '../../models/formtasktype';
import { CreateRecurringTaskDto } from '../../models/recurring-task-dto/create-recurring-task-dto.model';
import { TaskPriority } from '../../models/task-priority';
import { TaskService } from '../../services/task.service';
import { CreateSubtask } from '../create-subtask/create-subtask';
@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, CreateSubtask],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected taskService = inject(TaskService);

  readonly FormTaskType = FormTaskType;
  readonly TaskPriority = TaskPriority;

  taskId: number | null = null;
  showSubTaskModal = false;
  createdCompositeTaskId: number | null = null;
  formError = '';

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    taskDescription: [''],
    dueTime: [null as string | null, futureDateValidator()],
    taskType: this.fb.nonNullable.control<FormTaskType>(FormTaskType.Simple, [Validators.required]),
    priority: this.fb.nonNullable.control<TaskPriority>(TaskPriority.Normal, [Validators.required]),
    recurrenceRule: this.fb.control<number | null>(null),
    dependsOnTaskId: this.fb.control<number | null>(null),
    linkedTaskOrder: this.fb.control<number | null>(null),
    repeatUntilDate: this.fb.control<string | null>(null),
    maxOcurrences: this.fb.control<number | null>(null),
  });

  get formTitle(): string {
    return this.taskId ? 'Editar tarea' : 'Nueva tarea';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.taskId = Number(id);

      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.form.patchValue({
          title: task.title,
          taskDescription: task.taskDescription ?? '',
          dueTime: task.dueTime,
          taskType: (task.taskType as FormTaskType) ?? FormTaskType.Simple,
          priority: Number(task.taskPriority) ?? (TaskPriority.Normal as TaskPriority),
          recurrenceRule: task.recurrenceRule ?? null,
        });
      });
    }

    //Escuchar el campo seleccionado
    this.form.controls.taskType.valueChanges.subscribe((type) => {
      this.changeTaskType(type ?? null);
    });

    this.changeTaskType(this.form.controls.taskType.value ?? null);
  }

  onSubmit(): void {
    this.formError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const type = this.form.controls.taskType.value;

    if (this.taskId && type !== FormTaskType.Linked) {
      const dto = this.buildBaseDto();

      this.taskService.update(this.taskId, dto).subscribe(() => {
        this.router.navigate(['/tasks']);
      });

      return;
    }

    switch (type) {
      case FormTaskType.Simple:
        this.create();
        break;

      case FormTaskType.Recurring:
        this.createRecurringTask();
        break;

      case FormTaskType.Composite:
        this.createCompositeTask();
        break;

      case FormTaskType.Collaborative:
        this.createCollaborativeTask();
        break;

      case FormTaskType.Linked:
        this.createLinkedRelation();
        break;

      default:
        console.error('Error en el tipo de Tarea:', type);
        break;
    }
  }

  private buildBaseDto(): CreateTaskDto {
    const value = this.form.value;

    return {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: value.dueTime ?? null,
      priority: Number(value.priority ?? TaskPriority.Normal) as TaskPriority,
    };
  }

  private create(): void {
    const dto = this.buildBaseDto();

    this.taskService.create(dto).subscribe(() => {
      this.resetForm();
      this.router.navigate(['/tasks']); //vamos al menú principal
    });
  }

  private createRecurringTask(): void {
    const value = this.form.value;

    const dto: CreateRecurringTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: this.toIsoDateOrNull(value.dueTime),
      priority: value.priority ?? TaskPriority.Normal,
      recurrenceRule: Number(value.recurrenceRule ?? 7),
      repeatUntilDate: this.toIsoDateOrNull(value.repeatUntilDate),
      maxOcurrences: Number(value.maxOcurrences ?? 10),
    };

    this.taskService.createRecurring(dto).subscribe(() => {
      this.resetForm();
      this.router.navigate(['/tasks']);
    });
  }

  private createCompositeTask(): void {
    const value = this.form.value;

    const dto: CreateCompositeTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: this.toIsoDateOrNull(value.dueTime),
      priority: value.priority ?? TaskPriority.Normal,
    };

    this.taskService.createComposite(dto).subscribe((createdTask) => {
      this.createdCompositeTaskId = createdTask.id;
      this.showSubTaskModal = true;
      this.resetForm();
    });
  }

  closeSubtaskModal(): void {
    this.showSubTaskModal = false;
    this.createdCompositeTaskId = null;
    this.resetForm();
    this.router.navigate(['/tasks']);
  }

  private createCollaborativeTask(): void {
    const value = this.form.value;

    const dto: CreateCollaborativeTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: this.toIsoDateOrNull(value.dueTime),
      priority: value.priority ?? TaskPriority.Normal,
    };

    this.taskService.createCollaborative(dto).subscribe((createdTask) => {
      this.resetForm();

      this.router.navigate(['/tasks']);
    });
  }

  private createLinkedRelation(): void {
    if (!this.taskId) {
      this.formError =
        'Crear una relación entre tareas solo puede hacerse si ya existen las tareas.';
      return;
    }
    const value = this.form.value;
    const dependsOnTaskId = Number(value.dependsOnTaskId);
    const linkedTaskOrder = Number(value.linkedTaskOrder);

    if (!dependsOnTaskId || dependsOnTaskId <= 0) {
      this.form.get('dependsOnTaskId')?.markAsTouched();
      return;
    }

    if (!linkedTaskOrder || linkedTaskOrder <= 0) {
      this.form.get('linkedTaskOrder')?.markAsTouched();
      return;
    }

    this.taskService
      .addLinkedRelation(this.taskId, {
        dependsOnTaskId,
        linkedTaskOrder,
      })
      .subscribe(() => {
        this.router.navigate(['/tasks']);
      });
  }

  changeTaskType(type: FormTaskType | null): void {
    this.clearDynamicValidators();

    switch (type) {
      case FormTaskType.Recurring:
        this.form.controls.dueTime.setValidators([Validators.required, futureDateValidator()]);
        this.form.controls.recurrenceRule.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(365),
        ]);
        this.form.controls.repeatUntilDate.setValidators([
          Validators.required,
          futureDateValidator(),
        ]);
        this.form.controls.maxOcurrences.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]);
        if (!this.form.controls.recurrenceRule.value) {
          this.form.controls.recurrenceRule.setValue(7);
        }

        if (!this.form.controls.maxOcurrences.value) {
          this.form.controls.maxOcurrences.setValue(10);
        }

        break;

      case FormTaskType.Linked:
        this.form.controls.dependsOnTaskId.setValidators([Validators.required, Validators.min(1)]);

        this.form.controls.linkedTaskOrder.setValidators([Validators.required, Validators.min(1)]);

        if (!this.form.controls.linkedTaskOrder.value) {
          this.form.controls.linkedTaskOrder.setValue(1);
        }

        break;

      case FormTaskType.Simple:
      case FormTaskType.Composite:
      case FormTaskType.Collaborative:
      default:
        break;
    }
    this.form.controls.recurrenceRule.updateValueAndValidity();
    this.form.controls.dependsOnTaskId.updateValueAndValidity();
    this.form.controls.linkedTaskOrder.updateValueAndValidity();
    this.form.controls.repeatUntilDate.updateValueAndValidity();
    this.form.controls.maxOcurrences.updateValueAndValidity();
    this.form.controls.dueTime.updateValueAndValidity();
  }

  private clearDynamicValidators(): void {
    this.form.controls.recurrenceRule.clearValidators();
    this.form.controls.dependsOnTaskId.clearValidators();
    this.form.controls.linkedTaskOrder.clearValidators();
    this.form.controls.repeatUntilDate.clearValidators();
    this.form.controls.maxOcurrences.clearValidators();

    this.form.controls.dueTime.setValidators([futureDateValidator()]);

    this.form.controls.recurrenceRule.setValue(null);
    this.form.controls.dependsOnTaskId.setValue(null);
    this.form.controls.linkedTaskOrder.setValue(null);
    this.form.controls.repeatUntilDate.setValue(null);
    this.form.controls.maxOcurrences.setValue(null);

    this.form.controls.recurrenceRule.updateValueAndValidity();
    this.form.controls.dependsOnTaskId.updateValueAndValidity();
    this.form.controls.linkedTaskOrder.updateValueAndValidity();
    this.form.controls.repeatUntilDate.updateValueAndValidity();
    this.form.controls.maxOcurrences.updateValueAndValidity();
    this.form.controls.dueTime.updateValueAndValidity();
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      taskDescription: '',
      dueTime: null,
      taskType: FormTaskType.Simple,
      priority: TaskPriority.Normal,
      recurrenceRule: null,
      dependsOnTaskId: null,
      linkedTaskOrder: null,
      repeatUntilDate: null,
      maxOcurrences: null,
    });
  }

  get title() {
    return this.form.controls.title;
  }
  get dueTime() {
    return this.form.controls.dueTime;
  }
  get type() {
    return this.form.controls.taskType;
  }
  get recurrenceRule() {
    return this.form.controls.recurrenceRule;
  }
  get dependsOnTaskId() {
    return this.form.controls.dependsOnTaskId;
  }
  get linkedTaskOrder() {
    return this.form.controls.linkedTaskOrder;
  }
  get repeatUntilDate() {
    return this.form.controls.repeatUntilDate;
  }
  get maxOcurrences() {
    return this.form.controls.maxOcurrences;
  }
  cancel(): void {
    this.router.navigate(['/tasks']);
  }

  private toIsoDateOrNull(value: string | null | undefined): string | null {
    if (!value) return null;
    const date = new Date(`${value}T23:59:00`);
    return date.toISOString();
  }
}
