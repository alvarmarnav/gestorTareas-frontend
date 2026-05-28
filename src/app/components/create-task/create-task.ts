import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CreateTaskDto } from '../../models/create-task-dto.model';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { futureDateValidator } from '../../core/validators/future-date-validator.validator';
import { CreateRecurringTaskDto } from '../../models/recurring-task-dto/create-recurring-task-dto.model';
import { CreateCompositeTaskDto } from '../../models/composite-task-dto/create-composite-task-dto.model';
import { FormTaskType } from '../../models/formtasktype';
import { TaskPriority } from '../../models/task-priority';
import { CreateCollaborativeTaskDto } from '../../models/create-collaborativetask-dto.model';
@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  readonly FormTaskType = FormTaskType;
  readonly TaskPriority = TaskPriority;

  taskId: number | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    taskDescription: [''],
    dueTime: [null as string | null, futureDateValidator()],
    taskType: this.fb.nonNullable.control<FormTaskType>(FormTaskType.Simple, [Validators.required]),
    priority: this.fb.nonNullable.control<TaskPriority>(TaskPriority.Normal, [Validators.required]),
    recurrenceRule: this.fb.control<number | null>(null),

    dependsOnTaskId: this.fb.control<number | null>(null),

    linkedTaskOrder: this.fb.control<number | null>(null),
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
          priority: Number(task.taskPriority) ?? TaskPriority.Normal,
          // recurrenceRule:task.recurrenceRule??7,
          // userId: task.userId
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
    if (this.form.invalid) return;

    const type = this.form.controls.taskType.value;

    if (this.taskId && type !== FormTaskType.Linked) {
      const dto = this.buildBaseDto();

      this.taskService.update(this.taskId, dto).subscribe(() => {
        this.router.navigate(['/tasks']);
      });

      return;
    }

    // const dto = this.form.value as CreateTaskDto;

    // const operation = this.taskId
    //   ? this.taskService.update(this.taskId, dto)
    //   : this.taskService.create(dto);
    // operation.subscribe(() => {
    //   this.form.reset();
    //   this.router.navigate(['/tasks']);
    // });

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

  ///
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
      dueTime: value.dueTime ?? null,
      priority: value.priority ?? TaskPriority.Normal,
      recurrenceRule: Number(value.recurrenceRule ?? 7),
    };

    this.taskService.createRecurring(dto).subscribe(() => {
      this.resetForm();
      this.router.navigate(['/tasks']);
    });
  }

  private createCompositeTask(): void {
    const value = this.form.value;

    var formattedDueTime: string | null = null;

    if (value.dueTime) {
    const taskDate = value.dueTime ? new Date(value.dueTime) : new Date();
    const [hours, minutes] = value.dueTime.split(':').map(Number);
    
    taskDate.setHours(hours, minutes, 0, 0);
    formattedDueTime = taskDate.toISOString(); // Genera: "2026-05-28T14:30:00.000Z"
  }
    const dto: CreateCompositeTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: formattedDueTime,
      priority: value.priority ?? TaskPriority.Normal,
    };

    this.taskService.createComposite(dto).subscribe((createdTask) => {
      this.resetForm();
      //  crear subtarea.
      this.router.navigate(['/tasks/', createdTask.id, 'edit']);
    });
  }

  private createCollaborativeTask(): void {
    const value = this.form.value;

     var formattedDueTime: string | null = null;

    if (value.dueTime) {
    const taskDate = value.dueTime ? new Date(value.dueTime) : new Date();
    const [hours, minutes] = value.dueTime.split(':').map(Number);
    
    taskDate.setHours(hours, minutes, 0, 0);
    formattedDueTime = taskDate.toISOString(); // Genera: "2026-05-28T14:30:00.000Z"
  }

    const dto: CreateCollaborativeTaskDto = {
      title: value.title ?? '',
      taskDescription: value.taskDescription ?? '',
      dueTime: formattedDueTime,
      priority: value.priority ?? TaskPriority.Normal,
    };

    this.taskService.createCollaborative(dto).subscribe((createdTask) => {
      this.resetForm();
      
      // añadir colaborador.
      // console.log(createdTask)
      this.router.navigate(['/tasks']);
    });
  }

  private createLinkedRelation(): void {
    if (!this.taskId) {
      console.error('Crear una relación entre tareas solo puede hacerse si ya existen las tareas.');
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
        this.form.controls.recurrenceRule.setValidators([Validators.required, Validators.min(1)]);
        if (!this.form.controls.recurrenceRule.value) {
          this.form.controls.recurrenceRule.setValue(7);
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
  }

  private clearDynamicValidators(): void {
    this.form.controls.recurrenceRule.clearValidators();
    this.form.controls.dependsOnTaskId.clearValidators();
    this.form.controls.linkedTaskOrder.clearValidators();

    this.form.controls.recurrenceRule.setValue(null);
    this.form.controls.dependsOnTaskId.setValue(null);
    this.form.controls.linkedTaskOrder.setValue(null);

    this.form.controls.recurrenceRule.updateValueAndValidity();
    this.form.controls.dependsOnTaskId.updateValueAndValidity();
    this.form.controls.linkedTaskOrder.updateValueAndValidity();
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
    });
  }

  /////

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

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}

// patchValue() — rellena solo los campos indicados
// Los campos no mencionados mantienen su valor actual
// this.form.patchValue({
// title: 'Preparar informe trimestral',
// type: 'Simple'
// // descripcion, fechaLimite y usuarioId no cambian
// });
