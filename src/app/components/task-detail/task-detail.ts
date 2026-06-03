import { DatePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CollaboratorRole } from '../../models/collaborator-role';
import { CreateTaskcollaboratorDto } from '../../models/create-taskcollaborator-dto/create-taskcollaborator-dto.model';
import { FormTaskType } from '../../models/formtasktype';
import { TaskPriority } from '../../models/task-priority';
import { TaskStatus } from '../../models/task-status';
import { TaskdtoModel } from '../../models/taskdto.model';
import { UserResponseDtoModule } from '../../models/user-response-dto/user-response-dto-module';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  @Input() id!: string;

  task = signal<TaskdtoModel | null>(null);
  linkedTasks = signal<TaskdtoModel[]>([]);
  error = signal<string | null>(null);

  showCollaboratorForm = signal(false);
  collaboratorFeedback = signal<string | null>(null);
  collaboratorError = signal<string | null>(null);
  availableUsers = signal<UserResponseDtoModule[]>([]);

  readonly TaskStatus = TaskStatus;
  readonly FormTaskType = FormTaskType;
  readonly CollaboratorRole = CollaboratorRole;

  collaboratorForm = this.fb.group({
    userId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    collaboratorRole: this.fb.nonNullable.control<CollaboratorRole>(CollaboratorRole.Collaborator, [
      Validators.required,
    ]),
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.loadTask(id);
    this.loadLinkedTasks(id);
  }

  private loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task.set(task);

        if (task.taskType === FormTaskType.Collaborative) {
          this.loadAvailableUsers();
        }
      },
      error: () => this.error.set('No se ha podido cargar la tarea.'),
    });
  }

  private loadLinkedTasks(id: number): void {
    this.taskService.getLinkedTasks(id).subscribe({
      next: (tasks) => this.linkedTasks.set(tasks),
      error: () => this.linkedTasks.set([]),
    });
  }

  removeCollaborator(taskId: number, userId: number): void {
    this.collaboratorError.set(null);
    this.collaboratorFeedback.set(null);

    this.taskService.removeCollaborator(taskId, userId).subscribe({
      next: () => {
        this.collaboratorFeedback.set('Colaborador eliminado correctamente.');
        this.loadTask(taskId);
      },
      error: () => {
        this.collaboratorError.set('No se ha podido eliminar el colaborador.');
      },
    });
  }

  typeLabel(type: FormTaskType | undefined): string {
    switch (type) {
      case FormTaskType.Recurring:
        return 'Recurrente';
      case FormTaskType.Composite:
        return 'Compuesta';
      case FormTaskType.SubTask:
        return 'Subtarea';
      case FormTaskType.Collaborative:
        return 'Colaborativa';
      case FormTaskType.Linked:
        return 'Vinculada';
      default:
        return 'Simple';
    }
  }

  priorityLabel(priority: TaskPriority | undefined): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'Baja';
      case TaskPriority.High:
        return 'Alta';
      case TaskPriority.Critical:
        return 'Crítica';
      default:
        return 'Normal';
    }
  }

  statusLabel(status: TaskStatus | undefined): string {
    switch (status) {
      case TaskStatus.InProgress:
        return 'En progreso';
      case TaskStatus.Completed:
        return 'Completada';
      case TaskStatus.Cancelled:
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  }

  toggleCollaboratorForm(): void {
    this.showCollaboratorForm.update((value) => !value);
    this.collaboratorFeedback.set(null);
    this.collaboratorError.set(null);
  }

  private loadAvailableUsers(): void {
    this.taskService.getUsers().subscribe({
      next: (users) => {
        const task = this.task();

        if (!task) {
          this.availableUsers.set(users);
          return;
        }

        const currentCollaboratorIds = new Set(
          task.taskCollaborators?.map((collaborator) => collaborator.userId) ?? [],
        );

        const available = users.filter((user) => {
          return user.isActive && user.id !== task.userId && !currentCollaboratorIds.has(user.id);
        });

        this.availableUsers.set(available);
      },
      error: () => {
        this.availableUsers.set([]);
        this.collaboratorError.set('No se han podido cargar los usuarios.');
      },
    });
  }

  addCollaborator(taskId: number): void {
    this.collaboratorFeedback.set(null);
    this.collaboratorError.set(null);

    if (this.collaboratorForm.invalid) {
      this.collaboratorForm.markAllAsTouched();
      return;
    }

    const dto: CreateTaskcollaboratorDto = {
      userId: Number(this.collaboratorForm.controls.userId.value),
      collaboratorRole: this.collaboratorForm.controls.collaboratorRole.value,
    };

    this.taskService.addCollaborator(taskId, dto).subscribe({
      next: () => {
        this.collaboratorFeedback.set('Colaborador añadido correctamente.');

        this.collaboratorForm.reset({
          userId: null,
          collaboratorRole: CollaboratorRole.Collaborator,
        });

        this.showCollaboratorForm.set(false);

        this.taskService.getTaskById(taskId).subscribe((task) => {
          this.task.set(task);
          this.loadAvailableUsers();
        });
      },
      error: () => {
        this.collaboratorError.set('No se ha podido añadir el colaborador.');
      },
    });
  }

  userLabel(user: UserResponseDtoModule): string {
    return `${user.userName} ${user.userLastName} — ${user.userEmail}`;
  }

  collaboratorRoleLabel(role: CollaboratorRole | number | undefined): string {
    switch (Number(role)) {
      case CollaboratorRole.TaskAdministrator:
        return 'Administrador';
      case CollaboratorRole.Collaborator:
        return 'Colaborador';
      case CollaboratorRole.Viewer:
        return 'Visualizador';
      default:
        return 'Sin rol';
    }
  }
  volver(): void {
    this.router.navigate(['/tasks']);
  }
}
