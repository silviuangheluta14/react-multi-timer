import { useTimersContext } from "../store/timers-context.tsx";
import Timer from "./Timer.tsx";

export default function Timers() {
  const { timers } = useTimersContext();

  if (timers.length === 0) {
    return <p className="fallback">No timers yet !</p>;
  }

  return (
    <ul>
      {timers.map((t) => (
        <li key={t.id}>
          <Timer {...t} />
        </li>
      ))}
    </ul>
  );
}
