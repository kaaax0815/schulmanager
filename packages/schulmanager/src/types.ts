import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Events, EventsRequest } from './models/events';
import { Exam, ExamRequest } from './models/exam';
import { Institution } from './models/institution';
import { Lesson, LessonRequest } from './models/lessons';
import { Letter } from './models/letters';
import { Login } from './models/login';
import { LoginStatus } from './models/loginStatus';
import { Settings } from './models/settings';
import { StatisticBySubject, StatisticByTime, StatisticsRequest } from './models/statistics';
import { Subscription } from './models/subscriptions';
import { Term } from './models/term';

/**
 * Supported Modules
 */
export type Modules = keyof Endpoints;

/**
 * Supported Endpoint(s) for the specified Module
 */
export interface Endpoints {
  exams: 'get-exams';
  null: 'get-settings' | 'get-institution' | 'get-current-term' | 'get-new-notifications-count';
  calendar: 'get-events-for-user';
  schedules: 'get-actual-lessons';
  letters: 'get-letters';
  messenger: 'get-subscriptions' | 'count-new-messages';
  classbook: 'get-statistics';
}

/**
 * Parameters required for the specified Endpoint
 */
export interface RequestParams {
  'get-exams': ExamRequest;
  'get-events-for-user': EventsRequest;
  'get-actual-lessons': LessonRequest;
  'get-statistics': StatisticsRequest;
}

/**
 * Takes the correct parameters for the specified Endpoint or undefined if no parameters are required
 */
export type RequestParamsHelper<T extends Endpoints[Modules]> = T extends keyof RequestParams
  ? RequestParams[T]
  : undefined;

/**
 * Response Result for the specified Endpoint
 */
export interface ResponseResults {
  'get-settings': Settings;
  'get-exams': Exam[];
  'get-events-for-user': Events;
  'get-actual-lessons': Lesson[];
  'get-institution': Institution;
  'get-current-term': Term;
  'get-new-notifications-count': number;
  'get-letters': Letter[];
  'get-subscriptions': Subscription[];
  /** Don't use this type directly */
  'get-statistics': never;
  'count-new-messages': number;
}

/**
 * What the Raw Response Body looks like
 */
export interface ResponseBody<T extends Endpoints[Modules]> {
  results: { 0: Results<T> };
  systemStatusMessages: unknown[];
}

export interface Results<T extends Endpoints[Modules]> {
  /** HTTP Status Code */
  status: number;
  /** The actual data */
  data: ResponseResults[T];
}

/**
 * The raw request body
 */
export interface RequestBody<T extends Modules> {
  bundleVersion: string;
  requests: { 0: Request<T> };
}

export interface Request<T extends Modules> {
  moduleName: T;
  endpointName: Endpoints[T];
  parameters: RequestParamsHelper<Endpoints[T]>;
}

/**
 * The Output the function returns
 */
export interface Response<T> {
  /** New Token thats valid for 1d */
  newToken: string;
  data: T;
}

export interface LoginResponse<T> {
  /** New Token thats valid for 1d */
  token: string;
  data: T;
}

export type LoginStatusResponseBody = LoginStatus;
export type LoginStatusResponseResult = LoginStatus['user'];

export type LoginResponseBody = Login;
export type LoginResponseResult = Login['user'];

export type StatisticsResult<T extends 'time' | 'subject'> = T extends 'time'
  ? StatisticByTime
  : StatisticBySubject[];

/**
 * Wrapper around axios
 */
export interface MakeRawRequest<T> {
  endpoint: '/calls' | '/login-status' | '/login';
  body: unknown;
  options: AxiosRequestConfig<unknown>;
  responseValidator: (response: AxiosResponse<T>['data']) => void;
}
