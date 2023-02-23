export interface Notification {
  id: number;
  title: string;
  message: string;
  name: string;
  moduleName: string;
  createdAt: string;
  state: string;
  stateParameters: StateParameters;
  read: boolean | null;
  seen: boolean;
}

export interface StateParameters {
  start: string;
  type: string;
  id: number;
}

export interface NotificationsRequest {
  updateLastSeenNotificationTimestamp: boolean;
}

export interface SetNotificationReadRequest {
  notification: {
    id: number;
  };
}
