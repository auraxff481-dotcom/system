import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  CURRENT_DAY: "system_current_day",
  STREAK: "system_streak",
  LAST_COMPLETED: "system_last_completed",
  PLAYER_NAME: "system_player_name",
  NOTIFICATION_HOUR: "system_notification_hour",
  NOTIFICATION_MINUTE: "system_notification_minute",
};

export interface SystemState {
  currentDay: number;
  streak: number;
  lastCompleted: string | null;
  playerName: string;
  notificationHour: number;
  notificationMinute: number;
}

const DEFAULT_STATE: SystemState = {
  currentDay: 1,
  streak: 0,
  lastCompleted: null,
  playerName: "INFINITE",
  notificationHour: 19,
  notificationMinute: 0,
};

export async function loadState(): Promise<SystemState> {
  try {
    const [day, streak, lastCompleted, playerName, notifHour, notifMinute] =
      await AsyncStorage.multiGet([
        KEYS.CURRENT_DAY,
        KEYS.STREAK,
        KEYS.LAST_COMPLETED,
        KEYS.PLAYER_NAME,
        KEYS.NOTIFICATION_HOUR,
        KEYS.NOTIFICATION_MINUTE,
      ]);

    return {
      currentDay: day[1] ? parseInt(day[1]) : DEFAULT_STATE.currentDay,
      streak: streak[1] ? parseInt(streak[1]) : DEFAULT_STATE.streak,
      lastCompleted: lastCompleted[1] ?? DEFAULT_STATE.lastCompleted,
      playerName: playerName[1] ?? DEFAULT_STATE.playerName,
      notificationHour: notifHour[1]
        ? parseInt(notifHour[1])
        : DEFAULT_STATE.notificationHour,
      notificationMinute: notifMinute[1]
        ? parseInt(notifMinute[1])
        : DEFAULT_STATE.notificationMinute,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export async function completeWorkout(state: SystemState): Promise<SystemState> {
  const today = getTodayString();
  const nextDay = state.currentDay >= 4 ? 1 : state.currentDay + 1;
  const newStreak = state.streak + 1;

  const newState: SystemState = {
    ...state,
    currentDay: nextDay,
    streak: newStreak,
    lastCompleted: today,
  };

  await AsyncStorage.multiSet([
    [KEYS.CURRENT_DAY, nextDay.toString()],
    [KEYS.STREAK, newStreak.toString()],
    [KEYS.LAST_COMPLETED, today],
  ]);

  return newState;
}

export async function savePlayerName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.PLAYER_NAME, name);
}

export async function saveNotificationTime(
  hour: number,
  minute: number
): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.NOTIFICATION_HOUR, hour.toString()],
    [KEYS.NOTIFICATION_MINUTE, minute.toString()],
  ]);
}

export async function resetProgress(): Promise<SystemState> {
  await AsyncStorage.multiRemove([
    KEYS.CURRENT_DAY,
    KEYS.STREAK,
    KEYS.LAST_COMPLETED,
  ]);
  return {
    ...DEFAULT_STATE,
    playerName:
      (await AsyncStorage.getItem(KEYS.PLAYER_NAME)) ??
      DEFAULT_STATE.playerName,
    notificationHour:
      parseInt(
        (await AsyncStorage.getItem(KEYS.NOTIFICATION_HOUR)) ?? "19"
      ) ?? 19,
    notificationMinute:
      parseInt(
        (await AsyncStorage.getItem(KEYS.NOTIFICATION_MINUTE)) ?? "0"
      ) ?? 0,
  };
}

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export function isCompletedToday(lastCompleted: string | null): boolean {
  if (!lastCompleted) return false;
  return lastCompleted === getTodayString();
}
