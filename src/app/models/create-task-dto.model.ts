import { FormTaskType } from "./formtasktype";
import { TaskPriority } from "./task-priority";

export interface CreateTaskDto {
  // id: number;
  // userId?: number;
  title: string;
  taskDescription: string|null;
  priority : TaskPriority;
  // taskStatus?: string;
  dueTime: string | null;
  // cancelReason?: string;
  // linkedTaskOrder?: number;
  // recurrenceRule?: number;
  // isCompleted?: boolean;
  // userName: string;
  //  type: FormTaskType | FormTaskType.Simple;
}
