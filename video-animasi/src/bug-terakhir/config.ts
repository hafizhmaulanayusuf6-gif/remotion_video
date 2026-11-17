export const COLORS = {
  background: "#14161A",
  line: "#F2EFE8",
  error: "#FF4D4F",
  success: "#3DDC84",
} as const;

export const FONTS = {
  monospace: "'JetBrains Mono', monospace",
  sans: "'Inter', sans-serif",
} as const;

export const STICK_MAN_STROKE = {
  width: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
} as const;

export const SCENES = {
  S1_HOOK: {
    name: "S1 Hook",
    start: 0,
    duration: 120,
  },
  S2_SEARCH: {
    name: "S2 Search",
    start: 120,
    duration: 240,
  },
  S3_CHASE: {
    name: "S3 Chase",
    start: 360,
    duration: 210,
  },
  S4_TWIST: {
    name: "S4 Twist",
    start: 570,
    duration: 180,
  },
  S5_VICTORY: {
    name: "S5 Victory",
    start: 750,
    duration: 90,
  },
  S6_PUNCHLINE: {
    name: "S6 Punchline",
    start: 840,
    duration: 60,
  },
} as const;

export const COMPOSITION_CONFIG = {
  id: "BugTerakhir",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 900,
} as const;
