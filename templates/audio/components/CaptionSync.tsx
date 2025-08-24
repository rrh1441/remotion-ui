import React, { useMemo } from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export interface Caption {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  speaker?: string;
  style?: React.CSSProperties;
}

export interface CaptionSyncProps {
  captions: Caption[];
  style?: React.CSSProperties;
  className?: string;
  position?: 'top' | 'center' | 'bottom' | 'custom';
  maxWidth?: number | string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number | string;
  fontFamily?: string;
  padding?: number | string;
  borderRadius?: number | string;
  animation?: 'none' | 'fade' | 'slide' | 'pop' | 'typewriter';
  animationDuration?: number;
  showSpeaker?: boolean;
  speakerStyle?: React.CSSProperties;
  wordHighlight?: boolean;
  wordHighlightColor?: string;
  renderCaption?: (caption: Caption, isActive: boolean) => React.ReactNode;
}

export const CaptionSync: React.FC<CaptionSyncProps> = ({
  captions,
  style,
  className,
  position = 'bottom',
  maxWidth = '80%',
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  textColor = 'white',
  fontSize = '1.2rem',
  fontFamily = 'system-ui, -apple-system, sans-serif',
  padding = '12px 20px',
  borderRadius = '8px',
  animation = 'fade',
  animationDuration = 10,
  showSpeaker = false,
  speakerStyle,
  wordHighlight = false,
  wordHighlightColor = '#FFD700',
  renderCaption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeCaption = useMemo(() => {
    return captions.find(
      caption => frame >= caption.startFrame && frame <= caption.endFrame
    );
  }, [captions, frame]);

  const animationProgress = useMemo(() => {
    if (!activeCaption || animation === 'none') return 1;

    const progress = interpolate(
      frame,
      [
        activeCaption.startFrame,
        activeCaption.startFrame + animationDuration,
        activeCaption.endFrame - animationDuration,
        activeCaption.endFrame,
      ],
      [0, 1, 1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    return progress;
  }, [activeCaption, frame, animation, animationDuration]);

  const animatedStyle = useMemo(() => {
    if (!activeCaption) return { opacity: 0 };

    const baseStyle: React.CSSProperties = {};

    switch (animation) {
      case 'fade':
        baseStyle.opacity = animationProgress;
        break;
      case 'slide':
        baseStyle.opacity = animationProgress;
        baseStyle.transform = `translateY(${interpolate(
          animationProgress,
          [0, 1],
          [20, 0]
        )}px)`;
        break;
      case 'pop':
        baseStyle.opacity = animationProgress;
        baseStyle.transform = `scale(${spring({
          frame: frame - activeCaption.startFrame,
          fps,
          config: {
            damping: 200,
            stiffness: 500,
            mass: 0.5,
          },
        })})`;
        break;
      default:
        baseStyle.opacity = 1;
    }

    return baseStyle;
  }, [activeCaption, animation, animationProgress, frame, fps]);

  const positionStyle = useMemo(() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth,
      width: 'fit-content',
      zIndex: 1000,
    };

    switch (position) {
      case 'top':
        return { ...base, top: '10%' };
      case 'center':
        return { ...base, top: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom':
        return { ...base, bottom: '10%' };
      case 'custom':
        return {};
      default:
        return base;
    }
  }, [position, maxWidth]);

  const containerStyle: React.CSSProperties = {
    ...positionStyle,
    ...animatedStyle,
    ...style,
  };

  const captionStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    fontSize,
    fontFamily,
    padding,
    borderRadius,
    textAlign: 'center',
    lineHeight: 1.4,
    ...activeCaption?.style,
  };

  if (!activeCaption) return null;

  if (renderCaption) {
    return (
      <div style={containerStyle} className={className}>
        {renderCaption(activeCaption, true)}
      </div>
    );
  }

  const captionContent = wordHighlight ? (
    <HighlightedText
      text={activeCaption.text}
      caption={activeCaption}
      frame={frame}
      highlightColor={wordHighlightColor}
    />
  ) : animation === 'typewriter' ? (
    <TypewriterText
      text={activeCaption.text}
      caption={activeCaption}
      frame={frame}
    />
  ) : (
    activeCaption.text
  );

  return (
    <div style={containerStyle} className={className}>
      <div style={captionStyle}>
        {showSpeaker && activeCaption.speaker && (
          <div style={{ fontWeight: 'bold', marginBottom: 4, ...speakerStyle }}>
            {activeCaption.speaker}:
          </div>
        )}
        {captionContent}
      </div>
    </div>
  );
};

interface HighlightedTextProps {
  text: string;
  caption: Caption;
  frame: number;
  highlightColor: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  caption,
  frame,
  highlightColor,
}) => {
  const words = text.split(' ');
  const totalDuration = caption.endFrame - caption.startFrame;
  const framesPerWord = totalDuration / words.length;
  const currentWordIndex = Math.floor(
    (frame - caption.startFrame) / framesPerWord
  );

  return (
    <>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            backgroundColor:
              index === currentWordIndex ? highlightColor : 'transparent',
            padding: '2px 4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
        >
          {word}{' '}
        </span>
      ))}
    </>
  );
};

