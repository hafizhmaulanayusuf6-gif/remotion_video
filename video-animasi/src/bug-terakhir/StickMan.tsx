/**
 * Angle convention (degrees):
 * - 0 = limb pointing straight down (+Y on screen).
 * - Positive = rotation toward the right side of the SCREEN (+X).
 * - Children are relative to their parent:
 *   forearm = upper arm + elbow, shin = thigh + knee.
 * - torsoLean: positive tilts the top of the torso toward screen right.
 *   The upper body (head, shoulder point, arms) turns rigidly with it, so
 *   shoulder angles are RELATIVE to the torso. Hip angles are absolute
 *   (legs ignore torsoLean).
 * - x / y props place the PELVIS point. facing = -1 mirrors around it.
 */

import React from "react";
import { COLORS, FIGURE_PROPORTIONS, STICK_MAN_STROKE } from "./config";

export interface StickManPose {
  /** Upper body lean around the pelvis (0 = upright, positive = top toward screen right) */
  torsoLean: number;
  /** Head tilt relative to the torso, same sign as torsoLean */
  headAngle?: number;
  leftArm: { shoulder: number; elbow: number };
  rightArm: { shoulder: number; elbow: number };
  leftLeg: { hip: number; knee: number };
  rightLeg: { hip: number; knee: number };
}

export interface StickManProps {
  pose: StickManPose;
  x?: number;
  y?: number;
  scale?: number;
  /** 1 = as authored, -1 = mirrored horizontally around the pelvis */
  facing?: 1 | -1;
}

type Point = { x: number; y: number };

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Point at `length` from `from`, in direction `angle` (0 = down, positive = screen right). */
const offset = (from: Point, angle: number, length: number): Point => ({
  x: from.x + length * Math.sin(toRad(angle)),
  y: from.y + length * Math.cos(toRad(angle)),
});

/** Two-segment chain: root -> middle joint -> end. Child angle is relative to parent. */
const limb = (
  root: Point,
  parentAngle: number,
  jointAngle: number,
  upperLength: number,
  lowerLength: number,
): string => {
  const mid = offset(root, parentAngle, upperLength);
  const end = offset(mid, parentAngle + jointAngle, lowerLength);
  return `M ${root.x} ${root.y} L ${mid.x} ${mid.y} L ${end.x} ${end.y}`;
};

export const StickMan: React.FC<StickManProps> = ({
  pose,
  x = 0,
  y = 0,
  scale = 1,
  facing = 1,
}) => {
  const {
    headRadius,
    torsoLength,
    shoulderDrop,
    upperArmLength,
    forearmLength,
    thighLength,
    shinLength,
  } = FIGURE_PROPORTIONS;

  const pelvis: Point = { x: 0, y: 0 };

  // "Up" is 180. Tilting the top toward screen right means turning the
  // upper body by -torsoLean in limb-angle units, so every upper-body angle
  // below subtracts the lean.
  const upperBodyTurn = -pose.torsoLean;
  const torsoUp = 180 + upperBodyTurn;
  const torsoTop = offset(pelvis, torsoUp, torsoLength);
  const shoulder = offset(pelvis, torsoUp, torsoLength - shoulderDrop);
  const headCenter = offset(
    torsoTop,
    torsoUp - (pose.headAngle ?? 0),
    headRadius,
  );

  const leftArm = limb(
    shoulder,
    upperBodyTurn + pose.leftArm.shoulder,
    pose.leftArm.elbow,
    upperArmLength,
    forearmLength,
  );
  const rightArm = limb(
    shoulder,
    upperBodyTurn + pose.rightArm.shoulder,
    pose.rightArm.elbow,
    upperArmLength,
    forearmLength,
  );
  const leftLeg = limb(
    pelvis,
    pose.leftLeg.hip,
    pose.leftLeg.knee,
    thighLength,
    shinLength,
  );
  const rightLeg = limb(
    pelvis,
    pose.rightLeg.hip,
    pose.rightLeg.knee,
    thighLength,
    shinLength,
  );

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <g
        transform={`translate(${x}, ${y}) scale(${scale * facing}, ${scale})`}
        fill="none"
        stroke={COLORS.figure}
        strokeWidth={STICK_MAN_STROKE.width}
        strokeLinecap={STICK_MAN_STROKE.strokeLinecap}
        strokeLinejoin={STICK_MAN_STROKE.strokeLinejoin}
      >
        <path d={leftLeg} />
        <path d={rightLeg} />
        <line x1={pelvis.x} y1={pelvis.y} x2={torsoTop.x} y2={torsoTop.y} />
        <path d={leftArm} />
        <path d={rightArm} />
        <circle
          cx={headCenter.x}
          cy={headCenter.y}
          r={headRadius}
          fill={COLORS.figure}
          stroke="none"
        />
      </g>
    </svg>
  );
};
