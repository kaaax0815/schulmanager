import { ActionIcon, Indicator } from '@mantine/core';
import { IconBell, IconMail } from '@tabler/icons';
import Link from 'next/link';
import { useContext } from 'react';

import IconsContext from '../../contexts/icons';

export default function Icons() {
  const iconsContext = useContext(IconsContext);
  return (
    <>
      <Link href="https://login.schulmanager-online.de/#/dashboard">
        <Indicator
          label={iconsContext.messageCount}
          color="red"
          inline
          showZero={false}
          dot={false}
          overflowCount={9}
          size={16}
        >
          <ActionIcon>
            <IconMail size={20} />
          </ActionIcon>
        </Indicator>
      </Link>
      <Link href="https://login.schulmanager-online.de/#/modules/messenger/messages">
        <Indicator
          label={iconsContext.notificationCount}
          color="red"
          inline
          showZero={false}
          dot={false}
          overflowCount={9}
          size={16}
        >
          <ActionIcon>
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Link>
    </>
  );
}
