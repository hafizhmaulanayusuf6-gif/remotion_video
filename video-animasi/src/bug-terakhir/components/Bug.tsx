import React from "react";
import { COLORS } from "../config";

export interface BugProps {
  x: number;
  y: number;
  scale?: number;
  legPhase?: number;
}

export const Bug: React.FC<BugProps> = ({
  x,
  y,
  scale = 1,
  legPhase = 0,
}) => {
  if (scale <= 0) {
    return null;
  }

  // Feet positions: spread 8px each side
  // legPhase swaps which leg is shortened by 3px
  const leftLegShortened = legPhase === 0;
  const leftFootY = leftLegShortened ? -3 : 0;
  const rightFootY = leftLegShortened ? 0 : -3;

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
        {/* Legs: stroke 4, round caps, color error */}
        <line
          x1={-8}
          y1={-12}
          x2={-8}
          y2={leftFootY}
          stroke={COLORS.error}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <line
          x1={8}
          y1={-12}
          x2={8}
          y2={rightFootY}
          stroke={COLORS.error}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Body: filled circle radius 16, color error, centered 22px above feet */}
        <circle cx={0} cy={-22} r={16} fill={COLORS.error} />

        {/* Two eyes: circles radius 3.5, color badgeText */}
        <circle cx={-6} cy={-26} r={3.5} fill={COLORS.badgeText} />
        <circle cx={6} cy={-26} r={3.5} fill={COLORS.badgeText} />
      </g>
    </svg>
  );
};
