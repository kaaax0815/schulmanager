import { Card, Flex, Group, Text } from '@mantine/core';
import { IconPlayerTrackNext } from '@tabler/icons';
import { useMemo } from 'react';
import { models } from 'schulmanager';

import { formatApiToHuman } from '@/utils/date';

export interface NextLessonProps {
  nextLesson: models.Lesson | null;
}

export default function NextLesson(props: NextLessonProps) {
  const nextInfo = useMemo(() => {
    if (props.nextLesson?.actualLesson === undefined) {
      return undefined;
    }
    return {
      subjectLabel: props.nextLesson.actualLesson.subject.name,
      room: props.nextLesson.actualLesson.room.name,
      teacher:
        props.nextLesson.actualLesson.teachers[0].lastname +
        ', ' +
        props.nextLesson.actualLesson.teachers[0].firstname,
      comment: props.nextLesson.actualLesson.comment
    };
  }, [props.nextLesson]);

  return (
    <Card shadow="sm" mt="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <IconPlayerTrackNext size={20} />
          <Text weight={500}>
            Nächste Stunde{' '}
            {props.nextLesson && (
              <>
                {'( '}
                {formatApiToHuman(props.nextLesson.date, {
                  day: undefined,
                  month: undefined,
                  year: undefined
                })}
                {' )'}
              </>
            )}
          </Text>
        </Group>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Flex direction="column" align="center">
          {props.nextLesson === null ? (
            <Text>Konnte nächste Stunde nicht berechnen</Text>
          ) : (
            <>
              <Group position="apart">
                <Text>{nextInfo?.subjectLabel}</Text>
                <Text>{nextInfo?.room}</Text>
              </Group>
              <Text>{nextInfo?.teacher}</Text>
              <Text>{nextInfo?.comment}</Text>
            </>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
}
