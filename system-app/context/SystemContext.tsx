import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SystemState,
  completeWorkout,
  isCompletedToday,
  loadState,
  resetProgress,
  saveNotificationTime,
  savePlayerName,
} from "@/services/storage";
import { getWorkout, Workout } from "@/services/workout";

interface SystemContextValue {
  state: SystemState | null;
  workout: Workout | null;
  completedToday: boolean;
  loading: boolean;
  complete: () => Promise<void>;
  updatePlayerName: (name: string) => Promise<void>;
  updateNotificationTime: (hour: number, minute: number) => Promise<void>;
  reset: () => Promise<void>;
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });
  }, []);

  const workout = state ? getWorkout(state.currentDay) : null;
  const completedToday = state ? isCompletedToday(state.lastCompleted) : false;

  const complete = useCallback(async () => {
    if (!state) return;
    const newState = await completeWorkout(state);
    setState(newState);
  }, [state]);

  const updatePlayerName = useCallback(async (name: string) => {
    await savePlayerName(name);
    setState((prev) => (prev ? { ...prev, playerName: name } : prev));
  }, []);

  const updateNotificationTime = useCallback(
    async (hour: number, minute: number) => {
      await saveNotificationTime(hour, minute);
      setState((prev) =>
        prev
          ? { ...prev, notificationHour: hour, notificationMinute: minute }
          : prev
      );
    },
    []
  );

  const reset = useCallback(async () => {
    const newState = await resetProgress();
    setState(newState);
  }, []);

  return (
    <SystemContext.Provider
      value={{
        state,
        workout,
        completedToday,
        loading,
        complete,
        updatePlayerName,
        updateNotificationTime,
        reset,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem(): SystemContextValue {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used within SystemProvider");
  return ctx;
}
