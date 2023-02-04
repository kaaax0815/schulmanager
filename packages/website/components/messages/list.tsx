import { Card, createStyles, Flex, Group, Skeleton, Text, ThemeIcon } from '@mantine/core';
import { IconUser, IconUsers } from '@tabler/icons';
import Link from 'next/link';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { models } from 'schulmanager';

import { formatApiToDate, formatTimestamp } from '@/utils/date';

const useStyles = createStyles((theme) => ({
  link: {
    textDecoration: 'none'
  },
  involved: {
    fontSize: theme.fontSizes.sm
  },
  shortText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  list: {
    flexGrow: 1,
    marginTop: theme.spacing.xs
  },
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '12px'
    },
    '&::-webkit-scrollbar-track': {
      width: '20px',
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
      }
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.white, 0.4)
          : theme.fn.rgba(theme.black, 0.4),
      borderRadius: '12px',
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.white, 0.5)
            : theme.fn.rgba(theme.black, 0.5)
      }
    }
  }
}));

export type ListProps = {
  subscriptions: models.Subscription[];
};

export default function List({ subscriptions }: ListProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.list}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={subscriptions.length}
            itemSize={74}
            width={width}
            itemData={subscriptions}
            useIsScrolling={true}
            className={classes.scrollbar}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}

function Row(props: ListChildComponentProps<models.Subscription[]>) {
  const { index, style, data, isScrolling } = props;

  const { classes } = useStyles();

  const subscription = data[index];

  if (isScrolling) {
    return (
      <div style={style}>
        <ItemSkeleton />
      </div>
    );
  }

  return (
    <div style={style}>
      <Link href={`/messages/${subscription.id}`} key={subscription.id} className={classes.link}>
        <Card id={subscription.id} shadow="sm">
          <Card.Section withBorder inheritPadding py={5}>
            <Group noWrap>
              {subscription.thread.isPrivateChat ? <IconUser size={18} /> : <IconUsers size={18} />}
              <Text weight={500} size="sm" className={classes.shortText}>
                {subscription.thread.subject}
              </Text>
              {subscription.unreadCount > 0 && (
                <ThemeIcon radius="xl" color="red" size="sm">
                  <Text size="sm">
                    {subscription.unreadCount > 9 ? '9+' : subscription.unreadCount}
                  </Text>
                </ThemeIcon>
              )}
            </Group>
          </Card.Section>
          <Card.Section inheritPadding py={5}>
            <Group position="apart" spacing={0} noWrap>
              <span className={`${classes.involved} ${classes.shortText}`}>
                <span>{subscription.thread.senderString}</span>
                <span>
                  &nbsp;{'>'}&nbsp;
                  {subscription.thread.recipientString}
                </span>
              </span>
              <Text size="xs" ml="xs">
                {formatTimestamp(formatApiToDate(subscription.thread.lastMessageTimestamp))}
              </Text>
            </Group>
          </Card.Section>
        </Card>
      </Link>
    </div>
  );
}

function ItemSkeleton() {
  return (
    <Flex py={5} direction="column">
      <Group noWrap py={5} pl={16}>
        <Skeleton height={20} circle />
        <Skeleton height={22} />
      </Group>
      <Skeleton height={22} />
    </Flex>
  );
}
