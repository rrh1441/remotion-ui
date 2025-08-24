import React from 'react';

/**
 * CSS properties that control layout and positioning.
 * These styles are applied to the animation wrapper div.
 */
export const layoutKeys = new Set([
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'zIndex',
  'transform',
  'pointerEvents',
  'inset',
  'insetBlock',
  'insetBlockEnd',
  'insetBlockStart',
  'insetInline',
  'insetInlineEnd',
  'insetInlineStart',
] as const);

/**
 * Splits CSS properties into layout styles (for wrapper) and content styles (for children).
 * 
 * @param style - The CSS properties to split
 * @returns Tuple of [wrapperStyle, childStyle]
 */
export const splitStyles = (style: React.CSSProperties = {}) => {
  const wrapper: React.CSSProperties = {};
  const child: React.CSSProperties = {};
  
  Object.entries(style).forEach(([key, value]) => {
    if (layoutKeys.has(key as any)) {
      (wrapper as any)[key] = value;
    } else {
      (child as any)[key] = value;
    }
  });
  
  return [wrapper, child] as const;
};

/**
 * Development warnings for better developer experience.
 */
export const warnInDev = {
  invalidChildren: (componentName: string) => {
    if (typeof window !== 'undefined') {
      console.warn(
        `${componentName}: children must be a valid React element when not using asChild prop`
      );
    }
  },
  
  conflictingStyles: (componentName: string, property: string) => {
    if (typeof window !== 'undefined') {
      console.warn(
        `${componentName}: "${property}" style provided on both wrapper and child - child value will take precedence`
      );
    }
  },
  
  asChildMultipleChildren: (componentName: string) => {
    if (typeof window !== 'undefined') {
      console.warn(
        `${componentName}: asChild prop requires exactly one child element`
      );
    }
  },
};

/**
 * Merges styles with child element, handling conflicts gracefully.
 */
export const mergeChildStyles = (
  childElement: React.ReactElement,
  newStyles: React.CSSProperties,
  componentName: string
): React.ReactElement => {
  const existingStyle = childElement.props.style || {};
  const mergedStyle = { ...newStyles, ...existingStyle };
  
  // Warn about conflicts in development
  if (typeof window !== 'undefined') {
    Object.keys(newStyles).forEach(key => {
      if ((existingStyle as any)[key] && (existingStyle as any)[key] !== (newStyles as any)[key]) {
        warnInDev.conflictingStyles(componentName, key);
      }
    });
  }
  
  return React.cloneElement(childElement, {
    ...childElement.props,
    style: mergedStyle,
  });
};