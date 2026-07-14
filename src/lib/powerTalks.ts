export const POWER_TALKS = [
  { id: "talk_1", label: "Talk 1", speaker: "A" },
  { id: "talk_2", label: "Talk 2", speaker: "B" },
  { id: "talk_3", label: "Talk 3", speaker: "C" },
  { id: "talk_4", label: "Talk 4", speaker: "D" },
] as const;

export const POWER_TALK_LIMIT = 25;

export type PowerTalkId = (typeof POWER_TALKS)[number]["id"];

export const POWER_TALK_LABELS: Record<PowerTalkId, string> = {
  talk_1: "Talk 1 by A",
  talk_2: "Talk 2 by B",
  talk_3: "Talk 3 by C",
  talk_4: "Talk 4 by D",
};

export const isPowerTalkId = (value: string): value is PowerTalkId => {
  return POWER_TALKS.some((talk) => talk.id === value);
};