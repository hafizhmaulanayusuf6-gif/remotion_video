import React from "react";
import { COLORS, STICK_MAN_STROKE } from "./config";

export interface StickManPose {
  /** Neck / torso lean in degrees (0 = vertical upright, positive = forward/right) */
  torsoLean: number;
  /** Head tilt angle in degrees relative to torso (0 = aligned with torso) */
  headAngle?: number;
  /** Left arm angles in degrees (shoulder angle relative to downward, elbow relative to upper arm) */
  leftArm: {
    shoulder: number;
    elbow: number;
  };
  /** Right arm angles in degrees (shoulder angle relative to downward, elbow relative to upper arm) */
  rightArm: {
    shoulder: number;
    elbow: number;
  };
  /** Left leg angles in degrees (hip angle relative to downward, knee relative to thigh) */
  leftLeg: {
    hip: number;
    knee: number;
  };
  /** Right leg angles in degrees (hip angle relative to downward, knee relative to thigh) */
  rightLeg: {
    hip: number;
    knee: number;
  };
}

export interface StickManProps {
  pose: StickManPose;
  x?: number;
  y?: number;
  scale?: number;
  color?: string;
  strokeWidth?: number;
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export const StickMan: React.FC<StickManProps> = ({
  pose,
  x = 0,
  y = 0,
  scale = 1,
  color = COLORS.line,
  strokeWidth = STICK_MAN_STROKE.width,
}) => {
  // Proportions
  const torsoLength = 90;
  const headRadius = 24;
  const neckToHeadCenter = 34;
  const upperArmLength = 50;
  const forearmLength = 46;
  const thighLength = 60;
  const shinLength = 60;

  // Pelvis / Root is at (0, 0)
  const pelvisX = 0;
  const pelvisY = 0;

  // Torso calculation: leans by pose.torsoLean (0° = straight up, along negative Y)
  const torsoRad = toRad(pose.torsoLean);
  const neckX = pelvisX + torsoLength * Math.sin(torsoRad);
  const neckY = pelvisY - torsoLength * Math.cos(torsoRad);

  // Head calculation: along neck vector plus optional head tilt
  const headRad = toRad(pose.torsoLean + (pose.headAngle ?? 0));
  const headCenterX = neckX + neckToHeadCenter * Math.sin(headRad);
  const headCenterY = neckY - neckToHeadCenter * Math.cos(headRad);

  // Left arm (shoulder and elbow)
  const leftShoulderRad = toRad(pose.leftArm.shoulder);
  const leftElbowX = neckX + upperArmLength * Math.sin(leftShoulderRad);
  const leftElbowY = neckY + upperArmLength * Math.cos(leftShoulderRad);

  const leftElbowRad = toRad(pose.leftArm.shoulder + pose.leftArm.elbow);
  const leftHandX = leftElbowX + forearmLength * Math.sin(leftElbowRad);
  const leftHandY = leftElbowY + forearmLength * Math.cos(leftElbowRad);

  // Right arm (shoulder and elbow)
  const rightShoulderRad = toRad(pose.rightArm.shoulder);
  const rightElbowX = neckX + upperArmLength * Math.sin(rightShoulderRad);
  const rightElbowY = neckY + upperArmLength * Math.cos(rightShoulderRad);

  const rightElbowRad = toRad(pose.rightArm.shoulder + pose.rightArm.elbow);
  const rightHandX = rightElbowX + forearmLength * Math.sin(rightElbowRad);
  const rightHandY = rightElbowY + forearmLength * Math.cos(rightElbowRad);

  // Left leg (hip and knee)
  const leftHipRad = toRad(pose.leftLeg.hip);
  const leftKneeX = pelvisX + thighLength * Math.sin(leftHipRad);
  const leftKneeY = pelvisY + thighLength * Math.cos(leftHipRad);

  const leftKneeRad = toRad(pose.leftLeg.hip + pose.leftLeg.knee);
  const leftFootX = leftKneeX + shinLength * Math.sin(leftKneeRad);
  const leftFootY = leftKneeY + shinLength * Math.cos(leftKneeRad);

  // Right leg (hip and knee)
  const rightHipRad = toRad(pose.rightLeg.hip);
  const rightKneeX = pelvisX + thighLength * Math.sin(rightHipRad);
  const rightKneeY = pelvisY + thighLength * Math.cos(rightHipRad);

  const rightKneeRad = toRad(pose.rightLeg.hip + pose.rightLeg.knee);
  const rightFootX = rightKneeX + shinLength * Math.sin(rightKneeRad);
  const rightFootY = rightKneeY + shinLength * Math.cos(rightKneeRad);

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
        transform={`translate(${x}, ${y}) scale(${scale})`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={STICK_MAN_STROKE.strokeLinecap}
        strokeLinejoin={STICK_MAN_STROKE.strokeLinejoin}
      >
        {/* Left Arm (back layer) */}
        <line x1={neckX} y1={neckY} x2={leftElbowX} y2={leftElbowY} />
        <line x1={leftElbowX} y1={leftElbowY} x2={leftHandX} y2={leftHandY} />

        {/* Left Leg (back layer) */}
        <line x1={pelvisX} y1={pelvisY} x2={leftKneeX} y2={leftKneeY} />
        <line x1={leftKneeX} y1={leftKneeY} x2={leftFootX} y2={leftFootY} />

        {/* Torso */}
        <line x1={pelvisX} y1={pelvisY} x2={neckX} y2={neckY} />

        {/* Head */}
        <circle cx={headCenterX} cy={headCenterY} r={headRadius} fill="none" />

        {/* Right Leg (front layer) */}
        <line x1={pelvisX} y1={pelvisY} x2={rightKneeX} y2={rightKneeY} />
        <line x1={rightKneeX} y1={rightKneeY} x2={rightFootX} y2={rightFootY} />

        {/* Right Arm (front layer) */}
        <line x1={neckX} y1={neckY} x2={rightElbowX} y2={rightElbowY} />
        <line x1={rightElbowX} y1={rightElbowY} x2={rightHandX} y2={rightHandY} />
      </g>
    </svg>
  );
};
