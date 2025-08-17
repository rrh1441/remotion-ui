import React from 'react';
import { useCurrentFrame, interpolate, Easing as RemotionEasing } from 'remotion';

// Types
type Easing = 
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quart'
  | 'ease-out-quart'
  | 'ease-in-out-quart'
  | 'ease-in-expo'
  | 'ease-out-expo'
  | 'ease-in-out-expo'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-out-back'
  | 'ease-in-circ'
  | 'ease-out-circ'
  | 'ease-in-out-circ';

// Easing utilities
const getEasingFunction = (easing: Easing = 'linear') => {
  const easingMap: Record<Easing, (t: number) => number> = {
    'linear': RemotionEasing.linear,
    'ease-in': RemotionEasing.in(RemotionEasing.ease),
    'ease-out': RemotionEasing.out(RemotionEasing.ease),
    'ease-in-out': RemotionEasing.inOut(RemotionEasing.ease),
    'ease-in-quad': RemotionEasing.in(RemotionEasing.quad),
    'ease-out-quad': RemotionEasing.out(RemotionEasing.quad),
    'ease-in-out-quad': RemotionEasing.inOut(RemotionEasing.quad),
    'ease-in-cubic': RemotionEasing.in(RemotionEasing.cubic),
    'ease-out-cubic': RemotionEasing.out(RemotionEasing.cubic),
    'ease-in-out-cubic': RemotionEasing.inOut(RemotionEasing.cubic),
    'ease-in-quart': RemotionEasing.in(RemotionEasing.quart),
    'ease-out-quart': RemotionEasing.out(RemotionEasing.quart),
    'ease-in-out-quart': RemotionEasing.inOut(RemotionEasing.quart),
    'ease-in-expo': RemotionEasing.in(RemotionEasing.exp),
    'ease-out-expo': RemotionEasing.out(RemotionEasing.exp),
    'ease-in-out-expo': RemotionEasing.inOut(RemotionEasing.exp),
    'ease-in-back': RemotionEasing.in(RemotionEasing.back),
    'ease-out-back': RemotionEasing.out(RemotionEasing.back),
    'ease-in-out-back': RemotionEasing.inOut(RemotionEasing.back),
    'ease-in-circ': RemotionEasing.in(RemotionEasing.circ),
    'ease-out-circ': RemotionEasing.out(RemotionEasing.circ),
    'ease-in-out-circ': RemotionEasing.inOut(RemotionEasing.circ),
  };

  return easingMap[easing] || RemotionEasing.linear;
};

const interpolateWithEasing = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing?: Easing
) => {
  return interpolate(frame, inputRange, outputRange, {
    easing: getEasingFunction(easing),
  });
};

// DipToColor component
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