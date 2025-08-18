import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface WordStaggerProps {
  text: string;
  staggerDelay?: number; // frames between each word
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';
  startAt?: number;
  duration?: number; // animation duration per word
  separator?: string | RegExp;
  className?: string;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}

export const WordStagger: React.FC<WordStaggerProps> = ({
  text,
  staggerDelay = 5,
  animation = 'slideUp',
  startAt = 0,
  duration = 15,
  separator = ' ',
  className,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(separator);

  const getAnimationStyles = (wordIndex: number): React.CSSProperties => {
    const wordStartAt = startAt + wordIndex * staggerDelay;
    const progress = interpolate(
      frame,
      [wordStartAt, wordStartAt + duration],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    const opacity = progress;

    switch (animation) {
      case 'fadeIn':
        return {
          opacity,
        };
      
      case 'slideUp':
        return {
          opacity,
          transform: `translateY(${(1 - progress) * 20}px)`,
        };
      
      case 'slideDown':
        return {
          opacity,
          transform: `translateY(${(1 - progress) * -20}px)`,
        };
      
      case 'slideLeft':
        return {
          opacity,
          transform: `translateX(${(1 - progress) * 20}px)`,
        };
      
      case 'slideRight':
        return {
          opacity,
          transform: `translateX(${(1 - progress) * -20}px)`,
        };
      
      case 'scaleIn':
        return {
          opacity,
          transform: `scale(${0.5 + progress * 0.5})`,
        };
      
      case 'rotateIn':
        return {
          opacity,
          transform: `rotate(${(1 - progress) * 180}deg) scale(${0.5 + progress * 0.5})`,
        };
      
      default:
        return {
          opacity,
        };
    }
  };

  return (
    <span className={className} style={{ display: 'inline-block', ...style }}>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            marginRight: index < words.length - 1 ? '0.25em' : 0,
            ...getAnimationStyles(index),
            ...wordStyle,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};