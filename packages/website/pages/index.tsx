import { getSession } from '@auth0/nextjs-auth0';
import { Anchor, Button, Card, createStyles, Group, Text } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Fragment } from 'react';
import { getEvents, getExams, getLetters, getLoginStatus, models } from 'schulmanager';

import Layout from '../components/layout';
import prisma from '../lib/prisma';
import { dateInMonth, formatApiToHuman, formatDateToAPI } from '../utils/date';

const useStyles = createStyles(() => ({
  table: {
    width: '100%',
    th: {
      textAlign: 'left'
    }
  }
}));

export default function Overview(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
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
          <table className={classes.table}>
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
          </table>
        </Card.Section>
      </Card>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  unreadLetters: models.Letter[];
  upcomingEvents: { start: string; events: models.Event[] }[];
  upcomingExams: models.Exam[];
}> = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false
      }
    };
  }
  const entry = await prisma.user.findUnique({
    where: {
      sub: session.user.sub
    }
  });
  if (!entry) {
    return {
      redirect: {
        destination: '/account?error=notfound',
        permanent: false
      }
    };
  }
  const token = entry.jwt;
  try {
    // TODO: optimize sorting, grouping, etc.
    const letters = await getLetters(token);
    const unreadLetters = letters.data
      .filter((letter) => letter.studentStatuses[0].readTimestamp === null)
      .sort((a, b) => {
        // oldest first
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return aDate.getTime() - bDate.getTime();
      });

    const upcomingEvents = await getEvents(token, {
      start: formatDateToAPI(new Date()),
      includeHolidays: false,
      end: formatDateToAPI(dateInMonth(3))
    });

    const allUpcomingEvents = [
      ...upcomingEvents.data.nonRecurringEvents,
      ...upcomingEvents.data.recurringEvents
    ].sort((a, b) => {
      // closest first
      const aDate = new Date(a.start);
      const bDate = new Date(b.start);
      return aDate.getTime() - bDate.getTime();
    });

    const groupedEvents = allUpcomingEvents.reduce((prev, curr) => {
      prev[curr.start] = [...(prev[curr.start] || []), curr];
      return prev;
    }, {} as { [start: string]: models.Event[] });

    const groupedByArrayEvents = Object.keys(groupedEvents).map((key) => ({
      start: key,
      events: groupedEvents[key]
    }));

    const student = await getLoginStatus(token);

    const upcomingExams = await getExams(token, {
      start: formatDateToAPI(new Date()),
      end: formatDateToAPI(dateInMonth(2)),
      student: { id: student.data.associatedStudent.id }
    });

    const sortedExams = upcomingExams.data.sort((a, b) => {
      // closest first
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    });

    const uniqueExams = sortedExams.filter((exam, index) => {
      const nextExam = sortedExams[index + 1];
      if (!nextExam) {
        return true;
      }
      return exam.subject.id !== nextExam.subject.id;
    });

    return {
      props: {
        unreadLetters,
        upcomingEvents: groupedByArrayEvents,
        upcomingExams: uniqueExams
      }
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/account?error=jwt',
        permanent: false
      }
    };
  }
};
