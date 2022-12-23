import { Container, createStyles, Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  }
}));

export default function Login() {
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
          <h5>Erfolgreich ausgeloggt</h5>
          <Link href="/">Wieder einloggen</Link>
        </Container>
      </main>
    </>
  );
}
