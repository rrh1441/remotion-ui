import React, { useMemo } from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from 'remotion';

export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate?: number;
}

export interface WaveformVisualizerProps {
  audioSrc?: string;
  waveformData?: WaveformData;
  width?: number | string;
  height?: number | string;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  color?: string | ((index: number, amplitude: number) => string);
  backgroundColor?: string;
  style?: React.CSSProperties;
  className?: string;
  animated?: boolean;
  animationStyle?: 'bounce' | 'wave' | 'pulse' | 'glow';
  showProgress?: boolean;
  progressColor?: string;
  mirror?: boolean;
  orientation?: 'horizontal' | 'vertical';
  smoothing?: number;
  frequencyBands?: number[];
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  waveformData,
  width = '100%',
  height = 200,
  barCount = 64,
  barWidth = 4,
  barGap = 2,
  barRadius = 2,
  color = '#00ff00',
  backgroundColor = 'transparent',
  style,
  className,
  animated = true,
  animationStyle = 'bounce',
  showProgress = false,
  progressColor = 'rgba(255, 255, 255, 0.3)',
  mirror = false,
  orientation = 'horizontal',
  smoothing = 0.8,
  frequencyBands,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bars = useMemo(() => {
    if (waveformData?.peaks) {
      const step = Math.floor(waveformData.peaks.length / barCount);
      return Array.from({ length: barCount }, (_, i) => {
        const peakIndex = i * step;
        return waveformData.peaks[peakIndex] || 0;
      });
    }

    return Array.from({ length: barCount }, (_, i) => {
      const seed = `waveform-${i}`;
      const baseAmplitude = random(seed) * 0.6 + 0.4;
      
      if (animated) {
        const time = frame / fps;
        const frequency = frequencyBands?.[i % frequencyBands.length] || (i + 1) * 0.1;
        const phase = random(`${seed}-phase`) * Math.PI * 2;
        const amplitude = baseAmplitude * (Math.sin(time * frequency + phase) * 0.3 + 0.7);
        return amplitude;
      }
      
      return baseAmplitude;
    });
  }, [waveformData, barCount, animated, frame, fps, frequencyBands]);

  const smoothedBars = useMemo(() => {
    if (smoothing === 0) return bars;

    return bars.map((bar, i) => {
      const prevBar = bars[i - 1] ?? bar;
      const nextBar = bars[i + 1] ?? bar;
      return bar * (1 - smoothing) + (prevBar + nextBar) / 2 * smoothing;
    });
  }, [bars, smoothing]);

