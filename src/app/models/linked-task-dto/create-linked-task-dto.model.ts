export interface CreateLinkedTaskDto {
  dependsOnTaskId: number;
  linkedTaskOrder: number;
}
