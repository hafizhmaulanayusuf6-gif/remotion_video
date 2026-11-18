import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SCENE1_LAYOUT } from "../config";
import { blendPose, poses } from "../poses";
import { StickMan, StickManPose } from "../StickMan";
import { DeskSetting } from "../components/DeskSetting";
import { CodeScreen } from "../components/CodeScreen";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const { camera, stickMan } = SCENE1_LAYOUT;

  // 1. Slow camera push-in: scale 1.00 -> 1.05 centered at canvas center (960, 540)
  const cameraScale = interpolate(
    frame,
    [0, 119],
    [camera.scaleStart, camera.scaleEnd],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 2. Typing motion (frames 0-36):
  // forearm elbow oscillates +-4 degrees every 3 frames in opposite phase
  const basePose = poses.sitTyping;
  const typingPhase = Math.floor(frame / 3) % 2;
  const leftElbowOffset = typingPhase === 0 ? 4 : -4;
  const rightElbowOffset = typingPhase === 0 ? -4 : 4;

  const activeTypingPose: StickManPose = {
    ...basePose,
    leftArm: {
      ...basePose.leftArm,
      elbow: basePose.leftArm.elbow + leftElbowOffset,
    },
    rightArm: {
      ...basePose.rightArm,
      elbow: basePose.rightArm.elbow + rightElbowOffset,
    },
  };

  let currentPose: StickManPose;
  if (frame < 30) {
    currentPose = activeTypingPose;
  } else if (frame <= 36) {
    // Settle cleanly back to exact base sitTyping over frames 30-36
    const blendBackT = interpolate(frame, [30, 36], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    currentPose = blendPose(activeTypingPose, basePose, blendBackT);
  } else {
    currentPose = basePose;
  }

  // 3. Torso lean inspects screen (frames 40-70: torsoLean 4 -> 10, inOut cubic)
  if (frame >= 40) {
    const torsoLean = interpolate(frame, [40, 70], [4, 10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    currentPose = {
      ...currentPose,
      torsoLean,
    };
  }

  // 4. Error progress (frames 24-36: 0 -> 1, ease out cubic)
  const errorProgress = interpolate(frame, [24, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <DeskSetting
      cameraScale={cameraScale}
      clockText="02:00"
      stickMan={
        <StickMan
          pose={currentPose}
          x={stickMan.pelvisX}
          y={stickMan.pelvisY}
          scale={stickMan.scale}
          facing={stickMan.facing}
        />
      }
      panelContent={<CodeScreen errorProgress={errorProgress} />}
    />
  );
};
