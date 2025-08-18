import React from 'react';
import { AspectPreset, SafeArea } from './AspectPresets';

export interface FramePresetProps {
  preset: AspectPreset;
  children: React.ReactNode;
  showSafeArea?: boolean;
  safeAreaColor?: string;
  safeAreaOpacity?: number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FramePreset: React.FC<FramePresetProps> = ({
  preset,
  children,
  showSafeArea = false,
  safeAreaColor = '#ff0000',
  safeAreaOpacity = 0.3,
  backgroundColor = '#000000',
  className,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    width: preset.width,
    height: preset.height,
    position: 'relative',
    backgroundColor,
    overflow: 'hidden',
    ...style,
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
  };

  const safeAreaOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1000,
  };

  const renderSafeAreaGuides = (safeArea: SafeArea) => {
    const guideStyle = (position: 'top' | 'right' | 'bottom' | 'left'): React.CSSProperties => {
      const base: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: safeAreaColor,
        opacity: safeAreaOpacity,
      };

      switch (position) {
        case 'top':
          return {
            ...base,
            top: 0,
            left: 0,
            right: 0,
            height: safeArea.top,
          };
        case 'bottom':
          return {
            ...base,
            bottom: 0,
            left: 0,
            right: 0,
            height: safeArea.bottom,
          };
        case 'left':
          return {
            ...base,
            top: safeArea.top,
            left: 0,
            bottom: safeArea.bottom,
            width: safeArea.left,
          };
        case 'right':
          return {
            ...base,
            top: safeArea.top,
            right: 0,
            bottom: safeArea.bottom,
            width: safeArea.right,
          };
      }
    };

    const borderStyle: React.CSSProperties = {
      position: 'absolute',
      top: safeArea.top,
      right: safeArea.right,
      bottom: safeArea.bottom,
      left: safeArea.left,
      border: `2px dashed ${safeAreaColor}`,
      opacity: 0.5,
      pointerEvents: 'none',
    };

    const labelStyle: React.CSSProperties = {
      position: 'absolute',
      top: safeArea.top + 10,
      left: safeArea.left + 10,
      color: safeAreaColor,
      fontSize: '12px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      padding: '2px 6px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '3px',
      zIndex: 1001,
    };

    return (
      <>
        <div style={guideStyle('top')} />
        <div style={guideStyle('right')} />
        <div style={guideStyle('bottom')} />
        <div style={guideStyle('left')} />
        <div style={borderStyle} />
        <div style={labelStyle}>SAFE AREA</div>
      </>
    );
  };

  const infoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 1002,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={contentStyle}>
        {children}
      </div>
      
      {showSafeArea && preset.safeArea && (
        <div style={safeAreaOverlayStyle}>
          {renderSafeAreaGuides(preset.safeArea)}
        </div>
      )}
      
      {showSafeArea && (
        <div style={infoStyle}>
          {preset.name} • {preset.width}×{preset.height}
        </div>
      )}
    </div>
  );
};

export const createComposition = (preset: AspectPreset) => {
  return {
    id: preset.id,
    component: FramePreset,
    width: preset.width,
    height: preset.height,
    fps: preset.fps,
    durationInFrames: preset.durationInFrames,
    defaultProps: {
      preset,
      showSafeArea: false,
    },
  };
};