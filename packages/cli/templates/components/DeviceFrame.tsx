import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export interface DeviceFrameProps {
  kind: 'browser' | 'phone';
  border?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
  frameColor?: string;
  className?: string;
  contentClassName?: string;
  showControls?: boolean;
  url?: string;
  fadeIn?: boolean;
  startAt?: number;
  durationInFrames?: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  kind,
  border = true,
  children,
  backgroundColor = '#ffffff',
  frameColor = '#1f2937',
  className,
  contentClassName,
  showControls = true,
  url,
  fadeIn = true,
  startAt = 0,
  durationInFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startAt;
  
  if (relativeFrame < 0) {
    return null;
  }

  const scaleProgress = fadeIn
    ? spring({
        frame: relativeFrame,
        fps,
        config: {
          damping: 100,
          stiffness: 100,
          mass: 0.5,
        },
      })
    : 1;

  const opacity = fadeIn
    ? interpolate(relativeFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  if (kind === 'browser') {
    const browserFrameStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: frameColor,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: border ? '0 20px 40px rgba(0, 0, 0, 0.15)' : 'none',
      transform: `scale(${scaleProgress})`,
      opacity,
    };

    const browserBarStyle: React.CSSProperties = {
      height: '40px',
      backgroundColor: frameColor,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
      borderBottom: `1px solid ${frameColor === '#1f2937' ? '#374151' : '#e5e7eb'}`,
    };

    const trafficLightStyle: React.CSSProperties = {
      display: 'flex',
      gap: '8px',
    };

    const dotStyle = (color: string): React.CSSProperties => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
    });

    const urlBarStyle: React.CSSProperties = {
      flex: 1,
      height: '28px',
      backgroundColor: frameColor === '#1f2937' ? '#111827' : '#f3f4f6',
      borderRadius: '6px',
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '12px',
    };

    const urlTextStyle: React.CSSProperties = {
      fontSize: '12px',
      color: frameColor === '#1f2937' ? '#9ca3af' : '#6b7280',
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    const contentStyle: React.CSSProperties = {
      flex: 1,
      backgroundColor,
      overflow: 'auto',
      position: 'relative',
    };

    return (
      <div style={browserFrameStyle} className={className}>
        {showControls && (
          <div style={browserBarStyle}>
            <div style={trafficLightStyle}>
              <div style={dotStyle('#ef4444')} />
              <div style={dotStyle('#eab308')} />
              <div style={dotStyle('#22c55e')} />
            </div>
            {url && (
              <div style={urlBarStyle}>
                <span style={urlTextStyle}>{url}</span>
              </div>
            )}
          </div>
        )}
        <div style={contentStyle} className={contentClassName}>
          {children}
        </div>
      </div>
    );
  }

  if (kind === 'phone') {
    const phoneFrameStyle: React.CSSProperties = {
      width: '375px',
      height: '812px',
      backgroundColor: frameColor,
      borderRadius: '40px',
      padding: '8px',
      boxShadow: border ? '0 20px 40px rgba(0, 0, 0, 0.15)' : 'none',
      position: 'relative',
      transform: `scale(${scaleProgress})`,
      opacity,
    };

    const phoneScreenStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor,
      borderRadius: '32px',
      overflow: 'hidden',
      position: 'relative',
    };

    const notchStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '150px',
      height: '30px',
      backgroundColor: frameColor,
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      zIndex: 10,
    };

    const statusBarStyle: React.CSSProperties = {
      position: 'absolute',
      top: '10px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 5,
      fontSize: '12px',
      color: frameColor === '#1f2937' ? '#ffffff' : '#000000',
      fontWeight: 600,
    };

    const timeStyle: React.CSSProperties = {
      marginLeft: '10px',
    };

    const iconsStyle: React.CSSProperties = {
      display: 'flex',
      gap: '4px',
      marginRight: '10px',
    };

    const homeIndicatorStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '135px',
      height: '5px',
      backgroundColor: frameColor === '#1f2937' ? '#ffffff' : '#000000',
      borderRadius: '3px',
      opacity: 0.3,
    };

    const contentWrapperStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      paddingTop: showControls ? '44px' : '0',
      paddingBottom: showControls ? '34px' : '0',
      overflow: 'auto',
      position: 'relative',
    };

    return (
      <div style={phoneFrameStyle} className={className}>
        <div style={phoneScreenStyle}>
          {showControls && (
            <>
              <div style={notchStyle} />
              <div style={statusBarStyle}>
                <span style={timeStyle}>9:41</span>
                <div style={iconsStyle}>
                  <span>●●●●</span>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>
              <div style={homeIndicatorStyle} />
            </>
          )}
          <div style={contentWrapperStyle} className={contentClassName}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return null;
};