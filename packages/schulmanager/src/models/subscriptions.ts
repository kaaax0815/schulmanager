export interface Subscription {
  id: string;
  lastReadMessageTimestamp: null | string;
  unreadCount: number;
  isAdministrator: boolean;
  threadId: string;
  thread: Thread;
}

export interface Thread {
  subject: string;
  senderString: string;
  recipientString: string;
  id: string;
  lastMessageTimestamp: string;
  isPrivateChat: boolean;
  allowAnswers: boolean;
}
