import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AnimatedNumber } from './AnimatedNumber';

export interface DataCardProps {
  title: string;
  value: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percent' | 'compact';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  startAt?: number;
  duration?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit = '',
  format = 'number',
  trend,
  trendValue,
  decimals = 0,
  prefix = '',
  suffix = '',
  startAt = 0,
  duration = 30,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  accentColor = '#3b82f6',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame,
    [startAt, startAt + 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const scale = interpolate(
    frame,
    [startAt, startAt + 15],
    [0.9, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor,
        color: textColor,
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity,
        transform: `scale(${scale})`,
        minWidth: '250px',
        ...style,
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          color: textColor,
          opacity: 0.7,
        }}
      >
        {title}
      </div>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          marginBottom: trend ? '12px' : 0,
        }}
      >
        <AnimatedNumber
          value={value}
          format={format}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          duration={duration}
          startAt={startAt}
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: accentColor,
          }}
        />
        {unit && (
          <span
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: textColor,
              opacity: 0.8,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {trend && trendValue !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            fontWeight: 500,
            color: getTrendColor(),
          }}
        >
          <span style={{ fontSize: '16px' }}>{getTrendIcon()}</span>
          <AnimatedNumber
            value={trendValue}
            format="percent"
            decimals={1}
            duration={duration}
            startAt={startAt + 10}
          />
          <span style={{ opacity: 0.8 }}>vs last period</span>
        </div>
      )}
    </div>
  );
};