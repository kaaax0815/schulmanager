import { models } from 'schulmanager';

export interface Addition {
  addition?: models.LessonEvent[];
}

export interface FreeLesson extends Addition {
  date: string;
  classHour: { number: string };
  isFree: true;
}

export interface Lesson extends models.Lesson, Addition {
  isFree: false;
}

export type TimetableEntry = FreeLesson | Lesson;
