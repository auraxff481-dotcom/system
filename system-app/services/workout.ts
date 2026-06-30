export interface Exercise {
  name: string;
}

export interface Workout {
  day: number;
  type: string;
  label: string;
  exercises: Exercise[];
  isRest: boolean;
  restMessage?: string;
}

export const WORKOUTS: Workout[] = [
  {
    day: 1,
    type: "PUSH",
    label: "DAY 01",
    exercises: [
      { name: "Push-ups" },
      { name: "Incline Push-ups" },
      { name: "Pike Hold" },
    ],
    isRest: false,
  },
  {
    day: 2,
    type: "PULL",
    label: "DAY 02",
    exercises: [
      { name: "Pull-ups" },
      { name: "Chin-ups" },
      { name: "Dead Hang" },
    ],
    isRest: false,
  },
  {
    day: 3,
    type: "LEGS",
    label: "DAY 03",
    exercises: [
      { name: "Squats" },
      { name: "Lunges" },
      { name: "Plank" },
    ],
    isRest: false,
  },
  {
    day: 4,
    type: "REST",
    label: "DAY 04",
    exercises: [],
    isRest: true,
    restMessage: "Recovery is part of progress.",
  },
];

export function getWorkout(day: number): Workout {
  const index = ((day - 1) % 4);
  return WORKOUTS[index];
}
