import React, { useMemo } from 'react';
import { Audio, useCurrentFrame, staticFile } from 'remotion';

export interface TypeWriterProps {
  text: string;
  speed?: number; // characters per frame
  startAt?: number;
  cursor?: boolean;
  cursorStyle?: 'bar' | 'underscore' | 'block';
  cursorBlinkSpeed?: number;
  sound?: string; // optional typing sound effect
  soundVolume?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 2,
  startAt = 0,
  cursor = true,
  cursorStyle = 'bar',
  cursorBlinkSpeed = 15,
  sound,
  soundVolume = 0.3,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const charactersToShow = Math.floor(Math.max(0, (frame - startAt) * speed));
  const visibleText = text.slice(0, charactersToShow);
  
  const cursorVisible = cursor && frame >= startAt;
  const cursorBlink = Math.floor((frame - startAt) / cursorBlinkSpeed) % 2 === 0;
  
  const getCursorChar = () => {
    switch (cursorStyle) {
      case 'underscore':
        return '_';
      case 'block':
        return '█';
      default:
        return '|';
    }
  };

  const shouldPlaySound = useMemo(() => {
    if (!sound || frame < startAt) return false;
    const currentChar = Math.floor((frame - startAt) * speed);
    const prevChar = Math.floor((frame - startAt - 1) * speed);
    return currentChar > prevChar && currentChar <= text.length;
  }, [frame, startAt, speed, text.length, sound]);

  return (
    <>
      <span className={className} style={style}>
        {visibleText}
        {cursorVisible && (
          <span
            style={{
              opacity: cursorBlink ? 1 : 0,
              fontWeight: cursorStyle === 'block' ? 400 : 'inherit',
            }}
          >
            {getCursorChar()}
          </span>
        )}
      </span>
      
      {sound && shouldPlaySound && (
        <Audio
          src={staticFile(sound)}
          startFrom={0}
          volume={soundVolume}
        />
      )}
    </>
  );
};