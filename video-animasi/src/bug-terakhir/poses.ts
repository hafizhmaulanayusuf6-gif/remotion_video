/**
 * Angle convention (degrees):
 * - 0 = limb pointing straight down (+Y on screen).
 * - Positive = rotation toward the right side of the SCREEN (+X).
 * - Children are relative to their parent:
 *   forearm = upper arm + elbow, shin = thigh + knee.
 * - torsoLean: positive tilts the top of the torso toward screen right.
 *   Shoulder angles are relative to the torso; hip angles are absolute.
 * - Joint values stay within -180..180.
 * - Profile poses are authored facing right; use facing = -1 to flip.
 */

import { StickManPose } from "./StickMan";

export const poses = {
  standing: {
    torsoLean: 0,
    headAngle: 0,
    leftArm: { shoulder: -22, elbow: 8 },
    rightArm: { shoulder: 22, elbow: -8 },
    leftLeg: { hip: -5, knee: 0 },
    rightLeg: { hip: 5, knee: 0 },
  },
  // Profile, facing right. Thighs horizontal, shins down, forearms on a keyboard.
  sitTyping: {
    torsoLean: 4,
    headAngle: 0,
    leftArm: { shoulder: 25, elbow: 55 },
    rightArm: { shoulder: 30, elbow: 50 },
    leftLeg: { hip: 90, knee: -90 },
    rightLeg: { hip: 90, knee: -90 },
  },
  // Profile, facing right. Left arm typing, right arm pointing straight toward laptop screen.
  sitPoint: {
    torsoLean: 4,
    headAngle: 0,
    leftArm: { shoulder: 25, elbow: 55 },
    rightArm: { shoulder: 100, elbow: 0 },
    leftLeg: { hip: 90, knee: -90 },
    rightLeg: { hip: 90, knee: -90 },
  },
  // Front view. Elbows out, hands on the sides of the head.
  handsOnHead: {
    torsoLean: 0,
    headAngle: 0,
    leftArm: { shoulder: -100, elbow: -120 },
    rightArm: { shoulder: 100, elbow: 120 },
    leftLeg: { hip: -6, knee: 0 },
    rightLeg: { hip: 6, knee: 0 },
  },
  // Front view. Right hand under the chin, left arm relaxed.
  thinking: {
    torsoLean: 0,
    headAngle: 0,
    leftArm: { shoulder: -14, elbow: 8 },
    rightArm: { shoulder: 45, elbow: 164 },
    leftLeg: { hip: -4, knee: 0 },
    rightLeg: { hip: 4, knee: 0 },
  },
  // Profile, facing right, running stride. Arms opposite to legs.
  chase: {
    torsoLean: 15,
    headAngle: 0,
    leftArm: { shoulder: 60, elbow: 45 },
    rightArm: { shoulder: -65, elbow: 70 },
    leftLeg: { hip: -35, knee: -55 },
    rightLeg: { hip: 50, knee: -40 },
  },
  // Profile, facing right. Left/right swap of chase for run cycle.
  runB: {
    torsoLean: 15,
    headAngle: 0,
    leftArm: { shoulder: -65, elbow: 70 },
    rightArm: { shoulder: 60, elbow: 45 },
    leftLeg: { hip: 50, knee: -40 },
    rightLeg: { hip: -35, knee: -55 },
  },
  // Profile, facing right, relaxed standing, slightly leaning.
  standSide: {
    torsoLean: 6,
    headAngle: 0,
    leftArm: { shoulder: 8, elbow: 10 },
    rightArm: { shoulder: 14, elbow: 12 },
    leftLeg: { hip: -4, knee: 0 },
    rightLeg: { hip: 4, knee: 0 },
  },
  // Profile, facing right, rising from the chair (anticipation).
  standUpMid: {
    torsoLean: 28,
    headAngle: 0,
    leftArm: { shoulder: 40, elbow: 20 },
    rightArm: { shoulder: 45, elbow: 20 },
    leftLeg: { hip: 55, knee: -60 },
    rightLeg: { hip: 60, knee: -65 },
  },
  // Mirror-symmetric wide braking stance (torsoLean driven by override during skid).
  skid: {
    torsoLean: -10,
    headAngle: 0,
    leftArm: { shoulder: -70, elbow: 25 },
    rightArm: { shoulder: 70, elbow: -25 },
    leftLeg: { hip: -35, knee: 0 },
    rightLeg: { hip: 35, knee: 0 },
  },
  // Profile, facing right, leaning in to look at something below.
  peer: {
    torsoLean: 16,
    headAngle: 0,
    leftArm: { shoulder: 18, elbow: 15 },
    rightArm: { shoulder: 22, elbow: 15 },
    leftLeg: { hip: -4, knee: 0 },
    rightLeg: { hip: 4, knee: 0 },
  },
  // Front view. Rigid, slightly leaning back.
  frozen: {
    torsoLean: -3,
    headAngle: 0,
    leftArm: { shoulder: -22, elbow: 0 },
    rightArm: { shoulder: 22, elbow: 0 },
    leftLeg: { hip: -3, knee: 0 },
    rightLeg: { hip: 3, knee: 0 },
  },
  // Front view. Arms straight up in a V, kept clear of the head.
  victory: {
    torsoLean: 0,
    headAngle: 0,
    leftArm: { shoulder: -125, elbow: 0 },
    rightArm: { shoulder: 125, elbow: 0 },
    leftLeg: { hip: -8, knee: 0 },
    rightLeg: { hip: 8, knee: 0 },
  },
} satisfies Record<string, StickManPose>;

