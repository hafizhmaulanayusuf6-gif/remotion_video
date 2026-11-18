import React from "react";
import { COLORS, SCENE1_LAYOUT } from "../config";

interface LaptopProps {
  children?: React.ReactNode;
}

export const Laptop: React.FC<LaptopProps> = ({ children }) => {
  const { laptopBase, laptopScreen } = SCENE1_LAYOUT;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {/* Laptop Base */}
      <div
        style={{
          position: "absolute",
          left: laptopBase.x,
          top: laptopBase.topY,
          width: laptopBase.width,
          height: laptopBase.height,
          backgroundColor: COLORS.screen,
          borderRadius: 2,
        }}
      />

      {/* Laptop Screen Frame (flat facing camera) */}
      <div
        style={{
          position: "absolute",
          left: laptopScreen.x,
          top: laptopScreen.y,
          width: laptopScreen.width,
          height: laptopScreen.height,
          backgroundColor: COLORS.screen,
          borderRadius: laptopScreen.cornerRadius,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
