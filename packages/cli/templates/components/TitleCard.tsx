import React, { createContext, useContext, useMemo } from 'react';
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

interface ScaleInProps {
  children: React.ReactNode;
  initialScale?: number;
  startAt?: number;
  durationInFrames?: number;
  easing?: Easing;
  className?: string;
  style?: React.CSSProperties;
}

const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  initialScale = 0,
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-out-back',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const scale = interpolateWithEasing(
    frame,
    [startAt, startAt + durationInFrames],
    [initialScale, 1],
    easing
  );

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `scale(${Math.max(0, scale)})`,
      }}
    >
      {children}
    </div>
  );
};

// TitleCard component
export interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  startAt?: number;
  durationInFrames?: number;
  className?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor,
  startAt = 0,
  durationInFrames = 60,
  className,
}) => {
  const theme = useTheme();
  
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor || theme.colors.background,
        padding: theme.spacing[16],
      }}
    >
      <ScaleIn
        startAt={startAt}
        durationInFrames={Math.floor(durationInFrames * 0.6)}
        easing="ease-out-back"
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize['5xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            textAlign: 'center',
            margin: 0,
            lineHeight: theme.typography.lineHeight.tight,
          }}
        >
          {title}
        </h1>
      </ScaleIn>
      
      {subtitle && (
        <FadeIn
          startAt={startAt + 10}
          durationInFrames={Math.floor(durationInFrames * 0.4)}
        >
          <p
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.normal,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
              marginTop: theme.spacing[4],
            }}
          >
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
};