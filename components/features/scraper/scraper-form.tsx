'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Search, Zap } from 'lucide-react';
import type { TemplateName } from '@/types';

interface ScraperFormProps {
  onSubmit: (data: { user: string; info?: string; template_name?: TemplateName }) => void;
  isLoading?: boolean;
  mode: 'scrape' | 'process';
  onModeChange: (mode: 'scrape' | 'process') => void;
}

const TEMPLATES = [
  { value: 'general', label: 'General' },
  { value: 'tattoo', label: 'Tattoo Studio' },
  { value: 'barber', label: 'Barber Shop' },
  { value: 'gym', label: 'Gym / Fitness' },
  { value: 'transform', label: 'Transform' },
];

export function ScraperForm({ onSubmit, isLoading, mode, onModeChange }: ScraperFormProps) {
  const [user, setUser] = useState('');
  const [info, setInfo] = useState('');
  const [templateName, setTemplateName] = useState<TemplateName>('general');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user.trim()) return;

    onSubmit({
      user: user.trim(),
      info: info.trim() || undefined,
      template_name: mode === 'process' ? templateName : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>
              {mode === 'scrape' ? 'Scrape User' : 'Full Process'}
            </CardTitle>
            <CardDescription>
              {mode === 'scrape' 
                ? 'Extract data from a Linktree profile'
                : 'Scrape, AI processing & Firebase upload'}
            </CardDescription>
          </div>
          <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => onModeChange('scrape')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'scrape'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Search className="h-4 w-4" />
              Scrape
            </button>
            <button
              type="button"
              onClick={() => onModeChange('process')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'process'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Zap className="h-4 w-4" />
              Process
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              User
            </label>
            <Input
              placeholder="username or https://linktr.ee/username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {mode === 'process' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Template
                </label>
                <Select
                  value={templateName}
                  onChange={(val) => setTemplateName(val as TemplateName)}
                  options={TEMPLATES}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Additional Info <span className="text-xs font-normal text-zinc-400">(Optional)</span>
                </label>
                <Textarea
                  placeholder="Additional context for AI processing..."
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            {mode === 'scrape' ? 'Extract Data' : 'Start Processing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
