import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  speed?: number;
  variant?: 'circle' | 'dots' | 'bars' | 'pulse';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48,
  color = '#3b82f6',
  strokeWidth = 4,
  speed = 1,
  variant = 'circle',
  className,
}) => {
  const frame = useCurrentFrame();
  const rotation = (frame * speed * 6) % 360;

  if (variant === 'circle') {
    const dashOffset = interpolate(
      frame * speed,
      [0, 60],
      [0, -220],
      {
        extrapolateRight: 'wrap',
      }
    );

    return (
      <div className={className} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={`${color}20`}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="125.6"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48">
          {[0, 1, 2].map((i) => {
            const scale = interpolate(
              (frame * speed + i * 10) % 30,
              [0, 15, 30],
              [0.3, 1, 0.3]
            );
            return (
              <circle
                key={i}
                cx={12 + i * 12}
                cy="24"
                r="4"
                fill={color}
                opacity={scale}
                transform={`scale(${scale})`}
                transformOrigin={`${12 + i * 12} 24`}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48">
          {[0, 1, 2, 3, 4].map((i) => {
            const height = interpolate(
              (frame * speed + i * 5) % 40,
              [0, 20, 40],
              [8, 24, 8]
            );
            const y = 24 - height / 2;
            return (
              <rect
                key={i}
                x={6 + i * 8}
                y={y}
                width="4"
                height={height}
                fill={color}
                rx="2"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (variant === 'pulse') {
    const scale = interpolate(
      (frame * speed) % 60,
      [0, 30, 60],
      [1, 1.5, 1]
    );
    const opacity = interpolate(
      (frame * speed) % 60,
      [0, 30, 60],
      [1, 0.3, 1]
    );

    return (
      <div className={className} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill={color}
            opacity={opacity}
            transform={`scale(${scale})`}
            transformOrigin="24 24"
          />
        </svg>
      </div>
    );
  }

  return null;
};