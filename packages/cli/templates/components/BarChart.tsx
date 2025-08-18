import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BarData {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  barColor?: string;
  showValues?: boolean;
  showGrid?: boolean;
  animationType?: 'grow' | 'slide' | 'fade';
  staggerDelay?: number;
  startAt?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 800,
  height = 400,
  barColor = '#3b82f6',
  showValues = true,
  showGrid = true,
  animationType = 'grow',
  staggerDelay = 3,
  startAt = 0,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length * 0.7;
  const barSpacing = chartWidth / data.length;

  const gridLines = [];
  if (showGrid) {
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      const value = maxValue - (maxValue / 5) * i;
      
      gridLines.push(
        <g key={`grid-${i}`}>
          <line
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
          <text
            x={padding - 10}
            y={y + 4}
            textAnchor="end"
            fill="#6b7280"
            fontSize="12"
            opacity={interpolate(frame, [startAt + 10, startAt + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          >
            {Math.round(value)}
          </text>
        </g>
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

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
          const y = height - padding - barHeight;

          const barProgress = spring({
            frame: frame - startAt - index * staggerDelay,
            fps,
            from: 0,
            to: 1,
            durationInFrames: 30,
          });

          let animatedHeight = barHeight;
          let animatedY = y;
          let opacity = 1;

          if (animationType === 'grow') {
            animatedHeight = barHeight * barProgress;
            animatedY = height - padding - animatedHeight;
          } else if (animationType === 'slide') {
            animatedY = interpolate(
              barProgress,
              [0, 1],
              [height - padding, y]
            );
          } else if (animationType === 'fade') {
            opacity = barProgress;
          }

          return (
            <g key={index}>
              <rect
                x={x}
                y={animatedY}
                width={barWidth}
                height={animatedHeight}
                fill={item.color || barColor}
                opacity={opacity}
                rx="4"
              />

              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={animatedY - 10}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="14"
                  fontWeight="bold"
                  opacity={interpolate(
                    frame,
                    [startAt + index * staggerDelay + 20, startAt + index * staggerDelay + 30],
                    [0, 1],
                    {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }
                  )}
                >
                  {item.value}
                </text>
              )}

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                fill="#374151"
                fontSize="12"
                opacity={interpolate(
                  frame,
                  [startAt + index * staggerDelay, startAt + index * staggerDelay + 10],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }
                )}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};