import { Container, ContainerProps, createStyles, ScrollArea } from '@mantine/core';
import { IconClock, IconHome } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useRef } from 'react';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';

import Header from './header';

export interface LayoutProps extends Partial<ContainerProps> {
  children: React.ReactNode;
}

const useStyles = createStyles((theme) => ({
  scrollArea: {
    [theme.fn.smallerThan('sm')]: {
      height: 'calc(100vh - 63px)'
    },
    height: 'calc(100vh - 101px)'
  },
  container: {
    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100vw'
    }
  }
}));

export default function Layout({ children, ...rest }: LayoutProps) {
  const { classes } = useStyles();

  const router = useRouter();
  const scrollArea = useRef<HTMLDivElement>(null);
  useScrollRestoration(router, scrollArea);

  return (
    <>
      <Header
        tabs={[
          { name: 'Übersicht', url: '/', icon: IconHome },
          { name: 'Stundenplan', url: '/timetable', icon: IconClock }
        ]}
      />
      <main>
        <ScrollArea.Autosize
          maxHeight="100vh"
          type="hover"
          classNames={{
            root: classes.scrollArea
          }}
          viewportRef={scrollArea}
        >
          <Container {...rest} className={classes.container}>
            {children}
          </Container>
        </ScrollArea.Autosize>
      </main>
    </>
  );
}
