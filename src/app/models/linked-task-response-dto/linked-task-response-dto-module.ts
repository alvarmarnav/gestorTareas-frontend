import { TaskdtoModel } from '../taskdto.model';

export interface LinkedTaskResponseDtoModule {
  id: number;
  taskId: number;
  dependsOnTaskId: number;
  linkedTaskOrder: number;
  task?: TaskdtoModel | null;
  dependsOnTask?: TaskdtoModel | null;
}
