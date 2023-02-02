import { Anchor, Text } from '@mantine/core';
import Link from 'next/link';

import { EventsProps } from './events';
import { ExamsProps } from './exams';
import { LettersProps } from './letters';
import { NextLessonProps } from './nextLesson';

export type DisabledProps = EventsProps & ExamsProps & LettersProps & NextLessonProps;

export default function Disabled(props: DisabledProps) {
  let disabled = 0;
  Object.keys(props).forEach((key) => {
    if (props[key as keyof DisabledProps] === null) {
      disabled++;
    }
  });
  if (disabled === 0) {
    return null;
  }
  if (disabled === 1) {
    return (
      <>
        <Text>Es ist ein weiteres Modul ausgeblendet</Text>
        <SettingsLink />
      </>
    );
  }
  return (
    <>
      <Text>Es sind {disabled} weitere Module ausgeblendet.</Text> <SettingsLink />
    </>
  );
}

function SettingsLink() {
  return (
    <Link href="/settings" legacyBehavior passHref>
      <Anchor>Einstellungen ändern</Anchor>
    </Link>
  );
}
