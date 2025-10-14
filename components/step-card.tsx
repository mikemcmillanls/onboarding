'use client';

import { OnboardingStep } from '@/types/onboarding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: OnboardingStep;
  isActive: boolean;
  onClick?: () => void;
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
    label: 'Pending',
    badgeVariant: 'secondary' as const,
    animate: false,
  },
  'in-progress': {
    icon: Loader2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'In Progress',
    badgeVariant: 'default' as const,
    animate: true,
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Completed',
    badgeVariant: 'default' as const,
    animate: false,
  },
  blocked: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Blocked',
    badgeVariant: 'destructive' as const,
    animate: false,
  },
};

export function StepCard({ step, isActive, onClick }: StepCardProps) {
  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className={cn('cursor-pointer', isActive && 'ring-2 ring-primary ring-offset-2')}
      onClick={onClick}
    >
      <Card className={cn('h-full transition-all duration-200', isActive && 'shadow-lg')}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn('p-2 rounded-full', config.bgColor)}>
                <Icon
                  className={cn('w-5 h-5', config.color, config.animate && 'animate-spin')}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    STEP {step.id}
                  </span>
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2">{step.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Data Collected:
            </p>
            <ul className="space-y-1">
              {step.dataCollected.slice(0, 3).map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
              {step.dataCollected.length > 3 && (
                <li className="text-sm text-muted-foreground italic">
                  +{step.dataCollected.length - 3} more...
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
