export interface LoginAssociatedStudent {
  id: number;
  firstname: string;
  lastname: string;
  sex: string;
  classId: number;
  birthday: unknown;
  isFullAged: unknown;
}

export interface LoginUser {
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
  associatedStudent: LoginAssociatedStudent;
  associatedParents: unknown[];
}

export interface Login {
  user: LoginUser;
  jwt: string;
}
