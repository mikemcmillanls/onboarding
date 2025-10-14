'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CohortBadge } from './cohort-badge';
import { MerchantDetail } from './merchant-detail';
import { AdminMerchantRecord, formatTimeElapsed, MerchantStatus } from '@/lib/admin-mock-data';
import { CohortType } from '@/types/merchant-onboarding';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MerchantTableProps {
  merchants: AdminMerchantRecord[];
}

type SortField = 'name' | 'email' | 'currentStep' | 'createdAt' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

export function MerchantTable({ merchants }: MerchantTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cohortFilter, setCohortFilter] = useState<CohortType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('lastActivity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedMerchant, setSelectedMerchant] = useState<AdminMerchantRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and sort merchants
  const filteredMerchants = useMemo(() => {
    let filtered = merchants;

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.merchantName.toLowerCase().includes(lowerQuery) ||
          m.email.toLowerCase().includes(lowerQuery)
      );
    }

    // Cohort filter
    if (cohortFilter !== 'all') {
      filtered = filtered.filter(m => m.cohort === cohortFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.merchantName.toLowerCase();
          bValue = b.merchantName.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'currentStep':
          aValue = a.currentStep;
          bValue = b.currentStep;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'lastActivity':
          aValue = a.lastActivity.getTime();
          bValue = b.lastActivity.getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [merchants, searchQuery, cohortFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (merchant: AdminMerchantRecord) => {
    setSelectedMerchant(merchant);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: MerchantStatus) => {
    const variants = {
      active: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300',
      stalled: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300',
      blocked: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300',
    };

    const labels = {
      active: 'Active',
      stalled: 'Stalled',
      completed: 'Completed',
      blocked: 'Blocked',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {/* Cohort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Cohort: {cohortFilter === 'all' ? 'All' : cohortFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCohortFilter('all')}>
                All Cohorts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCohortFilter('self-serve')}>
                Self-Serve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCohortFilter('assisted')}>
                Assisted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCohortFilter('managed')}>
                Managed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('stalled')}>
                Stalled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                Blocked
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredMerchants.length} of {merchants.length} merchants
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-black font-semibold"
                >
                  Name
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center gap-1 hover:text-black font-semibold"
                >
                  Email
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold">Cohort</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('currentStep')}
                  className="flex items-center gap-1 hover:text-black font-semibold"
                >
                  Current Step
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-black font-semibold"
                >
                  Started
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center gap-1 hover:text-black font-semibold"
                >
                  Last Activity
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No merchants found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredMerchants.map((merchant, index) => (
                <motion.tr
                  key={merchant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => handleRowClick(merchant)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b"
                >
                  <TableCell className="font-medium">{merchant.merchantName}</TableCell>
                  <TableCell className="text-sm text-gray-600">{merchant.email}</TableCell>
                  <TableCell>
                    <CohortBadge cohort={merchant.cohort} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">Step {merchant.currentStep} of 4</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${merchant.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium min-w-[35px]">
                        {merchant.progressPercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(merchant.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatTimeElapsed(merchant.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatTimeElapsed(merchant.lastActivity)}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Merchant Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedMerchant?.merchantName || 'Merchant Details'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedMerchant && <MerchantDetail merchant={selectedMerchant} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
