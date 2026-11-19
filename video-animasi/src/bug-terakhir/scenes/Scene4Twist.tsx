import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, SCENE4_LAYOUT } from "../config";
import { blendPose, groundedPelvisY, poses } from "../poses";
import { RUN_CYCLE_N, clamp, runPose, smoothstep } from "../runCycle";
import { StickMan, StickManPose } from "../StickMan";
import { DeskSetting } from "../components/DeskSetting";
import { CodeScreen } from "../components/CodeScreen";
import { Bug } from "../components/Bug";
import { Semicolon } from "../components/Semicolon";

// Scene 4 Run (f 70..104, 34 steps): 6-frame smoothstep ramp up, constant, 8-frame smoothstep ramp down
const run4UnitSpeed = (k: number): number => {
  const up = smoothstep(clamp((k - 70 + 1) / 7, 0, 1));
  const down = smoothstep(clamp((104 - k) / 9, 0, 1));
  return Math.min(up, down);
};

let run4UnitSum = 0;
for (let k = 70; k < 104; k++) {
  run4UnitSum += run4UnitSpeed(k);
}
export const SCENE4_V_RUN =
  (SCENE4_LAYOUT.stickMan.startPelvisX - SCENE4_LAYOUT.stickMan.seatedPelvisX) /
  run4UnitSum; // 312 / 27 = 11.555555555555555

const SYMMETRIC_FROZEN: StickManPose = {
  ...poses.frozen,
  torsoLean: 0,
};

const SEATED_TYPING_BASE: StickManPose = {
  ...poses.sitTyping,
  torsoLean: 10,
};

