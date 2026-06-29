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
  watermark: z.boolean().optional(),
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

export const MyComposition: React.FC<MyCompositionProps> = ({ scenes, watermark = false }) => {
  return (
    <div className="w-full h-full relative">
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

      {/* Watermark Overlay */}
      {watermark && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-around overflow-hidden select-none z-50">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-around text-white/10 text-6xl font-extrabold tracking-widest uppercase select-none"
              style={{
                transform: `rotate(-15deg) translateX(${i % 2 === 0 ? "50px" : "-50px"})`,
              }}
            >
              {[...Array(4)].map((_, j) => (
                <span key={j}>PREVIEW ONLY</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


