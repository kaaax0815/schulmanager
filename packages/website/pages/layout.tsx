import { useUser } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';

import Header from '../components/header';
import Loading from '../components/loading';
import Login from './login';

export default function Layout({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {user ? (
        <>
          <Header
            tabs={[
              { name: 'Übersicht', url: '/' },
              { name: 'Stundenplan', url: '/schedule' }
            ]}
            defaultValue="Übersicht"
          />
          <main>
            <Component {...pageProps} />
          </main>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
