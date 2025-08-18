import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '@remotion-ui/core';

export interface DipToColorProps {
  from: React.ReactNode;
  to: React.ReactNode;
  color?: string;
  startAt?: number;
  durationInFrames?: number;
  dipDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DipToColor: React.FC<DipToColorProps> = ({
  from,
  to,
  color = '#000000',
  startAt = 0,
  durationInFrames = 30,
  dipDuration = 10,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const fadeOutEnd = startAt + Math.floor((durationInFrames - dipDuration) / 2);
  const fadeInStart = fadeOutEnd + dipDuration;
  const fadeInEnd = startAt + durationInFrames;
  
  let fromOpacity = 1;
  let toOpacity = 0;
  let dipOpacity = 0;
  
  if (frame >= startAt && frame <= fadeOutEnd) {
    fromOpacity = interpolateWithEasing(
      frame,
      [startAt, fadeOutEnd],
      [1, 0],
      'ease-in'
    );
    dipOpacity = 1 - fromOpacity;
  } else if (frame > fadeOutEnd && frame < fadeInStart) {
    fromOpacity = 0;
    toOpacity = 0;
    dipOpacity = 1;
  } else if (frame >= fadeInStart && frame <= fadeInEnd) {
    toOpacity = interpolateWithEasing(
      frame,
      [fadeInStart, fadeInEnd],
      [0, 1],
      'ease-out'
    );
    dipOpacity = 1 - toOpacity;
  } else if (frame > fadeInEnd) {
    fromOpacity = 0;
    toOpacity = 1;
    dipOpacity = 0;
  }
  
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: Math.max(0, Math.min(1, fromOpacity)),
        }}
      >
        {from}
      </div>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: color,
          opacity: Math.max(0, Math.min(1, dipOpacity)),
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: Math.max(0, Math.min(1, toOpacity)),
        }}
      >
        {to}
      </div>
    </div>
  );
};