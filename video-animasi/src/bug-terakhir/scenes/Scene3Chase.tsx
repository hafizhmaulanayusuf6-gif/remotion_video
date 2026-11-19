import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SCENE3_LAYOUT } from "../config";
import { blendPose, groundedPelvisY, poses } from "../poses";
import { RUN_CYCLE_N, clamp, runPose, smoothstep } from "../runCycle";
import { StickMan, StickManPose } from "../StickMan";
import { DeskSetting } from "../components/DeskSetting";
import { CodeScreen } from "../components/CodeScreen";
import { Bug } from "../components/Bug";

// Run 1 (f 54..98, 44 steps): solve V1 so x(98) = 1068 from x(54) = 660
const run1UnitSpeed = (k: number): number =>
  smoothstep(clamp((k - 54) / 8, 0, 1));

let run1UnitSum = 0;
for (let k = 54; k < 98; k++) {
  run1UnitSum += run1UnitSpeed(k);
}
export const SCENE3_V1 =
  (SCENE3_LAYOUT.stickMan.runRightEndPelvisX -
    SCENE3_LAYOUT.stickMan.standingPelvisX) /
  run1UnitSum; // 408 / 39.5 = 10.329113924050633

// Skid displacement D = V1 * 24 / 3 for continuous speed at f = 98
export const SCENE3_SKID_D = (SCENE3_V1 * 24) / 3;
export const SCENE3_SKID_END_X =
  SCENE3_LAYOUT.stickMan.runRightEndPelvisX + SCENE3_SKID_D;

// Run 2 (f 124..146, 22 steps): 6-frame ramp up, constant, 6-frame ramp down
const softSmoothstep = (t: number): number => {
  const c = clamp(t, 0, 1);
  return 0.5 * (c + smoothstep(c));
};

const run2UnitSpeed = (k: number): number => {
  const up = softSmoothstep((k - 124 + 1) / 7);
  const down = softSmoothstep((146 - k) / 7);
  return Math.min(up, down);
};

let run2UnitSum = 0;
for (let k = 124; k < 146; k++) {
  run2UnitSum += run2UnitSpeed(k);
}
export const SCENE3_V2 =
  (SCENE3_SKID_END_X - SCENE3_LAYOUT.stickMan.runLeftEndPelvisX) / run2UnitSum; // 13.664556962025317

