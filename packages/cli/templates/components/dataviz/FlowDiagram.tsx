import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface FlowNode {
  id: string;
  label: string;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  x?: number;
  y?: number;
}

export interface FlowConnection {
  from: string;
  to: string;
  animated?: boolean;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface FlowDiagramProps {
  nodes: FlowNode[];
  connections: FlowConnection[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  startAt?: number;
  animationDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  connections,
  width = 800,
  height = 400,
  nodeWidth = 150,
  nodeHeight = 60,
  startAt = 0,
  animationDuration = 30,
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  const getNodeColor = (type?: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'danger':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const calculateNodePositions = () => {
    const positioned: { [key: string]: { x: number; y: number } } = {};
    const columns = Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / columns);
    const xSpacing = width / (columns + 1);
    const ySpacing = height / (rows + 1);

    nodes.forEach((node, index) => {
      if (node.x !== undefined && node.y !== undefined) {
        positioned[node.id] = { x: node.x, y: node.y };
      } else {
        const col = index % columns;
        const row = Math.floor(index / columns);
        positioned[node.id] = {
          x: xSpacing * (col + 1),
          y: ySpacing * (row + 1),
        };
      }
    });

    return positioned;
  };

  const positions = calculateNodePositions();

  const nodeOpacity = interpolate(
    frame,
    [startAt, startAt + 15],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const connectionProgress = interpolate(
    frame,
    [startAt + 10, startAt + animationDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Render connections */}
        {connections.map((connection, index) => {
          const fromPos = positions[connection.from];
          const toPos = positions[connection.to];
          
          if (!fromPos || !toPos) return null;

          const startX = fromPos.x;
          const startY = fromPos.y;
          const endX = toPos.x;
          const endY = toPos.y;

          const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

          return (
            <g key={`connection-${index}`}>
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 5, 0 10"
                    fill="#6b7280"
                    opacity={connectionProgress}
                  />
                </marker>
              </defs>
              
              <path
                d={pathData}
                stroke="#6b7280"
                strokeWidth="2"
                fill="none"
                markerEnd={`url(#arrowhead-${index})`}
                strokeDasharray={connection.style === 'dashed' ? '5,5' : connection.style === 'dotted' ? '2,2' : undefined}
                opacity={connectionProgress}
              />
              
              {connection.animated && (
                <circle
                  r="4"
                  fill="#3b82f6"
                  opacity={connectionProgress}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={pathData}
                  />
                </circle>
              )}
              
              {connection.label && (
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 10}
                  fill="#6b7280"
                  fontSize="12"
                  textAnchor="middle"
                  opacity={connectionProgress}
                >
                  {connection.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Render nodes */}
      {nodes.map((node, index) => {
        const pos = positions[node.id];
        if (!pos) return null;

        const nodeDelay = index * 2;
        const nodeScale = interpolate(
          frame,
          [startAt + nodeDelay, startAt + nodeDelay + 10],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: pos.x - nodeWidth / 2,
              top: pos.y - nodeHeight / 2,
              width: nodeWidth,
              height: nodeHeight,
              backgroundColor: 'white',
              border: `2px solid ${getNodeColor(node.type)}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              opacity: nodeOpacity,
              transform: `scale(${nodeScale})`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: getNodeColor(node.type),
                textAlign: 'center',
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};