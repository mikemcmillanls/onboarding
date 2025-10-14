'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: 1 | 2 | 3 | 4;
  className?: string;
}

const steps = [
  { number: 1, label: 'Sign Up & Tell Us About Your Business' },
  { number: 2, label: 'Set Up Your POS & Payments' },
  { number: 3, label: 'Complete Purchase & Verification' },
  { number: 4, label: 'Get Everything Ready' },
];

export function StepProgress({ currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile View - Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of 4
          </span>
          <span className="text-sm font-medium">
            {Math.round((currentStep / 4) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm mt-2 font-medium">{steps[currentStep - 1].label}</p>
      </div>

      {/* Desktop View - Full */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: currentStep === 1
                  ? '0%'
                  : currentStep === 2
                  ? '33.33%'
                  : currentStep === 3
                  ? '66.66%'
                  : '100%'
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{ width: '25%' }}
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                      isCompleted &&
                        'bg-primary border-transparent',
                      isCurrent &&
                        'border-primary bg-white ring-4 ring-primary/20 shadow-lg',
                      isUpcoming && 'border-gray-300 bg-white'
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isCurrent && 'text-primary',
                          isUpcoming && 'text-gray-400'
                        )}
                      >
                        {step.number}
                      </span>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                    className="mt-3 text-center"
                  >
                    <p
                      className={cn(
                        'text-sm font-medium leading-tight',
                        isCurrent && 'text-foreground',
                        (isCompleted || isUpcoming) && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
