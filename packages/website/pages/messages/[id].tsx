import { Badge, Card, Center, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import linkifyStr from 'linkify-string';
import { InferGetServerSidePropsType } from 'next';
import { useEffect, useRef } from 'react';
import { batchRequest, get, getLoginStatus, models } from 'schulmanager';

import Layout from '@/components/layout';
import { formatApiToHuman, formatApiToHumanTime } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

export default function Thread(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [, setLastViewedSubscription] = useLocalStorage<string | undefined>({
    key: 'lastViewedSubscription',
    defaultValue: undefined
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setLastViewedSubscription(props.subscription.id);
  }, [props.subscription.id, setLastViewedSubscription]);
  return (
    <Layout pb="xs">
      <Text weight={500} size="lg" align="center" mt="xs">
        {props.subscription.thread.subject}
      </Text>
      {props.messages.map((group) => (
        <>
          <Center>
            <Badge mt="xs">{group.createdAt}</Badge>
          </Center>
          {group.messages.map((message) => (
            <Card
              key={message.id}
              shadow="sm"
              mt="xs"
              maw="calc(100% - 50px)"
              ml={message.me ? 'auto' : undefined}
              bg={message.me ? 'dark.4' : undefined}
            >
              <Card.Section inheritPadding py={5}>
                <Text weight={500} c="gray.3">
                  {message.sender.firstname} {message.sender.lastname}
                </Text>
              </Card.Section>
              <Card.Section inheritPadding pt={5}>
                <Text
                  dangerouslySetInnerHTML={{
                    __html: linkifyStr(message.text, {
                      defaultProtocol: 'https',
                      target: '_blank',
                      truncate: 42,
                      nl2br: true
                    })
                  }}
                ></Text>
                {message.attachments.map((attachment) => (
                  <Text key={attachment.id}>
                    <a
                      href={`${props.remoteStorageUrl}/download-file/${Buffer.from(
                        attachment.file
                      ).toString('base64')}`}
                    >
                      {JSON.parse(attachment.file)[6]}
                    </a>
                  </Text>
                ))}
              </Card.Section>
              <Card.Section inheritPadding pt={5}>
                <Text align="right" c="dimmed">
                  {formatApiToHumanTime(message.createdAt)}
                </Text>
              </Card.Section>
            </Card>
          ))}
        </>
      ))}
      <div ref={bottomRef}></div>
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  id: string;
  messages: { createdAt: string; messages: (models.Message & { me: boolean })[] }[];
  subscription: models.Subscription;
  remoteStorageUrl: string;
}>(async function getServerSideProps({ query, user }) {
  if (query.id === undefined || typeof query.id !== 'string') {
    return {
      redirect: {
        destination: '/messages',
        permanent: false
      }
    };
  }

  const loginStatus = await getLoginStatus(user.jwt);

  const response = await batchRequest(user.jwt, [
    get('messenger:get-subscriptions'),
    get('messenger:get-messages-by-subscription', {
      subscriptionId: query.id
    }),
    get('messenger:get-remote-storage-url')
  ] as const);

  const subscriptions = response.results[0];

  const messagesBySubscription = response.results[1];

  const remoteStorageUrl = response.results[2];

  if (messagesBySubscription === undefined) {
    return {
      notFound: true
    };
  }

  const subscription = subscriptions.find((s) => s.id === query.id) as models.Subscription;

  const groupMessagesByCreatedAtDaily = messagesBySubscription.messages.reduceRight(
    (prev, curr) => {
      const day = formatApiToHuman(curr.createdAt, {
        weekday: undefined
      });

      const index = prev.findIndex((v) => v.createdAt === day);

      let me = false;
      if (curr.sender.id === loginStatus.data.id) {
        me = true;
      }

      if (index === -1) {
        prev.push({ createdAt: day, messages: [{ me, ...curr }] });
      } else {
        prev[index].messages.push({ me, ...curr });
      }

      return prev;
    },
    [] as { createdAt: string; messages: (models.Message & { me: boolean })[] }[]
  );

  return {
    props: {
      id: query.id,
      messages: groupMessagesByCreatedAtDaily,
      subscription: subscription,
      remoteStorageUrl: remoteStorageUrl
    }
  };
});
