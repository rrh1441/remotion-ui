import React, { useMemo } from 'react';
import { z } from 'zod';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AnimatedNumberProps {
  value: number;
  format?: 'number' | 'currency' | 'percent' | 'compact';
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  startAt?: number;
  locale?: string;
  currency?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedNumberSchema = z.object({
  value: z.number(),
  format: z.enum(['number', 'currency', 'percent', 'compact']).default('number'),
  duration: z.number().min(1).default(30),
  decimals: z.number().min(0).max(20).default(0),
  prefix: z.string().default(''),
  suffix: z.string().default(''),
  startAt: z.number().min(0).default(0),
  locale: z.string().default('en-US'),
  currency: z.string().default('USD'),
  className: z.string().optional(),
  style: z.record(z.any()).optional(),
});

export const getAnimatedNumberDefaults = (): AnimatedNumberProps => {
  return AnimatedNumberSchema.parse({
    value: 100
  });
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = 'number',
  duration = 30,
  decimals = 0,
  prefix = '',
  suffix = '',
  startAt = 0,
  locale = 'en-US',
  currency = 'USD',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const animatedValue = interpolate(
    frame,
    [startAt, startAt + duration],
    [0, value],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const formattedValue = useMemo(() => {
    let formatted: string;
    
    switch (format) {
      case 'currency':
        formatted = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(animatedValue);
        break;
      
      case 'percent':
        formatted = new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(animatedValue / 100);
        break;
      
      case 'compact':
        formatted = new Intl.NumberFormat(locale, {
          notation: 'compact',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(animatedValue);
        break;
      
      default:
        formatted = new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(animatedValue);
    }
    
    return `${prefix}${formatted}${suffix}`;
  }, [animatedValue, format, decimals, prefix, suffix, locale, currency]);

  return (
    <span className={className} style={style}>
      {formattedValue}
    </span>
  );
};