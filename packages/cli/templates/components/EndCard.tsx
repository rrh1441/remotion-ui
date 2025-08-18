import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export interface EndCardProps {
  heading: string;
  cta?: {
    label: string;
    href: string;
  };
  logoSrc?: string;
  startAt?: number;
  durationInFrames?: number;
  backgroundColor?: string;
  textColor?: string;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  className?: string;
  headingClassName?: string;
  ctaClassName?: string;
  logoClassName?: string;
}

export const EndCard: React.FC<EndCardProps> = ({
  heading,
  cta,
  logoSrc,
  startAt = 0,
  durationInFrames = 150,
  backgroundColor = '#1f2937',
  textColor = '#ffffff',
  ctaBackgroundColor = '#3b82f6',
  ctaTextColor = '#ffffff',
  className,
  headingClassName,
  ctaClassName,
  logoClassName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startAt;
  
  if (relativeFrame < 0) {
    return null;
  }

  const fadeInProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 100,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const logoScale = spring({
    frame: relativeFrame - 5,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.3,
    },
  });

  const headingSlide = interpolate(
    relativeFrame,
    [0, 20],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const ctaSlide = interpolate(
    relativeFrame,
    [10, 30],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const ctaOpacity = interpolate(
    relativeFrame,
    [10, 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const ctaHoverScale = 1;
  const ctaPulse = interpolate(
    Math.sin((relativeFrame / fps) * Math.PI * 2),
    [-1, 1],
    [0.98, 1.02]
  );

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: fadeInProgress,
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
  };

  const logoStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    transform: `scale(${logoScale})`,
    marginBottom: '20px',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    color: textColor,
    lineHeight: 1.2,
    transform: `translateY(${headingSlide}px)`,
    opacity: fadeInProgress,
    margin: 0,
  };

  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: ctaBackgroundColor,
    color: ctaTextColor,
    padding: '16px 48px',
    fontSize: '20px',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transform: `translateY(${ctaSlide}px) scale(${ctaPulse * ctaHoverScale})`,
    opacity: ctaOpacity,
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
  };

  const urlStyle: React.CSSProperties = {
    fontSize: '14px',
    color: textColor,
    opacity: 0.7,
    marginTop: '8px',
    fontFamily: 'monospace',
  };

  const decorativeLineStyle: React.CSSProperties = {
    width: '60px',
    height: '4px',
    backgroundColor: ctaBackgroundColor,
    borderRadius: '2px',
    opacity: fadeInProgress,
    margin: '20px 0',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={contentStyle}>
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Logo"
            style={logoStyle}
            className={logoClassName}
          />
        )}
        
        <div style={decorativeLineStyle} />
        
        <h1 style={headingStyle} className={headingClassName}>
          {heading}
        </h1>
        
        {cta && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              style={ctaButtonStyle}
              className={ctaClassName}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(cta.href, '_blank');
                }
              }}
            >
              {cta.label}
            </button>
            <span style={urlStyle}>{cta.href}</span>
          </div>
        )}
      </div>
    </div>
  );
};