import React from 'react';
import { ScaleIn } from '@remotion-ui/core';
import { useTheme } from '@remotion-ui/themes';

export interface StatBlockProps {
  value: string | number;
  label: string;
  delta?: {
    value: number;
    direction: 'up' | 'down';
  };
  iconId?: string;
  startAt?: number;
  durationInFrames?: number;
  className?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  value,
  label,
  delta,
  iconId,
  startAt = 0,
  durationInFrames = 30,
  className,
}) => {
  const theme = useTheme();
  
  const deltaColor = delta?.direction === 'up' 
    ? theme.colors.success 
    : theme.colors.destructive;
  
  const deltaSymbol = delta?.direction === 'up' ? '↑' : '↓';
  
  return (
    <ScaleIn
      startAt={startAt}
      durationInFrames={durationInFrames}
      initialScale={0.8}
      className={className}
    >
      <div
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          padding: theme.spacing[6],
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          minWidth: 200,
        }}
      >
        {iconId && (
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
              marginBottom: theme.spacing[3],
            }}
          />
        )}
        
        <div
          style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            lineHeight: theme.typography.lineHeight.tight,
          }}
        >
          {value}
        </div>
        
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.mutedForeground,
            marginTop: theme.spacing[1],
          }}
        >
          {label}
        </div>
        
        {delta && (
          <div
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: deltaColor,
              marginTop: theme.spacing[2],
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1],
            }}
          >
            <span>{deltaSymbol}</span>
            <span>{Math.abs(delta.value)}%</span>
          </div>
        )}
      </div>
    </ScaleIn>
  );
};