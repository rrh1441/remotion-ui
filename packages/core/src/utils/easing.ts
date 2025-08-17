import { interpolate, Easing as RemotionEasing } from 'remotion';
import { type Easing } from '../types/common';

export const getEasingFunction = (easing: Easing = 'linear') => {
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

export const interpolateWithEasing = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing?: Easing
) => {
  return interpolate(frame, inputRange, outputRange, {
    easing: getEasingFunction(easing),
  });
};