import { useRef, useState } from 'react';
import Button from './UI/Button.tsx';
import Form, { FormHandle } from './UI/Form.tsx';
import Input from './UI/Input.tsx';
import { useTimersContext } from '../store/timers-context.tsx';

export default function AddTimer() {
  const form = useRef<FormHandle>(null);
  const { addTimer } = useTimersContext();
  const [error, setError] = useState<string | null>(null);

  function handleSaveTimer(data: unknown) {
    const { name, duration } = (data ?? {}) as { name?: string; duration?: string };

    const trimmedName = (name ?? '').trim();
    const dur = Number(duration);

    if (!trimmedName) {
      setError('Please enter a name.');
      return;
    }
   
    if (!Number.isFinite(dur) || dur <= 0) {
      setError('Please enter a positive duration (in seconds).');
      return;
    }

    addTimer({ name: trimmedName, duration: dur });
    setError(null);
    form.current?.clear();
  }

  return (
    <Form ref={form} onSave={handleSaveTimer} id="add-timer">
      <Input type="text" label="Name" id="name" placeholder="e.g. Study" />
      <Input type="number" label="Duration" id="duration" placeholder="'in seconds'"/>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="actions">
        <Button>Add Timer</Button>
      </p>
    </Form>
  );
}
