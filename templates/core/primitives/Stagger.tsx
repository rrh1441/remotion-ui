import React, { Children, cloneElement, isValidElement } from 'react';
import { useCurrentFrame } from 'remotion';

export interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  startAt?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 5,
  startAt = 0,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  
  const childArray = Children.toArray(children);
  
  return (
    <div className={className} style={style}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }
        
        const childStartAt = startAt + (index * staggerDelay);
        const isVisible = frame >= childStartAt;
        
        return cloneElement(child as React.ReactElement<any>, {
          key: index,
          style: {
            ...(child.props.style || {}),
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden',
          },
          startAt: childStartAt,
        });
      })}
    </div>
  );
};