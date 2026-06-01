import { TaskPriority } from "../task-priority";
export interface CreateRecurringTaskDto {
  title: string ;
  taskDescription: string | null;
  priority: TaskPriority;
  dueTime: string |null;
  recurrenceRule: number;
  repeatUntilDate:string|null;
  maxOcurrences:number;
}
