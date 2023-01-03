import { Button, Container, createStyles, Group, Text } from '@mantine/core';
import { IconLogin } from '@tabler/icons';
import Image from 'next/image';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  }
}));

export default function Logout() {
  const { classes } = useStyles();
  return (
    <>
      <nav className={classes.header}>
        <Container>
          <Group position="apart">
            <Image src={'/images/logo.png'} alt="Logo" width={40} height={40} />
            <p>kaaaxcreators&apos; Schulmanager</p>
          </Group>
        </Container>
      </nav>
      <main>
        <Container>
          <h1>Ausgeloggt</h1>
          <Text mb="xl">Du wurdest erfolgreich ausgeloggt</Text>
          <Link href="/">
            <Button leftIcon={<IconLogin />}>Wieder einloggen</Button>
          </Link>
        </Container>
      </main>
    </>
  );
}
