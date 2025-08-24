import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { splitStyles, warnInDev, mergeChildStyles } from '../utils/styles';
import { type MotionProps } from '../types/common';

export interface FadeInProps extends MotionProps {
  /**
   * When true, the animation is applied directly to the child element
   * instead of wrapping it in a div. Requires exactly one child element.
   */
  asChild?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out',
  className,
  style,
  asChild = false,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    easing
  );

  const animationStyle: React.CSSProperties = {
    opacity: Math.max(0, Math.min(1, opacity)),
  };

  // asChild mode: merge animation with child element
  if (asChild) {
    if (!React.isValidElement(children)) {
      warnInDev.invalidChildren('FadeIn');
      return null;
    }

    if (React.Children.count(children) !== 1) {
      warnInDev.asChildMultipleChildren('FadeIn');
      return children as React.ReactElement;
    }

    const mergedStyle = { ...style, ...animationStyle };
    return mergeChildStyles(children, mergedStyle, 'FadeIn');
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
        ? mergeChildStyles(children, childStyle, 'FadeIn')
        : children
      }
    </div>
  );
};