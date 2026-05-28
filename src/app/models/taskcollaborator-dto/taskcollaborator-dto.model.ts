import { CollaboratorRole } from '../collaborator-role';

export interface TaskcollaboratorDto{
  userId: number;
  userName?: string;
  userEmail?: string;
  collaboratorRole: CollaboratorRole;
  addedAt?: string;
}
