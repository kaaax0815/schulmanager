import { Card, Center, Container, createStyles, Flex, Grid, Group, Text } from '@mantine/core';
import { InferGetServerSidePropsType } from 'next';
import { Fragment } from 'react';
import {
  getLessons,
  getLoginStatus,
  InvalidStatusCode,
  models,
  NotAuthenticated
} from 'schulmanager';

import Layout from '../components/layout';
import Substitution from '../components/timetable/substitution';
import useIcons, { UseIconsProps } from '../hooks/useIcons';
import {
  dateInTime,
  formatApiToHuman,
  formatDateToAPI,
  getLastMonday,
  getUpcomingSunday
} from '../utils/date';
import { withAuthAndDB } from '../utils/guard';

const useStyles = createStyles((theme) => ({
  border: {
    borderTop: `1px solid`,
    borderTopColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
  },
  root: {
    '> div': {
      borderRight: `1px solid`,
      borderRightColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
      '&:nth-child(6n)': {
        borderRight: 'none'
      }
    }
  }
}));

// TODO: comment support
// TODO: switching between weeks

export default function Timetable(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  useIcons(props.iconsData);
  return (
    <Layout px="xs" pb="xs">
      <Card shadow="sm" radius="md" mt="xs" p="xs">
        <Grid columns={props.dates.length * 2 + 1} gutter={3} className={classes.root}>
          <Grid.Col span={1} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            {' '}
          </Grid.Col>
          {props.dates.map((date) => (
            <Grid.Col span={2} key={date.date} sx={{ textAlign: 'center' }}>
              <Text fw={700} fz="xs">
                {date.weekday}.
              </Text>
              <Text fz="xs">{date.date}</Text>
            </Grid.Col>
          ))}
          {props.timetable.map((lessons, classHour) => (
            <Fragment key={classHour}>
              <Grid.Col span={1} className={classes.border}>
                <Flex h="100%" w="100%" justify="center" align="center">
                  <Text fz="xs">{classHour + 1}</Text>
                </Flex>
              </Grid.Col>
              {lessons.map((lesson, day) => (
                <Grid.Col
                  span={2}
                  key={classHour.toString() + day.toString()}
                  className={classes.border}
                >
                  {!lesson.isFree && lesson.actualLesson && (
                    <Container p={5}>
                      <Group position="apart" spacing={0}>
                        <Substitution substitute="subject" lesson={lesson} />
                        <Substitution substitute="teacher" lesson={lesson} />
                      </Group>
                      <Center>
                        <Substitution substitute="room" lesson={lesson} />
                      </Center>
                    </Container>
                  )}
                </Grid.Col>
              ))}
            </Fragment>
          ))}
        </Grid>
      </Card>
    </Layout>
  );
}

interface FreeLesson {
  date: string;
  classHour: { number: string };
  isFree: true;
}

export const getServerSideProps = withAuthAndDB<{
  timetable: ((models.Lesson & { isFree: false }) | FreeLesson)[][];
  dates: { weekday: string; date: string }[];
  iconsData: UseIconsProps;
}>(async function getServerSideProps({ user: { jwt: token }, iconsData }) {
  try {
    const loginStatus = await getLoginStatus(token);

    const dateToCheck = dateInTime({ weeks: 1 });

    const startOfWeek = formatDateToAPI(getLastMonday(dateToCheck));
    const endOfWeek = formatDateToAPI(getUpcomingSunday(dateToCheck));

    const schedule = await getLessons(token, {
      start: startOfWeek,
      end: endOfWeek,
      student: {
        id: loginStatus.data.associatedStudent.id
      }
    });

    const dates = [...new Set(schedule.data.map((lesson) => lesson.date))].sort();

    const classHours = schedule.data
      .reduce((acc, lesson) => {
        const classHour = Number.parseInt(lesson.classHour.number);
        if (!acc.includes(classHour)) {
          acc.push(classHour);
        }
        return acc;
      }, [] as number[])
      .sort((a, b) => a - b);

    const timetable: ((models.Lesson & { isFree: false }) | FreeLesson)[][] = [];

    for (const classHour of classHours) {
      const temp: ((models.Lesson & { isFree: false }) | FreeLesson)[] = [];
      for (const date of dates) {
        const lesson = schedule.data.find(
          (lesson) => lesson.classHour.number === classHour.toString() && lesson.date === date
        );
        temp.push(
          lesson
            ? { ...lesson, isFree: false }
            : { date: date, classHour: { number: classHour.toString() }, isFree: true }
        );
      }
      timetable.push(temp);
    }

    return {
      props: {
        timetable,
        dates: dates.map((date) => ({
          weekday: formatApiToHuman(date, {
            weekday: 'short',
            day: undefined,
            month: undefined,
            year: undefined
          }),
          date: formatApiToHuman(date, {
            day: 'numeric',
            month: 'numeric',
            weekday: undefined,
            year: undefined
          })
        })),
        iconsData
      }
    };
  } catch (e) {
    if (e instanceof InvalidStatusCode || e instanceof NotAuthenticated) {
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
