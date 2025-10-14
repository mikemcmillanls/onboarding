'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
}

export function ProgressIndicator({ completed, total }: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Your Progress
            </h3>
            <p className="text-xs text-gray-600">
              {completed} of {total} tasks completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.div
            key={percentage}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-red-600"
          >
            {percentage}%
          </motion.div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress value={percentage} className="h-2" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Milestone Message */}
      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-xs font-medium text-green-800">
            Congratulations! You&apos;ve completed all setup tasks. You&apos;re ready to start accepting payments!
          </p>
        </motion.div>
      )}

      {percentage >= 50 && percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-xs text-blue-800">
            Great progress! You&apos;re more than halfway there.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
