import { DatePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormTaskType } from '../../models/formtasktype';
import { TaskPriority } from '../../models/task-priority';
import { TaskStatus } from '../../models/task-status';
import { TaskdtoModel } from '../../models/taskdto.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  @Input() id!: string;
  task = signal<TaskdtoModel | null>(null);
  linkedTasks = signal<TaskdtoModel[]>([]);
  error = signal<string | null>(null);

  readonly TaskStatus = TaskStatus;
  readonly FormTaskType = FormTaskType;

  ngOnInit(): void {
    // Leer el parámetro :id de la URL actual
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      // Si no hay id válido, redirigir a la lista
      this.router.navigate(['/tasks']);
      return;
    }
    // Cargar la tarea con ese id
    this.taskService.getTaskById(id).subscribe({
      next: (task) => this.task.set(task),
      error: () => this.error.set('No se ha podido cargar la tarea.'),
    });
    this.taskService.getLinkedTasks(id).subscribe({
      next: (tasks) => this.linkedTasks.set(tasks),
      error: () => this.linkedTasks.set([]),
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

  volver(): void {
    this.router.navigate(['/tasks']);
  }
}
