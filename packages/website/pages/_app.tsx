import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

import IconsContext from '../contexts/icons';

export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme('dark');
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
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
          <IconsContext.Provider
            value={{ messageCount, notificationCount, setMessageCount, setNotificationCount }}
          >
            <Component {...pageProps} />
          </IconsContext.Provider>
        </MantineProvider>
      </UserProvider>
    </>
  );
}
