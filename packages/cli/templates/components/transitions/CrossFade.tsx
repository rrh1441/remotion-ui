import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '@remotion-ui/core';

export interface CrossFadeProps {
  from: React.ReactNode;
  to: React.ReactNode;
  startAt?: number;
  durationInFrames?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CrossFade: React.FC<CrossFadeProps> = ({
  from,
  to,
  startAt = 0,
  durationInFrames = 30,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const progress = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    'ease-in-out'
  );
  
  const fromOpacity = 1 - progress;
  const toOpacity = progress;
  
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
          opacity: Math.max(0, Math.min(1, toOpacity)),
        }}
      >
        {to}
      </div>
    </div>
  );
};