import { useContext, useEffect } from 'react';

import IconsContext from '../contexts/icons';

export interface UseIconsProps {
  messageCount: number;
  notificationCount: number;
}

export default function useIcons(props: UseIconsProps) {
  const iconsContext = useContext(IconsContext);
  return useEffect(() => {
    iconsContext.setMessageCount(props.messageCount);
    iconsContext.setNotificationCount(props.notificationCount);
  }, [iconsContext, props.messageCount, props.notificationCount]);
}
