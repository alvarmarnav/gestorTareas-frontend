import { TaskStatus } from '../task-status';
import { TaskPriority } from '../task-priority';
import { TaskcollaboratorDto} from '../taskcollaborator-dto/taskcollaborator-dto.model';

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
  userList:TaskcollaboratorDto[]|null;
}
