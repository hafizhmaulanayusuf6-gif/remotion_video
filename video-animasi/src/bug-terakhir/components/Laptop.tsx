import React from "react";
import { COLORS, SCENE1_LAYOUT } from "../config";

export interface LaptopProps {
  children?: React.ReactNode;
}

export const Laptop: React.FC<LaptopProps> = () => {
  const { laptop } = SCENE1_LAYOUT;

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
      {/* Laptop Base (Side View, resting on desk) */}
      <rect
        x={laptop.baseX}
        y={laptop.baseTopY}
        width={laptop.baseWidth}
        height={laptop.baseHeight}
        rx={laptop.baseCornerRadius}
        ry={laptop.baseCornerRadius}
        fill={COLORS.screen}
      />

      {/* Laptop Screen (Side View, tilted 18° away from stick man) */}
      <line
        x1={laptop.hingeX}
        y1={laptop.hingeY}
        x2={laptop.screenTopX}
        y2={laptop.screenTopY}
        stroke={COLORS.screen}
        strokeWidth={laptop.screenWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
