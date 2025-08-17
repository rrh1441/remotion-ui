import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TimelineGateProps {
  children: React.ReactNode;
  showAfter: number;
  hideAfter?: number;
}

export const TimelineGate: React.FC<TimelineGateProps> = ({
  children,
  showAfter,
  hideAfter,
}) => {
  const frame = useCurrentFrame();
  
  const isVisible = frame >= showAfter && (!hideAfter || frame < hideAfter);
  
  if (!isVisible) {
    return null;
  }
  
  return <>{children}</>;
};