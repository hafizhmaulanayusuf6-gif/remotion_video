import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { BugTerakhir } from "./bug-terakhir/BugTerakhir";
import { COMPOSITION_CONFIG } from "./bug-terakhir/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id={COMPOSITION_CONFIG.id}
        component={BugTerakhir}
        durationInFrames={COMPOSITION_CONFIG.durationInFrames}
        fps={COMPOSITION_CONFIG.fps}
        width={COMPOSITION_CONFIG.width}
        height={COMPOSITION_CONFIG.height}
      />
    </>
  );
};
