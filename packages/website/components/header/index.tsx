import { ActionIcon, Burger, Container, createStyles, Group, Tabs, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, TablerIcon } from '@tabler/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import Account from './account';
import Icons from './icons';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]}`
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none'
    }
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  tabsOpen: {
    display: 'block !important'
  },

  tabsList: {
    borderBottom: '0 !important'
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    }
  }
}));

interface Header {
  tabs: { name: string; url: string; icon: TablerIcon }[];
}

export default function Header({ tabs }: Header) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  return (
    <nav className={classes.header}>
      <Container pb="xs">
        <Group position="apart">
          <Group position="left">
            {router.pathname !== '/' && (
              <ActionIcon title="Zurück">
                <IconChevronLeft size={20} onClick={() => router.back()} />
              </ActionIcon>
            )}
            <Image
              src={'/images/logo_512.png'}
              alt="Logo"
              width={40}
              height={40}
              onClick={() => router.push('/')}
            />
          </Group>
          <Group position="right">
            <Icons />
            <Account />
            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
              title="Navigation"
            />
          </Group>
        </Group>
      </Container>
      <Container p={0}>
        <Tabs
          variant="outline"
          classNames={{
            root: cx(classes.tabs, { [classes.tabsOpen]: opened }),
            tabsList: classes.tabsList,
            tab: classes.tab
          }}
          value={tabs.find((tab) => tab.url === router.pathname)?.name}
        >
          <Tabs.List grow>
            {tabs.map((tab) => (
              <Tabs.Tab value={tab.name} key={tab.name} onClick={() => router.push(tab.url)}>
                <Group>
                  <tab.icon size={20} />
                  <Text>{tab.name}</Text>
                </Group>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Container>
    </nav>
  );
}
