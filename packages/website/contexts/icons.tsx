import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export interface IconsContextProps {
  messageCount: number;
  notificationCount: number;
  setMessageCount: (count: number) => void;
  setNotificationCount: (count: number) => void;
}

const IconsContext = createContext<IconsContextProps>({
  messageCount: 0,
  notificationCount: 0,
  setMessageCount: noop,
  setNotificationCount: noop
});

export default IconsContext;
