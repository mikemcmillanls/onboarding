'use client';

import { useState } from 'react';
import { OnboardingStep, StepStatus } from '@/types/onboarding';
import { STAGES, ONBOARDING_STEPS } from '@/lib/onboarding-data';
import { StageHeader } from './stage-header';
import { StepCard } from './step-card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepId: number) => void;
}

export function OnboardingFlow({ currentStep, completedSteps, onStepClick }: OnboardingFlowProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // Update step statuses based on current progress
  const stepsWithStatus: OnboardingStep[] = ONBOARDING_STEPS.map((step) => ({
    ...step,
    status: completedSteps.includes(step.id)
      ? ('completed' as StepStatus)
      : step.id === currentStep
      ? ('in-progress' as StepStatus)
      : ('pending' as StepStatus),
  }));

  const handleStepClick = (stepId: number) => {
    setSelectedStep(stepId);
    onStepClick?.(stepId);
  };

  return (
    <div className="space-y-12">
      {STAGES.map((stage, stageIndex) => {
        const stageSteps = stepsWithStatus.filter((s) => s.stage === stage.id);
        const isStageActive = stageSteps.some((s) => s.id === currentStep);
        const isStageCompleted = stageSteps.every((s) => completedSteps.includes(s.id));

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stageIndex * 0.2, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stage Header */}
            <StageHeader
              stage={stage}
              isActive={isStageActive}
              isCompleted={isStageCompleted}
              index={stageIndex}
            />

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 md:pl-8">
              {stageSteps.map((step, stepIndex) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stageIndex * 0.2 + stepIndex * 0.1 }}
                >
                  <StepCard
                    step={step}
                    isActive={selectedStep === step.id}
                    onClick={() => handleStepClick(step.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Stage Connector Arrow */}
            {stageIndex < STAGES.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: stageIndex * 0.2 + 0.5 }}
                className="flex justify-center py-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <ArrowRight className="w-6 h-6" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
