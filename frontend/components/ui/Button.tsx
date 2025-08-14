'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25',
      secondary: 'bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] border border-[var(--color-border)]',
      ghost: 'bg-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-secondary)]/50',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ai: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)]',
          variant === 'primary' && 'focus:ring-emerald-500',
          variant === 'secondary' && 'focus:ring-gray-600',
          variant === 'ghost' && 'focus:ring-gray-700',
          variant === 'danger' && 'focus:ring-red-500',
          variant === 'ai' && 'focus:ring-purple-500',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="loading-dots flex space-x-1">
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
          </div>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';