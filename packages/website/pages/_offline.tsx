import { Container, createStyles, Flex, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  }
}));

export default function Offline() {
  const { classes } = useStyles();
  return (
    <>
      <nav className={classes.header}>
        <Container>
          <Group position="apart">
            <Image src={'/images/logo_512.png'} alt="Logo" width={40} height={40} />
            <p>kaaaxcreators&apos; Schulmanager</p>
          </Group>
        </Container>
      </nav>
      <main>
        <Flex direction="column" align="center" justify="center" h="100%" w="100%">
          <Title fw={900} size={34}>
            Du bist offline
          </Title>
          <Text color="dimmed" size="lg" align="center">
            Du bist offline. Bitte überprüfe deine Internetverbindung.
          </Text>
        </Flex>
      </main>
    </>
  );
}
