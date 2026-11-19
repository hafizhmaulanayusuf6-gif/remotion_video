import { FIGURE_PROPORTIONS, STICK_MAN_STROKE } from "./config";
import { blendPose, getFootRelY, poses } from "./poses";
import { StickManPose } from "./StickMan";

export const RUN_CYCLE_N = 20;
export const RUN_STANCE_FRACTION = 0.42;

const toDeg = (rad: number): number => (rad * 180) / Math.PI;

export const clamp = (val: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, val));

export const smoothstep = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};

export interface RunPoseResult {
  pose: StickManPose;
  pelvisHeight: number;
}

/**
 * Planted-feet two-bone IK procedural run cycle.
 *
 * @param phase - Cycle phase (increases by 1 / RUN_CYCLE_N per frame)
 * @param speed - Pelvis horizontal speed in px per frame (direction-independent)
 * @param scale - StickMan render scale (e.g. 1.6)
 */
export const runPose = (
  phase: number,
  speed: number,
  scale: number
): RunPoseResult => {
  const L1 = FIGURE_PROPORTIONS.thighLength * scale;
  const L2 = FIGURE_PROPORTIONS.shinLength * scale;
  const strokeHalf = (STICK_MAN_STROKE.width * scale) / 2;

  const scaleRatio = scale / 1.6;
  const N = RUN_CYCLE_N;
  const ds = RUN_STANCE_FRACTION;
  const V_REF = 11.5 * scaleRatio;
  const lift = 80 * scaleRatio;
  const bob = 7 * scaleRatio;

  const absSpeed = Math.abs(speed);
  const s = clamp(absSpeed / V_REF, 0, 1);
  const w = smoothstep(s);

  // Half stride in px
  const A = (absSpeed * ds * N) / 2;

  // Pelvis height above ground during full run
  const H0 = 0.97 * (L1 + L2) + strokeHalf;
  const h = H0 - bob * s * Math.cos(4 * Math.PI * (phase - 0.21));

  const solveLeg = (legOffset: number): { hip: number; knee: number } => {
    const p = (((phase + legOffset) % 1) + 1) % 1;
    let dx: number;
    let dy: number;

    if (p < ds) {
      // Stance phase: foot sweeps backward at ground level
      dx = A - 2 * A * (p / ds);
      dy = h - strokeHalf;
    } else {
      // Swing phase: foot lifts and swings forward
      const q = (p - ds) / (1 - ds);
      const sinQ = Math.sin(Math.PI * q);
      const liftEnvelope = sinQ * smoothstep(sinQ);
      dx = -A + 2 * A * (0.5 - 0.5 * Math.cos(Math.PI * q));
      dy = h - strokeHalf - lift * s * liftEnvelope;
    }

    // Two-bone IK (knee bends forward toward +x)
    const maxReach = 0.999 * (L1 + L2);
    const d = Math.min(Math.hypot(dx, dy), maxReach);
    const beta = Math.atan2(dx, dy);
    const cosAlpha = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    const cosGamma = clamp((L2 * L2 + d * d - L1 * L1) / (2 * L2 * d), -1, 1);
    const alpha = Math.acos(cosAlpha);
    const gamma = Math.acos(cosGamma);

    return {
      hip: toDeg(beta + alpha),
      knee: toDeg(-(alpha + gamma)),
    };
  };

  const leftLeg = solveLeg(0);
  const rightLeg = solveLeg(0.5);

  const leftShoulder = -50 * s * Math.cos(2 * Math.PI * phase);
  const rightShoulder = 50 * s * Math.cos(2 * Math.PI * phase);
  const leftElbow = 8 + 57 * s + 0.24 * leftShoulder;
  const rightElbow = 8 + 57 * s + 0.24 * rightShoulder;

  const torsoLean = 6 + 9 * s + 1.5 * s * Math.cos(4 * Math.PI * phase);

  const fullRunPose: StickManPose = {
    torsoLean,
    headAngle: 0,
    leftArm: { shoulder: leftShoulder, elbow: leftElbow },
    rightArm: { shoulder: rightShoulder, elbow: rightElbow },
    leftLeg,
    rightLeg,
  };

  const pose = blendPose(poses.standSide, fullRunPose, w);

  // Pelvis height keeps the lowest foot planted on groundY while following the IK bob h
  const pelvisHeight =
    (Math.max(
      getFootRelY(pose.leftLeg.hip, pose.leftLeg.knee),
      getFootRelY(pose.rightLeg.hip, pose.rightLeg.knee)
    ) +
      STICK_MAN_STROKE.width / 2) *
    scale;

  return { pose, pelvisHeight };
};
