import { useEffect, useState, useRef } from "react";
import Container from "./UI/Container";
import Button from "./UI/Button";
import { useTimersContext, type Timer as TimerProps } from "../store/timers-context";

export default function Timer({ id, name, duration }: TimerProps) {
  const { isRunning: masterRunning, removeTimer } = useTimersContext();  
  const [localRunning, setLocalRunning] = useState<boolean>(true);     
  const [remainingTime, setRemainingTime] = useState<number>(duration * 1000);
  const intervalRef = useRef<number | null>(null);

  const active = masterRunning && localRunning;

  useEffect(() => {
    setRemainingTime(duration * 1000);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const idInt = window.setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 50, 0));
    }, 50);
    intervalRef.current = idInt;
    return () => clearInterval(idInt);
  }, [active]);

  useEffect(() => {
    if (remainingTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setLocalRunning(false);
    }
  }, [remainingTime]);

  const formattedRemainingTime = (remainingTime / 1000).toFixed(2);

  function onToggleLocal() {
    if (!masterRunning) return;      
    setLocalRunning((v) => !v);
  }

  const smallBtnLabel = !masterRunning ? "Resume" : localRunning ? "Pause" : "Resume";
  const smallBtnClass =
    `button--chip ${(!masterRunning ? "button--chip-resume" : localRunning ? "button--chip-pause" : "button--chip-resume")}`;

  return (
    <Container as="article">
      <h2>{name}</h2>

      <p><progress max={duration * 1000} value={remainingTime} /></p>
      <p>{formattedRemainingTime}s</p>

      <div style={{ display: "flex", justifyContent: "center", gap: ".5rem", marginTop: ".5rem" }}>
        <Button
          type="button"
          className={smallBtnClass}
          onClick={onToggleLocal}
          disabled={!masterRunning}                         
          aria-disabled={!masterRunning}
          title={!masterRunning ? "Global pause is active" : (localRunning ? "Pause this timer" : "Resume this timer")}
        >
          {smallBtnLabel}
        </Button>

        <Button
          type="button"
          className="button--chip button--chip-restart"
          onClick={() => setRemainingTime(duration * 1000)}
          title="Restart this timer">
         Restart
        </Button>


        <Button
          type="button"
          className="button--chip button--chip-danger"
          onClick={() => removeTimer(id)}
          title="Delete timer"
        >
          Delete
        </Button>
      </div>
      {!masterRunning && (
        <p className="fallback" style={{ marginTop: ".35rem" }}>
          All timers are paused !
        </p>
      )}
    </Container>
  );
}
