export interface ALesson {
  room: Room;
  subject: LessonSubject;
  teachers: Teacher[];
  classes: Room[];
  studentGroups: StudentGroup[];
  comment: null | string;
  subjectLabel: string;
  lessonId?: number;
  courseId?: number;
  substitutionId?: number;
}

export interface Room {
  id: number;
  name: string;
}

export interface StudentGroup {
  id: number;
  name: string;
  classId: number | null;
}

export interface LessonSubject {
  id: number;
  abbreviation: string;
  name: string;
  isPseudoSubject: boolean;
}

export interface Teacher {
  id: number;
  abbreviation: string;
  firstname: string;
  lastname: string;
}

export interface ClassHour {
  id: number;
  number: string;
}

export interface LessonEvent {
  text: string;
  teachers: Teacher[];
  classes: Room[];
  studentGroups: StudentGroup[];
  absenceId: number;
}

export interface Lesson {
  date: string;
  classHour: ClassHour;
  actualLesson?: ALesson;
  comment?: null | string;
  originalLessons?: ALesson[];
  isCancelled?: boolean;
  isSubstitution?: boolean;
  event?: LessonEvent;
  isNew?: boolean;
}

export interface LessonRequest {
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
