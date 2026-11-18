import React from "react";
import { interpolateColors } from "remotion";
import { COLORS, FONTS } from "../config";

const CODE_WIDTHS = [260, 340, 180, 300, 220, 360, 200, 280, 150];
const CODE_INDENTS = [0, 40, 40, 80, 80, 40, 40, 0, 0];
const ERROR_LINE_INDEX = 5;
const LINE_SPACING = 30;
const TOP_PADDING = 40;
const VISIBLE_LINE_COUNT = 14;

export interface CodeScreenProps {
  errorProgress: number; // 0..1
  scrollOffset?: number;
  children?: React.ReactNode;
}

export const CodeScreen: React.FC<CodeScreenProps> = ({
  errorProgress,
  scrollOffset,
  children,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, errorProgress));

  const errorLineColor = interpolateColors(
    clampedProgress,
    [0, 1],
    [COLORS.codeLine, COLORS.error]
  );

  const isScrolling = scrollOffset !== undefined;

  // In scrolling mode, compute constant count of visible lines
  const minLineIndex = isScrolling
    ? Math.max(0, Math.floor((scrollOffset - TOP_PADDING) / LINE_SPACING))
    : 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        paddingTop: isScrolling ? 0 : TOP_PADDING,
        paddingLeft: isScrolling ? 0 : 36,
        overflow: "hidden",
      }}
    >
      {/* Code lines */}
      {isScrolling
        ? Array.from({ length: VISIBLE_LINE_COUNT }).map((_, k) => {
            const lineIndex = minLineIndex + k;
            const patternIndex = lineIndex % CODE_WIDTHS.length;
            const width = CODE_WIDTHS[patternIndex];
            const indent = CODE_INDENTS[patternIndex];
            const y = TOP_PADDING + lineIndex * LINE_SPACING - scrollOffset;
            const isErrorLine = lineIndex === ERROR_LINE_INDEX;
            const color = isErrorLine ? COLORS.error : COLORS.codeLine;

            return (
              <div
                key={lineIndex}
                style={{
                  position: "absolute",
                  top: y,
                  left: 36 + indent,
                  height: 10,
                  width,
                  borderRadius: 5,
                  backgroundColor: color,
                }}
              />
            );
          })
        : CODE_WIDTHS.map((width, index) => {
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

      {/* Optional Bug overlay (in front of code lines, behind badge) */}
      {children}

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
            zIndex: 2,
          }}
        >
          1 error
        </div>
      )}
    </div>
  );
};
