import { Button, Container, createStyles, Flex, Group, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  outer: {
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    height: '100vh'
  },

  label: {
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120
    }
  },

  title: {
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32
    }
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][1]
  }
}));

export default function InternalServerError() {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Flex direction="column" justify="center" className={classes.outer}>
      <Container>
        <Text align="center" fw={900} size={220} className={classes.label}>
          500
        </Text>
        <Title align="center" fw={900} size={22} className={classes.title}>
          Es ist gerade etwas Schlimmes passiert...
        </Title>
        <Text size="lg" align="center" mt="xl" className={classes.description}>
          Unsere Server konnte deine Anfrage nicht bearbeiten. Mache dir keine Sorgen, unser
          Entwicklungsteam wurde bereits benachrichtigt. Versuche, die Seite zu aktualisieren.
        </Text>
        <Group position="center">
          <Button variant="white" size="md" onClick={() => router.reload()}>
            Aktualisieren Sie die Seite
          </Button>
        </Group>
      </Container>
    </Flex>
  );
}
