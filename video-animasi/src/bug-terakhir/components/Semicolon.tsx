import React from "react";
import { COLORS } from "../config";

export interface SemicolonProps {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  dotsProgress?: number; // 0..1
}

export const Semicolon: React.FC<SemicolonProps> = ({
  x,
  y,
  scale = 1,
  color = COLORS.error,
  dotsProgress = 1,
}) => {
  if (scale <= 0) {
    return null;
  }

  const clampedDots = Math.min(1, Math.max(0, dotsProgress));

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
        {/* Top dot: radius 16 at anchor (0, 0) */}
        <circle cx={0} cy={0} r={16} fill={color} />

        {/* Bottom dot (radius 11 at y=32) + comma tail, scaling from bottom dot center */}
        {clampedDots > 0 && (
          <g transform={`translate(0, 32) scale(${clampedDots})`}>
            <circle cx={0} cy={0} r={11} fill={color} />
            <path
              d="M 4 2 Q 4 14 -10 18"
              fill="none"
              stroke={color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>
    </svg>
  );
};
