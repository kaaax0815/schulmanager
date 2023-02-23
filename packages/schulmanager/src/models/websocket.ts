export interface PushChat {
  type: 'new-chat-message';
  title: string;
  body: string;
  customData: CustomChatData;
}

export interface CustomChatData {
  subscriptionId: string;
}

export interface PushNotification {
  type: 'new-chat-message';
  title: string;
  body: string;
  customData: CustomNotificationData;
}

export interface CustomNotificationData {
  state: string;
  stateParameters: {
    start: string;
    type: string;
    id: number;
  };
  notificationId: number;
}

export type Push = PushChat | PushNotification;

/**
 * [[include:websocket.md]]
 */
export type WebSocket = null;
