export type Theme = 'light' | 'dark';

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundGlass: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  
  // Border colors
  border: string;
  borderSecondary: string;
  borderFocus: string;
  
  // Primary colors (emerald/cyan gradient)
  primary: string;
  primaryHover: string;
  primaryText: string;
  primaryShadow: string;
  
  // Secondary colors (AI purple/pink gradient)
  ai: string;
  aiHover: string;
  aiText: string;
  aiShadow: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  accentText: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Card variants
  cardDefault: string;
  cardGlass: string;
  cardGradient: string;
  cardAi: string;
  
  // Special effects
  glowSm: string;
  glowMd: string;
  glowLg: string;
  shadowGlow: string;
  dropShadowGlow: string;
  
  // Scrollbar
  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  
  // Code syntax
  syntaxBackground: string;
  syntaxText: string;
  
  // Gradient backgrounds
  gradientPrimary: string;
  gradientSecondary: string;
  gradientTertiary: string;
  gradientBackground: string;
}

export const themes: Record<Theme, ThemeColors> = {
  dark: {
    // Enhanced dark mode - Rich, deep colors with better contrast
    background: 'rgb(9, 9, 11)', // Nearly black
    backgroundSecondary: 'rgb(17, 24, 39)', // gray-900
    backgroundTertiary: 'rgb(31, 41, 55)', // gray-800
    backgroundGlass: 'rgba(17, 24, 39, 0.7)',
    
    text: 'rgb(243, 244, 246)', // gray-100
    textSecondary: 'rgb(209, 213, 219)', // gray-300
    textTertiary: 'rgb(156, 163, 175)', // gray-400
    textMuted: 'rgb(107, 114, 128)', // gray-500
    
    border: 'rgb(31, 41, 55)', // gray-800
    borderSecondary: 'rgb(55, 65, 81)', // gray-700
    borderFocus: 'rgb(75, 85, 99)', // gray-600
    
    primary: 'linear-gradient(to right, rgb(16, 185, 129), rgb(6, 182, 212))',
    primaryHover: 'linear-gradient(to right, rgb(5, 150, 105), rgb(8, 145, 178))',
    primaryText: 'rgb(255, 255, 255)',
    primaryShadow: 'rgba(16, 185, 129, 0.25)',
    
    ai: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
    aiHover: 'linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119))',
    aiText: 'rgb(255, 255, 255)',
    aiShadow: 'rgba(168, 85, 247, 0.25)',
    
    accent: 'rgb(59, 130, 246)', // blue-500
    accentHover: 'rgb(37, 99, 235)', // blue-600
    accentText: 'rgb(255, 255, 255)',
    
    success: 'rgb(16, 185, 129)', // emerald-500
    warning: 'rgb(245, 158, 11)', // amber-500
    error: 'rgb(239, 68, 68)', // red-500
    info: 'rgb(59, 130, 246)', // blue-500
    
    cardDefault: 'rgba(17, 24, 39, 0.5)',
    cardGlass: 'rgba(17, 24, 39, 0.7)',
    cardGradient: 'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55))',
    cardAi: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
    
    glowSm: '0 0 10px rgba(16, 185, 129, 0.3)',
    glowMd: '0 0 20px rgba(16, 185, 129, 0.4)',
    glowLg: '0 0 30px rgba(16, 185, 129, 0.5)',
    shadowGlow: '0 0 8px rgba(168, 85, 247, 0.5)',
    dropShadowGlow: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.4))',
    
    scrollbarTrack: 'rgba(17, 24, 39, 0.5)',
    scrollbarThumb: 'rgba(107, 114, 128, 0.5)',
    scrollbarThumbHover: 'rgba(107, 114, 128, 0.7)',
    
    syntaxBackground: '#0d1117',
    syntaxText: '#e6edf3',
    
    gradientPrimary: 'linear-gradient(to right, rgb(16, 185, 129), rgb(6, 182, 212))',
    gradientSecondary: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
    gradientTertiary: 'linear-gradient(to right, rgb(59, 130, 246), rgb(99, 102, 241))',
    gradientBackground: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), transparent, rgba(6, 182, 212, 0.2))',
  },
  
  light: {
    // Clean, modern light mode with subtle colors
    background: 'rgb(255, 255, 255)', // white
    backgroundSecondary: 'rgb(249, 250, 251)', // gray-50
    backgroundTertiary: 'rgb(243, 244, 246)', // gray-100
    backgroundGlass: 'rgba(255, 255, 255, 0.8)',
    
    text: 'rgb(17, 24, 39)', // gray-900
    textSecondary: 'rgb(55, 65, 81)', // gray-700
    textTertiary: 'rgb(75, 85, 99)', // gray-600
    textMuted: 'rgb(107, 114, 128)', // gray-500
    
    border: 'rgb(229, 231, 235)', // gray-200
    borderSecondary: 'rgb(209, 213, 219)', // gray-300
    borderFocus: 'rgb(156, 163, 175)', // gray-400
    
    primary: 'linear-gradient(to right, rgb(16, 185, 129), rgb(6, 182, 212))',
    primaryHover: 'linear-gradient(to right, rgb(5, 150, 105), rgb(8, 145, 178))',
    primaryText: 'rgb(255, 255, 255)',
    primaryShadow: 'rgba(16, 185, 129, 0.15)',
    
    ai: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
    aiHover: 'linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119))',
    aiText: 'rgb(255, 255, 255)',
    aiShadow: 'rgba(168, 85, 247, 0.15)',
    
    accent: 'rgb(59, 130, 246)', // blue-500
    accentHover: 'rgb(37, 99, 235)', // blue-600
    accentText: 'rgb(255, 255, 255)',
    
    success: 'rgb(16, 185, 129)', // emerald-500
    warning: 'rgb(245, 158, 11)', // amber-500
    error: 'rgb(239, 68, 68)', // red-500
    info: 'rgb(59, 130, 246)', // blue-500
    
    cardDefault: 'rgb(255, 255, 255)',
    cardGlass: 'rgba(255, 255, 255, 0.9)',
    cardGradient: 'linear-gradient(to bottom right, rgb(249, 250, 251), rgb(243, 244, 246))',
    cardAi: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), rgba(236, 72, 153, 0.05))',
    
    glowSm: '0 0 10px rgba(16, 185, 129, 0.15)',
    glowMd: '0 0 20px rgba(16, 185, 129, 0.2)',
    glowLg: '0 0 30px rgba(16, 185, 129, 0.25)',
    shadowGlow: '0 0 8px rgba(168, 85, 247, 0.25)',
    dropShadowGlow: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.2))',
    
    scrollbarTrack: 'rgba(243, 244, 246, 0.5)',
    scrollbarThumb: 'rgba(156, 163, 175, 0.5)',
    scrollbarThumbHover: 'rgba(156, 163, 175, 0.7)',
    
    syntaxBackground: '#f6f8fa',
    syntaxText: '#24292f',
    
    gradientPrimary: 'linear-gradient(to right, rgb(16, 185, 129), rgb(6, 182, 212))',
    gradientSecondary: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
    gradientTertiary: 'linear-gradient(to right, rgb(59, 130, 246), rgb(99, 102, 241))',
    gradientBackground: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), transparent, rgba(6, 182, 212, 0.05))',
  },
};

export function getThemeColors(theme: Theme): ThemeColors {
  return themes[theme];
}