import { Button, Card, Group, Text } from '@mantine/core';
import { IconMail } from '@tabler/icons';
import { models } from 'schulmanager';

import { formatApiToHuman } from '../../utils/date';

export interface LettersProps {
  unreadLetters: models.Letter[] | null;
}

export default function Letters(props: LettersProps) {
  if (!props.unreadLetters) {
    return null;
  }

  return (
    <>
      {props.unreadLetters.map((letter) => (
        <Card shadow="sm" radius="md" mt="md" key={letter.id}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <IconMail size={20} />
              <Text weight={500}>Ungelesener Elternbrief</Text>
            </Group>
          </Card.Section>
          <Card.Section inheritPadding pt="xs">
            <Text fw={700} size="lg">
              {letter.title}
            </Text>
          </Card.Section>
          <Card.Section inheritPadding py="xs">
            <Group>
              <Text>{formatApiToHuman(letter.createdAt, { weekday: undefined })}</Text>
              <Button
                component="a"
                href={`https://login.schulmanager-online.de/#/modules/letters/view/view/${letter.id}`}
                compact
              >
                Lesen
              </Button>
            </Group>
          </Card.Section>
        </Card>
      ))}
    </>
  );
}
