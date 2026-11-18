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
