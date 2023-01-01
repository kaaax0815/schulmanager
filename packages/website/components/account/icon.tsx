import { Loader } from '@mantine/core';
import { IconCheck, IconDeviceFloppy, IconX } from '@tabler/icons';

import { FormStatusActionKind } from '../../reducers/formStatus';

interface StatusActionIconProps {
  status: FormStatusActionKind;
}

export default function StatusActionIcon({ status }: StatusActionIconProps) {
  switch (status) {
    case FormStatusActionKind.loading:
      return <Loader color="white" size={18} />;
    case FormStatusActionKind.success:
      return <IconCheck size={18} />;
    case FormStatusActionKind.error:
      return <IconX size={18} />;
    default:
      return <IconDeviceFloppy size={18} />;
  }
}
