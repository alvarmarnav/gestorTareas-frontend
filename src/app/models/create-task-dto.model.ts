import { TaskPriority } from './task-priority';

export interface CreateTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string | null;
}
