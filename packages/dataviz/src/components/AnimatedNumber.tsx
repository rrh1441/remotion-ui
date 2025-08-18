import React, { useMemo } from 'react';
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