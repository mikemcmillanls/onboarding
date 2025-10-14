'use client';

import { Stage } from '@/types/onboarding';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageHeaderProps {
  stage: Stage;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

export function StageHeader({ stage, isActive, isCompleted, index }: StageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-6 rounded-xl border-2 transition-all duration-300',
        isActive && 'border-primary shadow-lg bg-primary/5',
        !isActive && isCompleted && 'border-green-500 bg-green-50/50',
        !isActive && !isCompleted && 'border-gray-200 bg-gray-50/50'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                isCompleted ? 'bg-green-500' : stage.color
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <h3 className="text-xl font-bold">{stage.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground ml-13">{stage.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Steps {stage.steps[0]}-{stage.steps[stage.steps.length - 1]}
          </span>
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-stage"
          className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
}
