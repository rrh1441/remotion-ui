import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TextHighlightProps {
  text: string;
  highlightPattern?: RegExp | string; // Pattern to match for highlighting
  highlightStyle?: 'marker' | 'underline' | 'box' | 'glow' | 'background';
  highlightColor?: string;
  animationDelay?: number;
  animationDuration?: number;
  startAt?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  text,
  highlightPattern = /{([^}]+)}/g, // Default: matches {text}
  highlightStyle = 'marker',
  highlightColor = '#ffeb3b',
  animationDelay = 30,
  animationDuration = 20,
  startAt = 0,
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  const segments = useMemo(() => {
    const parts: { text: string; highlight: boolean; index: number }[] = [];
    let lastIndex = 0;
    let highlightIndex = 0;
    
    if (typeof highlightPattern === 'string') {
      // Simple string matching
      const index = text.indexOf(highlightPattern);
      if (index !== -1) {
        if (index > 0) {
          parts.push({ text: text.slice(0, index), highlight: false, index: 0 });
        }
        parts.push({ text: highlightPattern, highlight: true, index: 0 });
        if (index + highlightPattern.length < text.length) {
          parts.push({ 
            text: text.slice(index + highlightPattern.length), 
            highlight: false, 
            index: 0 
          });
        }
      } else {
        parts.push({ text, highlight: false, index: 0 });
      }
    } else {
      // Regex matching
      const regex = new RegExp(highlightPattern);
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            text: text.slice(lastIndex, match.index),
            highlight: false,
            index: 0,
          });
        }
        
        // If using capture groups (like {text}), use the captured group
        const highlightText = match[1] || match[0];
        parts.push({
          text: highlightText,
          highlight: true,
          index: highlightIndex++,
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push({
          text: text.slice(lastIndex),
          highlight: false,
          index: 0,
        });
      }
      
      // If no matches, return entire text
      if (parts.length === 0) {
        parts.push({ text, highlight: false, index: 0 });
      }
    }
    
    return parts;
  }, [text, highlightPattern]);

  const getHighlightStyles = (index: number): React.CSSProperties => {
    const highlightStartAt = startAt + animationDelay + index * 10;
    const progress = interpolate(
      frame,
      [highlightStartAt, highlightStartAt + animationDuration],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    switch (highlightStyle) {
      case 'marker':
        return {
          position: 'relative',
          zIndex: 1,
          background: `linear-gradient(
            to right,
            transparent 0%,
            ${highlightColor}88 ${progress * 100}%,
            ${highlightColor}88 100%
          )`,
          padding: '2px 4px',
          margin: '0 -4px',
        };
      
      case 'underline':
        return {
          position: 'relative',
          borderBottom: `3px solid ${highlightColor}`,
          borderBottomWidth: `${progress * 3}px`,
          paddingBottom: '2px',
        };
      
      case 'box':
        return {
          position: 'relative',
          border: `2px solid ${highlightColor}`,
          borderRadius: '4px',
          padding: '2px 6px',
          margin: '0 2px',
          opacity: progress,
        };
      
      case 'glow':
        return {
          position: 'relative',
          textShadow: `0 0 ${progress * 20}px ${highlightColor}`,
          color: progress > 0.5 ? highlightColor : 'inherit',
        };
      
      case 'background':
        return {
          position: 'relative',
          backgroundColor: highlightColor,
          color: progress > 0.5 ? '#000' : 'inherit',
          padding: '2px 6px',
          margin: '0 2px',
          borderRadius: '4px',
          opacity: progress,
        };
      
      default:
        return {};
    }
  };

  return (
    <span className={className} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={
            segment.highlight
              ? getHighlightStyles(segment.index)
              : {}
          }
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
};