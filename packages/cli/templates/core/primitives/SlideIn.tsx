import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { splitStyles, warnInDev, mergeChildStyles } from '../utils/styles';
import { type MotionProps } from '../types/common';

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

export interface SlideInProps extends MotionProps {
  from?: SlideDirection;
  distance?: number;
  /**
   * When true, the animation is applied directly to the child element
   * instead of wrapping it in a div. Requires exactly one child element.
   */
  asChild?: boolean;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  from = 'left',
  distance = 100,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out',
  className,
  style,
  asChild = false,
}) => {
  const frame = useCurrentFrame();
  
  const progress = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    easing
  );

  const getTransform = () => {
    const offset = distance * (1 - progress);
    switch (from) {
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

  const animationStyle: React.CSSProperties = {
    transform: getTransform(),
  };

  // asChild mode: merge animation with child element
  if (asChild) {
    if (!React.isValidElement(children)) {
      warnInDev.invalidChildren('SlideIn');
      return null;
    }

    if (React.Children.count(children) !== 1) {
      warnInDev.asChildMultipleChildren('SlideIn');
      return children as React.ReactElement;
    }

    const mergedStyle = { ...style, ...animationStyle };
    return mergeChildStyles(children, mergedStyle, 'SlideIn');
  }

  // Wrapper mode: split styles between wrapper and children
  const [wrapperStyle, childStyle] = splitStyles(style);

  return (
    <div
      className={className}
      style={{
        ...wrapperStyle,
        ...animationStyle,
      }}
    >
      {React.isValidElement(children) 
        ? mergeChildStyles(children, childStyle, 'SlideIn')
        : children
      }
    </div>
  );
};