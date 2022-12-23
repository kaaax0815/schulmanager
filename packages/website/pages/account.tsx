import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Avatar, Flex, Group, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconDeviceFloppy, IconRefresh } from '@tabler/icons';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Layout from '../components/layout';
import prisma from '../lib/prisma';

export default function Account({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser();
  const [jwtToken, setJwtToken] = useInputState(token || '');

  if (!user) {
    return;
  }

  const saveToken = async () => {
    const pathToCall = token ? '/api/user/update' : '/api/user/create';
    await fetch(pathToCall, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: jwtToken,
        sub: user.sub
      })
    });
  };

  // TODO: show modal for token fetching
  // TODO: hide token input if token is set (automatic token update)
  // TODO: show status for token update
  // TODO: force to create db entry

  return (
    <Layout>
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
        rightSection={
          <Flex align="center" gap={5} mr={3}>
            <ActionIcon variant="transparent">
              <IconRefresh size={18} />
            </ActionIcon>
            <ActionIcon variant="filled" color="blue" onClick={saveToken}>
              <IconDeviceFloppy size={18} />
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
