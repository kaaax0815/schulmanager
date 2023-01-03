import { Group, Popover, Text } from '@mantine/core';
import { models } from 'schulmanager';

export interface SubstitutionProps {
  lesson: models.Lesson & {
    isFree: boolean;
  };
  substitute: 'subject' | 'teacher' | 'room';
}

const SubstitutionKeys = (props: Pick<SubstitutionProps, 'lesson'>) =>
  ({
    subject: {
      prev: props.lesson.originalLessons?.[0].subjectLabel,
      curr: props.lesson.actualLesson?.subjectLabel
    },
    teacher: {
      prev: props.lesson.originalLessons?.[0].teachers[0].abbreviation,
      curr: props.lesson.actualLesson?.teachers[0].abbreviation
    },
    room: {
      prev: props.lesson.originalLessons?.[0].room.name,
      curr: props.lesson.actualLesson?.room.name
    }
  } as const);

export default function Substitution(props: SubstitutionProps) {
  const isSubForKey =
    SubstitutionKeys(props)[props.substitute].prev &&
    SubstitutionKeys(props)[props.substitute].curr !==
      SubstitutionKeys(props)[props.substitute].prev;
  return (
    <Group>
      {isSubForKey && (
        <SubstitutionPopover lesson={props.lesson} substitute={props.substitute} isSubForKey>
          <Text
            fz="xs"
            td={isSubForKey ? 'line-through' : undefined}
            color={isSubForKey ? 'red' : undefined}
          >
            ({SubstitutionKeys(props)[props.substitute].prev})
          </Text>
        </SubstitutionPopover>
      )}
      <SubstitutionPopover lesson={props.lesson} substitute={props.substitute}>
        <Text
          fz="xs"
          fw={props.substitute === 'subject' ? 700 : undefined}
          color={isSubForKey ? 'green' : undefined}
        >
          {SubstitutionKeys(props)[props.substitute].curr}
        </Text>
      </SubstitutionPopover>
    </Group>
  );
}

interface SubstitutionPopoverProps extends SubstitutionProps {
  children: React.ReactNode;
  isSubForKey?: boolean;
}

const SubstitutionPopoverKeys = (props: Pick<SubstitutionProps, 'lesson'>) =>
  ({
    subject: {
      prev: props.lesson.originalLessons?.[0].subject.name,
      curr: props.lesson.actualLesson?.subject.name
    },
    teacher: {
      prev:
        props.lesson.originalLessons?.[0].teachers[0].lastname +
        ', ' +
        props.lesson.originalLessons?.[0].teachers[0].firstname,
      curr:
        props.lesson.actualLesson?.teachers[0].lastname +
        ', ' +
        props.lesson.actualLesson?.teachers[0].firstname
    },
    room: {
      ...SubstitutionKeys(props).room
    }
  } as const);

function SubstitutionPopover(props: SubstitutionPopoverProps) {
  return (
    <Popover withArrow shadow="md">
      <Popover.Target>{props.children}</Popover.Target>
      <Popover.Dropdown p={5}>
        <Text fz="xs">
          {SubstitutionPopoverKeys(props)[props.substitute][props.isSubForKey ? 'prev' : 'curr']}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
