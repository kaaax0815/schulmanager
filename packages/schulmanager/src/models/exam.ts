export interface Subject {
  id: number;
  name: string;
  abbreviation: string;
}

export interface StartClassHour {
  id: number;
  number: string;
  from: string;
  until: string;
  fromByDay: string[];
  untilByDay: string[];
}

export interface EndClassHour {
  id: number;
  number: string;
  from: string;
  until: string;
  fromByDay: string[];
  untilByDay: string[];
}

export interface Exam {
  subjectText: unknown;
  subject: Subject;
  comment: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  typeId: number;
  date: string;
  startClassHour: StartClassHour;
  endClassHour: EndClassHour;
}

export interface ExamRequest {
  /** @format `YYYY-MM-DD` */
  end: string;
  /** @format `YYYY-MM-DD` */
  start: string;
  student: {
    /** Id of the Student
     * @important Its not the ID of the User. Use `associatedStudent.id` from `getLoginStatus`
     */
    id: number;
  };
}
