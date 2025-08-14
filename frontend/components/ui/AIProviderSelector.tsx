'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Brain, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
  models?: string[];
}

const providers: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 for advanced reasoning',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500',
    available: true,
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude for accuracy & safety',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
    available: true,
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini for multimodal tasks',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-500',
    available: true,
    models: ['gemini-pro', 'gemini-pro-vision'],
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    available: true,
    models: ['mixtral-8x7b', 'llama2-70b'],
  },
];

interface AIProviderSelectorProps {
  selectedProvider?: string;
  onSelect: (providerId: string) => void;
  multiSelect?: boolean;
  selectedProviders?: string[];
  className?: string;
}

export function AIProviderSelector({
  selectedProvider,
  onSelect,
  multiSelect = false,
  selectedProviders = [],
  className,
}: AIProviderSelectorProps) {
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  const isSelected = (providerId: string) => {
    if (multiSelect) {
      return selectedProviders.includes(providerId);
    }
    return selectedProvider === providerId;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">AI Providers</h3>
        {multiSelect && (
          <span className="text-xs text-gray-500">
            {selectedProviders.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredProvider(provider.id)}
            onHoverEnd={() => setHoveredProvider(null)}
            onClick={() => provider.available && onSelect(provider.id)}
            className={cn(
              'relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all duration-300',
              provider.available ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed',
              isSelected(provider.id)
                ? 'border-transparent bg-gradient-to-br from-gray-800 to-gray-900'
                : 'border-gray-800 bg-gray-900/50'
            )}
          >
            {/* Background gradient on selection */}
            <AnimatePresence>
              {isSelected(provider.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-10',
                    provider.color
                  )}
                />
              )}
            </AnimatePresence>

            {/* Top gradient line */}
            <div
              className={cn(
                'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                provider.color,
                isSelected(provider.id) ? 'opacity-100' : 'opacity-0',
                'transition-opacity duration-300'
              )}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    'p-2 rounded-lg bg-gradient-to-br',
                    provider.color,
                    'bg-opacity-20'
                  )}
                >
                  {provider.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200">{provider.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
                  
                  {/* Show models on hover */}
                  <AnimatePresence>
                    {hoveredProvider === provider.id && provider.models && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1"
                      >
                        {provider.models.map((model) => (
                          <span
                            key={model}
                            className="inline-block text-xs px-2 py-0.5 bg-gray-800 rounded-md mr-1"
                          >
                            {model}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected(provider.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn(
                      'w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center',
                      provider.color
                    )}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!provider.available && (
              <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center rounded-xl">
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}