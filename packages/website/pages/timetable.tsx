import { Card, Grid, Text } from '@mantine/core';
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
import {
  dateInTime,
  formatApiToHuman,
  formatDateToAPI,
  getLastMonday,
  getUpcomingSunday
} from '../utils/date';
import { withAuthAndDB } from '../utils/guard';

export default function Timetable(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Card shadow="sm" radius="md" mt="md">
        <Grid columns={props.dates.length + 1}>
          <Grid.Col span={1}>/</Grid.Col>
          {props.dates.map((date) => (
            <Grid.Col span={1} key={date}>
              <Text>{date}</Text>
            </Grid.Col>
          ))}
          {props.timetable.map((lessons, classHour) => (
            <Fragment key={classHour}>
              <Grid.Col span={1}>
                <Text>{classHour + 1}</Text>
              </Grid.Col>
              {lessons.map((lesson, day) => (
                <Grid.Col span={1} key={classHour.toString() + day.toString()}>
                  <Text>{!lesson.isFree && <Text>{lesson.actualLesson?.subjectLabel}</Text>}</Text>
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
  dates: string[];
}>(async function getServerSideProps({ entry: { jwt: token } }) {
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
        dates: dates.map((date) => formatApiToHuman(date, { weekday: 'short', year: undefined }))
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
