# Component Implementation Guide

This guide provides detailed implementation instructions and code examples for building the Lightspeed merchant dashboard components.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Components](#core-components)
3. [Layout Components](#layout-components)
4. [Utility Components](#utility-components)
5. [Hooks & Utilities](#hooks--utilities)
6. [Integration Guide](#integration-guide)

---

## Getting Started

### Prerequisites

Ensure you have these dependencies installed:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-*": "latest"
  }
}
```

### File Structure Setup

Create the following directory structure:

```
/app
  /dashboard
    page.tsx
    layout.tsx
    /verify
      page.tsx
    /pos-setup
      page.tsx
    /hardware
      page.tsx
    /payments
      page.tsx
    /team
      page.tsx
    /import
      page.tsx

/components
  /dashboard
    sidebar.tsx
    sidebar-header.tsx
    sidebar-nav.tsx
    sidebar-footer.tsx
    sidebar-mobile.tsx
    checklist-card.tsx
    checklist-grid.tsx
    progress-indicator.tsx
    hero-section.tsx
    status-badge.tsx
    dashboard-layout.tsx

/hooks
  use-dashboard-data.ts
  use-sidebar-toggle.ts

/lib
  dashboard-helpers.ts

/types
  dashboard.ts
```

---

## Core Components

### 1. Sidebar Component

**File:** `/components/dashboard/sidebar.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';
import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';

interface SidebarProps {
  className?: string;
  businessName?: string;
}

export function Sidebar({ className, businessName = 'Your Business' }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-[280px]',
        'bg-gray-800 border-r border-gray-700',
        'flex flex-col',
        'hidden lg:flex',
        className
      )}
    >
      <SidebarHeader businessName={businessName} />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}
```

### 2. Sidebar Header Component

**File:** `/components/dashboard/sidebar-header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

interface SidebarHeaderProps {
  businessName: string;
}

export function SidebarHeader({ businessName }: SidebarHeaderProps) {
  return (
    <div className="border-b border-gray-700 p-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
          <span className="text-white font-bold text-xl">L</span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-50">Lightspeed</h2>
          <p className="text-xs text-gray-400">POS & Payments</p>
        </div>
      </Link>

      {/* Business Name */}
      <p className="text-lg font-semibold text-gray-50 mb-4">{businessName}</p>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-gray-700 rounded-lg text-sm text-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
}
```

### 3. Sidebar Navigation Component

**File:** `/components/dashboard/sidebar-nav.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Settings,
  CreditCard,
  ShoppingCart,
  DollarSign,
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'POS Setup', href: '/dashboard/pos-setup', icon: Settings },
  { name: 'Hardware & Checkout', href: '/dashboard/hardware', icon: ShoppingCart },
  { name: 'Bank Setup', href: '/dashboard/payments', icon: DollarSign },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-red-600/10 text-red-600 border-r-4 border-red-600'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

### 4. Sidebar Footer Component

**File:** `/components/dashboard/sidebar-footer.tsx`

```typescript
'use client';

import { HelpCircle, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarFooter() {
  return (
    <div className="border-t border-gray-700 p-5 mt-auto">
      <div className="flex items-center justify-center gap-3">
        <button
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg',
            'text-gray-400 hover:bg-gray-700 hover:text-gray-50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-red-600'
          )}
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg relative',
            'text-gray-400 hover:bg-gray-700 hover:text-gray-50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-red-600'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        </button>
        <button
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg',
            'text-gray-400 hover:bg-gray-700 hover:text-gray-50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-red-600'
          )}
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 5. Mobile Sidebar Component

**File:** `/components/dashboard/sidebar-mobile.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarMobileProps {
  businessName: string;
}

export function SidebarMobile({ businessName }: SidebarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold">Lightspeed</span>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px]"
            >
              <Sidebar businessName={businessName} className="block" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-50" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

### 6. Checklist Card Component

**File:** `/components/dashboard/checklist-card.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { Button } from '@/components/ui/button';
import type { ChecklistTaskStatus } from '@/types/merchant-onboarding';

interface ChecklistCardProps {
  title: string;
  description: string;
  status: ChecklistTaskStatus | 'disabled';
  required: boolean;
  route: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ChecklistCard({
  title,
  description,
  status,
  required,
  route,
  icon,
  className,
}: ChecklistCardProps) {
  const router = useRouter();
  const isDisabled = status === 'disabled';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';

  const handleClick = () => {
    if (!isDisabled && !isCompleted) {
      router.push(route);
    }
  };

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (isInProgress) return <Clock className="w-6 h-6 text-blue-600" />;
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getButtonText = () => {
    if (isCompleted) return 'Completed';
    if (isInProgress) return 'Continue';
    return 'Start';
  };

  return (
    <motion.article
      whileHover={!isDisabled && !isCompleted ? { y: -2 } : {}}
      className={cn(
        'bg-white border rounded-lg p-6 shadow-sm transition-all',
        !isDisabled && !isCompleted && 'hover:shadow-md hover:border-red-600 cursor-pointer',
        isCompleted && 'bg-gradient-to-r from-green-50 to-white border-green-500',
        isDisabled && 'opacity-60 cursor-not-allowed',
        isInProgress && 'border-l-4 border-l-blue-600',
        className
      )}
      aria-labelledby={`task-title-${title}`}
      aria-describedby={`task-desc-${title}`}
    >
      <div className="flex gap-5 items-start">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0',
            isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          )}
        >
          {icon || getStatusIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              id={`task-title-${title}`}
              className="text-lg font-semibold text-gray-900 leading-tight"
            >
              {title}
            </h3>
            <StatusBadge required={required} completed={isCompleted} />
          </div>

          {/* Description */}
          <p
            id={`task-desc-${title}`}
            className="text-base text-gray-600 mb-4 leading-relaxed"
          >
            {description}
          </p>

          {/* Action Button */}
          <Button
            onClick={handleClick}
            disabled={isDisabled || isCompleted}
            variant={isCompleted ? 'outline' : 'default'}
            className={cn(
              'min-h-[44px]',
              !isCompleted && 'bg-red-600 hover:bg-red-700 text-white'
            )}
            aria-label={`${getButtonText()} ${title}`}
          >
            {isCompleted && <CheckCircle2 className="w-4 h-4 mr-2" />}
            {getButtonText()}
          </Button>

          {/* Already have hardware link (optional) */}
          {title === 'Hardware Selection' && !isCompleted && (
            <button className="mt-3 text-sm text-red-600 hover:underline">
              Already have hardware?
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
```

### 7. Status Badge Component

**File:** `/components/dashboard/status-badge.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  required: boolean;
  completed: boolean;
  className?: string;
}

export function StatusBadge({ required, completed, className }: StatusBadgeProps) {
  if (completed) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide',
          'bg-green-100 text-green-700',
          className
        )}
        role="status"
        aria-label="Task completed"
      >
        <span>✓</span>
        Completed
      </span>
    );
  }

  if (required) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide',
          'bg-red-600 text-white',
          className
        )}
        role="status"
        aria-label="Required task"
      >
        Required
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide',
        'bg-gray-100 text-gray-600 border border-gray-300',
        className
      )}
      role="status"
      aria-label="Optional task"
    >
      Optional
    </span>
  );
}
```

### 8. Progress Indicator Component

**File:** `/components/dashboard/progress-indicator.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  percentage: number;
  className?: string;
}

export function ProgressIndicator({
  completed,
  total,
  percentage,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn('mb-8', className)} role="region" aria-label="Onboarding progress">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-semibold text-gray-900">
          {completed} of {total} tasks completed
        </p>
        <p className="text-2xl font-bold text-red-600">{percentage}%</p>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}% complete`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </div>
  );
}
```

### 9. Hero Section Component

**File:** `/components/dashboard/hero-section.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeroSection({ title, description, className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'bg-gray-900 text-white rounded-xl p-12 mb-8',
        className
      )}
      aria-label="Dashboard header"
    >
      <h1 className="text-4xl font-bold leading-tight mb-3 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </section>
  );
}
```

### 10. Checklist Grid Component

**File:** `/components/dashboard/checklist-grid.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChecklistGridProps {
  children: React.ReactNode;
  className?: string;
}

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ChecklistGrid({ children, className }: ChecklistGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid gap-4 md:grid-cols-1 max-w-4xl',
        className
      )}
      role="list"
      aria-label="Onboarding checklist"
    >
      {children}
    </motion.div>
  );
}
```

---

## Layout Components

### Dashboard Layout Component

**File:** `/components/dashboard/dashboard-layout.tsx`

```typescript
'use client';

