import { Button, Divider, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Settings } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';

import Layout from '../components/layout';
import { withAuthAndDB } from '../utils/guard';

export default function SettingsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const form = useForm({
    initialValues: {
      lettersEnabled: props.lettersEnabled,
      eventsEnabled: props.eventsEnabled,
      examsEnabled: props.examsEnabled
    }
  });

  return (
    <Layout>
      <Divider my="xs" label="Module" labelPosition="center" />
      <form onSubmit={form.onSubmit((v) => console.log(v))}>
        <Switch
          label="Elternbriefe"
          {...form.getInputProps('lettersEnabled', { type: 'checkbox' })}
        />
        <Switch label="Termine" {...form.getInputProps('eventsEnabled', { type: 'checkbox' })} />
        <Switch label="Klausuren" {...form.getInputProps('examsEnabled', { type: 'checkbox' })} />
        {form.isDirty() && <Button type="submit">Speichern</Button>}
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
