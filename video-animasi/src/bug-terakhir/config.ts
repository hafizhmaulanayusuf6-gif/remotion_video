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
  camera: {
    originX: 960,
    originY: 540,
    scaleStart: 1.0,
    scaleEnd: 1.05,
  },
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
  laptop: {
    baseX: 710,
    baseWidth: 200,
    baseHeight: 14,
    baseCornerRadius: 4,
    baseTopY: 724, // desk.topY (738) - baseHeight (14)
    hingeX: 910, // baseX + baseWidth
    hingeY: 724, // baseTopY
    screenLength: 150,
    screenAngleDeg: 18,
    screenWidth: 12,
    screenTopX: 956.35, // hingeX + 150 * sin(18°)
    screenTopY: 581.34, // hingeY - 150 * cos(18°)
  },
  screenInset: {
    x: 1200,
    y: 235,
    width: 560,
    height: 340,
    cornerRadius: 12,
  },
  connectorLines: {
    strokeWidth: 3,
  },
  /** Backwards compatibility alias for laptopBase */
  laptopBase: {
    x: 710,
    width: 200,
    height: 14,
    topY: 724,
  },
  /** Backwards compatibility alias for screenInset */
  laptopScreen: {
    width: 560,
    height: 340,
    cornerRadius: 12,
    x: 1200,
    y: 235,
    centerX: 1480,
    centerY: 405,
  },
  clock: {
    width: 300,
    height: 130,
    cornerRadius: 14,
    centerX: 380,
    centerY: 215,
    x: 230,
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

/**
 * Scene 2 "Pencarian" layout and event constants.
 */
export const SCENE2_LAYOUT = {
  coffeeCups: [
    { id: "cup1", x: 1560, frame: 0 },
    { id: "cup2", x: 1470, frame: 78 },
    { id: "cup3", x: 1380, frame: 150 },
  ],
  cupAnimation: {
    dropDistance: 40,
    dropDuration: 6,
    opacityDuration: 4,
  },
  clockEvents: [
    { text: "02:00", untilFrame: 78 },
    { text: "03:00", untilFrame: 150 },
    { text: "04:00", untilFrame: 240 },
  ],
  scroll: {
    speed: 6, // px per frame at full speed
    lineSpacing: 30, // px per line
    rampFrames: 12,
  },
  bugEvents: [
    { id: "A", startFrame: 36, x: 450, y: 140 },
    { id: "B", startFrame: 108, x: 180, y: 230 },
    { id: "C", startFrame: 180, x: 360, y: 300 },
  ],
  bugAnimation: {
    popInDuration: 8,
    duckOutStart: 22,
    duckOutEnd: 28,
  },
  pointAnimation: {
    blendInStart: 14,
    blendInEnd: 19,
    blendOutStart: 27,
    blendOutEnd: 33,
  },
  camera: {
    holdEndFrame: 150,
    easeEndFrame: 239,
    startScale: 1.05,
    endScale: 1.0,
  },
} as const;

/**
 * Scene 3 "Pengejaran" layout and event constants.
 */
export const SCENE3_LAYOUT = {
  camera: {
    originX: 960,
    originY: 540,
    scale: 1.0,
  },
  clockEvents: [
    { text: "04:00", untilFrame: 150 },
    { text: "05:00", untilFrame: 210 },
  ],
  coffeeCups: [
    { x: 1560 },
    { x: 1470 },
    { x: 1380 },
  ],
  scroll: {
    initialOffset: 1398,
    speed: 6,
    stopOffset: 2034,
  },
  bug: {
    startCanvasX: 1380,
    startCanvasY: 535,
    floorY: 900,
    fallFloorX: 1330,
    runRightEndX: 1618,
    runLeft1EndX: 1042,
    runLeft2EndX: 826,
    speed: 12, // px per frame
  },
  stickMan: {
    scale: 1.6,
    groundY: 900,
    seatedPelvisX: 620,
    standingPelvisX: 660,
    runRightEndPelvisX: 1068,
    skidEndPelvisX: 1130,
    runLeftEndPelvisX: 932,
    skidFlipFrame: 110,
  },
} as const;

/**
 * Scene 4 "Twist" layout and event constants.
 */
export const SCENE4_LAYOUT = {
  camera: {
    originX: 960,
    originY: 540,
    scale: 1.0,
  },
  clockText: "05:00",
  coffeeCups: [
    { x: 1560 },
    { x: 1470 },
    { x: 1380 },
  ],
  panel: {
    scrollOffset: 2034,
    targetLineIndex: 72,
    errorStartFrame: 60,
    errorEndFrame: 131,
    badgeSuccessFrame: 134,
    targetLocalX: 314,
    targetLocalY: 171,
    targetCanvasX: 1514, // 1200 + 314
    targetCanvasY: 406,  // 235 + 171
  },
  bugToSemicolon: {
    startX: 826,
    floorY: 900,
    bugBodyOffsetY: 22,
    hoverStartFrame: 24,
    hoverEndFrame: 40,
    hoverDistance: 40,
    legsShrinkStartFrame: 24,
    legsShrinkEndFrame: 36,
    eyesFadeStartFrame: 28,
    eyesFadeEndFrame: 36,
    swapFrame: 36,
    dotsGrowStartFrame: 36,
    dotsGrowEndFrame: 46,
    flightStartFrame: 54,
    flightEndFrame: 90,
    controlPointX: 1100,
    controlPointY: 330,
    endScale: 0.32,
    bobAmplitude: 5,
    bobPeriod: 24,
    colorSuccessFrame: 132,
    bobSettleEndFrame: 138,
  },
  stickMan: {
    scale: 1.6,
    groundY: 900,
    startPelvisX: 932,
    seatedPelvisX: 620,
    flipFrame: 110,
  },
} as const;
