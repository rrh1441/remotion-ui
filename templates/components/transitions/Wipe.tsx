import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export type WipeDirection = 'left' | 'right' | 'up' | 'down' | 'diagonal-tl' | 'diagonal-tr' | 'diagonal-bl' | 'diagonal-br';

export interface WipeProps {
  from: React.ReactNode;
  to: React.ReactNode;
  direction?: WipeDirection;
  startAt?: number;
  durationInFrames?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  blur?: boolean;
}

export const Wipe: React.FC<WipeProps> = ({
  from,
  to,
  direction = 'right',
  startAt = 0,
  durationInFrames = 30,
  easing = 'ease-in-out',
  blur = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const relativeFrame = frame - startAt;
  
  if (relativeFrame < 0) {
    return <>{from}</>;
  }
  
  if (relativeFrame >= durationInFrames) {
    return <>{to}</>;
  }

  const getEasingProgress = (progress: number): number => {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'linear':
      default:
        return progress;
    }
  };

  const linearProgress = relativeFrame / durationInFrames;
  const progress = getEasingProgress(linearProgress);

  const getClipPath = (): string => {
    const p = progress * 100;
    
    switch (direction) {
      case 'right':
        return `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
      case 'left':
        return `polygon(${100 - p}% 0, 100% 0, 100% 100%, ${100 - p}% 100%)`;
      case 'down':
        return `polygon(0 0, 100% 0, 100% ${p}%, 0 ${p}%)`;
      case 'up':
        return `polygon(0 ${100 - p}%, 100% ${100 - p}%, 100% 100%, 0 100%)`;
      case 'diagonal-tl':
        return `polygon(0 0, ${p}% 0, 0 ${p}%)`;
      case 'diagonal-tr':
        return `polygon(${100 - p}% 0, 100% 0, 100% ${p}%)`;
      case 'diagonal-bl':
        return `polygon(0 ${100 - p}%, ${p}% 100%, 0 100%)`;
      case 'diagonal-br':
        return `polygon(100% ${100 - p}%, 100% 100%, ${100 - p}% 100%)`;
      default:
        return `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
    }
  };

  const getBlurAmount = (): number => {
    if (!blur) return 0;
    const blurProgress = Math.sin(progress * Math.PI);
    return blurProgress * 8;
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  const sceneStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  const fromStyle: React.CSSProperties = {
    ...sceneStyle,
    filter: blur ? `blur(${getBlurAmount()}px)` : 'none',
  };

  const toStyle: React.CSSProperties = {
    ...sceneStyle,
    clipPath: getClipPath(),
    WebkitClipPath: getClipPath(),
  };

  const edgeGlowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: getEdgeGradient(),
    opacity: 0.3,
    mixBlendMode: 'screen',
  };

  function getEdgeGradient(): string {
    const offset = 2;
    const p = progress * 100;
    
    switch (direction) {
      case 'right':
        return `linear-gradient(to right, transparent ${p - offset}%, rgba(255, 255, 255, 0.8) ${p}%, transparent ${p + offset}%)`;
      case 'left':
        return `linear-gradient(to left, transparent ${p - offset}%, rgba(255, 255, 255, 0.8) ${p}%, transparent ${p + offset}%)`;
      case 'down':
        return `linear-gradient(to bottom, transparent ${p - offset}%, rgba(255, 255, 255, 0.8) ${p}%, transparent ${p + offset}%)`;
      case 'up':
        return `linear-gradient(to top, transparent ${p - offset}%, rgba(255, 255, 255, 0.8) ${p}%, transparent ${p + offset}%)`;
      default:
        return 'none';
    }
  }

  return (
    <div style={containerStyle}>
      <div style={fromStyle}>
        {from}
      </div>
      <div style={toStyle}>
        {to}
      </div>
      {blur && !direction.includes('diagonal') && (
        <div style={edgeGlowStyle} />
      )}
    </div>
  );
};