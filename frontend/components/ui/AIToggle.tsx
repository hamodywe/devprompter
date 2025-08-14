'use client';

import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function AIToggle({ enabled, onToggle, className }: AIToggleProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={cn('flex items-center space-x-3', className)}>
            <label htmlFor="ai-mode" className="text-sm font-medium text-gray-300">
              AI Enhancement
            </label>
            <Switch.Root
              id="ai-mode"
              checked={enabled}
              onCheckedChange={onToggle}
              className={cn(
                'relative w-14 h-7 rounded-full transition-all duration-300',
                enabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
              )}
            >
              <Switch.Thumb
                className={cn(
                  'block w-5 h-5 bg-white rounded-full transition-transform duration-300',
                  'shadow-lg transform',
                  enabled ? 'translate-x-8' : 'translate-x-1'
                )}
              >
                <AnimatePresence mode="wait">
                  {enabled && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Switch.Thumb>
            </Switch.Root>
            <AnimatePresence>
              {enabled && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-1 text-purple-400"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-semibold">ACTIVE</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg text-sm max-w-xs"
            sideOffset={5}
          >
            {enabled 
              ? 'AI enhancement is active. Your prompts will be optimized using multiple AI providers for maximum quality.'
              : 'Enable AI enhancement to optimize your prompts with GPT-4, Claude, and other AI models.'}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}