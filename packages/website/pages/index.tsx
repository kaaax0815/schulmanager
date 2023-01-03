import { Anchor, Button, Card, Group, Table, Text } from '@mantine/core';
import { InferGetServerSidePropsType } from 'next';
import { Fragment } from 'react';
import {
  getEvents,
  getExams,
  getLetters,
  getLoginStatus,
  InvalidStatusCode,
  models
} from 'schulmanager';

import Layout from '../components/layout';
import { dateInTime, formatApiToHuman, formatDateToAPI } from '../utils/date';
import { withAuthAndDB } from '../utils/guard';

export default function Overview(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      {props.unreadLetters.map((letter) => (
        <Card shadow="sm" radius="md" mt="md" key={letter.id}>
          <Card.Section withBorder inheritPadding py="xs">
            <Text weight={500}>Ungelesener Elternbrief</Text>
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
      <Card shadow="sm" radius="md" mt="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Text weight={500}>Kommende Termine</Text>
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
      <Card shadow="sm" radius="md" my="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Text weight={500}>Klausuren</Text>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Table>
            <thead>
              <tr>
                <th>Fach</th>
                <th>Datum</th>
                <th>Stunde</th>
              </tr>
            </thead>
            <tbody>
              {props.upcomingExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.subject.name}</td>
                  <td>{formatApiToHuman(exam.date, { weekday: 'short' })}</td>
                  <td>
                    {exam.startClassHour.number} - {exam.endClassHour.number}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Section>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  unreadLetters: models.Letter[];
  upcomingEvents: { start: string; events: models.Event[] }[];
  upcomingExams: models.Exam[];
}>(async function getServerSideProps({ entry: { jwt: token } }) {
  try {
    const letters = await getLetters(token);

    const collator = new Intl.Collator();

    const unreadLetters = letters.data.filter(
      (letter) => letter.studentStatuses[0].readTimestamp === null
    );

    const sortedLetters = unreadLetters.sort((a, b) => collator.compare(a.createdAt, b.createdAt));

    const upcomingEvents = await getEvents(token, {
      start: formatDateToAPI(new Date()),
      includeHolidays: false,
      end: formatDateToAPI(dateInTime({ months: 3 }))
    });

    const allUpcomingEvents = [
      ...upcomingEvents.data.nonRecurringEvents,
      ...upcomingEvents.data.recurringEvents
    ];

    const sortedEvents = allUpcomingEvents.sort((a, b) => collator.compare(a.start, b.start));

    const groupedEvents = sortedEvents.reduce(
      (prev, curr) => {
        const i = prev.findIndex((v) => v.start == curr.start);
        if (i == -1) {
          prev.push({ start: curr.start, events: [curr] });
        } else {
          prev[i].events.push(curr);
        }
        return prev;
      },
      [] as {
        start: string;
        events: models.Event[];
      }[]
    );

    const student = await getLoginStatus(token);

    const upcomingExams = await getExams(token, {
      start: formatDateToAPI(new Date()),
      end: formatDateToAPI(dateInTime({ months: 2 })),
      student: { id: student.data.associatedStudent.id }
    });

    const sortedExams = upcomingExams.data.sort((a, b) => collator.compare(a.date, b.date));

    const uniqueExams = [...new Map(sortedExams.map((item) => [item.subject.id, item])).values()];

    return {
      props: {
        unreadLetters: sortedLetters,
        upcomingEvents: groupedEvents,
        upcomingExams: uniqueExams
      }
    };
  } catch (e) {
    if (e instanceof InvalidStatusCode) {
      return {
        redirect: {
          destination: '/account?error=jwt',
          permanent: false
        }
      };
    }
    throw e;
  }
});
