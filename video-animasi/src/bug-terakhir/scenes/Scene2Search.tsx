import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SCENE1_LAYOUT, SCENE2_LAYOUT } from "../config";
import { blendPose, poses } from "../poses";
import { StickMan, StickManPose } from "../StickMan";
import { DeskSetting, CoffeeCupState } from "../components/DeskSetting";
import { CodeScreen } from "../components/CodeScreen";
import { Bug } from "../components/Bug";

export const Scene2Search: React.FC = () => {
  const frame = useCurrentFrame();

  const { stickMan } = SCENE1_LAYOUT;
  const {
    camera,
    scroll,
    coffeeCups,
    cupAnimation,
    clockEvents,
    bugEvents,
    bugAnimation,
    pointAnimation,
  } = SCENE2_LAYOUT;

  // 1. Camera scale: 1.05 from frame 0 to 150, eases to 1.00 by frame 239
  const cameraScale = interpolate(
    frame,
    [camera.holdEndFrame, camera.easeEndFrame],
    [camera.startScale, camera.endScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // 2. Typing oscillation running for the whole scene (torsoLean 10 throughout)
  const typingPhase = Math.floor(frame / 3) % 2;
  const leftElbowOffset = typingPhase === 0 ? 4 : -4;
  const rightElbowOffset = typingPhase === 0 ? -4 : 4;

  const baseTypingPose: StickManPose = {
    ...poses.sitTyping,
    torsoLean: 10,
    leftArm: {
      ...poses.sitTyping.leftArm,
      elbow: poses.sitTyping.leftArm.elbow + leftElbowOffset,
    },
    rightArm: {
      ...poses.sitTyping.rightArm,
      elbow: poses.sitTyping.rightArm.elbow + rightElbowOffset,
    },
  };

  const targetPointPose: StickManPose = {
    ...poses.sitPoint,
    torsoLean: 10,
  };

  // 3. Blend to sitPoint during bug events
  let pointT = 0;
  for (const bug of bugEvents) {
    const s = bug.startFrame;
    const blendStart = s + pointAnimation.blendInStart;
    const blendPeak = s + pointAnimation.blendInEnd;
    const holdEnd = s + pointAnimation.blendOutStart;
    const blendEnd = s + pointAnimation.blendOutEnd;

    if (frame >= blendStart && frame <= blendEnd) {
      if (frame < blendPeak) {
        pointT = interpolate(frame, [blendStart, blendPeak], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
      } else if (frame <= holdEnd) {
        pointT = 1;
      } else {
        pointT = interpolate(frame, [holdEnd, blendEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
      }
      break;
    }
  }

  const currentPose =
    pointT > 0
      ? blendPose(baseTypingPose, targetPointPose, pointT)
      : baseTypingPose;

  // 4. Code scroll offset: ramp 0..12 frames, then constant 6 px/frame
  const scrollOffset =
    frame < scroll.rampFrames
      ? 0.25 * frame * frame
      : 36 + scroll.speed * (frame - scroll.rampFrames);

  // 5. Coffee cups list
  const cups: CoffeeCupState[] = [
    // Cup 1: always present on desk
    {
      x: coffeeCups[0].x,
      y: SCENE1_LAYOUT.coffeeCup.bottomY,
      opacity: 1,
    },
  ];

  // Cup 2 at frame 78
  const cup2Config = coffeeCups[1];
  if (frame >= cup2Config.frame) {
    const dropOffset = interpolate(
      frame,
      [cup2Config.frame, cup2Config.frame + cupAnimation.dropDuration],
      [-cupAnimation.dropDistance, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }
    );
    const opacity = interpolate(
      frame,
      [cup2Config.frame, cup2Config.frame + cupAnimation.opacityDuration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    cups.push({
      x: cup2Config.x,
      y: SCENE1_LAYOUT.coffeeCup.bottomY + dropOffset,
      opacity,
    });
  }

  // Cup 3 at frame 150
  const cup3Config = coffeeCups[2];
  if (frame >= cup3Config.frame) {
    const dropOffset = interpolate(
      frame,
      [cup3Config.frame, cup3Config.frame + cupAnimation.dropDuration],
      [-cupAnimation.dropDistance, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }
    );
    const opacity = interpolate(
      frame,
      [cup3Config.frame, cup3Config.frame + cupAnimation.opacityDuration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    cups.push({
      x: cup3Config.x,
      y: SCENE1_LAYOUT.coffeeCup.bottomY + dropOffset,
      opacity,
    });
  }

  // 6. Clock text
  let clockText: string = clockEvents[0].text;
  if (frame >= clockEvents[1].untilFrame) {
    clockText = clockEvents[2].text; // 04:00
  } else if (frame >= clockEvents[0].untilFrame) {
    clockText = clockEvents[1].text; // 03:00
  }

  return (
    <DeskSetting
      cameraScale={cameraScale}
      clockText={clockText}
      cups={cups}
      stickMan={
        <StickMan
          pose={currentPose}
          x={stickMan.pelvisX}
          y={stickMan.pelvisY}
          scale={stickMan.scale}
          facing={stickMan.facing}
        />
      }
      panelContent={
        <CodeScreen errorProgress={1} scrollOffset={scrollOffset}>
          {bugEvents.map((bug) => {
            const s = bug.startFrame;
            if (frame < s || frame > s + bugAnimation.duckOutEnd) {
              return null;
            }

            let bugScale = 1;
            if (frame < s + bugAnimation.popInDuration) {
              bugScale = interpolate(
                frame,
                [s, s + bugAnimation.popInDuration],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                }
              );
            } else if (frame > s + bugAnimation.duckOutStart) {
              bugScale = interpolate(
                frame,
                [s + bugAnimation.duckOutStart, s + bugAnimation.duckOutEnd],
                [1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.in(Easing.cubic),
                }
              );
            }

            if (bugScale <= 0) {
              return null;
            }

            const legPhase = Math.floor(frame / 3) % 2;

            return (
              <Bug
                key={bug.id}
                x={bug.x}
                y={bug.y}
                scale={bugScale}
                legPhase={legPhase}
              />
            );
          })}
        </CodeScreen>
      }
    />
  );
};
