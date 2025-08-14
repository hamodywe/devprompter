'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeColors, getThemeColors } from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
      applyThemeToDocument(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setThemeState(defaultTheme);
      applyThemeToDocument(defaultTheme);
    }
  }, []);

  // Apply theme to document root
  const applyThemeToDocument = (newTheme: Theme) => {
    const colors = getThemeColors(newTheme);
    const root = document.documentElement;
    
    // Set CSS variables for theme colors
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
    root.style.setProperty('--color-background-tertiary', colors.backgroundTertiary);
    root.style.setProperty('--color-background-glass', colors.backgroundGlass);
    
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-tertiary', colors.textTertiary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-secondary', colors.borderSecondary);
    root.style.setProperty('--color-border-focus', colors.borderFocus);
    
    root.style.setProperty('--color-scrollbar-track', colors.scrollbarTrack);
    root.style.setProperty('--color-scrollbar-thumb', colors.scrollbarThumb);
    root.style.setProperty('--color-scrollbar-thumb-hover', colors.scrollbarThumbHover);
    
    // Add theme class to document
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeToDocument(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const colors = getThemeColors(theme);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}