export type PoseName = keyof typeof poses;

/** @deprecated use `poses` */
export const POSES = poses;
export const standingPose = poses.standing;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Linear blend of every joint from pose a (t = 0) to pose b (t = 1).
 * t is clamped to 0..1.
 *
 * No shortest-path angle wrapping on purpose: the direction an elbow or knee
 * travels matters, and poses are authored so that plain linear interpolation
 * of the stored numbers gives the intended motion.
 */
export const blendPose = (
  a: StickManPose,
  b: StickManPose,
  t: number,
): StickManPose => {
  const k = Math.min(1, Math.max(0, t));
  return {
    torsoLean: lerp(a.torsoLean, b.torsoLean, k),
    headAngle: lerp(a.headAngle ?? 0, b.headAngle ?? 0, k),
    leftArm: {
      shoulder: lerp(a.leftArm.shoulder, b.leftArm.shoulder, k),
      elbow: lerp(a.leftArm.elbow, b.leftArm.elbow, k),
    },
    rightArm: {
      shoulder: lerp(a.rightArm.shoulder, b.rightArm.shoulder, k),
      elbow: lerp(a.rightArm.elbow, b.rightArm.elbow, k),
    },
    leftLeg: {
      hip: lerp(a.leftLeg.hip, b.leftLeg.hip, k),
      knee: lerp(a.leftLeg.knee, b.leftLeg.knee, k),
    },
    rightLeg: {
      hip: lerp(a.rightLeg.hip, b.rightLeg.hip, k),
      knee: lerp(a.rightLeg.knee, b.rightLeg.knee, k),
    },
  };
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Returns the relative vertical offset (px, unscaled) from pelvis to a foot.
 * Based on FIGURE_PROPORTIONS: thighLength = 75, shinLength = 75.
 */
export const getFootRelY = (hip: number, knee: number): number => {
  const thighLen = 75;
  const shinLen = 75;
  const kneeY = thighLen * Math.cos(toRad(hip));
  const footY = kneeY + shinLen * Math.cos(toRad(hip + knee));
  return footY;
};

/**
 * Returns the pelvis Y so that the lowest foot point touches groundY
 * (accounting for the limb stroke half-width = 5 * scale).
 * For sitTyping at scale 1.6 and groundY 900, reproduces 772 exactly.
 */
export const groundedPelvisY = (
  pose: StickManPose,
  scale: number,
  groundY: number
): number => {
  const strokeHalfWidth = 5; // STICK_MAN_STROKE width 10 / 2
  const leftFootY = getFootRelY(pose.leftLeg.hip, pose.leftLeg.knee);
  const rightFootY = getFootRelY(pose.rightLeg.hip, pose.rightLeg.knee);
  const maxFootY = Math.max(leftFootY, rightFootY);
  return groundY - (maxFootY + strokeHalfWidth) * scale;
};