interface TypewriterTextProps {
  text: string;
  caption: Caption;
  frame: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  caption,
  frame,
}) => {
  const progress = interpolate(
    frame,
    [caption.startFrame, caption.endFrame],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const visibleLength = Math.floor(text.length * progress);
  const visibleText = text.slice(0, visibleLength);

  return (
    <>
      {visibleText}
      <span style={{ opacity: 0.5 }}>|</span>
    </>
  );
};

export interface SubtitleTrack {
  language: string;
  label: string;
  captions: Caption[];
}

export interface MultiLanguageCaptionsProps extends Omit<CaptionSyncProps, 'captions'> {
  tracks: SubtitleTrack[];
  currentLanguage: string;
}

export const MultiLanguageCaptions: React.FC<MultiLanguageCaptionsProps> = ({
  tracks,
  currentLanguage,
  ...props
}) => {
  const currentTrack = tracks.find(track => track.language === currentLanguage);

  if (!currentTrack) {
    console.warn(`No subtitle track found for language: ${currentLanguage}`);
    return null;
  }

  return <CaptionSync captions={currentTrack.captions} {...props} />;
};

export function parseSRT(srtContent: string, fps: number): Caption[] {
  const entries = srtContent.trim().split(/\n\n+/);
  
  return entries.map(entry => {
    const lines = entry.trim().split('\n');
    const id = lines[0];
    const timeMatch = lines[1].match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/
    );
    
    if (!timeMatch) {
      throw new Error(`Invalid SRT time format in entry ${id}`);
    }
    
    const startTime = 
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;
    
    const endTime = 
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;
    
    const text = lines.slice(2).join(' ');
    
    return {
      id,
      text,
      startFrame: Math.round(startTime * fps),
      endFrame: Math.round(endTime * fps),
    };
  });
}

export function parseVTT(vttContent: string, fps: number): Caption[] {
  const lines = vttContent.split('\n');
  const captions: Caption[] = [];
  let currentCaption: Partial<Caption> | null = null;
  let id = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('-->')) {
      const timeMatch = line.match(
        /(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})/
      );
      
      if (timeMatch) {
        const startTime = 
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseInt(timeMatch[3]) +
          parseInt(timeMatch[4]) / 1000;
        
        const endTime = 
          parseInt(timeMatch[5]) * 3600 +
          parseInt(timeMatch[6]) * 60 +
          parseInt(timeMatch[7]) +
          parseInt(timeMatch[8]) / 1000;
        
        currentCaption = {
          id: `caption-${id++}`,
          startFrame: Math.round(startTime * fps),
          endFrame: Math.round(endTime * fps),
          text: '',
        };
      }
    } else if (currentCaption && line && !line.startsWith('WEBVTT')) {
      currentCaption.text = (currentCaption.text || '') + ' ' + line;
    } else if (currentCaption && !line && currentCaption.text) {
      captions.push(currentCaption as Caption);
      currentCaption = null;
    }
  }
  
  if (currentCaption && currentCaption.text) {
    captions.push(currentCaption as Caption);
  }
  
  return captions.map(cap => ({
    ...cap,
    text: cap.text.trim(),
  }));
}