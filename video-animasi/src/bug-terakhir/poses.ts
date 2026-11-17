import { StickManPose } from "./StickMan";

export const POSES: Record<"standing", StickManPose> = {
  standing: {
    torsoLean: 0,
    headAngle: 0,
    leftArm: {
      shoulder: 14,
      elbow: 6,
    },
    rightArm: {
      shoulder: -14,
      elbow: 6,
    },
    leftLeg: {
      hip: 6,
      knee: 0,
    },
    rightLeg: {
      hip: -6,
      knee: 0,
    },
  },
};

export const standingPose = POSES.standing;
