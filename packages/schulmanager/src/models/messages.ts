export interface Messages {
  messages: Message[];
  hasMoreMessages: boolean;
}

export interface Message {
  text: string;
  id: string;
  createdAt: string;
  senderId: number;
  sender: Sender;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  file: string;
}

export interface Sender {
  firstname: string;
  lastname: string;
  id: number;
}

export interface MessagesRequest {
  subscriptionId: string;
}
