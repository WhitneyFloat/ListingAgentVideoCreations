import { z } from "zod";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { CinematicFrame } from "./CinematicFrame";

export const SceneSchema = z.object({
  src: z.string(),
  title: z.string(),
  description: z.string(),
  panDirection: z.enum(["left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"]).optional(),
});

export const MyCompositionSchema = z.object({
  scenes: z.array(SceneSchema),
});

export type MyCompositionProps = z.infer<typeof MyCompositionSchema>;

export const defaultScenes = [
  {
    src: "assets/media__1782768140498.png",
    title: "Welcome to Your Future Home",
    description: "Stunning modern architecture and landscape.",
    panDirection: "left-to-right" as const,
  },
  {
    src: "assets/media__1782768140851.jpg",
    title: "Spacious Living Room",
    description: "Bright open-concept design perfect for entertaining.",
    panDirection: "right-to-left" as const,
  },
  {
    src: "assets/media__1782768140877.jpg",
    title: "Elegant Kitchen & Island",
    description: "Premium countertops and custom cabinetry.",
    panDirection: "bottom-to-top" as const,
  },
  {
    src: "assets/media__1782768140904.jpg",
    title: "Comfortable Living Space",
    description: "Cozy layout with excellent natural lighting.",
    panDirection: "top-to-bottom" as const,
  },
  {
    src: "assets/media__1782768140912.jpg",
    title: "Serene Backyard Patio",
    description: "Unwind under the gorgeous sunset sky.",
    panDirection: "left-to-right" as const,
  },
];

export const MyComposition: React.FC<MyCompositionProps> = ({ scenes }) => {
  return (
    <TransitionSeries>
      {scenes.map((scene, idx) => {
        const sequence = (
          <TransitionSeries.Sequence key={`seq-${idx}`} durationInFrames={150}>
            <CinematicFrame
              src={scene.src}
              title={scene.title}
              description={scene.description}
              panDirection={scene.panDirection}
            />
          </TransitionSeries.Sequence>
        );

        if (idx === scenes.length - 1) {
          return [sequence];
        }

        return [
          sequence,
          <TransitionSeries.Transition
            key={`trans-${idx}`}
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 30 })}
          />,
        ];
      }).flat()}
    </TransitionSeries>
  );
};


