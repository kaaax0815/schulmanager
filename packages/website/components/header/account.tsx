import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, createStyles, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: '4px',
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
    }
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
  },

  text: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none'
    }
  },

  item: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
    },

    '&[data-active="true"]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
    }
  }
}));

export default function Account() {
  const { user, isLoading } = useUser();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group spacing={7}>
            <Avatar src={user?.picture} alt="Avatar" radius="xl" size={20} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3} className={classes.text}>
              {user?.name || 'Offline'}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Einstellungen</Menu.Label>
        <Link href="/settings" legacyBehavior passHref>
          <Menu.Item
            className={classes.item}
            data-active={router.pathname === '/settings'}
            icon={<IconSettings size={16} />}
            component="a"
          >
            Einstellungen
          </Menu.Item>
        </Link>
        <Link href="/account" legacyBehavior passHref>
          <Menu.Item
            className={classes.item}
            data-active={router.pathname === '/account'}
            icon={<IconUser size={16} />}
            component="a"
          >
            Account
          </Menu.Item>
        </Link>
        <Menu.Item
          onClick={() => router.push('/api/auth/logout')}
          className={classes.item}
          icon={<IconLogout size={16} />}
        >
          Abmelden
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
