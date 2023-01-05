import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Avatar, Card, Flex, Group, Text, TextInput } from '@mantine/core';
import { useInputState, useToggle } from '@mantine/hooks';
import { IconRefresh } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';
import { useReducer } from 'react';

import GenerateModal from '@/components/account/generate';
import StatusActionIcon from '@/components/account/icon';
import Layout from '@/components/layout';
import useRouterRefresh from '@/hooks/useRouterRefresh';
import prisma from '@/lib/prisma';
import {
  FormStatusActionKind,
  formStatusInitialState,
  formStatusReducer
} from '@/reducers/formStatus';
import { withAuth } from '@/utils/guard';

export default function Account({
  token,
  userExists,
  errorText
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser();
  const [jwtToken, setJwtToken] = useInputState(token || '');
  const [status, setStatus] = useReducer(formStatusReducer, formStatusInitialState);
  const [opened, toggleOpened] = useToggle();
  const routerRefresh = useRouterRefresh();

  if (!user) {
    return;
  }

  const setTokenAndSave = (token: string) => {
    setJwtToken(token);
  };

  const saveToken = async () => {
    if (!jwtToken) {
      setStatus({ status: FormStatusActionKind.error, message: 'Token is required' });
      setTimeout(() => setStatus(formStatusInitialState), 2000);
      return;
    }
    const pathToCall = userExists ? '/api/user/update' : '/api/user/create';
    setStatus({ status: FormStatusActionKind.loading });
    const result = await fetch(pathToCall, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: jwtToken,
        sub: user.sub
      })
    });
    const json = await result.json();
    if (json.status !== 'success') {
      setStatus({ status: FormStatusActionKind.error, message: json.message });
      setTimeout(() => setStatus(formStatusInitialState), 2000);
      return;
    }
    setStatus({ status: FormStatusActionKind.success });
    setTimeout(() => setStatus(formStatusInitialState), 2000);
    routerRefresh(true);
  };

  // TODO: hide token input if token is set (automatic token update)
  // TODO: show status for token update

  return (
    <Layout>
      <GenerateModal opened={opened} toggleOpened={toggleOpened} setToken={setTokenAndSave} />
      {errorText && (
        <Card shadow="sm" radius="md" mt="md">
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
      <TextInput
        placeholder="eyJhbGciO..."
        label="Token"
        autoComplete="off"
        value={jwtToken}
        onChange={setJwtToken}
        error={status.status === FormStatusActionKind.error ? status.message : undefined}
        rightSection={
          <Flex align="center" gap={5} mr={3}>
            <ActionIcon variant="transparent" onClick={() => toggleOpened()}>
              <IconRefresh size={18} />
            </ActionIcon>
            <ActionIcon variant="filled" color="blue" onClick={saveToken}>
              <StatusActionIcon status={status.status} />
            </ActionIcon>
          </Flex>
        }
        rightSectionWidth="xs"
      />
    </Layout>
  );
}

const ErrorText = {
  notfound:
    'Du wurdest scheinbar noch nicht in unserer Datenbank gefunden. Bitte generiere einen Token und speichere diesen.',
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
