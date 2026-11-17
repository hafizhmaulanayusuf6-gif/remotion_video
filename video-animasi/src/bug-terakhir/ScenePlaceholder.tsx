import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "./config";

interface ScenePlaceholderProps {
  name: string;
  totalDuration: number;
  children?: React.ReactNode;
}

export const ScenePlaceholder: React.FC<ScenePlaceholderProps> = ({
  name,
  totalDuration,
  children,
}) => {
  const localFrame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        color: COLORS.line,
        fontFamily: FONTS.monospace,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 48,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.line,
            letterSpacing: "0.5px",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 18,
            color: COLORS.line,
            opacity: 0.65,
          }}
        >
          Frame: {localFrame} / {totalDuration}
        </span>
      </div>
      {children}
    </AbsoluteFill>
  );
};
