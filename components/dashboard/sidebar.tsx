'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingCart,
  Globe,
  BarChart3,
  Tag,
  Wrench,
  Package,
  Users,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Sell', href: '/dashboard/sell', icon: ShoppingCart },
  { name: 'Online', href: '/dashboard/online', icon: Globe },
  { name: 'Sales', href: '/dashboard/sales', icon: BarChart3 },
  { name: 'Reporting', href: '/dashboard/reporting', icon: BarChart3 },
  { name: 'Catalog', href: '/dashboard/catalog', icon: Tag },
  { name: 'Services', href: '/dashboard/services', icon: Wrench },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Setup', href: '/dashboard/setup', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-16 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 mt-14"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[185px] bg-[#F5F5F5] border-r border-gray-200 z-30 transition-transform',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation */}
        <nav className="py-2 overflow-y-auto h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative',
                  isActive
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {/* Blue active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
