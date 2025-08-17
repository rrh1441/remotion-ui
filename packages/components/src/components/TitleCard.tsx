import React from 'react';
import { FadeIn, ScaleIn } from '@remotion-ui/core';
import { useTheme } from '@remotion-ui/themes';

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