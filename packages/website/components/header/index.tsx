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
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
    marginBottom: 120
  },

  mainSection: {
    paddingBottom: theme.spacing.sm
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
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name} onClick={() => router.push(tab.url)}>
      {tab.name}
    </Tabs.Tab>
  ));

  return (
    <nav>
      <div className={classes.header}>
        <Container className={classes.mainSection}>
          <Group position="apart">
            <Image src={'/images/logo.png'} alt="Logo" width={40} height={40} />
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            <Account />
          </Group>
        </Container>
        <Container>
          <Tabs
            variant="outline"
            classNames={{
              root: classes.tabs,
              tabsList: classes.tabsList,
              tab: classes.tab
            }}
          >
            <Tabs.List grow>{items}</Tabs.List>
          </Tabs>
        </Container>
      </div>
    </nav>
  );
}
