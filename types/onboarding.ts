export type CohortType = 'self-serve' | 'assisted' | 'managed';

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

export type StageType = 'qualify-leads' | 'buying-experience' | 'guided-setup';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  dataCollected: string[];
  stage: StageType;
  cohortRestrictions?: CohortType[];
}

export interface Stage {
  id: StageType;
  title: string;
  description: string;
  steps: number[];
  color: string;
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  cohort: CohortType;
  currentStep: number;
  completedSteps: number[];
  gtv: number;
  locationCount: number;
  assignedAE?: string;
  assignedIC?: string;
  createdAt: Date;
  lastActivity: Date;
}

export interface CohortConfig {
  type: CohortType;
  label: string;
  description: string;
  gtvRange: string;
  locationRange: string;
  sellingPlan: string;
  setupPlan: string;
  color: string;
}