  const animatedBars = useMemo(() => {
    if (!animated) return smoothedBars;

    return smoothedBars.map((bar, i) => {
      switch (animationStyle) {
        case 'bounce':
          const bounceOffset = Math.sin((frame / fps + i * 0.1) * Math.PI) * 0.2;
          return Math.min(1, bar + bounceOffset);
        
        case 'wave':
          const waveOffset = Math.sin((frame / fps) * 2 - (i / barCount) * Math.PI * 2) * 0.15;
          return Math.min(1, bar + waveOffset);
        
        case 'pulse':
          const pulseScale = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.1;
          return Math.min(1, bar * pulseScale);
        
        case 'glow':
          const glowIntensity = (Math.sin((frame / fps) * Math.PI) + 1) / 2;
          return bar * (0.7 + glowIntensity * 0.3);
        
        default:
          return bar;
      }
    });
  }, [smoothedBars, animated, animationStyle, frame, fps, barCount]);

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const containerStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...style,
  };

  const isVertical = orientation === 'vertical';

  const visualizerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${barGap}px`,
    height: '100%',
    width: '100%',
  };

  const getBarColor = (index: number, amplitude: number) => {
    if (typeof color === 'function') {
      return color(index, amplitude);
    }
    return color;
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={visualizerStyle}>
        {animatedBars.map((amplitude, i) => {
          const barHeight = isVertical
            ? `${(100 / barCount) - (barGap / (typeof height === 'number' ? height : 200)) * 100}%`
            : `${amplitude * 100}%`;
          
          const barWidthValue = isVertical
            ? `${amplitude * 100}%`
            : `${barWidth}px`;

          const barStyle: React.CSSProperties = {
            width: barWidthValue,
            height: barHeight,
            backgroundColor: getBarColor(i, amplitude),
            borderRadius: `${barRadius}px`,
            transition: animated ? 'all 0.1s ease-out' : 'none',
            position: 'relative',
            transformOrigin: isVertical ? 'left center' : 'center bottom',
          };

          if (animationStyle === 'glow' && animated) {
            barStyle.boxShadow = `0 0 ${amplitude * 10}px ${getBarColor(i, amplitude)}`;
          }

          const shouldHighlight = showProgress && i / barCount <= progress;

          return (
            <div
              key={i}
              style={{
                ...barStyle,
                opacity: shouldHighlight ? 1 : 0.5,
              }}
            >
              {mirror && (
                <div
                  style={{
                    ...barStyle,
                    position: 'absolute',
                    [isVertical ? 'right' : 'bottom']: '100%',
                    [isVertical ? 'left' : 'left']: 0,
                    opacity: 0.3,
                    transform: isVertical ? 'scaleX(-1)' : 'scaleY(-1)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {showProgress && (
        <div
          style={{
            position: 'absolute',
            [isVertical ? 'top' : 'left']: 0,
            [isVertical ? 'left' : 'bottom']: 0,
            [isVertical ? 'height' : 'width']: `${progress * 100}%`,
            [isVertical ? 'width' : 'height']: '100%',
            backgroundColor: progressColor,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export interface SpectrumAnalyzerProps extends Omit<WaveformVisualizerProps, 'waveformData'> {
  frequencyData?: number[];
  minFrequency?: number;
  maxFrequency?: number;
  minDecibels?: number;
  maxDecibels?: number;
  logarithmic?: boolean;
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  frequencyData,
  minFrequency = 20,
  maxFrequency = 20000,
  minDecibels = -90,
  maxDecibels = -10,
  logarithmic = true,
  barCount = 32,
  color = (index, amplitude) => {
    const hue = (index / barCount) * 120;
    return `hsl(${hue}, 70%, ${50 + amplitude * 30}%)`;
  },
  ...props
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spectrumData = useMemo(() => {
    if (frequencyData) {
      return frequencyData.slice(0, barCount).map(value => {
        const normalized = (value - minDecibels) / (maxDecibels - minDecibels);
        return Math.max(0, Math.min(1, normalized));
      });
    }

    return Array.from({ length: barCount }, (_, i) => {
      const seed = `spectrum-${i}`;
      const time = frame / fps;
      const frequency = logarithmic
        ? Math.pow(10, (i / barCount) * (Math.log10(maxFrequency) - Math.log10(minFrequency)) + Math.log10(minFrequency))
        : minFrequency + (i / barCount) * (maxFrequency - minFrequency);
      
      const amplitude = random(seed) * 0.5 + 0.5;
      const modulation = Math.sin(time * frequency * 0.01) * 0.3;
      
      return Math.max(0, Math.min(1, amplitude + modulation));
    });
  }, [frequencyData, barCount, frame, fps, logarithmic, minFrequency, maxFrequency, minDecibels, maxDecibels]);

  return (
    <WaveformVisualizer
      {...props}
      barCount={barCount}
      color={color}
      waveformData={{ peaks: spectrumData, duration: 1 }}
    />
  );
};

export async function generateWaveformData(
  audioUrl: string,
  samples: number = 1000
): Promise<WaveformData> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const peaks: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const start = blockSize * i;
      let max = 0;
      
      for (let j = 0; j < blockSize; j++) {
        const value = Math.abs(channelData[start + j]);
        if (value > max) max = value;
      }
      
      peaks.push(max);
    }
    
    return {
      peaks,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
    };
  } finally {
    audioContext.close();
  }
}