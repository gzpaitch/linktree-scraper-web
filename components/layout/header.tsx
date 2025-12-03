'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Link2, Instagram, Search, MapPin, Bookmark, Menu, X } from 'lucide-react';
import { useApiState } from '@/hooks';
import { getHealth } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/', label: 'Scraper', icon: Link2 },
  { href: '/instagram', label: 'Instagram', icon: Instagram },
  { href: '/serper', label: 'Serper', icon: Search },
  { href: '/gplaces', label: 'GPlaces', icon: MapPin },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

function ApiStatusIndicator({ compact = false }: { compact?: boolean }) {
  const health = useApiState(getHealth);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      health.execute();
    }
  }, [health]);

  const isOnline = health.data?.status === 'healthy';
  const isOffline = health.error;

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium shrink-0",
      compact ? "px-2 py-1.5" : "px-3 py-1.5"
    )}>
      <span
        className={cn(
          'h-2 w-2 rounded-full shrink-0',
          health.isLoading && 'bg-zinc-400 animate-pulse',
          isOnline && 'bg-green-500',
          isOffline && 'bg-red-500'
        )}
      />
      {!compact && (
        <span className="text-zinc-600 dark:text-zinc-400">
          {health.isLoading ? 'Connecting...' : isOnline ? 'API Online' : 'API Offline'}
        </span>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
            <Link2 className="h-4 w-4 text-white dark:text-zinc-900" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop API Status */}
        <div className="hidden md:block">
          <ApiStatusIndicator />
        </div>

        {/* Mobile: API Status + Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ApiStatusIndicator compact />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <nav className="container py-3 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
