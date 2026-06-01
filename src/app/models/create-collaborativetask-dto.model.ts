import { TaskPriority } from './task-priority';

export interface CreateCollaborativeTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string | null;
}
