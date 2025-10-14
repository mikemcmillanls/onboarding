'use client';

import { MerchantProfile } from '@/types/onboarding';
import { COHORT_CONFIGS } from '@/lib/onboarding-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, DollarSign, User, Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MerchantInfoPanelProps {
  merchant: MerchantProfile;
}

export function MerchantInfoPanel({ merchant }: MerchantInfoPanelProps) {
  const cohortConfig = COHORT_CONFIGS.find((c) => c.type === merchant.cohort);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{merchant.businessName}</CardTitle>
            <p className="text-sm text-muted-foreground">Merchant ID: {merchant.id}</p>
          </div>
          {cohortConfig && (
            <Badge
              variant="outline"
              className={cn('text-sm font-semibold', cohortConfig.color, 'text-white')}
            >
              {cohortConfig.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Annual GTV</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(merchant.gtv)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Locations</span>
            </div>
            <p className="text-xl font-bold">{merchant.locationCount}</p>
          </div>
        </div>

        <Separator />

        {/* Cohort Details */}
        {cohortConfig && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Cohort Configuration
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Selling Plan</p>
                  <p className="text-muted-foreground">{cohortConfig.sellingPlan}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Setup Plan</p>
                  <p className="text-muted-foreground">{cohortConfig.setupPlan}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Team Assignment */}
        {(merchant.assignedAE || merchant.assignedIC) && (
          <>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Team Assignment
              </p>
              {merchant.assignedAE && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Executive:</span>
                  <span className="font-semibold">{merchant.assignedAE}</span>
                </div>
              )}
              {merchant.assignedIC && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Implementation Consultant:</span>
                  <span className="font-semibold">{merchant.assignedIC}</span>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Timeline */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Timeline
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
              </div>
              <span className="font-medium">{formatDate(merchant.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Activity:</span>
              </div>
              <span className="font-medium">{getTimeSince(merchant.lastActivity)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
