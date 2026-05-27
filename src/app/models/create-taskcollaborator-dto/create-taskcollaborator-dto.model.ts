import { CollaboratorRole } from '../collaborator-role';

export interface CreateTaskcollaboratorDto {
  userId: number;
  collaboratorRole: CollaboratorRole;
}
