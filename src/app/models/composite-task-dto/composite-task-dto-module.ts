import { TaskPriority } from '../task-priority';
export interface CompositeTaskDtoModule {
  title: string;
  taskDescription?: string | null;
  priority?: TaskPriority | null;
  dueTime?: string | null;
}
