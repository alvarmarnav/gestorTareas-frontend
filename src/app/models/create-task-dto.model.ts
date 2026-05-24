export interface CreateTaskDto {
  id: number;
  userId?: number;
  title: string;
  taskDescription?: string;
  taskPriority?: string;
  taskStatus?: string;
  dueTime: string | null;
  cancelReason?: string;
  linkedTaskOrder?: number;
  recurrenceRule?: number;
  isCompleted?: boolean;
  userName: string;
  type: 'Simple' | 'Recurrente';
}
