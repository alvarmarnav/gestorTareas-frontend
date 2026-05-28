import { TaskStatus } from "./task-status";
import { TaskcollaboratorDto } from "./taskcollaborator-dto/taskcollaborator-dto.model";
import { TaskPriority } from "./task-priority";
import { TaskType } from "./task-type";


export interface TaskdtoModel {
  id: number;
  userId:number;
  title: string;
  taskDescription: string|null;
  taskPriority:TaskPriority;
  taskStatus:TaskStatus;
  dueTime: string | null;
  cancelReason:string|null;
  userList: TaskcollaboratorDto[]
  taskType: string;
  isCompleted?: boolean;
  userName: string;
}
