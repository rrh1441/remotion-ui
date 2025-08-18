import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface QuoteBlockProps {
  quote: string;
  author?: string;
  avatarUrl?: string;
  startAt?: number;
  durationInFrames?: number;
  className?: string;
  quoteClassName?: string;
  authorClassName?: string;
  avatarClassName?: string;
  fadeIn?: boolean;
  slideIn?: boolean;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  quote,
  author,
  avatarUrl,
  startAt = 0,
  durationInFrames = 60,
  className,
  quoteClassName,
  authorClassName,
  avatarClassName,
  fadeIn = true,
  slideIn = true,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startAt;
  
  if (relativeFrame < 0) {
    return null;
  }

  const animationProgress = Math.min(relativeFrame / 15, 1);
  
  const opacity = fadeIn
    ? interpolate(animationProgress, [0, 1], [0, 1])
    : 1;
    
  const translateY = slideIn
    ? interpolate(animationProgress, [0, 1], [20, 0])
    : 0;

  const quoteFadeDelay = 0;
  const authorFadeDelay = 5;
  
  const quoteOpacity = fadeIn
    ? interpolate(
        relativeFrame,
        [quoteFadeDelay, quoteFadeDelay + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;
    
  const authorOpacity = fadeIn
    ? interpolate(
        relativeFrame,
        [authorFadeDelay, authorFadeDelay + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    opacity,
    transform: `translateY(${translateY}px)`,
  };

  const quoteStyle: React.CSSProperties = {
    fontSize: '28px',
    lineHeight: 1.5,
    fontWeight: 400,
    color: '#1f2937',
    position: 'relative',
    fontStyle: 'italic',
    opacity: quoteOpacity,
  };

  const quoteMarkStyle: React.CSSProperties = {
    fontSize: '60px',
    lineHeight: 1,
    position: 'absolute',
    color: '#d1d5db',
    fontFamily: 'Georgia, serif',
  };

  const authorContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    opacity: authorOpacity,
  };

  const avatarStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#e5e7eb',
  };

  const authorTextStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 500,
    color: '#6b7280',
  };

  const dashStyle: React.CSSProperties = {
    width: '40px',
    height: '2px',
    backgroundColor: '#9ca3af',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        <span style={{ ...quoteMarkStyle, left: '-10px', top: '-10px' }}>"</span>
        <p style={quoteStyle} className={quoteClassName}>
          {quote}
        </p>
        <span style={{ ...quoteMarkStyle, right: '20px', bottom: '-40px' }}>"</span>
      </div>
      
      {author && (
        <div style={authorContainerStyle}>
          <div style={dashStyle} />
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={author}
              style={avatarStyle}
              className={avatarClassName}
            />
          )}
          <span style={authorTextStyle} className={authorClassName}>
            {author}
          </span>
        </div>
      )}
    </div>
  );
};