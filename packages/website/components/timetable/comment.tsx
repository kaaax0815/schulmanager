import { ActionIcon, Popover, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { Lesson } from 'types/timetable';

export interface CommentProps {
  lesson: Lesson;
}

export default function Comment(props: CommentProps) {
  if (!props.lesson.comment) {
    return null;
  }

  return (
    <Popover withArrow shadow="md">
      <Popover.Target>
        <ActionIcon title="Kommentar">
          <IconInfoCircle size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={5}>
        <Text fz="xs">{props.lesson.comment}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
