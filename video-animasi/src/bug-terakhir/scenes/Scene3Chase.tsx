import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SCENE3_LAYOUT } from "../config";
import { blendPose, groundedPelvisY, poses } from "../poses";
import { StickMan, StickManPose } from "../StickMan";
import { DeskSetting } from "../components/DeskSetting";
import { CodeScreen } from "../components/CodeScreen";
import { Bug } from "../components/Bug";

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
  } else if (frame <= 30) {
    // Hold sitPoint
    pelvisX = stickMan.seatedPelvisX;
    facing = 1;
    pose = { ...poses.sitPoint, torsoLean: 10 };
  } else if (frame <= 54) {
    // Stand up: blend sitPoint -> standSide, pelvis x 620 -> 660
    const t = interpolate(frame, [30, 54], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
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
    facing = 1;
    pose = blendPose({ ...poses.sitPoint, torsoLean: 10 }, poses.standSide, t);
  } else if (frame <= 98) {
    // Run right: pelvis x 660 -> 1068
    facing = 1;
    pelvisX = interpolate(
      frame,
      [54, 98],
      [stickMan.standingPelvisX, stickMan.runRightEndPelvisX],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    const runW = 0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - 54)) / 12);
    const currentRunPose = blendPose(poses.chase, poses.runB, runW);
    if (frame < 60) {
      const t = interpolate(frame, [54, 60], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(poses.standSide, currentRunPose, t);
    } else {
      pose = currentRunPose;
    }
  } else if (frame <= 124) {
    // Skid: pelvis x eases out 1068 -> 1130 over 98..122, then holds
    facing = frame < stickMan.skidFlipFrame ? 1 : -1;
    if (frame <= 122) {
      pelvisX = interpolate(
        frame,
        [98, 122],
        [stickMan.runRightEndPelvisX, stickMan.skidEndPelvisX],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      );
    } else {
      pelvisX = stickMan.skidEndPelvisX;
    }

    const runW98 = 0.5 - 0.5 * Math.cos((2 * Math.PI * (98 - 54)) / 12);
    const runPose98 = blendPose(poses.chase, poses.runB, runW98);
    if (frame < 106) {
      const t = interpolate(frame, [98, 106], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(runPose98, poses.skid, t);
    } else {
      pose = poses.skid;
    }
  } else if (frame <= 146) {
    // Run left: pelvis x 1130 -> 932
    facing = -1;
    pelvisX = interpolate(
      frame,
      [124, 146],
      [stickMan.skidEndPelvisX, stickMan.runLeftEndPelvisX],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    const runW = 0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - 124)) / 12);
    const currentRunPose = blendPose(poses.chase, poses.runB, runW);
    if (frame < 130) {
      const t = interpolate(frame, [124, 130], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(poses.skid, currentRunPose, t);
    } else {
      pose = currentRunPose;
    }
  } else if (frame <= 162) {
    // Peer: blend runPose -> peer over 146..154, hold peer until 162
    facing = -1;
    pelvisX = stickMan.runLeftEndPelvisX;
    const runW146 = 0.5 - 0.5 * Math.cos((2 * Math.PI * (146 - 124)) / 12);
    const runPose146 = blendPose(poses.chase, poses.runB, runW146);
    if (frame < 154) {
      const t = interpolate(frame, [146, 154], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      pose = blendPose(runPose146, poses.peer, t);
    } else {
      pose = poses.peer;
    }
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
  }

  // Dynamic grounded pelvis Y computed every frame
  const pelvisY = groundedPelvisY(pose, stickMan.scale, stickMan.groundY);

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
