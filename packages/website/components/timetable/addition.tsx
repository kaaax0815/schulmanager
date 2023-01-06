import { Flex, Group, Popover, Text } from '@mantine/core';
import { Lesson } from 'types/timetable';

export interface AdditionProps {
  lesson: Lesson;
}

export default function Addition(props: AdditionProps) {
  if (!props.lesson.addition) {
    return null;
  }

  return (
    <>
      {props.lesson.addition.map((addition) => (
        <Group position="apart" key={addition.absenceId}>
          <Popover withArrow shadow="md">
            <Popover.Target>
              <Text fz="xs" color="green">
                {addition.text}
              </Text>
            </Popover.Target>
            <Popover.Dropdown p={5}>
              <Text fz="xs">{addition.text}</Text>
            </Popover.Dropdown>
          </Popover>
          <Flex>
            {addition.teachers.map((teacher, i) => (
              <Popover withArrow shadow="md" key={teacher.abbreviation}>
                <Popover.Target>
                  <Text fz="xs" color="green">
                    {i > 0 && ', '}
                    {teacher.abbreviation}
                  </Text>
                </Popover.Target>
                <Popover.Dropdown p={5}>
                  <Text fz="xs">
                    {teacher.lastname}, {teacher.firstname}
                  </Text>
                </Popover.Dropdown>
              </Popover>
            ))}
          </Flex>
        </Group>
      ))}
    </>
  );
}
