import { useContext, createContext, type ReactNode, useReducer } from "react";

export type Timer = {
    id: string;
    name: string;
    duration: number;
};

export type NewTimer = Omit<Timer, "id">;

type TimersState = {
    isRunning : boolean;
    timers: Timer[];
};

const initialState: TimersState = {
    isRunning: true,
    timers: []
};

type TimersContextValue = TimersState & {
    addTimer: (timerData: NewTimer) => void,
    removeTimer: (id: string) => void,
    startTimers: () => void,
    stopTimers: () => void
}

const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
    const ctx = useContext(TimersContext)
    
    if (ctx === null) {
        throw new Error ("TimersContext is null");
    }

    return ctx;
};

type StartTimersAction = {
    type: "START_TIMERS"
};

type StopTimersAction = {
    type: "STOP_TIMERS"
};

type AddTimerAction = {
    type: "ADD_TIMER",
    payload: Timer
};

type RemoveTimerAction = {
    type: "REMOVE_TIMER",
    payload: {id:string}
}

type Action = StartTimersAction | StopTimersAction | AddTimerAction | RemoveTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  switch (action.type) {
    case "START_TIMERS":
      return { ...state, isRunning: true };
    case "STOP_TIMERS":
      return { ...state, isRunning: false };
    case "ADD_TIMER":
      return { ...state, timers: [...state.timers, action.payload] };
    case "REMOVE_TIMER":
      return { ...state, timers: state.timers.filter(t => t.id !== action.payload.id) };
    default:
      return state;
  }
};

export default function TimersContextProvider({ children }: { children: ReactNode }) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);

  function genId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  const ctx: TimersContextValue = {
    timers: timersState.timers,
    isRunning: timersState.isRunning,
    addTimer(timerData) {
      const timer: Timer = { id: genId(), ...timerData };
      dispatch({ type: "ADD_TIMER", payload: timer });
    },
    removeTimer(id) {
      dispatch({ type: "REMOVE_TIMER", payload: { id } });
    },
    startTimers() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };

  return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>;
}