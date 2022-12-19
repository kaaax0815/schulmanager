import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, createStyles, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none'
    }
  },
  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
  }
}));

export default function Account() {
  const { user, isLoading } = useUser();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  if (!user || isLoading) {
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
            <Avatar src={user.picture} alt={user.name || 'Username'} radius="xl" size={20} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
              {user.name || 'Username'}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Schule</Menu.Item>

        <Menu.Label>Einstellungen</Menu.Label>
        <Menu.Item>Dein Account</Menu.Item>
        <Menu.Item onClick={() => router.push('/api/auth/logout')}>Abmelden</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
