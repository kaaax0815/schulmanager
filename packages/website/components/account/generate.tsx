import { Button, Modal, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';

export interface GenerateModalProps {
  opened: boolean;
  toggleOpened: () => void;
  setToken: (token: string) => void;
}

export default function GenerateModal({ opened, toggleOpened, setToken }: GenerateModalProps) {
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Email darf nicht leer sein';
        }
        if (!value.includes('@')) {
          return 'Email muss eine gültige Email sein';
        }
      },
      password: (value) => {
        if (!value) {
          return 'Passwort darf nicht leer sein';
        }
      }
    }
  });

  const submit = form.onSubmit(async (v) => {
    showNotification({
      id: 'generating-token',
      title: 'Token wird generiert...',
      message: 'Bitte warten...',
      loading: true,
      autoClose: false,
      disallowClose: true
    });
    const result = await fetch('/api/schulmanager/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(v)
    });
    const json = await result.json();
    if (json.status === 'success') {
      updateNotification({
        id: 'generating-token',
        title: 'Erfolgreich generiert',
        message: 'Token wurde erfolgreich generiert. Du musst diesen nur noch speichern.',
        color: 'teal',
        icon: <IconCheck size={18} />,
        autoClose: 4000
      });
      form.reset();
      setToken(json.data.token);
      toggleOpened();
    } else {
      updateNotification({
        id: 'generating-token',
        title: 'Fehler',
        message: `Token konnte nicht generiert werden. ${json.nachricht || json.message}`,
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: 2000
      });
    }
  });

  return (
    <Modal opened={opened} onClose={() => toggleOpened()} centered title="Token generieren">
      <form onSubmit={submit}>
        <TextInput
          placeholder="user@example.org"
          label="Email"
          {...form.getInputProps('email')}
          autoComplete="off"
        />
        <PasswordInput
          placeholder="SuperSecurePassword"
          label="Password"
          {...form.getInputProps('password')}
          autoComplete="off"
        />

        <Button mt="xs" type="submit">
          Generieren!
        </Button>
      </form>
    </Modal>
  );
}
