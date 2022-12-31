import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Avatar, Flex, Group, Loader, Text, TextInput } from '@mantine/core';
import { useInputState, useToggle } from '@mantine/hooks';
import { IconCheck, IconDeviceFloppy, IconRefresh, IconX } from '@tabler/icons';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useReducer } from 'react';

import GenerateModal from '../components/account/generate';
import Layout from '../components/layout';
import prisma from '../lib/prisma';
import {
  FormStatusActionKind,
  formStatusInitialState,
  formStatusReducer
} from '../reducers/formStatus';

export default function Account({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser();
  const [jwtToken, setJwtToken] = useInputState(token || '');
  const [status, setStatus] = useReducer(formStatusReducer, formStatusInitialState);
  const [opened, toggleOpened] = useToggle();

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
    const pathToCall = token ? '/api/user/update' : '/api/user/create';
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
    token = jwtToken;
    setStatus({ status: FormStatusActionKind.success, message: 'Token saved! Press "Save"' });
    // TODO: router refresh
    setTimeout(() => setStatus(formStatusInitialState), 2000);
  };

  // TODO: hide token input if token is set (automatic token update)
  // TODO: show status for token update
  // TODO: force to create db entry
  // TODO: handle error url parameter

  return (
    <Layout>
      <GenerateModal opened={opened} toggleOpened={toggleOpened} setToken={setTokenAndSave} />
      <h1>Account</h1>
      <Group>
        <Avatar src={user.picture} alt="Avatar" />
        <Text>{user.name}</Text>
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

export const getServerSideProps: GetServerSideProps<{ token: string | null }> = async ({
  req,
  res
}) => {
  const session = await getSession(req, res);

  const user = await prisma.user.findUnique({
    where: {
      sub: session?.user.sub
    }
  });

  return {
    props: {
      token: user?.jwt || null
    }
  };
};

export interface StatusActionIconProps {
  status: FormStatusActionKind;
}

export function StatusActionIcon({ status }: StatusActionIconProps) {
  switch (status) {
    case FormStatusActionKind.loading:
      return <Loader color="white" size={18} />;
    case FormStatusActionKind.success:
      return <IconCheck size={18} />;
    case FormStatusActionKind.error:
      return <IconX size={18} />;
    default:
      return <IconDeviceFloppy size={18} />;
  }
}