export const Scene3Chase: React.FC = () => {
  const frame = useCurrentFrame();

  const { camera, clockEvents, coffeeCups, scroll, bug, stickMan } =
    SCENE3_LAYOUT;

  // 1. Clock text: 04:00 until frame 149, 05:00 from frame 150
  const clockText =
    frame < clockEvents[0].untilFrame
      ? clockEvents[0].text
      : clockEvents[1].text;

  // 2. CodeScreen scroll offset
  let scrollOffset: number;
  if (frame <= 90) {
    scrollOffset = scroll.initialOffset + scroll.speed * (frame + 1);
  } else if (frame < 120) {
    const t = frame - 90;
    scrollOffset = 1944 + 6 * t - 0.1 * t * t;
  } else {
    scrollOffset = scroll.stopOffset; // 2034
  }

  // 3. Bug position and state (canvas coordinates, unclipped)
  let bugX: number = bug.startCanvasX;
  let bugY: number = bug.startCanvasY;
  let bugScale = 1;
  let bugLegPhase = 0;

  if (frame < 8) {
    bugScale = 0;
  } else if (frame <= 16) {
    // Pop-in at (1380, 535)
    bugScale = interpolate(frame, [8, 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  } else if (frame <= 20) {
    // Hold at (1380, 535)
    bugScale = 1;
  } else if (frame <= 48) {
    // Fall from panel to floor
    bugX = interpolate(frame, [20, 48], [bug.startCanvasX, bug.fallFloorX], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bugY = interpolate(frame, [20, 48], [bug.startCanvasY, bug.floorY], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
    bugLegPhase = 0;
  } else if (frame <= 72) {
    // Run right on floor
    bugX = interpolate(frame, [48, 72], [bug.fallFloorX, bug.runRightEndX], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bugY = bug.floorY;
    bugLegPhase = Math.floor(frame / 2) % 2;
  } else if (frame <= 80) {
    // Hold still turning around
    bugX = bug.runRightEndX;
    bugY = bug.floorY;
    bugLegPhase = 0;
  } else if (frame <= 128) {
    // Run left on floor
    bugX = interpolate(frame, [80, 128], [bug.runRightEndX, bug.runLeft1EndX], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bugY = bug.floorY;
    bugLegPhase = Math.floor(frame / 2) % 2;
  } else if (frame <= 146) {
    // Run left on floor to rest point
    bugX = interpolate(
      frame,
      [128, 146],
      [bug.runLeft1EndX, bug.runLeft2EndX],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    bugY = bug.floorY;
    bugLegPhase = Math.floor(frame / 2) % 2;
  } else {
    // Resting at x=826 until end
    bugX = bug.runLeft2EndX;
    bugY = bug.floorY;
    bugLegPhase = 0;
  }

  // 4. Stick man timeline
  let pelvisX: number = stickMan.seatedPelvisX;
  let pelvisY: number;
  let facing: 1 | -1 = 1;
  let pose: StickManPose;

  if (frame < 16) {
    // Seated typing with oscillation
    pelvisX = stickMan.seatedPelvisX;
    facing = 1;
    const typingPhase = Math.floor(frame / 3) % 2;
    const leftElbowOffset = typingPhase === 0 ? 4 : -4;
    const rightElbowOffset = typingPhase === 0 ? -4 : 4;
    pose = {
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
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 21) {
    // Blend to sitPoint
    pelvisX = stickMan.seatedPelvisX;
    facing = 1;
    const t = interpolate(frame, [16, 21], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blendPose(
      { ...poses.sitTyping, torsoLean: 10 },
      { ...poses.sitPoint, torsoLean: 10 },
      t
    );
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame <= 30) {
    // Hold sitPoint
    pelvisX = stickMan.seatedPelvisX;
    facing = 1;
    pose = { ...poses.sitPoint, torsoLean: 10 };
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 54) {
    // Stand up: f 30..42 sitPoint -> standUpMid, f 42..54 standUpMid -> standSide
    facing = 1;
    pelvisX = interpolate(
      frame,
      [30, 54],
      [stickMan.seatedPelvisX, stickMan.standingPelvisX],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );
    if (frame <= 42) {
      const t = interpolate(frame, [30, 42], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(
        { ...poses.sitPoint, torsoLean: 10 },
        poses.standUpMid,
        t
      );
    } else {
      const t = interpolate(frame, [42, 54], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(poses.standUpMid, poses.standSide, t);
    }
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 98) {
    // Run 1 (f 54..97, facing 1): deterministic cumulative sum for pelvisX
    facing = 1;
    let sumX = stickMan.standingPelvisX;
    for (let k = 54; k < frame; k++) {
      sumX += SCENE3_V1 * run1UnitSpeed(k);
    }
    pelvisX = sumX;
    const speed = SCENE3_V1 * run1UnitSpeed(frame);
    const phase = (frame - 54) / RUN_CYCLE_N;
    const runResult = runPose(phase, speed, stickMan.scale);
    pose = runResult.pose;
    pelvisY = stickMan.groundY - runResult.pelvisHeight;
  } else if (frame < 124) {
    // Skid (f 98..123): cubic ease-out over 98..122 with D = V1 * 24 / 3, hold until 124
    facing = frame < stickMan.skidFlipFrame ? 1 : -1;
    if (frame <= 122) {
      pelvisX = interpolate(
        frame,
        [98, 122],
        [stickMan.runRightEndPelvisX, SCENE3_SKID_END_X],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      );
    } else {
      pelvisX = SCENE3_SKID_END_X;
    }

    const skidSpeed =
      frame <= 122 ? SCENE3_V1 * Math.pow(1 - (frame - 98) / 24, 2) : 0;
    const skidBasePose: StickManPose = { ...poses.skid, torsoLean: -10 };

    if (frame <= 106) {
      const phase = (frame - 54) / RUN_CYCLE_N;
      const currentRun = runPose(phase, skidSpeed, stickMan.scale).pose;
      const t = interpolate(frame, [98, 106], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = {
        ...blendPose(currentRun, skidBasePose, t),
        torsoLean: -10,
      };
    } else if (frame <= 110) {
      const lean = interpolate(frame, [106, 110], [-10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = { ...poses.skid, torsoLean: lean };
    } else {
      const lean = interpolate(frame, [110, 124], [0, 8], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = { ...poses.skid, torsoLean: lean };
    }
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else if (frame < 146) {
    // Run 2 (f 124..145, facing -1): deterministic cumulative sum from SCENE3_SKID_END_X to 932
    facing = -1;
    let sumX = SCENE3_SKID_END_X;
    for (let k = 124; k < frame; k++) {
      sumX -= SCENE3_V2 * run2UnitSpeed(k);
    }
    pelvisX = sumX;

    const speed =
      frame === 124 ? 0 : SCENE3_V2 * run2UnitSpeed(frame);
    const phase = (frame - 124) / RUN_CYCLE_N;
    const runResult = runPose(phase, speed, stickMan.scale);

    if (frame < 130) {
      const t = interpolate(frame, [124, 130], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      const skidEndPose: StickManPose = { ...poses.skid, torsoLean: 8 };
      pose = blendPose(skidEndPose, runResult.pose, t);
      pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
    } else {
      pose = runResult.pose;
      pelvisY = stickMan.groundY - runResult.pelvisHeight;
    }
  } else if (frame <= 162) {
    // Peer: blend runPose (speed 0 at f 146) -> peer over 146..154, hold peer until 162
    facing = -1;
    pelvisX = stickMan.runLeftEndPelvisX;
    const endRunPose = runPose((146 - 124) / RUN_CYCLE_N, 0, stickMan.scale).pose;
    if (frame < 154) {
      const t = interpolate(frame, [146, 154], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(endRunPose, poses.peer, t);
    } else {
      pose = poses.peer;
    }
    pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);
  } else {
    // Frustrated: blend peer -> handsOnHead over 162..176, hold until 209
    facing = -1;
    pelvisX = stickMan.runLeftEndPelvisX;
    if (frame < 176) {
      const t = interpolate(frame, [162, 176], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(poses.peer, poses.handsOnHead, t);
    } else {
      pose = poses.handsOnHead;
    }
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
      panelContent={<CodeScreen errorProgress={1} scrollOffset={scrollOffset} />}
    >
      {/* Bug in canvas space, unclipped, in front of Room and StickMan */}
      {bugScale > 0 && (
        <Bug
          x={bugX}
          y={bugY}
          scale={bugScale}
          legPhase={bugLegPhase}
        />
      )}
    </DeskSetting>
  );
};
