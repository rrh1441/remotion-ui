import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ComparisonSide {
  title: string;
  status: string;
  statusColor?: string;
  items: string[];
  backgroundColor?: string;
}

export interface ComparisonCardProps {
  left: ComparisonSide;
  right: ComparisonSide;
  vsLabel?: string;
  startAt?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  left,
  right,
  vsLabel = 'VS',
  startAt = 0,
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

  const leftSlide = interpolate(
    frame,
    [startAt + 5, startAt + 20],
    [-50, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const rightSlide = interpolate(
    frame,
    [startAt + 5, startAt + 20],
    [50, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const vsScale = interpolate(
    frame,
    [startAt + 15, startAt + 25],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const renderSide = (side: ComparisonSide, translateX: number, delay: number) => {
    const itemsOpacity = interpolate(
      frame,
      [startAt + delay, startAt + delay + 15],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    return (
      <div
        style={{
          flex: 1,
          backgroundColor: side.backgroundColor || '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          transform: `translateX(${translateX}px)`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          {side.title}
        </h3>
        
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: side.statusColor || '#10b981',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
            }}
          >
            {side.status}
          </span>
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            opacity: itemsOpacity,
          }}
        >
          {side.items.map((item, index) => {
            const itemDelay = delay + 10 + index * 3;
            const itemOpacity = interpolate(
              frame,
              [startAt + itemDelay, startAt + itemDelay + 5],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            const itemSlide = interpolate(
              frame,
              [startAt + itemDelay, startAt + itemDelay + 5],
              [10, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            return (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  opacity: itemOpacity,
                  transform: `translateX(${itemSlide}px)`,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: side.statusColor || '#10b981',
                    marginRight: '8px',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    color: '#4b5563',
                  }}
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'stretch',
        position: 'relative',
        opacity: containerOpacity,
        minHeight: '250px',
        ...style,
      }}
    >
      {renderSide(left, leftSlide, 20)}
      
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${vsScale})`,
          backgroundColor: '#1f2937',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 700,
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {vsLabel}
      </div>
      
      {renderSide(right, rightSlide, 25)}
    </div>
  );
};