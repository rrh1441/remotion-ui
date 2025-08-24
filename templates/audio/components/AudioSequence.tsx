import React, { useMemo } from 'react';
import {
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from 'remotion';

export interface AudioSegment {
  id: string;
  src: string;
  startFrame: number;
  durationInFrames?: number;
  volume?: number | ((frame: number) => number);
  fadeInFrames?: number;
  fadeOutFrames?: number;
  trim?: {
    start?: number;
    end?: number;
  };
}

export interface AudioSequenceProps {
  segments: AudioSegment[];
  masterVolume?: number;
  crossfadeDuration?: number;
  children?: React.ReactNode;
  onSegmentStart?: (segment: AudioSegment) => void;
  onSegmentEnd?: (segment: AudioSegment) => void;
}

export const AudioSequence: React.FC<AudioSequenceProps> = ({
  segments,
  masterVolume = 1,
  crossfadeDuration = 0,
  children,
  onSegmentStart,
  onSegmentEnd,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const processedSegments = useMemo(() => {
    return segments.map((segment, index) => {
      const nextSegment = segments[index + 1];
      const shouldCrossfade = crossfadeDuration > 0 && nextSegment;
      
      let effectiveDuration = segment.durationInFrames;
      
      if (shouldCrossfade && effectiveDuration) {
        const crossfadeFrames = Math.floor((crossfadeDuration * fps) / 1000);
        const overlap = Math.min(crossfadeFrames, effectiveDuration / 2);
        effectiveDuration = effectiveDuration + overlap;
      }

      return {
        ...segment,
        effectiveDuration,
      };
    });
  }, [segments, crossfadeDuration, fps]);

  const activeSegment = useMemo(() => {
    return processedSegments.find(segment => {
      const endFrame = segment.startFrame + (segment.effectiveDuration || Infinity);
      return frame >= segment.startFrame && frame < endFrame;
    });
  }, [processedSegments, frame]);

  React.useEffect(() => {
    if (activeSegment) {
      const isFirstFrame = frame === activeSegment.startFrame;
      const isLastFrame = activeSegment.effectiveDuration && 
        frame === activeSegment.startFrame + activeSegment.effectiveDuration - 1;

      if (isFirstFrame && onSegmentStart) {
        onSegmentStart(activeSegment);
      }
      if (isLastFrame && onSegmentEnd) {
        onSegmentEnd(activeSegment);
      }
    }
  }, [activeSegment, frame, onSegmentStart, onSegmentEnd]);

  return (
    <>
      {processedSegments.map((segment, index) => {
        const volume = typeof segment.volume === 'function' 
          ? segment.volume 
          : () => segment.volume || 1;

        const nextSegment = processedSegments[index + 1];
        const prevSegment = processedSegments[index - 1];

        return (
          <Sequence
            key={segment.id}
            from={segment.startFrame}
            durationInFrames={segment.effectiveDuration}
          >
            <AudioSegmentPlayer
              segment={segment}
              masterVolume={masterVolume}
              volume={volume}
              crossfadeDuration={crossfadeDuration}
              isFirstSegment={index === 0}
              isLastSegment={index === segments.length - 1}
              prevSegment={prevSegment}
              nextSegment={nextSegment}
            />
          </Sequence>
        );
      })}
      {children}
    </>
  );
};

interface AudioSegmentPlayerProps {
  segment: AudioSegment & { effectiveDuration?: number };
  masterVolume: number;
  volume: (frame: number) => number;
  crossfadeDuration: number;
  isFirstSegment: boolean;
  isLastSegment: boolean;
  prevSegment?: AudioSegment & { effectiveDuration?: number };
  nextSegment?: AudioSegment & { effectiveDuration?: number };
}

const AudioSegmentPlayer: React.FC<AudioSegmentPlayerProps> = ({
  segment,
  masterVolume,
  volume,
  crossfadeDuration,
  isFirstSegment,
  isLastSegment,
  prevSegment,
  nextSegment,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const calculatedVolume = useMemo(() => {
    let vol = volume(frame) * masterVolume;

    if (segment.fadeInFrames && frame < segment.fadeInFrames) {
      vol *= interpolate(frame, [0, segment.fadeInFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    if (segment.effectiveDuration && segment.fadeOutFrames) {
      const fadeOutStart = segment.effectiveDuration - segment.fadeOutFrames;
      if (frame >= fadeOutStart) {
        vol *= interpolate(
          frame,
          [fadeOutStart, segment.effectiveDuration],
          [1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );
      }
    }

    if (crossfadeDuration > 0) {
      const crossfadeFrames = Math.floor((crossfadeDuration * fps) / 1000);

      if (!isFirstSegment && frame < crossfadeFrames) {
        vol *= interpolate(frame, [0, crossfadeFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }

      if (!isLastSegment && segment.effectiveDuration) {
        const fadeStart = segment.effectiveDuration - crossfadeFrames;
        if (frame >= fadeStart) {
          vol *= interpolate(
            frame,
            [fadeStart, segment.effectiveDuration],
            [1, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
        }
      }
    }

    return vol;
  }, [
    frame,
    volume,
    masterVolume,
    segment,
    crossfadeDuration,
    fps,
    isFirstSegment,
    isLastSegment,
  ]);

  const audioSrc = useMemo(() => {
    try {
      return staticFile(segment.src);
    } catch {
      return segment.src;
    }
  }, [segment.src]);

  return (
    <Audio
      src={audioSrc}
      volume={calculatedVolume}
      startFrom={segment.trim?.start}
      endAt={segment.trim?.end}
    />
  );
};

export interface AudioMarker {
  frame: number;
  label: string;
  onReached?: () => void;
}

export interface AudioTimelineProps {
  markers: AudioMarker[];
  children: React.ReactNode;
}

export const AudioTimeline: React.FC<AudioTimelineProps> = ({
  markers,
  children,
}) => {
  const frame = useCurrentFrame();

  React.useEffect(() => {
    const currentMarker = markers.find(m => m.frame === frame);
    if (currentMarker?.onReached) {
      currentMarker.onReached();
    }
  }, [frame, markers]);

  return <>{children}</>;
};