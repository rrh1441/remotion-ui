import React from 'react';
import { Stagger, FadeIn, SlideIn } from '@remotion-ui/core';
import { useTheme } from '@remotion-ui/themes';

export interface ListRevealProps {
  items: string[];
  perItem?: number;
  gap?: number;
  startAt?: number;
  className?: string;
}

export const ListReveal: React.FC<ListRevealProps> = ({
  items,
  perItem = 10,
  gap = 12,
  startAt = 0,
  className,
}) => {
  const theme = useTheme();
  
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
      }}
    >
      <Stagger staggerDelay={perItem} startAt={startAt}>
        {items.map((item, index) => (
          <div key={index}>
            <SlideIn from="left" distance={30} durationInFrames={perItem}>
              <FadeIn durationInFrames={perItem}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[3],
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.primary,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.lg,
                      color: theme.colors.foreground,
                      lineHeight: theme.typography.lineHeight.normal,
                    }}
                  >
                    {item}
                  </span>
                </div>
              </FadeIn>
            </SlideIn>
          </div>
        ))}
      </Stagger>
    </div>
  );
};