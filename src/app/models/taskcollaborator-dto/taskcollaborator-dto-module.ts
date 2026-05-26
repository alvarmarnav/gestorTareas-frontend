import { CollaboratorRole } from '../collaborator-role';

export interface TaskcollaboratorDtoModule {
  userId: number;
  userName?: string;
  userEmail?: string;
  collaboratorRole: CollaboratorRole;
  addedAt?: string;
}
