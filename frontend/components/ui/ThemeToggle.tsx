'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ className, size = 'md', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizes = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8',
  };

  const ballSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const translations = {
    sm: theme === 'dark' ? 'translateX(24px)' : 'translateX(2px)',
    md: theme === 'dark' ? 'translateX(28px)' : 'translateX(2px)',
    lg: theme === 'dark' ? 'translateX(32px)' : 'translateX(2px)',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex items-center rounded-full p-0.5 transition-all duration-300',
          'bg-gradient-to-r',
          theme === 'dark' 
            ? 'from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25' 
            : 'from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/25',
          sizes[size]
        )}
        aria-label="Toggle theme"
      >
        <motion.div
          className={cn(
            'absolute rounded-full bg-white flex items-center justify-center shadow-md',
            ballSizes[size]
          )}
          initial={false}
          animate={{
            transform: translations[size],
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          {theme === 'dark' ? (
            <Moon className={cn('text-purple-600', iconSizes[size])} />
          ) : (
            <Sun className={cn('text-yellow-600', iconSizes[size])} />
          )}
        </motion.div>
        
        <span className="sr-only">Toggle theme</span>
        
        {/* Background icons */}
        <div className="flex items-center justify-between w-full px-1">
          <Sun className={cn('text-white/30', iconSizes[size])} />
          <Moon className={cn('text-white/30', iconSizes[size])} />
        </div>
      </button>
    </div>
  );
}