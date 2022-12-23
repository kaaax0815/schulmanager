import { Burger, Container, createStyles, Group, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import Account from './account';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]}`
  },

  mainSection: {
    paddingBottom: theme.spacing.sm
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none'
    }
  },

  container: {
    padding: 0
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
  tabs: { name: string; url: string }[];
  defaultValue: string;
}

export default function Header({ tabs }: Header) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name} onClick={() => router.push(tab.url)}>
      {tab.name}
    </Tabs.Tab>
  ));

  return (
    <nav className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Image
            src={'/images/logo.png'}
            alt="Logo"
            width={40}
            height={40}
            onClick={() => router.push('/')}
          />
          <Group position="right">
            <Account />
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
          </Group>
        </Group>
      </Container>
      <Container className={classes.container}>
        <Tabs
          variant="outline"
          classNames={{
            root: cx(classes.tabs, { [classes.tabsOpen]: opened }),
            tabsList: classes.tabsList,
            tab: classes.tab
          }}
          value={tabs.find((tab) => tab.url === router.pathname)?.name}
        >
          <Tabs.List grow>{items}</Tabs.List>
        </Tabs>
      </Container>
    </nav>
  );
}
