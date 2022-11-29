import { EventsRequest } from '../models/events';
import { ExamRequest } from '../models/exam';
import { LessonRequest } from '../models/lessons';
import {
  getCurrentTerm as oldGetCurrentTerm,
  getEvents as oldGetEvents,
  getExams as oldGetExams,
  getInstitution as oldGetInstitution,
  getLessons as oldGetLessons,
  getLetters as oldGetLetters,
  getLoginStatus as oldGetLoginStatus,
  getNewNotificationsCount as oldGetNewNotificationsCount,
  getSettings as oldGetSettings,
  getSubscriptions as oldGetSubscriptions
} from '../schulmanager';

/**
 * Manages JWT Token for you
 * @class
 */
export default class Schulmanager {
  token: string;
  /**
   * Creates a new Schulmanager instance
   * @param token JWT Token
   * @constructor
   */
  constructor(token: string) {
    this.token = token;
  }

  public async getSettings() {
    const { data, newToken } = await oldGetSettings(this.token);
    this.token = newToken;
    return data;
  }

  public async getInstitution() {
    const { data, newToken } = await oldGetInstitution(this.token);
    this.token = newToken;
    return data;
  }

  public async getExams(params: ExamRequest) {
    const { data, newToken } = await oldGetExams(this.token, params);
    this.token = newToken;
    return data;
  }

  public async getEvents(params: EventsRequest) {
    const { data, newToken } = await oldGetEvents(this.token, params);
    this.token = newToken;
    return data;
  }

  public async getLessons(params: LessonRequest) {
    const { data, newToken } = await oldGetLessons(this.token, params);
    this.token = newToken;
    return data;
  }

  public async getCurrentTerm() {
    const { data, newToken } = await oldGetCurrentTerm(this.token);
    this.token = newToken;
    return data;
  }

  public async getLoginStatus() {
    const { data, newToken } = await oldGetLoginStatus(this.token);
    this.token = newToken;
    return data;
  }

  public async getNewNotificationsCount() {
    const { data, newToken } = await oldGetNewNotificationsCount(this.token);
    this.token = newToken;
    return data;
  }

  public async getLetters() {
    const { data, newToken } = await oldGetLetters(this.token);
    this.token = newToken;
    return data;
  }

  public async getSubscriptions() {
    const { data, newToken } = await oldGetSubscriptions(this.token);
    this.token = newToken;
    return data;
  }
}
