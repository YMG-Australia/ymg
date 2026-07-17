export const POWER_TALKS = [
  { id: "talk_1", label: "Talk 1", speaker: "A" },
  { id: "talk_2", label: "Talk 2", speaker: "B" },
  { id: "talk_3", label: "Talk 3", speaker: "C" },
  { id: "talk_4", label: "Talk 4", speaker: "D" },
] as const;

export const POWER_TALK_LIMITS: Record<PowerTalkId, number> = {
  talk_1: 25,
  talk_2: 20,
  talk_3: 20,
  talk_4: 20,
};

export type PowerTalkId = (typeof POWER_TALKS)[number]["id"];

export const getPowerTalkLimit = (talkId: PowerTalkId) => POWER_TALK_LIMITS[talkId];

export const POWER_TALK_LABELS: Record<PowerTalkId, string> = {
  talk_1: "Set Free! by Joshua Angrisano",
  talk_2: "How to discern God’s call on your life by Fr Ken MGL",
  talk_3: "The Blessings and Challenges of Married life by Karen Doyle",
  talk_4: "Courageous forgiveness by Samuel Clear",
};

export const isPowerTalkId = (value: string): value is PowerTalkId => {
  return POWER_TALKS.some((talk) => talk.id === value);
};