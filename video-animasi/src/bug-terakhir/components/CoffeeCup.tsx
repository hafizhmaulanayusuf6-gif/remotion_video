import React from "react";
import { COLORS, SCENE1_LAYOUT } from "../config";

interface CoffeeCupProps {
  x?: number;
  y?: number;
}

export const CoffeeCup: React.FC<CoffeeCupProps> = ({
  x = SCENE1_LAYOUT.coffeeCup.x,
  y = SCENE1_LAYOUT.coffeeCup.bottomY,
}) => {
  const topY = y - 80;
  const topHalfW = 35; // 70px wide at top
  const bottomHalfW = 27; // tapered to 54px wide at bottom

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
      {/* Cup Body (slightly tapered, solid figure color) */}
      <polygon
        points={`
          ${x - topHalfW},${topY}
          ${x + topHalfW},${topY}
          ${x + bottomHalfW},${y}
          ${x - bottomHalfW},${y}
        `}
        fill={COLORS.figure}
      />

      {/* Ring Handle on the right (same stroke 10 as stick man) */}
      <path
        d={`M ${x + 33} ${topY + 18} C ${x + 64} ${topY + 18}, ${x + 64} ${topY + 62}, ${x + 29} ${topY + 62}`}
        fill="none"
        stroke={COLORS.figure}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
