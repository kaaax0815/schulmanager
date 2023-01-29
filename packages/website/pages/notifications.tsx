import { Card, createStyles, Group, Text } from '@mantine/core';
import { IconClockHour9 } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { batchRequest, get, models } from 'schulmanager';

import Layout from '@/components/layout';
import { formatApiToHuman } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';
import { parseNotificationLink } from '@/utils/link';

const useStyles = createStyles(() => ({
  link: {
    textDecoration: 'none'
  }
}));

export default function Notifications(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { classes } = useStyles();
  return (
    <Layout pb="md">
      {props.notifications.map((notification) => (
        <Link
          key={notification.id}
          href={parseNotificationLink(notification)}
          className={classes.link}
        >
          <Card shadow="sm" mt="xs">
            <Card.Section withBorder inheritPadding py={5}>
              <Group>
                <IconClockHour9 size={18} />
                <Text weight={500} size="sm">
                  {notification.title}
                </Text>
              </Group>
            </Card.Section>
            <Card.Section inheritPadding pt={5}>
              <Text
                dangerouslySetInnerHTML={{
                  __html: notification.message
                }}
                size="sm"
              />
            </Card.Section>
            <Card.Section inheritPadding py={3}>
              <Text size="xs" c="dimmed">
                {formatApiToHuman(notification.createdAt, {
                  weekday: undefined,
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              </Text>
            </Card.Section>
          </Card>
        </Link>
      ))}
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  notifications: models.Notification[];
}>(async function getServerSideProps({ user }) {
  const response = await batchRequest(user.jwt, [
    get('null:get-notifications', {
      updateLastSeenNotificationTimestamp: true
    })
  ] as const);

  const notifications = response.results[0];

  return {
    props: {
      notifications: notifications
    }
  };
});
