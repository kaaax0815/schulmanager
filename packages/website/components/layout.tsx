import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Container, ContainerProps } from '@mantine/core';
import { IconClock, IconHome } from '@tabler/icons';

import Header from './header';

export interface LayoutProps extends Partial<ContainerProps> {
  children: React.ReactNode;
}

// TODO: pull to refresh for container
function Layout({ children, ...rest }: LayoutProps) {
  return (
    <>
      <Header
        tabs={[
          { name: 'Übersicht', url: '/', icon: IconHome },
          { name: 'Stundenplan', url: '/timetable', icon: IconClock }
        ]}
      />
      <main>
        <Container {...rest}>{children}</Container>
      </main>
    </>
  );
}

export default withPageAuthRequired(Layout);
