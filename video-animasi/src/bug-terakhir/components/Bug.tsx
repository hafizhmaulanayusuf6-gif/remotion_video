import React from "react";
import { COLORS } from "../config";

export interface BugProps {
  x: number;
  y: number;
  scale?: number;
  legPhase?: number;
  legsProgress?: number;
  eyesOpacity?: number;
}

export const Bug: React.FC<BugProps> = ({
  x,
  y,
  scale = 1,
  legPhase = 0,
  legsProgress = 1,
  eyesOpacity = 1,
}) => {
  if (scale <= 0) {
    return null;
  }

  const clampedLegs = Math.min(1, Math.max(0, legsProgress));
  const clampedEyes = Math.min(1, Math.max(0, eyesOpacity));

  // Feet positions: spread 8px each side
  // legPhase swaps which leg is shortened by 3px
  const leftLegShortened = legPhase === 0;
  const leftFootY = leftLegShortened ? -3 : 0;
  const rightFootY = leftLegShortened ? 0 : -3;

  const legOriginY = -12;
  const curLeftFootY = legOriginY + (leftFootY - legOriginY) * clampedLegs;
  const curRightFootY = legOriginY + (rightFootY - legOriginY) * clampedLegs;

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
        zIndex: 1,
      }}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* Legs: stroke 4, round caps, color error; shrink toward body */}
        {clampedLegs > 0 && (
          <>
            <line
              x1={-8}
              y1={legOriginY}
              x2={-8}
              y2={curLeftFootY}
              stroke={COLORS.error}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <line
              x1={8}
              y1={legOriginY}
              x2={8}
              y2={curRightFootY}
              stroke={COLORS.error}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Body: filled circle radius 16, color error, centered 22px above feet */}
        <circle cx={0} cy={-22} r={16} fill={COLORS.error} />

        {/* Two eyes: circles radius 3.5, color badgeText */}
        {clampedEyes > 0 && (
          <g opacity={clampedEyes}>
            <circle cx={-6} cy={-26} r={3.5} fill={COLORS.badgeText} />
            <circle cx={6} cy={-26} r={3.5} fill={COLORS.badgeText} />
          </g>
        )}
      </g>
    </svg>
  );
};
