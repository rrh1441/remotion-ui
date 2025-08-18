import React, { useMemo } from 'react';
import { useCurrentFrame, random } from 'remotion';

export interface TextGlitchProps {
  text: string;
  intensity?: number; // 0 to 1
  glitchDuration?: number; // frames
  startAt?: number;
  style?: 'cyber' | 'vhs' | 'matrix' | 'digital';
  colors?: string[];
  className?: string;
  textStyle?: React.CSSProperties;
}

export const TextGlitch: React.FC<TextGlitchProps> = ({
  text,
  intensity = 0.7,
  glitchDuration = 10,
  startAt = 0,
  style = 'cyber',
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  className,
  textStyle,
}) => {
  const frame = useCurrentFrame();
  
  const isGlitching = frame >= startAt && frame < startAt + glitchDuration;
  
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789';
  
  const glitchedText = useMemo(() => {
    if (!isGlitching) return text;
    
    return text.split('').map((char, index) => {
      const shouldGlitch = random(`glitch-${frame}-${index}`) < intensity;
      
      if (shouldGlitch && char !== ' ') {
        const randomIndex = Math.floor(random(`char-${frame}-${index}`) * glitchChars.length);
        return glitchChars[randomIndex];
      }
      
      return char;
    }).join('');
  }, [text, isGlitching, frame, intensity, glitchChars]);

  const getGlitchStyles = (): React.CSSProperties => {
    if (!isGlitching) return {};
    
    const offset = random(`offset-${frame}`) * 10 - 5;
    const skew = random(`skew-${frame}`) * 5 - 2.5;
    const scale = 1 + (random(`scale-${frame}`) * 0.1 - 0.05);
    
    switch (style) {
      case 'vhs':
        return {
          filter: `blur(${random(`blur-${frame}`) * 2}px) contrast(${1 + random(`contrast-${frame}`) * 2})`,
          transform: `translateX(${offset}px) scaleX(${scale})`,
          textShadow: `
            ${offset * 0.5}px 0 ${colors[0]},
            ${-offset * 0.5}px 0 ${colors[1]}
          `,
        };
      
      case 'matrix':
        return {
          color: colors[Math.floor(random(`color-${frame}`) * colors.length)],
          transform: `translateY(${offset}px)`,
          filter: `brightness(${1 + random(`brightness-${frame}`) * 2})`,
        };
      
      case 'digital':
        return {
          transform: `translateX(${offset}px) skewX(${skew}deg)`,
          opacity: 0.8 + random(`opacity-${frame}`) * 0.2,
          filter: `hue-rotate(${random(`hue-${frame}`) * 360}deg)`,
        };
      
      case 'cyber':
      default:
        return {
          textShadow: `
            ${offset * 0.5}px ${offset * 0.5}px 0 ${colors[0]},
            ${-offset * 0.5}px ${offset * 0.5}px 0 ${colors[1]},
            ${offset * 0.5}px ${-offset * 0.5}px 0 ${colors[2]}
          `,
          transform: `translateX(${offset}px) translateY(${offset * 0.5}px) skewX(${skew}deg)`,
        };
    }
  };

  const glitchOverlays = useMemo(() => {
    if (!isGlitching || style !== 'cyber') return null;
    
    return (
      <>
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: colors[0],
            opacity: random(`overlay1-${frame}`) * 0.7,
            transform: `translateX(${random(`x1-${frame}`) * 4 - 2}px)`,
            mixBlendMode: 'screen',
            ...textStyle,
          }}
        >
          {glitchedText}
        </span>
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: colors[1],
            opacity: random(`overlay2-${frame}`) * 0.7,
            transform: `translateX(${random(`x2-${frame}`) * -4 + 2}px)`,
            mixBlendMode: 'screen',
            ...textStyle,
          }}
        >
          {glitchedText}
        </span>
      </>
    );
  }, [isGlitching, style, colors, frame, glitchedText, textStyle]);

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {glitchOverlays}
      <span
        style={{
          position: 'relative',
          ...textStyle,
          ...getGlitchStyles(),
        }}
      >
        {glitchedText}
      </span>
    </span>
  );
};