'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChecklistTask } from '@/types/merchant-onboarding';
import { cn } from '@/lib/utils';

interface ChecklistCardProps {
  task: ChecklistTask;
  index: number;
}

export function ChecklistCard({ task, index }: ChecklistCardProps) {
  const statusConfig = {
    'not-started': {
      icon: Circle,
      buttonText: 'Start',
      iconColor: 'text-gray-400',
      borderColor: 'border-l-4 border-gray-300',
    },
    'in-progress': {
      icon: Clock,
      buttonText: 'Continue',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-4 border-blue-600',
    },
    completed: {
      icon: CheckCircle2,
      buttonText: 'Review',
      iconColor: 'text-green-600',
      borderColor: 'border-l-4 border-green-600',
    },
  };

  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      <Card
        className={cn(
          'group hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 rounded-xl overflow-hidden',
          task.status === 'completed' && 'bg-gray-50'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="flex-shrink-0 pt-1">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center',
                task.status === 'not-started' && 'bg-gray-100',
                task.status === 'in-progress' && 'bg-blue-50',
                task.status === 'completed' && 'bg-green-50'
              )}>
                <StatusIcon className={cn('h-4 w-4', config.iconColor)} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {task.timeEstimate && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                        {task.timeEstimate}
                      </span>
                    )}
                    {task.badgeText && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium',
                          task.required
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        )}
                      >
                        {task.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Action Button */}
                <Link href={task.route} className="flex-shrink-0">
                  <Button
                    variant={task.status === 'completed' ? 'outline' : 'default'}
                    size="default"
                    className={cn(
                      'group-hover:translate-x-1 transition-transform font-medium',
                      task.status === 'not-started' && 'bg-red-600 hover:bg-red-700 text-white',
                      task.status === 'in-progress' && 'bg-blue-600 hover:bg-blue-700 text-white'
                    )}
                  >
                    {config.buttonText}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
