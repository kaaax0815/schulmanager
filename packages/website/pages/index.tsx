import { Settings } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import { useMemo } from 'react';
import { batchRequest, get, getLoginStatus, InvalidStatusCode, models } from 'schulmanager';

import Layout from '@/components/layout';
import Disabled from '@/components/overview/disabled';
import Events from '@/components/overview/events';
import Exams from '@/components/overview/exams';
import Letters from '@/components/overview/letters';
import NextLesson from '@/components/overview/nextLesson';
import useIcons, { UseIconsProps } from '@/hooks/useIcons';
import { dateInTime, formatDateToAPI, getNextWorkingDay } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

export default function Overview(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useIcons(props.iconsData);

  const components = useMemo(() => {
    return [
      {
        i: props.settings.nextLessonPosition,
        v: <NextLesson nextLesson={props.nextLesson} />
      },
      {
        i: props.settings.lettersPosition,
        v: <Letters unreadLetters={props.unreadLetters} />
      },
      {
        i: props.settings.eventsPosition,
        v: <Events upcomingEvents={props.upcomingEvents} />
      },
      {
        i: props.settings.examsPosition,
        v: <Exams upcomingExams={props.upcomingExams} />
      }
    ].sort((a, b) => a.i - b.i);
  }, [props]);
  return (
    <Layout pb="md">
      {components.map((component) => component.v)}
      <Disabled
        nextLesson={props.nextLesson}
        unreadLetters={props.unreadLetters}
        upcomingEvents={props.upcomingEvents}
        upcomingExams={props.upcomingExams}
      />
    </Layout>
  );
}

export const getServerSideProps = withAuthAndDB<{
  unreadLetters: models.Letter[] | null;
  upcomingEvents: { start: string; events: models.Event[] }[] | null;
  upcomingExams: models.Exam[] | null;
  iconsData: UseIconsProps;
  nextLesson: models.Lesson | null;
  settings: Settings;
}>(async function getServerSideProps({ user, iconsData }) {
  try {
    const collator = new Intl.Collator();

    const student = await getLoginStatus(user.jwt);

    const now = new Date();

    const response = await batchRequest(user.jwt, [
      get('letters:get-letters'),
      get('calendar:get-events-for-user', {
        start: formatDateToAPI(now),
        includeHolidays: false,
        end: formatDateToAPI(dateInTime({ months: 3 }))
      }),
      get('exams:get-exams', {
        start: formatDateToAPI(now),
        end: formatDateToAPI(dateInTime({ months: 2 })),
        student: { id: student.data.associatedStudent.id }
      }),
      get('schedules:get-actual-lessons', {
        start: formatDateToAPI(now),
        student: { id: student.data.associatedStudent.id },
        end: formatDateToAPI(getNextWorkingDay(now))
      }),
      get('schedules:poqa+classhour', {
        action: {
          action: 'findAll',
          model: 'main/class-hour',
          parameters: [
            {
              attributes: ['id', 'number', 'from', 'until', 'fromByDay', 'untilByDay']
            }
          ]
        }
      })
    ] as const);

    let nextLessonToReturn: models.Lesson | null = null;

    nextLessonEnabled: if (user.settings.nextLessonEnabled) {
      const nextLessons = response.results[3];
      const classHours = response.results[4];

      let dateOfNextClassHour = new Date();

      let nextClassHour = classHours.data.find((classHour) => {
        const [fromHour, fromMinute, fromSeconds] = classHour.from.split(':');
        const from = new Date();
        from.setUTCHours(+fromHour, +fromMinute, +fromSeconds);

        const [untilHour, untilMinute, untilSeconds] = classHour.until.split(':');
        const until = new Date();
        until.setUTCHours(+untilHour, +untilMinute, +untilSeconds);

        return from <= dateOfNextClassHour && dateOfNextClassHour <= until;
      });

      if (!nextClassHour) {
        dateOfNextClassHour = getNextWorkingDay(dateOfNextClassHour);
        nextClassHour = classHours.data.find((classHour) => {
          return classHour.number === '1';
        });
      }

      if (!nextClassHour) {
        break nextLessonEnabled;
      }

      const nextLesson = nextLessons.find(
        (lesson) =>
          lesson.classHour.id == nextClassHour!.id &&
          lesson.date == formatDateToAPI(dateOfNextClassHour)
      );

      nextLessonToReturn = nextLesson || null;
    }

    let lettersToReturn: models.Letter[] | null = null;

    if (user.settings.lettersEnabled) {
      const letters = response.results[0];

      const unreadLetters = letters.filter(
        (letter) => letter.studentStatuses[0].readTimestamp === null
      );

      const sortedLetters = unreadLetters.sort((a, b) =>
        collator.compare(a.createdAt, b.createdAt)
      );

      lettersToReturn = sortedLetters;
    }

    let eventsToReturn:
      | {
          start: string;
          events: models.Event[];
        }[]
      | null = null;

    if (user.settings.eventsEnabled) {
      const upcomingEvents = response.results[1];

      const allUpcomingEvents = [
        ...upcomingEvents.nonRecurringEvents,
        ...upcomingEvents.recurringEvents
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

      eventsToReturn = groupedEvents;
    }

    let examsToReturn: models.Exam[] | null = null;

    if (user.settings.examsEnabled) {
      const upcomingExams = response.results[2];

      const sortedExams = upcomingExams.sort((a, b) => collator.compare(a.date, b.date));

      const uniqueExams = [...new Map(sortedExams.map((item) => [item.subject.id, item])).values()];

      examsToReturn = uniqueExams;
    }

    return {
      props: {
        unreadLetters: lettersToReturn,
        upcomingEvents: eventsToReturn,
        upcomingExams: examsToReturn,
        iconsData: iconsData,
        nextLesson: nextLessonToReturn,
        settings: user.settings
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
