import React from "react";
import { COLORS, SCENE1_LAYOUT } from "../config";

export interface CoffeeCupProps {
  x?: number;
  y?: number;
  opacity?: number;
}

export const CoffeeCup: React.FC<CoffeeCupProps> = ({
  x = SCENE1_LAYOUT.coffeeCup.x,
  y = SCENE1_LAYOUT.coffeeCup.bottomY,
  opacity = 1,
}) => {
  // Body dimensions: top width 46, bottom width 38, height 44, flat top, rounded bottom corners (radius 10)
  // Saucer dimensions: stroke 6, width 66 (from x - 30 to x + 30), resting on desk top surface y
  // Total height: 50px (y - 50 to y)
  const bodyTop = y - 50;
  const bodyBottom = y - 6;
  const saucerY = y - 3;

  // Handle: outer size about 18 wide x 28 tall, stroke 6, vertically centered at ~55% of body height (~y - 25.8)
  const handleTopY = y - 36.8;
  const handleBottomY = y - 14.8;
  const bodyRightAtHandleTop = x + 21.8;
  const bodyRightAtHandleBottom = x + 19.8;
  const handleOuterControlX = x + 38;

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
        opacity,
      }}
    >
      {/* Saucer: 66px wide horizontal line with rounded caps, resting on desk surface */}
      <line
        x1={x - 30}
        y1={saucerY}
        x2={x + 30}
        y2={saucerY}
        stroke={COLORS.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* Cup Body: straight-sided, flat top (w=46), rounded bottom corners (r=10, w=38) */}
      <path
        d={`
          M ${x - 23} ${bodyTop}
          L ${x + 23} ${bodyTop}
          L ${x + 20} ${bodyBottom - 10}
          Q ${x + 19} ${bodyBottom} ${x + 9} ${bodyBottom}
          L ${x - 9} ${bodyBottom}
          Q ${x - 19} ${bodyBottom} ${x - 20} ${bodyBottom - 10}
          Z
        `}
        fill={COLORS.figure}
      />

      {/* Handle: right-side ring attached to body */}
      <path
        d={`
          M ${bodyRightAtHandleTop} ${handleTopY}
          C ${handleOuterControlX} ${handleTopY},
            ${handleOuterControlX} ${handleBottomY},
            ${bodyRightAtHandleBottom} ${handleBottomY}
        `}
        fill="none"
        stroke={COLORS.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
};
