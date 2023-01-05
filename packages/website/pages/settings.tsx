import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Divider, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Settings } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';

import Layout from '@/components/layout';
import useRouterRefresh from '@/hooks/useRouterRefresh';
import { withAuthAndDB } from '@/utils/guard';

export default function SettingsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = useUser();
  const routerRefresh = useRouterRefresh();

  const form = useForm({
    initialValues: {
      lettersEnabled: props.lettersEnabled,
      eventsEnabled: props.eventsEnabled,
      examsEnabled: props.examsEnabled
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
        Wähle die Module aus, die du in deinem Dashboard angezeigt bekommen möchtest.
      </Text>
      <form onSubmit={submit}>
        <Switch
          label="Elternbriefe"
          {...form.getInputProps('lettersEnabled', { type: 'checkbox' })}
        />
        <Switch label="Termine" {...form.getInputProps('eventsEnabled', { type: 'checkbox' })} />
        <Switch label="Klausuren" {...form.getInputProps('examsEnabled', { type: 'checkbox' })} />
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
