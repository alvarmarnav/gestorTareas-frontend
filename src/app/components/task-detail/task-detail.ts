import { DatePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CollaboratorRole } from '../../models/collaborator-role';
import { CreateTaskcollaboratorDto } from '../../models/create-taskcollaborator-dto/create-taskcollaborator-dto.model';
import { FormTaskType } from '../../models/formtasktype';
import { LinkedTaskResponseDtoModule } from '../../models/linked-task-response-dto/linked-task-response-dto-module';
import { TaskPriority } from '../../models/task-priority';
import { TaskStatus } from '../../models/task-status';
import { TaskcollaboratorDto } from '../../models/taskcollaborator-dto/taskcollaborator-dto.model';
import { TaskdtoModel } from '../../models/taskdto.model';
import { UserResponseDtoModule } from '../../models/user-response-dto/user-response-dto-module';
import { TaskService } from '../../services/task.service';
import { ConfirmationDeleteModal } from '../confirmation-delete-modal/confirmation-delete-modal';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, RouterLink, ReactiveFormsModule, ConfirmationDeleteModal],
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
  linkedRelations = signal<LinkedTaskResponseDtoModule[]>([]);
  error = signal<string | null>(null);

  showCollaboratorForm = signal(false);
  collaboratorFeedback = signal<string | null>(null);
  collaboratorError = signal<string | null>(null);
  availableUsers = signal<UserResponseDtoModule[]>([]);

  showRemoveCollaboratorModal = signal(false);
  selectedCollaboratorToRemove = signal<TaskcollaboratorDto | null>(null);
  linkedFeedback = signal<string | null>(null);
  linkedWarning = signal<string | null>(null);

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
    this.taskService.getLinkedRelations(id).subscribe({
      next: (relations) => this.linkedRelations.set(relations),
      error: () => this.linkedRelations.set([]),
    });
  }

  openRemoveCollaboratorModal(collaborator: TaskcollaboratorDto): void {
    this.collaboratorError.set(null);
    this.collaboratorFeedback.set(null);
    this.selectedCollaboratorToRemove.set(collaborator);
    this.showRemoveCollaboratorModal.set(true);
  }

  closeRemoveCollaboratorModal(): void {
    this.showRemoveCollaboratorModal.set(false);
    this.selectedCollaboratorToRemove.set(null);
  }

  confirmRemoveCollaborator(): void {
    const task = this.task();
    const collaborator = this.selectedCollaboratorToRemove();

    if (!task || !collaborator) {
      this.closeRemoveCollaboratorModal();
      return;
    }

    this.taskService.removeCollaborator(task.id, collaborator.userId).subscribe({
      next: () => {
        this.collaboratorFeedback.set('Colaborador eliminado correctamente.');
        this.closeRemoveCollaboratorModal();
        this.loadTask(task.id);
      },
      error: () => {
        this.collaboratorError.set('No se ha podido eliminar el colaborador.');
        this.closeRemoveCollaboratorModal();
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
    const task = this.task();

    if (!task) {
      this.availableUsers.set([]);
      return;
    }

    this.taskService.getAvailableCollaborators(task.id).subscribe({
      next: (users) => {
        this.availableUsers.set(users);
      },
      error: () => {
        this.availableUsers.set([]);
        this.collaboratorError.set('No se han podido cargar los usuarios disponibles.');
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

  collaboratorLabel(collaborator: TaskcollaboratorDto | null): string {
    if (!collaborator) {
      return '';
    }

    if (collaborator.userName && collaborator.userEmail) {
      return `${collaborator.userName} — ${collaborator.userEmail}`;
    }

    if (collaborator.userName) {
      return collaborator.userName;
    }

    return collaborator.userEmail ?? `Usuario #${collaborator.userId}`;
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

  getRelatedTask(relation: LinkedTaskResponseDtoModule): TaskdtoModel | null {
    const currentTaskId = this.task()?.id;

    if (!currentTaskId) {
      return relation.dependsOnTask ?? relation.task ?? null;
    }

    return relation.taskId === currentTaskId
      ? (relation.dependsOnTask ?? null)
      : (relation.task ?? null);
  }

  canDeleteLinkedRelation(relation: LinkedTaskResponseDtoModule): boolean {
    return !relation.dependsOnTask || relation.dependsOnTask.taskStatus === TaskStatus.Completed;
  }

  deleteLinkedRelation(relation: LinkedTaskResponseDtoModule): void {
    const currentTaskId = this.task()?.id;

    if (!currentTaskId) {
      return;
    }

    this.linkedFeedback.set(null);
    this.linkedWarning.set(null);

    if (!this.canDeleteLinkedRelation(relation)) {
      const dependencyTitle = relation.dependsOnTask?.title ?? `#${relation.dependsOnTaskId}`;

      this.linkedWarning.set(
        `No puedes borrar esta relación todavía. La tarea de la que depende (${dependencyTitle}) debe estar completada antes de quitar el vínculo.`,
      );

      return;
    }

    this.taskService.deleteLinkedRelation(currentTaskId, relation.id).subscribe({
      next: () => {
        this.linkedFeedback.set('Relación vinculada eliminada correctamente.');
        this.loadLinkedTasks(currentTaskId);
      },
      error: (err) => {
        const message =
          err?.error?.message ?? err?.error ?? 'No se ha podido eliminar la relación vinculada.';

        this.linkedWarning.set(message);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/tasks']);
  }
}
