import React from "react";
import { COLORS, FONTS, SCENE1_LAYOUT } from "../config";

interface ClockProps {
  text?: string;
}

export const Clock: React.FC<ClockProps> = ({ text = "02:00" }) => {
  const { clock } = SCENE1_LAYOUT;

  return (
    <div
      style={{
        position: "absolute",
        left: clock.x,
        top: clock.y,
        width: clock.width,
        height: clock.height,
        borderRadius: clock.cornerRadius,
        backgroundColor: COLORS.screen,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: FONTS.monospace,
          fontWeight: "bold",
          fontSize: clock.fontSize,
          color: COLORS.background,
          lineHeight: 1,
          letterSpacing: "-2px",
          userSelect: "none",
        }}
      >
        {text}
      </span>
    </div>
  );
};
