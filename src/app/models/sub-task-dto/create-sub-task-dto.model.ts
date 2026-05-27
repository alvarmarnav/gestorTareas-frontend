import { TaskPriority } from '../task-priority';
export interface CreateSubTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string | null;
}
