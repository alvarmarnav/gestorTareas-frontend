import { TaskPriority } from "../task-priority"; 
export interface RecurringTaskDtoModule {
  title: string;
  taskDescription?: string | null;
  priority?: TaskPriority | null;
  dueTime: string;
  recurrenceRule: number;
}
