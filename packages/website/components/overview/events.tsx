import { Anchor, Button, Card, Group, Text } from '@mantine/core';
import { IconCalendar } from '@tabler/icons';
import { Fragment } from 'react';
import { models } from 'schulmanager';

import { formatApiToHuman } from '@/utils/date';

export interface EventsProps {
  upcomingEvents: { start: string; events: models.Event[] }[] | null;
}

export default function Events(props: EventsProps) {
  if (!props.upcomingEvents) {
    return null;
  }

  return (
    <>
      <Card shadow="sm" radius="md" mt="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <IconCalendar size={20} />
            <Text weight={500}>Kommende Termine</Text>
          </Group>
        </Card.Section>
        {props.upcomingEvents.map((event) => (
          <Fragment key={event.start}>
            <Card.Section inheritPadding py="xs">
              <Text fw={700}>{formatApiToHuman(event.start)}</Text>
            </Card.Section>
            <Card.Section inheritPadding>
              {event.events.map((event) => (
                <Anchor
                  key={event.id}
                  href={`https://login.schulmanager-online.de/#/modules/calendar/overview/view-event/${event.id}`}
                >
                  {event.summary}
                </Anchor>
              ))}
            </Card.Section>
          </Fragment>
        ))}
        <Button
          component="a"
          href="https://login.schulmanager-online.de/#/modules/calendar/overview/"
          mt="xs"
        >
          Zum Kalender
        </Button>
      </Card>
    </>
  );
}
