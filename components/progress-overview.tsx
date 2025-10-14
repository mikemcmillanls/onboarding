'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ONBOARDING_STEPS, STAGES } from '@/lib/onboarding-data';

interface ProgressOverviewProps {
  currentStep: number;
  completedSteps: number[];
}

export function ProgressOverview({ currentStep, completedSteps }: ProgressOverviewProps) {
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  const currentStepData = ONBOARDING_STEPS.find((s) => s.id === currentStep);
  const currentStage = STAGES.find((stage) => stage.id === currentStepData?.stage);

  const stepsInProgress = 1;
  const pendingSteps = totalSteps - completedSteps.length - stepsInProgress;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Overall Progress</span>
          <Badge variant="outline" className="text-sm font-mono">
            {completedSteps.length}/{totalSteps}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-bold text-lg">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Current Stage */}
        {currentStage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/5 border-2 border-primary"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Current Stage
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${currentStage.color}`} />
              <div>
                <p className="font-bold">{currentStage.title}</p>
                <p className="text-sm text-muted-foreground">{currentStage.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedSteps.length}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">In Progress</span>
            </div>
            <p className="text-2xl font-bold">{stepsInProgress}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-2xl font-bold">{pendingSteps}</p>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Stage Breakdown
          </p>
          {STAGES.map((stage) => {
            const stageSteps = ONBOARDING_STEPS.filter((s) => s.stage === stage.id);
            const completedInStage = stageSteps.filter((s) =>
              completedSteps.includes(s.id)
            ).length;
            const stageProgress = (completedInStage / stageSteps.length) * 100;

            return (
              <div key={stage.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stage.title}</span>
                  <span className="text-xs font-mono">
                    {completedInStage}/{stageSteps.length}
                  </span>
                </div>
                <Progress value={stageProgress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
