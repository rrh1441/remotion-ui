import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PieData {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieData[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  animationDuration?: number;
  startAt?: number;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 400,
  innerRadius = 0,
  showLabels = true,
  showPercentages = true,
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

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let currentAngle = -Math.PI / 2; // Start from top

  const createPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const x1 = center + Math.cos(startAngle) * outerR;
    const y1 = center + Math.sin(startAngle) * outerR;
    const x2 = center + Math.cos(endAngle) * outerR;
    const y2 = center + Math.sin(endAngle) * outerR;

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    if (innerR > 0) {
      const ix1 = center + Math.cos(startAngle) * innerR;
      const iy1 = center + Math.sin(startAngle) * innerR;
      const ix2 = center + Math.cos(endAngle) * innerR;
      const iy2 = center + Math.sin(endAngle) * innerR;

      return `
        M ${x1} ${y1}
        A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}
        Z
      `;
    }

    return `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Slices */}
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * Math.PI * 2;
          const endAngle = currentAngle + angle * progress;
          
          const path = createPath(currentAngle, endAngle, radius, innerRadius);
          
          const labelAngle = currentAngle + (angle * progress) / 2;
          const labelRadius = innerRadius > 0 ? (radius + innerRadius) / 2 : radius * 0.7;
          const labelX = center + Math.cos(labelAngle) * labelRadius;
          const labelY = center + Math.sin(labelAngle) * labelRadius;

          const sliceElement = (
            <g key={index}>
              <path
                d={path}
                fill={item.color}
                opacity={interpolate(
                  frame,
                  [startAt + (index / data.length) * 20, startAt + (index / data.length) * 20 + 10],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }
                )}
                stroke="white"
                strokeWidth="2"
              />

              {/* Percentage label */}
              {showPercentages && progress > 0.5 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  opacity={interpolate(
                    frame,
                    [startAt + animationDuration - 10, startAt + animationDuration],
                    [0, 1],
                    {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }
                  )}
                >
                  {Math.round(percentage * 100)}%
                </text>
              )}
            </g>
          );

          currentAngle = currentAngle + angle;

          return sliceElement;
        })}

        {/* Labels */}
        {showLabels && (
          <g>
            {data.map((item, index) => {
              const legendY = 30 + index * 25;
              const legendOpacity = interpolate(
                frame,
                [startAt + animationDuration, startAt + animationDuration + 10],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }
              );

              return (
                <g key={`legend-${index}`} opacity={legendOpacity}>
                  <rect
                    x={size - 150}
                    y={legendY - 8}
                    width={16}
                    height={16}
                    fill={item.color}
                    rx="2"
                  />
                  <text
                    x={size - 125}
                    y={legendY + 4}
                    fill="#374151"
                    fontSize="14"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};