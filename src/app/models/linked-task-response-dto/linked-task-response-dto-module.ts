export interface LinkedTaskResponseDtoModule {
  id: number;
  taskId: number;
  dependsOnTaskId: number;
  linkedTaskOrder: number;
}
