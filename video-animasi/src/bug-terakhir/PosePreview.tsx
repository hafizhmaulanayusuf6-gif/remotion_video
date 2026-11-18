/**
 * TEMPORARY pose preview for the Scene 1 placeholder.
 * Will be replaced by the real Scene 1.
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, SCENES } from "./config";
import { StickMan } from "./StickMan";
import { blendPose, PoseName, poses } from "./poses";

const ORDER: PoseName[] = [
  "standing",
  "sitTyping",
  "handsOnHead",
  "thinking",
  "chase",
  "frozen",
  "victory",
];

const SLOT = Math.floor(SCENES.S1_HOOK.duration / ORDER.length); // 17
const HOLD_FRACTION = 0.4;

export const PosePreview: React.FC = () => {
  const frame = useCurrentFrame();
  // The last slot absorbs the remainder (120 - 6 * 17 = 18 frames).
  const index = Math.min(Math.floor(frame / SLOT), ORDER.length - 1);
  const local = frame - index * SLOT;
  const isLast = index === ORDER.length - 1;

  const from = poses[ORDER[index]];
  const to = isLast ? from : poses[ORDER[index + 1]];
  const t = isLast
    ? 0
    : interpolate(local, [SLOT * HOLD_FRACTION, SLOT], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });

  return (
    <>
      <span
        style={{
          marginTop: 10,
          fontFamily: FONTS.monospace,
          fontSize: 18,
          color: COLORS.figure,
        }}
      >
        pose: {ORDER[index]}
        {t > 0 ? ` -> ${ORDER[index + 1]}` : ""}
      </span>
      <StickMan
        pose={blendPose(from, to, t)}
        x={960}
        y={555}
        scale={1.4}
        facing={1}
      />
    </>
  );
};
