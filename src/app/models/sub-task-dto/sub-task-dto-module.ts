import { TaskPriority } from '../task-priority';
export interface SubTaskDtoModule {
  title: string;
  taskDescription?: string | null;
  priority?: TaskPriority | null;
  dueTime?: string | null;
}
