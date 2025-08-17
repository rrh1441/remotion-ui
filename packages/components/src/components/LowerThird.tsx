import React from 'react';
import { SlideIn, FadeIn } from '@remotion-ui/core';
import { useTheme } from '@remotion-ui/themes';

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