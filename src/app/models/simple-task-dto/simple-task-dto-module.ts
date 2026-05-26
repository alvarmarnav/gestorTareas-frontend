import { TaskPriority } from "../task-priority";
export interface SimpleTaskDtoModule {
  title: string;
  taskDescription?: string | null;
  priority?: TaskPriority | null;
  dueTime?: string | null;}
