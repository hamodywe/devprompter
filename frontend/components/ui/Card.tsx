'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'ai';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-background-secondary)]/50 border border-[var(--color-border)]',
      glass: 'glass',
      gradient: 'bg-gradient-to-br from-[var(--color-background-secondary)] to-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)]',
      ai: 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 dark:from-purple-900/20 dark:to-pink-900/20 light:from-purple-500/10 light:to-pink-500/10',
    };

    const Component = hover ? motion.div : 'div';
    const hoverProps = hover ? {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
    } : {};

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-xl p-6 backdrop-blur-sm transition-all duration-200',
          hover && 'cursor-pointer hover:shadow-xl',
          variants[variant],
          className
        )}
        {...hoverProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-bold text-[var(--color-text)]', className)} {...props} />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-[var(--color-text-secondary)] mt-2', className)} {...props} />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 pt-4 border-t border-[var(--color-border)]', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';