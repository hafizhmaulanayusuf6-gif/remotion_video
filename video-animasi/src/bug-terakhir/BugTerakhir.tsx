import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES } from "./config";
import { ScenePlaceholder } from "./ScenePlaceholder";
import { Scene1Hook } from "./scenes/Scene1Hook";

export const BugTerakhir: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* S1 Hook: frames 0 - 120 */}
      <Sequence
        from={SCENES.S1_HOOK.start}
        durationInFrames={SCENES.S1_HOOK.duration}
        name={SCENES.S1_HOOK.name}
      >
        <ScenePlaceholder
          name={SCENES.S1_HOOK.name}
          totalDuration={SCENES.S1_HOOK.duration}
        >
          <Scene1Hook />
        </ScenePlaceholder>
      </Sequence>

      {/* S2 Search: frames 120 - 360 */}
      <Sequence
        from={SCENES.S2_SEARCH.start}
        durationInFrames={SCENES.S2_SEARCH.duration}
        name={SCENES.S2_SEARCH.name}
      >
        <ScenePlaceholder
          name={SCENES.S2_SEARCH.name}
          totalDuration={SCENES.S2_SEARCH.duration}
        />
      </Sequence>

      {/* S3 Chase: frames 360 - 570 */}
      <Sequence
        from={SCENES.S3_CHASE.start}
        durationInFrames={SCENES.S3_CHASE.duration}
        name={SCENES.S3_CHASE.name}
      >
        <ScenePlaceholder
          name={SCENES.S3_CHASE.name}
          totalDuration={SCENES.S3_CHASE.duration}
        />
      </Sequence>

      {/* S4 Twist: frames 570 - 750 */}
      <Sequence
        from={SCENES.S4_TWIST.start}
        durationInFrames={SCENES.S4_TWIST.duration}
        name={SCENES.S4_TWIST.name}
      >
        <ScenePlaceholder
          name={SCENES.S4_TWIST.name}
          totalDuration={SCENES.S4_TWIST.duration}
        />
      </Sequence>

      {/* S5 Victory: frames 750 - 840 */}
      <Sequence
        from={SCENES.S5_VICTORY.start}
        durationInFrames={SCENES.S5_VICTORY.duration}
        name={SCENES.S5_VICTORY.name}
      >
        <ScenePlaceholder
          name={SCENES.S5_VICTORY.name}
          totalDuration={SCENES.S5_VICTORY.duration}
        />
      </Sequence>

      {/* S6 Punchline: frames 840 - 900 */}
      <Sequence
        from={SCENES.S6_PUNCHLINE.start}
        durationInFrames={SCENES.S6_PUNCHLINE.duration}
        name={SCENES.S6_PUNCHLINE.name}
      >
        <ScenePlaceholder
          name={SCENES.S6_PUNCHLINE.name}
          totalDuration={SCENES.S6_PUNCHLINE.duration}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
