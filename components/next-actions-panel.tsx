'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ONBOARDING_STEPS } from '@/lib/onboarding-data';
import { ArrowRight, CheckCircle2, AlertTriangle, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface NextActionsPanelProps {
  currentStep: number;
  cohort: 'self-serve' | 'assisted' | 'managed';
}

export function NextActionsPanel({ currentStep, cohort }: NextActionsPanelProps) {
  const currentStepData = ONBOARDING_STEPS.find((s) => s.id === currentStep);
  const nextStepData = ONBOARDING_STEPS.find((s) => s.id === currentStep + 1);

  const getActionButtons = () => {
    if (cohort === 'self-serve') {
      return [
        { label: 'Continue Setup', icon: ArrowRight, variant: 'default' as const },
        { label: 'View Guide', icon: MessageSquare, variant: 'outline' as const },
      ];
    } else {
      return [
        { label: 'Schedule Call', icon: Phone, variant: 'default' as const },
        { label: 'Contact Support', icon: MessageSquare, variant: 'outline' as const },
      ];
    }
  };

  const getCriticalWarnings = () => {
    const warnings = [];

    // Check for KYB before hardware purchase
    if (currentStep === 4 || currentStep === 5) {
      const kybCompleted = currentStep > 3;
      if (!kybCompleted) {
        warnings.push({
          message: 'KYB qualification must be completed before hardware purchase',
          severity: 'high' as const,
        });
      }
    }

    // Check for bank verification
    if (currentStep === 9) {
      warnings.push({
        message: 'Payouts are held until bank account verification is complete',
        severity: 'medium' as const,
      });
    }

    return warnings;
  };

  const warnings = getCriticalWarnings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step */}
        {currentStepData && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Current</Badge>
              <span className="text-sm font-semibold">Step {currentStepData.id}</span>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">{currentStepData.title}</h4>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {getActionButtons().map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button key={index} variant={action.variant} size="sm" className="flex-1">
                    <Icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Critical Warnings */}
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {warnings.map((warning, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  warning.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      warning.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      warning.severity === 'high' ? 'text-red-900' : 'text-amber-900'
                    }`}
                  >
                    {warning.message}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Next Step Preview */}
        {nextStepData && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Up Next</span>
            </div>
            <div>
              <p className="font-semibold">
                Step {nextStepData.id}: {nextStepData.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{nextStepData.description}</p>
            </div>
          </div>
        )}

        {/* Support Options */}
        {cohort !== 'self-serve' && (
          <div className="pt-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Your Support Team
            </p>
            <div className="space-y-2 text-sm">
              {cohort === 'assisted' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Executive</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free IC Support</span>
                    <Badge variant="outline">Included</Badge>
                  </div>
                </>
              )}
              {cohort === 'managed' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dedicated AE</span>
                    <Badge variant="outline">Assigned</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Implementation Package</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
