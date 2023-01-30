import { Anchor, Button, Card, Center, createStyles, Group, Text, ThemeIcon } from '@mantine/core';
import { IconUser, IconUsers } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { batchRequest, get, models } from 'schulmanager';

import Layout from '@/components/layout';
import { formatApiToHuman } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

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
  }
}));

export default function Messages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();

  return (
    <Layout pb="xs">
      {props.subscriptions.map((subscription) => (
        <Link href={`/messages/${subscription.id}`} key={subscription.id} className={classes.link}>
          <Card id={subscription.id} shadow="sm" mt="xs">
            <Card.Section withBorder inheritPadding py={5}>
              <Group noWrap>
                {subscription.thread.isPrivateChat ? (
                  <IconUser size={18} />
                ) : (
                  <IconUsers size={18} />
                )}
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
                  {formatApiToHuman(subscription.thread.lastMessageTimestamp, {
                    day: undefined,
                    month: undefined,
                    year: undefined
                  })}
                </Text>
              </Group>
            </Card.Section>
          </Card>
        </Link>
      ))}
      <Center mt="xs">
        <Anchor href="https://login.schulmanager-online.de/#/modules/messenger/messages">
          <Button compact variant="light">
            Mehr Nachrichten
          </Button>
        </Anchor>
      </Center>
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  subscriptions: models.Subscription[];
}>(async function getServerSideProps({ user }) {
  const response = await batchRequest(user.jwt, [get('messenger:get-subscriptions')] as const);
  const subscriptions = response.results[0];

  return {
    props: {
      subscriptions: subscriptions.slice(-50).reverse()
    }
  };
});
