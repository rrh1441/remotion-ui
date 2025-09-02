import React from 'react';
import { Stack, Stagger } from '@remotion-ui/core';
import { StatBlock, type StatBlockProps } from './StatBlock';

export interface KPIStripProps {
  items: StatBlockProps[];
  gap?: number;
  startAt?: number;
  staggerDelay?: number;
  className?: string;
}

export const KPIStrip: React.FC<KPIStripProps> = ({
  items,
  gap = 16,
  startAt = 0,
  staggerDelay = 5,
  className,
}) => {
  return (
    <Stack
      direction="row"
      gap={gap}
      justify="center"
      align="stretch"
      {...(className && { className })}
      wrap
    >
      <Stagger staggerDelay={staggerDelay} startAt={startAt}>
        {items.map((item, index) => (
          <StatBlock key={index} {...item} />
        ))}
      </Stagger>
    </Stack>
  );
};