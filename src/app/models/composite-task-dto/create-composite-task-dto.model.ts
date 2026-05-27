import { TaskPriority } from '../task-priority';
export interface CreateCompositeTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string | null;
}
