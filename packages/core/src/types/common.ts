import { type CSSProperties } from 'react';

export type Easing = 
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

export interface BaseAnimationProps {
  startAt?: number;
  durationInFrames?: number;
  easing?: Easing;
  className?: string;
  style?: CSSProperties;
}

export interface MotionProps extends BaseAnimationProps {
  children: React.ReactNode;
}