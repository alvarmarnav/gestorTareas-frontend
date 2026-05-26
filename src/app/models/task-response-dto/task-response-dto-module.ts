import { TaskStatus } from '../task-status';
import { TaskPriority } from '../task-priority';

export interface TaskResponseDtoModule {
  id: number;
  title: string;
  userId: number;
  taskDescription?: string | null;
  taskPriority?: TaskPriority | null;
  taskStatus?: TaskStatus | null;
  dueTime?: string | null;
  cancelReason?: string | null;
  taskType?: string;
}
