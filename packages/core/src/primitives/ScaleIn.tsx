import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '../utils/easing';
import { splitStyles, warnInDev, mergeChildStyles } from '../utils/styles';
import { type MotionProps } from '../types/common';

export interface ScaleInProps extends MotionProps {
  initialScale?: number;
  /**
   * When true, the animation is applied directly to the child element
   * instead of wrapping it in a div. Requires exactly one child element.
   */
  asChild?: boolean;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  initialScale = 0,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out-back',
  className,
  style,
  asChild = false,
}) => {
  const frame = useCurrentFrame();
  
  const scale = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [initialScale, 1],
    easing
  );

  const animationStyle: React.CSSProperties = {
    transform: `scale(${Math.max(0, scale)})`,
  };

  // asChild mode: merge animation with child element
  if (asChild) {
    if (!React.isValidElement(children)) {
      warnInDev.invalidChildren('ScaleIn');
      return null;
    }

    if (React.Children.count(children) !== 1) {
      warnInDev.asChildMultipleChildren('ScaleIn');
      return children as React.ReactElement;
    }

    const mergedStyle = { ...style, ...animationStyle };
    return mergeChildStyles(children, mergedStyle, 'ScaleIn');
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
        ? mergeChildStyles(children, childStyle, 'ScaleIn')
        : children
      }
    </div>
  );
};