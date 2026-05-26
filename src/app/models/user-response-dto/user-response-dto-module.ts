
export interface UserResponseDtoModule {
  id: number;
  userName: string;
  userLastName: string;
  userEmail: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
