import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Divider, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Settings } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';

import Layout from '@/components/layout';
import DragNDrop from '@/components/settings/dragndrop';
import useRouterRefresh from '@/hooks/useRouterRefresh';
import { withAuthAndDB } from '@/utils/guard';

type SortProp = {
  position: string;
};
function customSort(values: Record<string, unknown>, a: SortProp, b: SortProp) {
  const aValue = values[a.position];
  const bValue = values[b.position];

  if (typeof aValue !== 'number' || typeof bValue !== 'number') {
    return 0;
  }
  return aValue - bValue;
}

export default function SettingsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = useUser();
  const routerRefresh = useRouterRefresh();

  const form = useForm({
    initialValues: {
      nextLessonEnabled: props.nextLessonEnabled,
      nextLessonPosition: props.nextLessonPosition,
      lettersEnabled: props.lettersEnabled,
      lettersPosition: props.lettersPosition,
      eventsEnabled: props.eventsEnabled,
      eventsPosition: props.eventsPosition,
      examsEnabled: props.examsEnabled,
      examsPosition: props.examsPosition
    }
  });

  if (user.user === undefined) {
    return null;
  }

  const submit = form.onSubmit(async (v) => {
    showNotification({
      id: 'updating-settings',
      title: 'Einstellungen werden gespeichert...',
      message: 'Bitte warten...',
      loading: true,
      autoClose: false,
      disallowClose: true
    });
    const response = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sub: user.user!.sub,
        settings: v
      })
    });

    const json = await response.json();
    if (json.status === 'success') {
      updateNotification({
        id: 'updating-settings',
        title: 'Erfolgreich gespeichert',
        message: 'Deine Einstellungen wurden erfolgreich gespeichert.',
        color: 'teal',
        icon: <IconCheck size={18} />,
        autoClose: 2000
      });
      form.resetDirty();
      routerRefresh();
    } else {
      updateNotification({
        id: 'updating-settings',
        title: 'Fehler',
        message: 'Beim Speichern deiner Einstellungen ist ein Fehler aufgetreten.',
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: 2000
      });
    }
  });

  return (
    <Layout>
      <Divider mt="xs" mb={0} label="Module" labelPosition="center" />
      <Text size="sm" color="dimmed" align="center" mb="xs">
        Wähle die Module aus, die du in deinem Dashboard angezeigt haben möchtest und in welcher
        Reihenfolge.
      </Text>
      <form onSubmit={submit}>
        <DragNDrop
          settings={[
            {
              id: 'nextLessonEnabled',
              name: 'Nächste Stunde',
              position: 'nextLessonPosition'
            },
            {
              id: 'eventsEnabled',
              name: 'Termine',
              position: 'eventsPosition'
            },
            {
              id: 'examsEnabled',
              name: 'Klausuren',
              position: 'examsPosition'
            },
            {
              id: 'lettersEnabled',
              name: 'Elternbriefe',
              position: 'lettersPosition'
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ].sort((a, b) => customSort(form.values, a, b))}
          form={form}
        />
        <Divider mt="xs" mb={0} label="Speichern" labelPosition="center" />
        <Text size="sm" color="dimmed" align="center" mb="xs">
          Vergiss nicht, die Änderungen zu speichern.
        </Text>
        <Button type="submit" disabled={!form.isDirty()}>
          Speichern
        </Button>
      </form>
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<Settings>(async function getServerSideProps({
  user
}) {
  return {
    props: {
      ...user.settings
    }
  };
});
