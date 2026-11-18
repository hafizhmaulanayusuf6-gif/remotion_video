import React from "react";
import { interpolateColors } from "remotion";
import { COLORS, FONTS } from "../config";

const CODE_WIDTHS = [260, 340, 180, 300, 220, 360, 200, 280, 150];
const CODE_INDENTS = [0, 40, 40, 80, 80, 40, 40, 0, 0];
const ERROR_LINE_INDEX = 5;

interface CodeScreenProps {
  errorProgress: number; // 0..1
}

export const CodeScreen: React.FC<CodeScreenProps> = ({ errorProgress }) => {
  const clampedProgress = Math.min(1, Math.max(0, errorProgress));

  const errorLineColor = interpolateColors(
    clampedProgress,
    [0, 1],
    [COLORS.codeLine, COLORS.error]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        paddingTop: 40,
        paddingLeft: 36,
      }}
    >
      {/* 9 Code Line Bars */}
      {CODE_WIDTHS.map((width, index) => {
        const isErrorLine = index === ERROR_LINE_INDEX;
        const color = isErrorLine ? errorLineColor : COLORS.codeLine;

        return (
          <div
            key={index}
            style={{
              height: 10,
              width,
              borderRadius: 5,
              backgroundColor: color,
              marginLeft: CODE_INDENTS[index],
              marginBottom: 20, // line spacing 30: 10px bar + 20px margin
            }}
          />
        );
      })}

      {/* Red "1 error" Badge at bottom-left */}
      {clampedProgress > 0 && (
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 24,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLORS.error,
            color: COLORS.badgeText,
            fontFamily: FONTS.monospace,
            fontWeight: "bold",
            fontSize: 24,
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: clampedProgress,
            transformOrigin: "left center",
            transform: `scale(${0.85 + 0.15 * clampedProgress})`,
            letterSpacing: "0.5px",
          }}
        >
          1 error
        </div>
      )}
    </div>
  );
};
