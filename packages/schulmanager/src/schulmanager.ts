import {
  getLoginStatus as _getLoginStatus,
  getStatistics as _getStatistics,
  login as _login,
  makeRequest
} from './api';
import { EventsRequest } from './models/events';
import { ExamRequest } from './models/exam';
import { LessonRequest } from './models/lessons';
import { MessagesRequest } from './models/messages';
import { NotificationsRequest } from './models/notifications';
import { StatisticsRequest } from './models/statistics';

/**
 * Get Settings
 * @param token Token
 */
export async function getSettings(token: string) {
  return makeRequest(token, 'null', 'get-settings', undefined);
}

/**
 * Get Institution
 * @param token Token
 */
export async function getInstitution(token: string) {
  return makeRequest(token, 'null', 'get-institution', undefined);
}

/**
 * Get Exams
 * @param token Token
 * @param params Parameters
 */
export async function getExams(token: string, params: ExamRequest) {
  return makeRequest(token, 'exams', 'get-exams', params);
}

/**
 * Get Events
 * @param token Token
 * @param params Parameters
 */
export async function getEvents(token: string, params: EventsRequest) {
  return makeRequest(token, 'calendar', 'get-events-for-user', params);
}

/**
 * Get Lessons
 * @param token Token
 * @param params Parameters
 */
export async function getLessons(token: string, params: LessonRequest) {
  return makeRequest(token, 'schedules', 'get-actual-lessons', params);
}

/**
 * Get Current Term
 * @param token Token
 */
export async function getCurrentTerm(token: string) {
  return makeRequest(token, 'null', 'get-current-term', undefined);
}

/**
 * Get Login Status
 * @param token Token
 */
export async function getLoginStatus(token: string) {
  return _getLoginStatus(token);
}

/**
 * Get New Notifications Count
 * @param token Token
 */
export async function getNewNotificationsCount(token: string) {
  return makeRequest(token, 'null', 'get-new-notifications-count', undefined);
}

/**
 * Get Letters
 * @param token Token
 */
export async function getLetters(token: string) {
  return makeRequest(token, 'letters', 'get-letters', undefined);
}

/**
 * Get Subscriptions
 * @param token Token
 */
export async function getSubscriptions(token: string) {
  return makeRequest(token, 'messenger', 'get-subscriptions', undefined);
}

/**
 * Get Statistics by Time
 * @param token Token
 * @param params Parameters
 */
export async function getStatistics<T extends 'time' | 'subject'>(
  token: string,
  params: StatisticsRequest<T>
) {
  return _getStatistics(token, params);
}

/**
 * Login to Schulmanager
 * @param email Email
 * @param password Password
 */
export async function login(email: string, password: string) {
  return _login(email, password);
}

/**
 * Count new messages
 * @param token Token
 */
export async function countNewMessages(token: string) {
  return makeRequest(token, 'messenger', 'count-new-messages', undefined);
}

/**
 * Get Notifications
 * @param token Token
 * @param params Parameters
 */
export async function getNotifications(token: string, params: NotificationsRequest) {
  return makeRequest(token, 'null', 'get-notifications', params);
}

/**
 * Get Messages by Subscription
 * @param token Token
 * @param params Parameters
 */
export async function getMessagesBySubscription(token: string, params: MessagesRequest) {
  return makeRequest(token, 'messenger', 'get-messages-by-subscription', params);
}
