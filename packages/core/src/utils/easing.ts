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
    'ease-in-quart': RemotionEasing.in(RemotionEasing.cubic),
    'ease-out-quart': RemotionEasing.out(RemotionEasing.cubic),
    'ease-in-out-quart': RemotionEasing.inOut(RemotionEasing.cubic),
    'ease-in-expo': RemotionEasing.in(RemotionEasing.exp),
    'ease-out-expo': RemotionEasing.out(RemotionEasing.exp),
    'ease-in-out-expo': RemotionEasing.inOut(RemotionEasing.exp),
    'ease-in-back': RemotionEasing.in(RemotionEasing.bezier(0.36, 0, 0.66, -0.56)),
    'ease-out-back': RemotionEasing.out(RemotionEasing.bezier(0.36, 0, 0.66, -0.56)),
    'ease-in-out-back': RemotionEasing.inOut(RemotionEasing.bezier(0.36, 0, 0.66, -0.56)),
    'ease-in-circ': RemotionEasing.in(RemotionEasing.bezier(0.55, 0, 1, 0.45)),
    'ease-out-circ': RemotionEasing.out(RemotionEasing.bezier(0.55, 0, 1, 0.45)),
    'ease-in-out-circ': RemotionEasing.inOut(RemotionEasing.bezier(0.55, 0, 1, 0.45)),
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