import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { type MotionProps } from '../types/common';

export interface ScaleOutProps extends MotionProps {
  finalScale?: number;
}

export const ScaleOut: React.FC<ScaleOutProps> = ({
  children,
  finalScale = 0,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-in-back',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const scale = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [1, finalScale],
    easing
  );

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `scale(${Math.max(0, scale)})`,
      }}
    >
      {children}
    </div>
  );
};