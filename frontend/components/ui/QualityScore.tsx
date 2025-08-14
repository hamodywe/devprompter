'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityScoreProps {
  score: number;
  dimensions?: {
    clarity: number;
    completeness: number;
    technicalAccuracy: number;
    bestPractices: number;
  };
  feedback?: string[];
  className?: string;
}

export function QualityScore({ score, dimensions, feedback, className }: QualityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-cyan-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-5 h-5" />;
    if (score >= 70) return <AlertCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn('flex items-center space-x-2', getScoreColor(score))}>
            {getScoreIcon(score)}
            <span className="text-sm font-medium">Quality Score</span>
          </div>
        </div>
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-3xl font-bold"
          >
            <span className={getScoreColor(score)}>{score}</span>
            <span className="text-gray-500 text-lg">/100</span>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', getScoreGradient(score))}
        />
      </div>

      {/* Dimensions */}
      {dimensions && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Object.entries(dimensions).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg"
            >
              <span className="text-xs text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={cn('text-sm font-semibold', getScoreColor(value))}>
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && feedback.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Improvement Suggestions</span>
          </div>
          <ul className="space-y-1">
            {feedback.slice(0, 3).map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs text-gray-500 pl-6 relative"
              >
                <span className="absolute left-2 top-1">•</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}