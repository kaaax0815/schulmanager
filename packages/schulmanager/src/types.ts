import { getResults } from './batch';
import {
  Events,
  EventsRequest,
  Exam,
  ExamRequest,
  Institution,
  Lesson,
  LessonRequest,
  Letter,
  Messages,
  MessagesRequest,
  Notification,
  NotificationsRequest,
  Settings,
  StatisticBySubject,
  StatisticByTime,
  StatisticsRequest,
  Subscription,
  Term
} from './models';

/**
 * List of all possible Requests with their Parameters and Response
 * ":" is used to separate Module and Endpoint
 * "+" is used to separate multiple Requests with same Id but different Parameters and Response
 */
export interface Results {
  'null:get-settings': {
    parameters: undefined;
    response: Settings;
  };
  'null:get-institution': {
    parameters: undefined;
    response: Institution;
  };
  'null:get-current-term': {
    parameters: undefined;
    response: Term;
  };
  'null:get-new-notifications-count': {
    parameters: undefined;
    response: number;
  };
  'null:get-notifications': {
    parameters: NotificationsRequest;
    response: Notification[];
  };
  'exams:get-exams': {
    parameters: ExamRequest;
    response: Exam[];
  };
  'calendar:get-events-for-user': {
    parameters: EventsRequest;
    response: Events;
  };
  'schedules:get-actual-lessons': {
    parameters: LessonRequest;
    response: Lesson[];
  };
  'letters:get-letters': {
    parameters: undefined;
    response: Letter[];
  };
  'messenger:get-subscriptions': {
    parameters: undefined;
    response: Subscription[];
  };
  'messenger:count-new-messages': {
    parameters: undefined;
    response: number;
  };
  'messenger:get-messages-by-subscription': {
    parameters: MessagesRequest;
    response: Messages | undefined;
  };
  'classbook:get-statistics+time': {
    parameters: StatisticsRequest<'time'>;
    response: StatisticByTime;
  };
  'classbook:get-statistics+subject': {
    parameters: StatisticsRequest<'subject'>;
    response: StatisticBySubject[];
  };
}
export interface IBatchRequest<Id extends keyof Results = keyof Results> {
  id: Id;
  moduleName: ReturnType<typeof getResults>['moduleName'];
  endpointName: ReturnType<typeof getResults>['endpointName'];
  parameters: Results[Id]['parameters'];
}

/** Response of API with `/calls` Endpoint */
export interface APIResponse<Results> {
  systemStatusMessages: unknown[];
  results: {
    [ResultsIndex in keyof Results]: APIResult<Results[ResultsIndex]>;
  };
}

/**
 * Type of each Result of API with `/calls` Endpoint
 */
export interface APIResult<Data> {
  status: number;
  data: Data;
}

export type ResponseList<Requests extends readonly IBatchRequest[]> = {
  [RequestsIndex in keyof Requests]: Results[Requests[RequestsIndex]['id']]['response'];
};
