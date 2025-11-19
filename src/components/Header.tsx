import Button from './UI/Button';
import { useTimersContext } from '../store/timers-context';

export default function Header() {
  const { isRunning, startTimers, stopTimers } = useTimersContext();

  const label = isRunning ? "Stop" : "Start";
  const className = isRunning ? "button--stop" : "button--primary";

  return (
    <header>
      <h1>ReactTimer⏱️</h1>
      <Button
        onClick={isRunning ? stopTimers : startTimers}
        className={className}
      >
        {label} Timers
      </Button>
    </header>
  );
}
