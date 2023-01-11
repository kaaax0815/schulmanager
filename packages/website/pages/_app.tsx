import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

import RouterTransition from '@/components/routerTransition';
import IconsContext from '@/contexts/icons';

export default function App({ Component, pageProps }: AppProps) {
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = pageProps;

  return (
    <>
      <Head>
        <title>kaaaxcreators&apos; Schulmanager</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#25262b" />
        <meta name="application-name" content="kaaaxcreators' Schulmanager" />
      </Head>
      <UserProvider user={user}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark'
          }}
        >
          <NotificationsProvider>
            <IconsContext.Provider
              value={{ messageCount, notificationCount, setMessageCount, setNotificationCount }}
            >
              <RouterTransition />
              <Component {...pageProps} />
            </IconsContext.Provider>
          </NotificationsProvider>
        </MantineProvider>
      </UserProvider>
    </>
  );
}
