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
          'group hover:shadow-md transition-all duration-200 bg-white',
          config.borderColor
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              <StatusIcon className={cn('h-5 w-5', config.iconColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">
                {task.title}
                {task.required && (
                  <span className="ml-1.5 text-red-600 text-xs font-normal">
                    *Required
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {task.description}
              </p>
            </div>

            {/* Action Button */}
            <Link href={task.route} className="flex-shrink-0">
              <Button
                variant={task.status === 'completed' ? 'outline' : 'default'}
                size="sm"
                className={cn(
                  'group-hover:translate-x-0.5 transition-transform h-8 text-xs px-3',
                  task.status === 'not-started' && 'bg-red-600 hover:bg-red-700 text-white',
                  task.status === 'in-progress' && 'bg-blue-600 hover:bg-blue-700 text-white'
                )}
              >
                {config.buttonText}
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
