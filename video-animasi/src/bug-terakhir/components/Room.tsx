import React from "react";
import { COLORS, SCENE1_LAYOUT } from "../config";

export const Room: React.FC = () => {
  const { floor, chair, desk } = SCENE1_LAYOUT;

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
      {/* Floor */}
      <line
        x1={0}
        y1={floor.y}
        x2={1920}
        y2={floor.y}
        stroke={COLORS.furniture}
        strokeWidth={floor.thickness}
      />

      {/* Chair (furniture color, stroke 14, round caps) */}
      <g
        stroke={COLORS.furniture}
        strokeWidth={chair.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Chair Leg */}
        <line x1={chair.legX} y1={chair.seatY} x2={chair.legX} y2={floor.y} />
        {/* Chair Seat */}
        <line x1={chair.seatX1} y1={chair.seatY} x2={chair.seatX2} y2={chair.seatY} />
        {/* Chair Backrest */}
        <line x1={chair.backrestX} y1={chair.seatY} x2={chair.backrestX} y2={chair.backrestYTop} />
      </g>

      {/* Desk Top */}
      <rect
        x={desk.startX}
        y={desk.topY}
        width={desk.endX - desk.startX}
        height={desk.thickness}
        fill={COLORS.furniture}
      />

      {/* Desk Right Leg */}
      <rect
        x={desk.legStartX}
        y={desk.topY + desk.thickness}
        width={desk.legEndX - desk.legStartX}
        height={floor.y - (desk.topY + desk.thickness)}
        fill={COLORS.furniture}
      />
    </svg>
  );
};
