import { TaskPriority } from '../task-priority';
export interface CreateSubTaskDto {
  title: string;
  taskDescription?: string | null;
  taskPriority?: TaskPriority | null;
  dueTime?: string | null;
}
