import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormTaskType } from '../../models/formtasktype';
import { TaskService } from '../../services/task.service';
import { TaskCard } from '../task-card/task-card';

type TaskTypeRouteConfig = {
  title: string;
  subtitle: string;
  taskType: FormTaskType | null;
  emptyMessage: string;
  isLinkedList?: boolean;
};

@Component({
  selector: 'app-task-type-list',
  standalone: true,
  imports: [TaskCard, RouterLink],
  templateUrl: './task-type-list.html',
  styleUrl: './task-type-list.css',
})
export class TaskTypeList implements OnInit {
  protected taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  private readonly typeMap: Record<string, TaskTypeRouteConfig> = {
    composite: {
      title: 'Tareas compuestas',
      subtitle: 'Listado de tareas contenedoras con subtareas.',
      taskType: FormTaskType.Composite,
      emptyMessage: 'No hay tareas compuestas disponibles.',
    },
    collaborative: {
      title: 'Tareas colaborativas',
      subtitle: 'Listado de tareas colaborativas.',
      taskType: FormTaskType.Collaborative,
      emptyMessage: 'No hay tareas colaborativas disponibles.',
    },
    recurring: {
      title: 'Tareas recurrentes',
      subtitle: 'Listado de tareas recurrentes.',
      taskType: FormTaskType.Recurring,
      emptyMessage: 'No hay tareas recurrentes disponibles.',
    },
    linked: {
      title: 'Tareas vinculadas',
      subtitle: 'Listado de tareas que tienen relaciones con otras tareas.',
      taskType: null,
      emptyMessage: 'No hay tareas vinculadas disponibles.',
      isLinkedList: true,
    },
  };

  readonly currentConfig = signal<TaskTypeRouteConfig | null>(null);

  readonly filteredTasks = computed(() => {
    const config = this.currentConfig();

    if (!config) {
      return [];
    }

    if (config.isLinkedList) {
      return this.taskService.tasks();
    }

    return this.taskService.tasks().filter((task) => {
      return this.normalizeTaskType(task.taskType) === config.taskType;
    });
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') ?? '';
      const config = this.typeMap[type];

      this.currentConfig.set(config ?? null);

      if (!config) {
        return;
      }

      if (config.isLinkedList) {
        this.taskService.loadLinkedTasks().subscribe();
        return;
      }

      this.taskService.loadTasks(1, 100).subscribe();
    });
  }

  onComplete(id: number): void {
    this.taskService.complete(id).subscribe();
  }

  onDelete(id: number): void {
    this.taskService.delete(id).subscribe();
  }

  private normalizeTaskType(value: unknown): FormTaskType | null {
    const numericValue = Number(value);

    if (!Number.isNaN(numericValue)) {
      return numericValue as FormTaskType;
    }

    const textValue = String(value).toLowerCase();

    switch (textValue) {
      case 'simple':
      case 'simpletask':
        return FormTaskType.Simple;

      case 'recurring':
      case 'recurringtask':
        return FormTaskType.Recurring;

      case 'composite':
      case 'compositetask':
        return FormTaskType.Composite;

      case 'subtask':
        return FormTaskType.SubTask;

      case 'collaborative':
      case 'collaborativetask':
        return FormTaskType.Collaborative;

      case 'linked':
      case 'linkedtask':
        return FormTaskType.Linked;

      default:
        return null;
    }
  }
}
