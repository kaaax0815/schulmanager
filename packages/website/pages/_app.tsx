import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from './layout';

export default function App(appProps: AppProps) {
  const preferredColorScheme = useColorScheme('dark');
  return (
    <>
      <Head>
        <title>kaaaxcreators&apos; Schulmanager</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: preferredColorScheme
          }}
        >
          <Layout {...appProps}></Layout>
        </MantineProvider>
      </UserProvider>
    </>
  );
}
