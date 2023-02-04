import { TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { batchRequest, get, models } from 'schulmanager';

import { LayoutWithoutScrollbars } from '@/components/layout';
import List from '@/components/messages/list';
import { formatApiToDate } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

export default function Messages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useDebouncedState('', 200);

  const [data, setData] = useState(props.subscriptions);

  useEffect(() => {
    const filtered = props.subscriptions.filter((v) => {
      const searchLower = search.toLowerCase();

      const subject = v.thread.subject.toLowerCase();
      const sender = v.thread.senderString.toLowerCase();

      return subject.includes(searchLower) || sender.includes(searchLower);
    });
    setData(filtered);
  }, [search, props.subscriptions]);

  return (
    <LayoutWithoutScrollbars py="xs">
      <TextInput
        placeholder="Suchen..."
        defaultValue={search}
        onChange={(v) => setSearch(v.currentTarget.value)}
      />
      <List subscriptions={data} />
    </LayoutWithoutScrollbars>
  );
}

export const getServerSideProps = withAuthAndDB<{
  subscriptions: models.Subscription[];
}>(async function getServerSideProps({ user }) {
  const response = await batchRequest(user.jwt, [get('messenger:get-subscriptions')] as const);
  const subscriptions = response.results[0];

  const sortedSubscriptions = subscriptions.sort((a, b) => {
    const aTimestamp = formatApiToDate(a.thread.lastMessageTimestamp);
    const bTimestamp = formatApiToDate(b.thread.lastMessageTimestamp);
    return bTimestamp.getTime() - aTimestamp.getTime();
  });

  return {
    props: {
      subscriptions: sortedSubscriptions
    }
  };
});
