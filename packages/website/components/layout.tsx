import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Container } from '@mantine/core';

import Header from './header';

export type LayoutProps = {
  children: React.ReactNode;
};

// TODO: pull to refresh for container
function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header
        tabs={[
          { name: 'Übersicht', url: '/' },
          { name: 'Stundenplan', url: '/schedule' }
        ]}
        defaultValue="Übersicht"
      />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}

export default withPageAuthRequired(Layout);
