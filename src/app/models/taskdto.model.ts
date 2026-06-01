import { FormTaskType } from './formtasktype';
import { TaskPriority } from './task-priority';
import { TaskStatus } from './task-status';
import { TaskcollaboratorDto } from './taskcollaborator-dto/taskcollaborator-dto.model';

export interface TaskdtoModel {
  id: number;
  userId: number;
  title: string;
  taskDescription: string | null;
  taskType: FormTaskType;
  taskPriority: TaskPriority;
  taskStatus: TaskStatus;
  dueTime: string | null;
  cancelReason: string | null;
  subTasksList?: TaskdtoModel[];
  taskCollaborators?: TaskcollaboratorDto[];
  recurrenceRule?: number | null;
  recurringTasksCount?: number | null;
  recurringSeriesId?: number | string | null;
  parentCompositeTaskId?: number | null;
  linkedTaskOrder?: number | null;
  isCompleted?: boolean;
  userName: string | null;
}
