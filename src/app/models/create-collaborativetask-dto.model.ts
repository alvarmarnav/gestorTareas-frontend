import { TaskPriority } from "./task-priority";

export interface CreateCollaborativeTaskDto {
  title: string;
  taskDescription: string | null;
  priority: TaskPriority |  TaskPriority.Normal;
  dueTime: string | null;
}
