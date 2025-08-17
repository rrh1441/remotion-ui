import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { type MotionProps } from '../types/common';

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

export interface SlideOutProps extends MotionProps {
  to?: SlideDirection;
  distance?: number;
}

export const SlideOut: React.FC<SlideOutProps> = ({
  children,
  to = 'left',
  distance = 100,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-in',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const progress = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    easing
  );

  const getTransform = () => {
    const offset = distance * progress;
    switch (to) {
      case 'left':
        return `translateX(-${offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      case 'top':
        return `translateY(-${offset}px)`;
      case 'bottom':
        return `translateY(${offset}px)`;
      default:
        return 'none';
    }
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  );
};