import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export type PushDirection = 'left' | 'right' | 'up' | 'down';

export interface PushProps {
  from: React.ReactNode;
  to: React.ReactNode;
  direction?: PushDirection;
  startAt?: number;
  durationInFrames?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export const Push: React.FC<PushProps> = ({
  from,
  to,
  direction = 'left',
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-in-out',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const relativeFrame = frame - startAt;
  
  if (relativeFrame < 0) {
    return <>{from}</>;
  }
  
  if (relativeFrame >= durationInFrames) {
    return <>{to}</>;
  }

  const getEasingProgress = (progress: number): number => {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'linear':
      default:
        return progress;
    }
  };

  const linearProgress = relativeFrame / durationInFrames;
  const progress = getEasingProgress(linearProgress);

  const getTransform = (isFrom: boolean): React.CSSProperties => {
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case 'left':
        translateX = isFrom 
          ? interpolate(progress, [0, 1], [0, -width])
          : interpolate(progress, [0, 1], [width, 0]);
        break;
      case 'right':
        translateX = isFrom
          ? interpolate(progress, [0, 1], [0, width])
          : interpolate(progress, [0, 1], [-width, 0]);
        break;
      case 'up':
        translateY = isFrom
          ? interpolate(progress, [0, 1], [0, -height])
          : interpolate(progress, [0, 1], [height, 0]);
        break;
      case 'down':
        translateY = isFrom
          ? interpolate(progress, [0, 1], [0, height])
          : interpolate(progress, [0, 1], [-height, 0]);
        break;
    }

    return {
      transform: `translate(${translateX}px, ${translateY}px)`,
    };
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  const sceneStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  const fromStyle: React.CSSProperties = {
    ...sceneStyle,
    ...getTransform(true),
  };

  const toStyle: React.CSSProperties = {
    ...sceneStyle,
    ...getTransform(false),
  };

  return (
    <div style={containerStyle}>
      <div style={fromStyle}>
        {from}
      </div>
      <div style={toStyle}>
        {to}
      </div>
    </div>
  );
};