export interface AssociatedStudent {
  id: number;
  firstname: string;
  lastname: string;
  sex: string;
  classId: number;
  birthday: unknown;
  isFullAged: unknown;
}

export interface User {
  email: string;
  username: unknown;
  localUsername: unknown;
  id: number;
  hasAdministratorRights: boolean;
  roles: unknown;
  lastSeenNotificationTimestamp: string;
  firstname: string;
  lastname: string;
  associatedTeachers: unknown[];
  associatedStudent: AssociatedStudent;
  associatedParents: unknown[];
}

export interface LoginStatus {
  isAuthenticated: boolean;
  user: User;
}
