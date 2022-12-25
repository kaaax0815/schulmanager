import { Button, Flex, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useReducer } from 'react';

import {
  FormStatusActionKind,
  formStatusInitialState,
  formStatusReducer
} from '../../reducers/formStatus';

export interface GenerateModalProps {
  opened: boolean;
  toggleOpened: () => void;
  setToken: (token: string) => void;
}

export default function GenerateModal({ opened, toggleOpened, setToken }: GenerateModalProps) {
  const [email, setEmail] = useInputState('');
  const [password, setPassword] = useInputState('');
  const [status, setStatus] = useReducer(formStatusReducer, formStatusInitialState);
  const generateToken = async () => {
    setStatus({ status: FormStatusActionKind.loading });
    const result = await fetch('/api/schulmanager/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const json = await result.json();
    if (json.status !== 'success') {
      setStatus({ status: FormStatusActionKind.error, message: json.message });
      setTimeout(() => setStatus(formStatusInitialState), 2000);
      return;
    }
    setToken(json.data.token);
    toggleOpened();
    setStatus(formStatusInitialState);
  };
  return (
    <Modal opened={opened} onClose={() => toggleOpened()} centered title="JWT Token generieren">
      <Flex gap="md" direction="column">
        <TextInput placeholder="user@example.org" label="Email" value={email} onChange={setEmail} />
        <PasswordInput
          placeholder="SuperSecurePassword"
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <Button onClick={generateToken}>Generieren!</Button>
      </Flex>
      <Text>{status.message}</Text>
    </Modal>
  );
}
