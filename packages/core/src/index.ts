// Motion Primitives
export { FadeIn, type FadeInProps } from './primitives/FadeIn';
export { FadeOut, type FadeOutProps } from './primitives/FadeOut';
export { SlideIn, type SlideInProps, type SlideDirection } from './primitives/SlideIn';
export { SlideOut, type SlideOutProps } from './primitives/SlideOut';
export { ScaleIn, type ScaleInProps } from './primitives/ScaleIn';
export { ScaleOut, type ScaleOutProps } from './primitives/ScaleOut';

// Layout Primitives
export { Stack, type StackProps } from './primitives/Stack';
export { Stagger, type StaggerProps } from './primitives/Stagger';
export { TimelineGate, type TimelineGateProps } from './primitives/TimelineGate';

// Utils
export { getEasingFunction, interpolateWithEasing } from './utils/easing';
export { splitStyles, layoutKeys, mergeChildStyles } from './utils/styles';

// Types
export type {
  Easing,
  BaseAnimationProps,
  MotionProps,
} from './types/common';