import { Card, Group, Table, Text } from '@mantine/core';
import { IconFilePencil } from '@tabler/icons';
import { models } from 'schulmanager';

import { formatApiToHuman } from '../../utils/date';

export interface ExamsProps {
  upcomingExams: models.Exam[] | null;
}

export default function Exams(props: ExamsProps) {
  if (!props.upcomingExams) {
    return null;
  }

  return (
    <>
      <Card shadow="sm" radius="md" mt="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <IconFilePencil size={20} />
            <Text weight={500}>Klausuren</Text>
          </Group>
        </Card.Section>
        <Card.Section inheritPadding py="xs">
          <Table>
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
          </Table>
        </Card.Section>
      </Card>
    </>
  );
}
