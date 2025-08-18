import React from 'react';
import { type AspectPreset } from './presets';

export interface FramePresetProps {
  preset: AspectPreset;
  showSafeArea?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FramePreset: React.FC<FramePresetProps> = ({
  preset,
  showSafeArea = false,
  children,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: preset.width,
        height: preset.height,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
      
      {showSafeArea && preset.safeArea && (
        <div
          style={{
            position: 'absolute',
            top: preset.safeArea.top,
            right: preset.safeArea.right,
            bottom: preset.safeArea.bottom,
            left: preset.safeArea.left,
            border: '2px dashed rgba(255, 0, 255, 0.5)',
            pointerEvents: 'none',
            borderRadius: '8px',
          }}
        />
      )}
    </div>
  );
};