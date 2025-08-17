import React, { createContext, useContext, useMemo } from 'react';
import { type Theme, defaultTheme } from './tokens';

export interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<Theme>;
}

const mergeTheme = (base: Theme, overrides?: Partial<Theme>): Theme => {
  if (!overrides) return base;
  
  return {
    colors: { ...base.colors, ...overrides.colors },
    typography: {
      fontFamily: { ...base.typography.fontFamily, ...overrides.typography?.fontFamily },
      fontSize: { ...base.typography.fontSize, ...overrides.typography?.fontSize },
      fontWeight: { ...base.typography.fontWeight, ...overrides.typography?.fontWeight },
      lineHeight: { ...base.typography.lineHeight, ...overrides.typography?.lineHeight },
    },
    spacing: { ...base.spacing, ...overrides.spacing },
    radius: { ...base.radius, ...overrides.radius },
  };
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
  const mergedTheme = useMemo(() => mergeTheme(defaultTheme, theme), [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme: mergedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context.theme;
};