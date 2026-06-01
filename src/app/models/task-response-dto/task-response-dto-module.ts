import { FormTaskType } from '../formtasktype';
import { TaskPriority } from '../task-priority';
import { TaskStatus } from '../task-status';
import { TaskcollaboratorDto } from '../taskcollaborator-dto/taskcollaborator-dto.model';

export interface TaskResponseDtoModule {
  id: number;
  title: string;
  userId: number;
  taskDescription?: string | null;
  taskType?: FormTaskType;
  taskPriority: TaskPriority;
  taskStatus?: TaskStatus | null;
  dueTime?: string | null;
  cancelReason?: string | null;
  subTasksList?: TaskResponseDtoModule[];
  taskCollaborators?: TaskcollaboratorDto[];
  recurrenceRule?: number | null;
  recurringTasksCount?: number | null;
  recurringSeriesId?: number | string | null;
  parentCompositeTaskId?: number | null;
  linkedTaskOrder?: number | null;
}
