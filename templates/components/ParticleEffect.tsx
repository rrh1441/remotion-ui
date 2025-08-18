import React from 'react';
import { useCurrentFrame, random, interpolate } from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifetime: number;
}

export interface ParticleEffectProps {
  count?: number;
  colors?: string[];
  sizeRange?: [number, number];
  speedRange?: [number, number];
  gravity?: number;
  wind?: number;
  emitFrom?: { x: number; y: number };
  spread?: number;
  fadeOut?: boolean;
  className?: string;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  count = 50,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  sizeRange = [2, 8],
  speedRange = [1, 5],
  gravity = 0.1,
  wind = 0,
  emitFrom = { x: 400, y: 300 },
  spread = 45,
  fadeOut = true,
  className,
}) => {
  const frame = useCurrentFrame();

  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const seed = `particle-${i}`;
    const startFrame = i * 2;
    
    if (frame < startFrame) continue;
    
    const age = frame - startFrame;
    const lifetime = 60 + random(seed + 'lifetime') * 60;
    
    if (age > lifetime) continue;

    const angle = (random(seed + 'angle') - 0.5) * spread * (Math.PI / 180);
    const speed = speedRange[0] + random(seed + 'speed') * (speedRange[1] - speedRange[0]);
    
    const particle: Particle = {
      id: i,
      x: emitFrom.x + Math.cos(angle) * speed * age + wind * age,
      y: emitFrom.y + Math.sin(angle) * speed * age + gravity * age * age * 0.5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: sizeRange[0] + random(seed + 'size') * (sizeRange[1] - sizeRange[0]),
      color: colors[Math.floor(random(seed + 'color') * colors.length)],
      lifetime,
    };

    particles.push(particle);
  }

  return (
    <div className={className}>
      <svg width="800" height="600" style={{ overflow: 'visible' }}>
        {particles.map((particle) => {
          const age = frame - (particle.id * 2);
          const lifeProgress = age / particle.lifetime;
          const opacity = fadeOut
            ? interpolate(lifeProgress, [0, 0.7, 1], [1, 1, 0])
            : 1;

          return (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={particle.color}
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
};