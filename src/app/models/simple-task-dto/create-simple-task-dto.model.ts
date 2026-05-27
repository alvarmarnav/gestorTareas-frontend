import { TaskPriority } from "../task-priority";
export interface CreateSimpleTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string | null;}
