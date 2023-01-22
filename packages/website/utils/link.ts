import { models } from 'schulmanager';

export type parseNotificationLinkProps = models.Notification;

export function parseNotificationLink({ state, stateParameters }: parseNotificationLinkProps) {
  if (state !== 'main.modules.schedules.view') {
    return '#';
  }
  return `/timetable?start=${stateParameters.start}`;
}
