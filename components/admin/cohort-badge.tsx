import { Badge } from '@/components/ui/badge';
import { CohortType } from '@/types/merchant-onboarding';

interface CohortBadgeProps {
  cohort: CohortType;
  className?: string;
}

export function CohortBadge({ cohort, className }: CohortBadgeProps) {
  const variants = {
    'self-serve': {
      label: 'Self-Serve',
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300',
    },
    'assisted': {
      label: 'Assisted',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300',
    },
    'managed': {
      label: 'Managed',
      className: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300',
    },
  };

  const variant = variants[cohort];

  return (
    <Badge variant="outline" className={`${variant.className} ${className || ''}`}>
      {variant.label}
    </Badge>
  );
}
