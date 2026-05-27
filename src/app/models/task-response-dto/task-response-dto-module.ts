import { TaskStatus } from '../task-status';
import { TaskPriority } from '../task-priority';
import { TaskcollaboratorDtoModule } from '../taskcollaborator-dto/taskcollaborator-dto-module';

export interface TaskResponseDtoModule {
  id: number;
  title: string;
  userId: number;
  taskDescription?: string | null;
  taskPriority: TaskPriority;
  taskStatus?: TaskStatus | null;
  dueTime?: string | null;
  cancelReason?: string | null;
  taskType?: string;
  userList:TaskcollaboratorDtoModule[]|null;
}
