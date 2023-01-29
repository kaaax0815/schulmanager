import { InferGetServerSidePropsType } from 'next';
import { batchRequest, get, getLoginStatus, InvalidStatusCode, models } from 'schulmanager';

import Layout from '@/components/layout';
import Disabled from '@/components/overview/disabled';
import Events from '@/components/overview/events';
import Exams from '@/components/overview/exams';
import Letters from '@/components/overview/letters';
import useIcons, { UseIconsProps } from '@/hooks/useIcons';
import { dateInTime, formatDateToAPI } from '@/utils/date';
import { withAuthAndDB } from '@/utils/guard';

export default function Overview(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useIcons(props.iconsData);
  return (
    <Layout pb="md">
      <Letters unreadLetters={props.unreadLetters} />
      <Events upcomingEvents={props.upcomingEvents} />
      <Exams upcomingExams={props.upcomingExams} />
      <Disabled
        upcomingEvents={props.upcomingEvents}
        unreadLetters={props.unreadLetters}
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
}>(async function getServerSideProps({ user, iconsData }) {
  try {
    const collator = new Intl.Collator();

    let lettersToReturn: models.Letter[] | null = null;

    const student = await getLoginStatus(user.jwt);

    const response = await batchRequest(user.jwt, [
      get('letters:get-letters'),
      get('calendar:get-events-for-user', {
        start: formatDateToAPI(new Date()),
        includeHolidays: false,
        end: formatDateToAPI(dateInTime({ months: 3 }))
      }),
      get('exams:get-exams', {
        start: formatDateToAPI(new Date()),
        end: formatDateToAPI(dateInTime({ months: 2 })),
        student: { id: student.data.associatedStudent.id }
      })
    ] as const);

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
        iconsData
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
