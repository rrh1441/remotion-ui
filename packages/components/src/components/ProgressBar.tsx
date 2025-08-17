import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateWithEasing } from '@remotion-ui/core';
import { useTheme } from '@remotion-ui/themes';

export interface ProgressBarProps {
  progress: number;
  label?: string;
  startAt?: number;
  durationInFrames?: number;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  startAt = 0,
  durationInFrames = 30,
  animated = true,
  className,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  const animatedProgress = animated
    ? interpolateWithEasing(
        frame,
        [startAt, startAt + durationInFrames],
        [0, progress],
        'ease-out'
      )
    : progress;
  
  const clampedProgress = Math.max(0, Math.min(1, animatedProgress));
  
  return (
    <div className={className}>
      {label && (
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.mutedForeground,
            marginBottom: theme.spacing[2],
          }}
        >
          {label}
        </div>
      )}
      
      <div
        style={{
          width: '100%',
          height: 8,
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedProgress * 100}%`,
            height: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.full,
            transition: animated ? 'none' : 'width 0.3s ease-out',
          }}
        />
      </div>
      
      <div
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.foreground,
          marginTop: theme.spacing[1],
          textAlign: 'right',
        }}
      >
        {Math.round(clampedProgress * 100)}%
      </div>
    </div>
  );
};