export const Scene4Twist: React.FC = () => {
  const frame = useCurrentFrame();

  const { camera, clockText, coffeeCups, panel, bugToSemicolon, stickMan } =
    SCENE4_LAYOUT;

  // 1. Panel state: Line 72 is error color from f 60..131; badge becomes "0 errors" from f 134
  const errorLineIndex =
    frame >= panel.errorStartFrame && frame <= panel.errorEndFrame
      ? panel.targetLineIndex
      : null;
  const resolved = frame >= panel.badgeSuccessFrame;

  // 2. Bug -> Semicolon transformation and flight (world space)
  const hoverOffset = interpolate(
    frame,
    [bugToSemicolon.hoverStartFrame, bugToSemicolon.hoverEndFrame],
    [0, bugToSemicolon.hoverDistance],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const legsProgress = interpolate(
    frame,
    [bugToSemicolon.legsShrinkStartFrame, bugToSemicolon.legsShrinkEndFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  const eyesOpacity = interpolate(
    frame,
    [bugToSemicolon.eyesFadeStartFrame, bugToSemicolon.eyesFadeEndFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const showBug = frame < bugToSemicolon.swapFrame;
  const bugX = bugToSemicolon.startX;
  const bugY = bugToSemicolon.floorY - hoverOffset;

  // Semicolon coordinates (f >= 36)
  let semiX: number = bugToSemicolon.startX;
  let semiY: number =
    bugToSemicolon.floorY - bugToSemicolon.bugBodyOffsetY - hoverOffset;
  let semiScale = 1;
  let semiColor: string = COLORS.error;

  const dotsProgress = interpolate(
    frame,
    [bugToSemicolon.dotsGrowStartFrame, bugToSemicolon.dotsGrowEndFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  if (
    frame >= bugToSemicolon.flightStartFrame &&
    frame <= bugToSemicolon.flightEndFrame
  ) {
    // Quadratic Bezier flight from P0 (826, 838) via P1 (1100, 330) to P2 (1514, 406)
    const p0X = bugToSemicolon.startX;
    const p0Y =
      bugToSemicolon.floorY -
      bugToSemicolon.bugBodyOffsetY -
      bugToSemicolon.hoverDistance; // 838
    const p1X = bugToSemicolon.controlPointX;
    const p1Y = bugToSemicolon.controlPointY;
    const p2X = panel.targetCanvasX;
    const p2Y = panel.targetCanvasY;

    const t = interpolate(
      frame,
      [bugToSemicolon.flightStartFrame, bugToSemicolon.flightEndFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );
    const oneMinusT = 1 - t;
    semiX =
      oneMinusT * oneMinusT * p0X +
      2 * oneMinusT * t * p1X +
      t * t * p2X;
    semiY =
      oneMinusT * oneMinusT * p0Y +
      2 * oneMinusT * t * p1Y +
      t * t * p2Y;
    semiScale = 1 + (bugToSemicolon.endScale - 1) * t;
    semiColor = COLORS.error;
  } else if (frame > bugToSemicolon.flightEndFrame) {
    semiX = panel.targetCanvasX;
    semiScale = bugToSemicolon.endScale;

    if (frame < bugToSemicolon.colorSuccessFrame) {
      // Hover bob at P2 (f 90..131)
      const bobOffset =
        -bugToSemicolon.bobAmplitude *
        Math.sin(
          (2 * Math.PI * (frame - bugToSemicolon.flightEndFrame)) /
            bugToSemicolon.bobPeriod
        );
      semiY = panel.targetCanvasY + bobOffset;
      semiColor = COLORS.error;
    } else {
      // f >= 132: instant green, bob offset eases to 0 over f 132..138
      semiColor = COLORS.success;
      const bobAt132 =
        -bugToSemicolon.bobAmplitude *
        Math.sin(
          (2 *
            Math.PI *
            (bugToSemicolon.colorSuccessFrame -
              bugToSemicolon.flightEndFrame)) /
            bugToSemicolon.bobPeriod
        );
      const settleT = interpolate(
        frame,
        [bugToSemicolon.colorSuccessFrame, bugToSemicolon.bobSettleEndFrame],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      );
      semiY = panel.targetCanvasY + bobAt132 * (1 - settleT);
    }
  }

  // 3. Stick man timeline
  let pelvisX: number = stickMan.startPelvisX;
  let pelvisY: number;
  const facing: 1 | -1 = frame < stickMan.flipFrame ? -1 : 1;
  let pose: StickManPose;

  if (frame <= 40) {
    // Hold handsOnHead at x = 932
    pelvisX = stickMan.startPelvisX;
    pose = poses.handsOnHead;
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame <= 62) {
    // Blend handsOnHead -> frozen over f 40..54, hold frozen until f 62
    pelvisX = stickMan.startPelvisX;
    const t = interpolate(frame, [40, 54], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blendPose(poses.handsOnHead, poses.frozen, t);
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 70) {
    // Blend frozen -> standSide over f 62..70
    pelvisX = stickMan.startPelvisX;
    const t = interpolate(frame, [62, 70], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blendPose(poses.frozen, poses.standSide, t);
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 104) {
    // Run back to chair (f 70..103, facing -1): deterministic cumulative sum 932 -> 620
    let sumX = stickMan.startPelvisX;
    for (let k = 70; k < frame; k++) {
      sumX -= SCENE4_V_RUN * run4UnitSpeed(k);
    }
    pelvisX = sumX;
    const speed = frame === 70 ? 0 : SCENE4_V_RUN * run4UnitSpeed(frame);
    const phase = (frame - 70) / RUN_CYCLE_N;
    const runResult = runPose(phase, speed, stickMan.scale);
    pose = runResult.pose;
    pelvisY = stickMan.groundY - runResult.pelvisHeight;
  } else if (frame <= 110) {
    // f 104..110: blend runPose (speed 0) -> mirror-symmetric frozen at x = 620
    pelvisX = stickMan.seatedPelvisX;
    const endRunPose = runPose((104 - 70) / RUN_CYCLE_N, 0, stickMan.scale).pose;
    const t = interpolate(frame, [104, 110], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blendPose(endRunPose, SYMMETRIC_FROZEN, t);
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame <= 128) {
    // f 110..128: sit down: blend symmetric frozen -> sitTyping (torsoLean 10) at x = 620
    pelvisX = stickMan.seatedPelvisX;
    const t = interpolate(frame, [110, 128], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blendPose(SYMMETRIC_FROZEN, SEATED_TYPING_BASE, t);
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame <= 154) {
    // f 128..154: typing oscillation (+-4 deg every 3 frames), ramp in 128..134, blend back 148..154
    pelvisX = stickMan.seatedPelvisX;
    const ampRamp = interpolate(frame, [128, 134], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const typingPhase = Math.floor(frame / 3) % 2;
    const leftElbowOffset = (typingPhase === 0 ? 4 : -4) * ampRamp;
    const rightElbowOffset = (typingPhase === 0 ? -4 : 4) * ampRamp;

    const oscillatingPose: StickManPose = {
      ...SEATED_TYPING_BASE,
      leftArm: {
        ...SEATED_TYPING_BASE.leftArm,
        elbow: SEATED_TYPING_BASE.leftArm.elbow + leftElbowOffset,
      },
      rightArm: {
        ...SEATED_TYPING_BASE.rightArm,
        elbow: SEATED_TYPING_BASE.rightArm.elbow + rightElbowOffset,
      },
    };

    if (frame < 148) {
      pose = oscillatingPose;
    } else {
      const settleT = interpolate(frame, [148, 154], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      pose = blendPose(oscillatingPose, SEATED_TYPING_BASE, settleT);
    }
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else {
    // f 154..179: hold sitTyping (torsoLean 10)
    pelvisX = stickMan.seatedPelvisX;
    pose = SEATED_TYPING_BASE;
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  }

  return (
    <DeskSetting
      cameraScale={camera.scale}
      clockText={clockText}
      cups={coffeeCups.map((c) => ({ x: c.x, opacity: 1 }))}
      stickMan={
        <StickMan
          pose={pose}
          x={pelvisX}
          y={pelvisY}
          scale={stickMan.scale}
          facing={facing}
        />
      }
      panelContent={
        <CodeScreen
          errorProgress={1}
          scrollOffset={panel.scrollOffset}
          errorLineIndex={errorLineIndex}
          resolved={resolved}
        />
      }
    >
      {/* World-space Bug (f 0..35) or Semicolon (f 36..179) */}
      {showBug ? (
        <Bug
          x={bugX}
          y={bugY}
          scale={1}
          legPhase={0}
          legsProgress={legsProgress}
          eyesOpacity={eyesOpacity}
        />
      ) : (
        <Semicolon
          x={semiX}
          y={semiY}
          scale={semiScale}
          color={semiColor}
          dotsProgress={dotsProgress}
        />
      )}
    </DeskSetting>
  );
};
