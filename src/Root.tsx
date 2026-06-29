import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { MyComposition, MyCompositionSchema, defaultScenes, MyCompositionProps } from "./Composition";

const calculateMetadata: CalculateMetadataFunction<MyCompositionProps> = async ({ props }) => {
  const scenesCount = props.scenes?.length || defaultScenes.length;
  // Calculate total frames: scenes * 150 frames minus overlapping transition duration (30 frames per transition)
  const durationInFrames = scenesCount * 150 - (scenesCount - 1) * 30;

  return {
    durationInFrames,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
        schema={MyCompositionSchema}
        defaultProps={{
          scenes: defaultScenes,
        }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};

