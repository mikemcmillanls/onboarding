'use client';

import { CohortType } from '@/types/onboarding';
import { COHORT_CONFIGS } from '@/lib/onboarding-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CohortSelectorProps {
  selectedCohort: CohortType;
  onSelect?: (cohort: CohortType) => void;
  readOnly?: boolean;
}

const cohortIcons = {
  'self-serve': Building2,
  'assisted': Users,
  'managed': TrendingUp,
};

export function CohortSelector({ selectedCohort, onSelect, readOnly = false }: CohortSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COHORT_CONFIGS.map((cohort, index) => {
        const Icon = cohortIcons[cohort.type];
        const isSelected = selectedCohort === cohort.type;

        return (
          <motion.div
            key={cohort.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!readOnly ? { scale: 1.03 } : {}}
            whileTap={!readOnly ? { scale: 0.98 } : {}}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-200 h-full',
                isSelected && 'ring-2 ring-offset-2 shadow-lg',
                !readOnly && 'hover:shadow-md',
                readOnly && 'cursor-default'
              )}
              style={{
                ...(isSelected && {
                  borderColor: cohort.color.replace('bg-', ''),
                }),
              }}
              onClick={() => !readOnly && onSelect?.(cohort.type)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('p-3 rounded-lg', cohort.color, 'bg-opacity-10')}>
                    <Icon className={cn('w-6 h-6', cohort.color.replace('bg-', 'text-'))} />
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{cohort.label}</CardTitle>
                <CardDescription>{cohort.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GTV Range:</span>
                    <span className="font-semibold">{cohort.gtvRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Locations:</span>
                    <span className="font-semibold">{cohort.locationRange}</span>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Selling Plan:
                    </p>
                    <p className="text-sm">{cohort.sellingPlan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Setup Plan:
                    </p>
                    <p className="text-sm">{cohort.setupPlan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
