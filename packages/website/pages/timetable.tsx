import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  createStyles,
  Flex,
  Grid,
  Group,
  Text
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { getLessons, getLoginStatus, InvalidStatusCode, NotAuthenticated } from 'schulmanager';
import { TimetableEntry } from 'types/timetable';

import Layout from '@/components/layout';
import Addition from '@/components/timetable/addition';
import Comment from '@/components/timetable/comment';
import Substitution from '@/components/timetable/substitution';
import useIcons, { UseIconsProps } from '@/hooks/useIcons';
import {
  dateInTime,
  dateRange,
  formatApiToHuman,
  formatDateToAPI,
  getFridayOfWeek,
  getMondayOfWeek,
  getWeekNumber
} from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

const useStyles = createStyles((theme) => ({
  border: {
    borderTop: `1px solid`,
    borderTopColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
  },
  root: {
    '> div': {
      borderRight: `1px solid`,
      borderRightColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
      '&:nth-of-type(6n)': {
        borderRight: 'none'
      }
    }
  }
}));

export default function Timetable(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  useIcons(props.iconsData);
  const router = useRouter();

  const startDate = useMemo(() => {
    return new Date(router.query.start as string);
  }, [router.query.start]);

  const weekNumber = useMemo(() => {
    return getWeekNumber(new Date(router.query.start as string));
  }, [router.query.start]);

  const addWeek = () => {
    const newDate = dateInTime({
      date: startDate,
      weeks: 1
    });
    router.replace(`/timetable?start=${formatDateToAPI(newDate)}`);
  };

  const subtractWeek = () => {
    const newDate = dateInTime({
      date: startDate,
      weeks: -1
    });
    router.replace(`/timetable?start=${formatDateToAPI(newDate)}`);
  };

  const today = () => {
    router.replace(`/timetable?start=${formatDateToAPI(new Date())}`);
  };

  return (
    <Layout px="xs" pb="xs">
      <Card shadow="sm" mt="xs" mih={660}>
        <Card.Section withBorder inheritPadding py="xs">
          <Grid columns={3} justify="space-around" m={0}>
            <Button variant="light" compact onClick={today}>
              Heute
            </Button>
            <Group>
              <ActionIcon onClick={subtractWeek} disabled={!router.isReady}>
                <IconChevronLeft size={18} />
              </ActionIcon>
              <Text weight={500}>Kalenderwoche {weekNumber}</Text>
              <ActionIcon onClick={addWeek} disabled={!router.isReady}>
                <IconChevronRight size={18} />
              </ActionIcon>
            </Group>
            <Text> </Text>
          </Grid>
        </Card.Section>
        <Card.Section withBorder py="xs">
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
                    {!lesson.isFree && (
                      <Container p={5}>
                        <Group position="apart" spacing={0}>
                          <Substitution substitute="subject" lesson={lesson} />
                          <Substitution substitute="teacher" lesson={lesson} />
                        </Group>
                        <Center>
                          <Substitution substitute="room" lesson={lesson} />
                          <Comment lesson={lesson} />
                        </Center>
                        <Addition lesson={lesson} />
                      </Container>
                    )}
                  </Grid.Col>
                ))}
              </Fragment>
            ))}
          </Grid>
        </Card.Section>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  timetable: TimetableEntry[][];
  dates: { weekday: string; date: string }[];
  iconsData: UseIconsProps;
}>(async function getServerSideProps({ user: { jwt: token }, iconsData, query }) {
  try {
    const loginStatus = await getLoginStatus(token);

    const startQuery = typeof query.start === 'string' ? new Date(query.start) : null;

    if (!startQuery) {
      return {
        redirect: {
          destination: `/timetable?start=${formatDateToAPI(getMondayOfWeek(new Date()))}`,
          permanent: false
        }
      };
    }

    const startOfWeek = getMondayOfWeek(startQuery);

    if (startOfWeek.getTime() !== startQuery.getTime()) {
      return {
        redirect: {
          destination: `/timetable?start=${formatDateToAPI(startOfWeek)}`,
          permanent: false
        }
      };
    }

    const endOfWeek = getFridayOfWeek(startQuery);

    const schedule = await getLessons(token, {
      start: formatDateToAPI(startOfWeek),
      end: formatDateToAPI(endOfWeek),
      student: {
        id: loginStatus.data.associatedStudent.id
      }
    });

    const dates = dateRange(startOfWeek, endOfWeek).map((date) => formatDateToAPI(date));

    const classHours = schedule.data
      .reduce((acc, lesson) => {
        const classHour = Number.parseInt(lesson.classHour.number);
        if (!acc.includes(classHour)) {
          acc.push(classHour);
        }
        return acc;
      }, [] as number[])
      .sort((a, b) => a - b);

    const timetable: TimetableEntry[][] = [];

    for (const classHour of classHours) {
      const temp: TimetableEntry[] = [];
      for (const date of dates) {
        const lesson = schedule.data.find(
          (lesson) =>
            lesson.classHour.number === classHour.toString() &&
            lesson.date === date &&
            !lesson.isNew
        );
        temp.push(
          lesson
            ? { ...lesson, isFree: false }
            : {
                date: date,
                classHour: { number: classHour.toString() },
                isFree: true
              }
        );
      }
      timetable.push(temp);
    }

    const additionalLessons = schedule.data.filter((lesson) => lesson.isNew);

    for (const lesson of additionalLessons) {
      const classHour = Number.parseInt(lesson.classHour.number);
      const date = lesson.date;
      const day = dates.indexOf(date);
      const hour = classHours.indexOf(classHour);
      if (timetable[hour][day].addition === undefined) {
        timetable[hour][day].addition = [];
      }
      if (lesson.event) {
        timetable[hour][day].addition!.push(lesson.event);
      }
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
