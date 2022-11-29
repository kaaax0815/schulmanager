export interface Calendar {
  organizerRequired: boolean;
}

export interface Corona {
  studentsCanSeeAbsentDays: boolean;
}

export interface Courseselection {
  subjectSelectionOpenForStudents: boolean;
  seminarSelectionOpenForStudents: boolean;
}

export interface Learning {
  allowExternalEmbeds: boolean;
  displayUnitsToClassTeachersAndAdministrators: boolean;
  displayAccessCodesToTeachers: string;
}

export interface Substitutions {
  printAbsentTeachers: boolean;
  printAbsentClasses: boolean;
}

export interface Messenger {
  includeStudents: boolean;
  studentsCanContactTeachers: boolean;
  includeParents: boolean;
  parentsCanContactTeachers: boolean;
}

export interface Grades {
  gradesAreVisibleForParents: boolean;
  parentVisibilityDelay: number;
  finalGradesAreVisibleForParents: boolean;
}

export interface Exports {
  teacherPattern: unknown;
  studentPattern: unknown;
}

export interface Absences {
  allTeachersCanEditAllAbsences: boolean;
  absenceListsShouldContainComments: boolean;
}

export interface Classbook {
  showTopic: boolean;
  showComment: boolean;
  showHomework: boolean;
  homeworkIsVisibleForStudents: boolean;
  topicsAreVisibleForStudents: boolean;
  teachersHaveToSaveAbsences: boolean;
  teachersHaveToEnterTopic: boolean;
  reportsVisibleForParents: boolean;
  entriesVisibleForParents: boolean;
  teachersCanEnterSickNotes: boolean;
  teachersCanEnterInternalExemptions: boolean;
  teachersCanChangeSubjectOfLesson: boolean;
  teachersCanEditCourseStudents: boolean;
  enableWeekOverview: boolean;
}

export interface Resources {
  resourceBookingDays: string;
}

export interface Invoicing {
  operationMode: string;
}

export interface Schoolpractice {
  practiceLessonDay: number;
}

export interface Exams {
  examBookingDays: number;
  allowExamsDuringBlocks: boolean;
  showWeekView: boolean;
  showMonthView: boolean;
  showMonthsView: boolean;
  showYearView: boolean;
}

export interface Sick {
  onlineHint: string;
  formHint: string;
  requireSignature: boolean;
  allowCommentsByParents: boolean;
  automaticallyExcuseOnlineSickNotes: boolean;
  allowSickNotesAfterFirstClassHourStarted: boolean;
  allowOnlyForCertainClasses: boolean;
  allowedClassIds: unknown[];
  leftEarlierFormSigners: string[];
}

export interface Timing {
  start: number;
  end: number;
}

export interface Meetings {
  timings: Timing[];
  minimumDaysInAdvance: number;
  maximumDaysInAdvance: number;
}

export interface Schedules {
  visibleForTeachers: boolean;
  visibleForStudents: boolean;
  visibleDaysInThePastForStudents: unknown;
  visibleDaysInTheFutureForStudents: unknown;
}

export interface Letters {
  teachersCanCreateLetters: boolean;
  teachersCanSendLetters: boolean;
}

export interface Exemptions {
  requireSignature: boolean;
  minimumDaysInAdvance: number;
  maximumDaysForClassTeacherToGrantExemption: number;
}

export interface Detention {
  maximumNumberOfAttendancesPerEvent: number;
  minimumDaysInAdvance: number;
  defaultDurationInMinutes: number;
}

export interface SecurityRules {
  loginTimeoutAdministrators: number;
  loginTimeoutTeachers: number;
  loginTimeoutStudents: number;
  loginTimeoutOtherUsers: number;
  timetableSource: string;
  studentAttendanceSource: string;
  enforceTwoFactorAuthenticationForStudents: boolean;
  enforceTwoFactorAuthenticationForTeachers: boolean;
  enforceTwoFactorAuthenticationForAdministrators: boolean;
  firstDayOfTeachingWeek: number;
  lastDayOfTeachingWeek: number;
}

export interface Settings {
  calendar: Calendar;
  corona: Corona;
  courseselection: Courseselection;
  learning: Learning;
  substitutions: Substitutions;
  messenger: Messenger;
  grades: Grades;
  exports: Exports;
  absences: Absences;
  classbook: Classbook;
  resources: Resources;
  invoicing: Invoicing;
  schoolpractice: Schoolpractice;
  exams: Exams;
  sick: Sick;
  meetings: Meetings;
  schedules: Schedules;
  letters: Letters;
  exemptions: Exemptions;
  detention: Detention;
  '': SecurityRules;
}
