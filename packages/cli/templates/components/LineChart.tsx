import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  showDots?: boolean;
  animationDuration?: number;
  startAt?: number;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 800,
  height = 400,
  strokeColor = '#3b82f6',
  strokeWidth = 3,
  fillColor = 'rgba(59, 130, 246, 0.1)',
  showGrid = true,
  showLabels = true,
  showDots = true,
  animationDuration = 60,
  startAt = 0,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startAt,
    fps,
    from: 0,
    to: 1,
    durationInFrames: animationDuration,
  });

  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const maxX = Math.max(...data.map(d => d.x));
  const minX = Math.min(...data.map(d => d.x));

  const scaleX = (x: number) => 
    padding + ((x - minX) / (maxX - minX)) * chartWidth;
  
  const scaleY = (y: number) => 
    height - padding - ((y - minY) / (maxY - minY)) * chartHeight;

  const pathData = data
    .slice(0, Math.ceil(data.length * progress))
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const fillPath = pathData + 
    ` L ${scaleX(data[Math.ceil(data.length * progress) - 1]?.x || minX)} ${height - padding}` +
    ` L ${scaleX(data[0]?.x || minX)} ${height - padding} Z`;

  const gridLines = [];
  if (showGrid) {
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity={interpolate(frame, [startAt, startAt + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      );
    }

    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth / 5) * i;
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity={interpolate(frame, [startAt, startAt + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      );
    }
  }

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {gridLines}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Fill area */}
        {fillColor && pathData && (
          <path
            d={fillPath}
            fill={fillColor}
            opacity={progress}
          />
        )}

        {/* Line */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots */}
        {showDots && data.slice(0, Math.ceil(data.length * progress)).map((point, index) => {
          const dotProgress = interpolate(
            frame,
            [
              startAt + (index / data.length) * animationDuration,
              startAt + (index / data.length) * animationDuration + 10,
            ],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          return (
            <circle
              key={index}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r={5 * dotProgress}
              fill="white"
              stroke={strokeColor}
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {showLabels && data.slice(0, Math.ceil(data.length * progress)).map((point, index) => {
          if (!point.label) return null;

          const labelProgress = interpolate(
            frame,
            [
              startAt + (index / data.length) * animationDuration + 5,
              startAt + (index / data.length) * animationDuration + 15,
            ],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          return (
            <text
              key={`label-${index}`}
              x={scaleX(point.x)}
              y={scaleY(point.y) - 15}
              textAnchor="middle"
              fill="#374151"
              fontSize="12"
              opacity={labelProgress}
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};