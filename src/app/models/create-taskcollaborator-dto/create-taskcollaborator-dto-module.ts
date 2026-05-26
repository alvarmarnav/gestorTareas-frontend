import { CollaboratorRole } from '../collaborator-role';

export interface CreateTaskcollaboratorDtoModule {
  userId: number;
  collaboratorRole: CollaboratorRole;
}
