import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Easing, staticFile } from "remotion";

interface CinematicFrameProps {
  src: string;
  title: string;
  description: string;
  panDirection?: "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
}

export const CinematicFrame: React.FC<CinematicFrameProps> = ({
  src,
  title,
  description,
  panDirection = "left-to-right",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns zoom effect: 1.05 to 1.15
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Ken Burns pan effect depending on direction
  const panX = interpolate(
    frame,
    [0, durationInFrames],
    panDirection === "left-to-right"
      ? [-20, 20]
      : panDirection === "right-to-left"
      ? [20, -20]
      : [0, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.ease) }
  );

  const panY = interpolate(
    frame,
    [0, durationInFrames],
    panDirection === "top-to-bottom"
      ? [-20, 20]
      : panDirection === "bottom-to-top"
      ? [20, -20]
      : [0, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.ease) }
  );

  // Overlay fade and slide-up timing
  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textTranslateY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill className="overflow-hidden bg-black flex items-center justify-center">
      {/* Background image with Ken Burns effect */}
      <div
        className="w-full h-full"
        style={{
          scale: scale,
          translate: `${panX}px ${panY}px`,
        }}
      >
        <Img
          src={staticFile(src)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Elegant overlay gradient at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {/* Information Overlay Box */}
      <div
        className="absolute bottom-16 left-16 right-16 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10"
        style={{
          opacity: textOpacity,
          translate: `0px ${textTranslateY}px`,
        }}
      >
        <h1 className="text-white text-4xl font-bold tracking-tight mb-2 font-sans">
          {title}
        </h1>
        <p className="text-white/80 text-xl font-medium font-sans">
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};
