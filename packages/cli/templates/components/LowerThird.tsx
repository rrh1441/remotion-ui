import React, { createContext, useContext } from 'react';
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

type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

interface SpacingTokens {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

interface Theme {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
}

// Default theme
const defaultTheme: Theme = {
  colors: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    popover: '#ffffff',
    popoverForeground: '#0a0a0a',
    primary: '#18181b',
    primaryForeground: '#fafafa',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',
    destructiveForeground: '#fafafa',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#18181b',
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
    40: '160px',
    48: '192px',
    56: '224px',
    64: '256px',
  },
  radius: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },
};

// Theme context
interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context.theme;
};

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

// Animation components
interface SlideInProps {
  children: React.ReactNode;
  from?: SlideDirection;
  distance?: number;
  startAt?: number;
  durationInFrames?: number;
  easing?: Easing;
  className?: string;
  style?: React.CSSProperties;
}

const SlideIn: React.FC<SlideInProps> = ({
  children,
  from = 'left',
  distance = 100,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out',
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

interface FadeInProps {
  children: React.ReactNode;
  startAt?: number;
  durationInFrames?: number;
  easing?: Easing;
  className?: string;
  style?: React.CSSProperties;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [0, 1],
    easing
  );

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: Math.max(0, Math.min(1, opacity)),
      }}
    >
      {children}
    </div>
  );
};

// LowerThird component
export interface LowerThirdProps {
  primary: string;
  secondary?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  startAt?: number;
  durationInFrames?: number;
  className?: string;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  primary,
  secondary,
  align = 'left',
  width = 600,
  startAt = 0,
  durationInFrames = 30,
  className,
}) => {
  const theme = useTheme();
  
  const getAlignment = () => {
    switch (align) {
      case 'center':
        return { left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { right: theme.spacing[8] };
      default:
        return { left: theme.spacing[8] };
    }
  };
  
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: theme.spacing[16],
        ...getAlignment(),
        width,
        maxWidth: `calc(100% - ${theme.spacing[16]})`,
      }}
    >
      <SlideIn
        from="bottom"
        distance={50}
        startAt={startAt}
        durationInFrames={durationInFrames}
      >
        <div
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            padding: theme.spacing[4],
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }}
        >
          <FadeIn startAt={startAt + 5} durationInFrames={durationInFrames - 5}>
            <h3
              style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.foreground,
                margin: 0,
                textAlign: align,
              }}
            >
              {primary}
            </h3>
            {secondary && (
              <p
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.normal,
                  color: theme.colors.mutedForeground,
                  margin: 0,
                  marginTop: theme.spacing[1],
                  textAlign: align,
                }}
              >
                {secondary}
              </p>
            )}
          </FadeIn>
        </div>
      </SlideIn>
    </div>
  );
};