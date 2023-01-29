export interface StatisticBySubject {
  subject: StatisticSubject;
  absentLessons: number;
  totalLessons: number;
}

export interface StatisticSubject {
  name: string;
  abbreviation: string;
  id: number;
}

/**
 * Id of the Class Hour.
 * @description Get this from `classHour.id` from `getLessons`
 */
export type ClassHourId = string;

export interface StatisticByTime {
  [dayOfTheWeek: string]: { [classHourId: ClassHourId]: LessonData };
}

export interface LessonData {
  absentLessons: number;
  totalLessons: number;
}

/**
 * @description Type depends on `params.by`
 *
 * `params.by === "subject"` -> `StatisticBySubject[]`
 *
 * `params.by === "time"` -> `StatisticByTime`
 */
export type Statistic = StatisticBySubject[] | StatisticByTime;

export interface StatisticsRequest<T extends 'time' | 'subject'> {
  by: T;
  /** @format `YYYY-MM-DD` */
  from: string;
  type: 'sum-all' | 'count-absent' | 'count-belated';
  /** @format `YYYY-MM-DD` */
  until: string;
  student: {
    /** Id of the Student
     * @important Its not the ID of the User. Use `associatedStudent.id` from `getLoginStatus`
     */
    id: number;
  };
  /** @default false */
  unexcusedOnly?: boolean;
}
