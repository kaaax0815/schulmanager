export interface Letter {
  title: string;
  id: number;
  createdAt: string;
  studentStatuses: StudentStatus[];
}

export interface StudentStatus {
  id: number;
  readTimestamp: string | null;
  sentTimestamp: string;
  studentId: number;
}
