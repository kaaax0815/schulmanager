import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Avatar, Button, Card, Flex, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck, IconDeviceFloppy, IconRefresh, IconX } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';

import GenerateModal from '@/components/account/generate';
import Layout from '@/components/layout';
import useRouterRefresh from '@/hooks/useRouterRefresh';
import prisma from '@/lib/prisma';
import { withAuth } from '@/utils/guard';

export default function Account({
  token,
  userExists,
  errorText
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser();
  const form = useForm({
    initialValues: {
      jwt: token || ''
    },
    validate: {
      jwt: (value) => {
        if (!value) {
          return 'Bitte gib einen Token an';
        }
      }
    }
  });
  const [opened, toggleOpened] = useToggle();
  const routerRefresh = useRouterRefresh();

  if (!user) {
    return;
  }

  const submit = form.onSubmit(async (v) => {
    showNotification({
      id: 'saving-token',
      title: 'Token wird gespeichert...',
      message: 'Bitte warten...',
      loading: true,
      autoClose: false,
      disallowClose: true
    });
    const pathToCall = userExists ? '/api/user/update' : '/api/user/create';
    const response = await fetch(pathToCall, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: v.jwt,
        sub: user.sub
      })
    });
    const json = await response.json();

    if (json.status === 'success') {
      updateNotification({
        id: 'saving-token',
        title: 'Erfolgreich gespeichert',
        message: 'Token wurde erfolgreich gespeichert.',
        color: 'teal',
        icon: <IconCheck size={18} />,
        autoClose: 2000
      });
      routerRefresh(true);
    } else {
      updateNotification({
        id: 'saving-token',
        title: 'Fehler',
        message: `Token konnte nicht gespeichert werden. ${json.nachricht || json.message}`,
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: 2000
      });
    }
  });

  // TODO: hide token input if token is set (automatic token update)
  // TODO: show status for token update

  return (
    <Layout>
      <GenerateModal
        opened={opened}
        toggleOpened={toggleOpened}
        setToken={(token) => form.setFieldValue('jwt', token)}
      />
      {errorText && (
        <Card shadow="sm" mt="md">
          <Card.Section
            withBorder
            inheritPadding
            sx={(theme) => ({
              backgroundImage: theme.fn.gradient({ from: 'red', to: 'red.6', deg: 45 })
            })}
          >
            <Text weight={500}>Fehler</Text>
          </Card.Section>
          <Card.Section inheritPadding>
            <Text color="red">{errorText}</Text>
          </Card.Section>
        </Card>
      )}
      <h1>Account</h1>
      <Group>
        <Avatar src={user.picture} alt="Avatar" />
        <Flex direction="column">
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </Flex>
      </Group>
      <h2>Options</h2>
      <form onSubmit={submit} autoComplete="off">
        <TextInput
          placeholder="eyJhbGciO..."
          label="Token"
          autoComplete="off"
          {...form.getInputProps('jwt')}
          rightSectionWidth={150}
          rightSection={
            <Flex align="center" gap={5} mr={3}>
              <Button
                leftIcon={<IconRefresh size={18} />}
                compact
                onClick={() => toggleOpened()}
                title="Token generieren"
              >
                Generieren
              </Button>
              <ActionIcon
                variant="filled"
                color="blue"
                type="submit"
                disabled={!form.isDirty()}
                title="Token speichern"
              >
                <IconDeviceFloppy size={18} />
              </ActionIcon>
            </Flex>
          }
        />
      </form>
    </Layout>
  );
}

const ErrorText = {
  notfound:
    'Dein Token ist noch nicht in unserer Datenbank. Bitte generiere einen Token und speichere diesen.',
  jwt: 'Der angegebene Token ist ungültig oder abgelaufen. Bitte generiere einen neuen Token.'
} as const;

type ValueOf<T> = T[keyof T];

export const getServerSideProps = withAuth<{
  token: string | null;
  userExists: boolean;
  errorText: ValueOf<typeof ErrorText> | null;
}>(async function getServerSideProps({ session, query: { error } }) {
  const user = await prisma.user.findUnique({
    where: {
      sub: session.user.sub
    }
  });
  let errorText: ValueOf<typeof ErrorText> | null = null;
  if (!error) {
    errorText = null;
  } else if (Array.isArray(error)) {
    errorText = null;
  } else if (error in ErrorText) {
    errorText = ErrorText[error as keyof typeof ErrorText];
  }

  return {
    props: {
      token: user?.jwt || null,
      userExists: !!user,
      errorText
    }
  };
});
