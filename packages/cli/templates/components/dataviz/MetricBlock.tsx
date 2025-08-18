import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AnimatedNumber } from './AnimatedNumber';

export interface Metric {
  label: string;
  value: number | string;
  highlight?: boolean;
  format?: 'number' | 'currency' | 'percent' | 'compact' | 'text';
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export interface MetricBlockProps {
  metrics: Metric[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  animationStyle?: 'countUp' | 'fadeIn' | 'slideIn';
  columns?: number;
  startAt?: number;
  staggerDelay?: number;
  backgroundColor?: string;
  textColor?: string;
  highlightColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MetricBlock: React.FC<MetricBlockProps> = ({
  metrics,
  layout = 'horizontal',
  animationStyle = 'countUp',
  columns = 2,
  startAt = 0,
  staggerDelay = 5,
  backgroundColor = '#ffffff',
  textColor = '#374151',
  highlightColor = '#3b82f6',
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  const containerOpacity = interpolate(
    frame,
    [startAt, startAt + 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const getLayoutStyles = (): React.CSSProperties => {
    switch (layout) {
      case 'vertical':
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        };
      case 'grid':
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
        };
      default: // horizontal
        return {
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          flexWrap: 'wrap',
        };
    }
  };

  const renderMetric = (metric: Metric, index: number) => {
    const metricStartAt = startAt + index * staggerDelay;
    
    const metricOpacity = interpolate(
      frame,
      [metricStartAt, metricStartAt + 10],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    let transform = '';
    if (animationStyle === 'slideIn') {
      const slide = interpolate(
        frame,
        [metricStartAt, metricStartAt + 15],
        [20, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      );
      transform = `translateY(${slide}px)`;
    }

    const scale = animationStyle === 'fadeIn' ? interpolate(
      frame,
      [metricStartAt, metricStartAt + 15],
      [0.8, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    ) : 1;

    const isNumeric = typeof metric.value === 'number';

    return (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: metric.highlight ? '16px' : '8px',
          backgroundColor: metric.highlight ? `${highlightColor}10` : 'transparent',
          borderRadius: metric.highlight ? '8px' : '0',
          border: metric.highlight ? `2px solid ${highlightColor}` : 'none',
          opacity: metricOpacity,
          transform: `${transform} scale(${scale})`,
          flex: layout === 'horizontal' ? '1 1 auto' : undefined,
          minWidth: layout === 'horizontal' ? '120px' : undefined,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: metric.color || textColor,
            opacity: 0.7,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {metric.label}
        </div>
        
        <div
          style={{
            fontSize: metric.highlight ? '28px' : '24px',
            fontWeight: metric.highlight ? 700 : 600,
            color: metric.highlight ? highlightColor : (metric.color || textColor),
          }}
        >
          {isNumeric && animationStyle === 'countUp' ? (
            <AnimatedNumber
              value={metric.value as number}
              format={metric.format as any || 'number'}
              decimals={metric.decimals || 0}
              prefix={metric.prefix || ''}
              suffix={metric.suffix || ''}
              duration={30}
              startAt={metricStartAt}
            />
          ) : (
            <span>
              {metric.prefix || ''}
              {metric.value}
              {metric.suffix || ''}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor,
        padding: '24px',
        borderRadius: '12px',
        opacity: containerOpacity,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        ...getLayoutStyles(),
        ...style,
      }}
    >
      {metrics.map((metric, index) => renderMetric(metric, index))}
    </div>
  );
};