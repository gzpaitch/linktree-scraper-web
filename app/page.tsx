'use client';

import { useState } from 'react';
import { ScraperForm, ScraperResult } from '@/components/features';
import { useApiState } from '@/hooks';
import { scrapeUser, processUserComplete } from '@/lib/api';
import type { ScrapeUserRequest, ScrapeUserResponse, ProcessCompleteResponse } from '@/types';
import { Search, Zap, AlertCircle } from 'lucide-react';

type Mode = 'scrape' | 'process';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('process');
  const [result, setResult] = useState<ScrapeUserResponse | ProcessCompleteResponse | null>(null);

  const scrapeApi = useApiState(scrapeUser, {
    onSuccess: (data) => setResult(data),
  });

  const processApi = useApiState(processUserComplete, {
    onSuccess: (data) => setResult(data),
  });

  const isLoading = scrapeApi.isLoading || processApi.isLoading;
  const error = scrapeApi.error || processApi.error;

  const handleSubmit = (data: ScrapeUserRequest) => {
    setResult(null);
    if (mode === 'scrape') {
      scrapeApi.execute(data);
    } else {
      processApi.execute(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <button
          onClick={() => setMode('scrape')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'scrape'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" />
          Scrape Only
        </button>
        <button
          onClick={() => setMode('process')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'process'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4" />
          Full Process
        </button>
      </div>

      <ScraperForm
        mode={mode}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error.message}</p>
          </div>
        </div>
      )}

      {result && <ScraperResult result={result} />}
    </div>
  );
}
