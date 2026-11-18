export const COLORS = {
  background: "#ECE9E1",
  figure: "#111111",
  screen: "#14161A",
  furniture: "#B8B3A7",
  codeLine: "#4A4F58",
  badgeText: "#F7F4EC",
  error: "#FF4D4F",
  success: "#3DDC84",
  /** Backwards compatibility alias for figure */
  line: "#111111",
} as const;

export const FONTS = {
  monospace: "'JetBrains Mono', ui-monospace, Consolas, monospace",
  sans: "'Inter', sans-serif",
} as const;

/** Debug overlay visibility flag for scenes */
export const SHOW_DEBUG_LABELS = true;

/** Stick man proportions in px at scale = 1 (total height about 320). */
export const FIGURE_PROPORTIONS = {
  headRadius: 30,
  /** Pelvis to torso top end. The torso top touches the bottom of the head. */
  torsoLength: 110,
  /** Single shoulder point, measured down the torso from its top end. */
  shoulderDrop: 12,
  upperArmLength: 60,
  forearmLength: 60,
  thighLength: 75,
  shinLength: 75,
} as const;

/** One uniform stroke for torso, arms and legs. */
export const STICK_MAN_STROKE = {
  width: 10,
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

/**
 * Scene 1 "Hook" layout constants (all dimensions in px on 1920x1080 canvas).
 */
export const SCENE1_LAYOUT = {
  floor: {
    y: 900,
    thickness: 6,
  },
  stickMan: {
    scale: 1.6,
    pelvisX: 620,
    // pelvisY = floorY - (shinLength * scale) - (strokeWidth * scale / 2)
    // 900 - (75 * 1.6) - (10 * 1.6 / 2) = 900 - 120 - 8 = 772
    pelvisY: 772,
    facing: 1 as const,
  },
  chair: {
    strokeWidth: 14,
    seatY: 786,
    seatX1: 540,
    seatX2: 710,
    backrestX: 560,
    backrestYTop: 636,
    legX: 590,
  },
  desk: {
    topY: 738,
    startX: 700,
    endX: 1800,
    thickness: 16,
    legStartX: 1740,
    legEndX: 1764,
  },
  laptopBase: {
    x: 750,
    width: 640,
    height: 12,
    topY: 726,
  },
  laptopScreen: {
    width: 560,
    height: 340,
    cornerRadius: 12,
    x: 790,
    y: 386,
    centerX: 1070,
    centerY: 556,
  },
  clock: {
    width: 300,
    height: 130,
    cornerRadius: 14,
    centerX: 1580,
    centerY: 215,
    x: 1430,
    y: 150,
    fontSize: 96,
  },
  coffeeCup: {
    x: 1560,
    bottomY: 738,
    width: 70,
    height: 80,
    strokeWidth: 10,
  },
} as const;