import { Sidebar } from './sidebar';
import { SidebarMobile } from './sidebar-mobile';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessName?: string;
  className?: string;
}

export function DashboardLayout({
  children,
  businessName = 'Your Business',
  className,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar businessName={businessName} />

      {/* Mobile Sidebar */}
      <SidebarMobile businessName={businessName} />

      {/* Main Content */}
      <main
        id="main-content"
        className={cn(
          'lg:pl-[280px] pt-16 lg:pt-0',
          'min-h-screen',
          className
        )}
      >
        <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

## Hooks & Utilities

### Dashboard Data Hook

**File:** `/hooks/use-dashboard-data.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { ChecklistTask, ChecklistTaskStatus } from '@/types/merchant-onboarding';
import { Building2, Smartphone, ShoppingCart, CreditCard, Users, Database } from 'lucide-react';

export function useDashboardData() {
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessName, setBusinessName] = useState('Your Business');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Load merchant data from localStorage or API
        const prequalData = localStorage.getItem('prequalificationData');

        if (prequalData) {
          const data = JSON.parse(prequalData);
          setBusinessName(data.businessName || 'Your Business');
        }

        // Load existing merchant state
        const merchantEmail = localStorage.getItem('merchantEmail');
        let merchantState = null;

        if (merchantEmail) {
          const response = await fetch(`/api/merchants/${merchantEmail}`);
          if (response.ok) {
            merchantState = await response.json();
          }
        }

        // Construct checklist based on completion state
        const checklistTasks: ChecklistTask[] = [
          {
            id: 'business-verification',
            title: 'Business Verification',
            description: 'Complete KYB verification to accept payments',
            status: determineStatus(merchantState, 'kybStatus'),
            required: true,
            route: '/dashboard/verify',
            icon: 'Building2',
          },
          {
            id: 'pos-configuration',
            title: 'POS Configuration',
            description: 'Set up your point of sale system and locations',
            status: determineStatus(merchantState, 'posSetupData'),
            required: true,
            route: '/dashboard/pos-setup',
            icon: 'Smartphone',
          },
          {
            id: 'hardware-selection',
            title: 'Hardware Selection',
            description: 'Choose and order your POS hardware',
            status: determineStatus(merchantState, 'checkoutData', 'kybStatus'),
            required: true,
            route: '/dashboard/hardware',
            icon: 'ShoppingCart',
          },
          {
            id: 'payment-setup',
            title: 'Payment Setup',
            description: 'Configure payment processing and bank account',
            status: determineStatus(merchantState, 'bankAccountData', 'kybStatus'),
            required: true,
            route: '/dashboard/payments',
            icon: 'CreditCard',
          },
          {
            id: 'team-setup',
            title: 'Team Setup',
            description: 'Add team members and set permissions',
            status: 'not-started' as ChecklistTaskStatus,
            required: false,
            route: '/dashboard/team',
            icon: 'Users',
          },
          {
            id: 'import-data',
            title: 'Import Data',
            description: 'Import products, customers, and inventory',
            status: determineStatus(merchantState, 'dataImported', 'posSetupData'),
            required: false,
            route: '/dashboard/import',
            icon: 'Database',
          },
        ];

        setTasks(checklistTasks);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const progress = {
    completed: tasks.filter((t) => t.status === 'completed').length,
    total: tasks.filter((t) => t.required).length,
    percentage: Math.round(
      (tasks.filter((t) => t.status === 'completed' && t.required).length /
        tasks.filter((t) => t.required).length) *
        100
    ),
  };

  return { tasks, progress, isLoading, businessName };
}

function determineStatus(
  merchantState: any,
  field: string,
  dependency?: string
): ChecklistTaskStatus | 'disabled' {
  if (!merchantState) return 'not-started';

  // Check dependency first
  if (dependency) {
    if (dependency === 'kybStatus' && merchantState.kybStatus !== 'approved') {
      return 'disabled';
    }
    if (dependency === 'posSetupData' && !merchantState.posSetupData) {
      return 'disabled';
    }
  }

  // Check field status
  if (field === 'kybStatus' || field === 'kycStatus') {
    if (merchantState[field] === 'approved') return 'completed';
    if (merchantState[field] === 'pending') return 'in-progress';
    return 'not-started';
  }

  // Check if data exists
  if (merchantState[field] && Object.keys(merchantState[field]).length > 0) {
    return 'completed';
  }

  return 'not-started';
}
```

### Dashboard Helpers

**File:** `/lib/dashboard-helpers.ts`

```typescript
import type { ChecklistTask } from '@/types/merchant-onboarding';

export function calculateProgress(tasks: ChecklistTask[]) {
  const requiredTasks = tasks.filter((t) => t.required);
  const completedRequired = requiredTasks.filter((t) => t.status === 'completed');

  return {
    completed: completedRequired.length,
    total: requiredTasks.length,
    percentage: Math.round((completedRequired.length / requiredTasks.length) * 100),
  };
}

export function getNextTask(tasks: ChecklistTask[]): ChecklistTask | null {
  const incompleteTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'disabled'
  );

  if (incompleteTasks.length === 0) return null;

  // Prioritize required tasks
  const nextRequired = incompleteTasks.find((t) => t.required);
  return nextRequired || incompleteTasks[0];
}

export function canStartTask(task: ChecklistTask, tasks: ChecklistTask[]): boolean {
  if (task.status === 'disabled') return false;
  if (task.status === 'completed') return false;

  // Check dependencies (example: hardware requires business verification)
  if (task.id === 'hardware-selection' || task.id === 'payment-setup') {
    const businessVerification = tasks.find((t) => t.id === 'business-verification');
    if (businessVerification && businessVerification.status !== 'completed') {
      return false;
    }
  }

  if (task.id === 'import-data') {
    const posSetup = tasks.find((t) => t.id === 'pos-configuration');
    if (posSetup && posSetup.status !== 'completed') {
      return false;
    }
  }

  return true;
}
```

---

## Integration Guide

### Main Dashboard Page

**File:** `/app/dashboard/page.tsx`

```typescript
'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { HeroSection } from '@/components/dashboard/hero-section';
import { ProgressIndicator } from '@/components/dashboard/progress-indicator';
import { ChecklistGrid } from '@/components/dashboard/checklist-grid';
import { ChecklistCard } from '@/components/dashboard/checklist-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function DashboardPage() {
  const { tasks, progress, isLoading, businessName } = useDashboardData();

  if (isLoading) {
    return (
      <DashboardLayout businessName={businessName}>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout businessName={businessName}>
      <HeroSection
        title="Get set up to check out customers"
        description="Complete these tasks to start accepting payments and managing your business with Lightspeed."
      />

      <ProgressIndicator
        completed={progress.completed}
        total={progress.total}
        percentage={progress.percentage}
      />

      <ChecklistGrid>
        {tasks.map((task, index) => {
          // @ts-ignore - Dynamic icon lookup
          const IconComponent = Icons[task.icon];

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChecklistCard
                title={task.title}
                description={task.description}
                status={task.status}
                required={task.required}
                route={task.route}
                icon={IconComponent ? <IconComponent className="w-6 h-6" /> : undefined}
              />
            </motion.div>
          );
        })}
      </ChecklistGrid>
    </DashboardLayout>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-gray-900 rounded-xl p-12">
        <div className="h-10 bg-gray-800 rounded w-2/3 mb-3" />
        <div className="h-6 bg-gray-800 rounded w-1/2" />
      </div>

      {/* Progress Skeleton */}
      <div>
        <div className="flex justify-between mb-3">
          <div className="h-6 bg-gray-300 rounded w-40" />
          <div className="h-8 bg-gray-300 rounded w-16" />
        </div>
        <div className="h-2 bg-gray-300 rounded-full" />
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-6">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard Layout Wrapper

**File:** `/app/dashboard/layout.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Lightspeed Onboarding',
  description: 'Complete your onboarding tasks to start using Lightspeed POS and Payments',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

### Update Get Started Redirect

The `/app/get-started/page.tsx` file has already been updated to redirect to `/dashboard` instead of `/onboarding`. Verify this line exists:

```typescript
// Line 49 in /app/get-started/page.tsx
router.push('/dashboard');
```

---

## Next Steps

1. **Install dependencies** (if not already installed):
   ```bash
   npm install lucide-react framer-motion
   ```

2. **Create all component files** following the structure above

3. **Test each component individually** before integration

4. **Implement responsive behavior** and test on multiple devices

5. **Add accessibility features** and test with screen readers

6. **Performance optimization**: Lazy load components, optimize images

7. **Error handling**: Add error boundaries and loading states

8. **Analytics**: Track user interactions and task completion

---

## Troubleshooting

### Common Issues

**Issue: Sidebar not showing on desktop**
- Solution: Ensure `lg:flex` class is applied to sidebar
- Check z-index conflicts

**Issue: Mobile sidebar not sliding in**
- Solution: Verify Framer Motion is installed
- Check for conflicting CSS transitions

**Issue: Progress bar not animating**
- Solution: Ensure Framer Motion is properly configured
- Check percentage value is valid (0-100)

**Issue: Cards not routing correctly**
- Solution: Verify routes exist in `/app/dashboard/`
- Check Next.js App Router configuration

---

## Performance Tips

1. **Lazy load task pages**: Use Next.js dynamic imports
2. **Optimize icons**: Use `lucide-react` tree-shaking
3. **Reduce animation complexity** on low-end devices
4. **Cache merchant data** appropriately
5. **Use React.memo** for checklist cards to prevent unnecessary re-renders

---

## Accessibility Checklist

- [ ] All interactive elements have proper ARIA labels
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announcements are appropriate
- [ ] Touch targets are at least 44x44px
- [ ] Skip to main content link exists
- [ ] Proper heading hierarchy (h1 → h2 → h3)

---

**Version:** 1.0
**Last Updated:** 2025-10-10
