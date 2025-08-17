import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { type MotionProps } from '../types/common';

export interface FadeInProps extends MotionProps {}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    easing
  );

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: Math.max(0, Math.min(1, opacity)),
      }}
    >
      {children}
    </div>
  );
};