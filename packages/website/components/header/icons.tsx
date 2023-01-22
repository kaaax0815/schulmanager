import { ActionIcon, Indicator } from '@mantine/core';
import { IconBell, IconMail } from '@tabler/icons';
import Link from 'next/link';
import { useContext } from 'react';

import IconsContext from '@/contexts/icons';

export default function Icons() {
  const iconsContext = useContext(IconsContext);
  return (
    <>
      <Link
        href="https://login.schulmanager-online.de/#/modules/messenger/messages"
        aria-label="Nachrichten"
      >
        <Indicator
          label={iconsContext.messageCount}
          color="red"
          inline
          showZero={false}
          dot={false}
          overflowCount={9}
          size={16}
        >
          <ActionIcon title="Nachrichten">
            <IconMail size={20} />
          </ActionIcon>
        </Indicator>
      </Link>
      <Link href="/notifications" aria-label="Benachrichtigungen">
        <Indicator
          label={iconsContext.notificationCount}
          color="red"
          inline
          showZero={false}
          dot={false}
          overflowCount={9}
          size={16}
        >
          <ActionIcon title="Benachrichtigungen">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Link>
    </>
  );
}
