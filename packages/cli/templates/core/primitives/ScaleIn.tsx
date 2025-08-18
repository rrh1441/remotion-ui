import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { type MotionProps } from '../types/common';

export interface ScaleInProps extends MotionProps {
  initialScale?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  initialScale = 0,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out-back',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const scale = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [initialScale, 1],
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