import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Lottie } from '@remotion/lottie';

export interface CharacterProps {
  persona: 'business' | 'creative' | 'tech' | 'education' | 'healthcare';
  pose: 'idle' | 'pointing' | 'thinking' | 'typing' | 'presenting';
  emotion: 'neutral' | 'happy' | 'concerned' | 'excited' | 'surprised';
  scale?: number;
  position?: { x: number; y: number };
  animateIn?: boolean;
  startAt?: number;
  enableBlink?: boolean;
  blinkAnimationPath?: string;
  className?: string;
}

export const Character: React.FC<CharacterProps> = ({
  persona = 'business',
  pose = 'idle',
  emotion = 'neutral',
  scale = 1,
  position = { x: 0, y: 0 },
  animateIn = true,
  startAt = 0,
  enableBlink = true,
  blinkAnimationPath = '/assets/characters/v1/animations/idle-blink.json',
  className,
}) => {
  const frame = useCurrentFrame();
  
  const animationProgress = animateIn
    ? interpolate(frame, [startAt, startAt + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const characterScale = scale * animationProgress;
  const opacity = animationProgress;

  // Load Lottie animation for blinking
  const lottieAnimation = useMemo(() => {
    if (!enableBlink || pose !== 'idle') return null;
    try {
      // For now, return a simple blink animation placeholder
      // In a real implementation, you would fetch and parse the JSON
      return {
        fr: 30,
        w: 100,
        h: 100,
        op: 30,
        layers: [],
        ddd: 0,
        v: '5.0.0',
        ip: 0,
      };
    } catch {
      return null;
    }
  }, [enableBlink, pose, blinkAnimationPath]);

  // Character SVG paths based on persona and pose
  const getCharacterPath = () => {
    // Simplified character representation
    const baseCharacter = (
      <g transform={`scale(${characterScale})`}>
        {/* Head */}
        <circle cx="50" cy="30" r="20" fill="#FDBCB4" />
        
        {/* Body */}
        <rect x="30" y="45" width="40" height="60" rx="5" fill={getPersonaColor(persona)} />
        
        {/* Arms based on pose */}
        {pose === 'pointing' && (
          <>
            <rect x="20" y="50" width="12" height="40" rx="4" fill="#FDBCB4" transform="rotate(-30 26 50)" />
            <rect x="68" y="50" width="12" height="35" rx="4" fill="#FDBCB4" transform="rotate(45 74 50)" />
          </>
        )}
        {pose === 'thinking' && (
          <>
            <rect x="20" y="50" width="12" height="35" rx="4" fill="#FDBCB4" />
            <rect x="68" y="50" width="12" height="30" rx="4" fill="#FDBCB4" transform="rotate(-20 74 50)" />
            <circle cx="78" cy="25" r="3" fill="#FDBCB4" />
          </>
        )}
        {pose === 'typing' && (
          <>
            <rect x="20" y="65" width="12" height="25" rx="4" fill="#FDBCB4" transform="rotate(-10 26 65)" />
            <rect x="68" y="65" width="12" height="25" rx="4" fill="#FDBCB4" transform="rotate(10 74 65)" />
          </>
        )}
        {(pose === 'idle' || pose === 'presenting') && (
          <>
            <rect x="20" y="50" width="12" height="40" rx="4" fill="#FDBCB4" />
            <rect x="68" y="50" width="12" height="40" rx="4" fill="#FDBCB4" />
          </>
        )}
        
        {/* Face expression based on emotion - only if not using Lottie for eyes */}
        {(!enableBlink || pose !== 'idle') && renderFace(emotion)}
        
        {/* Mouth - always render */}
        {renderMouth(emotion)}
        
        {/* Legs */}
        <rect x="35" y="100" width="12" height="40" rx="4" fill="#333" />
        <rect x="53" y="100" width="12" height="40" rx="4" fill="#333" />
      </g>
    );

    return baseCharacter;
  };

  const getPersonaColor = (persona: CharacterProps['persona']) => {
    const colors: Record<CharacterProps['persona'], string> = {
      business: '#2563eb',
      creative: '#dc2626',
      tech: '#059669',
      education: '#7c3aed',
      healthcare: '#0891b2',
    };
    return colors[persona] || '#6b7280';
  };

  const renderFace = (emotion: string) => {
    const eyeY = 25;

    return (
      <>
        {/* Eyes */}
        {emotion === 'happy' || emotion === 'excited' ? (
          <>
            <path d="M 40 25 Q 43 22 46 25" stroke="#000" strokeWidth="2" fill="none" />
            <path d="M 54 25 Q 57 22 60 25" stroke="#000" strokeWidth="2" fill="none" />
          </>
        ) : emotion === 'concerned' ? (
          <>
            <circle cx="43" cy={eyeY} r="2" fill="#000" />
            <circle cx="57" cy={eyeY} r="2" fill="#000" />
            <path d="M 38 20 L 48 22" stroke="#000" strokeWidth="1.5" />
            <path d="M 62 20 L 52 22" stroke="#000" strokeWidth="1.5" />
          </>
        ) : emotion === 'surprised' ? (
          <>
            <circle cx="43" cy={eyeY} r="3" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <circle cx="57" cy={eyeY} r="3" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <circle cx="43" cy={eyeY} r="1.5" fill="#000" />
            <circle cx="57" cy={eyeY} r="1.5" fill="#000" />
          </>
        ) : (
          <>
            <circle cx="43" cy={eyeY} r="2" fill="#000" />
            <circle cx="57" cy={eyeY} r="2" fill="#000" />
          </>
        )}
      </>
    );
  };

  const renderMouth = (emotion: string) => {
    const mouthY = 35;

    return (
      <>
        {/* Mouth */}
        {emotion === 'happy' || emotion === 'excited' ? (
          <path d="M 42 35 Q 50 40 58 35" stroke="#000" strokeWidth="2" fill="none" />
        ) : emotion === 'concerned' ? (
          <path d="M 42 38 Q 50 35 58 38" stroke="#000" strokeWidth="2" fill="none" />
        ) : emotion === 'surprised' ? (
          <ellipse cx="50" cy={mouthY + 2} rx="4" ry="6" fill="#000" />
        ) : (
          <line x1="45" y1={mouthY} x2="55" y2={mouthY} stroke="#000" strokeWidth="2" />
        )}
      </>
    );
  };

  // Add idle animation (subtle bounce)
  const idleBounce = pose === 'idle' 
    ? Math.sin(frame * 0.1) * 2 
    : 0;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y + idleBounce,
        opacity,
      }}
    >
      <svg
        width="100"
        height="150"
        viewBox="0 0 100 150"
        style={{ overflow: 'visible', position: 'relative' }}
      >
        {getCharacterPath()}
      </svg>
      
      {/* Lottie eye blink animation overlay */}
      {enableBlink && pose === 'idle' && lottieAnimation && (
        <div
          style={{
            position: 'absolute',
            top: 20 * characterScale,
            left: 35 * characterScale,
            width: 30 * characterScale,
            height: 15 * characterScale,
          }}
        >
          <Lottie
            animationData={lottieAnimation}
            loop
            playbackRate={1}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}
    </div>
  );
};